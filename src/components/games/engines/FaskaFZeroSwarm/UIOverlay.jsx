import React, { useEffect, useState } from 'react';
import useGameStore from './GameLogic';

export default function UIOverlay({ onExit }) {
  const [uiState, setUiState] = useState({ score: 0, speed: 60, lap: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      setUiState({
        score: state.score,
        speed: Math.floor(state.speed),
        lap: state.lap
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div style={{ position: 'absolute', top: 20, left: 20, color: '#00ffff', zIndex: 10, textShadow: '0 0 10px #00ffff', pointerEvents: 'none' }}>
         <div style={{ fontSize: '32px', fontWeight: 'bold' }}>SCORE: {uiState.score}</div>
         <div style={{ fontSize: '24px' }}>SPEED: {uiState.speed} KM/H</div>
         <div style={{ fontSize: '24px' }}>LAP: {uiState.lap}</div>
         <div style={{ marginTop: '10px', fontSize: '16px', color: '#fff', textShadow: 'none' }}>
           Fly through <strong style={{color:'#00ff00'}}>PRIME NUMBERS</strong>!<br/>
           Dodge composites.
         </div>
      </div>
      <button 
        onClick={onExit}
        style={{ 
          position: 'absolute', top: 20, right: 20, zIndex: 10, 
          padding: '12px 24px', fontSize: '18px', fontWeight: 'bold',
          cursor: 'pointer', backgroundColor: '#ff0055', color: 'white', 
          border: 'none', borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(255,0,85,0.5)',
          textTransform: 'uppercase'
        }}
      >
        Beenden
      </button>
    </>
  );
}
