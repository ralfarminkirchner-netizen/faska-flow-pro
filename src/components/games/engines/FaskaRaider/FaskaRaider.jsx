import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Box, Cylinder } from '@react-three/drei';
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

const Player = () => {
  const playerRef = useRef();
  const keys = useKeys();
  const { camera } = useThree();

  const moveSpeed = 6;
  const jumpForce = 8;
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  useFrame(() => {
    if (!playerRef.current) return;
    
    const { forward, backward, left, right, jump } = keys;
    
    // Get player's translation
    const translation = playerRef.current.translation();
    
    // Smooth camera follow (third person view)
    camera.position.lerp(new THREE.Vector3(translation.x, translation.y + 4, translation.z + 8), 0.1);
    camera.lookAt(translation.x, translation.y, translation.z);

    // Movement
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);
    
    const linvel = playerRef.current.linvel();
    // Keep vertical velocity, modify horizontal
    playerRef.current.setLinvel({ x: direction.x, y: linvel.y, z: direction.z }, true);
    
    // Simple jump (if reasonably flat on ground)
    if (jump && Math.abs(linvel.y) < 0.1) {
      playerRef.current.setLinvel({ x: linvel.x, y: jumpForce, z: linvel.z }, true);
    }
  });

  return (
    <RigidBody ref={playerRef} position={[0, 2, 0]} enabledRotations={[false, false, false]} colliders="hull" mass={1}>
      <Cylinder args={[0.5, 0.5, 2, 16]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
    </RigidBody>
  );
};

const Scene = () => {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.4} />
      <directionalLight castShadow position={[10, 15, 10]} intensity={1.2} shadow-mapSize={[2048, 2048]} />
      
      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box args={[100, 1, 100]} position={[0, -0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#2E8B57" roughness={0.8} />
        </Box>
      </RigidBody>

      {/* Ruins/Obstacles */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 2, -10]}>
        <Box args={[10, 4, 2]} castShadow receiveShadow>
          <meshStandardMaterial color="#A9A9A9" roughness={0.9} />
        </Box>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[5, 1, -5]}>
        <Box args={[2, 2, 2]} castShadow receiveShadow>
          <meshStandardMaterial color="#A9A9A9" roughness={0.9} />
        </Box>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="cuboid" position={[-6, 3, -15]}>
        <Box args={[4, 6, 4]} castShadow receiveShadow>
          <meshStandardMaterial color="#A9A9A9" roughness={0.9} />
        </Box>
      </RigidBody>

      {/* Platforms */}
      <RigidBody type="fixed" colliders="cuboid" position={[-6, 5, -25]}>
        <Box args={[4, 1, 4]} castShadow receiveShadow>
          <meshStandardMaterial color="#808080" roughness={0.8} />
        </Box>
      </RigidBody>
    </>
  );
};

export default function FaskaRaider({ onExit }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#87CEEB' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Physics gravity={[0, -20, 0]}>
          <Scene />
          <Player />
        </Physics>
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', margin: 0 }}>Faska Raider</h1>
        <p style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Explore the ruins. WASD to move, SPACE to jump.</p>
        <button 
          onClick={onExit}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '10px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.8)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.6)'}
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
}
