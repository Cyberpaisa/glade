import React from 'react'

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 2, 8]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#2d6b1e" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 3.2, 0]}>
        <coneGeometry args={[0.9, 1.5, 8]} />
        <meshStandardMaterial color="#3a8a2e" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 3.8, 0]}>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="#45a032" roughness={0.8} />
      </mesh>
    </group>
  )
}

const Trees = () => {
  const treePositions = [
    [-12, 0, -10], [-15, 0, -5], [-14, 0, 3], [-11, 0, 8],
    [12, 0, -8], [15, 0, -2], [13, 0, 6], [10, 0, 10],
    [-8, 0, -14], [0, 0, -15], [8, 0, -13],
    [-9, 0, 13], [3, 0, 14], [9, 0, 12],
  ]

  return (
    <group>
      {treePositions.map((pos, i) => (
        <Tree key={i} position={pos} scale={0.8 + Math.random() * 0.5} />
      ))}
    </group>
  )
}

export default Trees
