import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from './GameLogic';

export const Player = () => {
  const rigidBody = useRef(null);
  const { left, right, jump } = useGameStore((state) => state.controls);

  useFrame(() => {
    if (!rigidBody.current) return;

    const velocity = rigidBody.current.linvel();
    const speed = 5;

    // Horizontal movement
    if (left) {
      velocity.x = -speed;
    } else if (right) {
      velocity.x = speed;
    } else {
      velocity.x = 0; // stop immediately when no input
    }

    // Vertical movement (Jump)
    // Basic ground check (close to 0 vertical velocity)
    if (jump && Math.abs(velocity.y) < 0.1) {
      velocity.y = 8;
    }

    rigidBody.current.setLinvel(velocity, true);
  });

  return (
    <RigidBody
      ref={rigidBody}
      position={[0, 2, 0]}
      restitution={0.1}
      lockRotations={true}
      colliders="cuboid"
    >
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#00ccff" />
        
        {/* Eyes for the player */}
        <mesh position={[-0.2, 0.2, 0.41]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshBasicMaterial color="white" />
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.08, 0.08]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </mesh>
        <mesh position={[0.2, 0.2, 0.41]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshBasicMaterial color="white" />
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.08, 0.08]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </mesh>
      </mesh>
    </RigidBody>
  );
};
