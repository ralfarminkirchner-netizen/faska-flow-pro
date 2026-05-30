import React from 'react';
import { useGameStore } from './GameLogic';

export default function UIOverlay({ onExit }) {
    const problem = useGameStore(state => state.problem);
    const score = useGameStore(state => state.score);
    const feedback = useGameStore(state => state.feedback);
    const feedbackColor = useGameStore(state => state.feedbackColor);

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 10, padding: '20px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            <button
                onClick={onExit}
                style={{
                    position: 'absolute', top: '20px', right: '20px',
                    pointerEvents: 'auto', padding: '12px 24px',
                    backgroundColor: '#ff3344', color: 'white', border: '2px solid #fff',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    fontSize: '18px', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
            >
                Beenden
            </button>

            <div style={{ fontSize: '72px', fontWeight: 'bold', color: 'white', textShadow: '0 0 15px #0088ff', marginTop: '40px' }}>
                {problem.num1} x {problem.num2} = ?
            </div>

            <div style={{ fontSize: '32px', color: 'white', marginTop: '10px', textShadow: '0 0 5px #000' }}>
                Score: {score}
            </div>

            {feedback && (
                <div style={{
                    fontSize: '80px', fontWeight: 'bold', color: feedbackColor,
                    marginTop: '15vh', textShadow: `0 0 20px ${feedbackColor}`
                }}>
                    {feedback}
                </div>
            )}
            
            <div style={{ position: 'absolute', bottom: '20px', color: '#aaa', fontSize: '18px', textShadow: '0 0 4px #000' }}>
                Steuern: Pfeile L/R | Gas: Pfeil Oben | Bremsen: Pfeil Unten
            </div>
        </div>
    );
}
