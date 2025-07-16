// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SkillNFT.sol";
import "./ReputationToken.sol";

contract SkillStaking is ReentrancyGuard, Ownable {
    SkillNFT public skillNFT;
    ReputationToken public reputationToken;

    struct Endorsement {
        address endorser;
        uint256 stakedAmount;
        uint256 timestamp;
        bool active;
        string evidence;
    }

    struct StakeInfo {
        uint256 totalStaked;
        uint256 endorsementCount;
        uint256 averageStake;
        bool challenged;
        uint256 challengeEndTime;
    }

    mapping(uint256 => Endorsement[]) public skillEndorsements;
    mapping(uint256 => StakeInfo) public skillStakes;
    mapping(uint256 => mapping(address => bool)) public hasEndorsed;
    mapping(address => uint256) public stakerRewards;

    uint256 public constant MIN_STAKE = 10 * 10**18; // 10 REPR minimum
    uint256 public constant CHALLENGE_PERIOD = 7 days;
    uint256 public constant SLASH_PERCENTAGE = 50; // 50% slash on false endorsement
    uint256 public constant REWARD_PERCENTAGE = 10; // 10% reward for correct endorsement

    event SkillEndorsed(
        uint256 indexed skillId,
        address indexed endorser,
        uint256 stakedAmount,
        string evidence
    );

    event EndorsementChallenged(
        uint256 indexed skillId,
        address indexed challenger,
        uint256 challengeEndTime
    );

    event SkillValidated(
        uint256 indexed skillId,
        bool validated,
        uint256 totalReward,
        uint256 totalSlashed
    );

    event RewardsDistributed(
        uint256 indexed skillId,
        address indexed recipient,
        uint256 amount
    );

    constructor(address _skillNFT, address _reputationToken) {
        skillNFT = SkillNFT(_skillNFT);
        reputationToken = ReputationToken(_reputationToken);
    }

    function endorseSkill(
        uint256 skillId,
        uint256 stakeAmount,
        string memory evidence
    ) external nonReentrant {
        require(skillNFT.ownerOf(skillId) != msg.sender, "Cannot endorse own skill");
        require(stakeAmount >= MIN_STAKE, "Minimum stake not met");
        require(!hasEndorsed[skillId][msg.sender], "Already endorsed this skill");
        require(
            reputationToken.balanceOf(msg.sender) >= stakeAmount,
            "Insufficient reputation tokens"
        );

        // Transfer stake to contract
        reputationToken.transferFrom(msg.sender, address(this), stakeAmount);

        // Record endorsement
        skillEndorsements[skillId].push(Endorsement({
            endorser: msg.sender,
            stakedAmount: stakeAmount,
            timestamp: block.timestamp,
            active: true,
            evidence: evidence
        }));

        hasEndorsed[skillId][msg.sender] = true;

        // Update stake info
        StakeInfo storage stakeInfo = skillStakes[skillId];
        stakeInfo.totalStaked += stakeAmount;
        stakeInfo.endorsementCount += 1;
        stakeInfo.averageStake = stakeInfo.totalStaked / stakeInfo.endorsementCount;

        // Update skill NFT metrics
        skillNFT.updateSkillMetrics(skillId, stakeInfo.totalStaked, stakeInfo.endorsementCount);

        emit SkillEndorsed(skillId, msg.sender, stakeAmount, evidence);
    }

    function challengeSkill(uint256 skillId) external {
        require(skillStakes[skillId].totalStaked > 0, "No endorsements to challenge");
        require(!skillStakes[skillId].challenged, "Already challenged");
        require(
            reputationToken.getReputationScore(msg.sender) >= 1000 * 10**18,
            "Insufficient reputation to challenge"
        );

        skillStakes[skillId].challenged = true;
        skillStakes[skillId].challengeEndTime = block.timestamp + CHALLENGE_PERIOD;

        emit EndorsementChallenged(skillId, msg.sender, skillStakes[skillId].challengeEndTime);
    }

    function resolveChallenge(uint256 skillId, bool skillIsValid) external onlyOwner {
        require(skillStakes[skillId].challenged, "Skill not challenged");
        require(
            block.timestamp >= skillStakes[skillId].challengeEndTime,
            "Challenge period not ended"
        );

        Endorsement[] storage endorsements = skillEndorsements[skillId];
        uint256 totalReward = 0;
        uint256 totalSlashed = 0;

        for (uint256 i = 0; i < endorsements.length; i++) {
            if (!endorsements[i].active) continue;

            if (skillIsValid) {
                // Reward correct endorsers
                uint256 reward = (endorsements[i].stakedAmount * REWARD_PERCENTAGE) / 100;
                totalReward += reward;
                stakerRewards[endorsements[i].endorser] += endorsements[i].stakedAmount + reward;
            } else {
                // Slash incorrect endorsers
                uint256 slashAmount = (endorsements[i].stakedAmount * SLASH_PERCENTAGE) / 100;
                totalSlashed += slashAmount;
                uint256 returnAmount = endorsements[i].stakedAmount - slashAmount;
                if (returnAmount > 0) {
                    stakerRewards[endorsements[i].endorser] += returnAmount;
                }
            }
            endorsements[i].active = false;
        }

        // Reset stake info
        skillStakes[skillId].challenged = false;
        skillStakes[skillId].totalStaked = 0;
        skillStakes[skillId].endorsementCount = 0;

        emit SkillValidated(skillId, skillIsValid, totalReward, totalSlashed);
    }

    function claimRewards() external nonReentrant {
        uint256 reward = stakerRewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        stakerRewards[msg.sender] = 0;
        reputationToken.transfer(msg.sender, reward);

        emit RewardsDistributed(0, msg.sender, reward);
    }

    function getSkillEndorsements(uint256 skillId) external view returns (Endorsement[] memory) {
        return skillEndorsements[skillId];
    }

    function getStakeInfo(uint256 skillId) external view returns (StakeInfo memory) {
        return skillStakes[skillId];
    }

    function getActiveEndorsements(uint256 skillId) external view returns (uint256) {
        Endorsement[] memory endorsements = skillEndorsements[skillId];
        uint256 count = 0;
        
        for (uint256 i = 0; i < endorsements.length; i++) {
            if (endorsements[i].active) {
                count++;
            }
        }
        
        return count;
    }

    function emergencyWithdraw(uint256 skillId) external {
        require(hasEndorsed[skillId][msg.sender], "No endorsement found");
        
        Endorsement[] storage endorsements = skillEndorsements[skillId];
        for (uint256 i = 0; i < endorsements.length; i++) {
            if (endorsements[i].endorser == msg.sender && endorsements[i].active) {
                // Only allow emergency withdrawal if no challenge or challenge period expired
                require(
                    !skillStakes[skillId].challenged || 
                    block.timestamp > skillStakes[skillId].challengeEndTime + 30 days,
                    "Cannot withdraw during active challenge"
                );
                
                endorsements[i].active = false;
                skillStakes[skillId].totalStaked -= endorsements[i].stakedAmount;
                skillStakes[skillId].endorsementCount -= 1;
                
                reputationToken.transfer(msg.sender, endorsements[i].stakedAmount);
                break;
            }
        }
    }
} 