use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct CreateSkill<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = creator,
        space = Skill::LEN,
        seeds = [b"skill", skill_mint.key().as_ref()],
        bump
    )]
    pub skill: Account<'info, Skill>,
    
    /// CHECK: Skill mint
    pub skill_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateSkillMetrics<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        mut,
        seeds = [b"skill", skill_mint.key().as_ref()],
        bump = skill.bump
    )]
    pub skill: Account<'info, Skill>,
    
    #[account(
        mut,
        seeds = [b"stake_info", skill_mint.key().as_ref()],
        bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    /// CHECK: Skill mint
    pub skill_mint: AccountInfo<'info>,
    
    pub authority: Signer<'info>,
}

pub fn create_skill(
    ctx: Context<CreateSkill>,
    category: String,
    name: String,
    description: String,
    metadata_uri: String,
) -> Result<()> {
    let program_state = &mut ctx.accounts.program_state;
    let skill = &mut ctx.accounts.skill;
    let clock = Clock::get()?;
    
    // Validate inputs
    require!(!category.is_empty(), SkillPassError::InvalidAmount);
    require!(!name.is_empty(), SkillPassError::InvalidAmount);
    require!(!description.is_empty(), SkillPassError::InvalidAmount);
    
    // Initialize skill
    skill.creator = ctx.accounts.creator.key();
    skill.category = category;
    skill.name = name;
    skill.description = description;
    skill.metadata_uri = metadata_uri;
    skill.created_at = clock.unix_timestamp;
    skill.total_staked = 0;
    skill.endorsement_count = 0;
    skill.verified = false;
    skill.skill_id = program_state.total_skills + 1;
    
    // Update program state
    program_state.total_skills += 1;
    
    msg!("Skill created successfully!");
    msg!("Skill ID: {}", skill.skill_id);
    msg!("Creator: {}", ctx.accounts.creator.key());
    msg!("Category: {}", skill.category);
    msg!("Name: {}", skill.name);
    
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