import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Procedural texture generator
function createTextureUrl(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (type === 'dirt') {
    ctx.fillStyle = '#6b4d2e';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 20000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#573d23' : '#805f3b';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 4, 4);
    }
  } else if (type === 'grass') {
    ctx.fillStyle = '#2b7539';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 20000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#1f5e2b' : '#39944a';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
    }
  }
  return canvas.toDataURL();
}

function useKeys() {
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false, space: false });
  useEffect(() => {
    const handleKeyDown = (e) => setKeys(k => ({ ...k, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e) => setKeys(k => ({ ...k, [e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return keys;
}

function RallyCar() {
  const carRef = useRef();
  const keys = useKeys();
  const { camera } = useThree();

  const [smoothedCamPos] = useState(() => new THREE.Vector3(0, 5, 10));
  const [smoothedCamTarget] = useState(() => new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!carRef.current) return;

    const body = carRef.current;
    const pos = body.translation();
    const rot = body.rotation();
    const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w));
    
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(euler);
    const rightVec = new THREE.Vector3(1, 0, 0).applyEuler(euler);

    const vel = body.linvel();
    const currentSpeed = new THREE.Vector3(vel.x, vel.y, vel.z).length();

    // Engine Force - rally car is punchy
    if (keys.w) {
      body.applyImpulse({ x: forward.x * 3.0, y: 0, z: forward.z * 3.0 }, true);
    }
    if (keys.s) {
      body.applyImpulse({ x: -forward.x * 2.0, y: 0, z: -forward.z * 2.0 }, true);
    }
    
    // Steering
    let turnSpeed = 0.05;
    
    if (currentSpeed > 1) {
      const dir = (keys.w || (!keys.w && !keys.s)) ? 1 : -1;
      if (keys.a) body.applyTorqueImpulse({ x: 0, y: turnSpeed * dir * currentSpeed * 0.1, z: 0 }, true);
      if (keys.d) body.applyTorqueImpulse({ x: 0, y: -turnSpeed * dir * currentSpeed * 0.1, z: 0 }, true);
    }

    // Grip - Dirt track has less grip
    const sideSpeed = rightVec.dot(new THREE.Vector3(vel.x, 0, vel.z));
    let grip = 0.08; // Loose dirt
    if (keys.space) grip = 0.01; // Handbrake
    
    body.applyImpulse({ x: -rightVec.x * sideSpeed * grip, y: 0, z: -rightVec.z * sideSpeed * grip }, true);

    // Keep it grounded (downforce)
    body.applyImpulse({ x: 0, y: -1, z: 0 }, true);

    // Camera follow (slightly more dynamic/bouncy for rally)
    const idealOffset = new THREE.Vector3(0, 5, 14).applyEuler(euler);
    const idealLookAt = new THREE.Vector3(0, 0, -10).applyEuler(euler).add(pos);
    
    const targetPos = new THREE.Vector3(pos.x, pos.y, pos.z).add(idealOffset);
    
    smoothedCamPos.lerp(targetPos, 0.1);
    smoothedCamTarget.lerp(idealLookAt, 0.1);

    camera.position.copy(smoothedCamPos);
    camera.lookAt(smoothedCamTarget);
  });

  return (
    <RigidBody ref={carRef} colliders="cuboid" mass={120} position={[0, 5, 0]} linearDamping={1} angularDamping={3}>
      <group>
        {/* Car body */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.2, 0.9, 4.2]} />
          <meshStandardMaterial color="#2980b9" roughness={0.4} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 1.4, -0.1]}>
          <boxGeometry args={[1.6, 0.7, 2]} />
          <meshStandardMaterial color="#ecf0f1" roughness={0.1} metalness={0.5} />
        </mesh>
        {/* Spoiler */}
        <mesh position={[0, 1.2, 1.8]}>
          <boxGeometry args={[2.2, 0.1, 0.5]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        <mesh position={[0.9, 0.9, 1.8]}>
          <boxGeometry args={[0.1, 0.6, 0.4]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        <mesh position={[-0.9, 0.9, 1.8]}>
          <boxGeometry args={[0.1, 0.6, 0.4]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.6, 0.7, -2.11]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={3} />
        </mesh>
        <mesh position={[-0.6, 0.7, -2.11]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={3} />
        </mesh>
      </group>
    </RigidBody>
  );
}

function RallyTrack() {
  const dirtUrl = useMemo(() => createTextureUrl('dirt'), []);
  const grassUrl = useMemo(() => createTextureUrl('grass'), []);

  const dirtTex = useMemo(() => {
    const tex = new THREE.TextureLoader().load(dirtUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 200);
    return tex;
  }, [dirtUrl]);

  const grassTex = useMemo(() => {
    const tex = new THREE.TextureLoader().load(grassUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(100, 100);
    return tex;
  }, [grassUrl]);

  const segments = [];
  let zOffset = 0;

  // Generate a long bumpy track with ramps
  for (let i = 0; i < 50; i++) {
    const length = 40;
    const isRamp = i % 10 === 5;
    const isDip = i % 10 === 8;
    
    let yPos = 0;
    let rotX = 0;

    if (isRamp) {
      yPos = 2;
      rotX = -Math.PI / 16;
    } else if (isDip) {
      yPos = -1;
      rotX = Math.PI / 16;
    }

    segments.push(
      <RigidBody key={`seg-${i}`} type="fixed" position={[0, yPos, -zOffset - length / 2]} rotation={[rotX, 0, 0]}>
        <mesh>
          <boxGeometry args={[40, 2, length]} />
          <meshStandardMaterial map={dirtTex} />
        </mesh>
      </RigidBody>
    );

    // Barriers
    segments.push(
      <RigidBody key={`bar-l-${i}`} type="fixed" position={[-20, yPos + 2, -zOffset - length / 2]} rotation={[rotX, 0, 0]}>
        <mesh>
          <boxGeometry args={[2, 4, length]} />
          <meshStandardMaterial color="#d35400" />
        </mesh>
      </RigidBody>
    );
    segments.push(
      <RigidBody key={`bar-r-${i}`} type="fixed" position={[20, yPos + 2, -zOffset - length / 2]} rotation={[rotX, 0, 0]}>
        <mesh>
          <boxGeometry args={[2, 4, length]} />
          <meshStandardMaterial color="#d35400" />
        </mesh>
      </RigidBody>
    );

    zOffset += length;
  }

  return (
    <>
      {/* Background Grass */}
      <RigidBody type="fixed" position={[0, -2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1000, 2000]} />
          <meshStandardMaterial map={grassTex} />
        </mesh>
      </RigidBody>
      {segments}
    </>
  );
}

export default function FaskaRally({ onExit }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Sky sunPosition={[100, 10, 10]} turbidity={10} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />
        <ambientLight intensity={0.4} />
        <directionalLight castShadow position={[50, 50, 50]} intensity={1.5} />
        <Environment preset="park" />
        <Physics>
          <RallyCar />
          <RallyTrack />
        </Physics>
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif', textShadow: '2px 2px 4px #000' }}>
        <h2 style={{ color: '#f1c40f' }}>Faska Rally</h2>
        <p>W/A/S/D to Drive. Watch out for jumps!</p>
        <button onClick={onExit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: 'rgba(0,0,0,0.7)', color: '#f1c40f', border: '2px solid #f1c40f', fontWeight: 'bold' }}>Exit Game</button>
      </div>
    </div>
  );
}
