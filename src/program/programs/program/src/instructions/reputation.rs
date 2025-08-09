use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, MintTo, Transfer},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct MintReputationTokens<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
        has_one = authority,
        has_one = reputation_mint
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        seeds = [b"reputation_mint"],
        bump
    )]
    pub reputation_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = reputation_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = authority,
        space = ReputationState::LEN,
        seeds = [b"reputation_state", user.key().as_ref()],
        bump
    )]
    pub reputation_state: Account<'info, ReputationState>,
    
    /// CHECK: This is the user who will receive reputation tokens
    pub user: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SlashReputationTokens<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
        has_one = authority,
        has_one = reputation_mint
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        seeds = [b"reputation_mint"],
        bump
    )]
    pub reputation_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"reputation_state", user.key().as_ref()],
        bump
    )]
    pub reputation_state: Account<'info, ReputationState>,

    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn mint_tokens(ctx: Context<MintReputationTokens>, amount: u64, reason: String) -> Result<()> {
    let reputation_state = &mut ctx.accounts.reputation_state;
    let clock = Clock::get()?;
    
    // Validate amount
    require!(amount > 0, SkillPassError::InvalidAmount);
    
    // Check max supply
    let current_supply = ctx.accounts.reputation_mint.supply;
    require!(
        current_supply + amount <= MAX_REPUTATION_SUPPLY,
        SkillPassError::MaxReputationSupplyExceeded
    );
    
    // Mint tokens to user
    let cpi_accounts = MintTo {
        mint: ctx.accounts.reputation_mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.program_state.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[&[b"program_state", &[ctx.accounts.program_state.bump]]];
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        signer_seeds,
    );
    
    anchor_spl::token::mint_to(cpi_ctx, amount)?;
    
    // Update reputation state
    reputation_state.user = ctx.accounts.user.key();
    reputation_state.reputation_score += amount;
    reputation_state.last_activity = clock.unix_timestamp;
    reputation_state.total_earned += amount;
    
    msg!("Minted {} reputation tokens to {}", amount, ctx.accounts.user.key());
    msg!("Reason: {}", reason);
    msg!("New reputation score: {}", reputation_state.reputation_score);
    msg!("New token supply: {}", ctx.accounts.reputation_mint.supply + amount);
    
    Ok(())
}

pub fn slash_tokens(ctx: Context<SlashReputationTokens>, amount: u64, reason: String) -> Result<()> {
    let reputation_state = &mut ctx.accounts.reputation_state;
    
    // Validate amount
    require!(amount > 0, SkillPassError::InvalidAmount);
    require!(
        ctx.accounts.user_token_account.amount >= amount,
        SkillPassError::InsufficientReputationTokens
    );
    
    // Transfer tokens from user to treasury (effectively slashing)
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_token_account.to_account_info(),
        to: ctx.accounts.treasury_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    anchor_spl::token::transfer(cpi_ctx, amount)?;
    
    // Update reputation state
    if reputation_state.reputation_score >= amount {
        reputation_state.reputation_score -= amount;
    } else {
        reputation_state.reputation_score = 0;
    }
    
    reputation_state.total_slashed += amount;
    
    msg!("Slashed {} reputation tokens from {}", amount, ctx.accounts.user.key());
    msg!("Reason: {}", reason);
    msg!("New reputation score: {}", reputation_state.reputation_score);
    
    Ok(())
} 