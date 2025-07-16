#!/bin/bash

# SkillPass Sepolia Deployment Script
# This script deploys the enhanced SkillRevenue contracts to Sepolia testnet

set -e

echo "🚀 SkillPass Sepolia Deployment"
echo "================================"

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    echo "💡 Set your private key: export PRIVATE_KEY=your_private_key_here"
    echo "💡 Get Sepolia ETH from: https://sepolia-faucet.pk910.de/"
    exit 1
fi

# Set Sepolia RPC URL
SEPOLIA_RPC=${SEPOLIA_RPC_URL:-"https://eth-sepolia.public.blastapi.io"}
echo "🌐 Using RPC: $SEPOLIA_RPC"

# Check if account has balance
echo "💰 Checking account balance..."
BALANCE=$(cast balance --rpc-url $SEPOLIA_RPC $(cast wallet address --private-key $PRIVATE_KEY))
if [ "$BALANCE" = "0" ]; then
    echo "❌ Error: Account has no Sepolia ETH"
    echo "💡 Get testnet ETH from:"
    echo "   - https://sepolia-faucet.pk910.de/"
    echo "   - https://sepoliafaucet.com/"
    echo "   - https://faucet.quicknode.com/ethereum/sepolia"
    exit 1
fi

echo "✅ Account balance: $(cast from-wei $BALANCE) ETH"

# Deploy contracts
echo "📦 Deploying contracts to Sepolia..."
forge script script/DeployRevenue.s.sol:DeployRevenueScript \
    --rpc-url $SEPOLIA_RPC \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key ${ETHERSCAN_API_KEY:-""}

echo ""
echo "🎉 Deployment completed!"
echo "📋 Next steps:"
echo "   1. Update contract addresses in lib/contracts.ts"
echo "   2. Test the contracts on Sepolia testnet"
echo "   3. Update frontend to use new addresses"
echo ""
echo "📍 Sepolia Explorer: https://sepolia.etherscan.io/" 