import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Dodecahedron, Cylinder, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useMathDefenderStore } from './GameLogic';
import InstancedParticles from '../../../../shared/ParticleSystem';
import { useScreenShake } from '../../../../shared/ScreenShake';

const Laser = ({ start, end, life }) => {
  const ref = useRef();
  
  // Calculate distance, midpoint, and orientation
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const distance = startVec.distanceTo(endVec);
  const midpoint = startVec.clone().lerp(endVec, 0.5);
  
  // Create a quaternion to point the cylinder from start to end
  const direction = new THREE.Vector3().subVectors(endVec, startVec).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <group position={midpoint} quaternion={quaternion}>
      <Cylinder args={[0.1, 0.1, distance, 8]} ref={ref}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={3 * (life / 0.2)} 
          toneMapped={false} 
          transparent
          opacity={life / 0.2}
        />
      </Cylinder>
    </group>
  );
};

const Asteroid = ({ data }) => {
  const materialRef = useRef();
  
  return (
    <group position={data.position} rotation={data.rotation}>
      <Dodecahedron args={[1.5]}>
        <meshStandardMaterial 
          ref={materialRef}
          color="#a0a0a0"
          roughness={0.8}
          metalness={0.2}
        />
      </Dodecahedron>
      {/* Display math problem */}
      <Text
        position={[0, 0, 1.6]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {data.text}
      </Text>
    </group>
  );
};

export default function World() {
  const asteroids = useMathDefenderStore(state => state.asteroids);
  const lasers = useMathDefenderStore(state => state.lasers);
  const updateAsteroids = useMathDefenderStore(state => state.updateAsteroids);
  const spawnAsteroid = useMathDefenderStore(state => state.spawnAsteroid);
  
  const asteroidDestroyedEvent = useMathDefenderStore(state => state.asteroidDestroyedEvent);
  const baseHitEvent = useMathDefenderStore(state => state.baseHitEvent);
  const clearEvents = useMathDefenderStore(state => state.clearEvents);

  const particleRef = useRef();
  const { shake, ShakeUpdater } = useScreenShake();

  // Spawning logic
  const spawnTimer = useRef(0);
  
  useFrame((state, dt) => {
    updateAsteroids(dt);
    
    // Auto spawn asteroids
    spawnTimer.current += dt;
    // Spawn rate speeds up with level. roughly every 2 seconds at level 1
    const level = useMathDefenderStore.getState().level;
    const spawnInterval = Math.max(0.8, 2.5 - level * 0.15);
    
    if (spawnTimer.current > spawnInterval) {
      spawnAsteroid();
      spawnTimer.current = 0;
    }
  });

  // Handle Events
  useEffect(() => {
    if (asteroidDestroyedEvent) {
      // Explosion particles
      if (particleRef.current) {
         particleRef.current.emit(
           new THREE.Vector3(...asteroidDestroyedEvent.position),
           { x: 0, y: 0, z: 0 },
           { count: 15, spread: 3, speed: 5, color: '#ff8800', lifetime: 0.6 }
         );
      }
      shake(0.3, 150);
      clearEvents();
    }
    
    if (baseHitEvent) {
      shake(0.8, 400); // big shake
      if (particleRef.current) {
        particleRef.current.emit(
          new THREE.Vector3(0, -2, 0),
          { x: 0, y: 1, z: 0 },
          { count: 30, spread: 5, speed: 8, color: '#ff0000', lifetime: 1.0 }
        );
      }
      clearEvents();
    }
  }, [asteroidDestroyedEvent, baseHitEvent, shake, clearEvents]);

  return (
    <>
      {/* Environment */}
      <color attach="background" args={['#020208']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={2} castShadow />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Base / Turret Area */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[4, 5, 1, 32]} />
        <meshStandardMaterial 
          color="#1e1e40" 
          emissive="#2020ff" 
          emissiveIntensity={0.5} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Glowing inner core */}
      <mesh position={[0, -1.9, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Game Entities */}
      {asteroids.map(a => (
        <Asteroid key={a.id} data={a} />
      ))}
      
      {lasers.map(l => (
        <Laser key={l.id} start={l.start} end={l.end} life={l.life} />
      ))}

      {/* Effects */}
      <InstancedParticles 
        particleRef={particleRef} 
        count={200}
        color="#ffaa00"
        emissiveIntensity={3}
      />
      <ShakeUpdater />
    </>
  );
}
