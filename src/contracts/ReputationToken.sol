// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10000000 * 10**18; // 10M tokens
    uint256 public constant MAX_SUPPLY = 100000000 * 10**18; // 100M tokens

    mapping(address => uint256) public reputationScore;
    mapping(address => uint256) public lastActivity;

    event ReputationEarned(address indexed user, uint256 amount, string reason);
    event ReputationSlashed(address indexed user, uint256 amount, string reason);

    constructor() ERC20("SkillPass Reputation", "REPR") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function earnReputation(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        
        _mint(user, amount);
        reputationScore[user] += amount;
        lastActivity[user] = block.timestamp;
        
        emit ReputationEarned(user, amount, reason);
    }

    function slashReputation(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(balanceOf(user) >= amount, "Insufficient balance");
        
        _burn(user, amount);
        if (reputationScore[user] >= amount) {
            reputationScore[user] -= amount;
        } else {
            reputationScore[user] = 0;
        }
        
        emit ReputationSlashed(user, amount, reason);
    }

    function getReputationScore(address user) external view returns (uint256) {
        return reputationScore[user];
    }

    function isActiveUser(address user) external view returns (bool) {
        return lastActivity[user] > 0 && 
               (block.timestamp - lastActivity[user]) < 90 days;
    }

    // Override transfer to update activity
    function transfer(address to, uint256 amount) public override returns (bool) {
        lastActivity[msg.sender] = block.timestamp;
        lastActivity[to] = block.timestamp;
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        lastActivity[from] = block.timestamp;
        lastActivity[to] = block.timestamp;
        return super.transferFrom(from, to, amount);
    }
} 