import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Box, Sphere, Cylinder, Float } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

function useKeys() {
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false, jump: false });
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': setKeys(k => ({...k, forward: true})); break;
        case 'KeyS': case 'ArrowDown': setKeys(k => ({...k, backward: true})); break;
        case 'KeyA': case 'ArrowLeft': setKeys(k => ({...k, left: true})); break;
        case 'KeyD': case 'ArrowRight': setKeys(k => ({...k, right: true})); break;
        case 'Space': setKeys(k => ({...k, jump: true})); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': setKeys(k => ({...k, forward: false})); break;
        case 'KeyS': case 'ArrowDown': setKeys(k => ({...k, backward: false})); break;
        case 'KeyA': case 'ArrowLeft': setKeys(k => ({...k, left: false})); break;
        case 'KeyD': case 'ArrowRight': setKeys(k => ({...k, right: false})); break;
        case 'Space': setKeys(k => ({...k, jump: false})); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return keys;
}

const Collectible = ({ position, onCollect }) => {
  const [collected, setCollected] = useState(false);

  if (collected) return null;

  return (
    <RigidBody type="fixed" colliders="ball" position={position} sensor onIntersectionEnter={() => {
      setCollected(true);
      onCollect();
    }}>
      <Float speed={3} rotationIntensity={2} floatIntensity={1}>
        <Sphere args={[0.5, 16, 16]} castShadow>
          <meshStandardMaterial color="#FFD700" emissive="#FF8C00" emissiveIntensity={0.5} roughness={0.1} metalness={0.9} />
        </Sphere>
      </Float>
    </RigidBody>
  );
};

const Player = () => {
  const playerRef = useRef();
  const keys = useKeys();
  const { camera } = useThree();

  const moveSpeed = 8;
  const jumpForce = 14;
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  useFrame(() => {
    if (!playerRef.current) return;
    
    const { forward, backward, left, right, jump } = keys;
    const translation = playerRef.current.translation();
    
    // Springy camera follow
    camera.position.lerp(new THREE.Vector3(translation.x, translation.y + 5, translation.z + 10), 0.1);
    camera.lookAt(translation.x, translation.y, translation.z);

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);
    
    const linvel = playerRef.current.linvel();
    playerRef.current.setLinvel({ x: direction.x, y: linvel.y, z: direction.z }, true);
    
    if (jump && Math.abs(linvel.y) < 0.1) {
      playerRef.current.setLinvel({ x: linvel.x, y: jumpForce, z: linvel.z }, true);
    }
  });

  return (
    <RigidBody ref={playerRef} position={[0, 3, 0]} enabledRotations={[false, false, false]} colliders="ball" mass={1} friction={0}>
      <Sphere args={[0.8, 32, 32]} castShadow>
        <meshStandardMaterial color="#FF8C00" roughness={0.4} />
      </Sphere>
      {/* Backpack companion visual */}
      <Sphere args={[0.4, 16, 16]} position={[0, 0.6, -0.6]} castShadow>
        <meshStandardMaterial color="#DC143C" roughness={0.4} />
      </Sphere>
    </RigidBody>
  );
};

const Scene = ({ onCollect }) => {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <ambientLight intensity={0.6} />
      <directionalLight castShadow position={[20, 30, 10]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
      
      {/* Colorful Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box args={[100, 1, 100]} position={[0, -0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#7CFC00" roughness={1} />
        </Box>
      </RigidBody>

      {/* Platforms */}
      <RigidBody type="fixed" colliders="cuboid" position={[5, 1, -10]}>
        <Cylinder args={[3, 3, 2, 16]} castShadow receiveShadow>
          <meshStandardMaterial color="#8B4513" />
        </Cylinder>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[12, 3, -15]}>
        <Cylinder args={[3, 3, 2, 16]} castShadow receiveShadow>
          <meshStandardMaterial color="#8B4513" />
        </Cylinder>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="cuboid" position={[0, 5, -25]}>
        <Box args={[8, 1, 8]} castShadow receiveShadow>
          <meshStandardMaterial color="#D2B48C" />
        </Box>
      </RigidBody>

      <Collectible position={[5, 3, -10]} onCollect={onCollect} />
      <Collectible position={[12, 5, -15]} onCollect={onCollect} />
      <Collectible position={[0, 7, -25]} onCollect={onCollect} />
      <Collectible position={[-10, 1, -5]} onCollect={onCollect} />
      <Collectible position={[-15, 1, -15]} onCollect={onCollect} />
    </>
  );
};

export default function FaskaKazooie({ onExit }) {
  const [score, setScore] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#87CEEB' }}>
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 60 }}>
        <Physics gravity={[0, -30, 0]}>
          <Scene onCollect={() => setScore(s => s + 1)} />
          <Player />
        </Physics>
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, fontFamily: 'Comic Sans MS, sans-serif' }}>
        <h1 style={{ color: '#FFD700', textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000', margin: 0, fontSize: '3rem' }}>
          Faska Kazooie
        </h1>
        <h2 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Jiggies: {score} / 5</h2>
        <p style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontSize: '1.2rem' }}>WASD to move, SPACE to jump!</p>
        <button 
          onClick={onExit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF4500',
            color: 'white',
            border: '3px solid white',
            borderRadius: '15px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            marginTop: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          Exit World
        </button>
      </div>
    </div>
  );
}
