# PlantaVerse Economy Whitepaper

## Circular Token Economy Design

### Overview

PlantaVerse implements a **burn-to-play, mint-to-earn** circular economy using the SEED ERC-20 token on Avalanche C-Chain. The design ensures sustainable gameplay where value flows in a closed loop.

### Token Flow

```
  [Player Wallet]
       │
       ├── PLANT (burn SEED) ──→ [Deflationary Pressure]
       │                              │
       │                         [Growth Timer]
       │                              │
       └── HARVEST (mint SEED) ←── [Inflationary Reward]
```

### Economic Parameters

**Yield Multiplier:** All crops return 2.25x - 2.67x the planting cost. This positive-sum mechanic incentivizes active gameplay while the time-lock (growth period) prevents instant arbitrage.

**Natural Sinks (Planned):**
- Tool upgrades (faster growth, better yields)
- Land expansion (new plot purchases)
- Cosmetic purchases (farm decorations)
- Marketplace listing fees

**Anti-Inflation Mechanisms (Planned):**
- Dynamic yield adjustment based on total supply
- Seasonal crop rotation (some crops unavailable)
- Staking locks for premium features

### Smart Contract Security

- OpenZeppelin ERC-20 base (battle-tested)
- Harvest reward cap: 100 SEED per transaction
- Faucet cooldown: 1 hour between claims
- Owner-only administrative functions

### On-Chain Metrics

The `getEconomyStats()` function exposes:
- Total supply, total burned, total minted
- Plant count, harvest count
- Net token flow (minted - burned)

These metrics enable real-time economy health monitoring and future DAO governance decisions.

---

*PlantaVerse — Where farming meets DeFi on Avalanche.*
