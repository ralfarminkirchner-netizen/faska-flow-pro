import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls, Loader } from '@react-three/drei';

import useGameStore from './store/gameStore';
import UI from './components/UI';
import World from './components/World';
import Player from './components/Player';
import VFX from './components/VFX';

export default function FaskaRaider({ onExit }) {
  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
  ];

  return (
    <div className="w-full h-full relative bg-black">
      <UI onExit={onExit} />
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            <Physics gravity={[0, -20, 0]}>
              <World />
              <Player />
            </Physics>
            <VFX />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <Loader />
    </div>
  );
}
