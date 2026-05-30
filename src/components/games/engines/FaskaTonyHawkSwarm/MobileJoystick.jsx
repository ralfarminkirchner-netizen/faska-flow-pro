import React from 'react';

export default function MobileJoystick() {
  const triggerKey = (key) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    setTimeout(() => {
       window.dispatchEvent(new KeyboardEvent('keyup', { key }));
    }, 100);
  };

  const startKey = (key) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  const endKey = (key) => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key }));
  };

  return (
    <div style={{ position: 'absolute', bottom: 20, width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 40px', zIndex: 100, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', gap: '20px', pointerEvents: 'auto' }}>
        <button 
          onPointerDown={() => startKey('ArrowLeft')} 
          onPointerUp={() => endKey('ArrowLeft')}
          onPointerLeave={() => endKey('ArrowLeft')}
          style={{ padding: '20px 30px', fontSize: '24px', background: 'rgba(255,0,255,0.7)', color: '#fff', border: '3px solid #00ffff', borderRadius: '10px', fontFamily: 'Impact, sans-serif' }}>
          LEFT
        </button>
        <button 
          onPointerDown={() => startKey('ArrowRight')} 
          onPointerUp={() => endKey('ArrowRight')}
          onPointerLeave={() => endKey('ArrowRight')}
          style={{ padding: '20px 30px', fontSize: '24px', background: 'rgba(255,0,255,0.7)', color: '#fff', border: '3px solid #00ffff', borderRadius: '10px', fontFamily: 'Impact, sans-serif' }}>
          RIGHT
        </button>
      </div>
      <div style={{ pointerEvents: 'auto' }}>
        <button 
          onPointerDown={() => triggerKey(' ')} 
          style={{ padding: '20px 50px', fontSize: '24px', background: 'rgba(0,255,255,0.7)', color: '#fff', border: '3px solid #ff00ff', borderRadius: '10px', fontFamily: 'Impact, sans-serif' }}>
          OLLIE
        </button>
      </div>
    </div>
  );
}
