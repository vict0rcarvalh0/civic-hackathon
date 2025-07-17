# SkillPass Smart Contracts Deployment

> **Last Updated**: July 16, 2025 - Latest deployment with self-investment fix

## Contract Addresses 

### Sepolia Testnet (Production)
- **ReputationToken**: `0x0b01D922072bE2EDe46154120e2791ae389f70c6`
- **SkillNFT**: `0x6E3C6eC404381a0DC312dbe79FDC544e0639427F`
- **SkillRevenue**: `0xD80B39C6D68d4F137BDb69232d26a88ad26a42E8` (Investment Platform)
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: `https://eth-sepolia.public.blastapi.io`

### Local Anvil Testnet (Development)
- **ReputationToken**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **SkillNFT**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **SkillRevenue**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` (Investment Platform)
- **Network**: Anvil (localhost:8545)
- **Chain ID**: 31337

## Enhanced Investment Platform Features

### SkillRevenue Contract (NEW)
Replaces the old SkillStaking contract with genuine investment functionality:

- **Real Revenue Sharing**: 7% of skill owner job payments → investors
- **Monthly Yield Distribution**: Automatic yield claiming mechanism
- **Platform Fee Distribution**: Revenue from transaction fees shared with investors  
- **Portfolio Management**: Investment tracking, risk assessment, performance metrics
- **APY Calculations**: 15-45% based on skill performance and platform activity

### Revenue Sources
1. **Job Completions (70%)**: Direct from freelance work completed by skill owners
2. **Platform Fees (20%)**: Transaction fees, verification fees, premium subscriptions
3. **Performance Bonuses (10%)**: Endorsements, achievements, skill validations

## Deployment Instructions

### Prerequisites
- Foundry installed (`curl -L https://foundry.paradigm.xyz | bash`)
- Funded wallet with testnet ETH for Sepolia or local ETH for Anvil

### 1. Local Development (Anvil)

```bash
# Start Anvil
anvil --port 8545 --chain-id 31337 --accounts 10 --balance 10000

# Deploy contracts
cd src/contracts
forge script script/DeployRevenue.s.sol:DeployRevenueScript \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

### 2. Sepolia Testnet

```bash
# Set environment variables
export PRIVATE_KEY="your_private_key_with_sepolia_eth"
export SEPOLIA_RPC_URL="https://eth-sepolia.public.blastapi.io"

# Deploy contracts  
forge script script/DeployRevenue.s.sol:DeployRevenueScript \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### 3. Get Sepolia ETH
- **Faucet**: https://sepolia-faucet.pk910.de/
- **Alchemy Faucet**: https://sepoliafaucet.com/
- **Coinbase Wallet**: Use built-in faucet

## Contract Integration

### Frontend Configuration
The contract addresses are automatically configured in `lib/contracts.ts`:

```typescript
import { getNetworkConfig } from '@/lib/contracts'

// Auto-detects network and uses appropriate addresses
const config = getNetworkConfig() // Defaults to Sepolia
const { ReputationToken, SkillNFT, SkillRevenue } = config
```

### Environment Variables (Optional)
```bash
# .env.local
NEXT_PUBLIC_ETHEREUM_RPC_ENDPOINT="https://eth-sepolia.public.blastapi.io"
NEXT_PUBLIC_CHAIN_ID="11155111"
```

## Contract Verification

### Etherscan Verification
```bash
forge verify-contract \
  --chain-id 11155111 \
  --compiler-version v0.8.20 \
  <CONTRACT_ADDRESS> \
  src/SkillRevenue.sol:SkillRevenue \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## Migration from Legacy Staking

### Breaking Changes
- `SkillStaking` contract is **DEPRECATED**
- `endorseSkill()` → `investInSkill()`
- `getStakeInfo()` → `getSkillPerformance()`
- `claimRewards()` → `claimYield()`

### API Changes
```typescript
// OLD (SkillStaking)
await contract.endorseSkill(skillId, amount, evidence)
await contract.claimRewards()

// NEW (SkillRevenue) 
await contract.investInSkill(skillId, amount)
await contract.claimYield(skillId)
```

## Testing

### Unit Tests
```bash
forge test -vvv
```

### Integration Tests
```bash
forge test --match-contract SkillRevenueTest -vvv
```

### Gas Reports
```bash
forge test --gas-report
``` 