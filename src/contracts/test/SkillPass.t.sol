// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ReputationToken.sol";
import "../src/SkillNFT.sol";
import "../src/SkillStaking.sol";

contract SkillPassTest is Test {
    ReputationToken public reputationToken;
    SkillNFT public skillNFT;
    SkillStaking public skillStaking;
    
    address public owner = makeAddr("owner");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    
    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy contracts
        reputationToken = new ReputationToken();
        skillNFT = new SkillNFT();
        skillStaking = new SkillStaking(address(skillNFT), address(reputationToken));
        
        // Transfer SkillNFT ownership to staking contract
        skillNFT.transferOwnership(address(skillStaking));
        
        // Give alice and bob some reputation tokens
        reputationToken.earnReputation(alice, 1000 * 10**18, "Initial tokens");
        reputationToken.earnReputation(bob, 1000 * 10**18, "Initial tokens");
        
        vm.stopPrank();
    }
    
    function testDeployment() public {
        assertEq(reputationToken.name(), "SkillPass Reputation");
        assertEq(reputationToken.symbol(), "REPR");
        assertEq(skillNFT.name(), "SkillPass");
        assertEq(skillNFT.symbol(), "SKILL");
    }
    
    function testMintSkill() public {
        vm.prank(alice);
        uint256 tokenId = skillNFT.mintSkill(
            "Frontend",
            "React Development",
            "Expert in React.js and modern frontend practices",
            "https://example.com/metadata/1"
        );
        
        assertEq(tokenId, 1);
        assertEq(skillNFT.ownerOf(tokenId), alice);
        
        SkillNFT.Skill memory skill = skillNFT.getSkill(tokenId);
        assertEq(skill.category, "Frontend");
        assertEq(skill.name, "React Development");
        assertEq(skill.creator, alice);
        assertFalse(skill.verified);
    }
    
    function testEndorseSkill() public {
        // Alice mints a skill
        vm.prank(alice);
        uint256 skillId = skillNFT.mintSkill(
            "Frontend",
            "React Development", 
            "Expert in React.js",
            "https://example.com/metadata/1"
        );
        
        // Bob endorses Alice's skill
        uint256 stakeAmount = 100 * 10**18;
        vm.startPrank(bob);
        reputationToken.approve(address(skillStaking), stakeAmount);
        skillStaking.endorseSkill(skillId, stakeAmount, "Worked with Alice on project X");
        vm.stopPrank();
        
        // Check endorsement was recorded
        SkillStaking.Endorsement[] memory endorsements = skillStaking.getSkillEndorsements(skillId);
        assertEq(endorsements.length, 1);
        assertEq(endorsements[0].endorser, bob);
        assertEq(endorsements[0].stakedAmount, stakeAmount);
        assertTrue(endorsements[0].active);
        
        // Check stake info
        SkillStaking.StakeInfo memory stakeInfo = skillStaking.getStakeInfo(skillId);
        assertEq(stakeInfo.totalStaked, stakeAmount);
        assertEq(stakeInfo.endorsementCount, 1);
    }
    
    function testCannotEndorseOwnSkill() public {
        vm.prank(alice);
        uint256 skillId = skillNFT.mintSkill(
            "Frontend",
            "React Development",
            "Expert in React.js", 
            "https://example.com/metadata/1"
        );
        
        uint256 stakeAmount = 100 * 10**18;
        vm.startPrank(alice);
        reputationToken.approve(address(skillStaking), stakeAmount);
        vm.expectRevert("Cannot endorse own skill");
        skillStaking.endorseSkill(skillId, stakeAmount, "Self endorsement");
        vm.stopPrank();
    }
    
    function testReputationSystem() public {
        uint256 initialBalance = reputationToken.balanceOf(alice);
        uint256 initialScore = reputationToken.getReputationScore(alice);
        
        assertEq(initialBalance, 1000 * 10**18);
        assertEq(initialScore, 1000 * 10**18);
        
        // Owner can earn more reputation for alice
        vm.prank(owner);
        reputationToken.earnReputation(alice, 500 * 10**18, "Completed course");
        
        assertEq(reputationToken.balanceOf(alice), 1500 * 10**18);
        assertEq(reputationToken.getReputationScore(alice), 1500 * 10**18);
    }
    
    function testMinimumStakeRequirement() public {
        vm.prank(alice);
        uint256 skillId = skillNFT.mintSkill(
            "Frontend",
            "React Development",
            "Expert in React.js",
            "https://example.com/metadata/1" 
        );
        
        uint256 lowStake = 5 * 10**18; // Below minimum of 10 REPR
        vm.startPrank(bob);
        reputationToken.approve(address(skillStaking), lowStake);
        vm.expectRevert("Minimum stake not met");
        skillStaking.endorseSkill(skillId, lowStake, "Low stake endorsement");
        vm.stopPrank();
    }
} 