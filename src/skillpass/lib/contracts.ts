// Contract addresses by network
export const CONTRACTS = {
  // Anvil local testnet
  anvil: {
    chainId: 31337,
    ReputationToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    SkillNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
    SkillRevenue: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    rpcUrl: "http://127.0.0.1:8545",
  },
  // Sepolia testnet  
  sepolia: {
    chainId: 11155111,
    ReputationToken: "0x0b01D922072bE2EDe46154120e2791ae389f70c6",
    SkillNFT: "0x6E3C6eC404381a0DC312dbe79FDC544e0639427F",
    SkillRevenue: "0xD80B39C6D68d4F137BDb69232d26a88ad26a42E8", // Updated with self-investment fix
    rpcUrl: "https://eth-sepolia.public.blastapi.io",
  },
}

// Export individual addresses for backward compatibility
export const {
  ReputationToken: REPUTATION_TOKEN_ADDRESS,
  SkillNFT: SKILL_NFT_ADDRESS,
  SkillRevenue: SKILL_REVENUE_ADDRESS,
  chainId: CHAIN_ID,
  rpcUrl: RPC_URL
} = CONTRACTS.sepolia // Default to Sepolia for production

// Legacy support
export const SKILL_STAKING_ADDRESS = CONTRACTS.sepolia.SkillRevenue // Map to new contract

// ABI definitions for the contracts
export const REPUTATION_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function getReputationScore(address user) view returns (uint256)",
  "function earnReputation(address user, uint256 amount, string reason) external",
  "function slashReputation(address user, uint256 amount, string reason) external"
]

export const SKILL_NFT_ABI = [
  "function mintSkill(string category, string name, string description, string tokenURI) returns (uint256)",
  "function getSkill(uint256 tokenId) view returns (tuple(string category, string name, string description, address creator, uint256 createdAt, uint256 totalStaked, uint256 endorsementCount, bool verified))",
  "function getUserSkills(address user) view returns (uint256[])",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "event SkillMinted(uint256 indexed tokenId, address indexed creator, string category, string name)"
]

export const SKILL_REVENUE_ABI = [
  "function investInSkill(uint256 skillId, uint256 amount) external",
  "function completeJob(uint256 skillId, uint256 jobPayment, address skillOwner) external", 
  "function claimYield(uint256 skillId) external returns (uint256)",
  "function getInvestmentInfo(uint256 skillId, address investor) view returns (tuple(uint256 amount, uint256 pendingYield, uint256 lastClaimTime))",
  "function getSkillPerformance(uint256 skillId) view returns (tuple(uint256 totalInvested, uint256 totalRevenue, uint256 monthlyRevenue, uint256 apy))",
  "function calculateAPY(uint256 skillId) view returns (uint256)",
  "event SkillInvestment(uint256 indexed skillId, address indexed investor, uint256 amount)",
  "event JobCompleted(uint256 indexed skillId, address indexed skillOwner, uint256 jobPayment, uint256 investorShare)",
  "event YieldClaimed(uint256 indexed skillId, address indexed investor, uint256 amount)"
]

// Helper to get current network configuration
export function getNetworkConfig(chainId?: number) {
  const currentChainId = chainId || 11155111 // Default to Sepolia
  
  if (currentChainId === 11155111) return CONTRACTS.sepolia
  if (currentChainId === 31337) return CONTRACTS.anvil
  
  throw new Error(`Unsupported chain ID: ${currentChainId}`)
} 