import React from 'react';
import { useGameStore } from './GameLogic';

const UIOverlay = ({ onExit }) => {
  const score = useGameStore(state => state.score);
  const targetNumber = useGameStore(state => state.targetNumber);
  const gameOverState = useGameStore(state => state.gameOverState);
  const restartGame = useGameStore(state => state.restartGame);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', fontFamily: 'sans-serif' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, color: '#00ffff', fontSize: 24, fontWeight: 'bold' }}>
        Punkte: {score}
      </div>
      <div style={{ position: 'absolute', top: 50, left: 20, color: '#00ff00', fontSize: 28, fontWeight: 'bold' }}>
        Ziel: {targetNumber}
      </div>
      <div style={{ position: 'absolute', top: 20, right: 150, color: '#ff00ff', fontSize: 22, fontWeight: 'bold' }}>
        Schieße Teiler!
      </div>
      <button 
        onClick={onExit}
        style={{
          position: 'absolute', top: '15px', right: '15px', padding: '10px 20px',
          backgroundColor: 'rgba(255, 0, 50, 0.8)', color: 'white', border: '2px solid white',
          borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
          pointerEvents: 'auto'
        }}
      >
        Beenden
      </button>

      {gameOverState && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 40, borderRadius: 20, pointerEvents: 'auto' }}>
          <h1 style={{ color: 'red', fontSize: 48, margin: 0 }}>GAME OVER</h1>
          <h2 style={{ color: 'white' }}>Endpunktzahl: {score}</h2>
          <button 
            onClick={restartGame}
            style={{ padding: '10px 20px', fontSize: 24, backgroundColor: '#00ffff', border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 20 }}
          >
            Neustart
          </button>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
