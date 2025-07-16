# SkillPass Smart Contracts Deployment

## Contract Addresses (Local Anvil Testnet)

- **ReputationToken**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **SkillNFT**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **SkillStaking**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Network**: Anvil (localhost:8545)
- **Chain ID**: 31337

## Contract Overview

### ReputationToken (ERC20)
- **Symbol**: REPR
- **Decimals**: 18
- **Initial Supply**: 10M tokens
- **Max Supply**: 100M tokens
- **Features**: 
  - Reputation scoring system
  - Activity tracking
  - Owner-controlled minting/burning

### SkillNFT (ERC721)
- **Symbol**: SKILL
- **Features**:
  - Skill categorization
  - Verification system
  - Metadata storage
  - Creator tracking

### SkillStaking
- **Features**:
  - Skill endorsements with token staking
  - Challenge/dispute mechanism
  - Reward distribution
  - Minimum stake: 10 REPR tokens

## Deployment Instructions

### Prerequisites
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone and setup
git clone <repo>
cd contracts
forge install
```

### Local Deployment
```bash
# Start local blockchain
anvil --host 0.0.0.0 --port 8545

# Deploy contracts
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### Testing
```bash
# Run all tests
forge test -vv

# Test with gas reports
forge test --gas-report
```

## Integration Guide

### Frontend Integration

The contracts are integrated into the SkillPass app via:

1. **Contract Configuration** (`lib/contracts.ts`)
   - Contract addresses and ABIs
   - Network configurations
   - Environment-specific settings

2. **Web3 Utilities** (`lib/web3.ts`)
   - Wallet connection
   - Contract interactions
   - Helper functions

3. **Demo Page** (`/demo`)
   - Live contract testing
   - Skill minting
   - Endorsement system

### Key Functions

#### Minting Skills
```typescript
await skillPassContracts.mintSkill(
  "Frontend",           // category
  "React Development",  // name
  "Expert in React.js", // description
  "metadata_uri"        // optional metadata URI
)
```

#### Endorsing Skills
```typescript
await skillPassContracts.endorseSkill(
  "1",              // skill ID
  "100",            // stake amount (REPR tokens)
  "Evidence text"   // endorsement evidence
)
```

#### Getting User Data
```typescript
const reputation = await skillPassContracts.getUserReputation(address)
const skills = await skillPassContracts.getUserSkills(address)
```

## Security Considerations

- All contracts use OpenZeppelin's battle-tested implementations
- ReentrancyGuard protects against reentrancy attacks
- Ownable pattern for admin functions
- Minimum stake requirements prevent spam
- Challenge period for dispute resolution

## Gas Optimization

- Efficient storage packing
- Optimized loops and operations
- Compiler optimizations enabled
- ~200 optimization runs configured

## Future Enhancements

1. **Governance System**: Community voting on challenges
2. **Reputation Decay**: Time-based reputation degradation
3. **Skill Categories**: Dynamic category management
4. **Cross-chain Support**: Multi-chain deployment
5. **NFT Metadata**: IPFS integration for decentralized storage

## Mainnet Deployment Checklist

- [ ] Security audit
- [ ] Testnet deployment and testing
- [ ] Gas optimization review
- [ ] Frontend integration testing
- [ ] Documentation completion
- [ ] Community testing
- [ ] Mainnet deployment
- [ ] Contract verification on Etherscan

## Support

For technical support or questions about the smart contracts:
- Check the test suite for usage examples
- Review the demo page implementation
- Submit issues on GitHub
- Join the SkillPass Discord 