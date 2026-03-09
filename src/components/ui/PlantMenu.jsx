import React from 'react'
import { useGameStore, PLANT_TYPES } from '../../store/gameStore'

const PlantMenu = () => {
  const showPlantMenu = useGameStore(s => s.showPlantMenu)
  const selectedPlotId = useGameStore(s => s.selectedPlotId)
  const selectedSeedType = useGameStore(s => s.selectedSeedType)
  const seedBalance = useGameStore(s => s.seedBalance)
  const setSelectedSeedType = useGameStore(s => s.setSelectedSeedType)
  const plantSeed = useGameStore(s => s.plantSeed)
  const closePlantMenu = useGameStore(s => s.closePlantMenu)

  if (!showPlantMenu) return null

  const selectedPlant = PLANT_TYPES[selectedSeedType]
  const canAfford = seedBalance >= selectedPlant.costSeed

  const handlePlant = () => {
    if (canAfford && selectedPlotId) {
      plantSeed(selectedPlotId, selectedSeedType)
    }
  }

  return (
    <div className="plant-menu-overlay" onClick={closePlantMenu}>
      <div className="plant-menu" onClick={e => e.stopPropagation()}>
        <h2>🌱 Elegir Semilla</h2>

        <div className="seed-options">
          {Object.entries(PLANT_TYPES).map(([key, plant]) => (
            <div
              key={key}
              className={`seed-option ${selectedSeedType === key ? 'selected' : ''}`}
              onClick={() => setSelectedSeedType(key)}
            >
              <span className="seed-emoji">{plant.emoji}</span>
              <div className="seed-name">{plant.name}</div>
              <div className="seed-cost">Costo: {plant.costSeed} SEED</div>
              <div className="seed-yield">Ganancia: +{plant.yieldSeed} SEED</div>
              <div className="seed-time">⏱ {plant.growthTime}s</div>
            </div>
          ))}
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginBottom: '16px',
          padding: '8px',
          background: canAfford ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
          borderRadius: '10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: canAfford ? '#2ecc71' : '#e74c3c'
        }}>
          {canAfford 
            ? `✅ Plantar ${selectedPlant.name} por ${selectedPlant.costSeed} SEED → ganar ${selectedPlant.yieldSeed} SEED`
            : `❌ Necesitas ${selectedPlant.costSeed} SEED (tienes ${seedBalance})`
          }
        </div>

        <div className="plant-menu-actions">
          <button className="btn-cancel" onClick={closePlantMenu}>
            Cancelar
          </button>
          <button 
            className="btn-plant" 
            onClick={handlePlant}
            disabled={!canAfford}
          >
            🌱 Plantar {selectedPlant.name}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlantMenu
