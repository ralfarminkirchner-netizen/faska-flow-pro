import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from './GameLogic';

export default function Player({ isLearncade }) {
  const deckTexture = useTexture('/textures/skate_deck.png');
  const bodyRef = useRef();
  const [keys, setKeys] = useState({});
  const { setQuestion, question } = useGameStore();
  const { camera } = useThree();

  useEffect(() => {
    const handleDown = (e) => setKeys(k => ({ ...k, [e.key]: true }));
    const handleUp = (e) => setKeys(k => ({ ...k, [e.key]: false }));
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  useFrame(() => {
    if (!bodyRef.current) return;
    try {
      const pos = bodyRef.current.translation();
      const linvel = bodyRef.current.linvel();
      
      let moveX = 0;
      if (keys['ArrowLeft']) moveX = -15;
      if (keys['ArrowRight']) moveX = 15;
      
      // Allow sliding back down if we are high up, but apply movement forces
      bodyRef.current.setLinvel({ x: moveX || linvel.x, y: linvel.y, z: 0 }, true);

      // Ollie logic
      if (keys[' '] && Math.abs(linvel.y) < 0.2 && !question) {
         bodyRef.current.applyImpulse({ x: 0, y: 12, z: 0 }, true);
         // Clear the space key so it doesn't double trigger immediately
         setKeys(k => ({ ...k, ' ': false }));

         // Trigger a learning question if airborne
         if (isLearncade) {
            const a = Math.floor(Math.random() * 5);
            const b = Math.floor(Math.random() * 5);
            setQuestion({ a, b, op: '+', answer: a + b });
         }
      }

      // Camera follow
      camera.position.lerp(new THREE.Vector3(pos.x * 0.4, Math.max(8, pos.y + 4), 25), 0.1);
      camera.lookAt(pos.x * 0.4, Math.max(4, pos.y - 2), 0);
    } catch (err) {
      console.warn("Rapier translation error:", err);
    }
  });

  return (
    <RigidBody 
      ref={bodyRef} 
      position={[0, 5, 0]} 
      colliders="capsule" 
      mass={1} 
      enabledTranslations={[true, true, false]} 
      lockRotations 
      friction={0} 
      restitution={0}
    >
      <group position={[0, -0.6, 0]}>
        {/* Player Body */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.6, 1.5, 0.4]} />
          <meshStandardMaterial color="#00ffff" />
        </mesh>
        <mesh position={[0, 2, 0]} castShadow>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
        
        {/* Skateboard */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.4]} />
          <meshStandardMaterial map={deckTexture} color="#ffffff" />
        </mesh>
        
        {/* Wheels */}
        <mesh position={[-0.4, 0, 0.15]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#ff00ff" />
        </mesh>
        <mesh position={[0.4, 0, 0.15]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#ff00ff" />
        </mesh>
        <mesh position={[-0.4, 0, -0.15]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#ff00ff" />
        </mesh>
        <mesh position={[0.4, 0, -0.15]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#ff00ff" />
        </mesh>
      </group>
    </RigidBody>
  );
}
