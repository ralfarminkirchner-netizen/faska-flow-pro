import React from 'react';
import { useGameStore } from './GameLogic';

export default function UIOverlay({ onExit }) {
    const p1 = useGameStore(s => s.p1);
    const p2 = useGameStore(s => s.p2);
    const roundTime = useGameStore(s => s.roundTime);
    const matchState = useGameStore(s => s.matchState);
    const p1Wins = useGameStore(s => s.p1Wins);
    const p2Wins = useGameStore(s => s.p2Wins);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px' }}>
                <div style={{ width: '300px', height: '25px', background: '#440000', border: '3px solid white', position: 'relative' }}>
                    <div style={{ width: `${Math.max(0, (p1.health / p1.maxHealth) * 100)}%`, height: '100%', background: '#00ff00', transition: 'width 0.1s' }} />
                </div>
                
                <div style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', fontFamily: 'Impact, sans-serif', marginTop: '-10px' }}>
                    {Math.ceil(roundTime)}
                </div>

                <div style={{ width: '300px', height: '25px', background: '#440000', border: '3px solid white', position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: `${Math.max(0, (p2.health / p2.maxHealth) * 100)}%`, height: '100%', background: '#00ff00', transition: 'width 0.1s' }} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 50px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {[...Array(p1Wins)].map((_, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: '#ffaa00' }} />)}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {[...Array(p2Wins)].map((_, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: '#ffaa00' }} />)}
                </div>
            </div>

            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                {matchState === 'START' && <h1 style={{ color: 'yellow', fontSize: '80px', fontFamily: 'Impact', margin: 0, textShadow: '2px 2px 10px #000' }}>FIGHT!</h1>}
                {matchState === 'ROUND_END' && <h1 style={{ color: 'red', fontSize: '100px', fontFamily: 'Impact', margin: 0, textShadow: '2px 2px 10px #000' }}>K.O.</h1>}
                {matchState === 'MATCH_OVER' && <h1 style={{ color: 'yellow', fontSize: '80px', fontFamily: 'Impact', margin: 0, textShadow: '2px 2px 10px #000' }}>{p1Wins >= 2 ? 'PLAYER 1' : 'CPU'} WINS!</h1>}
            </div>

            <button 
                onClick={onExit} 
                style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '5px 15px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid white', cursor: 'pointer', pointerEvents: 'auto' }}
            >
                Exit Game
            </button>
        </div>
    );
}
