import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Sky, Text, Sparkles } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Vector3, Color, CatmullRomCurve3 } from 'three';
import { useGameStore } from './GameLogic';
import useGameInput from '../../../../shared/useGameInput';
import Player from './Player';

function Enemy({ enemy, isTarget }) {
  const { position, word, typed } = enemy;
  const remaining = word.slice(typed.length);

  return (
    <group position={position}>
      <RigidBody type="kinematicPosition" colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial 
            color={isTarget ? "#ff0044" : "#4444ff"} 
            emissive={isTarget ? new Color("#ff0044") : new Color("#000000")}
            emissiveIntensity={isTarget ? 0.6 : 0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Simple Robot Eye */}
        <mesh position={[0, 0.4, 0.76]}>
          <boxGeometry args={[0.8, 0.3, 0.1]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0.4, 0.8]}>
          <boxGeometry args={[0.3, 0.1, 0.05]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
        </mesh>
      </RigidBody>
      
      {/* Floating UI for the typing text */}
      <group position={[0, 2.5, 0]}>
        <Text 
          position={[-0.05, 0, 0]} 
          anchorX="right" 
          color="#00ffcc" 
          fontSize={1.5}
          outlineWidth={0.1}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {typed}
        </Text>
        <Text 
          position={[0.05, 0, 0]} 
          anchorX="left" 
          color="#ffffff" 
          fontSize={1.5}
          outlineWidth={0.1}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {remaining}
        </Text>
      </group>
    </group>
  );
}

function Laser({ targetPos }) {
  const points = useMemo(() => [
    new Vector3(0, 2, 0),
    new Vector3(...targetPos)
  ], [targetPos]);
  
  const curve = useMemo(() => new CatmullRomCurve3(points), [points]);
  
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 20, 0.1, 8, false]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.8} />
      </mesh>
      <Sparkles position={targetPos} count={40} scale={3} size={6} speed={0.4} color="#00ffcc" />
    </group>
  );
}

export default function World() {
  const enemies = useGameStore(s => s.enemies);
  const lasers = useGameStore(s => s.lasers);
  const targetEnemyId = useGameStore(s => s.targetEnemyId);
  const updateEnemies = useGameStore(s => s.updateEnemies);
  const updateLasers = useGameStore(s => s.updateLasers);
  const spawnEnemy = useGameStore(s => s.spawnEnemy);
  const shake = useGameStore(s => s.shake);
  const score = useGameStore(s => s.score);

  const { camera } = useThree();
  const input = useGameInput(); // Grab input to satisfy architectural rules (can be used for camera panning)
  
  const lastSpawn = useRef(0);
  const baseCameraPos = useRef(new Vector3(0, 8, 18));

  useFrame((state, delta) => {
    // Progress game loops
    updateEnemies(delta);
    updateLasers(delta);

    // Spawning Logic
    lastSpawn.current += delta;
    // Spawn faster as score increases
    const spawnRate = Math.max(0.8, 3.0 - (score / 1500));
    if (lastSpawn.current > spawnRate) {
      spawnEnemy();
      lastSpawn.current = 0;
    }

    // Camera logic (Screen Shake + Joystick Parallax)
    const joyX = input.joystick?.x || 0;
    const joyY = input.joystick?.y || 0;
    
    let targetCamX = baseCameraPos.current.x + joyX * 5;
    let targetCamY = baseCameraPos.current.y - joyY * 2;
    let targetCamZ = baseCameraPos.current.z;

    if (shake > 0) {
      const shakeAmount = shake * 0.8;
      targetCamX += (Math.random() - 0.5) * shakeAmount;
      targetCamY += (Math.random() - 0.5) * shakeAmount;
    } 

    camera.position.lerp(new Vector3(targetCamX, targetCamY, targetCamZ), 0.1);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <Sky sunPosition={[10, 20, -10]} turbidity={0.2} rayleigh={0.5} />
      <Environment preset="night" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      <fog attach="fog" args={['#050510', 15, 80]} />

      {/* Ground Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[150, 1, 150]} />
          <meshStandardMaterial color="#050510" roughness={0.7} metalness={0.3} />
        </mesh>
      </RigidBody>

      {/* Cool Neon Grid */}
      <gridHelper args={[150, 50, '#00ffcc', '#003344']} position={[0, 0.01, 0]} />

      {/* Central Turret */}
      <Player />

      {/* Enemies */}
      {enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} isTarget={enemy.id === targetEnemyId} />
      ))}

      {/* Fired Lasers */}
      {lasers.map(laser => (
        <Laser key={laser.id} targetPos={laser.targetPos} />
      ))}
    </>
  );
}
