use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, MintTo},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct CreateSkill<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = creator,
        mint::decimals = 0,
        mint::authority = program_state,
        mint::freeze_authority = program_state,
    )]
    pub skill_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = skill_mint,
        associated_token::authority = creator,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = creator,
        space = Skill::LEN,
        seeds = [b"skill", skill_mint.key().as_ref()],
        bump
    )]
    pub skill: Account<'info, Skill>,

    #[account(
        init_if_needed,
        payer = creator,
        space = InvestmentPool::LEN,
        seeds = [b"investment_pool", skill_mint.key().as_ref()],
        bump
    )]
    pub investment_pool: Account<'info, InvestmentPool>,

    #[account(
        init_if_needed,
        payer = creator,
        space = RevenueBreakdown::LEN,
        seeds = [b"revenue_breakdown", skill_mint.key().as_ref()],
        bump
    )]
    pub revenue_breakdown: Account<'info, RevenueBreakdown>,

    #[account(
        init_if_needed,
        payer = creator,
        space = StakeInfo::LEN,
        seeds = [b"stake_info", skill_mint.key().as_ref()],
        bump
    )]
    pub stake_info: Account<'info, StakeInfo>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateSkillMetrics<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        mut,
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,
    
    #[account(
        mut,
        seeds = [b"stake_info", skill.mint.as_ref()],
        bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    pub authority: Signer<'info>,
}

pub fn create_skill(
    ctx: Context<CreateSkill>,
    category: String,
    name: String,
    description: String,
    metadata_uri: String,
) -> Result<()> {
    let investment_pool = &mut ctx.accounts.investment_pool;
    let revenue_breakdown = &mut ctx.accounts.revenue_breakdown;
    let stake_info = &mut ctx.accounts.stake_info;
    let clock = Clock::get()?;
    
    // Validate inputs
    require!(!category.is_empty(), SkillPassError::InvalidAmount);
    require!(!name.is_empty(), SkillPassError::InvalidAmount);
    require!(!description.is_empty(), SkillPassError::InvalidAmount);
    require!(!metadata_uri.is_empty(), SkillPassError::InvalidAmount);

    // Capture values before borrowing
    let skill_id = ctx.accounts.program_state.total_skills + 1;

    // Mint the skill NFT to the creator (1 token representing the skill)
    let cpi_accounts = MintTo {
        mint: ctx.accounts.skill_mint.to_account_info(),
        to: ctx.accounts.creator_token_account.to_account_info(),
        authority: ctx.accounts.program_state.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[&[b"program_state", &[ctx.accounts.program_state.bump]]];
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        signer_seeds,
    );
    
    anchor_spl::token::mint_to(cpi_ctx, 1)?; // Mint 1 NFT token

    // Initialize skill
    let skill = &mut ctx.accounts.skill;
    skill.bump = ctx.bumps.skill;
    skill.mint = ctx.accounts.skill_mint.key();
    skill.creator = ctx.accounts.creator.key();
    skill.metadata = Pubkey::default(); // Would be set by Metaplex in full implementation
    skill.category = category;
    skill.name = name;
    skill.description = description;
    skill.metadata_uri = metadata_uri;
    skill.created_at = clock.unix_timestamp;
    skill.total_staked = 0;
    skill.endorsement_count = 0;
    skill.verified = false;
    skill.skill_id = skill_id;

    // Initialize investment pool
    investment_pool.skill_id = skill_id;
    investment_pool.total_invested = 0;
    investment_pool.monthly_revenue = 0;
    investment_pool.total_revenue_earned = 0;
    investment_pool.last_distribution = clock.unix_timestamp;
    investment_pool.investor_count = 0;
    investment_pool.skill_owner_earnings = 0;
    investment_pool.current_apy = 0;
    investment_pool.bump = ctx.bumps.investment_pool;

    // Initialize revenue breakdown
    revenue_breakdown.skill_id = skill_id;
    revenue_breakdown.job_completions = 0;
    revenue_breakdown.platform_fees = 0;
    revenue_breakdown.subscription_fees = 0;
    revenue_breakdown.verification_fees = 0;
    revenue_breakdown.bump = ctx.bumps.revenue_breakdown;

    // Initialize stake info
    stake_info.skill_id = skill_id;
    stake_info.total_staked = 0;
    stake_info.endorsement_count = 0;
    stake_info.average_stake = 0;
    stake_info.challenged = false;
    stake_info.challenge_end_time = 0;
    stake_info.bump = ctx.bumps.stake_info;

    // Update program state
    let program_state = &mut ctx.accounts.program_state;
    program_state.total_skills += 1;

    msg!("Skill NFT created successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Creator: {}", ctx.accounts.creator.key());
    msg!("Category: {}", skill.category);
    msg!("Name: {}", skill.name);
    msg!("NFT Mint: {}", ctx.accounts.skill_mint.key());
    msg!("Metadata URI: {}", skill.metadata_uri);

    Ok(())
}

pub fn update_metrics(
    ctx: Context<UpdateSkillMetrics>,
    total_staked: u64,
    endorsement_count: u64,
) -> Result<()> {
    let skill = &mut ctx.accounts.skill;
    let stake_info = &mut ctx.accounts.stake_info;
    
    // Update skill metrics
    skill.total_staked = total_staked;
    skill.endorsement_count = endorsement_count;
    
    // Update stake info
    stake_info.total_staked = total_staked;
    stake_info.endorsement_count = endorsement_count;
    if endorsement_count > 0 {
        stake_info.average_stake = total_staked / endorsement_count;
    }
    
    // Auto-verify if enough endorsements and stake
    if total_staked >= 1000_000_000_000 && endorsement_count >= 5 {
        skill.verified = true;
        msg!("Skill automatically verified!");
    }
    
    msg!("Skill metrics updated!");
    msg!("Total staked: {}", total_staked);
    msg!("Endorsement count: {}", endorsement_count);
    
    Ok(())
} 