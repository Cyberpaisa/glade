import React from 'react'

function Rock({ position, scale = 1 }) {
  return (
    <mesh castShadow position={position} scale={scale}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#7a7a7a" roughness={0.95} flatShading />
    </mesh>
  )
}

function Flower({ position, color = '#e74c3c' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshStandardMaterial color="#2d5a1e" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
      </mesh>
    </group>
  )
}

const Decorations = () => {
  return (
    <group>
      {/* Rocks */}
      <Rock position={[-9, 0.2, -3]} scale={0.8} />
      <Rock position={[10, 0.15, 5]} scale={0.6} />
      <Rock position={[-7, 0.25, 9]} scale={1.1} />
      <Rock position={[8, 0.1, -10]} scale={0.5} />

      {/* Flowers */}
      <Flower position={[-8, 0, 1]} color="#e74c3c" />
      <Flower position={[-8.5, 0, 1.5]} color="#f39c12" />
      <Flower position={[9, 0, -4]} color="#9b59b6" />
      <Flower position={[9.5, 0, -3.5]} color="#3498db" />
      <Flower position={[-6, 0, -11]} color="#e91e63" />
      <Flower position={[5, 0, 11]} color="#f1c40f" />
    </group>
  )
}

export default Decorations
