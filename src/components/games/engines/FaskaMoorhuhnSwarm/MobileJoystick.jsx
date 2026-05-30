import React from 'react';

// For this specific game, if it's a pointer lock FPS, mobile might need touch controls.
// We'll provide a placeholder or simple joystick that can be wired up later.

const MobileJoystick = () => {
    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            width: 100,
            height: 100,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            pointerEvents: 'auto',
            display: 'none' // Hidden by default, enable on mobile
        }}>
            <div style={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderRadius: '50%',
                position: 'absolute',
                top: 30,
                left: 30
            }} />
        </div>
    );
};

export default MobileJoystick;
