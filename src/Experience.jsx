import React, { useMemo } from 'react'
import { Sky, OrbitControls } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import FarmPlot from './components/environment/FarmPlot'
import Trees from './components/environment/Trees'
import Decorations from './components/environment/Decorations'
import FarmSign from './components/environment/FarmSign'
import Player from './components/environment/Player'
import Pests from './components/environment/Pests'
import WeatherSystem from './components/environment/WeatherSystem'
import { useGameStore } from './store/gameStore'

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static'
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#4a7c3f" />
    </mesh>
  )
}

function FarmGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#5c3d1a" roughness={0.9} />
    </mesh>
  )
}

function Fence() {
  const posts = []
  const size = 7

  for (let i = -size; i <= size; i += 2) {
    posts.push(
      <FencePost key={`f-${i}`} position={[i, 0.4, -size]} />,
      <FencePost key={`b-${i}`} position={[i, 0.4, size]} />
    )
    posts.push(
      <FencePost key={`l-${i}`} position={[-size, 0.4, i]} />,
      <FencePost key={`r-${i}`} position={[size, 0.4, i]} />
    )
  }

  return <group>{posts}</group>
}

function FencePost({ position }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 1.0, 0.15]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[1, 0.1, 0]}>
        <boxGeometry args={[2, 0.08, 0.1]} />
        <meshStandardMaterial color="#a07828" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[1, -0.2, 0]}>
        <boxGeometry args={[2, 0.08, 0.1]} />
        <meshStandardMaterial color="#a07828" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Dynamic lighting based on time of day
function DynamicLighting() {
  const timeOfDay = useGameStore(s => s.timeOfDay)
  const weather = useGameStore(s => s.weather)

  // Sun position based on time (arc across sky)
  const sunAngle = timeOfDay * Math.PI * 2 - Math.PI / 2
  const sunHeight = Math.max(0, Math.sin(sunAngle)) * 60 + 5
  const sunX = Math.cos(sunAngle) * 100

  // Day/night colors
  const isNight = timeOfDay > 0.6 || timeOfDay < 0.1
  const isDusk = timeOfDay > 0.45 && timeOfDay <= 0.6
  const isDawn = timeOfDay >= 0.1 && timeOfDay < 0.2

  let ambientIntensity = 0.5
  let dirIntensity = 1.2
  let dirColor = '#FFF5E0'
  let skyTurbidity = 3

  if (isNight) {
    ambientIntensity = 0.15
    dirIntensity = 0.1
    dirColor = '#4466aa'
    skyTurbidity = 10
  } else if (isDusk) {
    ambientIntensity = 0.3
    dirIntensity = 0.7
    dirColor = '#ff8844'
    skyTurbidity = 6
  } else if (isDawn) {
    ambientIntensity = 0.35
    dirIntensity = 0.8
    dirColor = '#ffaa66'
    skyTurbidity = 5
  }

  // Weather modifiers
  if (weather === 'rain' || weather === 'storm') {
    ambientIntensity *= 0.6
    dirIntensity *= 0.4
    dirColor = '#aabbcc'
    skyTurbidity = 15
  } else if (weather === 'drought') {
    dirIntensity *= 1.2
    dirColor = '#ffddaa'
    skyTurbidity = 1
  }

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[sunX, sunHeight, 8]}
        intensity={dirIntensity}
        color={dirColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight
        position={[-5, 8, -5]}
        intensity={isNight ? 0.05 : 0.3}
        color={isNight ? '#223355' : '#87CEEB'}
      />
      <Sky
        sunPosition={[sunX, sunHeight, 50]}
        turbidity={skyTurbidity}
        rayleigh={isNight ? 0.1 : 0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
    </>
  )
}

const Experience = () => {
  const plots = useGameStore(s => s.plots)

  return (
    <>
      <DynamicLighting />

      <Physics gravity={[0, -9.8, 0]}>
        <Ground />
        <FarmGround />
        {plots.map(plot => (
          <FarmPlot key={plot.id} plot={plot} />
        ))}
      </Physics>

      <Fence />
      <Trees />
      <Decorations />
      <FarmSign />
      <Player />
      <Pests />
      <WeatherSystem />

      <OrbitControls
        makeDefault
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
        minDistance={8}
        maxDistance={30}
        target={[0, 0, 0]}
        enablePan={false}
      />
    </>
  )
}

export default Experience
