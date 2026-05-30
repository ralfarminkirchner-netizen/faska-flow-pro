import React from 'react';
import { useGameStore } from './GameLogic';

const JoystickButton = ({ label, onClick, style }) => (
  <button
    onClick={onClick}
    style={{
      width: '60px',
      height: '60px',
      borderRadius: '30px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      color: 'white',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      touchAction: 'none',
      ...style
    }}
  >
    {label}
  </button>
);

const MobileJoystick = () => {
  const { movePiece, rotatePiece, hardDrop, isPlaying } = useGameStore();

  if (!isPlaying) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '0',
      width: '100%',
      pointerEvents: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxSizing: 'border-box'
    }}>
      {/* D-Pad */}
      <div style={{ display: 'grid', gridTemplateColumns: '60px 60px 60px', gap: '10px', pointerEvents: 'auto' }}>
        <div />
        <JoystickButton label="ROT" onClick={rotatePiece} />
        <div />
        <JoystickButton label="LT" onClick={() => movePiece(-1, 0)} />
        <JoystickButton label="DN" onClick={() => movePiece(0, 1)} />
        <JoystickButton label="RT" onClick={() => movePiece(1, 0)} />
      </div>

      {/* Action */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', pointerEvents: 'auto' }}>
        <JoystickButton label="DROP" onClick={hardDrop} style={{ width: '80px', height: '80px', borderRadius: '40px' }} />
      </div>
    </div>
  );
};

export default MobileJoystick;
