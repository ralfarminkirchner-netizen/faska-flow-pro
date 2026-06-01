import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from './GameLogic';
import { Vector3 } from 'three';

export default function Player() {
  const turretRef = useRef();
  const baseRef = useRef();
  const targetEnemyId = useGameStore(s => s.targetEnemyId);
  const enemies = useGameStore(s => s.enemies);
  const health = useGameStore(s => s.health);

  useFrame(() => {
    if (!turretRef.current || health <= 0) return;

    if (targetEnemyId) {
      const target = enemies.find(e => e.id === targetEnemyId);
      if (target) {
        const targetPos = new Vector3(...target.position);
        
        try {
          // Smoothly rotate turret toward targeted enemy
          const currentQuat = turretRef.current.quaternion.clone();
          turretRef.current.lookAt(targetPos);
          const targetQuat = turretRef.current.quaternion.clone();
          turretRef.current.quaternion.copy(currentQuat).slerp(targetQuat, 0.2);
        } catch (e) {
          console.error("Rapier/Three rotation error handled:", e);
        }
      }
    } else {
      // Slowly rotate back to front or idle spin when no target
      try {
        turretRef.current.rotation.y += 0.01;
      } catch (e) {
        console.error("Idle rotation error:", e);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <RigidBody type="fixed" colliders="hull" ref={baseRef}>
        {/* Main Base */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[2, 2.5, 1, 32]} />
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <cylinderGeometry args={[1.5, 2, 0.5, 32]} />
          <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Turret Head */}
        <group ref={turretRef} position={[0, 2, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshStandardMaterial 
              color={health > 30 ? "#00ffcc" : "#ff0044"} 
              metalness={0.5} 
              roughness={0.1} 
              emissive={health > 30 ? "#00ffcc" : "#ff0044"}
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Cannon Barrel */}
          <mesh castShadow receiveShadow position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 2, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Cannon Tip */}
          <mesh castShadow position={[0, 0, 2.6]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </RigidBody>
    </group>
  );
}
