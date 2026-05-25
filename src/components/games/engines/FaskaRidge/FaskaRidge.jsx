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
  
  if (type === 'asphalt') {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 20000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#111' : '#333';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else if (type === 'checker') {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#ff0000' : '#ffffff';
        ctx.fillRect(x * 32, y * 32, 32, 32);
      }
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

function Car() {
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

    // Engine Force
    if (keys.w) {
      body.applyImpulse({ x: forward.x * 2.5, y: 0, z: forward.z * 2.5 }, true);
    }
    if (keys.s) {
      body.applyImpulse({ x: -forward.x * 1.5, y: 0, z: -forward.z * 1.5 }, true);
    }
    
    // Steering
    // Drifting ridge racer style: turn sharp, lose some grip
    let turnSpeed = 0.04;
    if (keys.space) turnSpeed = 0.08; // Handbrake drift!

    // Only turn if moving
    if (currentSpeed > 1) {
      const dir = (keys.w || (!keys.w && !keys.s)) ? 1 : -1;
      if (keys.a) body.applyTorqueImpulse({ x: 0, y: turnSpeed * dir * currentSpeed * 0.1, z: 0 }, true);
      if (keys.d) body.applyTorqueImpulse({ x: 0, y: -turnSpeed * dir * currentSpeed * 0.1, z: 0 }, true);
    }

    // Grip / Lateral Friction (Drift mechanics)
    const sideSpeed = rightVec.dot(new THREE.Vector3(vel.x, 0, vel.z));
    let grip = 0.2; // default counter impulse
    if (keys.space) grip = 0.02; // Slide easily
    
    body.applyImpulse({ x: -rightVec.x * sideSpeed * grip, y: 0, z: -rightVec.z * sideSpeed * grip }, true);

    // Keep it grounded (downforce)
    body.applyImpulse({ x: 0, y: -0.5, z: 0 }, true);

    // Camera follow
    const idealOffset = new THREE.Vector3(0, 4, 12).applyEuler(euler);
    const idealLookAt = new THREE.Vector3(0, 0, -10).applyEuler(euler).add(pos);
    
    const targetPos = new THREE.Vector3(pos.x, pos.y, pos.z).add(idealOffset);
    
    smoothedCamPos.lerp(targetPos, 0.1);
    smoothedCamTarget.lerp(idealLookAt, 0.1);

    camera.position.copy(smoothedCamPos);
    camera.lookAt(smoothedCamTarget);
  });

  return (
    <RigidBody ref={carRef} colliders="cuboid" mass={100} position={[0, 1, 0]} linearDamping={1} angularDamping={2}>
      <group>
        {/* Car body */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 0.8, 4]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 1.2, -0.2]}>
          <boxGeometry args={[1.6, 0.6, 2]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.1} metalness={1} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.7, 0.6, -2.01]}>
          <boxGeometry args={[0.4, 0.2, 0.1]} />
          <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.7, 0.6, -2.01]}>
          <boxGeometry args={[0.4, 0.2, 0.1]} />
          <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={2} />
        </mesh>
      </group>
    </RigidBody>
  );
}

function Track() {
  const asphaltUrl = useMemo(() => createTextureUrl('asphalt'), []);
  const checkerUrl = useMemo(() => createTextureUrl('checker'), []);

  const asphaltTex = useMemo(() => {
    const tex = new THREE.TextureLoader().load(asphaltUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
    return tex;
  }, [asphaltUrl]);

  const walls = [];
  const radius = 100;
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    // Outer
    walls.push(
      <RigidBody key={`out-${i}`} type="fixed" position={[Math.cos(angle) * (radius + 15), 2, Math.sin(angle) * (radius + 15)]} rotation={[0, -angle, 0]}>
        <mesh>
          <boxGeometry args={[10, 4, 1]} />
          <meshStandardMaterial color={i % 2 === 0 ? "red" : "white"} />
        </mesh>
      </RigidBody>
    );
    // Inner
    walls.push(
      <RigidBody key={`in-${i}`} type="fixed" position={[Math.cos(angle) * (radius - 15), 2, Math.sin(angle) * (radius - 15)]} rotation={[0, -angle, 0]}>
        <mesh>
          <boxGeometry args={[10, 4, 1]} />
          <meshStandardMaterial color={i % 2 === 0 ? "red" : "white"} />
        </mesh>
      </RigidBody>
    );
  }

  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" friction={0.5}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial map={asphaltTex} />
        </mesh>
      </RigidBody>
      {walls}
    </>
  );
}

export default function FaskaRidge({ onExit }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[50, 50, 50]} intensity={1.5} />
        <Environment preset="city" />
        <Physics>
          <Car />
          <Track />
        </Physics>
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif' }}>
        <h2>Faska Ridge</h2>
        <p>W/A/S/D to Drive. SPACE to Drift!</p>
        <button onClick={onExit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid white' }}>Exit Game</button>
      </div>
    </div>
  );
}
