import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/gameStore'

// Rain particles
function Rain() {
  const rainRef = useRef()
  const count = 300

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = Math.random() * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [])

  useFrame(() => {
    if (!rainRef.current) return
    const posArray = rainRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] -= 0.3
      if (posArray[i * 3 + 1] < 0) {
        posArray[i * 3 + 1] = 15 + Math.random() * 5
      }
    }
    rainRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#aaddff" size={0.08} transparent opacity={0.6} />
    </points>
  )
}

// Storm lightning flash
function StormFlash() {
  const lightRef = useRef()

  useFrame((state) => {
    if (!lightRef.current) return
    // Random lightning flashes
    const flash = Math.sin(state.clock.elapsedTime * 20) > 0.97
    lightRef.current.intensity = flash ? 3 : 0
  })

  return (
    <pointLight
      ref={lightRef}
      position={[0, 20, 0]}
      color="#ffffff"
      intensity={0}
      distance={60}
    />
  )
}

const WeatherSystem = () => {
  const weather = useGameStore(s => s.weather)

  return (
    <group>
      {(weather === 'rain' || weather === 'storm') && <Rain />}
      {weather === 'storm' && <StormFlash />}
    </group>
  )
}

export default WeatherSystem
