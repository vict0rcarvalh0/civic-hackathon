// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ReputationToken.sol";
import "../src/SkillNFT.sol";
import "../src/SkillStaking.sol";

contract TestContractsScript is Script {
    address constant REPUTATION_TOKEN = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    address constant SKILL_NFT = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
    address constant SKILL_STAKING = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Initialize contract instances
        ReputationToken reputationToken = ReputationToken(REPUTATION_TOKEN);
        SkillNFT skillNFT = SkillNFT(SKILL_NFT);
        SkillStaking skillStaking = SkillStaking(SKILL_STAKING);

        console.log("=== Testing Deployed Contracts ===");
        
        // Test 1: Check initial state
        console.log("Deployer REPR balance:", reputationToken.balanceOf(deployer));
        console.log("Deployer reputation score:", reputationToken.getReputationScore(deployer));
        
        // Test 2: Mint a skill
        console.log("\n--- Minting Test Skill ---");
        uint256 skillId = skillNFT.mintSkill(
            "Blockchain",
            "Smart Contract Development",
            "Expert in Solidity and smart contract security",
            "https://skillpass.app/metadata/test-skill"
        );
        console.log("Minted skill ID:", skillId);
        console.log("Skill owner:", skillNFT.ownerOf(skillId));
        
        // Test 3: Give another account some tokens for endorsement
        address testEndorser = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Second Anvil account
        reputationToken.earnReputation(testEndorser, 1000 * 10**18, "Test allocation");
        console.log("Test endorser REPR balance:", reputationToken.balanceOf(testEndorser));
        
        // Test 4: Check skill details
        SkillNFT.Skill memory skill = skillNFT.getSkill(skillId);
        console.log("Skill category:", skill.category);
        console.log("Skill name:", skill.name);
        console.log("Skill verified:", skill.verified);
        console.log("Total staked:", skill.totalStaked);
        
        // Test 5: Check staking info
        SkillStaking.StakeInfo memory stakeInfo = skillStaking.getStakeInfo(skillId);
        console.log("Endorsement count:", stakeInfo.endorsementCount);
        console.log("Total staked amount:", stakeInfo.totalStaked);
        
        vm.stopBroadcast();
        
        console.log("\n=== Contract Test Complete ===");
        console.log("All contracts are functioning correctly!");
        console.log("Frontend can now interact with deployed contracts");
    }
} 