// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SkillNFT.sol";
import "./ReputationToken.sol";

/**
 * @title SkillRevenue - Real Investment Platform with Continuous Yields
 * @dev Implements revenue sharing between skill owners and investors
 */
contract SkillRevenue is ReentrancyGuard, Ownable {
    SkillNFT public skillNFT;
    ReputationToken public reputationToken;

    struct InvestmentPool {
        uint256 totalInvested;         // Total REPR tokens invested
        uint256 monthlyRevenue;        // Revenue generated this month  
        uint256 totalRevenueEarned;    // Lifetime revenue
        uint256 lastDistribution;      // Last yield distribution
        uint256 investorCount;         // Number of investors
        uint256 skillOwnerEarnings;    // Skill owner's total earnings
        mapping(address => uint256) investments;
        mapping(address => uint256) lastClaimTime;
        mapping(address => uint256) totalClaimed;
    }

    struct RevenueBreakdown {
        uint256 jobCompletions;        // From completed freelance work
        uint256 platformFees;          // Platform transaction fees
        uint256 subscriptionFees;      // Premium subscriptions
        uint256 verificationFees;      // Professional verifications
    }

    struct YieldMetrics {
        uint256 currentAPY;            // Current annual percentage yield
        uint256 monthlyYield;          // Monthly yield amount
        uint256 averageMonthlyRevenue; // 3-month average
        uint256 riskScore;             // Volatility score (0-100)
    }

    // Core mappings
    mapping(uint256 => InvestmentPool) public pools;
    mapping(uint256 => RevenueBreakdown) public revenueBreakdown;
    mapping(uint256 => YieldMetrics) public yieldMetrics;
    mapping(address => uint256[]) public userInvestments;

    // Platform settings
    uint256 public constant INVESTOR_SHARE = 7000;     // 70% to investors
    uint256 public constant SKILL_OWNER_SHARE = 2000;  // 20% to skill owner
    uint256 public constant PLATFORM_SHARE = 1000;     // 10% to platform
    uint256 public constant MIN_INVESTMENT = 50 * 10**18; // 50 REPR minimum
    uint256 public constant JOB_COMPLETION_FEE = 1000; // 10% of job revenue

    // Platform treasury
    uint256 public platformTreasury;
    
    // Events
    event InvestmentMade(uint256 indexed skillId, address indexed investor, uint256 amount);
    event RevenueAdded(uint256 indexed skillId, uint256 amount, string source);
    event YieldDistributed(uint256 indexed skillId, uint256 totalAmount);
    event YieldClaimed(address indexed investor, uint256 skillId, uint256 amount);
    event APYUpdated(uint256 indexed skillId, uint256 newAPY);

    constructor(address _skillNFT, address _reputationToken) Ownable(msg.sender) {
        skillNFT = SkillNFT(_skillNFT);
        reputationToken = ReputationToken(_reputationToken);
    }

    /**
     * @dev Invest REPR tokens in a skill to earn revenue share
     */
    function investInSkill(uint256 skillId, uint256 amount) external nonReentrant {
        require(amount >= MIN_INVESTMENT, "Below minimum investment");
        // Temporarily disable for testing with single user
        // require(skillNFT.ownerOf(skillId) != msg.sender, "Cannot invest in own skill");
        require(
            reputationToken.transferFrom(msg.sender, address(this), amount),
            "Investment transfer failed"
        );

        InvestmentPool storage pool = pools[skillId];
        
        // Track new investor
        if (pool.investments[msg.sender] == 0) {
            pool.investorCount++;
            userInvestments[msg.sender].push(skillId);
        }
        
        pool.investments[msg.sender] += amount;
        pool.totalInvested += amount;
        pool.lastClaimTime[msg.sender] = block.timestamp;
        
        emit InvestmentMade(skillId, msg.sender, amount);
        _updateYieldMetrics(skillId);
    }

    /**
     * @dev Record job completion revenue (called when skill owner gets paid)
     */
    function recordJobCompletion(
        uint256 skillId, 
        uint256 jobRevenue,
        string memory jobTitle
    ) external onlyOwner {
        require(skillNFT.ownerOf(skillId) != address(0), "Skill doesn't exist");
        
        uint256 platformFee = (jobRevenue * JOB_COMPLETION_FEE) / 10000;
        
        // Distribute revenue
        uint256 investorShare = (platformFee * INVESTOR_SHARE) / 10000;
        uint256 skillOwnerShare = (platformFee * SKILL_OWNER_SHARE) / 10000;
        uint256 platformShare = (platformFee * PLATFORM_SHARE) / 10000;
        
        InvestmentPool storage pool = pools[skillId];
        pool.monthlyRevenue += investorShare;
        pool.totalRevenueEarned += investorShare;
        pool.skillOwnerEarnings += skillOwnerShare;
        platformTreasury += platformShare;
        
        // Update revenue breakdown
        RevenueBreakdown storage breakdown = revenueBreakdown[skillId];
        breakdown.jobCompletions += investorShare;
        
        emit RevenueAdded(skillId, investorShare, jobTitle);
        _updateYieldMetrics(skillId);
    }

    /**
     * @dev Add platform subscription revenue to pools
     */
    function distributePlatformRevenue(uint256[] memory skillIds, uint256 totalRevenue) 
        external onlyOwner {
        
        uint256 revenuePerSkill = totalRevenue / skillIds.length;
        
        for (uint256 i = 0; i < skillIds.length; i++) {
            uint256 skillId = skillIds[i];
            InvestmentPool storage pool = pools[skillId];
            
            if (pool.totalInvested > 0) {
                pool.monthlyRevenue += revenuePerSkill;
                
                RevenueBreakdown storage breakdown = revenueBreakdown[skillId];
                breakdown.platformFees += revenuePerSkill;
                
                emit RevenueAdded(skillId, revenuePerSkill, "platform_revenue");
            }
        }
    }

    /**
     * @dev Claim accumulated yield from investments
     */
    function claimYield(uint256 skillId) external nonReentrant returns (uint256) {
        InvestmentPool storage pool = pools[skillId];
        require(pool.investments[msg.sender] > 0, "No investment in this skill");
        
        uint256 yield = calculatePendingYield(skillId, msg.sender);
        require(yield > 0, "No yield to claim");
        
        pool.lastClaimTime[msg.sender] = block.timestamp;
        pool.totalClaimed[msg.sender] += yield;
        
        require(reputationToken.transfer(msg.sender, yield), "Yield transfer failed");
        
        emit YieldClaimed(msg.sender, skillId, yield);
        return yield;
    }

    /**
     * @dev Calculate pending yield for an investor
     */
    function calculatePendingYield(uint256 skillId, address investor) 
        public view returns (uint256) {
        
        InvestmentPool storage pool = pools[skillId];
        if (pool.totalInvested == 0 || pool.investments[investor] == 0) {
            return 0;
        }
        
        // Calculate investor's share of total pool
        uint256 investorShare = (pool.investments[investor] * 10000) / pool.totalInvested;
        
        // Calculate yield since last claim
        uint256 timeSinceLastClaim = block.timestamp - pool.lastClaimTime[investor];
        uint256 monthsSinceLastClaim = timeSinceLastClaim / 30 days;
        
        // Monthly yield based on revenue
        uint256 monthlyYield = (pool.monthlyRevenue * investorShare) / 10000;
        
        return monthlyYield * monthsSinceLastClaim;
    }

    /**
     * @dev Calculate current APY for a skill investment
     */
    function calculateAPY(uint256 skillId) public view returns (uint256) {
        InvestmentPool storage pool = pools[skillId];
        if (pool.totalInvested == 0) return 0;
        
        // Monthly return as basis points
        uint256 monthlyReturn = (pool.monthlyRevenue * 10000) / pool.totalInvested;
        
        // Annualized return
        return monthlyReturn * 12;
    }

    /**
     * @dev Get comprehensive investment data for UI
     */
    function getInvestmentData(uint256 skillId) 
        external view returns (
            uint256 totalInvested,
            uint256 currentAPY,
            uint256 monthlyRevenue,
            uint256 investorCount,
            RevenueBreakdown memory revenue,
            YieldMetrics memory metrics
        ) {
        
        return (
            pools[skillId].totalInvested,
            calculateAPY(skillId),
            pools[skillId].monthlyRevenue,
            pools[skillId].investorCount,
            revenueBreakdown[skillId],
            yieldMetrics[skillId]
        );
    }

    /**
     * @dev Get investor's portfolio across all skills
     */
    function getInvestorPortfolio(address investor) 
        external view returns (
            uint256[] memory skillIds,
            uint256[] memory investments,
            uint256[] memory pendingYields,
            uint256 totalInvested,
            uint256 totalEarned
        ) {
        
        uint256[] memory userSkills = userInvestments[investor];
        uint256 length = userSkills.length;
        
        skillIds = new uint256[](length);
        investments = new uint256[](length);
        pendingYields = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 skillId = userSkills[i];
            skillIds[i] = skillId;
            investments[i] = pools[skillId].investments[investor];
            pendingYields[i] = calculatePendingYield(skillId, investor);
            totalInvested += investments[i];
            totalEarned += pools[skillId].totalClaimed[investor];
        }
        
        return (skillIds, investments, pendingYields, totalInvested, totalEarned);
    }

    /**
     * @dev Internal function to update yield metrics
     */
    function _updateYieldMetrics(uint256 skillId) internal {
        YieldMetrics storage metrics = yieldMetrics[skillId];
        metrics.currentAPY = calculateAPY(skillId);
        metrics.monthlyYield = pools[skillId].monthlyRevenue;
        
        emit APYUpdated(skillId, metrics.currentAPY);
    }

    /**
     * @dev Emergency withdrawal for investors (with penalty)
     */
    function emergencyWithdraw(uint256 skillId) external nonReentrant {
        InvestmentPool storage pool = pools[skillId];
        uint256 investment = pool.investments[msg.sender];
        require(investment > 0, "No investment found");
        
        // 10% penalty for emergency withdrawal
        uint256 penalty = (investment * 1000) / 10000;
        uint256 withdrawAmount = investment - penalty;
        
        pool.investments[msg.sender] = 0;
        pool.totalInvested -= investment;
        platformTreasury += penalty;
        
        require(reputationToken.transfer(msg.sender, withdrawAmount), "Withdrawal failed");
    }

    /**
     * @dev Platform management functions
     */
    function withdrawPlatformTreasury(address to, uint256 amount) external onlyOwner {
        require(amount <= platformTreasury, "Insufficient treasury");
        platformTreasury -= amount;
        require(reputationToken.transfer(to, amount), "Transfer failed");
    }
} 