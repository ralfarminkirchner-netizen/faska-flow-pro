import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import World from './World';
import Player from './Player';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';
import { useGameStore } from './GameLogic';

const FaskaMoorhuhnSwarm = ({ onExit }) => {
    const startWave = useGameStore(state => state.startWave);

    useEffect(() => {
        startWave();
    }, [startWave]);

    return (
        <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', backgroundColor: '#87CEEB' }}>
            <UIOverlay onExit={onExit} />
            <MobileJoystick />
            <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
                <Physics>
                    <World />
                    <Player />
                </Physics>
            </Canvas>
        </div>
    );
};

export default FaskaMoorhuhnSwarm;
