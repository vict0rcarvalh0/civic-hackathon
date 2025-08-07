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
        mint::decimals = 9,
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
        seeds = [b"skill_mint"],
        bump
    )]
    pub skill_mint: Account<'info, Mint>,
    
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
    let program_state = &mut ctx.accounts.program_state;
    let treasury = &mut ctx.accounts.treasury;
    
    // Initialize program state
    program_state.authority = ctx.accounts.authority.key();
    program_state.reputation_mint = ctx.accounts.reputation_mint.key();
    program_state.skill_mint = ctx.accounts.skill_mint.key();
    program_state.treasury = ctx.accounts.treasury.key();
    program_state.total_skills = 0;
    program_state.total_investments = 0;
    program_state.total_revenue = 0;
    program_state.bump = *ctx.bumps.get("program_state").unwrap();
    
    // Initialize treasury
    treasury.authority = ctx.accounts.authority.key();
    treasury.total_fees = 0;
    treasury.total_distributed = 0;
    treasury.bump = *ctx.bumps.get("treasury").unwrap();
    
    msg!("SkillPass program initialized successfully!");
    msg!("Reputation Mint: {}", ctx.accounts.reputation_mint.key());
    msg!("Skill Mint: {}", ctx.accounts.skill_mint.key());
    msg!("Treasury: {}", ctx.accounts.treasury.key());
    
    Ok(())
} 