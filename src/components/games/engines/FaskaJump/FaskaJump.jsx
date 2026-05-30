import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { World } from './World';
import { Player } from './Player';
import { MobileJoystick } from './MobileJoystick';
import { UIOverlay } from './UIOverlay';
import { Environment, OrthographicCamera } from '@react-three/drei';

const FaskaJump = ({ onExit }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#1e1e38', overflow: 'hidden' }}>
      <UIOverlay onExit={onExit} />
      
      <Canvas shadows>
        <Suspense fallback={null}>
          <OrthographicCamera makeDefault position={[0, 4, 10]} zoom={60} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Environment preset="city" />

          <Physics gravity={[0, -20, 0]}>
            <World />
            <Player />
          </Physics>
        </Suspense>
      </Canvas>

      <MobileJoystick />
    </div>
  );
};

export default FaskaJump;
