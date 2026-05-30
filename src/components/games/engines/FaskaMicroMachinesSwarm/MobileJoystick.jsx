import React from 'react';
import { useGameStore } from './GameLogic';

export default function MobileJoystick() {
    const setInput = useGameStore(state => state.setInput);

    const handleTouch = (key, value) => (e) => {
        if(e.cancelable) e.preventDefault();
        setInput(key, value);
    };

    const btnStyle = {
        width: '70px', height: '70px', background: 'rgba(255,255,255,0.2)',
        borderRadius: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: 'white', fontSize: '28px', userSelect: 'none', touchAction: 'none',
        border: '2px solid rgba(255,255,255,0.4)', fontWeight: 'bold'
    };

    return (
        <div style={{
            position: 'absolute', bottom: '60px', left: '0', width: '100%',
            display: 'flex', justifyContent: 'space-between', padding: '0 40px',
            boxSizing: 'border-box', pointerEvents: 'none', zIndex: 20
        }}>
            <div style={{ display: 'flex', gap: '20px', pointerEvents: 'auto' }}>
                <div style={btnStyle} onPointerDown={handleTouch('left', true)} onPointerUp={handleTouch('left', false)} onPointerLeave={handleTouch('left', false)}>L</div>
                <div style={btnStyle} onPointerDown={handleTouch('right', true)} onPointerUp={handleTouch('right', false)} onPointerLeave={handleTouch('right', false)}>R</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', pointerEvents: 'auto' }}>
                <div style={btnStyle} onPointerDown={handleTouch('up', true)} onPointerUp={handleTouch('up', false)} onPointerLeave={handleTouch('up', false)}>U</div>
                <div style={btnStyle} onPointerDown={handleTouch('down', true)} onPointerUp={handleTouch('down', false)} onPointerLeave={handleTouch('down', false)}>D</div>
            </div>
        </div>
    );
}
