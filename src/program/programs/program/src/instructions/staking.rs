use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, Transfer},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct EndorseSkill<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
        has_one = reputation_mint
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
        init_if_needed,
        payer = endorser,
        space = StakeInfo::LEN,
        seeds = [b"stake_info", skill.mint.as_ref()],
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
#[instruction(skill_id: u64)]
pub struct ChallengeSkill<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,

    #[account(mut, seeds = [b"stake_info", skill.mint.as_ref()], bump)]
    pub stake_info: Account<'info, StakeInfo>,

    #[account(mut, seeds = [b"reputation_state", challenger.key().as_ref()], bump)]
    pub challenger_reputation: Account<'info, ReputationState>,

    #[account(mut)]
    pub challenger: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct ResolveChallenge<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
        has_one = authority,
        has_one = reputation_mint
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        seeds = [b"reputation_mint"],
        bump
    )]
    pub reputation_mint: Account<'info, Mint>,

    #[account(
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,

    #[account(mut, seeds = [b"stake_info", skill.mint.as_ref()], bump)]
    pub stake_info: Account<'info, StakeInfo>,

    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimStakingRewards<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
        has_one = reputation_mint
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
        init_if_needed,
        payer = staker,
        space = StakerRewards::LEN,
        seeds = [b"staker_rewards", staker.key().as_ref()],
        bump
    )]
    pub staker_rewards: Account<'info, StakerRewards>,

    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub staker: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn endorse_skill(
    ctx: Context<EndorseSkill>,
    skill_id: u64,
    stake_amount: u64,
    evidence: String,
) -> Result<()> {
    let skill = &ctx.accounts.skill;
    let stake_info = &mut ctx.accounts.stake_info;
    let endorsement = &mut ctx.accounts.endorsement;
    let clock = Clock::get()?;
    
    // Validate inputs
    require!(stake_amount >= MIN_STAKE, SkillPassError::BelowMinimumStake);
    require!(stake_amount > 0, SkillPassError::InvalidAmount);
    require!(!evidence.is_empty(), SkillPassError::InvalidAmount);
    require!(skill.creator != ctx.accounts.endorser.key(), SkillPassError::CannotEndorseOwnSkill);
    require!(
        ctx.accounts.endorser_token_account.amount >= stake_amount,
        SkillPassError::InsufficientReputationTokens
    );
    
    // Check if already endorsed
    if endorsement.endorser == ctx.accounts.endorser.key() && endorsement.active {
        return Err(SkillPassError::AlreadyEndorsed.into());
    }

    // Transfer stake to treasury
    let cpi_accounts = Transfer {
        from: ctx.accounts.endorser_token_account.to_account_info(),
        to: ctx.accounts.treasury_token_account.to_account_info(),
        authority: ctx.accounts.endorser.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[&[b"treasury", &[ctx.accounts.treasury.bump]]];
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        signer_seeds,
    );
    
    anchor_spl::token::transfer(cpi_ctx, stake_amount)?;
    
    // Initialize stake info if needed
    if stake_info.skill_id == 0 {
        stake_info.skill_id = skill_id;
        stake_info.total_staked = 0;
        stake_info.endorsement_count = 0;
        stake_info.average_stake = 0;
        stake_info.challenged = false;
        stake_info.challenge_end_time = 0;
        stake_info.bump = ctx.bumps.stake_info;
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
    
    msg!("Skill endorsed successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Endorser: {}", ctx.accounts.endorser.key());
    msg!("Stake amount: {}", stake_amount);
    msg!("Evidence: {}", endorsement.evidence);
    msg!("Total staked: {}", stake_info.total_staked);
    
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
    
    if skill_is_valid {
        // Reward correct endorsers (tokens stay in treasury, rewards tracked separately)
        msg!("Challenge resolved: Skill is VALID");
        msg!("Correct endorsers will receive rewards");
        
        // Calculate reward amount for correct endorsers
        let reward_amount = (stake_info.total_staked * REWARD_PERCENTAGE) / 100;
        treasury.total_fees += reward_amount; // Track as fees for distribution
        
        msg!("Endorser reward pool: {}", reward_amount);
    } else {
        // Slash incorrect endorsers (tokens are already in treasury)
        msg!("Challenge resolved: Skill is INVALID");
        msg!("Incorrect endorsers have been slashed");
        
        // Calculate slashed amount
        let slashed_amount = (stake_info.total_staked * SLASH_PERCENTAGE) / 100;
        treasury.total_fees += slashed_amount;
        
        msg!("Total slashed: {}", slashed_amount);
    }
    
    // Reset challenge state
    stake_info.challenged = false;
    stake_info.challenge_end_time = 0;
    
    // Reset stake info (endorsements are resolved)
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
    
    // Get treasury key and bump before mutable borrow
    let treasury_bump = ctx.accounts.treasury.bump;
    
    // Validate rewards
    require!(staker_rewards.total_rewards > 0, SkillPassError::NoRewardsToClaim);

    let reward_amount = staker_rewards.total_rewards;

    // Check treasury has enough tokens
    require!(
        ctx.accounts.treasury_token_account.amount >= reward_amount,
        SkillPassError::InsufficientReputationTokens
    );

    // Transfer rewards from treasury to staker
    let cpi_accounts = Transfer {
        from: ctx.accounts.treasury_token_account.to_account_info(),
        to: ctx.accounts.staker_token_account.to_account_info(),
        authority: ctx.accounts.treasury.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[&[b"treasury", &[treasury_bump]]];
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        signer_seeds,
    );
    
    anchor_spl::token::transfer(cpi_ctx, reward_amount)?;
    
    // Reset rewards
    staker_rewards.total_rewards = 0;
    staker_rewards.last_claim_time = Clock::get()?.unix_timestamp;
    
    // Update treasury
    ctx.accounts.treasury.total_distributed += reward_amount;
    
    msg!("Staking rewards claimed successfully!");
    msg!("Staker: {}", ctx.accounts.staker.key());
    msg!("Reward amount: {}", reward_amount);
    
    Ok(())
} 