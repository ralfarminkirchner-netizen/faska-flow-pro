import React from 'react';
import { useGameStore } from './GameLogic';

export default function UIOverlay({ onExit }) {
    const score = useGameStore(state => state.score);
    const health = useGameStore(state => state.health);
    const ammoType = useGameStore(state => state.ammoType);
    const isLocked = useGameStore(state => state.isLocked);
    const hitFlash = useGameStore(state => state.hitFlash);
    
    return (
        <>
            {hitFlash && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: hitFlash, pointerEvents: 'none', zIndex: 10 }} />
            )}
            
            {/* Crosshair */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 20 }}>
                <div style={{ width: 8, height: 8, backgroundColor: ammoType.color, borderRadius: '50%', boxShadow: '0 0 8px white' }} />
            </div>
            
            {/* UI */}
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 30, fontFamily: 'monospace', textShadow: '2px 2px 4px #000', pointerEvents: 'none' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#ffcc00' }}>FaskaDoomSwarm</h1>
                <p style={{ margin: '5px 0', fontSize: '24px' }}>Score: {score}</p>
                <p style={{ margin: '5px 0', fontSize: '24px', color: health > 30 ? '#00ff00' : '#ff0000' }}>Health: {health}</p>
                <p style={{ margin: '15px 0 5px 0', fontSize: '22px', color: ammoType.color, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '4px', display: 'inline-block' }}>
                    Ammo: {ammoType.name} (Q to swap)
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.9 }}>Match ammo color to enemy shield color!</p>
                <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.7 }}>WASD: Move | SPACE: Jump | Click: Shoot</p>
            </div>
            
            {/* Start Screen overlay */}
            {(!isLocked && !('ontouchstart' in window) && !(navigator.maxTouchPoints > 0)) && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 25, color: 'white', fontFamily: 'monospace' }}>
                    <h2 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '2px 2px 0 #f00' }}>CLICK TO START</h2>
                    <p style={{ fontSize: '20px' }}>Press ESC to pause and show mouse</p>
                </div>
            )}
            
            <button 
                onClick={onExit}
                style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 40,
                    padding: '12px 24px', fontSize: '18px', fontWeight: 'bold',
                    backgroundColor: '#ff2222', color: 'white', border: '2px solid white',
                    borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    fontFamily: 'monospace', pointerEvents: 'auto'
                }}
            >
                Beenden
            </button>
        </>
    );
}
