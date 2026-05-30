import React, { useEffect, useRef } from 'react';
import { useGameStore } from './GameLogic';
import { joystickState } from './MobileJoystick';

export function Player() {
  const { playerPos, movePlayer, interact } = useGameStore();
  const requestRef = useRef();

  useEffect(() => {
    const keys = {};
    const handleKeyDown = (e) => { 
      keys[e.key.toLowerCase()] = true; 
      if(e.key === ' ') interact(); 
    };
    const handleKeyUp = (e) => { 
      keys[e.key.toLowerCase()] = false; 
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    let lastAction = false;
    
    const update = () => {
      const speed = 5;
      let dx = joystickState.x;
      let dy = joystickState.y;
      
      // Keyboard overrides
      if (keys['w']) dy = -1;
      if (keys['s']) dy = 1;
      if (keys['a']) dx = -1;
      if (keys['d']) dx = 1;
      
      // Normalize and move
      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len; 
        dy /= len;
        movePlayer(dx * speed, dy * speed);
      }
      
      if (joystickState.action && !lastAction) {
        interact();
      }
      lastAction = joystickState.action;
      
      requestRef.current = requestAnimationFrame(update);
    };
    
    requestRef.current = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [movePlayer, interact]);

  return (
    <div style={{
      position: 'absolute',
      left: playerPos.x,
      top: playerPos.y,
      width: '32px',
      height: '32px',
      backgroundColor: '#22cc88',
      transform: 'translate(-50%, -50%)',
      borderRadius: '4px',
      border: '2px solid #fff',
      zIndex: 10
    }} />
  );
}
