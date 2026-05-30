import React, { useEffect } from 'react';
import { useGameStore } from './GameLogic';

export const MobileJoystick = () => {
  const setControl = useGameStore((state) => state.setControl);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setControl('left', true);
      if (e.key === 'ArrowRight') setControl('right', true);
      if (e.key === 'ArrowUp' || e.key === ' ') setControl('jump', true);
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') setControl('left', false);
      if (e.key === 'ArrowRight') setControl('right', false);
      if (e.key === 'ArrowUp' || e.key === ' ') setControl('jump', false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setControl]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
        <button
          onPointerDown={() => setControl('left', true)}
          onPointerUp={() => setControl('left', false)}
          onPointerLeave={() => setControl('left', false)}
          style={buttonStyle}
        >
          ←
        </button>
        <button
          onPointerDown={() => setControl('right', true)}
          onPointerUp={() => setControl('right', false)}
          onPointerLeave={() => setControl('right', false)}
          style={buttonStyle}
        >
          →
        </button>
      </div>
      <div style={{ pointerEvents: 'auto' }}>
        <button
          onPointerDown={() => setControl('jump', true)}
          onPointerUp={() => setControl('jump', false)}
          onPointerLeave={() => setControl('jump', false)}
          style={buttonStyle}
        >
          ↑ JUMP
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  border: '2px solid rgba(255, 255, 255, 0.5)',
  color: 'white',
  fontSize: '24px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  cursor: 'pointer',
  backdropFilter: 'blur(4px)',
};
