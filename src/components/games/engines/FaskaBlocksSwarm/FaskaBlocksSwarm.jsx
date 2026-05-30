import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './GameLogic';
import World from './World';
import Blocks from './Blocks';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';

const GameTicker = () => {
  const tick = useGameStore(state => state.tick);
  const isPlaying = useGameStore(state => state.isPlaying);
  const gameOver = useGameStore(state => state.gameOver);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const interval = setInterval(() => {
      tick();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, tick]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!useGameStore.getState().isPlaying || useGameStore.getState().gameOver) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          useGameStore.getState().movePiece(-1, 0);
          break;
        case 'ArrowRight':
          useGameStore.getState().movePiece(1, 0);
          break;
        case 'ArrowDown':
          useGameStore.getState().movePiece(0, 1);
          break;
        case 'ArrowUp':
          useGameStore.getState().rotatePiece();
          break;
        case ' ':
          useGameStore.getState().hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
};

const FaskaBlocksSwarm = ({ onExit }) => {
  const exitGame = useGameStore(state => state.exitGame);

  const handleExit = () => {
    exitGame();
    if (onExit) onExit();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [4.5, -9.5, 18], fov: 60 }}>
        <GameTicker />
        <World />
        <Blocks />
      </Canvas>
      <UIOverlay onExit={handleExit} />
      <MobileJoystick />
    </div>
  );
};

export default FaskaBlocksSwarm;
