// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct Skill {
        string category;
        string name;
        string description;
        address creator;
        uint256 createdAt;
        uint256 totalStaked;
        uint256 endorsementCount;
        bool verified;
    }

    mapping(uint256 => Skill) public skills;
    mapping(address => uint256[]) public userSkills;
    mapping(string => bool) public categoryExists;
    
    string[] public categories;

    event SkillMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string category,
        string name
    );

    event SkillUpdated(
        uint256 indexed tokenId,
        uint256 totalStaked,
        uint256 endorsementCount
    );

    constructor() ERC721("SkillPass", "SKILL") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from 1
    }

    function mintSkill(
        string memory category,
        string memory name,
        string memory description,
        string memory uri
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        skills[tokenId] = Skill({
            category: category,
            name: name,
            description: description,
            creator: msg.sender,
            createdAt: block.timestamp,
            totalStaked: 0,
            endorsementCount: 0,
            verified: false
        });
        
        userSkills[msg.sender].push(tokenId);
        
        if (!categoryExists[category]) {
            categoryExists[category] = true;
            categories.push(category);
        }
        
        emit SkillMinted(tokenId, msg.sender, category, name);
        return tokenId;
    }

    function updateSkillMetrics(
        uint256 tokenId,
        uint256 totalStaked,
        uint256 endorsementCount
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Skill does not exist");
        
        skills[tokenId].totalStaked = totalStaked;
        skills[tokenId].endorsementCount = endorsementCount;
        
        // Auto-verify if enough endorsements and stake
        if (totalStaked >= 1000 * 10**18 && endorsementCount >= 5) {
            skills[tokenId].verified = true;
        }
        
        emit SkillUpdated(tokenId, totalStaked, endorsementCount);
    }

    function getSkill(uint256 tokenId) external view returns (Skill memory) {
        require(_ownerOf(tokenId) != address(0), "Skill does not exist");
        return skills[tokenId];
    }

    function getUserSkills(address user) external view returns (uint256[] memory) {
        return userSkills[user];
    }

    function getCategories() external view returns (string[] memory) {
        return categories;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
} 