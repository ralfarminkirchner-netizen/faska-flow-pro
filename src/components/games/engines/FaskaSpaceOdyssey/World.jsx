import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import Player from './Player';
import useGameLogic from './GameLogic';

const Enemy = ({ id, position }) => {
  const { damagePlayer, damageEnemy } = useGameLogic();
  const meshRef = useRef();

  return (
    <RigidBody 
      type="kinematicPosition" 
      position={position}
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'projectile') {
          damageEnemy(id);
        } else if (other.rigidBodyObject?.name === 'player') {
          damagePlayer(20);
          damageEnemy(id); // Destroy on impact
        }
      }}
    >
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="red" emissive="darkred" emissiveIntensity={0.5} wireframe />
      </mesh>
      <CuboidCollider args={[1, 1, 1]} sensor />
    </RigidBody>
  );
};

const Projectile = ({ id, position }) => {
  return (
    <RigidBody type="kinematicPosition" position={position} name="projectile">
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
      </mesh>
      <CuboidCollider args={[0.2, 0.2, 1]} sensor />
    </RigidBody>
  );
};

const Boss = () => {
  const { damageBoss, damagePlayer } = useGameLogic();
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(clock.elapsedTime * 2) * 15;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.sin(clock.elapsedTime) * 0.2;
    }
  });

  return (
    <RigidBody 
      type="kinematicPosition" 
      position={[0, 0, -30]}
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'projectile') {
          damageBoss();
        } else if (other.rigidBodyObject?.name === 'player') {
          damagePlayer(50);
        }
      }}
    >
      <group ref={meshRef}>
        <mesh>
          <octahedronGeometry args={[5, 1]} />
          <meshStandardMaterial color="purple" emissive="magenta" emissiveIntensity={0.5} wireframe />
        </mesh>
        {/* Boss Core */}
        <mesh position={[0, 0, 1]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial color="red" emissive="darkred" emissiveIntensity={1} />
        </mesh>
      </group>
      <CuboidCollider args={[5, 5, 5]} sensor />
    </RigidBody>
  );
};

const World = () => {
  const { gameState, enemies, projectiles, spawnEnemy, updateProjectiles, updateEnemies } = useGameLogic();
  
  useFrame(() => {
    updateProjectiles();
    updateEnemies();
    
    // Spawn enemies roughly every 2 seconds if playing
    if (gameState === 'playing' && Math.random() < 0.02) {
      spawnEnemy();
    }
  });

  return (
    <group>
      <Player />
      
      {enemies.map(enemy => (
        <Enemy key={enemy.id} id={enemy.id} position={enemy.position} />
      ))}
      
      {projectiles.map(proj => (
        <Projectile key={proj.id} id={proj.id} position={proj.position} />
      ))}
      
      {gameState === 'boss' && <Boss />}
    </group>
  );
};

export default World;
