// Contract configuration for SkillPass
export const CONTRACTS = {
  // Sepolia testnet (default)
  sepolia: {
    ReputationToken: "0x8F840F2d5df100C5c3b0C3d181c3EFA3d6C5068A",
    SkillNFT: "0x45b1f38d1adfB5A9FFAA81b996a53bE78A33cF0c",
    SkillStaking: "0x1FFA789d597E95923fe40bfE2A386DA379Ec4293",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo", // Alchemy demo endpoint with CORS
    chainId: 11155111
  },
  // Local development (Anvil) - kept for development
  localhost: {
    ReputationToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    SkillNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
    SkillStaking: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337
  }
}

// Contract ABIs (simplified - include only the functions we need)
export const ABIS = {
  ReputationToken: [
    "function balanceOf(address owner) view returns (uint256)",
    "function getReputationScore(address user) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function earnReputation(address user, uint256 amount, string reason)",
    "event ReputationEarned(address indexed user, uint256 amount, string reason)"
  ],
  SkillNFT: [
    "function mintSkill(string category, string name, string description, string uri) returns (uint256)",
    "function getSkill(uint256 tokenId) view returns (tuple(string category, string name, string description, address creator, uint256 createdAt, uint256 totalStaked, uint256 endorsementCount, bool verified))",
    "function getUserSkills(address user) view returns (uint256[])",
    "function getCategories() view returns (string[])",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "event SkillMinted(uint256 indexed tokenId, address indexed creator, string category, string name)"
  ],
  SkillStaking: [
    "function endorseSkill(uint256 skillId, uint256 stakeAmount, string evidence)",
    "function getSkillEndorsements(uint256 skillId) view returns (tuple(address endorser, uint256 stakedAmount, uint256 timestamp, bool active, string evidence)[])",
    "function getStakeInfo(uint256 skillId) view returns (tuple(uint256 totalStaked, uint256 endorsementCount, uint256 averageStake, bool challenged, uint256 challengeEndTime))",
    "function claimRewards()",
    "function stakerRewards(address staker) view returns (uint256)",
    "event SkillEndorsed(uint256 indexed skillId, address indexed endorser, uint256 stakedAmount, string evidence)"
  ]
}

// Helper to get current network configuration
export function getNetworkConfig(chainId?: number) {
  const currentChainId = chainId || 11155111 // Default to Sepolia
  
  if (currentChainId === 11155111) return CONTRACTS.sepolia
  if (currentChainId === 31337) return CONTRACTS.localhost
  
  throw new Error(`Unsupported chain ID: ${currentChainId}`)
} 