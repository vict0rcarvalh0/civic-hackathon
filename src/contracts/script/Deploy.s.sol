// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ReputationToken.sol";
import "../src/SkillNFT.sol";
import "../src/SkillStaking.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ReputationToken first
        ReputationToken reputationToken = new ReputationToken();
        console.log("ReputationToken deployed at:", address(reputationToken));

        // Deploy SkillNFT
        SkillNFT skillNFT = new SkillNFT();
        console.log("SkillNFT deployed at:", address(skillNFT));

        // Deploy SkillStaking with addresses of the previous contracts
        SkillStaking skillStaking = new SkillStaking(
            address(skillNFT),
            address(reputationToken)
        );
        console.log("SkillStaking deployed at:", address(skillStaking));

        // Transfer ownership of SkillNFT to SkillStaking for metric updates
        skillNFT.transferOwnership(address(skillStaking));
        console.log("SkillNFT ownership transferred to SkillStaking");

        vm.stopBroadcast();

        // Log deployment addresses for easy integration
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("ReputationToken:", address(reputationToken));
        console.log("SkillNFT:", address(skillNFT));
        console.log("SkillStaking:", address(skillStaking));
        console.log("===============================");
    }
} 