import React from 'react';
import { useGameStore } from './GameLogic';

export default function MobileJoystick() {
    const setJoystick = useGameStore(s => s.setJoystick);
    const triggerAttack = useGameStore(s => s.triggerAttack);

    const btnStyle = {
        padding: '20px',
        fontSize: '20px',
        borderRadius: '10px',
        border: '2px solid #555',
        background: '#333',
        color: 'white',
        cursor: 'pointer',
        touchAction: 'none'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '800px', marginTop: '20px', userSelect: 'none' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onPointerDown={() => setJoystick({ left: true })} 
                    onPointerUp={() => setJoystick({ left: false })} 
                    onPointerLeave={() => setJoystick({ left: false })} 
                    style={btnStyle}
                >
                    ◀
                </button>
                <button 
                    onPointerDown={() => setJoystick({ right: true })} 
                    onPointerUp={() => setJoystick({ right: false })} 
                    onPointerLeave={() => setJoystick({ right: false })} 
                    style={btnStyle}
                >
                    ▶
                </button>
                <button 
                    onPointerDown={() => setJoystick({ up: true })} 
                    onPointerUp={() => setJoystick({ up: false })} 
                    onPointerLeave={() => setJoystick({ up: false })} 
                    style={btnStyle}
                >
                    ▲
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button onPointerDown={() => triggerAttack('PUNCH')} style={{ ...btnStyle, background: '#a00' }}>PUNCH</button>
                <button onPointerDown={() => triggerAttack('KICK')} style={{ ...btnStyle, background: '#00a' }}>KICK</button>
                <button onPointerDown={() => triggerAttack('HADOUKEN')} style={{ ...btnStyle, background: '#0aa' }}>SPECIAL</button>
            </div>
        </div>
    );
}
