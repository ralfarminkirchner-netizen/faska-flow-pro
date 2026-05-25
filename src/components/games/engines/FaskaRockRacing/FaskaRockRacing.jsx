import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

// Procedural texture generator
function createTextureUrl(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (type === 'rock') {
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 30000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#333' : '#666';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
    }
  } else if (type === 'metal') {
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 512; i += 16) {
      ctx.fillStyle = '#95a5a6';
      ctx.fillRect(0, i, 512, 2);
      ctx.fillRect(i, 0, 2, 512);
    }
  }
  return canvas.toDataURL();
}

function useKeys() {
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false, space: false });
  useEffect(() => {
    const handleKeyDown = (e) => setKeys(k => ({ ...k, [e.key === ' ' ? 'space' : e.key.toLowerCase()]: true }));
    const handleKeyUp = (e) => setKeys(k => ({ ...k, [e.key === ' ' ? 'space' : e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return keys;
}

function CombatCar({ setProjectiles }) {
  const carRef = useRef();
  const keys = useKeys();
  const cameraRef = useRef();

  const [lastShot, setLastShot] = useState(0);

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

    // Heavy combat car - slower acceleration, higher mass
    if (keys.w) {
      body.applyImpulse({ x: forward.x * 4.0, y: 0, z: forward.z * 4.0 }, true);
    }
    if (keys.s) {
      body.applyImpulse({ x: -forward.x * 2.0, y: 0, z: -forward.z * 2.0 }, true);
    }
    
    // Steering
    let turnSpeed = 0.08;
    if (currentSpeed > 0.5) {
      const dir = (keys.w || (!keys.w && !keys.s)) ? 1 : -1;
      if (keys.a) body.applyTorqueImpulse({ x: 0, y: turnSpeed * dir * currentSpeed * 0.1, z: 0 }, true);
      if (keys.d) body.applyTorqueImpulse({ x: 0, y: -turnSpeed * dir * currentSpeed * 0.1, z: 0 }, true);
    }

    // Grip
    const sideSpeed = rightVec.dot(new THREE.Vector3(vel.x, 0, vel.z));
    body.applyImpulse({ x: -rightVec.x * sideSpeed * 0.2, y: 0, z: -rightVec.z * sideSpeed * 0.2 }, true);
    body.applyImpulse({ x: 0, y: -2, z: 0 }, true); // Heavy downforce

    // Shooting
    if (keys.space && state.clock.elapsedTime - lastShot > 0.3) {
      setLastShot(state.clock.elapsedTime);
      const spawnPos = new THREE.Vector3(pos.x, pos.y + 0.5, pos.z).add(forward.clone().multiplyScalar(3));
      setProjectiles(prev => [...prev, { id: Date.now(), pos: spawnPos.toArray(), dir: forward.toArray() }]);
    }

    // Isometric Camera follow
    if (cameraRef.current) {
      const offset = new THREE.Vector3(20, 20, 20);
      const targetPos = new THREE.Vector3(pos.x, pos.y, pos.z).add(offset);
      cameraRef.current.position.lerp(targetPos, 0.1);
      cameraRef.current.lookAt(pos.x, pos.y, pos.z);
    }
  });

  return (
    <>
      <OrthographicCamera ref={cameraRef} makeDefault position={[20, 20, 20]} zoom={30} near={-100} far={200} />
      <RigidBody ref={carRef} colliders="cuboid" mass={200} position={[0, 2, 0]} linearDamping={2} angularDamping={4}>
        <group>
          {/* Monster Truck/Combat Car Body */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[2.5, 1, 4.5]} />
            <meshStandardMaterial color="#8e44ad" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.8, -0.5]}>
            <boxGeometry args={[1.5, 1, 2]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          {/* Turret */}
          <mesh position={[0, 2.4, -0.5]}>
            <cylinderGeometry args={[0.5, 0.6, 0.4]} />
            <meshStandardMaterial color="#34495e" />
          </mesh>
          <mesh position={[0, 2.4, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial color="#95a5a6" metalness={0.8} />
          </mesh>
        </group>
      </RigidBody>
    </>
  );
}

function Projectile({ pos, dir }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.applyImpulse({ x: dir[0] * 50, y: dir[1] * 50, z: dir[2] * 50 }, true);
    }
  }, [dir]);

  return (
    <RigidBody ref={ref} position={pos} colliders="ball" mass={10}>
      <mesh>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={2} />
      </mesh>
    </RigidBody>
  );
}

function Arena() {
  const rockUrl = useMemo(() => createTextureUrl('rock'), []);
  const metalUrl = useMemo(() => createTextureUrl('metal'), []);

  const rockTex = useMemo(() => {
    const tex = new THREE.TextureLoader().load(rockUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    return tex;
  }, [rockUrl]);

  const metalTex = useMemo(() => {
    const tex = new THREE.TextureLoader().load(metalUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    return tex;
  }, [metalUrl]);

  return (
    <>
      <RigidBody type="fixed" friction={0.5}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial map={rockTex} />
        </mesh>
      </RigidBody>
      
      {/* Outer Walls */}
      <RigidBody type="fixed" position={[0, 2, -50]}>
        <mesh>
          <boxGeometry args={[100, 4, 2]} />
          <meshStandardMaterial map={metalTex} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 2, 50]}>
        <mesh>
          <boxGeometry args={[100, 4, 2]} />
          <meshStandardMaterial map={metalTex} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-50, 2, 0]}>
        <mesh>
          <boxGeometry args={[2, 4, 100]} />
          <meshStandardMaterial map={metalTex} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[50, 2, 0]}>
        <mesh>
          <boxGeometry args={[2, 4, 100]} />
          <meshStandardMaterial map={metalTex} />
        </mesh>
      </RigidBody>

      {/* Obstacles */}
      {[...Array(20)].map((_, i) => (
        <RigidBody key={i} type="fixed" position={[Math.random() * 80 - 40, 2, Math.random() * 80 - 40]}>
          <mesh>
            <boxGeometry args={[4, 4, 4]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
        </RigidBody>
      ))}
      
      {/* Some loose physical crates */}
      {[...Array(15)].map((_, i) => (
        <RigidBody key={`crate-${i}`} mass={5} position={[Math.random() * 60 - 30, 2, Math.random() * 60 - 30]}>
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#f39c12" map={metalTex} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

export default function FaskaRockRacing({ onExit }) {
  const [projectiles, setProjectiles] = useState([]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111' }}>
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[20, 50, 20]} intensity={2} shadow-camera-near={0.1} shadow-camera-far={100} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} />
        <Environment preset="night" />
        <Physics>
          <CombatCar setProjectiles={setProjectiles} />
          <Arena />
          {projectiles.map(p => <Projectile key={p.id} pos={p.pos} dir={p.dir} />)}
        </Physics>
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20, color: '#e74c3c', fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}>
        <h2 style={{ fontSize: '2em', margin: '0 0 10px 0' }}>Faska Rock Racing</h2>
        <p style={{ fontSize: '1.2em' }}>W/A/S/D to Drive. SPACE to Shoot.</p>
        <button onClick={onExit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#c0392b', color: 'white', border: 'none', fontWeight: 'bold' }}>Exit Arena</button>
      </div>
    </div>
  );
}
