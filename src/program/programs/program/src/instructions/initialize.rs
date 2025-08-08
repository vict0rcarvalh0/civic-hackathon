use anchor_lang::prelude::*;
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
        space = Treasury::LEN,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let program_state = &mut ctx.accounts.program_state;
    let _clock = Clock::get()?;
    
    // Get treasury key before any borrowing
    let treasury_key = ctx.accounts.treasury.key();
    let authority_key = ctx.accounts.authority.key();
    
    // Initialize program state
    program_state.authority = authority_key;
    program_state.total_skills = 0;
    program_state.total_investments = 0;
    program_state.total_revenue = 0;
    program_state.reputation_mint = Pubkey::default(); // Will be set later
    program_state.skill_mint = Pubkey::default(); // Will be set later
    program_state.treasury = treasury_key;
    
    // Initialize treasury
    let treasury = &mut ctx.accounts.treasury;
    treasury.authority = authority_key;
    treasury.total_fees = 0;
    treasury.total_distributed = 0;
    
    msg!("SkillPass program initialized successfully!");
    msg!("Authority: {}", authority_key);
    msg!("Treasury: {}", treasury_key);
    
    Ok(())
} 