import React from 'react';
import { useGameStore } from './GameLogic';

const UIOverlay = ({ onExit }) => {
  const { score, gameOver, isPlaying, startGame } = useGameStore();

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pointerEvents: 'auto'
      }}>
        <div style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Score: {score}
        </div>
        
        <button
          onClick={onExit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Beenden
        </button>
      </div>

      {!isPlaying && !gameOver && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
          <button onClick={startGame} style={{
            padding: '15px 40px', fontSize: '24px', fontWeight: 'bold',
            backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            Start Game
          </button>
        </div>
      )}

      {gameOver && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
          <div style={{ fontSize: '48px', color: '#ff4444', fontWeight: 'bold', marginBottom: '20px', textShadow: '2px 2px 4px #000' }}>
            GAME OVER
          </div>
          <button onClick={startGame} style={{
            padding: '15px 40px', fontSize: '24px', fontWeight: 'bold',
            backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
