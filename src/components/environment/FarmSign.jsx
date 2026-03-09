import React from 'react'
import { Text } from '@react-three/drei'

const FarmSign = () => {
  return (
    <group position={[0, 0, -8]}>
      {/* Sign post */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 6]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
      </mesh>
      {/* Sign board */}
      <mesh castShadow position={[0, 2.1, 0]}>
        <boxGeometry args={[2.5, 0.8, 0.1]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      {/* Text */}
      <Text
        position={[0, 2.1, 0.06]}
        fontSize={0.3}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        PlantaVerse
      </Text>
    </group>
  )
}

export default FarmSign
