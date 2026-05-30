import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { World } from './World';
import { Effects } from './Effects';
import { PlayerController } from './PlayerController';
import { MobileJoystick } from './MobileJoystick';
import { UIOverlay } from './UIOverlay';
import { Collectibles } from './Collectibles';
import { useGameStore } from './GameLogic';

export default function FaskaSixtyFour({ onExit, isLearncade = true }) {
  const { phase, resetGame } = useGameStore();

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#3b82f6', overflow: 'hidden' }}>
      
      {/* 2D UI Layer */}
      <UIOverlay onExit={onExit} />
      
      {/* Mobile Touch Controls */}
      {phase === 'playing' && <MobileJoystick />}

      {/* 3D Scene */}
      <Canvas shadows camera={{ fov: 60 }}>
        <Effects />
        
        <Physics gravity={[0, -20, 0]} paused={phase === 'quiz'}>
          <World />
          <Collectibles isLearncade={isLearncade} />
          <PlayerController />
        </Physics>
      </Canvas>
    </div>
  );
}
