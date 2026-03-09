import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { getHybridCost, RARITY } from '../../store/seedCards'
import SeedCard from './SeedCard'

const HybridLab = () => {
  const showLab = useGameStore(s => s.showLab)
  const toggleLab = useGameStore(s => s.toggleLab)
  const seedCards = useGameStore(s => s.seedCards)
  const seedBalance = useGameStore(s => s.seedBalance)
  const labCardA = useGameStore(s => s.labCardA)
  const labCardB = useGameStore(s => s.labCardB)
  const setLabCard = useGameStore(s => s.setLabCard)
  const hybridizeCards = useGameStore(s => s.hybridizeCards)

  if (!showLab) return null

  const cardA = seedCards.find(c => c.id === labCardA)
  const cardB = seedCards.find(c => c.id === labCardB)

  const cost = cardA && cardB ? getHybridCost(cardA, cardB) : 0
  const canHybridize = cardA && cardB && seedBalance >= cost

  const availableCards = seedCards.filter(c => c.id !== labCardA && c.id !== labCardB)

  return (
    <div className="collection-overlay" onClick={toggleLab}>
      <div className="lab-panel" onClick={e => e.stopPropagation()}>
        <div className="collection-header">
          <h2>Hybridization Lab</h2>
          <button className="close-btn" onClick={toggleLab}>X</button>
        </div>

        <div className="lab-slots">
          {/* Slot A */}
          <div className="lab-slot">
            <div className="lab-slot-label">Parent A</div>
            {cardA ? (
              <SeedCard card={cardA} onClick={() => setLabCard('A', null)} />
            ) : (
              <div className="lab-empty-slot">Elige semilla</div>
            )}
          </div>

          {/* Fusion indicator */}
          <div className="lab-fusion">
            <div className="fusion-icon">+</div>
            {cost > 0 && <div className="fusion-cost">{cost} SEED</div>}
          </div>

          {/* Slot B */}
          <div className="lab-slot">
            <div className="lab-slot-label">Parent B</div>
            {cardB ? (
              <SeedCard card={cardB} onClick={() => setLabCard('B', null)} />
            ) : (
              <div className="lab-empty-slot">Elige semilla</div>
            )}
          </div>
        </div>

        <button
          className="btn-hybridize"
          disabled={!canHybridize}
          onClick={hybridizeCards}
        >
          {canHybridize ? `Hybridize (${cost} SEED)` : 'Selecciona 2 semillas'}
        </button>

        {/* Available cards to pick from */}
        <div className="lab-card-picker">
          <div className="picker-label">Tus semillas:</div>
          <div className="picker-grid">
            {availableCards.map(card => (
              <SeedCard
                key={card.id}
                card={card}
                compact
                onClick={() => {
                  if (!labCardA) setLabCard('A', card.id)
                  else if (!labCardB) setLabCard('B', card.id)
                }}
              />
            ))}
            {availableCards.length === 0 && (
              <div className="empty-collection">No hay semillas disponibles.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HybridLab
