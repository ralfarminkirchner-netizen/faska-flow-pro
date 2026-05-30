import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './GameLogic';

const Ship = () => {
  const meshRef = useRef();
  const playerX = useGameStore(state => state.playerX);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += (playerX - meshRef.current.position.x) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 4]} rotation={[-Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.5, 1, 16]} />
      <meshStandardMaterial color="#00ffff" />
    </mesh>
  );
};

export default Ship;
