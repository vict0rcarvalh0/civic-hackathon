use anchor_lang::prelude::*;

#[error_code]
pub enum SkillPassError {
    #[msg("Insufficient reputation tokens")]
    InsufficientReputationTokens,
    
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
    
    #[msg("Skill does not exist")]
    SkillDoesNotExist,
    
    #[msg("Investment pool does not exist")]
    InvestmentPoolDoesNotExist,
    
    #[msg("No investment found")]
    NoInvestmentFound,
    
    #[msg("No yield to claim")]
    NoYieldToClaim,
    
    #[msg("No rewards to claim")]
    NoRewardsToClaim,
    
    #[msg("Challenge period not ended")]
    ChallengePeriodNotEnded,
    
    #[msg("Skill not challenged")]
    SkillNotChallenged,
    
    #[msg("Insufficient reputation to challenge")]
    InsufficientReputationToChallenge,
    
    #[msg("Cannot withdraw during active challenge")]
    CannotWithdrawDuringActiveChallenge,
    
    #[msg("Max supply exceeded")]
    MaxSupplyExceeded,
    
    #[msg("Invalid skill ID")]
    InvalidSkillId,
    
    #[msg("Invalid amount")]
    InvalidAmount,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Invalid mint")]
    InvalidMint,
    
    #[msg("Invalid token account")]
    InvalidTokenAccount,
    
    #[msg("Transfer failed")]
    TransferFailed,
    
    #[msg("Invalid metadata")]
    InvalidMetadata,
    
    #[msg("Invalid treasury")]
    InvalidTreasury,
    
    #[msg("Invalid program state")]
    InvalidProgramState,
} 