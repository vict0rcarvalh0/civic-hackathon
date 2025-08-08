# SkillPass Solana Program

A complete migration of the SkillPass platform from Ethereum to Solana using the Anchor framework, featuring SPL tokens and Metaplex NFTs.

## 🚀 Overview

SkillPass is a decentralized skills validation and investment platform that allows users to:
- Create skill credentials as NFTs
- Stake reputation tokens to endorse skills
- Invest in skills and earn yield from job completions
- Challenge invalid skill endorsements
- Build reputation through community validation

## 📋 Migration Summary

### Ethereum Contracts → Solana Program Features

| Ethereum Contract | Solana Implementation | Description |
|------------------|----------------------|-------------|
| **ReputationToken.sol** | `reputation.rs` + SPL Token | ERC20 → SPL Token with 9 decimals, mint/burn functionality |
| **SkillNFT.sol** | `skill.rs` + Metaplex | ERC721 → Metaplex NFT with metadata and collection |
| **SkillRevenue.sol** | `investment.rs` | Investment platform with yield distribution (70/20/10% split) |
| **SkillStaking.sol** | `staking.rs` | Endorsement system with staking and challenge mechanism |
| **SkillStakingEnhanced.sol** | Enhanced `staking.rs` | APY calculations and enhanced reward distribution |

## 🏗️ Architecture

### Core Components

1. **Program State** (`state.rs`)
   - Global program configuration
   - Mint authorities and treasury management
   - Constants and account size definitions

2. **Instructions** (`instructions/`)
   - `initialize.rs` - Program and mint setup
   - `reputation.rs` - SPL token operations (mint/burn)
   - `skill.rs` - Metaplex NFT creation and management
   - `investment.rs` - Investment platform with real token transfers
   - `staking.rs` - Endorsement and challenge system

3. **Error Handling** (`errors.rs`)
   - Custom error codes for all failure scenarios
   - Clear error messages for debugging

### Key Solana Features Used

- **SPL Tokens**: Reputation tokens with 9 decimals
- **Metaplex Token Metadata**: Skill NFTs with full metadata support
- **Associated Token Accounts**: Automatic token account management
- **Program Derived Addresses (PDAs)**: Deterministic account generation
- **Cross-Program Invocations (CPIs)**: Integration with SPL and Metaplex programs

## 🔄 Migration Changes

### From ERC20 to SPL Tokens

**Ethereum (ReputationToken.sol)**:
```solidity
function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
}

function burn(address from, uint256 amount) external onlyOwner {
    _burn(from, amount);
}
```

**Solana (reputation.rs)**:
```rust
// Mint tokens using SPL Token CPI
let cpi_accounts = MintTo {
    mint: ctx.accounts.reputation_mint.to_account_info(),
    to: ctx.accounts.user_token_account.to_account_info(),
    authority: ctx.accounts.program_state.to_account_info(),
};

anchor_spl::token::mint_to(cpi_ctx, amount)?;
```

### From ERC721 to Metaplex NFTs

**Ethereum (SkillNFT.sol)**:
```solidity
function mint(address to, string memory tokenURI) external {
    uint256 tokenId = _tokenIds.current();
    _tokenIds.increment();
    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);
}
```

**Solana (skill.rs)**:
```rust
// Create NFT using Metaplex CPI
CreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
    .metadata(&ctx.accounts.metadata)
    .mint(&ctx.accounts.skill_mint, false)
    .authority(&ctx.accounts.program_state)
    .create_args(create_args)
    .invoke_signed(&[&[b"program_state", &[bump]]])?;
```

### Investment Platform Enhancements

**Ethereum (SkillRevenue.sol)**:
```solidity
mapping(uint256 => uint256) public skillInvestments;
mapping(address => mapping(uint256 => uint256)) public userInvestments;

function calculateYield(address investor, uint256 skillId) 
    external view returns (uint256) {
    // Simple calculation
    return userInvestments[investor][skillId] * monthlyRate / 100;
}
```

**Solana (investment.rs)**:
```rust
// Real token transfers with proper accounting
pub struct InvestmentPool {
    pub total_invested: u64,
    pub monthly_revenue: u64,
    pub current_apy: u64,  // Real-time APY calculation
    pub investor_count: u64,
    // ... more fields
}

// Calculate APY dynamically
if investment_pool.total_invested > 0 {
    investment_pool.current_apy = 
        (investment_pool.monthly_revenue * 12 * 10000) / 
        investment_pool.total_invested;
}
```

## 🎯 Key Features

### 1. **Enhanced Tokenomics**

- **SPL Token Integration**: Real REPR tokens with 9 decimals
- **Supply Controls**: Max supply limits and validation
- **Treasury Management**: Proper token custody and distribution
- **Associated Token Accounts**: Automatic account creation

### 2. **Metaplex NFT Integration**

- **Skill Collections**: Organized skill NFTs under a master collection
- **Rich Metadata**: JSON metadata with images and descriptions
- **Creator Verification**: On-chain creator verification
- **Master Edition**: Limited edition NFTs with proper metadata

### 3. **Advanced Investment Platform**

- **Real Token Transfers**: Actual SPL token movements
- **Dynamic APY**: Real-time yield calculations
- **Revenue Sharing**: 70% investors, 20% skill owner, 10% platform
- **Monthly Distributions**: Time-based yield claiming

### 4. **Sophisticated Staking System**

- **Token-Based Staking**: Real reputation token staking
- **Challenge Mechanism**: 7-day challenge periods
- **Reward Distribution**: Automated reward calculations
- **Slashing Protection**: Partial slashing (50%) for incorrect endorsements

## 📊 Account Structure

### Program Derived Addresses (PDAs)

```rust
// Program state (singleton)
seeds = [b"program_state"]

// Token mints
seeds = [b"reputation_mint"]
seeds = [b"skill_collection_mint"]

// User accounts
seeds = [b"reputation_state", user.key()]
seeds = [b"investment", investor.key(), skill_id.bytes()]
seeds = [b"endorsement", endorser.key(), skill_id.bytes()]

// Skill-related accounts
seeds = [b"skill", skill_mint.key()]
seeds = [b"investment_pool", skill_mint.key()]
seeds = [b"stake_info", skill_mint.key()]
```

### Account Sizes

| Account Type | Size (bytes) | Description |
|-------------|-------------|-------------|
| ProgramState | 153 | Global program configuration |
| ReputationState | 81 | User reputation tracking |
| Skill | 449 | Skill NFT metadata and stats |
| InvestmentPool | 89 | Investment pool data |
| Investment | 73 | Individual investment records |
| Endorsement | 129 | Skill endorsement records |

## 🔧 Build & Deploy

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"

# Install Anchor
npm install -g @coral-xyz/anchor-cli@0.31.1
```

### Build

```bash
cd src/program
anchor build
```

### Test

```bash
anchor test
```

### Deploy

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet-beta
```

## 🛠️ Configuration

### Anchor.toml

```toml
[toolchain]
package_manager = "yarn"
anchor_version = "0.31.1"

[features]
idl-build = ["anchor-spl/idl-build"]
init-if-needed = ["anchor-lang/init-if-needed"]

[programs.devnet]
skillpass = "GnaNCjWTV5Zv3AoLwQKppZLLUjuQPjqrJTKEs8HqVj9q"
```

### Dependencies

```toml
[dependencies]
anchor-lang = { version = "0.31.1", features = ["init-if-needed"] }
anchor-spl = "0.31.1"
spl-token = "4.0.0"
spl-associated-token-account = "2.2.0"
mpl-token-metadata = { version = "4.1.2", features = ["no-entrypoint"] }
```

## 🚀 Usage Examples

### Initialize Program

```typescript
await program.methods
  .initialize()
  .accounts({
    programState,
    reputationMint,
    skillCollectionMint,
    treasury,
    treasuryTokenAccount,
    authority: provider.wallet.publicKey,
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    rent: SYSVAR_RENT_PUBKEY,
  })
  .rpc();
```

### Create Skill NFT

```typescript
await program.methods
  .createSkill("Development", "Solana Anchor", "Expert in Solana development", "https://metadata.json")
  .accounts({
    programState,
    skillMint,
    creatorTokenAccount,
    skill,
    metadata,
    masterEdition,
    // ... other accounts
  })
  .signers([skillMint])
  .rpc();
```

### Invest in Skill

```typescript
await program.methods
  .investInSkill(skillId, new BN(1000_000_000_000)) // 1000 REPR tokens
  .accounts({
    programState,
    reputationMint,
    investorTokenAccount,
    skill,
    investmentPool,
    investment,
    treasury,
    treasuryTokenAccount,
    investor: provider.wallet.publicKey,
    // ... other accounts
  })
  .rpc();
```

## 📈 Improvements Over Ethereum

### Performance & Cost

- **Transaction Speed**: ~400ms vs 15+ seconds on Ethereum
- **Transaction Cost**: ~$0.00025 vs $10-100+ on Ethereum
- **Scalability**: 65,000 TPS vs 15 TPS on Ethereum

### Features

- **Real Token Operations**: Actual SPL token transfers vs abstract accounting
- **Rich NFT Metadata**: Metaplex standard vs basic ERC721
- **Efficient Storage**: Account model vs expensive storage slots
- **Composability**: Native cross-program invocations

### Developer Experience

- **Type Safety**: Anchor's type-safe instructions
- **Automatic Validation**: Built-in account validation
- **Error Handling**: Comprehensive error codes
- **Testing**: Integrated test framework

## 🔒 Security Features

### Access Controls

- **Program Authority**: Controlled program upgrades
- **Mint Authority**: Controlled token minting
- **Treasury Management**: Secure fund custody
- **PDA Verification**: Automatic account validation

### Validation

- **Amount Checks**: Minimum investment/stake amounts
- **Supply Limits**: Maximum token supply enforcement
- **Time Constraints**: Challenge period validation
- **Ownership Verification**: Prevent self-investment/endorsement

## 🚧 Future Enhancements

### Planned Features

1. **Governance Integration**: On-chain voting for platform decisions
2. **Oracle Integration**: External skill verification data
3. **Cross-Chain Bridge**: Ethereum ↔ Solana asset bridging
4. **Mobile SDK**: React Native integration
5. **DeFi Integration**: Yield farming with harvested fees

### Potential Optimizations

1. **Instruction Batching**: Multiple operations in single transaction
2. **State Compression**: Merkle tree-based skill storage
3. **Lookup Tables**: Address lookup tables for larger transactions
4. **Program Upgrades**: Seamless feature additions

## 📞 Support

For issues, questions, or contributions:

- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Discord**: [SkillPass Community](https://discord.gg/skillpass)
- **Documentation**: [Full API Docs](https://docs.skillpass.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ on Solana using Anchor Framework** 