import React, { useRef } from 'react'
import { Sky, Environment, OrbitControls, Grid } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import FarmPlot from './components/environment/FarmPlot'
import Trees from './components/environment/Trees'
import Decorations from './components/environment/Decorations'
import FarmSign from './components/environment/FarmSign'
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
    // Front and back fences
    posts.push(
      <FencePost key={`f-${i}`} position={[i, 0.4, -size]} />,
      <FencePost key={`b-${i}`} position={[i, 0.4, size]} />
    )
    // Left and right fences
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
      {/* Vertical post */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 1.0, 0.15]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      {/* Horizontal rail */}
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

const Experience = () => {
  const plots = useGameStore(s => s.plots)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 15, 8]} 
        intensity={1.2} 
        color="#FFF5E0"
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
        intensity={0.3} 
        color="#87CEEB"
      />

      {/* Sky */}
      <Sky 
        sunPosition={[100, 60, 50]} 
        turbidity={3} 
        rayleigh={0.5} 
        mieCoefficient={0.005} 
        mieDirectionalG={0.8} 
      />

      <Physics gravity={[0, -9.8, 0]}>
        {/* Ground */}
        <Ground />
        
        {/* Farm soil area */}
        <FarmGround />

        {/* Farm Plots 3x3 */}
        {plots.map(plot => (
          <FarmPlot key={plot.id} plot={plot} />
        ))}
      </Physics>

      {/* Fence around the farm */}
      <Fence />

      {/* Trees */}
      <Trees />

      {/* Decorations */}
      <Decorations />

      {/* Farm Sign */}
      <FarmSign />

      {/* Camera controls */}
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
