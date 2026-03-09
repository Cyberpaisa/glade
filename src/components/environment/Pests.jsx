import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useGameStore } from '../../store/gameStore'

function Pest({ pest }) {
  const meshRef = useRef()
  const killPest = useGameStore(s => s.killPest)
  const plots = useGameStore(s => s.plots)

  const targetPlot = plots.find(p => p.id === pest.targetPlotId)

  useFrame((state) => {
    if (!meshRef.current || !targetPlot) return

    // Interpolate from spawn point to target
    const t = pest.progress
    const x = pest.spawnX + (targetPlot.position[0] - pest.spawnX) * t
    const z = pest.spawnZ + (targetPlot.position[2] - pest.spawnZ) * t
    const bounce = Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.15

    meshRef.current.position.set(x, 0.2 + bounce, z)
    meshRef.current.rotation.y = state.clock.elapsedTime * 3
  })

  const handleClick = (e) => {
    e.stopPropagation()
    killPest(pest.id)
  }

  return (
    <group ref={meshRef}>
      {/* Pest body */}
      <mesh
        castShadow
        onClick={handleClick}
        onPointerEnter={() => { document.body.style.cursor = 'crosshair' }}
        onPointerLeave={() => { document.body.style.cursor = 'default' }}
      >
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color={pest.type.color}
          emissive="#ff0000"
          emissiveIntensity={0.2}
          roughness={0.5}
        />
      </mesh>

      {/* Legs */}
      {[-0.12, 0.12].map((xOff, i) => (
        <mesh key={i} position={[xOff, -0.12, 0]} castShadow>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color={pest.type.color} />
        </mesh>
      ))}

      {/* Eyes */}
      <mesh position={[-0.07, 0.08, 0.16]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.07, 0.08, 0.16]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Warning indicator */}
      <Html position={[0, 0.5, 0]} center>
        <div style={{
          background: 'rgba(200, 0, 0, 0.85)',
          color: '#fff',
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '11px',
          fontFamily: 'Fredoka, sans-serif',
          fontWeight: 600,
          cursor: 'crosshair',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(255,100,100,0.5)',
          animation: 'notifSlideUp 0.3s ease'
        }}
          onClick={handleClick}
        >
          {pest.type.name} — Click!
        </div>
      </Html>

      {/* Danger ring on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
        <ringGeometry args={[0.25, 0.35, 16]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

const Pests = () => {
  const pests = useGameStore(s => s.pests)

  return (
    <group>
      {pests.map(pest => (
        <Pest key={pest.id} pest={pest} />
      ))}
    </group>
  )
}

export default Pests
