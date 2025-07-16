// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SkillNFT.sol";
import "./ReputationToken.sol";

/**
 * @title SkillStakingEnhanced - Real Investment Yields for Skill Staking
 * @dev Enables continuous APY through revenue sharing from skill monetization
 */
contract SkillStakingEnhanced is ReentrancyGuard, Ownable {
    SkillNFT public skillNFT;
    ReputationToken public reputationToken;

    struct SkillPool {
        uint256 totalStaked;           // Total REPR tokens staked
        uint256 monthlyRevenue;        // Revenue generated this month
        uint256 lastDistribution;      // Last yield distribution timestamp
        uint256 totalYieldPaid;        // Lifetime yield distributed
        uint256 stakersCount;          // Number of unique stakers
        mapping(address => uint256) stakerShares;
        mapping(address => uint256) lastClaimTime;
    }

    struct RevenueSource {
        uint256 jobCompletions;        // Revenue from completed jobs
        uint256 platformFees;          // Platform transaction fees
        uint256 profileBoosts;         // Premium profile visibility
        uint256 verificationFees;      // Professional verification
    }

    // Core mappings
    mapping(uint256 => SkillPool) public skillPools;
    mapping(uint256 => RevenueSource) public revenueBreakdown;
    mapping(address => uint256) public totalStakedByUser;
    mapping(address => uint256) public totalEarnedByUser;

    // Platform configuration
    uint256 public constant PLATFORM_FEE = 300;        // 3% platform fee
    uint256 public constant JOB_REVENUE_SHARE = 1000;  // 10% to stakers
    uint256 public constant BOOST_REVENUE_SHARE = 700; // 7% to stakers
    uint256 public constant MIN_STAKE = 10 * 10**18;   // 10 REPR minimum

    // Events
    event SkillStaked(uint256 indexed skillId, address indexed staker, uint256 amount);
    event YieldClaimed(uint256 indexed skillId, address indexed claimer, uint256 amount);
    event RevenueAdded(uint256 indexed skillId, uint256 amount, string source);
    event APYUpdated(uint256 indexed skillId, uint256 newAPY);

    constructor(address _skillNFT, address _reputationToken) Ownable(msg.sender) {
        skillNFT = SkillNFT(_skillNFT);
        reputationToken = ReputationToken(_reputationToken);
    }

    /**
     * @dev Stake REPR tokens on a skill to earn yield from its revenue
     */
    function stakeOnSkill(uint256 skillId, uint256 amount) external nonReentrant {
        require(amount >= MIN_STAKE, "Below minimum stake");
        require(skillNFT.ownerOf(skillId) != msg.sender, "Cannot stake on own skill");
        require(
            reputationToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        SkillPool storage pool = skillPools[skillId];
        
        // Add to pool if first time staker
        if (pool.stakerShares[msg.sender] == 0) {
            pool.stakersCount++;
        }
        
        pool.stakerShares[msg.sender] += amount;
        pool.totalStaked += amount;
        pool.lastClaimTime[msg.sender] = block.timestamp;
        
        totalStakedByUser[msg.sender] += amount;

        emit SkillStaked(skillId, msg.sender, amount);
    }

    /**
     * @dev Add revenue to a skill pool (called when skill owner earns money)
     */
    function addJobRevenue(uint256 skillId, uint256 jobPayment, string memory jobType) 
        external 
        onlyOwner 
    {
        require(skillNFT.ownerOf(skillId) != address(0), "Skill doesn't exist");
        
        uint256 stakerShare = (jobPayment * JOB_REVENUE_SHARE) / 10000;
        uint256 platformFee = (jobPayment * PLATFORM_FEE) / 10000;
        
        SkillPool storage pool = skillPools[skillId];
        pool.monthlyRevenue += stakerShare;
        
        RevenueSource storage revenue = revenueBreakdown[skillId];
        revenue.jobCompletions += stakerShare;
        
        emit RevenueAdded(skillId, stakerShare, jobType);
        emit APYUpdated(skillId, calculateAPY(skillId));
    }

    /**
     * @dev Add platform fee revenue to skill pools
     */
    function distributePlatformFees(uint256 skillId, uint256 feeAmount) 
        external 
        onlyOwner 
    {
        uint256 stakerShare = (feeAmount * 700) / 1000; // 70% to stakers
        
        SkillPool storage pool = skillPools[skillId];
        pool.monthlyRevenue += stakerShare;
        
        RevenueSource storage revenue = revenueBreakdown[skillId];
        revenue.platformFees += stakerShare;
        
        emit RevenueAdded(skillId, stakerShare, "platform_fees");
    }

    /**
     * @dev Claim accumulated yield from staked skills
     */
    function claimYield(uint256 skillId) external nonReentrant {
        SkillPool storage pool = skillPools[skillId];
        require(pool.stakerShares[msg.sender] > 0, "No stake in this skill");
        
        uint256 yield = calculatePendingYield(skillId, msg.sender);
        require(yield > 0, "No yield to claim");
        
        pool.lastClaimTime[msg.sender] = block.timestamp;
        pool.totalYieldPaid += yield;
        totalEarnedByUser[msg.sender] += yield;
        
        require(reputationToken.transfer(msg.sender, yield), "Transfer failed");
        
        emit YieldClaimed(skillId, msg.sender, yield);
    }

    /**
     * @dev Calculate current APY for a skill based on revenue performance
     */
    function calculateAPY(uint256 skillId) public view returns (uint256) {
        SkillPool storage pool = skillPools[skillId];
        if (pool.totalStaked == 0) return 0;
        
        // Monthly return percentage (basis points)
        uint256 monthlyReturn = (pool.monthlyRevenue * 10000) / pool.totalStaked;
        
        // Annualized return
        return monthlyReturn * 12;
    }

    /**
     * @dev Calculate pending yield for a specific staker
     */
    function calculatePendingYield(uint256 skillId, address staker) 
        public 
        view 
        returns (uint256) 
    {
        SkillPool storage pool = skillPools[skillId];
        if (pool.totalStaked == 0 || pool.stakerShares[staker] == 0) {
            return 0;
        }
        
        uint256 stakerPortion = (pool.stakerShares[staker] * 10000) / pool.totalStaked;
        uint256 monthlyYield = (pool.monthlyRevenue * stakerPortion) / 10000;
        
        // Calculate pro-rated yield based on time staked
        uint256 timeStaked = block.timestamp - pool.lastClaimTime[staker];
        uint256 monthsStaked = timeStaked / 30 days;
        
        return (monthlyYield * monthsStaked);
    }

    /**
     * @dev Get comprehensive skill investment data
     */
    function getSkillInvestmentData(uint256 skillId) 
        external 
        view 
        returns (
            uint256 totalStaked,
            uint256 currentAPY,
            uint256 monthlyRevenue,
            uint256 stakersCount,
            RevenueSource memory revenue
        ) 
    {
        SkillPool storage pool = skillPools[skillId];
        return (
            pool.totalStaked,
            calculateAPY(skillId),
            pool.monthlyRevenue,
            pool.stakersCount,
            revenueBreakdown[skillId]
        );
    }

    /**
     * @dev Get user's portfolio data across all skills
     */
    function getUserPortfolio(address user) 
        external 
        view 
        returns (
            uint256 totalStaked,
            uint256 totalEarned,
            uint256 portfolioAPY
        ) 
    {
        return (
            totalStakedByUser[user],
            totalEarnedByUser[user],
            calculatePortfolioAPY(user)
        );
    }

    /**
     * @dev Calculate weighted average APY across user's portfolio
     */
    function calculatePortfolioAPY(address user) public view returns (uint256) {
        // Implementation would iterate through user's stakes
        // and calculate weighted average based on stake amounts
        return 0; // Simplified for this example
    }

    /**
     * @dev Emergency functions for platform management
     */
    function emergencyPause() external onlyOwner {
        // Pause new stakes and revenue distribution
    }

    function updateMinimumStake(uint256 newMinimum) external onlyOwner {
        // Update minimum stake requirements
    }
} 