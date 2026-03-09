import React, { useState } from 'react'
import { useGameStore, PLANT_TYPES } from '../../store/gameStore'
import { RARITY, TRAITS } from '../../store/seedCards'

const PlantMenu = () => {
  const showPlantMenu = useGameStore(s => s.showPlantMenu)
  const selectedPlotId = useGameStore(s => s.selectedPlotId)
  const selectedSeedType = useGameStore(s => s.selectedSeedType)
  const seedBalance = useGameStore(s => s.seedBalance)
  const seedCards = useGameStore(s => s.seedCards)
  const setSelectedSeedType = useGameStore(s => s.setSelectedSeedType)
  const plantSeed = useGameStore(s => s.plantSeed)
  const plantWithCard = useGameStore(s => s.plantWithCard)
  const closePlantMenu = useGameStore(s => s.closePlantMenu)

  const [tab, setTab] = useState('basic')
  const [selectedCardId, setSelectedCardId] = useState(null)

  if (!showPlantMenu) return null

  const selectedPlant = PLANT_TYPES[selectedSeedType]
  const canAfford = seedBalance >= selectedPlant.costSeed

  const selectedCard = seedCards.find(c => c.id === selectedCardId)
  const cardCost = selectedCard ? Math.round(10 * RARITY[selectedCard.rarity].multiplier) : 0
  const canAffordCard = selectedCard && seedBalance >= cardCost

  const handlePlantBasic = () => {
    if (canAfford && selectedPlotId) {
      plantSeed(selectedPlotId, selectedSeedType)
    }
  }

  const handlePlantCard = () => {
    if (canAffordCard && selectedPlotId) {
      plantWithCard(selectedPlotId, selectedCardId)
      setSelectedCardId(null)
    }
  }

  const sortedCards = [...seedCards].sort((a, b) => {
    const order = { legendary: 0, epic: 1, rare: 2, common: 3 }
    return order[a.rarity] - order[b.rarity]
  })

  return (
    <div className="plant-menu-overlay" onClick={closePlantMenu}>
      <div className="plant-menu" onClick={e => e.stopPropagation()}>
        <h2>Elegir Semilla</h2>

        <div className="plant-tabs">
          <button
            className={tab === 'basic' ? 'active' : ''}
            onClick={() => { setTab('basic'); setSelectedCardId(null) }}
          >
            Basicas
          </button>
          <button
            className={tab === 'cards' ? 'active' : ''}
            onClick={() => setTab('cards')}
          >
            Seed Cards ({seedCards.length})
          </button>
        </div>

        {tab === 'basic' && (
          <>
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
                  <div className="seed-yield">+{plant.yieldSeed} SEED</div>
                  <div className="seed-time">{plant.growthTime}s</div>
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
                ? `Plantar ${selectedPlant.name} por ${selectedPlant.costSeed} SEED`
                : `Necesitas ${selectedPlant.costSeed} SEED (tienes ${seedBalance})`
              }
            </div>

            <div className="plant-menu-actions">
              <button className="btn-cancel" onClick={closePlantMenu}>Cancelar</button>
              <button className="btn-plant" onClick={handlePlantBasic} disabled={!canAfford}>
                Plantar {selectedPlant.name}
              </button>
            </div>
          </>
        )}

        {tab === 'cards' && (
          <>
            {sortedCards.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#666',
                padding: '30px 0',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
              }}>
                No tienes seed cards. Compra packs desde "Cards" en el HUD.
              </div>
            ) : (
              <div className="card-plant-list">
                {sortedCards.map(card => {
                  const cost = Math.round(10 * RARITY[card.rarity].multiplier)
                  const isSelected = selectedCardId === card.id
                  return (
                    <div
                      key={card.id}
                      className={`card-plant-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedCardId(isSelected ? null : card.id)}
                      style={{ borderColor: isSelected ? RARITY[card.rarity].border : 'rgba(255,255,255,0.1)' }}
                    >
                      <div className="cpi-rarity" style={{ background: RARITY[card.rarity].color }}>
                        {RARITY[card.rarity].name[0]}
                      </div>
                      <div className="cpi-info">
                        <div className="cpi-name">{card.name}</div>
                        <div className="cpi-stats">
                          YLD:{card.stats.yield} SPD:{card.stats.growthTime}s RES:{card.stats.resilience}
                        </div>
                        {card.traits.length > 0 && (
                          <div className="cpi-traits">
                            {card.traits.map(t => TRAITS[t]?.icon).join(' ')}
                          </div>
                        )}
                      </div>
                      <div className="cpi-cost">{cost}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {selectedCard && (
              <div style={{
                textAlign: 'center',
                margin: '12px 0',
                padding: '8px',
                background: canAffordCard ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                borderRadius: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: canAffordCard ? '#2ecc71' : '#e74c3c'
              }}>
                [{RARITY[selectedCard.rarity].name}] {selectedCard.name} — Costo: {cardCost} SEED — Yield: +{selectedCard.stats.yield}
              </div>
            )}

            <div className="plant-menu-actions">
              <button className="btn-cancel" onClick={closePlantMenu}>Cancelar</button>
              <button
                className="btn-plant"
                onClick={handlePlantCard}
                disabled={!canAffordCard}
                style={selectedCard ? {
                  background: `linear-gradient(135deg, ${RARITY[selectedCard.rarity].color}, ${RARITY[selectedCard.rarity].border})`,
                } : {}}
              >
                {selectedCard ? `Plantar ${selectedCard.name}` : 'Elige una card'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PlantMenu
