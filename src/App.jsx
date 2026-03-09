import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import Experience from './Experience'
import GameUI from './components/ui/GameUI'
import PlantMenu from './components/ui/PlantMenu'
import Notifications from './components/ui/Notifications'
import { useGameStore } from './store/gameStore'
import './styles.css'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'interact', keys: ['KeyE'] },
]

const App = () => {
  const updatePlantGrowth = useGameStore(s => s.updatePlantGrowth)

  // Update plant growth every second
  useEffect(() => {
    const interval = setInterval(updatePlantGrowth, 1000)
    return () => clearInterval(interval)
  }, [updatePlantGrowth])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <KeyboardControls map={keyboardMap}>
        <Canvas 
          shadows 
          camera={{ position: [0, 12, 16], fov: 50 }}
          gl={{ antialias: true }}
        >
          <Experience />
        </Canvas>
      </KeyboardControls>

      {/* UI Overlay */}
      <GameUI />
      <PlantMenu />
      <Notifications />
      
      {/* Controls hint */}
      <div className="controls-hint">
        <span>WASD / Flechas: Mover</span>
        <span>Click en parcela: Plantar/Cosechar</span>
      </div>
    </div>
  )
}

export default App
