use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use crate::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = ProgramState::LEN,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = authority,
        mint::decimals = REPUTATION_DECIMALS,
        mint::authority = program_state,
        seeds = [b"reputation_mint"],
        bump
    )]
    pub reputation_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = program_state,
        seeds = [b"skill_collection_mint"],
        bump
    )]
    pub skill_collection_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        space = Treasury::LEN,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(
        init,
        payer = authority,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let _clock = Clock::get()?;
    
    // Get keys before any borrowing
    let treasury_key = ctx.accounts.treasury.key();
    let authority_key = ctx.accounts.authority.key();
    let reputation_mint_key = ctx.accounts.reputation_mint.key();
    let skill_collection_mint_key = ctx.accounts.skill_collection_mint.key();
    let treasury_token_account_key = ctx.accounts.treasury_token_account.key();
    
    // Initialize program state
    let program_state = &mut ctx.accounts.program_state;
    program_state.authority = authority_key;
    program_state.total_skills = 0;
    program_state.total_investments = 0;
    program_state.total_revenue = 0;
    program_state.reputation_mint = reputation_mint_key;
    program_state.skill_collection_mint = skill_collection_mint_key;
    program_state.treasury = treasury_key;
    program_state.bump = ctx.bumps.program_state;
    
    // Initialize treasury
    let treasury = &mut ctx.accounts.treasury;
    treasury.authority = authority_key;
    treasury.treasury_token_account = treasury_token_account_key;
    treasury.total_fees = 0;
    treasury.total_distributed = 0;
    treasury.bump = ctx.bumps.treasury;
    
    msg!("SkillPass program initialized successfully!");
    msg!("Authority: {}", authority_key);
    msg!("Reputation Mint: {}", reputation_mint_key);
    msg!("Skill Collection Mint: {}", skill_collection_mint_key);
    msg!("Treasury: {}", treasury_key);
    msg!("Treasury Token Account: {}", treasury_token_account_key);
    
    Ok(())
} 