// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SeedToken
 * @dev ERC-20 token for PlantaVerse farming economy on Avalanche C-Chain
 * 
 * ECONOMY:
 * - Players receive initial SEED tokens via faucet (testnet)
 * - Planting burns SEED tokens (deflationary action)
 * - Harvesting mints SEED tokens (inflationary action)
 * - Net effect: circular economy with yield > cost to incentivize play
 */
contract SeedToken is ERC20, Ownable {
    
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1M SEED
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18;        // 100 SEED per claim
    uint256 public constant FAUCET_COOLDOWN = 1 hours;
    
    mapping(address => uint256) public lastFaucetClaim;
    
    // Game stats
    uint256 public totalBurned;
    uint256 public totalMintedFromHarvest;
    uint256 public totalPlants;
    uint256 public totalHarvests;
    
    event Planted(address indexed player, uint256 plotId, uint256 seedType, uint256 cost);
    event Harvested(address indexed player, uint256 plotId, uint256 reward);
    event FaucetClaim(address indexed player, uint256 amount);

    constructor() ERC20("PlantaVerse SEED", "SEED") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Faucet for testnet - gives players free SEED to start playing
     */
    function claimFaucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "Faucet: cooldown active"
        );
        
        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
        
        emit FaucetClaim(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Plant a seed - burns SEED tokens
     * @param plotId The farm plot identifier
     * @param seedType The type of seed (0=tomato, 1=corn, 2=carrot, 3=lettuce)
     * @param cost Amount of SEED to burn
     */
    function plant(uint256 plotId, uint256 seedType, uint256 cost) external {
        require(cost > 0, "Plant: cost must be > 0");
        require(balanceOf(msg.sender) >= cost, "Plant: insufficient SEED");
        
        _burn(msg.sender, cost);
        totalBurned += cost;
        totalPlants++;
        
        emit Planted(msg.sender, plotId, seedType, cost);
    }

    /**
     * @dev Harvest a plant - mints SEED tokens as reward
     * @param plotId The farm plot identifier
     * @param reward Amount of SEED to mint as harvest reward
     */
    function harvest(uint256 plotId, uint256 reward) external {
        // In production: verify harvest eligibility via oracle or game server
        // For prototype: trust the frontend (game server would validate)
        require(reward > 0, "Harvest: reward must be > 0");
        require(reward <= 100 * 10**18, "Harvest: reward too high");
        
        _mint(msg.sender, reward);
        totalMintedFromHarvest += reward;
        totalHarvests++;
        
        emit Harvested(msg.sender, plotId, reward);
    }

    /**
     * @dev Get economy health metrics
     */
    function getEconomyStats() external view returns (
        uint256 _totalSupply,
        uint256 _totalBurned,
        uint256 _totalMinted,
        uint256 _totalPlants,
        uint256 _totalHarvests,
        int256 _netFlow
    ) {
        return (
            totalSupply(),
            totalBurned,
            totalMintedFromHarvest,
            totalPlants,
            totalHarvests,
            int256(totalMintedFromHarvest) - int256(totalBurned)
        );
    }

    /**
     * @dev Check if address can claim faucet
     */
    function canClaimFaucet(address player) external view returns (bool) {
        return block.timestamp >= lastFaucetClaim[player] + FAUCET_COOLDOWN;
    }
}
