import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Environment, ContactShadows } from '@react-three/drei';
import { Physics, RigidBody, InstancedRigidBodies } from '@react-three/rapier';
import * as THREE from 'three';

function useKeys() {
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false, jump: false, action: false });
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': setKeys(k => ({...k, forward: true})); break;
        case 'KeyS': case 'ArrowDown': setKeys(k => ({...k, backward: true})); break;
        case 'KeyA': case 'ArrowLeft': setKeys(k => ({...k, left: true})); break;
        case 'KeyD': case 'ArrowRight': setKeys(k => ({...k, right: true})); break;
        case 'Space': setKeys(k => ({...k, jump: true})); break;
        case 'KeyF': case 'Enter': setKeys(k => ({...k, action: true})); break;
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
        case 'KeyF': case 'Enter': setKeys(k => ({...k, action: false})); break;
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
  const [hovering, setHovering] = useState(false);

  const moveSpeed = 10;
  const jumpForce = 16;
  const hoverForce = 22;
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  useFrame(() => {
    if (!playerRef.current) return;
    
    const { forward, backward, left, right, jump, action } = keys;
    const translation = playerRef.current.translation();
    
    // Dynamic camera (looks down slightly, follows player smoothly)
    camera.position.lerp(new THREE.Vector3(translation.x, translation.y + 8, translation.z + 14), 0.1);
    camera.lookAt(translation.x, translation.y, translation.z);

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);
    
    const linvel = playerRef.current.linvel();
    playerRef.current.setLinvel({ x: direction.x, y: linvel.y, z: direction.z }, true);
    
    // Jump logic
    if (jump && Math.abs(linvel.y) < 0.1) {
      playerRef.current.setLinvel({ x: linvel.x, y: jumpForce, z: linvel.z }, true);
    }
    
    // Hover logic (Astro Bot style laser feet)
    if (action && linvel.y < 0) {
      // apply upward force counteracting gravity when falling
      playerRef.current.applyImpulse({ x: 0, y: hoverForce * 0.016, z: 0 }, true);
      setHovering(true);
    } else {
      setHovering(false);
    }
  });

  return (
    <RigidBody ref={playerRef} position={[0, 5, 0]} enabledRotations={[false, false, false]} colliders="ball" mass={1} friction={0.5} restitution={0.2}>
      <Sphere args={[0.5, 32, 32]} castShadow>
        <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
      </Sphere>
      {/* Visor */}
      <Box args={[0.6, 0.2, 0.4]} position={[0, 0.1, -0.4]}>
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.8} />
      </Box>
      {hovering && (
        <Cylinder args={[0.1, 0.3, 1, 16]} position={[0, -0.8, 0]}>
          <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} />
        </Cylinder>
      )}
    </RigidBody>
  );
};

const PhysicsObjects = () => {
  const count = 60;
  const instances = useMemo(() => {
    const positions = [];
    const rotations = [];
    for (let i = 0; i < count; i++) {
      positions.push([Math.random() * 30 - 15, Math.random() * 10 + 2, Math.random() * 30 - 15]);
      rotations.push([Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]);
    }
    return { positions, rotations };
  }, []);

  return (
    <InstancedRigidBodies positions={instances.positions} rotations={instances.rotations} colliders="cuboid">
      <instancedMesh args={[null, null, count]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#FF00FF" metalness={0.6} roughness={0.2} />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};

const Scene = () => {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[10, 20, 10]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
      
      {/* High-tech Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box args={[100, 1, 100]} position={[0, -0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
        </Box>
      </RigidBody>

      {/* Bounce Pads / Platforms */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 2, -15]} restitution={1.5}>
        <Cylinder args={[3, 3, 1, 32]} castShadow receiveShadow>
          <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.3} />
        </Cylinder>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[10, 5, -25]}>
        <Box args={[6, 1, 6]} castShadow receiveShadow>
          <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
        </Box>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[-10, 8, -20]}>
        <Box args={[4, 1, 4]} castShadow receiveShadow>
          <meshStandardMaterial color="#00FFFF" metalness={0.8} roughness={0.2} emissive="#00FFFF" emissiveIntensity={0.2} />
        </Box>
      </RigidBody>

      <PhysicsObjects />
    </>
  );
};

export default function FaskaAstro({ onExit }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000022' }}>
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 50 }}>
        <Physics gravity={[0, -25, 0]}>
          <Scene />
          <Player />
        </Physics>
        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={100} blur={2} far={10} />
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, fontFamily: 'monospace' }}>
        <h1 style={{ color: '#00FFFF', textShadow: '0 0 10px #00FFFF', margin: 0, fontSize: '2.5rem' }}>
          Faska Astro
        </h1>
        <p style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontSize: '1.2rem' }}>
          WASD to move, SPACE to jump, F to hover!
        </p>
        <button 
          onClick={onExit}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#00FFFF',
            border: '2px solid #00FFFF',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            marginTop: '10px',
            boxShadow: '0 0 10px #00FFFF',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#00FFFF';
            e.target.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#00FFFF';
          }}
        >
          Exit Simulation
        </button>
      </div>
    </div>
  );
}
