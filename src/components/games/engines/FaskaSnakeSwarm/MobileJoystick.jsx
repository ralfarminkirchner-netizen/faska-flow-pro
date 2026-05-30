import React from 'react';
import { useGameStore } from './GameLogic';

export const MobileJoystick = () => {
  const setDir = useGameStore(state => state.setDir);
  const isPaused = useGameStore(state => state.isPaused);
  const gameOver = useGameStore(state => state.gameOver);

  if (isPaused || gameOver) return null;

  const btnStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    color: 'white',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'none'
  };

  const handleDir = (x, z) => (e) => {
    e.preventDefault();
    setDir(x, z);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '40px',
      left: '40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 60px)',
      gridTemplateRows: 'repeat(3, 60px)',
      gap: '10px',
      pointerEvents: 'auto'
    }}>
      <div />
      <div style={btnStyle} onPointerDown={handleDir(0, -1)}>↑</div>
      <div />
      <div style={btnStyle} onPointerDown={handleDir(-1, 0)}>←</div>
      <div style={btnStyle} onPointerDown={handleDir(0, 1)}>↓</div>
      <div style={btnStyle} onPointerDown={handleDir(1, 0)}>→</div>
    </div>
  );
};
