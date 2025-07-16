import { ethers } from 'ethers'

// Contract ABIs (simplified for demo - you'd import full ABIs)
const SKILL_NFT_ABI = [
  'function mintSkill(string category, string name, string description, string tokenURI) returns (uint256)',
  'function getSkill(uint256 tokenId) view returns (tuple(string category, string name, string description, address creator, uint256 createdAt, uint256 totalStaked, uint256 endorsementCount, bool verified))',
  'function getUserSkills(address user) view returns (uint256[])',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'event SkillMinted(uint256 indexed tokenId, address indexed creator, string category, string name)'
]

const REPUTATION_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function getReputationScore(address user) view returns (uint256)'
]

const SKILL_STAKING_ABI = [
  'function endorseSkill(uint256 skillId, uint256 stakeAmount, string evidence)',
  'function challengeSkill(uint256 skillId)',
  'function claimRewards()',
  'function getSkillEndorsements(uint256 skillId) view returns (tuple(address endorser, uint256 stakedAmount, uint256 timestamp, bool active, string evidence)[])',
  'function getStakeInfo(uint256 skillId) view returns (tuple(uint256 totalStaked, uint256 endorsementCount, uint256 averageStake, bool challenged, uint256 challengeEndTime))',
  'event SkillEndorsed(uint256 indexed skillId, address indexed endorser, uint256 stakedAmount, string evidence)'
]

// Contract addresses (replace with deployed addresses)
export const CONTRACTS = {
  SKILL_NFT: process.env.NEXT_PUBLIC_SKILL_NFT_ADDRESS || '',
  REPUTATION_TOKEN: process.env.NEXT_PUBLIC_REPUTATION_TOKEN_ADDRESS || '',
  SKILL_STAKING: process.env.NEXT_PUBLIC_SKILL_STAKING_ADDRESS || '',
} as const

// RPC endpoint
const RPC_URL = process.env.NEXT_PUBLIC_ETHEREUM_RPC_ENDPOINT || 'https://eth.llamarpc.com'

export class BlockchainService {
  private provider: ethers.JsonRpcProvider
  private skillNFTContract: ethers.Contract
  private reputationTokenContract: ethers.Contract
  private skillStakingContract: ethers.Contract

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL)
    
    this.skillNFTContract = new ethers.Contract(
      CONTRACTS.SKILL_NFT,
      SKILL_NFT_ABI,
      this.provider
    )
    
    this.reputationTokenContract = new ethers.Contract(
      CONTRACTS.REPUTATION_TOKEN,
      REPUTATION_TOKEN_ABI,
      this.provider
    )
    
    this.skillStakingContract = new ethers.Contract(
      CONTRACTS.SKILL_STAKING,
      SKILL_STAKING_ABI,
      this.provider
    )
  }

  // Get signer for transactions
  private getSigner(walletProvider: any) {
    const provider = new ethers.BrowserProvider(walletProvider)
    return provider.getSigner()
  }

  // Skill NFT Functions
  async mintSkill(
    walletProvider: any,
    category: string,
    name: string,
    description: string,
    tokenURI: string
  ) {
    try {
      const signer = await this.getSigner(walletProvider)
      const contract = this.skillNFTContract.connect(signer)
      
      const tx = await contract.mintSkill(category, name, description, tokenURI)
      const receipt = await tx.wait()
      
      // Parse the SkillMinted event to get token ID
      const event = receipt.logs.find((log: any) => 
        log.topics[0] === ethers.id('SkillMinted(uint256,address,string,string)')
      )
      
      if (event) {
        const decodedEvent = this.skillNFTContract.interface.parseLog({
          topics: event.topics,
          data: event.data
        })
        return {
          tokenId: decodedEvent.args.tokenId.toString(),
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber
        }
      }
      
      throw new Error('SkillMinted event not found')
    } catch (error) {
      console.error('Error minting skill:', error)
      throw error
    }
  }

  async getSkill(tokenId: string) {
    try {
      const skill = await this.skillNFTContract.getSkill(tokenId)
      return {
        category: skill.category,
        name: skill.name,
        description: skill.description,
        creator: skill.creator,
        createdAt: Number(skill.createdAt),
        totalStaked: skill.totalStaked.toString(),
        endorsementCount: Number(skill.endorsementCount),
        verified: skill.verified
      }
    } catch (error) {
      console.error('Error getting skill:', error)
      throw error
    }
  }

  async getUserSkills(address: string) {
    try {
      const tokenIds = await this.skillNFTContract.getUserSkills(address)
      return tokenIds.map((id: bigint) => id.toString())
    } catch (error) {
      console.error('Error getting user skills:', error)
      throw error
    }
  }

  // Reputation Token Functions
  async getReputationBalance(address: string) {
    try {
      const balance = await this.reputationTokenContract.balanceOf(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting reputation balance:', error)
      throw error
    }
  }

  async getReputationScore(address: string) {
    try {
      const score = await this.reputationTokenContract.getReputationScore(address)
      return score.toString()
    } catch (error) {
      console.error('Error getting reputation score:', error)
      throw error
    }
  }

  async approveStaking(walletProvider: any, amount: string) {
    try {
      const signer = await this.getSigner(walletProvider)
      const contract = this.reputationTokenContract.connect(signer)
      
      const amountWei = ethers.parseEther(amount)
      const tx = await contract.approve(CONTRACTS.SKILL_STAKING, amountWei)
      await tx.wait()
      
      return tx.hash
    } catch (error) {
      console.error('Error approving staking:', error)
      throw error
    }
  }

  // Skill Staking Functions
  async endorseSkill(
    walletProvider: any,
    skillId: string,
    stakeAmount: string,
    evidence: string
  ) {
    try {
      const signer = await this.getSigner(walletProvider)
      const contract = this.skillStakingContract.connect(signer)
      
      const amountWei = ethers.parseEther(stakeAmount)
      const tx = await contract.endorseSkill(skillId, amountWei, evidence)
      const receipt = await tx.wait()
      
      return {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Error endorsing skill:', error)
      throw error
    }
  }

  async getSkillEndorsements(skillId: string) {
    try {
      const endorsements = await this.skillStakingContract.getSkillEndorsements(skillId)
      return endorsements.map((e: any) => ({
        endorser: e.endorser,
        stakedAmount: ethers.formatEther(e.stakedAmount),
        timestamp: Number(e.timestamp),
        active: e.active,
        evidence: e.evidence
      }))
    } catch (error) {
      console.error('Error getting skill endorsements:', error)
      throw error
    }
  }

  async getStakeInfo(skillId: string) {
    try {
      const stakeInfo = await this.skillStakingContract.getStakeInfo(skillId)
      return {
        totalStaked: ethers.formatEther(stakeInfo.totalStaked),
        endorsementCount: Number(stakeInfo.endorsementCount),
        averageStake: ethers.formatEther(stakeInfo.averageStake),
        challenged: stakeInfo.challenged,
        challengeEndTime: Number(stakeInfo.challengeEndTime)
      }
    } catch (error) {
      console.error('Error getting stake info:', error)
      throw error
    }
  }

  async challengeSkill(walletProvider: any, skillId: string) {
    try {
      const signer = await this.getSigner(walletProvider)
      const contract = this.skillStakingContract.connect(signer)
      
      const tx = await contract.challengeSkill(skillId)
      const receipt = await tx.wait()
      
      return {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Error challenging skill:', error)
      throw error
    }
  }

  async claimRewards(walletProvider: any) {
    try {
      const signer = await this.getSigner(walletProvider)
      const contract = this.skillStakingContract.connect(signer)
      
      const tx = await contract.claimRewards()
      const receipt = await tx.wait()
      
      return {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Error claiming rewards:', error)
      throw error
    }
  }

  // Event listeners
  async listenToSkillMinted(callback: (event: any) => void) {
    this.skillNFTContract.on('SkillMinted', (tokenId, creator, category, name, event) => {
      callback({
        tokenId: tokenId.toString(),
        creator,
        category,
        name,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
      })
    })
  }

  async listenToSkillEndorsed(callback: (event: any) => void) {
    this.skillStakingContract.on('SkillEndorsed', (skillId, endorser, stakedAmount, evidence, event) => {
      callback({
        skillId: skillId.toString(),
        endorser,
        stakedAmount: ethers.formatEther(stakedAmount),
        evidence,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
      })
    })
  }

  // Utility functions
  async getCurrentBlock() {
    return await this.provider.getBlockNumber()
  }

  async getTransaction(txHash: string) {
    return await this.provider.getTransaction(txHash)
  }

  async getTransactionReceipt(txHash: string) {
    return await this.provider.getTransactionReceipt(txHash)
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService() 