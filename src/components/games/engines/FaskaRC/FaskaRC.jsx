import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

function createTextureUrl(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (type === 'carpet') {
    ctx.fillStyle = '#1e3799';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 50000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#0c2461' : '#4a69bd';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else if (type === 'wood') {
    ctx.fillStyle = '#d1ccc0';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 512; i++) {
      ctx.fillStyle = `rgba(132, 129, 122, ${Math.random() * 0.2})`;
      ctx.fillRect(0, i, 512, 1);
    }
  }
  return canvas.toDataURL();
}

function useKeys() {
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });
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

function RCCar() {
  const carRef = useRef();
  const keys = useKeys();
  const { camera } = useThree();

  const [smoothedCamPos] = useState(() => new THREE.Vector3(0, 30, 0));

  useFrame((state, delta) => {
    if (!carRef.current) return;

    const body = carRef.current;
    const pos = body.translation();
    const rot = body.rotation();
    const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w));
    
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(euler);
    const rightVec = new THREE.Vector3(1, 0, 0).applyEuler(euler);

    const vel = body.linvel();
    const currentSpeed = new THREE.Vector3(vel.x, 0, vel.z).length();

    // RC cars have very fast acceleration but low top speed (simulated via damping)
    if (keys.w) {
      body.applyImpulse({ x: forward.x * 0.4, y: 0, z: forward.z * 0.4 }, true);
    }
    if (keys.s) {
      body.applyImpulse({ x: -forward.x * 0.2, y: 0, z: -forward.z * 0.2 }, true);
    }
    
    // Very snappy steering
    if (currentSpeed > 0.1) {
      const dir = (keys.w || (!keys.w && !keys.s)) ? 1 : -1;
      let turnSpeed = 0.015;
      if (keys.a) body.applyTorqueImpulse({ x: 0, y: turnSpeed * dir, z: 0 }, true);
      if (keys.d) body.applyTorqueImpulse({ x: 0, y: -turnSpeed * dir, z: 0 }, true);
    }

    // High grip for RC
    const sideSpeed = rightVec.dot(new THREE.Vector3(vel.x, 0, vel.z));
    body.applyImpulse({ x: -rightVec.x * sideSpeed * 0.5, y: 0, z: -rightVec.z * sideSpeed * 0.5 }, true);

    // Camera follow (Top-down)
    const targetPos = new THREE.Vector3(pos.x, 30, pos.z + 5);
    smoothedCamPos.lerp(targetPos, 0.1);
    
    camera.position.copy(smoothedCamPos);
    camera.lookAt(pos.x, 0, pos.z);
  });

  return (
    <RigidBody ref={carRef} colliders="cuboid" mass={10} position={[0, 0.5, 0]} linearDamping={3} angularDamping={6}>
      <group>
        {/* Chassis */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.3, 1.6]} />
          <meshStandardMaterial color="#27ae60" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0.3, 0.8, 0.6]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Red tip */}
        <mesh position={[0.3, 1.4, 0.6]}>
          <sphereGeometry args={[0.06]} />
          <meshStandardMaterial color="red" />
        </mesh>
        {/* Wheels */}
        <mesh position={[0.45, 0.1, -0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[-0.45, 0.1, -0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.45, 0.1, 0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[-0.45, 0.1, 0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </RigidBody>
  );
}

function Playroom() {
  const carpetUrl = useMemo(() => createTextureUrl('carpet'), []);
  const woodUrl = useMemo(() => createTextureUrl('wood'), []);

  const carpetTex = useMemo(() => {
    const tex = new THREE.TextureLoader().load(carpetUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 20);
    return tex;
  }, [carpetUrl]);

  const woodTex = useMemo(() => {
    const tex = new THREE.TextureLoader().load(woodUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, [woodUrl]);

  return (
    <>
      <RigidBody type="fixed" friction={0.8}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial map={carpetTex} />
        </mesh>
      </RigidBody>
      
      {/* Wooden Blocks / Furniture legs as obstacles */}
      {[...Array(30)].map((_, i) => (
        <RigidBody key={i} type="fixed" position={[Math.random() * 80 - 40, 1, Math.random() * 80 - 40]}>
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial map={woodTex} color="#f5cd79" />
          </mesh>
        </RigidBody>
      ))}

      {/* Ramps made of books */}
      {[...Array(5)].map((_, i) => (
        <RigidBody key={`ramp-${i}`} type="fixed" position={[Math.random() * 60 - 30, 0.5, Math.random() * 60 - 30]} rotation={[Math.PI / 12, Math.random() * Math.PI, 0]}>
          <mesh>
            <boxGeometry args={[6, 0.5, 4]} />
            <meshStandardMaterial color={['#e15f41', '#3dc1d3', '#f3a683'][i % 3]} />
          </mesh>
        </RigidBody>
      ))}

      {/* Boundary walls */}
      <RigidBody type="fixed" position={[0, 2, -50]}>
        <mesh><boxGeometry args={[100, 4, 1]} /><meshStandardMaterial color="#fff" /></mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 2, 50]}>
        <mesh><boxGeometry args={[100, 4, 1]} /><meshStandardMaterial color="#fff" /></mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-50, 2, 0]}>
        <mesh><boxGeometry args={[1, 4, 100]} /><meshStandardMaterial color="#fff" /></mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[50, 2, 0]}>
        <mesh><boxGeometry args={[1, 4, 100]} /><meshStandardMaterial color="#fff" /></mesh>
      </RigidBody>
    </>
  );
}

export default function FaskaRC({ onExit }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 30, 10], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[10, 30, 10]} intensity={1.5} shadow-camera-near={0.1} shadow-camera-far={100} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
        <Environment preset="apartment" />
        <Physics>
          <RCCar />
          <Playroom />
        </Physics>
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ margin: 0, color: '#27ae60' }}>Faska RC</h2>
        <p>W/A/S/D to Drive the micro car!</p>
        <button onClick={onExit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px' }}>Put Controller Down</button>
      </div>
    </div>
  );
}
