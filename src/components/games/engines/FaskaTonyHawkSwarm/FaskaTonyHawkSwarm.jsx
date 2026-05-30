import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment } from '@react-three/drei';
import Player from './Player';
import World from './World';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';
import { useGameStore } from './GameLogic';

export default function FaskaTonyHawkSwarm({ onExit, isLearncade = true }) {
  const reset = useGameStore(s => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1a0b2e', position: 'relative' }}>
      <UIOverlay onExit={onExit} isLearncade={isLearncade} />
      <MobileJoystick />
      
      <Canvas shadows camera={{ position: [0, 8, 25], fov: 60 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#1a0b2e']} />
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.5} 
            color="#00ffff"
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          <directionalLight position={[-10, 10, 10]} intensity={1} color="#ff00ff" />
          
          <Physics gravity={[0, -25, 0]}>
            <Player isLearncade={isLearncade} />
            <World />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
