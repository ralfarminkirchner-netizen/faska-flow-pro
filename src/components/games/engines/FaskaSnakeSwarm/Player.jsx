import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './GameLogic';
import * as THREE from 'three';

const SnakeSegment = ({ pos, isHead, index, total }) => {
  const ref = useRef();
  
  // Smoothly lerp to actual grid position
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.lerp(new THREE.Vector3(pos.x, 0.5, pos.z), delta * 15);
    }
  });

  const scale = isHead ? 1 : Math.max(0.4, 1 - (index / total) * 0.5);

  return (
    <mesh ref={ref} position={[pos.x, 0.5, pos.z]} scale={scale}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial 
        color={isHead ? '#ffffff' : '#00ff00'} 
        emissive={isHead ? '#444444' : '#004400'}
        roughness={0.2}
        metalness={0.8}
      />
      {isHead && (
        <group position={[0, 0.5, 0]}>
          <mesh position={[-0.25, 0, -0.25]}>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[0.25, 0, -0.25]}>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </group>
      )}
    </mesh>
  );
};

export const Player = () => {
  const snake = useGameStore(state => state.snake);
  const tick = useGameStore(state => state.tick);
  const moveDelay = useGameStore(state => state.moveDelay);
  const gameOver = useGameStore(state => state.gameOver);
  const setDir = useGameStore(state => state.setDir);
  const isPaused = useGameStore(state => state.isPaused);

  const lastTickRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || isPaused) return;
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setDir(0, -1);
          break;
        case 's':
        case 'arrowdown':
          setDir(0, 1);
          break;
        case 'a':
        case 'arrowleft':
          setDir(-1, 0);
          break;
        case 'd':
        case 'arrowright':
          setDir(1, 0);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDir, gameOver, isPaused]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 1000;
    if (time - lastTickRef.current > moveDelay) {
      lastTickRef.current = time;
      tick();
    }
    
    // Make camera follow head slightly
    if (snake.length > 0 && !gameOver) {
      const head = snake[0];
      const targetCamPos = new THREE.Vector3(head.x * 0.3, 15, head.z * 0.3 + 15);
      state.camera.position.lerp(targetCamPos, 0.05);
      state.camera.lookAt(head.x * 0.2, 0, head.z * 0.2);
    }
  });

  return (
    <group>
      {snake.map((s, i) => (
        <SnakeSegment 
          key={`${i}-${s.x}-${s.z}`} 
          pos={s} 
          isHead={i === 0} 
          index={i}
          total={snake.length}
        />
      ))}
    </group>
  );
};
