import React, { useState, useEffect, useRef } from 'react';

// Export global state for PlayerKart to read without triggering re-renders
export const kartJoystickState = { steer: 0, accel: 0, item: false, drift: false };

export function MobileJoystick() {
  const containerRef = useRef(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchMove = (e) => {
      // Prevent default scrolling on touch
      if (e.cancelable) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    updateJoystick(e);
  };

  const handlePointerMove = (e) => {
    if (e.target.hasPointerCapture(e.pointerId)) {
      updateJoystick(e);
    }
  };

  const handlePointerUp = (e) => {
    e.target.releasePointerCapture(e.pointerId);
    setKnobPos({ x: 0, y: 0 });
    kartJoystickState.steer = 0;
    kartJoystickState.accel = 0;
  };

  const updateJoystick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > radius) {
      dx = (dx / distance) * radius;
      dy = (dy / distance) * radius;
    }
    
    setKnobPos({ x: dx, y: dy });
    
    // Normalize to -1 to 1 range
    kartJoystickState.steer = dx / radius; // positive is right
    kartJoystickState.accel = -(dy / radius); // positive is up (throttle)
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '50px',
      left: '50px',
      right: '50px',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      pointerEvents: 'none'
    }}>
      {/* Joystick Area */}
      <div 
        ref={containerRef}
        style={{
          width: '120px', height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.5)',
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none' // Prevent browser touch actions like pinch/zoom/pan
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div style={{
          width: '60px', height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.8)',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))`
        }} />
      </div>
      
      {/* Buttons Area */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button 
          style={{
            width: '70px', height: '70px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,165,0,0.5)',
            border: '2px solid rgba(255,165,0,0.8)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            pointerEvents: 'auto',
            touchAction: 'none'
          }}
          onPointerDown={(e) => {
            e.target.setPointerCapture(e.pointerId);
            kartJoystickState.drift = true;
          }}
          onPointerUp={(e) => {
            e.target.releasePointerCapture(e.pointerId);
            kartJoystickState.drift = false;
          }}
          onPointerCancel={(e) => {
            e.target.releasePointerCapture(e.pointerId);
            kartJoystickState.drift = false;
          }}
        >
          DRIFT
        </button>
        <button 
          style={{
            width: '80px', height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,0,0,0.5)',
            border: '2px solid rgba(255,0,0,0.8)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            pointerEvents: 'auto',
            touchAction: 'none'
          }}
          onPointerDown={(e) => {
            e.target.setPointerCapture(e.pointerId);
            kartJoystickState.item = true;
          }}
          onPointerUp={(e) => {
            e.target.releasePointerCapture(e.pointerId);
            kartJoystickState.item = false;
          }}
          onPointerCancel={(e) => {
            e.target.releasePointerCapture(e.pointerId);
            kartJoystickState.item = false;
          }}
        >
          ITEM
        </button>
      </div>
    </div>
  );
}
