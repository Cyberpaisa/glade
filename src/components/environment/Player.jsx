import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useGameStore } from '../../store/gameStore'

const SPEED = 0.12

const Player = () => {
  const groupRef = useRef()
  const bodyRef = useRef()
  const [, getKeys] = useKeyboardControls()
  const setPlayerPosition = useGameStore(s => s.setPlayerPosition)

  useFrame((state) => {
    if (!groupRef.current) return

    const { forward, backward, left, right } = getKeys()
    const pos = groupRef.current.position

    if (forward) pos.z -= SPEED
    if (backward) pos.z += SPEED
    if (left) pos.x -= SPEED
    if (right) pos.x += SPEED

    // Clamp to bounds
    pos.x = Math.max(-25, Math.min(25, pos.x))
    pos.z = Math.max(-25, Math.min(25, pos.z))

    // Walking animation
    const isMoving = forward || backward || left || right
    if (bodyRef.current && isMoving) {
      bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.1
      bodyRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.08 + 0.65
    } else if (bodyRef.current) {
      bodyRef.current.rotation.z = 0
      bodyRef.current.position.y = 0.65
    }

    // Face movement direction
    if (isMoving) {
      const dx = (right ? 1 : 0) - (left ? 1 : 0)
      const dz = (backward ? 1 : 0) - (forward ? 1 : 0)
      if (dx !== 0 || dz !== 0) {
        groupRef.current.rotation.y = Math.atan2(dx, dz)
      }
    }

    setPlayerPosition([pos.x, pos.y, pos.z])
  })

  return (
    <group ref={groupRef} position={[0, 0, 10]}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.2} />
      </mesh>

      <group ref={bodyRef} position={[0, 0.65, 0]}>
        {/* Body */}
        <mesh castShadow position={[0, 0, 0]}>
          <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
          <meshStandardMaterial color="#3498db" roughness={0.6} />
        </mesh>

        {/* Head */}
        <mesh castShadow position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fdd9b5" roughness={0.5} />
        </mesh>

        {/* Hat (farmer) */}
        <mesh castShadow position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
          <meshStandardMaterial color="#8B6914" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.15, 16]} />
          <meshStandardMaterial color="#8B6914" roughness={0.8} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.08, 0.58, 0.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.08, 0.58, 0.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  )
}

export default Player
