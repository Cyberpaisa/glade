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

<!-- Add a screenshot or demo GIF here -->
<!-- ![Glade Demo](docs/demo.gif) -->

## Architecture

```
┌──────────────────────────────────────────────┐
│                  FRONTEND                     │
│  React 18 + React Three Fiber + Zustand       │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ 3D Farm  │  │  Game UI │  │   Wallet    │  │
│  │ (WebGL)  │  │  (HUD)   │  │  (wagmi)   │  │
│  └──────────┘  └──────────┘  └────────────┘  │
└─────────────────────┬────────────────────────┘
                      │ ethers.js / viem
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
- Isometric farm view rendered with WebGL
- Interactive 3x3 plot grid — click to plant or harvest
- Four visual growth stages: seed, sprout, growing, ready
- Animated environment: trees, rocks, flowers, farm sign
- Progress bars and harvest glow effects

### On-Chain Economy
- **SEED Token (ERC-20)** — native game currency
- **Burn-to-Plant / Mint-to-Harvest** — real circular token flow
- **On-chain faucet** — claim free SEED to start playing (testnet)
- **Economy metrics** — total supply, burns, mints, net flow

### Crop Economics

| Crop     | Cost | Yield | ROI   | Growth Time |
|----------|------|-------|-------|-------------|
| Carrot   | 5    | 12    | 2.4x  | 20s         |
| Lettuce  | 8    | 18    | 2.25x | 25s         |
| Tomato   | 10   | 25    | 2.5x  | 30s         |
| Corn     | 15   | 40    | 2.67x | 45s         |

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Fuji testnet AVAX — [faucet.avax.network](https://faucet.avax.network/)

### Install

```bash
git clone https://github.com/Cyberpaisa/glade.git
cd glade
npm install
```

### Run the frontend

```bash
npm run dev
# Opens at http://localhost:5173
```

### Compile and deploy contracts

```bash
cp .env.example .env
# Add your private key to .env

npx hardhat compile --config hardhat.config.cjs
npx hardhat run scripts/deploy.js --network fuji --config hardhat.config.cjs
```

### Play

1. Connect your wallet (switch to Fuji Testnet)
2. Claim SEED tokens from the in-game faucet
3. Click an empty plot to choose a seed
4. Watch it grow in 3D
5. Harvest when ready to earn SEED

## Project Structure

```
glade/
├── src/
│   ├── contracts/              # Solidity smart contracts
│   │   ├── SeedToken.sol       # ERC-20 SEED token
│   │   └── Glade.sol           # Game logic contract
│   ├── components/
│   │   ├── environment/        # 3D scene components
│   │   │   ├── FarmPlot.jsx
│   │   │   ├── Trees.jsx
│   │   │   ├── Decorations.jsx
│   │   │   └── FarmSign.jsx
│   │   └── ui/                 # Game interface
│   │       ├── GameUI.jsx
│   │       ├── PlantMenu.jsx
│   │       └── Notifications.jsx
│   ├── store/
│   │   └── gameStore.js        # Zustand state management
│   ├── App.jsx
│   ├── Experience.jsx          # 3D scene manager
│   └── main.jsx
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
- [x] Game UI with wallet connection

### Next
- [ ] Full wagmi integration with live contract calls
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
