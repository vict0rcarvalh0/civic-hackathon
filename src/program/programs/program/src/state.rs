use anchor_lang::prelude::*;

// Global program state
#[account]
pub struct ProgramState {
    pub authority: Pubkey,
    pub reputation_mint: Pubkey,
    pub skill_mint: Pubkey,
    pub treasury: Pubkey,
    pub total_skills: u64,
    pub total_investments: u64,
    pub total_revenue: u64,
    pub bump: u8,
}

// Reputation token state
#[account]
pub struct ReputationState {
    pub user: Pubkey,
    pub reputation_score: u64,
    pub last_activity: i64,
    pub total_earned: u64,
    pub total_slashed: u64,
    pub bump: u8,
}

// Skill NFT state
#[account]
pub struct Skill {
    pub mint: Pubkey,
    pub creator: Pubkey,
    pub category: String,
    pub name: String,
    pub description: String,
    pub metadata_uri: String,
    pub created_at: i64,
    pub total_staked: u64,
    pub endorsement_count: u64,
    pub verified: bool,
    pub skill_id: u64,
    pub bump: u8,
}

// Investment pool state
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

// Individual investment state
#[account]
pub struct Investment {
    pub investor: Pubkey,
    pub skill_id: u64,
    pub amount: u64,
    pub last_claim_time: i64,
    pub total_claimed: u64,
    pub pending_yield: u64,
    pub bump: u8,
}

// Revenue breakdown
#[account]
pub struct RevenueBreakdown {
    pub skill_id: u64,
    pub job_completions: u64,
    pub platform_fees: u64,
    pub subscription_fees: u64,
    pub verification_fees: u64,
    pub bump: u8,
}

// Skill endorsement state
#[account]
pub struct Endorsement {
    pub endorser: Pubkey,
    pub skill_id: u64,
    pub staked_amount: u64,
    pub timestamp: i64,
    pub active: bool,
    pub evidence: String,
    pub bump: u8,
}

// Stake info for skills
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

// Staker rewards
#[account]
pub struct StakerRewards {
    pub staker: Pubkey,
    pub total_rewards: u64,
    pub total_slashed: u64,
    pub bump: u8,
}

// Platform treasury
#[account]
pub struct Treasury {
    pub authority: Pubkey,
    pub total_fees: u64,
    pub total_distributed: u64,
    pub bump: u8,
}

// Constants
pub const INITIAL_REPUTATION_SUPPLY: u64 = 10_000_000_000_000; // 10M tokens (9 decimals)
pub const MAX_REPUTATION_SUPPLY: u64 = 100_000_000_000_000; // 100M tokens
pub const MIN_INVESTMENT: u64 = 50_000_000_000; // 50 REPR tokens
pub const MIN_STAKE: u64 = 10_000_000_000; // 10 REPR tokens
pub const CHALLENGE_PERIOD: i64 = 7 * 24 * 60 * 60; // 7 days in seconds
pub const SLASH_PERCENTAGE: u64 = 50; // 50% slash
pub const REWARD_PERCENTAGE: u64 = 10; // 10% reward
pub const INVESTOR_SHARE: u64 = 7000; // 70% to investors
pub const SKILL_OWNER_SHARE: u64 = 2000; // 20% to skill owner
pub const PLATFORM_SHARE: u64 = 1000; // 10% to platform
pub const JOB_COMPLETION_FEE: u64 = 1000; // 10% of job revenue

// Helper functions
impl ProgramState {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 1;
}

impl ReputationState {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 8 + 1;
}

impl Skill {
    pub const LEN: usize = 8 + 32 + 32 + 64 + 64 + 64 + 64 + 8 + 8 + 8 + 1 + 8 + 1;
}

impl InvestmentPool {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 1;
}

impl Investment {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 8 + 8 + 1;
}

impl RevenueBreakdown {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 8 + 1;
}

impl Endorsement {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 1 + 64 + 1;
}

impl StakeInfo {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 1 + 8 + 1;
}

impl StakerRewards {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 1;
}

impl Treasury {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 1;
} 