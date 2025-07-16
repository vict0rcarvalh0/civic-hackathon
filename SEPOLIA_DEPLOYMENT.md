# SkillPass Sepolia Deployment Guide

The app has been configured to use **Sepolia testnet** instead of Anvil (localhost). This makes it much more accessible since users don't need to run a local blockchain.

## Current Configuration

✅ **Network**: Sepolia Testnet (Chain ID: 11155111)  
✅ **RPC URL**: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161  
✅ **Block Explorer**: https://sepolia.etherscan.io  

## ✅ DEPLOYED Contract Addresses

**Deployment completed successfully!** The following contracts are now live on Sepolia:

```
ReputationToken: 0x8F840F2d5df100C5c3b0C3d181c3EFA3d6C5068A
SkillNFT: 0x45b1f38d1adfB5A9FFAA81b996a53bE78A33cF0c  
SkillStaking: 0x1FFA789d597E95923fe40bfE2A386DA379Ec4293
```

### Contract Verification
✅ All contracts verified on Sourcify  
✅ Deployment transaction: Block 8777066  
✅ Total gas used: 4,096,485 gas  
✅ Total cost: ~0.0008 ETH  

### Explorer Links
- [ReputationToken on Sepolia](https://sepolia.etherscan.io/address/0x8F840F2d5df100C5c3b0C3d181c3EFA3d6C5068A)
- [SkillNFT on Sepolia](https://sepolia.etherscan.io/address/0x45b1f38d1adfB5A9FFAA81b996a53bE78A33cF0c)
- [SkillStaking on Sepolia](https://sepolia.etherscan.io/address/0x1FFA789d597E95923fe40bfE2A386DA379Ec4293)

## Benefits of Using Sepolia

✅ **No local setup required** - users don't need to run `anvil`  
✅ **Persistent** - contracts stay deployed  
✅ **Public** - anyone can interact with the app  
✅ **Shareable** - easy to demo and test  
✅ **Etherscan integration** - transaction visibility  

## Testing

Users just need to:
1. Connect MetaMask to Sepolia testnet
2. Get some Sepolia ETH from a faucet ([Sepolia Faucet](https://sepoliafaucet.com/))
3. Use the app normally at your deployment URL

The app will automatically prompt users to switch to Sepolia if they're on the wrong network.

## Contract Deployment Details

**Deployment Command Used:**
```bash
cd src/contracts
export PRIVATE_KEY=0x... 
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia.infura.io/v3/2cd54954f13248728d02308cd0b2c6db \
  --broadcast --verify
```

**Contract Setup:**
- ReputationToken deployed first
- SkillNFT deployed second  
- SkillStaking deployed last with references to both previous contracts
- SkillNFT ownership transferred to SkillStaking for proper permissions 