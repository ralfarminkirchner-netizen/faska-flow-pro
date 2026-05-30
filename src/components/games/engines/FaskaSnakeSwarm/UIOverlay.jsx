import React from 'react';
import { useGameStore } from './GameLogic';

export const UIOverlay = ({ onExit }) => {
  const { targetWord, targetIndex, wordCount, score, gameOver, initGame } = useGameStore();

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
    }}>
      {/* HUD Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#aaaaaa' }}>ZIEL:</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {targetWord.split('').map((char, i) => {
              let color = '#555555';
              let scale = 1;
              if (i < targetIndex) {
                color = '#00ff00';
              } else if (i === targetIndex) {
                color = '#00ffff';
                scale = 1.2;
              }
              return (
                <span key={i} style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color,
                  transform: `scale(${scale})`,
                  transition: 'all 0.2s',
                  textShadow: i === targetIndex ? '0 0 10px #00ffff' : 'none'
                }}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
            WORT: {wordCount}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>
            SCORE: {score}
          </div>
        </div>
      </div>

      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          pointerEvents: 'auto',
          padding: '10px 20px',
          backgroundColor: '#ff3333',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
          textTransform: 'uppercase'
        }}
      >
        Beenden
      </button>

      {/* Game Over Screen */}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          backdropFilter: 'blur(5px)'
        }}>
          <h1 style={{ fontSize: '64px', color: '#ff0000', margin: '0 0 20px 0', textShadow: '0 0 20px #ff0000' }}>
            GAME OVER
          </h1>
          <p style={{ fontSize: '32px', color: '#ffd700', margin: '0 0 40px 0' }}>
            Final Score: {score}
          </p>
          <button 
            onClick={initGame}
            style={{
              padding: '15px 40px',
              fontSize: '24px',
              backgroundColor: '#00ffff',
              color: 'black',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0,255,255,0.4)',
              transition: 'transform 0.1s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Neustart
          </button>
        </div>
      )}
    </div>
  );
};
