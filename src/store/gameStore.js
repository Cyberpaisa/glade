import { create } from 'zustand'
import { generateSeedCard, hybridize, getHybridCost, RARITY, TRAITS } from './seedCards'

// Plant types with growth times and yields
export const PLANT_TYPES = {
  tomato: {
    name: 'Tomate',
    emoji: '🍅',
    costSeed: 10,
    yieldSeed: 25,
    growthTime: 30,
    color: '#e74c3c',
    stages: ['seed', 'sprout', 'growing', 'ready']
  },
  corn: {
    name: 'Maíz',
    emoji: '🌽',
    costSeed: 15,
    yieldSeed: 40,
    growthTime: 45,
    color: '#f39c12',
    stages: ['seed', 'sprout', 'growing', 'ready']
  },
  carrot: {
    name: 'Zanahoria',
    emoji: '🥕',
    costSeed: 5,
    yieldSeed: 12,
    growthTime: 20,
    color: '#e67e22',
    stages: ['seed', 'sprout', 'growing', 'ready']
  },
  lettuce: {
    name: 'Lechuga',
    emoji: '🥬',
    costSeed: 8,
    yieldSeed: 18,
    growthTime: 25,
    color: '#27ae60',
    stages: ['seed', 'sprout', 'growing', 'ready']
  }
}

// Pest types that attack crops
export const PEST_TYPES = [
  { name: 'Oruga', color: '#8bc34a', speed: 0.015, damage: 10, reward: 5 },
  { name: 'Escarabajo', color: '#4a2800', speed: 0.01, damage: 15, reward: 8 },
  { name: 'Langosta', color: '#cddc39', speed: 0.025, damage: 20, reward: 12 },
]

// Weather types
export const WEATHER_TYPES = {
  sunny: { name: 'Soleado', growthMod: 1.0, pestChance: 0.02 },
  rain: { name: 'Lluvia', growthMod: 1.5, pestChance: 0.01 },
  drought: { name: 'Sequía', growthMod: 0.5, pestChance: 0.04 },
  storm: { name: 'Tormenta', growthMod: 0.3, pestChance: 0.0 },
}

// Grid of 3x3 farm plots
const createEmptyPlots = () => {
  const plots = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      plots.push({
        id: `plot-${row}-${col}`,
        row,
        col,
        plant: null,
        position: [col * 3 - 3, 0.05, row * 3 - 3]
      })
    }
  }
  return plots
}

let pestIdCounter = 0

export const useGameStore = create((set, get) => ({
  // Player state
  seedBalance: 100,
  walletConnected: false,
  walletAddress: null,

  // Farm state
  plots: createEmptyPlots(),
  selectedPlotId: null,
  selectedSeedType: 'tomato',

  // UI state
  showPlantMenu: false,
  notifications: [],
  totalHarvested: 0,
  totalPlanted: 0,
  pestsKilled: 0,

  // Weather state
  weather: 'sunny',
  timeOfDay: 0, // 0-1 where 0=dawn, 0.25=noon, 0.5=dusk, 0.75=midnight
  dayCount: 1,

  // Pest state
  pests: [], // { id, type, targetPlotId, progress (0-1), hp }

  // Card collection
  seedCards: [],
  selectedCardForPlant: null,
  showCollection: false,
  showLab: false,
  labCardA: null,
  labCardB: null,

  // Staking
  stakedCards: [],
  stakingRewards: 0,

  // Player 3D position
  playerPosition: [0, 0, 10],

  // Actions
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  setWalletConnected: (address) => set({
    walletConnected: true,
    walletAddress: address
  }),

  setWalletDisconnected: () => set({
    walletConnected: false,
    walletAddress: null
  }),

  selectPlot: (plotId) => {
    const plot = get().plots.find(p => p.id === plotId)
    if (plot && !plot.plant) {
      set({ selectedPlotId: plotId, showPlantMenu: true })
    }
  },

  setSelectedSeedType: (type) => set({ selectedSeedType: type }),

  closePlantMenu: () => set({ showPlantMenu: false, selectedPlotId: null }),

  plantSeed: (plotId, seedType) => {
    const state = get()
    const plantType = PLANT_TYPES[seedType]
    if (!plantType) return false
    if (state.seedBalance < plantType.costSeed) return false

    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || plot.plant) return false

    set({
      seedBalance: state.seedBalance - plantType.costSeed,
      totalPlanted: state.totalPlanted + 1,
      showPlantMenu: false,
      selectedPlotId: null,
      plots: state.plots.map(p =>
        p.id === plotId
          ? {
              ...p,
              plant: {
                type: seedType,
                plantedAt: Date.now(),
                stage: 'seed',
                health: 100
              }
            }
          : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Plantaste ${plantType.name} (-${plantType.costSeed} SEED)`,
        type: 'plant'
      }]
    })
    return true
  },

  harvestPlant: (plotId) => {
    const state = get()
    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || !plot.plant || plot.plant.stage !== 'ready') return false

    const plantType = PLANT_TYPES[plot.plant.type]
    const healthBonus = plot.plant.health >= 80 ? 1.0 : plot.plant.health / 100

    const finalYield = Math.round(plantType.yieldSeed * healthBonus)

    set({
      seedBalance: state.seedBalance + finalYield,
      totalHarvested: state.totalHarvested + 1,
      plots: state.plots.map(p =>
        p.id === plotId ? { ...p, plant: null } : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Cosechaste ${plantType.name} (+${finalYield} SEED)`,
        type: 'harvest'
      }]
    })
    return true
  },

  // Weather & time system
  updateTimeAndWeather: () => {
    const state = get()
    let newTime = state.timeOfDay + 0.002 // ~8 min full cycle
    let newDay = state.dayCount
    let newWeather = state.weather

    if (newTime >= 1) {
      newTime = 0
      newDay += 1
      // Random weather change each new day
      const weathers = Object.keys(WEATHER_TYPES)
      newWeather = weathers[Math.floor(Math.random() * weathers.length)]
    }

    set({ timeOfDay: newTime, dayCount: newDay, weather: newWeather })
  },

  // Pest system
  spawnPest: () => {
    const state = get()
    const occupiedPlots = state.plots.filter(p => p.plant && p.plant.stage !== 'seed')
    if (occupiedPlots.length === 0) return

    const weatherConfig = WEATHER_TYPES[state.weather]
    if (Math.random() > weatherConfig.pestChance) return
    if (state.pests.length >= 5) return // max 5 pests at once

    const targetPlot = occupiedPlots[Math.floor(Math.random() * occupiedPlots.length)]
    const pestType = PEST_TYPES[Math.floor(Math.random() * PEST_TYPES.length)]

    // Random spawn direction
    const angle = Math.random() * Math.PI * 2
    const spawnDist = 8

    set({
      pests: [...state.pests, {
        id: ++pestIdCounter,
        type: pestType,
        targetPlotId: targetPlot.id,
        progress: 0,
        hp: 100,
        spawnX: targetPlot.position[0] + Math.cos(angle) * spawnDist,
        spawnZ: targetPlot.position[2] + Math.sin(angle) * spawnDist,
      }]
    })
  },

  updatePests: () => {
    const state = get()
    if (state.pests.length === 0) return

    const updatedPests = []
    const updatedPlots = [...state.plots]
    const newNotifications = []

    for (const pest of state.pests) {
      const newProgress = pest.progress + pest.type.speed

      if (newProgress >= 1) {
        // Pest reached the plant — deal damage
        const plotIdx = updatedPlots.findIndex(p => p.id === pest.targetPlotId)
        if (plotIdx >= 0 && updatedPlots[plotIdx].plant) {
          const newHealth = updatedPlots[plotIdx].plant.health - pest.type.damage
          if (newHealth <= 0) {
            updatedPlots[plotIdx] = { ...updatedPlots[plotIdx], plant: null }
            newNotifications.push({
              id: Date.now() + Math.random(),
              message: `${pest.type.name} destruyo tu planta!`,
              type: 'pest'
            })
          } else {
            updatedPlots[plotIdx] = {
              ...updatedPlots[plotIdx],
              plant: { ...updatedPlots[plotIdx].plant, health: newHealth }
            }
          }
        }
        // Pest disappears after attacking
      } else {
        updatedPests.push({ ...pest, progress: newProgress })
      }
    }

    set({
      pests: updatedPests,
      plots: updatedPlots,
      notifications: [...state.notifications, ...newNotifications]
    })
  },

  killPest: (pestId) => {
    const state = get()
    const pest = state.pests.find(p => p.id === pestId)
    if (!pest) return

    set({
      pests: state.pests.filter(p => p.id !== pestId),
      seedBalance: state.seedBalance + pest.type.reward,
      pestsKilled: state.pestsKilled + 1,
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Eliminaste ${pest.type.name} (+${pest.type.reward} SEED)`,
        type: 'defense'
      }]
    })
  },

  updatePlantGrowth: () => {
    const state = get()
    const now = Date.now()
    const weatherConfig = WEATHER_TYPES[state.weather]

    // Storm can damage plants
    const isStorm = state.weather === 'storm'

    set({
      plots: state.plots.map(plot => {
        if (!plot.plant || plot.plant.stage === 'ready') return plot

        const plantType = PLANT_TYPES[plot.plant.type]
        const elapsed = (now - plot.plant.plantedAt) / 1000
        const adjustedTime = plantType.growthTime / weatherConfig.growthMod
        const progress = elapsed / adjustedTime

        let stage = 'seed'
        if (progress >= 1) stage = 'ready'
        else if (progress >= 0.66) stage = 'growing'
        else if (progress >= 0.33) stage = 'sprout'

        // Storm damage
        let health = plot.plant.health
        if (isStorm && Math.random() < 0.005) {
          health = Math.max(0, health - 5)
        }

        return {
          ...plot,
          plant: { ...plot.plant, stage, health }
        }
      })
    })
  },

  // --- Card System ---
  toggleCollection: () => set(s => ({ showCollection: !s.showCollection, showLab: false })),
  toggleLab: () => set(s => ({ showLab: !s.showLab, showCollection: false })),

  // Buy a seed pack (random cards)
  buySeedPack: (tier = 'basic') => {
    const state = get()
    const cost = tier === 'premium' ? 50 : 15
    if (state.seedBalance < cost) return false

    const cards = []
    const strains = ['tomato', 'corn', 'carrot', 'lettuce']

    const count = tier === 'premium' ? 3 : 1
    for (let i = 0; i < count; i++) {
      const strain = strains[Math.floor(Math.random() * strains.length)]
      const roll = Math.random()
      let rarity = 'common'
      if (tier === 'premium') {
        if (roll < 0.02) rarity = 'legendary'
        else if (roll < 0.1) rarity = 'epic'
        else if (roll < 0.4) rarity = 'rare'
      } else {
        if (roll < 0.005) rarity = 'legendary'
        else if (roll < 0.03) rarity = 'epic'
        else if (roll < 0.15) rarity = 'rare'
      }
      cards.push(generateSeedCard(strain, rarity))
    }

    set({
      seedBalance: state.seedBalance - cost,
      seedCards: [...state.seedCards, ...cards],
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Abriste pack ${tier}! ${cards.map(c => `[${RARITY[c.rarity].name}] ${c.name}`).join(', ')}`,
        type: cards.some(c => c.rarity === 'legendary' || c.rarity === 'epic') ? 'harvest' : 'plant'
      }]
    })
    return cards
  },

  // Select a card to plant
  selectCardForPlant: (cardId) => set({ selectedCardForPlant: cardId }),

  // Plant using a specific card (enhanced planting)
  plantWithCard: (plotId, cardId) => {
    const state = get()
    const card = state.seedCards.find(c => c.id === cardId)
    if (!card) return false

    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || plot.plant) return false

    // Card-based planting costs SEED based on rarity
    const cost = Math.round(10 * RARITY[card.rarity].multiplier)
    if (state.seedBalance < cost) return false

    // Apply trait modifiers
    let growthTime = card.stats.growthTime
    let yieldAmount = card.stats.yield
    let pestResist = 1.0
    let glows = false

    for (const traitKey of card.traits) {
      const trait = TRAITS[traitKey]
      if (trait.effect.growthMod) growthTime = Math.round(growthTime * trait.effect.growthMod)
      if (trait.effect.yieldMod) yieldAmount = Math.round(yieldAmount * trait.effect.yieldMod)
      if (trait.effect.pestResist) pestResist = trait.effect.pestResist
      if (trait.effect.glow) glows = true
    }

    set({
      seedBalance: state.seedBalance - cost,
      totalPlanted: state.totalPlanted + 1,
      showPlantMenu: false,
      showCollection: false,
      selectedPlotId: null,
      selectedCardForPlant: null,
      seedCards: state.seedCards.filter(c => c.id !== cardId),
      plots: state.plots.map(p =>
        p.id === plotId
          ? {
              ...p,
              plant: {
                type: card.strainKey.split('_')[0] || 'tomato',
                plantedAt: Date.now(),
                stage: 'seed',
                health: 100,
                card: { ...card, growthTime, yieldAmount, pestResist, glows },
              }
            }
          : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Plantaste [${RARITY[card.rarity].name}] ${card.name} (-${cost} SEED)`,
        type: 'plant'
      }]
    })
    return true
  },

  // Hybridization lab
  setLabCard: (slot, cardId) => {
    if (slot === 'A') set({ labCardA: cardId })
    else set({ labCardB: cardId })
  },

  hybridizeCards: () => {
    const state = get()
    if (!state.labCardA || !state.labCardB) return false

    const cardA = state.seedCards.find(c => c.id === state.labCardA)
    const cardB = state.seedCards.find(c => c.id === state.labCardB)
    if (!cardA || !cardB) return false

    const cost = getHybridCost(cardA, cardB)
    if (state.seedBalance < cost) return false

    const hybrid = hybridize(cardA, cardB)

    set({
      seedBalance: state.seedBalance - cost,
      seedCards: [
        ...state.seedCards.filter(c => c.id !== cardA.id && c.id !== cardB.id),
        hybrid
      ],
      labCardA: null,
      labCardB: null,
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Hibrido creado! [${RARITY[hybrid.rarity].name}] ${hybrid.name}`,
        type: hybrid.rarity === 'legendary' || hybrid.rarity === 'epic' ? 'harvest' : 'plant'
      }]
    })
    return hybrid
  },

  // Staking
  stakeCard: (cardId) => {
    const state = get()
    const card = state.seedCards.find(c => c.id === cardId)
    if (!card || card.stakingYield <= 0) return false

    set({
      seedCards: state.seedCards.filter(c => c.id !== cardId),
      stakedCards: [...state.stakedCards, { ...card, stakedAt: Date.now() }],
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `Staked [${RARITY[card.rarity].name}] ${card.name} (${(card.stakingYield * 100).toFixed(0)}% yield)`,
        type: 'plant'
      }]
    })
    return true
  },

  unstakeCard: (cardId) => {
    const state = get()
    const card = state.stakedCards.find(c => c.id === cardId)
    if (!card) return false

    set({
      stakedCards: state.stakedCards.filter(c => c.id !== cardId),
      seedCards: [...state.seedCards, card],
    })
    return true
  },

  // Collect staking rewards (called periodically)
  collectStakingRewards: () => {
    const state = get()
    if (state.stakedCards.length === 0) return

    // Rewards based on total staking yield per tick
    let totalYield = 0
    for (const card of state.stakedCards) {
      totalYield += card.stakingYield
    }

    const reward = Math.round(totalYield * 10) // 10 SEED base per tick * yield%
    if (reward <= 0) return

    set({
      seedBalance: state.seedBalance + reward,
      stakingRewards: state.stakingRewards + reward,
    })
  },

  clearNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  }
}))
