import { ethers } from "ethers"
import { CONTRACTS, ABIS, getNetworkConfig } from "./contracts"

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

// Main connection method - bypasses MetaMask extension selector
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

// Check if MetaMask is already connected without prompting user
export async function isWalletConnected(): Promise<boolean> {
  console.log("🔍 isWalletConnected: Checking connection status...")
  
  if (typeof window === "undefined" || !window.ethereum) {
    console.log("❌ MetaMask not available")
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
    console.log("✅ Wallet connected:", connected, "address:", metaMaskProvider.selectedAddress)
    return connected
  } catch (error) {
    console.error("❌ Error checking wallet connection:", error)
    return false
  }
}

// Get connected address without prompting for connection
export async function getConnectedAddress(): Promise<string | null> {
  console.log("🔍 getConnectedAddress: Getting current address...")
  
  if (typeof window === "undefined" || !window.ethereum) {
    console.log("❌ MetaMask not available")
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
    console.log("✅ Current connected address:", address)
    return address
  } catch (error) {
    console.error("❌ Error getting connected address:", error)
    return null
  }
}

export async function getProvider() {
  console.log("🔍 getProvider: Getting provider...")
  if (!provider) {
    console.log("🔍 getProvider: No cached provider, connecting...")
    await connectWallet()
  }
  console.log("✅ getProvider: Provider ready")
  return provider!
}

export async function getSigner() {
  console.log("🔍 getSigner: Getting signer...")
  if (!signer) {
    console.log("🔍 getSigner: No cached signer, connecting...")
    await connectWallet()
  }
  console.log("✅ getSigner: Signer ready")
  return signer!
}

// Contract instances
export class SkillPassContracts {
  private static instance: SkillPassContracts
  private networkConfig: any
  
  constructor(chainId?: number) {
    console.log("🔍 SkillPassContracts: Constructor called with chainId:", chainId)
    this.networkConfig = getNetworkConfig(chainId)
    console.log("✅ SkillPassContracts: Network config loaded:", this.networkConfig)
  }
  
  static getInstance(chainId?: number) {
    console.log("🔍 SkillPassContracts: Getting instance with chainId:", chainId)
    if (!SkillPassContracts.instance) {
      console.log("🔍 SkillPassContracts: Creating new instance...")
      SkillPassContracts.instance = new SkillPassContracts(chainId)
    }
    return SkillPassContracts.instance
  }
  
  // Get contract instances
  async getReputationToken() {
    console.log("🔍 getReputationToken: Getting contract instance...")
    console.log("🔍 getReputationToken: Contract address:", this.networkConfig.ReputationToken)
    
    const signer = await getSigner()
    const contract = new ethers.Contract(
      this.networkConfig.ReputationToken,
      ABIS.ReputationToken,
      signer
    )
    
    console.log("✅ getReputationToken: Contract instance created")
    return contract
  }
  
  async getSkillNFT() {
    console.log("🔍 getSkillNFT: Getting contract instance...")
    console.log("🔍 getSkillNFT: Contract address:", this.networkConfig.SkillNFT)
    
    const signer = await getSigner()
    const contract = new ethers.Contract(
      this.networkConfig.SkillNFT,
      ABIS.SkillNFT,
      signer
    )
    
    console.log("✅ getSkillNFT: Contract instance created")
    return contract
  }
  
  async getSkillStaking() {
    console.log("🔍 getSkillStaking: Getting contract instance...")
    console.log("🔍 getSkillStaking: Contract address:", this.networkConfig.SkillStaking)
    
    const signer = await getSigner()
    const contract = new ethers.Contract(
      this.networkConfig.SkillStaking,
      ABIS.SkillStaking,
      signer
    )
    
    console.log("✅ getSkillStaking: Contract instance created")
    return contract
  }
  
  // Convenience methods
  async getUserReputation(address: string) {
    console.log("🔍 getUserReputation: Getting reputation for address:", address)
    try {
      const reputationToken = await this.getReputationToken()
      console.log("🔍 getUserReputation: Got reputation token contract")
      
      const balance = await reputationToken.balanceOf(address)
      console.log("🔍 getUserReputation: Balance raw:", balance.toString())
      
      const score = await reputationToken.getReputationScore(address)
      console.log("🔍 getUserReputation: Score raw:", score.toString())
      
      const result = {
        balance: ethers.formatEther(balance),
        score: ethers.formatEther(score)
      }
      
      console.log("✅ getUserReputation: Final result:", result)
      return result
    } catch (error: any) {
      console.error("❌ getUserReputation: Error:", error)
      throw error
    }
  }
  
  async mintSkill(category: string, name: string, description: string, metadataUri?: string) {
    console.log("🔍 mintSkill: Starting mint process...")
    console.log("🔍 mintSkill: Parameters:", { category, name, description, metadataUri })
    
    try {
      const skillNFT = await this.getSkillNFT()
      console.log("✅ mintSkill: Got SkillNFT contract")
      
      const uri = metadataUri || `data:application/json,${encodeURIComponent(JSON.stringify({
        name,
        description,
        category,
        image: "https://skillpass.app/placeholder-skill.png"
      }))}`
      
      console.log("🔍 mintSkill: Metadata URI:", uri)
      
      console.log("🔍 mintSkill: Calling contract.mintSkill()...")
      const tx = await skillNFT.mintSkill(category, name, description, uri)
      console.log("✅ mintSkill: Transaction sent:", tx.hash)
      
      console.log("🔍 mintSkill: Waiting for transaction confirmation...")
      const receipt = await tx.wait()
      console.log("✅ mintSkill: Transaction confirmed:", receipt)
      console.log("✅ mintSkill: Block number:", receipt.blockNumber)
      console.log("✅ mintSkill: Gas used:", receipt.gasUsed.toString())
      
      return receipt
    } catch (error: any) {
      console.error("❌ mintSkill: Error during minting:", error)
      console.error("❌ mintSkill: Error message:", error.message)
      console.error("❌ mintSkill: Error stack:", error.stack)
      throw error
    }
  }
  
  async endorseSkill(skillId: string, stakeAmount: string, evidence: string) {
    console.log("🔍 endorseSkill: Starting endorsement process...")
    console.log("🔍 endorseSkill: Parameters:", { skillId, stakeAmount, evidence })
    
    try {
      const skillStaking = await this.getSkillStaking()
      console.log("✅ endorseSkill: Got SkillStaking contract")
      
      const reputationToken = await this.getReputationToken()
      console.log("✅ endorseSkill: Got ReputationToken contract")
      
      // Approve stake amount first
      const stakeAmountWei = ethers.parseEther(stakeAmount)
      console.log("🔍 endorseSkill: Stake amount in wei:", stakeAmountWei.toString())
      
      console.log("🔍 endorseSkill: Approving tokens...")
      const approveTx = await reputationToken.approve(this.networkConfig.SkillStaking, stakeAmountWei)
      console.log("✅ endorseSkill: Approval transaction sent:", approveTx.hash)
      
      console.log("🔍 endorseSkill: Waiting for approval confirmation...")
      await approveTx.wait()
      console.log("✅ endorseSkill: Approval confirmed")
      
      // Endorse the skill
      console.log("🔍 endorseSkill: Calling contract.endorseSkill()...")
      const tx = await skillStaking.endorseSkill(skillId, stakeAmountWei, evidence)
      console.log("✅ endorseSkill: Endorsement transaction sent:", tx.hash)
      
      console.log("🔍 endorseSkill: Waiting for endorsement confirmation...")
      const receipt = await tx.wait()
      console.log("✅ endorseSkill: Endorsement confirmed:", receipt)
      
      return receipt
    } catch (error: any) {
      console.error("❌ endorseSkill: Error during endorsement:", error)
      console.error("❌ endorseSkill: Error message:", error.message)
      console.error("❌ endorseSkill: Error stack:", error.stack)
      throw error
    }
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