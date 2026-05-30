import React, { useEffect } from 'react';
import Arena from './Arena';
import Fighters from './Fighters';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';
import { useGameStore } from './GameLogic';

export default function FaskaFighter3({ onExit }) {
    const tick = useGameStore(s => s.tick);
    const setKey = useGameStore(s => s.setKey);
    const triggerAttack = useGameStore(s => s.triggerAttack);

    useEffect(() => {
        let reqId;
        const loop = () => {
            tick();
            reqId = requestAnimationFrame(loop);
        };
        reqId = requestAnimationFrame(loop);

        const onKeyDown = e => {
            setKey(e.code, true);
            if (e.code === 'Space') triggerAttack('PUNCH');
            if (e.code === 'ShiftLeft') triggerAttack('KICK');
            if (e.code === 'KeyE') triggerAttack('HADOUKEN');
        };
        const onKeyUp = e => {
            setKey(e.code, false);
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            cancelAnimationFrame(reqId);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [tick, setKey, triggerAttack]);

    // Check for exit condition if game is over
    const matchState = useGameStore(s => s.matchState);
    const matchTimer = useGameStore(s => s.matchTimer);
    useEffect(() => {
        if (matchState === 'MATCH_OVER' && matchTimer > 200) {
            if (onExit) onExit();
        }
    }, [matchState, matchTimer, onExit]);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>FASKA FIGHTER 3</h2>
            <div style={{ position: 'relative', width: 800, height: 450, border: '4px solid #444', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                <Arena />
                <Fighters />
                <UIOverlay onExit={onExit} />
            </div>
            <p style={{ color: '#aaa', marginTop: '15px' }}>
                <strong>Controls:</strong> W/A/D to Move & Jump. SPACE: Punch, SHIFT: Kick, E: Hadouken
            </p>
            <MobileJoystick />
        </div>
    );
}
