import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { World } from './World';
import { Player } from './Player';
import { UIOverlay } from './UIOverlay';
import { MobileJoystick } from './MobileJoystick';
import { useGameStore } from './GameLogic';

const FaskaSnakeSwarm = ({ onExit }) => {
  const initGame = useGameStore(state => state.initGame);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0a1a',
      overflow: 'hidden'
    }}>
      <Canvas 
        shadows 
        camera={{ position: [0, 15, 20], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <World />
            <Player />
          </Physics>

          <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <UIOverlay onExit={onExit} />
      
      {/* Show joystick on mobile devices (simple CSS media query approach or just show it) */}
      <div className="md:hidden">
        <MobileJoystick />
      </div>
    </div>
  );
};

export default FaskaSnakeSwarm;
