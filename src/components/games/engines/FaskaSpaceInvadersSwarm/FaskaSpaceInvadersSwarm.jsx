import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import World from './World';
import Ship from './Ship';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';
import { useGameStore } from './GameLogic';

const FaskaSpaceInvadersSwarm = ({ onExit }) => {
  const initLevel = useGameStore(state => state.initLevel);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', boxShadow: '0 0 20px rgba(0,255,255,0.2)' }}>
      <Canvas camera={{ position: [0, 8, 8], fov: 50 }}>
        {/* We can rotate the entire scene slightly if we want, or just angle the camera down */}
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <World />
          <Ship />
        </group>
      </Canvas>
      <UIOverlay onExit={onExit} />
      <MobileJoystick />
    </div>
  );
};

export default FaskaSpaceInvadersSwarm;
