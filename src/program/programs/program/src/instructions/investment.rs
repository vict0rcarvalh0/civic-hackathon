use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, Transfer},
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct InvestInSkill<'info> {
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
        associated_token::authority = investor,
    )]
    pub investor_token_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,

    #[account(
        init_if_needed,
        payer = investor,
        space = InvestmentPool::LEN,
        seeds = [b"investment_pool", skill.mint.as_ref()],
        bump
    )]
    pub investment_pool: Account<'info, InvestmentPool>,

    #[account(
        init_if_needed,
        payer = investor,
        space = Investment::LEN,
        seeds = [b"investment", investor.key().as_ref(), skill_id.to_le_bytes().as_ref()],
        bump
    )]
    pub investment: Account<'info, Investment>,

    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub investor: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct RecordJobCompletion<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
        has_one = authority
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut, seeds = [b"skill", skill.mint.as_ref()], bump)]
    pub skill: Account<'info, Skill>,
    
    #[account(mut, seeds = [b"investment_pool", skill.mint.as_ref()], bump)]
    pub investment_pool: Account<'info, InvestmentPool>,
    
    #[account(mut, seeds = [b"revenue_breakdown", skill.mint.as_ref()], bump)]
    pub revenue_breakdown: Account<'info, RevenueBreakdown>,
    
    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(skill_id: u64)]
pub struct ClaimYield<'info> {
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
        associated_token::authority = investor,
    )]
    pub investor_token_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"skill", skill.mint.as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,

    #[account(mut, seeds = [b"investment_pool", skill.mint.as_ref()], bump)]
    pub investment_pool: Account<'info, InvestmentPool>,

    #[account(mut, seeds = [b"investment", investor.key().as_ref(), skill_id.to_le_bytes().as_ref()], bump)]
    pub investment: Account<'info, Investment>,

    #[account(mut, seeds = [b"treasury"], bump)]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        associated_token::mint = reputation_mint,
        associated_token::authority = treasury,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub investor: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn invest_in_skill(
    ctx: Context<InvestInSkill>,
    skill_id: u64,
    amount: u64,
) -> Result<()> {
    let investment_pool = &mut ctx.accounts.investment_pool;
    let investment = &mut ctx.accounts.investment;
    let clock = Clock::get()?;
    
    // Validate investment
    require!(amount >= MIN_INVESTMENT, SkillPassError::BelowMinimumInvestment);
    require!(amount > 0, SkillPassError::InvalidAmount);
    require!(
        ctx.accounts.investor_token_account.amount >= amount,
        SkillPassError::InsufficientReputationTokens
    );
    require!(
        ctx.accounts.skill.creator != ctx.accounts.investor.key(),
        SkillPassError::CannotInvestInOwnSkill
    );

    // Transfer tokens from investor to treasury
    let cpi_accounts = Transfer {
        from: ctx.accounts.investor_token_account.to_account_info(),
        to: ctx.accounts.treasury_token_account.to_account_info(),
        authority: ctx.accounts.investor.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    // Initialize investment pool if needed
    if investment_pool.skill_id == 0 {
        investment_pool.skill_id = skill_id;
        investment_pool.total_invested = 0;
        investment_pool.monthly_revenue = 0;
        investment_pool.total_revenue_earned = 0;
        investment_pool.last_distribution = clock.unix_timestamp;
        investment_pool.investor_count = 0;
        investment_pool.skill_owner_earnings = 0;
        investment_pool.current_apy = 0;
        investment_pool.bump = ctx.bumps.investment_pool;
    }
    
    // Track new investor
    if investment.amount == 0 {
        investment_pool.investor_count += 1;
    }
    
    // Update investment
    investment.investor = ctx.accounts.investor.key();
    investment.skill_id = skill_id;
    investment.amount += amount;
    investment.last_claim_time = clock.unix_timestamp;
    
    // Update pool
    investment_pool.total_invested += amount;
    
    // Update program state
    ctx.accounts.program_state.total_investments += 1;
    
    msg!("Investment made successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Investor: {}", ctx.accounts.investor.key());
    msg!("Amount: {}", amount);
    msg!("Total invested: {}", investment_pool.total_invested);
    
    Ok(())
}

pub fn record_job_completion(
    ctx: Context<RecordJobCompletion>,
    skill_id: u64,
    job_revenue: u64,
    job_title: String,
) -> Result<()> {
    let investment_pool = &mut ctx.accounts.investment_pool;
    let revenue_breakdown = &mut ctx.accounts.revenue_breakdown;
    let treasury = &mut ctx.accounts.treasury;
    let _clock = Clock::get()?;
    
    // Validate inputs
    require!(job_revenue > 0, SkillPassError::InvalidAmount);
    require!(!job_title.is_empty(), SkillPassError::InvalidAmount);
    
    // Calculate revenue distribution
    let platform_fee = (job_revenue * JOB_COMPLETION_FEE) / 10000;
    let investor_share = (platform_fee * INVESTOR_SHARE) / 10000;
    let skill_owner_share = (platform_fee * SKILL_OWNER_SHARE) / 10000;
    let platform_share = (platform_fee * PLATFORM_SHARE) / 10000;
    
    // Update investment pool
    investment_pool.monthly_revenue += investor_share;
    investment_pool.total_revenue_earned += investor_share;
    investment_pool.skill_owner_earnings += skill_owner_share;
    
    // Calculate APY (annualized return based on monthly revenue)
    if investment_pool.total_invested > 0 {
        investment_pool.current_apy = (investment_pool.monthly_revenue * 12 * 10000) / investment_pool.total_invested;
    }
    
    // Update revenue breakdown
    revenue_breakdown.skill_id = skill_id;
    revenue_breakdown.job_completions += investor_share;
    
    // Update treasury
    treasury.total_fees += platform_share;
    
    // Update program state
    ctx.accounts.program_state.total_revenue += job_revenue;
    
    msg!("Job completion recorded!");
    msg!("Skill ID: {}", skill_id);
    msg!("Job: {}", job_title);
    msg!("Revenue: {}", job_revenue);
    msg!("Platform fee: {}", platform_fee);
    msg!("Investor share: {}", investor_share);
    msg!("Skill owner share: {}", skill_owner_share);
    msg!("Platform share: {}", platform_share);
    msg!("New APY: {}%", investment_pool.current_apy as f64 / 100.0);
    
    Ok(())
}

pub fn claim_yield(ctx: Context<ClaimYield>, skill_id: u64) -> Result<()> {
    let investment_pool = &mut ctx.accounts.investment_pool;
    let investment = &mut ctx.accounts.investment;
    let clock = Clock::get()?;
    
    // Get treasury key and bump before mutable borrow
    let treasury_bump = ctx.accounts.treasury.bump;
    
    // Validate investment exists
    require!(investment.amount > 0, SkillPassError::NoInvestmentInSkill);
    require!(investment.skill_id == skill_id, SkillPassError::InvalidSkillId);
    
    // Calculate yield
    let time_since_last_claim = clock.unix_timestamp - investment.last_claim_time;
    let months_since_last_claim = time_since_last_claim / (30 * 24 * 60 * 60); // 30 days
    
    if months_since_last_claim == 0 {
        return Err(SkillPassError::NoYieldToClaim.into());
    }
    
    // Calculate investor's share of pool
    let investor_share = (investment.amount * 10000) / investment_pool.total_invested;
    let monthly_yield = (investment_pool.monthly_revenue * investor_share) / 10000;
    let yield_amount = monthly_yield * months_since_last_claim as u64;
    
    require!(yield_amount > 0, SkillPassError::NoYieldToClaim);
    require!(
        ctx.accounts.treasury_token_account.amount >= yield_amount,
        SkillPassError::InsufficientReputationTokens
    );

    // Transfer yield from treasury to investor
    let cpi_accounts = Transfer {
        from: ctx.accounts.treasury_token_account.to_account_info(),
        to: ctx.accounts.investor_token_account.to_account_info(),
        authority: ctx.accounts.treasury.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[&[b"treasury", &[treasury_bump]]];
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        signer_seeds,
    );
    
    anchor_spl::token::transfer(cpi_ctx, yield_amount)?;
    
    // Update investment
    investment.last_claim_time = clock.unix_timestamp;
    investment.total_claimed += yield_amount;
    
    // Update treasury
    ctx.accounts.treasury.total_distributed += yield_amount;
    
    msg!("Yield claimed successfully!");
    msg!("Skill ID: {}", skill_id);
    msg!("Investor: {}", ctx.accounts.investor.key());
    msg!("Yield amount: {}", yield_amount);
    msg!("Months claimed: {}", months_since_last_claim);
    
    Ok(())
} 