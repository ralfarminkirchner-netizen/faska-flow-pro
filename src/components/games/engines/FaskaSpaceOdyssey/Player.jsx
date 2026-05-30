import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useTexture } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import useGameLogic from './GameLogic';
import * as THREE from 'three';

const Player = () => {
  const [, getKeys] = useKeyboardControls();
  const playerRef = useRef();
  const { setPlayerPosition, spawnProjectile } = useGameLogic();
  const lastShootTime = useRef(0);
  
  // Load the requested texture
  const texture = useTexture('/textures/fzero_ship.png');

  useFrame(({ clock }) => {
    if (!playerRef.current) return;
    
    const keys = getKeys();
    const pos = playerRef.current.translation();
    
    const speed = 0.5;
    
    if (keys.forward && pos.y < 10) pos.y += speed;
    if (keys.backward && pos.y > -10) pos.y -= speed;
    if (keys.left && pos.x > -20) pos.x -= speed;
    if (keys.right && pos.x < 20) pos.x += speed;
    
    playerRef.current.setNextKinematicTranslation(pos);
    setPlayerPosition([pos.x, pos.y, pos.z]);
    
    // Ship banking animation
    // Group has two meshes. We can just tilt the whole group.
    
    // Shooting
    if (keys.shoot && clock.elapsedTime - lastShootTime.current > 0.2) {
      spawnProjectile([pos.x, pos.y, pos.z - 2]);
      lastShootTime.current = clock.elapsedTime;
    }
  });

  return (
    <RigidBody 
      ref={playerRef} 
      type="kinematicPosition" 
      position={[0, 0, 5]} 
      name="player"
      colliders={false}
    >
      <group>
        {/* Simple Ship Model using the provided texture */}
        <mesh>
          <boxGeometry args={[2, 0.5, 3]} />
          <meshStandardMaterial map={texture} />
        </mesh>
        
        {/* Engine Glow */}
        <mesh position={[0, 0, 1.6]}>
          <boxGeometry args={[1, 0.3, 0.2]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
        </mesh>
      </group>
      <CuboidCollider args={[1, 0.25, 1.5]} />
    </RigidBody>
  );
};

export default Player;
