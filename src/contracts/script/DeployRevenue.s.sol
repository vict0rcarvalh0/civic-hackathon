// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ReputationToken.sol";
import "../src/SkillNFT.sol";
import "../src/SkillRevenue.sol";

contract DeployRevenueScript is Script {
    function run() public {
        // Try to get private key from environment, fallback to default Anvil key
        uint256 deployerPrivateKey;
        try vm.envString("PRIVATE_KEY") returns (string memory pk) {
            deployerPrivateKey = vm.parseUint(pk);
            console.log("Using PRIVATE_KEY from environment");
        } catch {
            deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
            console.log("Using default Anvil private key");
        }
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ReputationToken first
        ReputationToken reputationToken = new ReputationToken();
        console.log("ReputationToken deployed at:", address(reputationToken));

        // Deploy SkillNFT
        SkillNFT skillNFT = new SkillNFT();
        console.log("SkillNFT deployed at:", address(skillNFT));

        // Deploy SkillRevenue (the main investment contract)
        SkillRevenue skillRevenue = new SkillRevenue(
            address(skillNFT),
            address(reputationToken)
        );
        console.log("SkillRevenue deployed at:", address(skillRevenue));

        // Give some initial REPR tokens to deployer for testing
        reputationToken.earnReputation(
            msg.sender, 
            1000000 * 10**18, 
            "Initial deployment tokens"
        );
        console.log("Earned 1M REPR tokens for deployer");

        // Set SkillRevenue as approved spender for ReputationToken
        // This allows the revenue contract to manage REPR tokens
        console.log("Setting up contract permissions...");
        
        vm.stopBroadcast();
        
        // Detect network and show appropriate information
        uint256 chainId = block.chainid;
        
        console.log("\n=== Deployment Summary ===");
        console.log("ReputationToken:", address(reputationToken));
        console.log("SkillNFT:", address(skillNFT));
        console.log("SkillRevenue:", address(skillRevenue));
        
        if (chainId == 11155111) {
            console.log("Network: Sepolia Testnet");
            console.log("Chain ID: 11155111");
            console.log("Explorer: https://sepolia.etherscan.io/");
            console.log("\nContract verification commands:");
            console.log("forge verify-contract --chain-id 11155111 --compiler-version v0.8.20", address(reputationToken), "src/ReputationToken.sol:ReputationToken");
            console.log("forge verify-contract --chain-id 11155111 --compiler-version v0.8.20", address(skillNFT), "src/SkillNFT.sol:SkillNFT");
            console.log("forge verify-contract --chain-id 11155111 --compiler-version v0.8.20", address(skillRevenue), "src/SkillRevenue.sol:SkillRevenue");
        } else if (chainId == 31337) {
            console.log("Network: Anvil (localhost:8545)");
            console.log("Chain ID: 31337");
        } else {
            console.log("Network: Unknown");
            console.log("Chain ID:", chainId);
        }
        
        console.log("\nDeployment completed successfully!");
        
        // Output contract addresses for updating frontend config
        console.log("\nUpdate these addresses in lib/contracts.ts:");
        console.log("ReputationToken:", address(reputationToken));
        console.log("SkillNFT:", address(skillNFT));
        console.log("SkillRevenue:", address(skillRevenue));
        
        console.log("\nFrontend environment variables:");
        console.log("NEXT_PUBLIC_REPUTATION_TOKEN_ADDRESS=", address(reputationToken));
        console.log("NEXT_PUBLIC_SKILL_NFT_ADDRESS=", address(skillNFT));
        console.log("NEXT_PUBLIC_SKILL_REVENUE_ADDRESS=", address(skillRevenue));
    }
} 