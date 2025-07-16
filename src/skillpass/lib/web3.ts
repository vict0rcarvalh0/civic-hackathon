import { ethers } from "ethers"
import { CONTRACTS, ABIS, getNetworkConfig } from "./contracts"

// Get Civic Web3 provider - this will be available when user is authenticated
declare global {
  interface Window {
    ethereum?: any;
    civicWeb3?: {
      provider?: any;
      signer?: any;
    }
  }
}

// Initialize provider and signer from Civic
let provider: ethers.BrowserProvider | null = null
let signer: ethers.JsonRpcSigner | null = null

export async function getCivicProvider() {
  // Check if we have a Civic Web3 provider available
  if (typeof window !== "undefined" && window.civicWeb3?.provider) {
    try {
      provider = new ethers.BrowserProvider(window.civicWeb3.provider)
      signer = await provider.getSigner()
      return { provider, signer }
    } catch (error) {
      console.error("Failed to get Civic provider:", error)
      throw error
    }
  }
  
  // Fallback to window.ethereum if available (for development)
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      signer = await provider.getSigner()
      return { provider, signer }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }
  
  throw new Error("No Web3 provider found. Please ensure you're logged in with Civic.")
}

export async function connectWallet() {
  const { signer } = await getCivicProvider()
  return await signer.getAddress()
}

export async function getProvider() {
  if (!provider) {
    const { provider: newProvider } = await getCivicProvider()
    provider = newProvider
  }
  return provider!
}

export async function getSigner() {
  if (!signer) {
    const { signer: newSigner } = await getCivicProvider()
    signer = newSigner
  }
  return signer!
}

// Contract instances
export class SkillPassContracts {
  private static instance: SkillPassContracts
  private networkConfig: any
  
  constructor(chainId?: number) {
    this.networkConfig = getNetworkConfig(chainId)
  }
  
  static getInstance(chainId?: number) {
    if (!SkillPassContracts.instance) {
      SkillPassContracts.instance = new SkillPassContracts(chainId)
    }
    return SkillPassContracts.instance
  }
  
  // Get contract instances
  async getReputationToken() {
    const signer = await getSigner()
    return new ethers.Contract(
      this.networkConfig.ReputationToken,
      ABIS.ReputationToken,
      signer
    )
  }
  
  async getSkillNFT() {
    const signer = await getSigner()
    return new ethers.Contract(
      this.networkConfig.SkillNFT,
      ABIS.SkillNFT,
      signer
    )
  }
  
  async getSkillStaking() {
    const signer = await getSigner()
    return new ethers.Contract(
      this.networkConfig.SkillStaking,
      ABIS.SkillStaking,
      signer
    )
  }
  
  // Convenience methods
  async getUserReputation(address: string) {
    const reputationToken = await this.getReputationToken()
    const balance = await reputationToken.balanceOf(address)
    const score = await reputationToken.getReputationScore(address)
    
    return {
      balance: ethers.formatEther(balance),
      score: ethers.formatEther(score)
    }
  }
  
  async mintSkill(category: string, name: string, description: string, metadataUri?: string) {
    const skillNFT = await this.getSkillNFT()
    const uri = metadataUri || `data:application/json,${encodeURIComponent(JSON.stringify({
      name,
      description,
      category,
      image: "https://skillpass.app/placeholder-skill.png"
    }))}`
    
    const tx = await skillNFT.mintSkill(category, name, description, uri)
    return await tx.wait()
  }
  
  async endorseSkill(skillId: string, stakeAmount: string, evidence: string) {
    const skillStaking = await this.getSkillStaking()
    const reputationToken = await this.getReputationToken()
    
    // Approve stake amount first
    const stakeAmountWei = ethers.parseEther(stakeAmount)
    const approveTx = await reputationToken.approve(this.networkConfig.SkillStaking, stakeAmountWei)
    await approveTx.wait()
    
    // Endorse the skill
    const tx = await skillStaking.endorseSkill(skillId, stakeAmountWei, evidence)
    return await tx.wait()
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