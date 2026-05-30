import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, useKeyboardControls } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useGameStore from './GameLogic';

export default function Player() {
  const shipMesh = useRef();
  const bodyRef = useRef();
  const [, get] = useKeyboardControls();
  
  // CRITICAL: Load /textures/fzero_ship.png
  const shipTexture = useTexture('/textures/fzero_ship.png');

  useFrame((state, delta) => {
    const keys = get();
    const gameStore = useGameStore.getState();
    const { controls } = gameStore;

    let ax = 0;
    if (keys.left || controls.left) ax = -1;
    if (keys.right || controls.right) ax = 1;

    let x = gameStore.x + ax * 40 * delta;
    x = THREE.MathUtils.clamp(x, -18, 18); 
    useGameStore.setState({ x });

    if (shipMesh.current) {
      shipMesh.current.position.x = THREE.MathUtils.lerp(shipMesh.current.position.x, x, 15 * delta);
      shipMesh.current.rotation.z = THREE.MathUtils.lerp(shipMesh.current.rotation.z, -ax * 0.7, 10 * delta);
      shipMesh.current.rotation.y = THREE.MathUtils.lerp(shipMesh.current.rotation.y, -ax * 0.3, 10 * delta);
      shipMesh.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
    }
    
    // Wrap Rapier physics bodyRef.current calls in try/catch
    try {
      if (bodyRef.current) {
        const position = bodyRef.current.translation();
        bodyRef.current.setNextKinematicTranslation({ 
          x: shipMesh.current ? shipMesh.current.position.x : position.x, 
          y: position.y, 
          z: position.z 
        });
      }
    } catch (error) {
      console.warn("Physics body update failed", error);
    }
    
    let targetSpeed = 60 + gameStore.boost;
    if (keys.up || controls.forward) targetSpeed = 100 + gameStore.boost;
    else if (keys.down || controls.backward) targetSpeed = 30 + gameStore.boost;

    const speed = THREE.MathUtils.lerp(gameStore.speed, targetSpeed, 3 * delta);
    useGameStore.setState({ speed, targetSpeed });
    
    if (gameStore.boost > 0) {
      useGameStore.setState({ boost: gameStore.boost - 15 * delta });
    }
  });

  return (
    <RigidBody ref={bodyRef} type="kinematicPosition" position={[0, 1, 0]}>
      <group ref={shipMesh}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.2, 4, 3]} />
          <meshStandardMaterial map={shipTexture} color="#ff0055" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, -0.3, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.8, -0.3, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[-0.8, -0.3, -2.1]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        <mesh position={[0.8, -0.3, -2.1]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      </group>
    </RigidBody>
  );
}
