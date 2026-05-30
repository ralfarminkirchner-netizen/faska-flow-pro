import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { PerspectiveCamera } from '@react-three/drei';
import { useGameStore } from './GameLogic';
import World from './World';
import Car from './Car';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';

export default function FaskaMicroMachinesSwarm({ onExit }) {
    const setInput = useGameStore(state => state.setInput);
    const generateProblem = useGameStore(state => state.generateProblem);

    useEffect(() => {
        generateProblem();
        
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') setInput('up', true);
            if (e.key === 'ArrowDown' || e.key === 's') setInput('down', true);
            if (e.key === 'ArrowLeft' || e.key === 'a') setInput('left', true);
            if (e.key === 'ArrowRight' || e.key === 'd') setInput('right', true);
        };
        const handleKeyUp = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') setInput('up', false);
            if (e.key === 'ArrowDown' || e.key === 's') setInput('down', false);
            if (e.key === 'ArrowLeft' || e.key === 'a') setInput('left', false);
            if (e.key === 'ArrowRight' || e.key === 'd') setInput('right', false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setInput, generateProblem]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0a0a1a', overflow: 'hidden' }}>
            <UIOverlay onExit={onExit} />
            
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 90, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={50} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[20, 50, 20]} intensity={1} castShadow />
                
                <Suspense fallback={null}>
                    <Physics gravity={[0, -9.81, 0]}>
                        <World />
                        <Car />
                    </Physics>
                </Suspense>
            </Canvas>
            
            <MobileJoystick />
        </div>
    );
}
