import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import { useRunnerStore } from './GameLogic';
import World from './World';

function InputController() {
  const prevDx = useRef(0);
  const moveLeft = useRunnerStore(s => s.moveLeft);
  const moveRight = useRunnerStore(s => s.moveRight);
  const isPlaying = useRunnerStore(s => s.isPlaying);

  useFrame(() => {
    if (!isPlaying) return;
    const currentDx = useRunnerStore.getState().input.dx;
    // Debounce lane change to require new press/direction
    if (currentDx < -0.5 && prevDx.current >= -0.5) moveLeft();
    if (currentDx > 0.5 && prevDx.current <= 0.5) moveRight();
    prevDx.current = currentDx;
  });
  return null;
}

export default function FaskaGeoRunnerSwarm() {
  const { onMove, onAction, onActionUp } = useGameInput(useRunnerStore);
  const isPlaying = useRunnerStore(s => s.isPlaying);

  useEffect(() => {
    if (isPlaying) {
       // Reset game variables and spawn initial gate
       useRunnerStore.setState({ gates: [], playerLane: 0, speed: 25 });
       useRunnerStore.getState().spawnGate();
    }
  }, [isPlaying]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0a0a1a' }}>
      <SwarmOrchestrator 
        gameName="GeoRunner"
        cameraProps={{ position: [0, 6, 12], fov: 60 }}
        gravity={[0, -20, 0]}
        afterPhysics={<PostProcessingStack preset="adventure" />}
      >
        <InputController />
        <World />
      </SwarmOrchestrator>
      
      <UIOverlay store={useRunnerStore} title="Geo Runner" />
      <LearncadeQuiz store={useRunnerStore} />
      <MobileJoystick onMove={onMove} onAction={onAction} onActionUp={onActionUp} />
    </div>
  );
}
