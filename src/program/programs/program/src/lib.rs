use anchor_lang::prelude::*;

declare_id!("GnaNCjWTV5Zv3AoLwQKppZLLUjuQPjqrJTKEs8HqVj9q");

pub mod state;
pub mod instructions;
pub mod errors;

use instructions::*;

#[program]
pub mod skillpass {
    use super::*;

    // Initialize the program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    // Reputation Token Management
    pub fn mint_reputation_tokens(
        ctx: Context<MintReputationTokens>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        instructions::reputation::mint_tokens(ctx, amount, reason)
    }

    pub fn slash_reputation_tokens(
        ctx: Context<SlashReputationTokens>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        instructions::reputation::slash_tokens(ctx, amount, reason)
    }

    // Skill Management
    pub fn create_skill(
        ctx: Context<CreateSkill>,
        category: String,
        name: String,
        description: String,
        metadata_uri: String,
    ) -> Result<()> {
        instructions::skill::create_skill(ctx, category, name, description, metadata_uri)
    }

    pub fn update_skill_metrics(
        ctx: Context<UpdateSkillMetrics>,
        total_staked: u64,
        endorsement_count: u64,
    ) -> Result<()> {
        instructions::skill::update_metrics(ctx, total_staked, endorsement_count)
    }

    // Investment Platform
    pub fn invest_in_skill(
        ctx: Context<InvestInSkill>,
        skill_id: u64,
        amount: u64,
    ) -> Result<()> {
        instructions::investment::invest_in_skill(ctx, skill_id, amount)
    }

    pub fn record_job_completion(
        ctx: Context<RecordJobCompletion>,
        skill_id: u64,
        job_revenue: u64,
        job_title: String,
    ) -> Result<()> {
        instructions::investment::record_job_completion(ctx, skill_id, job_revenue, job_title)
    }

    pub fn claim_yield(ctx: Context<ClaimYield>, skill_id: u64) -> Result<()> {
        instructions::investment::claim_yield(ctx, skill_id)
    }

    // Skill Staking/Endorsement
    pub fn endorse_skill(
        ctx: Context<EndorseSkill>,
        skill_id: u64,
        stake_amount: u64,
        evidence: String,
    ) -> Result<()> {
        instructions::staking::endorse_skill(ctx, skill_id, stake_amount, evidence)
    }

    pub fn challenge_skill(ctx: Context<ChallengeSkill>, skill_id: u64) -> Result<()> {
        instructions::staking::challenge_skill(ctx, skill_id)
    }

    pub fn resolve_challenge(
        ctx: Context<ResolveChallenge>,
        skill_id: u64,
        skill_is_valid: bool,
    ) -> Result<()> {
        instructions::staking::resolve_challenge(ctx, skill_id, skill_is_valid)
    }

    pub fn claim_staking_rewards(ctx: Context<ClaimStakingRewards>) -> Result<()> {
        instructions::staking::claim_rewards(ctx)
    }
}
