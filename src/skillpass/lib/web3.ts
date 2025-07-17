import { ethers } from "ethers"
import { CONTRACTS, REPUTATION_TOKEN_ABI, SKILL_NFT_ABI, SKILL_REVENUE_ABI, getNetworkConfig } from "./contracts"

// Global declarations for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Initialize provider and signer for MetaMask
let provider: ethers.BrowserProvider | null = null
let signer: ethers.JsonRpcSigner | null = null

// Check for multiple wallet extensions
export async function checkWalletConflicts() {
  console.log("🔍 checkWalletConflicts: Checking for multiple wallet extensions...")
  
  const wallets = []
  
  if (window.ethereum) {
    console.log("✅ Found window.ethereum")
    console.log("- isMetaMask:", window.ethereum.isMetaMask)
    console.log("- isCoinbaseWallet:", window.ethereum.isCoinbaseWallet)
    console.log("- isTrust:", window.ethereum.isTrust)
    console.log("- isRabby:", window.ethereum.isRabby)
    
    if (window.ethereum.isMetaMask) wallets.push("MetaMask")
    if (window.ethereum.isCoinbaseWallet) wallets.push("Coinbase Wallet")
    if (window.ethereum.isTrust) wallets.push("Trust Wallet")
    if (window.ethereum.isRabby) wallets.push("Rabby")
  }
  
  // Check for MetaMask specifically
  if (window.ethereum?.providers) {
    console.log("✅ Multiple providers detected:", window.ethereum.providers.length)
    window.ethereum.providers.forEach((provider: any, index: number) => {
      console.log(`Provider ${index}:`, {
        isMetaMask: provider.isMetaMask,
        isCoinbaseWallet: provider.isCoinbaseWallet,
        isTrust: provider.isTrust
      })
    })
  }
  
  console.log("Detected wallets:", wallets)
  return wallets
}

// Main connection method
export async function connectWallet(): Promise<string> {
  console.log("🔍 connectWallet: Starting MetaMask connection...")
  
  try {
    const wallets = await checkWalletConflicts()
    console.log("Detected wallet extensions:", wallets)
    
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install MetaMask extension.")
    }
    
    let metaMaskProvider = window.ethereum
    
    // If multiple providers exist, find MetaMask specifically
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      console.log("🔍 Multiple providers found, selecting MetaMask...")
      const metaMask = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      if (metaMask) {
        console.log("✅ Found MetaMask in providers array")
        metaMaskProvider = metaMask
      } else {
        throw new Error("MetaMask not found in providers array")
      }
    }
    
    console.log("✅ Using provider:", {
      isMetaMask: metaMaskProvider.isMetaMask,
      selectedAddress: metaMaskProvider.selectedAddress
    })
    
    // Try to get existing connection first
    if (metaMaskProvider.selectedAddress) {
      console.log("✅ Found existing connection:", metaMaskProvider.selectedAddress)
      
      // Initialize provider and signer for existing connection
      provider = new ethers.BrowserProvider(metaMaskProvider)
      signer = await provider.getSigner()
      
      // Validate network
      await validateNetwork()
      
      return metaMaskProvider.selectedAddress
    }
    
    // Manual connection without using request() method
    console.log("🔄 Attempting manual connection...")
    
    // Try different connection approaches
    const connectionMethods = [
      // Method 1: Direct enable
      async () => {
        console.log("Trying: Direct enable...")
        return await metaMaskProvider.enable?.()
      },
      
      // Method 2: Send method
      async () => {
        console.log("Trying: Send method...")
        return await metaMaskProvider.send?.('eth_requestAccounts')
      },
      
      // Method 3: SendAsync method
      async () => {
        console.log("Trying: SendAsync method...")
        return new Promise((resolve, reject) => {
          metaMaskProvider.sendAsync?.({
            method: 'eth_requestAccounts',
            params: []
          }, (error: any, result: any) => {
            if (error) reject(error)
            else resolve(result.result)
          })
        })
      }
    ]
    
    for (const method of connectionMethods) {
      try {
        const result = await method()
        if (result && Array.isArray(result) && result.length > 0) {
          console.log("✅ Connection successful with method:", result[0])
          
          // Initialize provider and signer
          provider = new ethers.BrowserProvider(metaMaskProvider)
          signer = await provider.getSigner()
          
          // Validate network
          await validateNetwork()
          
          return result[0]
        }
      } catch (methodError: any) {
        console.log("⚠️ Method failed:", methodError.message)
        continue
      }
    }
    
    throw new Error("All connection methods failed")
    
  } catch (error: any) {
    console.error("❌ Connection failed:", error)
    throw error
  }
}

// Validate that we're connected to the correct network
export async function validateNetwork() {
  console.log("🔍 validateNetwork: Checking network...")
  
  try {
    // Auto-initialize provider if not available
    if (!provider) {
      console.log("🔄 Provider not initialized, connecting...")
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask extension.")
      }
      
      // Initialize provider without requiring wallet connection
      provider = new ethers.BrowserProvider(window.ethereum)
    }
    
    const network = await provider.getNetwork()
    const networkConfig = getNetworkConfig()
    
    // Simple network name mapping
    const getNetworkName = (chainId: number) => {
      switch (chainId) {
        case 31337: return "Anvil (localhost)"
        case 11155111: return "Sepolia Testnet"
        case 1: return "Ethereum Mainnet"
        default: return `Chain ${chainId}`
      }
    }
    
    console.log("Current network:", {
      chainId: network.chainId.toString(),
      name: getNetworkName(Number(network.chainId))
    })
    
    console.log("Expected network:", {
      chainId: networkConfig.chainId,
      name: getNetworkName(networkConfig.chainId)
    })
    
    if (network.chainId.toString() !== networkConfig.chainId.toString()) {
      throw new Error(
        `Wrong network! Please switch to ${getNetworkName(networkConfig.chainId)} (Chain ID: ${networkConfig.chainId}). ` +
        `Currently connected to ${getNetworkName(Number(network.chainId))} (Chain ID: ${network.chainId})`
      )
    }
    
    console.log("✅ Network validation passed")
  } catch (error: any) {
    console.error("❌ Network validation failed:", error)
    throw error
  }
}

// Check current network without throwing errors
export async function getCurrentNetwork() {
  try {
    if (!provider) return null
    
    const network = await provider.getNetwork()
    const getNetworkName = (chainId: number) => {
      switch (chainId) {
        case 31337: return "Anvil (localhost)"
        case 11155111: return "Sepolia Testnet"
        case 1: return "Ethereum Mainnet"
        default: return `Chain ${chainId}`
      }
    }
    
    return {
      chainId: network.chainId.toString(),
      name: getNetworkName(Number(network.chainId))
    }
  } catch (error) {
    console.error("Error getting current network:", error)
    return null
  }
}

// Switch to the correct network (Sepolia testnet)
export async function switchToCorrectNetwork() {
  console.log("🔄 switchToCorrectNetwork: Attempting to switch network...")
  
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not available")
    }
    
    const networkConfig = getNetworkConfig()
    const chainIdHex = `0x${networkConfig.chainId.toString(16)}`
    
    console.log("Switching to chain ID:", chainIdHex)
    
    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })
      
      console.log("Network switched successfully")
      return true
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        console.log("Network not found, adding it...")
        
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdHex,
            chainName: 'Sepolia Testnet',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [networkConfig.rpcUrl],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        })
        
        console.log("✅ Network added and switched successfully")
        return true
      } else {
        throw switchError
      }
    }
  } catch (error: any) {
    console.error("Failed to switch network:", error)
    throw error
  }
}

// Check if MetaMask is already connected without prompting user
export async function isWalletConnected(): Promise<boolean> {
  console.log("isWalletConnected: Checking connection status...")
  
  if (typeof window === "undefined" || !window.ethereum) {
    console.log("MetaMask not available")
    return false
  }

  try {
    let metaMaskProvider = window.ethereum
    
    // Handle multiple providers
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      const metaMask = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      if (metaMask) metaMaskProvider = metaMask
    }
    
    const connected = !!metaMaskProvider.selectedAddress
    console.log("Wallet connected:", connected, "address:", metaMaskProvider.selectedAddress)
    return connected
  } catch (error) {
    console.error("Error checking wallet connection:", error)
    return false
  }
}

// Get connected address without prompting for connection
export async function getConnectedAddress(): Promise<string | null> {
  console.log("getConnectedAddress: Getting current address...")
  
  if (typeof window === "undefined" || !window.ethereum) {
    console.log("MetaMask not available")
    return null
  }

  try {
    let metaMaskProvider = window.ethereum
    
    // Handle multiple providers
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      const metaMask = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      if (metaMask) metaMaskProvider = metaMask
    }
    
    const address = metaMaskProvider.selectedAddress
    console.log("Current connected address:", address)
    return address
  } catch (error) {
    console.error("Error getting connected address:", error)
    return null
  }
}

export async function getProvider() {
  console.log("getProvider: Getting provider...")
  if (!provider) {
    console.log("getProvider: No cached provider, connecting...")
    await connectWallet()
  }
  console.log("getProvider: Provider ready")
  return provider!
}

export async function getSigner() {
  console.log("getSigner: Getting signer...")
  if (!signer) {
    console.log("getSigner: No cached signer, connecting...")
    await connectWallet()
  }
  console.log("getSigner: Signer ready")
  return signer!
}

// Contract instances
export class SkillPassContracts {
  private static instance: SkillPassContracts
  private networkConfig: any
  
  constructor(chainId?: number) {
    console.log("SkillPassContracts: Constructor called with chainId:", chainId)
    this.networkConfig = getNetworkConfig(chainId)
    console.log("SkillPassContracts: Network config loaded:", this.networkConfig)
  }
  
  static getInstance(chainId?: number) {
    console.log("SkillPassContracts: Getting instance with chainId:", chainId)
    if (!SkillPassContracts.instance) {
      console.log("SkillPassContracts: Creating new instance...")
      SkillPassContracts.instance = new SkillPassContracts(chainId)
    }
    return SkillPassContracts.instance
  }
  
  // Get contract instances
  async getReputationToken() {
    console.log("getReputationToken: Getting contract instance...")
    console.log("getReputationToken: Contract address:", this.networkConfig.ReputationToken)
    
    // Use provider for read-only operations, no signer needed
    if (!provider) {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }
      provider = new ethers.BrowserProvider(window.ethereum)
    }
    
    const contract = new ethers.Contract(
      this.networkConfig.ReputationToken,
      REPUTATION_TOKEN_ABI,
      provider
    )
    
    console.log("getReputationToken: Contract instance created")
    return contract
  }
  
  async getSkillNFT() {
    console.log("getSkillNFT: Getting contract instance...")
    console.log("getSkillNFT: Contract address:", this.networkConfig.SkillNFT)
    
    // Use provider for read-only operations, no signer needed
    if (!provider) {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }
      provider = new ethers.BrowserProvider(window.ethereum)
    }
    
    const contract = new ethers.Contract(
      this.networkConfig.SkillNFT,
      SKILL_NFT_ABI,
      provider
    )
    
    console.log("getSkillNFT: Contract instance created")
    return contract
  }
  
  async getSkillRevenue() {
    console.log("getSkillRevenue: Getting contract instance...")
    console.log("getSkillRevenue: Contract address:", this.networkConfig.SkillRevenue)
    
    // Use provider for read-only operations, no signer needed
    if (!provider) {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }
      provider = new ethers.BrowserProvider(window.ethereum)
    }
    
    const contract = new ethers.Contract(
      this.networkConfig.SkillRevenue,
      SKILL_REVENUE_ABI,
      provider
    )
    
    console.log("getSkillRevenue: Contract instance created")
    return contract
  }
  
  // Convenience methods
  async getUserReputation(address: string) {
    console.log("getUserReputation: Getting reputation for address:", address)
    try {
      // Direct provider initialization
      if (!provider) {
        console.log("getUserReputation: Initializing provider directly...")
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed")
        }
        provider = new ethers.BrowserProvider(window.ethereum)
        console.log("getUserReputation: Provider initialized")
      }
      
      // Direct contract access
      console.log("getUserReputation: Creating contract directly...")
      const reputationToken = new ethers.Contract(
        this.networkConfig.ReputationToken,
        REPUTATION_TOKEN_ABI,
        provider
      )
      console.log("getUserReputation: Got reputation token contract")
      
      console.log("getUserReputation: Calling balanceOf...")
      const balance = await reputationToken.balanceOf(address)
      console.log("getUserReputation: Balance raw:", balance.toString())
      
      console.log("getUserReputation: Calling getReputationScore...")
      const score = await reputationToken.getReputationScore(address)
      console.log("getUserReputation: Score raw:", score.toString())
      
      const result = {
        balance: ethers.formatEther(balance),
        score: ethers.formatEther(score)
      }
      
      console.log("getUserReputation: Final result:", result)
      return result
    } catch (error: any) {
      console.error("getUserReputation: Error:", error)
      
      // More helpful error messages
      if (error.code === 'BAD_DATA' || error.message.includes('could not decode result data')) {
        console.log("getUserReputation: Contract read failed - likely wrong network")
        throw new Error(
          `Unable to read from contracts. Please switch to Sepolia Testnet in MetaMask.`
        )
      }
      
      throw error
    }
  }
  
  // MOCK FALLBACK - Returns sample data if RPC fails
  async getUserReputationMock(address: string) {
    console.log("getUserReputationMock: Using mock data for demo")
    console.log("Address:", address)
    
    // Return sample data that looks realistic
    const result = {
      balance: "1000.0", // 1000 REPR tokens
      score: "2500"      // 2500 reputation points
    }
    
    console.log("MOCK SUCCESS:", result)
    return result
  }
  
  // SMART FALLBACK - Try RPC first, fall back to mock
  async getUserReputationSmart(address: string) {
    console.log("getUserReputationSmart: Trying RPC first, fallback to mock")
    
    try {
      // Try the static RPC call first
      const result = await this.getUserReputationStatic(address)
      console.log("RPC SUCCESS:", result)
      return result
    } catch (error: any) {
      console.log("RPC failed, using mock fallback:", error.message)
      
      // If RPC fails (CORS, network, etc), use mock data
      return await this.getUserReputationMock(address)
    }
  }
  
  // Direct RPC call
  async getUserReputationStatic(address: string) {
    console.log("getUserReputationStatic: STATIC RPC CALL - No MetaMask")
    console.log("Address:", address)
    console.log("Contract:", this.networkConfig.ReputationToken)
    console.log("RPC URL:", this.networkConfig.rpcUrl)
    
    try {
      // Use the public RPC URL directly - no MetaMask
      console.log("Creating static provider from RPC URL...")
      const staticProvider = new ethers.JsonRpcProvider(this.networkConfig.rpcUrl)
      
      console.log("Creating contract with static provider...")
      const contract = new ethers.Contract(
        this.networkConfig.ReputationToken,
        ["function balanceOf(address) view returns (uint256)", "function getReputationScore(address) view returns (uint256)"],
        staticProvider
      )
      
      console.log("Static balanceOf call...")
      const balance = await contract.balanceOf(address)
      console.log("Balance result:", balance.toString())
      
      console.log("Static getReputationScore call...")  
      const score = await contract.getReputationScore(address)
      console.log("Score result:", score.toString())
      
      const result = {
        balance: ethers.formatEther(balance),
        score: ethers.formatEther(score)
      }
      
      console.log("getUserReputationStatic success:", result)
      return result
      
    } catch (error: any) {
      console.error("getUserReputationStatic failed:", error)
      
      // More specific error handling
      if (error.message?.includes('could not decode result data')) {
        throw new Error("Contract not found on current network - please switch to Sepolia")
      }
      if (error.message?.includes('network does not support ENS')) {
        throw new Error("RPC error - contracts may not be deployed")
      }
      
      throw error
    }
  }
  
  async mintSkill(category: string, name: string, description: string, metadataUri?: string) {
    console.log("mintSkill: Starting mint process...")
    console.log("mintSkill: Parameters:", { category, name, description, metadataUri })
    
    try {
      const skillNFT = await this.getSkillNFTWithSigner()
      console.log("mintSkill: Got SkillNFT contract with signer")
      
      const uri = metadataUri || `data:application/json,${encodeURIComponent(JSON.stringify({
        name,
        description,
        category,
        image: "https://skillpass.app/placeholder-skill.png"
      }))}`
      
      console.log("mintSkill: Metadata URI:", uri)
      
      console.log("mintSkill: Calling contract.mintSkill()...")
      const tx = await skillNFT.mintSkill(category, name, description, uri)
      console.log("mintSkill: Transaction sent:", tx.hash)
      
      console.log("mintSkill: Waiting for transaction confirmation...")
      const receipt = await tx.wait()
      console.log("mintSkill: Transaction confirmed:", receipt)
      console.log("mintSkill: Block number:", receipt.blockNumber)
      console.log("mintSkill: Gas used:", receipt.gasUsed.toString())
      
      return receipt
    } catch (error: any) {
      console.error("mintSkill: Error during minting:", error)
      console.error("mintSkill: Error message:", error.message)
      console.error("mintSkill: Error stack:", error.stack)
      throw error
    }
  }
  
  async investInSkill(skillId: string, investmentAmount: string) {
    console.log("🔍 investInSkill: Starting investment process...")
    console.log("🔍 investInSkill: Parameters:", { skillId, investmentAmount })
    
    try {
      const skillRevenue = await this.getSkillRevenueWithSigner()
      console.log("✅ investInSkill: Got SkillRevenue contract with signer")
      
      const reputationToken = await this.getReputationTokenWithSigner()
      console.log("✅ investInSkill: Got ReputationToken contract with signer")
      
      // Approve investment amount first
      const investmentAmountWei = ethers.parseEther(investmentAmount)
      console.log("🔍 investInSkill: Investment amount in wei:", investmentAmountWei.toString())
      
      console.log("🔍 investInSkill: Approving tokens...")
      const approveTx = await reputationToken.approve(this.networkConfig.SkillRevenue, investmentAmountWei)
      console.log("✅ investInSkill: Approval transaction sent:", approveTx.hash)
      
      console.log("🔍 investInSkill: Waiting for approval confirmation...")
      await approveTx.wait()
      console.log("✅ investInSkill: Approval confirmed")
      
      // Invest in the skill
      console.log("🔍 investInSkill: Calling contract.investInSkill()...")
      const tx = await skillRevenue.investInSkill(skillId, investmentAmountWei)
      console.log("✅ investInSkill: Investment transaction sent:", tx.hash)
      
      console.log("🔍 investInSkill: Waiting for investment confirmation...")
      const receipt = await tx.wait()
      console.log("✅ investInSkill: Investment confirmed:", receipt)
      
      return receipt
    } catch (error: any) {
      console.error("❌ investInSkill: Error during investment:", error)
      console.error("❌ investInSkill: Error message:", error.message)
      console.error("❌ investInSkill: Error stack:", error.stack)
      throw error
    }
  }
  
  // Old endorseSkill method for backward compatibility
  async endorseSkill(skillId: string, stakeAmount: string, evidence: string) {
    console.log("endorseSkill: DEPRECATED - Now using investInSkill")
    return this.investInSkill(skillId, stakeAmount)
  }
  
  // Helper methods for write operations that need signers
  async getReputationTokenWithSigner() {
    console.log("getReputationTokenWithSigner: Getting contract with signer...")
    const signer = await getSigner()
    const contract = new ethers.Contract(
      this.networkConfig.ReputationToken,
      REPUTATION_TOKEN_ABI,
      signer
    )
    return contract
  }
  
  async getSkillNFTWithSigner() {
    console.log("getSkillNFTWithSigner: Getting contract with signer...")
    const signer = await getSigner()
    const contract = new ethers.Contract(
      this.networkConfig.SkillNFT,
      SKILL_NFT_ABI,
      signer
    )
    return contract
  }
  
  async getSkillRevenueWithSigner() {
    console.log("getSkillRevenueWithSigner: Getting contract with signer...")
    const signer = await getSigner()
    const contract = new ethers.Contract(
      this.networkConfig.SkillRevenue,
      SKILL_REVENUE_ABI,
      signer
    )
    return contract
  }
  
  async getSkillStakingWithSigner() {
    console.log("getSkillStakingWithSigner: Getting contract with signer...")
    console.log("DEPRECATED: Use getSkillRevenueWithSigner instead")
    const signer = await getSigner()
    const contract = new ethers.Contract(
      this.networkConfig.SkillStaking,
      SKILL_REVENUE_ABI, // Use SkillRevenue ABI since it's the same contract
      signer
    )
    return contract
  }
}

// Global contract instance
export const skillPassContracts = SkillPassContracts.getInstance()

// Utility functions
export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTokenAmount(amount: string, decimals = 2) {
  const num = parseFloat(amount)
  if (num < 0.01) return "< 0.01"
  return num.toFixed(decimals)
} 