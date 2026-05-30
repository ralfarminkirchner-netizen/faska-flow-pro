import React, { useEffect, useRef } from 'react';
import { useGameStore } from './GameLogic';

const MobileJoystick = () => {
  const setPlayerX = useGameStore(state => state.setPlayerX);
  const fireLaser = useGameStore(state => state.fireLaser);
  const playerXRef = useRef(0);
  const keys = useRef({ left: false, right: false, space: false });
  const lastFired = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === ' ') keys.current.space = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === ' ') keys.current.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let frameId;
    const loop = (time) => {
      let speed = 0.15;
      if (keys.current.left) playerXRef.current -= speed;
      if (keys.current.right) playerXRef.current += speed;
      
      playerXRef.current = Math.max(-4.5, Math.min(4.5, playerXRef.current));
      setPlayerX(playerXRef.current);

      if (keys.current.space && time - lastFired.current > 300) {
        fireLaser();
        lastFired.current = time;
      }

      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(frameId);
    };
  }, [setPlayerX, fireLaser]);

  return (
    <div style={{ position: 'absolute', bottom: 20, width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px', boxSizing: 'border-box', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto' }}>
        <button 
          onPointerDown={() => keys.current.left = true} 
          onPointerUp={() => keys.current.left = false}
          onPointerLeave={() => keys.current.left = false}
          style={{ width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.2)', border: '2px solid white', color: 'white', fontSize: 24, touchAction: 'none', cursor: 'pointer' }}
        >
          &larr;
        </button>
        <button 
          onPointerDown={() => keys.current.right = true} 
          onPointerUp={() => keys.current.right = false}
          onPointerLeave={() => keys.current.right = false}
          style={{ width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.2)', border: '2px solid white', color: 'white', fontSize: 24, touchAction: 'none', cursor: 'pointer' }}
        >
          &rarr;
        </button>
      </div>
      <button 
        onPointerDown={() => {
          const time = performance.now();
          if (time - lastFired.current > 300) {
            fireLaser();
            lastFired.current = time;
          }
          keys.current.space = true;
        }}
        onPointerUp={() => keys.current.space = false}
        onPointerLeave={() => keys.current.space = false}
        style={{ width: 80, height: 80, borderRadius: 40, background: 'rgba(255,0,0,0.5)', border: '2px solid red', color: 'white', fontSize: 20, pointerEvents: 'auto', touchAction: 'none', cursor: 'pointer' }}
      >
        FIRE
      </button>
    </div>
  );
};

export default MobileJoystick;
