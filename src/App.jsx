import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import Experience from './Experience'
import GameUI from './components/ui/GameUI'
import PlantMenu from './components/ui/PlantMenu'
import Notifications from './components/ui/Notifications'
import WeatherHUD from './components/ui/WeatherHUD'
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
  const updateTimeAndWeather = useGameStore(s => s.updateTimeAndWeather)
  const spawnPest = useGameStore(s => s.spawnPest)
  const updatePests = useGameStore(s => s.updatePests)

  useEffect(() => {
    // Growth + weather every second
    const growthInterval = setInterval(() => {
      updatePlantGrowth()
      updateTimeAndWeather()
    }, 1000)

    // Pest spawning every 2 seconds
    const pestSpawnInterval = setInterval(spawnPest, 2000)

    // Pest movement every 100ms
    const pestMoveInterval = setInterval(updatePests, 100)

    return () => {
      clearInterval(growthInterval)
      clearInterval(pestSpawnInterval)
      clearInterval(pestMoveInterval)
    }
  }, [updatePlantGrowth, updateTimeAndWeather, spawnPest, updatePests])

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

      <GameUI />
      <PlantMenu />
      <Notifications />
      <WeatherHUD />

      <div className="controls-hint">
        <span>WASD: Mover granjero</span>
        <span>Click parcela: Plantar/Cosechar</span>
        <span>Click plaga: Defender!</span>
      </div>
    </div>
  )
}

export default App
