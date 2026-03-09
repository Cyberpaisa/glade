import { create } from 'zustand'

// Plant types with growth times and yields
export const PLANT_TYPES = {
  tomato: {
    name: 'Tomate',
    emoji: '🍅',
    costSeed: 10,
    yieldSeed: 25,
    growthTime: 30, // seconds (short for demo)
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

// Grid of 3x3 farm plots
const createEmptyPlots = () => {
  const plots = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      plots.push({
        id: `plot-${row}-${col}`,
        row,
        col,
        plant: null,       // null | { type, plantedAt, stage }
        position: [col * 3 - 3, 0.05, row * 3 - 3]
      })
    }
  }
  return plots
}

export const useGameStore = create((set, get) => ({
  // Player state
  seedBalance: 100, // Start with 100 SEED tokens
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

  // Actions
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

  // Plant a seed (burns SEED tokens)
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
                stage: 'seed' 
              } 
            }
          : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `🌱 Plantaste ${plantType.name} (-${plantType.costSeed} SEED)`,
        type: 'plant'
      }]
    })
    return true
  },

  // Harvest a ready plant (mints SEED tokens)
  harvestPlant: (plotId) => {
    const state = get()
    const plot = state.plots.find(p => p.id === plotId)
    if (!plot || !plot.plant || plot.plant.stage !== 'ready') return false

    const plantType = PLANT_TYPES[plot.plant.type]

    set({
      seedBalance: state.seedBalance + plantType.yieldSeed,
      totalHarvested: state.totalHarvested + 1,
      plots: state.plots.map(p => 
        p.id === plotId ? { ...p, plant: null } : p
      ),
      notifications: [...state.notifications, {
        id: Date.now(),
        message: `🎉 Cosechaste ${plantType.name} (+${plantType.yieldSeed} SEED)`,
        type: 'harvest'
      }]
    })
    return true
  },

  // Update plant growth stages based on time
  updatePlantGrowth: () => {
    const state = get()
    const now = Date.now()
    
    set({
      plots: state.plots.map(plot => {
        if (!plot.plant || plot.plant.stage === 'ready') return plot
        
        const plantType = PLANT_TYPES[plot.plant.type]
        const elapsed = (now - plot.plant.plantedAt) / 1000
        const progress = elapsed / plantType.growthTime
        
        let stage = 'seed'
        if (progress >= 1) stage = 'ready'
        else if (progress >= 0.66) stage = 'growing'
        else if (progress >= 0.33) stage = 'sprout'
        
        return {
          ...plot,
          plant: { ...plot.plant, stage }
        }
      })
    })
  },

  // Clear old notifications
  clearNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  }
}))
