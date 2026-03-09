// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SeedToken.sol";

/**
 * @title Glade
 * @dev On-chain farming game logic on Avalanche C-Chain
 * 
 * Players own plots, plant seeds (burn SEED), wait for growth,
 * then harvest (mint SEED). Circular economy.
 */
contract Glade {
    
    SeedToken public seedToken;
    
    // Seed type configurations
    struct SeedConfig {
        string name;
        uint256 cost;       // SEED cost to plant (in wei)
        uint256 reward;     // SEED reward on harvest (in wei)
        uint256 growthTime; // seconds to grow
        bool active;
    }
    
    // Individual farm plot
    struct Plot {
        address owner;
        uint256 seedType;
        uint256 plantedAt;
        bool occupied;
    }
    
    // Player data
    struct Player {
        uint256 totalPlanted;
        uint256 totalHarvested;
        uint256 totalEarned;
        bool registered;
    }
    
    mapping(uint256 => SeedConfig) public seedConfigs;
    mapping(address => mapping(uint256 => Plot)) public playerPlots;
    mapping(address => Player) public players;
    
    uint256 public constant MAX_PLOTS_PER_PLAYER = 9;
    uint256 public seedTypeCount;
    address public owner;
    
    event PlayerRegistered(address indexed player);
    event SeedPlanted(address indexed player, uint256 plotId, uint256 seedType);
    event PlantHarvested(address indexed player, uint256 plotId, uint256 reward);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _seedToken) {
        seedToken = SeedToken(_seedToken);
        owner = msg.sender;
        
        // Initialize seed types (costs in full token units, converted to wei)
        _addSeedType("Tomate",    10 * 10**18, 25 * 10**18, 30);   // 2.5x return, 30s
        _addSeedType("Maiz",      15 * 10**18, 40 * 10**18, 45);   // 2.67x return, 45s
        _addSeedType("Zanahoria",  5 * 10**18, 12 * 10**18, 20);   // 2.4x return, 20s
        _addSeedType("Lechuga",    8 * 10**18, 18 * 10**18, 25);   // 2.25x return, 25s
    }

    function _addSeedType(
        string memory name, 
        uint256 cost, 
        uint256 reward, 
        uint256 growthTime
    ) internal {
        seedConfigs[seedTypeCount] = SeedConfig({
            name: name,
            cost: cost,
            reward: reward,
            growthTime: growthTime,
            active: true
        });
        seedTypeCount++;
    }

    /**
     * @dev Register as a new player
     */
    function register() external {
        require(!players[msg.sender].registered, "Already registered");
        players[msg.sender].registered = true;
        emit PlayerRegistered(msg.sender);
    }

    /**
     * @dev Plant a seed on a specific plot
     */
    function plantSeed(uint256 plotId, uint256 seedType) external {
        require(players[msg.sender].registered, "Not registered");
        require(plotId < MAX_PLOTS_PER_PLAYER, "Invalid plot");
        require(seedType < seedTypeCount, "Invalid seed type");
        require(seedConfigs[seedType].active, "Seed type not active");
        require(!playerPlots[msg.sender][plotId].occupied, "Plot occupied");
        
        SeedConfig memory config = seedConfigs[seedType];
        
        // Burn SEED tokens
        seedToken.plant(plotId, seedType, config.cost);
        
        // Update plot
        playerPlots[msg.sender][plotId] = Plot({
            owner: msg.sender,
            seedType: seedType,
            plantedAt: block.timestamp,
            occupied: true
        });
        
        players[msg.sender].totalPlanted++;
        
        emit SeedPlanted(msg.sender, plotId, seedType);
    }

    /**
     * @dev Harvest a grown plant
     */
    function harvestPlant(uint256 plotId) external {
        require(players[msg.sender].registered, "Not registered");
        Plot storage plot = playerPlots[msg.sender][plotId];
        require(plot.occupied, "Plot empty");
        require(plot.owner == msg.sender, "Not your plot");
        
        SeedConfig memory config = seedConfigs[plot.seedType];
        require(
            block.timestamp >= plot.plantedAt + config.growthTime,
            "Plant not ready"
        );
        
        // Mint SEED reward
        seedToken.harvest(plotId, config.reward);
        
        // Clear plot
        plot.occupied = false;
        plot.plantedAt = 0;
        
        players[msg.sender].totalHarvested++;
        players[msg.sender].totalEarned += config.reward;
        
        emit PlantHarvested(msg.sender, plotId, config.reward);
    }

    /**
     * @dev Check if a plant is ready to harvest
     */
    function isReady(address player, uint256 plotId) external view returns (bool) {
        Plot memory plot = playerPlots[player][plotId];
        if (!plot.occupied) return false;
        SeedConfig memory config = seedConfigs[plot.seedType];
        return block.timestamp >= plot.plantedAt + config.growthTime;
    }

    /**
     * @dev Get growth progress (0-100)
     */
    function getGrowthProgress(address player, uint256 plotId) external view returns (uint256) {
        Plot memory plot = playerPlots[player][plotId];
        if (!plot.occupied) return 0;
        SeedConfig memory config = seedConfigs[plot.seedType];
        uint256 elapsed = block.timestamp - plot.plantedAt;
        if (elapsed >= config.growthTime) return 100;
        return (elapsed * 100) / config.growthTime;
    }

    /**
     * @dev Get all plots for a player
     */
    function getPlayerPlots(address player) external view returns (Plot[] memory) {
        Plot[] memory result = new Plot[](MAX_PLOTS_PER_PLAYER);
        for (uint256 i = 0; i < MAX_PLOTS_PER_PLAYER; i++) {
            result[i] = playerPlots[player][i];
        }
        return result;
    }

    /**
     * @dev Get player stats
     */
    function getPlayerStats(address player) external view returns (Player memory) {
        return players[player];
    }
}
