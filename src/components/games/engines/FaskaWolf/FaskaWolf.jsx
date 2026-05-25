import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// Procedural texture generator
function createTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  if (type === 'wall') {
    ctx.fillStyle = '#6e4f3c';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#4f3627';
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 20 + 10, Math.random() * 10 + 5);
    }
  } else if (type === 'floor') {
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#1a1f22';
    ctx.lineWidth = 2;
    for (let i = 0; i < 256; i+=32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  if (type === 'floor') texture.repeat.set(50, 50);
  return texture;
}

const wallTex = createTexture('wall');
const floorTex = createTexture('floor');

function Player({ onExit }) {
  const rigidBodyRef = useRef();
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, jump: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyW') setMovement(m => ({ ...m, forward: true }));
      if (e.code === 'KeyS') setMovement(m => ({ ...m, backward: true }));
      if (e.code === 'KeyA') setMovement(m => ({ ...m, left: true }));
      if (e.code === 'KeyD') setMovement(m => ({ ...m, right: true }));
      if (e.code === 'Space') setMovement(m => ({ ...m, jump: true }));
    };
    const handleKeyUp = (e) => {
      if (e.code === 'KeyW') setMovement(m => ({ ...m, forward: false }));
      if (e.code === 'KeyS') setMovement(m => ({ ...m, backward: false }));
      if (e.code === 'KeyA') setMovement(m => ({ ...m, left: false }));
      if (e.code === 'KeyD') setMovement(m => ({ ...m, right: false }));
      if (e.code === 'Space') setMovement(m => ({ ...m, jump: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;
    
    const velocity = rigidBodyRef.current.linvel();
    const camera = state.camera;
    
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0));
    const sideVector = new THREE.Vector3((movement.left ? 1 : 0) - (movement.right ? 1 : 0), 0, 0);
    
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(6).applyEuler(camera.rotation);
    
    rigidBodyRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
    
    if (movement.jump && Math.abs(velocity.y) < 0.1) {
      rigidBodyRef.current.setLinvel({ x: velocity.x, y: 6, z: velocity.z });
      setMovement(m => ({ ...m, jump: false }));
    }
    
    // Sync camera to player position
    const pos = rigidBodyRef.current.translation();
    camera.position.set(pos.x, pos.y + 0.8, pos.z);
  });

  return (
    <RigidBody ref={rigidBodyRef} colliders="capsule" mass={1} type="dynamic" position={[0, 2, 0]} enabledRotations={[false, false, false]}>
      <mesh visible={false}>
        <capsuleGeometry args={[0.5, 1, 4]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

function Maze() {
  const walls = [
    { position: [0, 2.5, -20], args: [40, 5, 1] },
    { position: [0, 2.5, 20], args: [40, 5, 1] },
    { position: [-20, 2.5, 0], args: [1, 5, 40] },
    { position: [20, 2.5, 0], args: [1, 5, 40] },
    { position: [5, 2.5, -5], args: [8, 5, 8] },
    { position: [-10, 2.5, 10], args: [4, 5, 16] },
    { position: [10, 2.5, 10], args: [10, 5, 2] }
  ];

  return (
    <>
      <RigidBody type="fixed">
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial map={floorTex} />
        </mesh>
      </RigidBody>
      {walls.map((wall, i) => (
        <RigidBody key={i} type="fixed" position={wall.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={wall.args} />
            <meshStandardMaterial map={wallTex} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

export default function FaskaWolf({ onExit }) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'absolute', top: 0, left: 0, zIndex: 9999 }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'white', fontFamily: 'monospace' }}>
        <h2>FaskaWolf (FPS)</h2>
        <p>Click inside to lock pointer. WASD to move, SPACE to jump.</p>
        <p>Press ESC to unlock pointer, then click Exit to leave.</p>
        <button onClick={onExit} style={{ padding: '10px 20px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          EXIT GAME
        </button>
      </div>
      <Canvas shadows camera={{ fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.4} />
        <directionalLight castShadow position={[20, 40, 20]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
        <Physics gravity={[0, -15, 0]}>
          <Player />
          <Maze />
        </Physics>
        <PointerLockControls />
      </Canvas>
    </div>
  );
}
