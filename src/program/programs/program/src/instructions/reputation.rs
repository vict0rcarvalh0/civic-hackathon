use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct MintReputationTokens<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
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
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SlashReputationTokens<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        mut,
        seeds = [b"reputation_state", user.key().as_ref()],
        bump
    )]
    pub reputation_state: Account<'info, ReputationState>,
    
    /// CHECK: This is the user who will be slashed
    pub user: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn mint_tokens(ctx: Context<MintReputationTokens>, amount: u64, reason: String) -> Result<()> {
    let reputation_state = &mut ctx.accounts.reputation_state;
    let clock = Clock::get()?;
    
    // Validate amount
    require!(amount > 0, SkillPassError::InvalidAmount);
    
    // Update reputation state
    reputation_state.user = ctx.accounts.user.key();
    reputation_state.reputation_score += amount;
    reputation_state.last_activity = clock.unix_timestamp;
    reputation_state.total_earned += amount;
    
    msg!("Minted {} reputation tokens to {}", amount, ctx.accounts.user.key());
    msg!("Reason: {}", reason);
    msg!("New reputation score: {}", reputation_state.reputation_score);
    
    Ok(())
}

pub fn slash_tokens(ctx: Context<SlashReputationTokens>, amount: u64, reason: String) -> Result<()> {
    let reputation_state = &mut ctx.accounts.reputation_state;
    
    // Validate amount
    require!(amount > 0, SkillPassError::InvalidAmount);
    require!(reputation_state.reputation_score >= amount, SkillPassError::InsufficientReputationTokens);
    
    // Slash reputation
    reputation_state.reputation_score -= amount;
    reputation_state.total_slashed += amount;
    
    msg!("Slashed {} reputation tokens from {}", amount, ctx.accounts.user.key());
    msg!("Reason: {}", reason);
    msg!("New reputation score: {}", reputation_state.reputation_score);
    
    Ok(())
} 