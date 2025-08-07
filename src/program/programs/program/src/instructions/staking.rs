use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, Transfer},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct EndorseSkill<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        seeds = [b"reputation_mint"],
        bump
    )]
    pub reputation_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = endorser,
    )]
    pub endorser_token_account: Account<'info, TokenAccount>,
    
    #[account(
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,
    
    #[account(
        mut,
        seeds = [b"stake_info", skill.mint.as_ref()],
        bump = stake_info.bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(
        init,
        payer = endorser,
        space = Endorsement::LEN,
        seeds = [b"endorsement", endorser.key().as_ref(), skill.skill_id.to_le_bytes().as_ref()],
        bump
    )]
    pub endorsement: Account<'info, Endorsement>,
    
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub endorser: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ChallengeSkill<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,
    
    #[account(
        mut,
        seeds = [b"stake_info", skill.mint.as_ref()],
        bump = stake_info.bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(
        seeds = [b"reputation_state", challenger.key().as_ref()],
        bump
    )]
    pub challenger_reputation: Account<'info, ReputationState>,
    
    #[account(mut)]
    pub challenger: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveChallenge<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump,
        has_one = authority
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,
    
    #[account(
        mut,
        seeds = [b"stake_info", skill.mint.as_ref()],
        bump = stake_info.bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimStakingRewards<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        seeds = [b"reputation_mint"],
        bump
    )]
    pub reputation_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = staker,
    )]
    pub staker_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"staker_rewards", staker.key().as_ref()],
        bump = staker_rewards.bump
    )]
    pub staker_rewards: Account<'info, StakerRewards>,
    
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub staker: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn endorse_skill(
    ctx: Context<EndorseSkill>,
    skill_id: u64,
    stake_amount: u64,
    evidence: String,
) -> Result<()> {
    let endorsement = &mut ctx.accounts.endorsement;
    let stake_info = &mut ctx.accounts.stake_info;
    let clock = Clock::get()?;
    
    // Validate endorsement
    require!(stake_amount >= MIN_STAKE, SkillPassError::BelowMinimumStake);
    require!(
        ctx.accounts.endorser_token_account.amount >= stake_amount,
        SkillPassError::InsufficientReputationTokens
    );
    
    // Transfer stake to treasury
    let cpi_accounts = Transfer {
        from: ctx.accounts.endorser_token_account.to_account_info(),
        to: ctx.accounts.treasury_token_account.to_account_info(),
        authority: ctx.accounts.endorser.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    anchor_spl::token::transfer(cpi_ctx, stake_amount)?;
    
    // Record endorsement
    endorsement.endorser = ctx.accounts.endorser.key();
    endorsement.skill_id = skill_id;
    endorsement.staked_amount = stake_amount;
    endorsement.timestamp = clock.unix_timestamp;
    endorsement.active = true;
    endorsement.evidence = evidence;
    endorsement.bump = *ctx.bumps.get("endorsement").unwrap();
    
    // Update stake info
    stake_info.total_staked += stake_amount;
    stake_info.endorsement_count += 1;
    stake_info.average_stake = stake_info.total_staked / stake_info.endorsement_count;
    
    msg!("Skill endorsed successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Stake amount: {}", stake_amount);
    msg!("Endorser: {}", ctx.accounts.endorser.key());
    msg!("Evidence: {}", evidence);
    
    Ok(())
}

pub fn challenge_skill(ctx: Context<ChallengeSkill>, skill_id: u64) -> Result<()> {
    let stake_info = &mut ctx.accounts.stake_info;
    let challenger_reputation = &ctx.accounts.challenger_reputation;
    let clock = Clock::get()?;
    
    require!(stake_info.total_staked > 0, SkillPassError::SkillDoesNotExist);
    require!(!stake_info.challenged, SkillPassError::SkillNotChallenged);
    require!(
        challenger_reputation.reputation_score >= 1000_000_000_000,
        SkillPassError::InsufficientReputationToChallenge
    );
    
    stake_info.challenged = true;
    stake_info.challenge_end_time = clock.unix_timestamp + CHALLENGE_PERIOD;
    
    msg!("Skill challenged successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Challenger: {}", ctx.accounts.challenger.key());
    msg!("Challenge end time: {}", stake_info.challenge_end_time);
    
    Ok(())
}

pub fn resolve_challenge(
    ctx: Context<ResolveChallenge>,
    skill_id: u64,
    skill_is_valid: bool,
) -> Result<()> {
    let stake_info = &mut ctx.accounts.stake_info;
    let clock = Clock::get()?;
    
    require!(stake_info.challenged, SkillPassError::SkillNotChallenged);
    require!(
        clock.unix_timestamp >= stake_info.challenge_end_time,
        SkillPassError::ChallengePeriodNotEnded
    );
    
    if skill_is_valid {
        // Reward correct endorsers
        msg!("Skill validated as correct!");
        msg!("Endorsers will be rewarded");
    } else {
        // Slash incorrect endorsers
        msg!("Skill validated as incorrect!");
        msg!("Endorsers will be slashed");
    }
    
    // Reset challenge state
    stake_info.challenged = false;
    stake_info.challenge_end_time = 0;
    
    msg!("Challenge resolved!");
    msg!("Skill ID: {}", skill_id);
    msg!("Valid: {}", skill_is_valid);
    
    Ok(())
}

pub fn claim_rewards(ctx: Context<ClaimStakingRewards>) -> Result<()> {
    let staker_rewards = &mut ctx.accounts.staker_rewards;
    
    require!(staker_rewards.total_rewards > 0, SkillPassError::NoRewardsToClaim);
    
    let reward_amount = staker_rewards.total_rewards;
    
    // Transfer rewards from treasury to staker
    let cpi_accounts = Transfer {
        from: ctx.accounts.treasury_token_account.to_account_info(),
        to: ctx.accounts.staker_token_account.to_account_info(),
        authority: ctx.accounts.treasury.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        &[&[
            b"treasury",
            &[ctx.accounts.treasury.bump],
        ]],
    );
    
    anchor_spl::token::transfer(cpi_ctx, reward_amount)?;
    
    // Reset rewards
    staker_rewards.total_rewards = 0;
    
    msg!("Staking rewards claimed successfully!");
    msg!("Reward amount: {}", reward_amount);
    msg!("Staker: {}", ctx.accounts.staker.key());
    
    Ok(())
} 