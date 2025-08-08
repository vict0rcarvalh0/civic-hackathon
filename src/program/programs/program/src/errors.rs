use anchor_lang::prelude::*;

#[error_code]
pub enum SkillPassError {
    #[msg("Insufficient reputation tokens")]
    InsufficientReputationTokens,
    
    #[msg("Maximum reputation supply exceeded")]
    MaxReputationSupplyExceeded,
    
    #[msg("Below minimum investment amount")]
    BelowMinimumInvestment,
    
    #[msg("Below minimum stake amount")]
    BelowMinimumStake,
    
    #[msg("Cannot invest in own skill")]
    CannotInvestInOwnSkill,
    
    #[msg("Cannot endorse own skill")]
    CannotEndorseOwnSkill,
    
    #[msg("Already endorsed this skill")]
    AlreadyEndorsed,
    
    #[msg("No endorsements to challenge")]
    NoEndorsementsToChallenge,
    
    #[msg("Already challenged")]
    AlreadyChallenged,
    
    #[msg("Insufficient reputation to challenge")]
    InsufficientReputationToChallenge,
    
    #[msg("Skill not challenged")]
    SkillNotChallenged,
    
    #[msg("Challenge period not ended")]
    ChallengePeriodNotEnded,
    
    #[msg("No rewards to claim")]
    NoRewardsToClaim,
    
    #[msg("No investment in this skill")]
    NoInvestmentInSkill,
    
    #[msg("No yield to claim")]
    NoYieldToClaim,
    
    #[msg("Skill doesn't exist")]
    SkillDoesNotExist,
    
    #[msg("Invalid skill ID")]
    InvalidSkillId,
    
    #[msg("Unauthorized operation")]
    Unauthorized,
    
    #[msg("Invalid amount")]
    InvalidAmount,
    
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
} 