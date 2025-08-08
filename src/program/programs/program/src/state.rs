use anchor_lang::prelude::*;

// Constants
pub const INITIAL_REPUTATION_SUPPLY: u64 = 10_000_000_000_000; // 10M tokens (9 decimals)
pub const MAX_REPUTATION_SUPPLY: u64 = 100_000_000_000_000; // 100M tokens
pub const MIN_INVESTMENT: u64 = 50_000_000_000; // 50 REPR minimum
pub const MIN_STAKE: u64 = 10_000_000_000; // 10 REPR minimum
pub const CHALLENGE_PERIOD: i64 = 7 * 24 * 60 * 60; // 7 days in seconds
pub const REPUTATION_DECIMALS: u8 = 9;

// Share percentages (basis points)
pub const INVESTOR_SHARE: u64 = 7000; // 70% to investors
pub const SKILL_OWNER_SHARE: u64 = 2000; // 20% to skill owner
pub const PLATFORM_SHARE: u64 = 1000; // 10% to platform
pub const JOB_COMPLETION_FEE: u64 = 1000; // 10% of job revenue allocated to distribution
pub const SLASH_PERCENTAGE: u64 = 50; // 50% slash on false endorsement
pub const REWARD_PERCENTAGE: u64 = 10; // 10% reward for correct endorsement

// Account sizes (updated for SPL integration)
pub const PROGRAM_STATE_LEN: usize = 8 + 32 + 8 + 8 + 8 + 32 + 32 + 32 + 1; // 8 + authority + total_skills + total_investments + total_revenue + reputation_mint + skill_collection_mint + treasury + bump
pub const REPUTATION_STATE_LEN: usize = 8 + 32 + 8 + 8 + 8 + 8 + 1; // 8 + user + reputation_score + last_activity + total_earned + total_slashed + bump
pub const SKILL_LEN: usize = 8 + 32 + 32 + 32 + 64 + 64 + 64 + 64 + 8 + 8 + 8 + 1 + 8 + 1; // 8 + mint + creator + metadata + category + name + description + metadata_uri + created_at + total_staked + endorsement_count + verified + skill_id + bump
pub const INVESTMENT_POOL_LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 1; // unchanged
pub const INVESTMENT_LEN: usize = 8 + 32 + 8 + 8 + 8 + 8 + 1; // unchanged
pub const REVENUE_BREAKDOWN_LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 1; // unchanged
pub const ENDORSEMENT_LEN: usize = 8 + 32 + 8 + 8 + 1 + 64 + 1; // unchanged
pub const STAKE_INFO_LEN: usize = 8 + 8 + 8 + 8 + 1 + 8 + 1; // unchanged
pub const STAKER_REWARDS_LEN: usize = 8 + 32 + 8 + 8 + 1; // unchanged
pub const TREASURY_LEN: usize = 8 + 32 + 32 + 8 + 8 + 1; // 8 + authority + treasury_token_account + total_fees + total_distributed + bump

#[account]
pub struct ProgramState {
    pub authority: Pubkey,
    pub total_skills: u64,
    pub total_investments: u64,
    pub total_revenue: u64,
    pub reputation_mint: Pubkey, // SPL Token mint for REPR tokens
    pub skill_collection_mint: Pubkey, // Metaplex collection mint for skills
    pub treasury: Pubkey,
    pub bump: u8,
}

impl ProgramState {
    pub const LEN: usize = PROGRAM_STATE_LEN;
}

#[account]
pub struct ReputationState {
    pub user: Pubkey,
    pub reputation_score: u64,
    pub last_activity: i64,
    pub total_earned: u64,
    pub total_slashed: u64,
    pub bump: u8,
}

impl ReputationState {
    pub const LEN: usize = REPUTATION_STATE_LEN;
}

#[account]
pub struct Skill {
    pub mint: Pubkey, // NFT mint for this skill
    pub creator: Pubkey,
    pub metadata: Pubkey, // Metaplex metadata account
    pub category: String,
    pub name: String,
    pub description: String,
    pub metadata_uri: String, // JSON metadata URI
    pub created_at: i64,
    pub total_staked: u64,
    pub endorsement_count: u64,
    pub verified: bool,
    pub skill_id: u64,
    pub bump: u8,
}

impl Skill {
    pub const LEN: usize = SKILL_LEN;
}

#[account]
pub struct InvestmentPool {
    pub skill_id: u64,
    pub total_invested: u64,
    pub monthly_revenue: u64,
    pub total_revenue_earned: u64,
    pub last_distribution: i64,
    pub investor_count: u64,
    pub skill_owner_earnings: u64,
    pub current_apy: u64,
    pub bump: u8,
}

impl InvestmentPool {
    pub const LEN: usize = INVESTMENT_POOL_LEN;
}

#[account]
pub struct Investment {
    pub investor: Pubkey,
    pub skill_id: u64,
    pub amount: u64,
    pub last_claim_time: i64,
    pub total_claimed: u64,
    pub bump: u8,
}

impl Investment {
    pub const LEN: usize = INVESTMENT_LEN;
}

#[account]
pub struct RevenueBreakdown {
    pub skill_id: u64,
    pub job_completions: u64,
    pub platform_fees: u64,
    pub subscription_fees: u64,
    pub verification_fees: u64,
    pub bump: u8,
}

impl RevenueBreakdown {
    pub const LEN: usize = REVENUE_BREAKDOWN_LEN;
}

#[account]
pub struct Endorsement {
    pub endorser: Pubkey,
    pub staked_amount: u64,
    pub timestamp: i64,
    pub active: bool,
    pub evidence: String,
    pub bump: u8,
}

impl Endorsement {
    pub const LEN: usize = ENDORSEMENT_LEN;
}

#[account]
pub struct StakeInfo {
    pub skill_id: u64,
    pub total_staked: u64,
    pub endorsement_count: u64,
    pub average_stake: u64,
    pub challenged: bool,
    pub challenge_end_time: i64,
    pub bump: u8,
}

impl StakeInfo {
    pub const LEN: usize = STAKE_INFO_LEN;
}

#[account]
pub struct StakerRewards {
    pub user: Pubkey,
    pub total_rewards: u64,
    pub last_claim_time: i64,
    pub bump: u8,
}

impl StakerRewards {
    pub const LEN: usize = STAKER_REWARDS_LEN;
}

#[account]
pub struct Treasury {
    pub authority: Pubkey,
    pub treasury_token_account: Pubkey, // ATA for holding REPR tokens
    pub total_fees: u64,
    pub total_distributed: u64,
    pub bump: u8,
}

impl Treasury {
    pub const LEN: usize = TREASURY_LEN;
} 