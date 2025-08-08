use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct EndorseSkill<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut, seeds = [b"skill", skill_mint.key().as_ref()], bump)]
    pub skill: Account<'info, Skill>,
    
    #[account(
        init_if_needed,
        payer = endorser,
        space = StakeInfo::LEN,
        seeds = [b"stake_info", skill_mint.key().as_ref()],
        bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(
        init_if_needed,
        payer = endorser,
        space = Endorsement::LEN,
        seeds = [b"endorsement", endorser.key().as_ref(), skill_id.to_le_bytes().as_ref()],
        bump
    )]
    pub endorsement: Account<'info, Endorsement>,
    
    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,
    
    /// CHECK: Skill mint
    pub skill_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub endorser: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct ChallengeSkill<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut, seeds = [b"stake_info", skill_mint.key().as_ref()], bump)]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(mut, seeds = [b"reputation_state", challenger.key().as_ref()], bump)]
    pub challenger_reputation: Account<'info, ReputationState>,
    
    /// CHECK: Skill mint
    pub skill_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub challenger: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct ResolveChallenge<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut, seeds = [b"stake_info", skill_mint.key().as_ref()], bump)]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,
    
    /// CHECK: Skill mint
    pub skill_mint: AccountInfo<'info>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimStakingRewards<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init_if_needed,
        payer = staker,
        space = StakerRewards::LEN,
        seeds = [b"staker_rewards", staker.key().as_ref()],
        bump
    )]
    pub staker_rewards: Account<'info, StakerRewards>,
    
    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub staker: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn endorse_skill(
    ctx: Context<EndorseSkill>,
    skill_id: u64,
    stake_amount: u64,
    evidence: String,
) -> Result<()> {
    let skill = &mut ctx.accounts.skill;
    let stake_info = &mut ctx.accounts.stake_info;
    let endorsement = &mut ctx.accounts.endorsement;
    let clock = Clock::get()?;
    
    // Validate inputs
    require!(stake_amount >= MIN_STAKE, SkillPassError::BelowMinimumStake);
    require!(stake_amount > 0, SkillPassError::InvalidAmount);
    require!(!evidence.is_empty(), SkillPassError::InvalidAmount);
    require!(skill.creator != ctx.accounts.endorser.key(), SkillPassError::CannotEndorseOwnSkill);
    
    // Check if already endorsed
    if endorsement.endorser == ctx.accounts.endorser.key() && endorsement.active {
        return Err(SkillPassError::AlreadyEndorsed.into());
    }
    
    // Initialize stake info if needed
    if stake_info.skill_id == 0 {
        stake_info.skill_id = skill_id;
        stake_info.total_staked = 0;
        stake_info.endorsement_count = 0;
        stake_info.average_stake = 0;
        stake_info.challenged = false;
        stake_info.challenge_end_time = 0;
    }
    
    // Record endorsement
    endorsement.endorser = ctx.accounts.endorser.key();
    endorsement.staked_amount = stake_amount;
    endorsement.timestamp = clock.unix_timestamp;
    endorsement.active = true;
    endorsement.evidence = evidence;
    
    // Update stake info
    stake_info.total_staked += stake_amount;
    stake_info.endorsement_count += 1;
    stake_info.average_stake = stake_info.total_staked / stake_info.endorsement_count;
    
    // Update skill metrics
    skill.total_staked = stake_info.total_staked;
    skill.endorsement_count = stake_info.endorsement_count;
    
    // Auto-verify if enough endorsements and stake
    if stake_info.total_staked >= 1000_000_000_000 && stake_info.endorsement_count >= 5 {
        skill.verified = true;
        msg!("Skill automatically verified!");
    }
    
    msg!("Skill endorsed successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Endorser: {}", ctx.accounts.endorser.key());
    msg!("Stake amount: {}", stake_amount);
    msg!("Evidence: {}", endorsement.evidence);
    
    Ok(())
}

pub fn challenge_skill(ctx: Context<ChallengeSkill>, skill_id: u64) -> Result<()> {
    let stake_info = &mut ctx.accounts.stake_info;
    let challenger_reputation = &mut ctx.accounts.challenger_reputation;
    let clock = Clock::get()?;
    
    // Validate challenge
    require!(stake_info.total_staked > 0, SkillPassError::NoEndorsementsToChallenge);
    require!(!stake_info.challenged, SkillPassError::AlreadyChallenged);
    require!(challenger_reputation.reputation_score >= 1000_000_000_000, SkillPassError::InsufficientReputationToChallenge);
    
    // Initiate challenge
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
    let treasury = &mut ctx.accounts.treasury;
    let clock = Clock::get()?;
    
    // Validate challenge resolution
    require!(stake_info.challenged, SkillPassError::SkillNotChallenged);
    require!(clock.unix_timestamp >= stake_info.challenge_end_time, SkillPassError::ChallengePeriodNotEnded);
    
    // Reset challenge state
    stake_info.challenged = false;
    stake_info.challenge_end_time = 0;
    
    if skill_is_valid {
        // Reward correct endorsers
        msg!("Challenge resolved: Skill is VALID");
        msg!("Rewarding correct endorsers...");
    } else {
        // Slash incorrect endorsers
        msg!("Challenge resolved: Skill is INVALID");
        msg!("Slashing incorrect endorsers...");
        
        // Update treasury with slashed amounts
        let slashed_amount = (stake_info.total_staked * SLASH_PERCENTAGE) / 100;
        treasury.total_fees += slashed_amount;
    }
    
    // Reset stake info
    stake_info.total_staked = 0;
    stake_info.endorsement_count = 0;
    stake_info.average_stake = 0;
    
    msg!("Challenge resolved successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Skill valid: {}", skill_is_valid);
    
    Ok(())
}

pub fn claim_rewards(ctx: Context<ClaimStakingRewards>) -> Result<()> {
    let staker_rewards = &mut ctx.accounts.staker_rewards;
    let treasury = &mut ctx.accounts.treasury;
    
    // Validate rewards
    require!(staker_rewards.total_rewards > 0, SkillPassError::NoRewardsToClaim);
    
    let reward_amount = staker_rewards.total_rewards;
    
    // Reset rewards
    staker_rewards.total_rewards = 0;
    staker_rewards.last_claim_time = Clock::get()?.unix_timestamp;
    
    // Update treasury
    treasury.total_distributed += reward_amount;
    
    msg!("Staking rewards claimed successfully!");
    msg!("Staker: {}", ctx.accounts.staker.key());
    msg!("Reward amount: {}", reward_amount);
    
    Ok(())
} 