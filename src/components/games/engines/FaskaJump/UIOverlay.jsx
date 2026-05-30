import React from 'react';
import { useGameStore } from './GameLogic';

export const UIOverlay = ({ onExit }) => {
  const score = useGameStore((state) => state.score);
  const question = useGameStore((state) => state.question);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '28px',
          color: '#00ffff',
          fontWeight: 'bold',
          WebkitTextStroke: '1px black',
        }}
      >
        Punkte: {score}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '48px',
          color: '#ffeb3b',
          fontWeight: 'bold',
          WebkitTextStroke: '2px black',
        }}
      >
        {question.num1 ? `${question.num1} ${question.op} ${question.num2} = ?` : ''}
      </div>

      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          pointerEvents: 'auto',
          padding: '10px 24px',
          backgroundColor: '#ff3366',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
        }}
      >
        Beenden
      </button>
    </div>
  );
};
