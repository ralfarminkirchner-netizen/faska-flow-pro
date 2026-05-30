import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useGameStore } from './GameLogic';

const CONTINENTS = [
  { name: 'North America', position: [-15, 1, -15] },
  { name: 'South America', position: [-8, 1, -5] },
  { name: 'Europe', position: [5, 1, -20] },
  { name: 'Africa', position: [2, 1, -8] },
  { name: 'Asia', position: [18, 1, -15] },
  { name: 'Australia', position: [20, 1, 5] },
  { name: 'Antarctica', position: [0, 1, 20] },
];

const Star = ({ position, name, isLearncade = true }) => {
  const meshRef = useRef();
  const { collectStar, collectedContinents } = useGameStore();
  
  const isCollected = collectedContinents.includes(name);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5;
      meshRef.current.rotation.x += delta * 0.5;
      // Hover effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  if (isCollected) return null;

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Sensor collider for triggering collection */}
      <CuboidCollider 
        args={[1.5, 1.5, 1.5]} 
        sensor 
        position={position}
        onIntersectionEnter={(payload) => {
          // Check if it's the player intersecting, assuming player uses a character controller or similar rigid body
          // We can just trigger on any intersection for simplicity, or check payload.other.rigidBodyObject.name
          collectStar(name, isLearncade);
        }} 
      />
      <group position={position}>
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[0.6]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#d97706" 
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </RigidBody>
  );
};

export const Collectibles = ({ isLearncade = true }) => {
  return (
    <group>
      {CONTINENTS.map((continent) => (
        <Star 
          key={continent.name}
          name={continent.name}
          position={continent.position}
          isLearncade={isLearncade}
        />
      ))}
    </group>
  );
};
