use anchor_lang::prelude::*;

declare_id!("GnaNCjWTV5Zv3AoLwQKppZLLUjuQPjqrJTKEs8HqVj9q");

#[program]
pub mod skillpass {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.authority = ctx.accounts.authority.key();
        program_state.total_skills = 0;
        program_state.total_investments = 0;
        program_state.total_revenue = 0;
        
        msg!("SkillPass program initialized successfully!");
        Ok(())
    }

    pub fn mint_reputation_tokens(
        ctx: Context<MintReputationTokens>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        let reputation_state = &mut ctx.accounts.reputation_state;
        reputation_state.user = ctx.accounts.user.key();
        reputation_state.reputation_score += amount;
        reputation_state.total_earned += amount;
        
        msg!("Minted {} reputation tokens to {}", amount, ctx.accounts.user.key());
        msg!("Reason: {}", reason);
        
        Ok(())
    }

    pub fn create_skill(
        ctx: Context<CreateSkill>,
        category: String,
        name: String,
        description: String,
        metadata_uri: String,
    ) -> Result<()> {
        let skill = &mut ctx.accounts.skill;
        skill.creator = ctx.accounts.creator.key();
        skill.category = category;
        skill.name = name;
        skill.description = description;
        skill.metadata_uri = metadata_uri;
        skill.verified = false;
        skill.skill_id = ctx.accounts.program_state.total_skills + 1;
        
        ctx.accounts.program_state.total_skills += 1;
        
        msg!("Skill created successfully!");
        msg!("Skill ID: {}", skill.skill_id);
        msg!("Creator: {}", ctx.accounts.creator.key());
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 8,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintReputationTokens<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 8 + 8,
        seeds = [b"reputation_state", user.key().as_ref()],
        bump
    )]
    pub reputation_state: Account<'info, ReputationState>,
    
    /// CHECK: This is the user who will receive reputation tokens
    pub user: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CreateSkill<'info> {
    #[account(mut, seeds = [b"program_state"], bump)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 32 + 64 + 64 + 64 + 64 + 8 + 8 + 8 + 1 + 8 + 1,
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

#[account]
pub struct ProgramState {
    pub authority: Pubkey,
    pub total_skills: u64,
    pub total_investments: u64,
    pub total_revenue: u64,
}

#[account]
pub struct ReputationState {
    pub user: Pubkey,
    pub reputation_score: u64,
    pub last_activity: i64,
    pub total_earned: u64,
    pub total_slashed: u64,
}

#[account]
pub struct Skill {
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
}
