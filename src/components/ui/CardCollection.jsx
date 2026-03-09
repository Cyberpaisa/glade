import React, { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { RARITY } from '../../store/seedCards'
import SeedCard from './SeedCard'

const CardCollection = () => {
  const showCollection = useGameStore(s => s.showCollection)
  const toggleCollection = useGameStore(s => s.toggleCollection)
  const seedCards = useGameStore(s => s.seedCards)
  const stakedCards = useGameStore(s => s.stakedCards)
  const seedBalance = useGameStore(s => s.seedBalance)
  const stakingRewards = useGameStore(s => s.stakingRewards)
  const buySeedPack = useGameStore(s => s.buySeedPack)
  const stakeCard = useGameStore(s => s.stakeCard)
  const unstakeCard = useGameStore(s => s.unstakeCard)
  const [tab, setTab] = useState('cards')
  const [selectedCard, setSelectedCard] = useState(null)

  if (!showCollection) return null

  const sortedCards = [...seedCards].sort((a, b) => {
    const order = { legendary: 0, epic: 1, rare: 2, common: 3 }
    return order[a.rarity] - order[b.rarity]
  })

  return (
    <div className="collection-overlay" onClick={toggleCollection}>
      <div className="collection-panel" onClick={e => e.stopPropagation()}>
        <div className="collection-header">
          <h2>Seed Collection</h2>
          <div className="collection-tabs">
            <button className={tab === 'cards' ? 'active' : ''} onClick={() => setTab('cards')}>
              Cards ({seedCards.length})
            </button>
            <button className={tab === 'staked' ? 'active' : ''} onClick={() => setTab('staked')}>
              Staked ({stakedCards.length})
            </button>
            <button className={tab === 'shop' ? 'active' : ''} onClick={() => setTab('shop')}>
              Shop
            </button>
          </div>
          <button className="close-btn" onClick={toggleCollection}>X</button>
        </div>

        {tab === 'cards' && (
          <div className="collection-body">
            {sortedCards.length === 0 ? (
              <div className="empty-collection">
                No tienes semillas. Compra un pack en la tienda!
              </div>
            ) : (
              <div className="card-grid">
                {sortedCards.map(card => (
                  <div key={card.id} className="card-wrapper">
                    <SeedCard
                      card={card}
                      selected={selectedCard === card.id}
                      onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                    />
                    {selectedCard === card.id && (
                      <div className="card-actions">
                        {card.stakingYield > 0 && (
                          <button className="btn-stake" onClick={() => { stakeCard(card.id); setSelectedCard(null) }}>
                            Stake ({(card.stakingYield * 100).toFixed(0)}%)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'staked' && (
          <div className="collection-body">
            <div className="staking-summary">
              <span>Total rewards: {stakingRewards} SEED</span>
              <span>Active stakes: {stakedCards.length}</span>
            </div>
            {stakedCards.length === 0 ? (
              <div className="empty-collection">
                Stakea semillas Rare+ para ganar SEED pasivamente.
              </div>
            ) : (
              <div className="card-grid">
                {stakedCards.map(card => (
                  <div key={card.id} className="card-wrapper">
                    <SeedCard card={card} />
                    <button className="btn-unstake" onClick={() => unstakeCard(card.id)}>
                      Unstake
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'shop' && (
          <div className="collection-body">
            <div className="shop-packs">
              <div className="shop-pack" onClick={() => buySeedPack('basic')}>
                <div className="pack-visual basic">?</div>
                <div className="pack-name">Basic Pack</div>
                <div className="pack-desc">1 carta aleatoria</div>
                <div className="pack-price">15 SEED</div>
                <div className="pack-rates">85% Common / 12% Rare / 2.5% Epic / 0.5% Legendary</div>
              </div>
              <div className="shop-pack" onClick={() => buySeedPack('premium')}>
                <div className="pack-visual premium">?</div>
                <div className="pack-name">Premium Pack</div>
                <div className="pack-desc">3 cartas con mejores odds</div>
                <div className="pack-price">50 SEED</div>
                <div className="pack-rates">60% Common / 30% Rare / 8% Epic / 2% Legendary</div>
              </div>
            </div>
            <div className="shop-balance">Balance: {seedBalance} SEED</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardCollection
