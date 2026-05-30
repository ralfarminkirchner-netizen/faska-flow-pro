import React from 'react';
import { useGameStore } from './GameLogic';

const UIOverlay = ({ onExit }) => {
    const score = useGameStore(state => state.score);
    const instruction = useGameStore(state => state.instruction);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10
        }}>
            {/* Crosshair */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
                border: '2px solid red',
                borderRadius: '50%',
            }}>
                <div style={{position: 'absolute', top: '50%', left: '-10px', width: '10px', height: '2px', backgroundColor: 'red'}} />
                <div style={{position: 'absolute', top: '50%', right: '-10px', width: '10px', height: '2px', backgroundColor: 'red'}} />
                <div style={{position: 'absolute', top: '-10px', left: '50%', width: '2px', height: '10px', backgroundColor: 'red'}} />
                <div style={{position: 'absolute', bottom: '-10px', left: '50%', width: '2px', height: '10px', backgroundColor: 'red'}} />
            </div>

            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                fontSize: '32px',
                color: 'white',
                fontWeight: 'bold',
                textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
            }}>
                Punkte: {score}
            </div>

            <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '26px',
                color: 'yellow',
                fontWeight: 'bold'
            }}>
                {instruction}
            </div>

            <button
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    pointerEvents: 'auto',
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: '3px solid #cc0000',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    textTransform: 'uppercase'
                }}
            >
                Beenden
            </button>
        </div>
    );
};

export default UIOverlay;
