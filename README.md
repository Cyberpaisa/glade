# Glade

**3D farming game on Avalanche C-Chain with a circular token economy.**

[![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-E84142?style=flat-square&logo=avalanche&logoColor=white)](https://www.avax.network/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React_Three_Fiber-3D-61DAFB?style=flat-square&logo=react)](https://docs.pmnd.rs/react-three-fiber)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Overview

Glade is a browser-based 3D farming game where players plant, grow, and harvest virtual crops — all powered by smart contracts on Avalanche's C-Chain. The game uses the **SEED** ERC-20 token in a circular economy:

- **Plant** — Burns SEED tokens (deflationary pressure)
- **Grow** — Real-time 3D growth with visual stages
- **Harvest** — Mints SEED tokens as rewards (yield > cost)

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or any Web3 wallet
- Fuji testnet AVAX — [faucet.avax.network](https://faucet.avax.network/)

### 1. Clone and install

```bash
git clone https://github.com/Cyberpaisa/glade.git
cd glade
npm install
```

### 2. Run the game

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Connect your wallet

Click the **Connect Wallet** button (top-right). The game uses RainbowKit and supports MetaMask, WalletConnect, Coinbase Wallet, and more. Make sure you are on the **Avalanche Fuji Testnet**.

### 4. Play

1. Use **WASD** to move your farmer around the 3D farm
2. **Click** an empty plot to open the seed menu
3. Choose a basic seed or use a card from your collection
4. Watch it grow through 4 visual stages
5. **Click** a fully grown plant to harvest and earn SEED
6. **Click** pests to defend your crops and earn bonus SEED

### 5. Deploy contracts (optional)

```bash
cp .env.example .env
# Add your private key and RPC URL to .env

npx hardhat compile --config hardhat.config.cjs
npx hardhat run scripts/deploy.js --network fuji --config hardhat.config.cjs
```

---

## Architecture

```
┌──────────────────────────────────────────────┐
│                  FRONTEND                     │
│  React 18 + React Three Fiber + Zustand       │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ 3D Farm  │  │  Game UI │  │   Wallet    │  │
│  │ (WebGL)  │  │  (HUD)   │  │ (RainbowKit)│  │
│  └──────────┘  └──────────┘  └────────────┘  │
└─────────────────────┬────────────────────────┘
                      │ wagmi + viem
┌─────────────────────┴────────────────────────┐
│            AVALANCHE C-CHAIN (Fuji)           │
│  ┌────────────────┐  ┌────────────────────┐  │
│  │  SeedToken.sol │  │  Glade.sol         │  │
│  │  (ERC-20)      │  │  (Game Logic)      │  │
│  │  mint / burn   │  │  plant / harvest   │  │
│  └────────────────┘  └────────────────────┘  │
└──────────────────────────────────────────────┘
```

## Features

### 3D Farm Environment
- Isometric farm rendered with WebGL via React Three Fiber
- Interactive 3x3 plot grid with click-to-plant and click-to-harvest
- Four visual growth stages: seed, sprout, growing, ready
- WASD player controller with walking animation
- Dynamic day/night cycle with smooth lighting transitions
- Weather system: sunny, rain, drought, storm — each affects growth speed
- Animated trees, rocks, flowers, and farm sign

### Pest Defense
- Pests spawn randomly and move toward your crops
- Click to eliminate them and earn SEED rewards
- Undefended plants take damage over time

### Seed Card System
- Pokemon-style collectible seed cards with unique stats
- Four rarity tiers: Common, Rare, Epic, Legendary
- Each card has Yield, Speed, Resilience, and Potency stats
- Traits: Fast Grow, High Yield, Resilient, All Weather, Double Harvest, Glowing
- Plant directly from your card collection via the PlantMenu

### Hybridization Lab
- Combine two seed cards to create a new hybrid
- Hybrids inherit mixed stats and random traits from parents
- Higher rarity parents produce stronger offspring
- Hybridization costs SEED tokens (scales with parent rarity)

### Staking
- Stake Rare+ cards to earn passive SEED income
- Rewards accumulate every second
- Higher rarity cards yield more SEED per tick
- Unstake anytime to recover your card

### On-Chain Economy
- **SEED Token (ERC-20)** — native game currency
- **Burn-to-Plant / Mint-to-Harvest** — circular token flow
- **Card packs** — spend SEED to open Basic (15) or Premium (50) packs
- **On-chain faucet** — claim free SEED to start playing (testnet)

### Wallet Integration
- RainbowKit + wagmi for real wallet connection
- MetaMask, WalletConnect, Coinbase Wallet support
- Avalanche C-Chain Fuji Testnet

### Crop Economics

| Crop     | Cost | Yield | ROI   | Growth Time |
|----------|------|-------|-------|-------------|
| Carrot   | 5    | 12    | 2.4x  | 20s         |
| Lettuce  | 8    | 18    | 2.25x | 25s         |
| Tomato   | 10   | 25    | 2.5x  | 30s         |
| Corn     | 15   | 40    | 2.67x | 45s         |

Seed cards apply rarity multipliers on top of base economics.

## Project Structure

```
glade/
├── src/
│   ├── contracts/              # Solidity smart contracts
│   │   ├── SeedToken.sol       # ERC-20 SEED token
│   │   └── Glade.sol           # Game logic contract
│   ├── components/
│   │   ├── environment/        # 3D scene components
│   │   │   ├── FarmPlot.jsx    # Interactive farm plots
│   │   │   ├── Player.jsx      # WASD player controller
│   │   │   ├── Pests.jsx       # Pest spawning and defense
│   │   │   ├── WeatherSystem.jsx # Rain and storm effects
│   │   │   ├── Trees.jsx
│   │   │   ├── Decorations.jsx
│   │   │   └── FarmSign.jsx
│   │   └── ui/                 # Game interface
│   │       ├── GameUI.jsx      # HUD with RainbowKit wallet
│   │       ├── PlantMenu.jsx   # Seed selection (basic + cards)
│   │       ├── CardCollection.jsx # Card grid, staking, shop
│   │       ├── HybridLab.jsx   # Card hybridization UI
│   │       ├── SeedCard.jsx    # Card component with stats
│   │       ├── WeatherHUD.jsx  # Weather and time display
│   │       └── Notifications.jsx
│   ├── wallet/
│   │   └── config.js           # Wagmi + Avalanche Fuji config
│   ├── store/
│   │   ├── gameStore.js        # Zustand state management
│   │   └── seedCards.js        # Card generation and hybridization
│   ├── App.jsx
│   ├── Experience.jsx          # 3D scene manager
│   ├── main.jsx
│   └── styles.css
├── scripts/
│   └── deploy.js               # Hardhat deployment script
├── hardhat.config.cjs
├── vite.config.js
└── package.json
```

## Tech Stack

| Layer       | Technology                         |
|-------------|------------------------------------|
| 3D Engine   | Three.js + React Three Fiber       |
| UI          | React 18                           |
| State       | Zustand                            |
| Physics     | @react-three/cannon                |
| Blockchain  | Avalanche C-Chain (Fuji Testnet)   |
| Contracts   | Solidity 0.8.20 + OpenZeppelin     |
| Tooling     | Hardhat + Vite                     |
| Web3        | wagmi + viem + RainbowKit          |

## Roadmap

### MVP (current)
- [x] 3D farm environment with interactive plots
- [x] Plant/harvest mechanics with visual feedback
- [x] SEED token (ERC-20) on Avalanche Fuji
- [x] Circular burn/mint economy
- [x] Wallet connection with RainbowKit
- [x] Pest defense system
- [x] Weather and day/night cycle
- [x] Seed card collection with rarity tiers
- [x] Hybridization lab
- [x] Card staking for passive income

### Next
- [ ] Live contract calls via wagmi hooks
- [ ] ERC-1155 NFT crops (rare plants, special seeds)
- [ ] Multiplayer marketplace
- [ ] Seasonal events and limited-time seeds
- [ ] Leaderboard system

### Future
- [ ] Dedicated Avalanche L1 game chain
- [ ] Mobile PWA support
- [ ] AI-powered plant genetics (crossbreeding)
- [ ] DAO governance for economy parameters
- [ ] Mainnet launch

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## Security

Smart contracts have **not** been audited. This is a prototype for the Avalanche Build Games 2026 hackathon. Do not use with real funds.

If you find a vulnerability, please open a private security advisory instead of a public issue.

## Team

Built by [@Cyber_paisa](https://github.com/Cyberpaisa) for [Avalanche Build Games 2026](https://build.avax.network/build-games).

## License

MIT — see [LICENSE](LICENSE) for details.
