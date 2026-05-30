import React, { useEffect } from 'react';
import { World } from './World';
import { Player } from './Player';
import { MobileJoystick } from './MobileJoystick';
import { UIOverlay } from './UIOverlay';
import { useGameStore } from './GameLogic';

export default function FaskaZeldaSwarm({ onExit }) {
  const { phase, resetGame } = useGameStore();

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div style={{ 
      width: '100%', height: '100vh', 
      position: 'relative', 
      backgroundColor: '#050510', 
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Game Window container */}
      <div style={{ 
        width: '800px', height: '600px', 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.8)',
        border: '4px solid #333388',
        borderRadius: '8px'
      }}>
        <World />
        <Player />
      </div>

      <UIOverlay onExit={onExit} />
      
      {phase === 'playing' && <MobileJoystick />}
    </div>
  );
}
