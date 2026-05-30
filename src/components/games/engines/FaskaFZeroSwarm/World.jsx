import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from './GameLogic';

export default function World() {
  const gridRef = useRef();
  
  // CRITICAL: Load /textures/fzero_track.png
  const trackTexture = useTexture('/textures/fzero_track.png');
  trackTexture.wrapS = trackTexture.wrapT = THREE.RepeatWrapping;
  trackTexture.repeat.set(1, 10);

  useFrame((state, delta) => {
    const speed = useGameStore.getState().speed;
    if (gridRef.current) {
      gridRef.current.position.z += speed * delta;
      if (gridRef.current.position.z > 20) {
        gridRef.current.position.z -= 20; 
      }
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -200]}>
        <planeGeometry args={[120, 600]} />
        <meshStandardMaterial map={trackTexture} color="#050510" />
      </mesh>
      
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -200]}>
        <planeGeometry args={[60, 600, 12, 120]} />
        <meshBasicMaterial color="#ff0055" wireframe={true} transparent opacity={0.2} />
      </mesh>
      
      <mesh position={[-30, 5, -200]}>
         <boxGeometry args={[2, 10, 600]} />
         <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[30, 5, -200]}>
         <boxGeometry args={[2, 10, 600]} />
         <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}
