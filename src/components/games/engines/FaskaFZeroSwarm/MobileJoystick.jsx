import React from 'react';
import useGameStore from './GameLogic';

export default function MobileJoystick() {
  const setControls = useGameStore((state) => state.setControls);

  const handleTouchStart = (dir) => (e) => {
    e.preventDefault();
    setControls({ [dir]: true });
  };

  const handleTouchEnd = (dir) => (e) => {
    e.preventDefault();
    setControls({ [dir]: false });
  };

  const btnStyle = {
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    userSelect: 'none',
    touchAction: 'none'
  };

  return (
    <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10, display: 'flex', gap: '10px' }}>
      <button 
        onTouchStart={handleTouchStart('left')} 
        onTouchEnd={handleTouchEnd('left')} 
        onMouseDown={handleTouchStart('left')} 
        onMouseUp={handleTouchEnd('left')} 
        style={btnStyle}
      >
        Left
      </button>
      <button 
        onTouchStart={handleTouchStart('right')} 
        onTouchEnd={handleTouchEnd('right')} 
        onMouseDown={handleTouchStart('right')} 
        onMouseUp={handleTouchEnd('right')} 
        style={btnStyle}
      >
        Right
      </button>
      <button 
        onTouchStart={handleTouchStart('forward')} 
        onTouchEnd={handleTouchEnd('forward')} 
        onMouseDown={handleTouchStart('forward')} 
        onMouseUp={handleTouchEnd('forward')} 
        style={btnStyle}
      >
        Accel
      </button>
      <button 
        onTouchStart={handleTouchStart('backward')} 
        onTouchEnd={handleTouchEnd('backward')} 
        onMouseDown={handleTouchStart('backward')} 
        onMouseUp={handleTouchEnd('backward')} 
        style={btnStyle}
      >
        Brake
      </button>
    </div>
  );
}
