# 🌱 PlantaVerse — 3D Plant Farming Game on Avalanche

> **A fun, immersive 3D farming simulator built on Avalanche C-Chain with a circular token economy.**

![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-E84142?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU0IiBoZWlnaHQ9IjI1NCIgdmlld0JveD0iMCAwIDI1NCAyNTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)
![React](https://img.shields.io/badge/React_Three_Fiber-3D-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🎮 What is PlantaVerse?

PlantaVerse is a **browser-based 3D farming game** where players plant, grow, and harvest virtual crops — all powered by smart contracts on Avalanche's C-Chain. The game features a **circular token economy** using the SEED ERC-20 token:

- 🔥 **Plant** → Burns SEED tokens (deflationary)
- 🌱 **Grow** → Watch your 3D plants grow in real-time
- 🎉 **Harvest** → Mints SEED tokens as rewards (inflationary)
- ♻️ **Circular Economy** → Harvest yields > Plant costs, incentivizing gameplay

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                  FRONTEND                     │
│  React + React Three Fiber + Zustand          │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ 3D Farm  │  │  Game UI │  │   Wallet    │  │
│  │ (WebGL)  │  │  (HUD)   │  │  (wagmi)   │  │
│  └──────────┘  └──────────┘  └────────────┘  │
└─────────────────────┬────────────────────────┘
                      │ ethers.js / viem
┌─────────────────────┴────────────────────────┐
│            AVALANCHE C-CHAIN (Fuji)           │
│  ┌────────────────┐  ┌────────────────────┐  │
│  │  SeedToken.sol │  │  PlantaVerse.sol   │  │
│  │  (ERC-20)      │  │  (Game Logic)      │  │
│  │  mint/burn     │  │  plant/harvest     │  │
│  └────────────────┘  └────────────────────┘  │
└──────────────────────────────────────────────┘
```

## ✨ Features

### 3D Farm Environment
- Immersive isometric farm view with WebGL rendering
- Interactive 3x3 plot grid with click-to-plant mechanics
- 4 growth stages with visual progression (seed → sprout → growing → ready)
- Animated decorations: windmill, barn, trees, flowers, water trough
- Progress bars and harvest glow effects

### Blockchain Economy
- **SEED Token (ERC-20)**: Native game currency on Avalanche C-Chain
- **4 Crop Types**: Tomato, Corn, Carrot, Lettuce — each with unique economics
- **On-chain Faucet**: Players claim free SEED to start playing
- **Burn-to-Plant / Mint-to-Harvest**: Real circular token flow
- **Economy Dashboard**: Track total supply, burns, mints, net flow

### Crop Economics

| Crop     | Cost (SEED) | Yield (SEED) | ROI   | Growth Time |
|----------|-------------|--------------|-------|-------------|
| 🥕 Carrot  | 5          | 12           | 2.4x  | 20s         |
| 🥬 Lettuce | 8          | 18           | 2.25x | 25s         |
| 🍅 Tomato  | 10         | 25           | 2.5x  | 30s         |
| 🌽 Corn    | 15         | 40           | 2.67x | 45s         |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Avalanche Fuji testnet AVAX ([Get from faucet](https://faucet.avax.network/))

### 1. Clone & Install

```bash
git clone https://github.com/Colombia-Blockchain/plantaverse.git
cd plantaverse
npm install
```

### 2. Deploy Smart Contracts (Fuji Testnet)

```bash
cp .env.example .env
# Edit .env with your private key

npx hardhat compile
npx hardhat run scripts/deploy.js --network fuji
```

### 3. Run the Game

```bash
npm run dev
# Open http://localhost:5173
```

### 4. Play!
1. Connect your MetaMask wallet (Fuji Testnet)
2. Claim SEED tokens from the in-game faucet
3. Click on an empty plot to plant
4. Choose your seed type
5. Watch it grow in 3D!
6. Harvest when ready to earn SEED

## 📁 Project Structure

```
plantaverse/
├── src/
│   ├── contracts/          # Solidity smart contracts
│   │   ├── SeedToken.sol   # ERC-20 SEED token
│   │   └── PlantaVerse.sol # Game logic contract
│   ├── components/
│   │   ├── environment/    # 3D world components
│   │   │   ├── FarmPlot.jsx    # Interactive farm plots
│   │   │   ├── Trees.jsx       # Tree decorations
│   │   │   ├── Decorations.jsx # Barn, windmill, etc.
│   │   │   └── FarmSign.jsx    # Farm sign
│   │   └── ui/             # Game interface
│   │       ├── GameUI.jsx      # HUD (balance, stats)
│   │       ├── PlantMenu.jsx   # Seed selection modal
│   │       └── Notifications.jsx
│   ├── store/
│   │   └── gameStore.js    # Zustand state management
│   ├── App.jsx             # Main app with Canvas
│   ├── Experience.jsx      # 3D scene manager
│   └── main.jsx            # Entry point
├── scripts/
│   └── deploy.js           # Hardhat deployment
├── docs/
│   └── economy-whitepaper.md
├── hardhat.config.cjs
├── vite.config.js
└── package.json
```

## 🛠️ Tech Stack

| Layer        | Technology                           |
|-------------|--------------------------------------|
| 3D Engine   | Three.js + React Three Fiber         |
| UI Framework| React 18                             |
| State       | Zustand                              |
| Physics     | @react-three/cannon                  |
| Blockchain  | Avalanche C-Chain (Fuji Testnet)     |
| Contracts   | Solidity 0.8.20 + OpenZeppelin       |
| Tooling     | Hardhat + Vite                       |
| Web3        | wagmi + viem + RainbowKit            |
| Styling     | Custom CSS with CSS Variables        |

## 🗺️ Roadmap

### ✅ Stage 2: MVP (Current)
- [x] 3D farm environment with interactive plots
- [x] Plant/harvest mechanics with visual feedback
- [x] SEED token (ERC-20) on Avalanche Fuji
- [x] Circular burn/mint economy
- [x] Game UI with wallet connection

### 🔜 Stage 3: GTM & Vision
- [ ] Full wagmi integration with real contract calls
- [ ] ERC-1155 NFT crops (rare plants, special seeds)
- [ ] Multiplayer marketplace (trade crops between players)
- [ ] Seasonal events and limited-time seeds
- [ ] Leaderboard system

### 🔮 Future
- [ ] Avalanche L1 dedicated game chain
- [ ] Mobile PWA support
- [ ] AI-powered plant genetics (crossbreeding)
- [ ] DAO governance for game economy parameters
- [ ] Mainnet launch

## 🤝 Team

Built with 💚 by **@Cyber_paisa** for the [Avalanche Build Games 2026](https://build.avax.network/build-games) competition.

Part of the [Colombia-Blockchain](https://github.com/Colombia-Blockchain) ecosystem.

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

**🌱 Plant. Grow. Harvest. Earn. — PlantaVerse on Avalanche.**
