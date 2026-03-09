import React from 'react'
import { useGameStore } from '../../store/gameStore'

const GameUI = () => {
  const seedBalance = useGameStore(s => s.seedBalance)
  const walletConnected = useGameStore(s => s.walletConnected)
  const walletAddress = useGameStore(s => s.walletAddress)
  const totalPlanted = useGameStore(s => s.totalPlanted)
  const totalHarvested = useGameStore(s => s.totalHarvested)
  const pestsKilled = useGameStore(s => s.pestsKilled)
  const seedCards = useGameStore(s => s.seedCards)
  const stakedCards = useGameStore(s => s.stakedCards)
  const setWalletConnected = useGameStore(s => s.setWalletConnected)
  const setWalletDisconnected = useGameStore(s => s.setWalletDisconnected)
  const toggleCollection = useGameStore(s => s.toggleCollection)
  const toggleLab = useGameStore(s => s.toggleLab)

  const handleWalletClick = () => {
    if (walletConnected) {
      setWalletDisconnected()
    } else {
      const fakeAddr = '0x' + Array.from({length: 40}, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('')
      setWalletConnected(fakeAddr)
    }
  }

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="game-hud">
      <div className="hud-left">
        <div className="game-logo">
          <span className="logo-icon">🌱</span>
          <h1>Glade</h1>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div className="seed-balance">
            <span className="seed-icon">🪙</span>
            <div>
              <div className="seed-amount">{seedBalance}</div>
              <div className="seed-label">SEED Tokens</div>
            </div>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">🌱</span>
            <span className="stat-value">{totalPlanted}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎉</span>
            <span className="stat-value">{totalHarvested}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🛡️</span>
            <span className="stat-value">{pestsKilled}</span>
          </div>
        </div>

        {/* Game action buttons */}
        <div className="hud-actions">
          <button className="hud-action-btn collection" onClick={toggleCollection}>
            Cards ({seedCards.length})
          </button>
          <button className="hud-action-btn lab" onClick={toggleLab}>
            Lab
          </button>
          {stakedCards.length > 0 && (
            <div className="staking-indicator">
              Staking: {stakedCards.length} cards
            </div>
          )}
        </div>
      </div>

      <div className="hud-right">
        <button
          className={`wallet-btn ${walletConnected ? 'connected' : ''}`}
          onClick={handleWalletClick}
        >
          {walletConnected ? (
            <>
              <span>🟢</span>
              <span>{shortenAddress(walletAddress)}</span>
            </>
          ) : (
            <>
              <span>🔗</span>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
        <div className="avax-badge">
          ◆ Avalanche C-Chain · Fuji Testnet
        </div>
      </div>
    </div>
  )
}

export default GameUI
