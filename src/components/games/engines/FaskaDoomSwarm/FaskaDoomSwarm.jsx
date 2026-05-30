import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { PointerLockControls, Sky } from '@react-three/drei';

import Player from './Player';
import World from './World';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';
import { useGameStore, AMMO_TYPES } from './GameLogic';

export default function FaskaDoomSwarm({ onExit }) {
    const setIsLocked = useGameStore(state => state.setIsLocked);
    const setAmmoType = useGameStore(state => state.setAmmoType);
    const spawnEnemy = useGameStore(state => state.spawnEnemy);
    const toggleAmmo = useGameStore(state => state.toggleAmmo);

    // Enemy spawner
    useEffect(() => {
        const interval = setInterval(() => {
            spawnEnemy();
        }, 1500);
        return () => clearInterval(interval);
    }, [spawnEnemy]);

    // Keyboard weapon swap
    useEffect(() => {
        const handleSwitch = (e) => {
            const k = e.key.toLowerCase();
            if (k === '1') setAmmoType(AMMO_TYPES.NOUN);
            if (k === '2') setAmmoType(AMMO_TYPES.VERB);
            if (k === 'q') toggleAmmo();
        };
        window.addEventListener('keydown', handleSwitch);
        return () => window.removeEventListener('keydown', handleSwitch);
    }, [setAmmoType, toggleAmmo]);

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#000', userSelect: 'none' }}>
            <Canvas shadows camera={{ fov: 80 }}>
                <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.1} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow />
                
                <Physics gravity={[0, -30, 0]}>
                    <Player />
                    <World />
                </Physics>
                
                {!isTouch && (
                    <PointerLockControls 
                        onLock={() => setIsLocked(true)} 
                        onUnlock={() => setIsLocked(false)} 
                    />
                )}
            </Canvas>
            
            <UIOverlay onExit={onExit} />
            <MobileJoystick />
        </div>
    );
}
