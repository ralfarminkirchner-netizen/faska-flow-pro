import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Environment } from '@react-three/drei';
import { useGameStore } from './GameLogic';
import * as THREE from 'three';

const LetterNode = ({ letter }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 4 + letter.id) * 0.2 + 0.5;
      ref.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[letter.x, 0, letter.z]} ref={ref}>
      <Sphere args={[0.4, 16, 16]}>
        <meshStandardMaterial 
          color={letter.isTarget ? '#00ffff' : '#ff5555'} 
          emissive={letter.isTarget ? '#00aaaa' : '#aa0000'}
          emissiveIntensity={0.5}
          wireframe={!letter.isTarget}
        />
      </Sphere>
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.8}
        color={letter.isTarget ? 'white' : '#ffcccc'}
        outlineWidth={0.05}
        outlineColor="black"
        font="https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff"
      >
        {letter.char}
      </Text>
    </group>
  );
};

export const World = () => {
  const letters = useGameStore(state => state.letters);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Environment preset="night" />

      {/* Grid Platform */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[31, 1, 31]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Grid Lines */}
      <gridHelper args={[31, 31, 0x444466, 0x222244]} position={[0, 0.01, 0]} />

      {/* Bounds (Walls) */}
      <mesh position={[0, 0.5, -16]}>
        <boxGeometry args={[32, 2, 1]} />
        <meshStandardMaterial color="#3a3a5e" />
      </mesh>
      <mesh position={[0, 0.5, 16]}>
        <boxGeometry args={[32, 2, 1]} />
        <meshStandardMaterial color="#3a3a5e" />
      </mesh>
      <mesh position={[-16, 0.5, 0]}>
        <boxGeometry args={[1, 2, 32]} />
        <meshStandardMaterial color="#3a3a5e" />
      </mesh>
      <mesh position={[16, 0.5, 0]}>
        <boxGeometry args={[1, 2, 32]} />
        <meshStandardMaterial color="#3a3a5e" />
      </mesh>

      {/* Letters */}
      {letters.map((l) => (
        <LetterNode key={l.id} letter={l} />
      ))}
    </>
  );
};
