import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { KeyboardControls, useKeyboardControls, Environment, Trail, Stars } from '@react-three/drei';
import { Physics, RigidBody, useRapier, CuboidCollider } from '@react-three/rapier';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { create } from 'zustand';

// Store
const useGameStore = create((set) => ({
  gameState: 'START', // START, PLAYING, GAMEOVER
  lap: 1,
  time: 0,
  maxLaps: 3,
  startGame: () => set({ gameState: 'PLAYING', lap: 1, time: 0 }),
  incrementLap: () => set((state) => {
    if (state.lap >= state.maxLaps) {
      return { gameState: 'GAMEOVER', lap: state.maxLaps };
    }
    return { lap: state.lap + 1 };
  }),
  updateTime: (dt) => set((state) => ({ time: state.time + dt })),
  resetGame: () => set({ gameState: 'START', lap: 1, time: 0 }),
}));

const HOVER_HEIGHT = 1.5;
const HOVER_SPRING = 250;
const HOVER_DAMP = 15;
const THRUST = 150;
const TURN_SPEED = 3.5;

const CONTROLS = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'boost', keys: ['Shift'] },
];

const TRACK_POINTS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, -200),
  new THREE.Vector3(100, 20, -350),
  new THREE.Vector3(300, 50, -400),
  new THREE.Vector3(500, 20, -300),
  new THREE.Vector3(600, -20, 0),
  new THREE.Vector3(400, -40, 200),
  new THREE.Vector3(200, 0, 150),
];

const Ship = () => {
  const bodyRef = useRef(null);
  const [, getKeys] = useKeyboardControls();
  const boost = useKeyboardControls(state => state.boost);
  const { rapier, world } = useRapier();
  const gameState = useGameStore((s) => s.gameState);
  
  const checkpoints = useMemo(() => TRACK_POINTS.map(p => p.clone()), []);
  const currentCheckpointIndex = useRef(0);
  const incrementLap = useGameStore((s) => s.incrementLap);

  const rayOffsets = useMemo(() => [
    new THREE.Vector3( 1, 0,  1.5),
    new THREE.Vector3(-1, 0,  1.5),
    new THREE.Vector3( 1, 0, -1.5),
    new THREE.Vector3(-1, 0, -1.5)
  ], []);

  useFrame((state, delta) => {
    if (gameState !== 'PLAYING') return;
    if (!bodyRef.current) return;
    
    const body = bodyRef.current;
    const keys = getKeys();
    
    const pos = body.translation();
    const rot = body.rotation();
    const vel = body.linvel();
    const angVel = body.angvel();

    const quaternion = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion);
    
    const rayDir = new THREE.Vector3(0, -1, 0).applyQuaternion(quaternion);
    
    let hitCount = 0;
    
    const v_ang = new THREE.Vector3(angVel.x, angVel.y, angVel.z);
    const v_lin = new THREE.Vector3(vel.x, vel.y, vel.z);

    for (let offset of rayOffsets) {
      const localOffset = offset.clone().applyQuaternion(quaternion);
      const rayOrigin = new THREE.Vector3(pos.x, pos.y, pos.z).add(localOffset);
      const ray = new rapier.Ray(rayOrigin, rayDir);
      const hit = world.castRay(ray, HOVER_HEIGHT * 2, true);
      
      if (hit) {
        hitCount++;
        const compression = HOVER_HEIGHT - hit.toi;
        if (compression > 0) {
          const cornerVel = v_lin.clone().add(v_ang.clone().cross(localOffset));
          const upVelocity = cornerVel.dot(rayDir) * -1;
          const springForce = compression * HOVER_SPRING;
          const dampForce = upVelocity * HOVER_DAMP;
          const totalForce = Math.max(0, springForce - dampForce);
          
          const pushDir = rayDir.clone().multiplyScalar(-1);
          const impulse = pushDir.multiplyScalar(totalForce * delta);
          body.applyImpulseAtPoint(impulse, rayOrigin, true);
        }
      }
    }

    // Artificial gravity
    body.applyImpulse(rayDir.clone().multiplyScalar(40 * delta), true);

    if (hitCount > 0) {
      let thrustMult = keys.boost ? 1.8 : 1;
      let forwardForce = 0;
      if (keys.forward) forwardForce = THRUST * thrustMult;
      if (keys.back) forwardForce = -THRUST * 0.5;

      if (forwardForce !== 0) {
        body.applyImpulse(forward.clone().multiplyScalar(forwardForce * delta), true);
      }
      
      if (keys.left) body.applyTorqueImpulse(up.clone().multiplyScalar(TURN_SPEED * delta), true);
      if (keys.right) body.applyTorqueImpulse(up.clone().multiplyScalar(-TURN_SPEED * delta), true);
      
      const localVel = v_lin.clone().applyQuaternion(quaternion.clone().invert());
      
      const lateralVel = localVel.x;
      const gripForce = -lateralVel * 25; 
      body.applyImpulse(right.clone().multiplyScalar(gripForce * delta), true);
      
      const forwardDrag = -localVel.z * 1.5;
      body.applyImpulse(forward.clone().multiplyScalar(forwardDrag * delta), true);
      
      body.setAngvel({ x: angVel.x * 0.9, y: angVel.y * 0.9, z: angVel.z * 0.9 }, true);
    } else {
      body.applyImpulse(new THREE.Vector3(0, -15 * delta, 0), true);
      
      const worldUp = new THREE.Vector3(0, 1, 0);
      const rightingTorque = new THREE.Vector3().crossVectors(up, worldUp).multiplyScalar(10 * delta);
      body.applyTorqueImpulse(rightingTorque, true);
    }
    
    // Checkpoints & Reset
    const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    
    if (currentPos.y < -150) {
      const cp = checkpoints[currentCheckpointIndex.current];
      const nextCp = checkpoints[(currentCheckpointIndex.current + 1) % checkpoints.length];
      const dir = nextCp.clone().sub(cp).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
      
      body.setTranslation({ x: cp.x, y: cp.y + 10, z: cp.z }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      body.setRotation(q, true);
    }

    const nextIndex = (currentCheckpointIndex.current + 1) % checkpoints.length;
    const nextCheckpoint = checkpoints[nextIndex];
    
    if (currentPos.distanceTo(nextCheckpoint) < 100) {
      currentCheckpointIndex.current = nextIndex;
      if (nextIndex === 0) {
        incrementLap();
      }
    }

    // Camera follow
    const speedZoom = keys.boost ? 15 : 12;
    const idealOffset = forward.clone().multiplyScalar(-speedZoom).add(up.clone().multiplyScalar(5));
    const targetCamPos = currentPos.clone().add(idealOffset);
    state.camera.position.lerp(targetCamPos, 0.1);
    
    const lookAtPos = currentPos.clone().add(forward.clone().multiplyScalar(20));
    const currentLookAt = new THREE.Vector3();
    state.camera.getWorldDirection(currentLookAt);
    const targetLookAt = lookAtPos.clone().sub(state.camera.position).normalize();
    currentLookAt.lerp(targetLookAt, 0.1);
    state.camera.lookAt(state.camera.position.clone().add(currentLookAt));
  });

  return (
    <RigidBody ref={bodyRef} colliders={false} mass={2} position={[0, 10, -10]} linearDamping={0.1} angularDamping={0.1}>
      <CuboidCollider args={[2.5, 0.5, 2.5]} position={[0, 0.25, 0]} />
      <group>
        {/* Main Hull */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.5, 4]} />
          <meshStandardMaterial color="#00ffcc" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Wings */}
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[5, 0.1, 1.5]} />
          <meshStandardMaterial color="#00ffcc" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 0, -2.5]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.1, 1.414, 1, 4]} />
          <meshStandardMaterial color="#00ffcc" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cockpit */}
        <mesh position={[0, 0.4, -0.5]}>
          <boxGeometry args={[0.8, 0.4, 1.5]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Thrusters */}
        <Trail width={boost ? 2 : 1} color={boost ? "#ff00ff" : "#00ffff"} length={boost ? 20 : 10} attenuation={(t) => t * t}>
          <mesh position={[-0.8, 0, 2]}>
            <sphereGeometry args={[0.3]} />
            <meshBasicMaterial color={boost ? [10, 0, 10] : [0, 5, 10]} toneMapped={false} />
          </mesh>
        </Trail>
        <Trail width={boost ? 2 : 1} color={boost ? "#ff00ff" : "#00ffff"} length={boost ? 20 : 10} attenuation={(t) => t * t}>
          <mesh position={[0.8, 0, 2]}>
            <sphereGeometry args={[0.3]} />
            <meshBasicMaterial color={boost ? [10, 0, 10] : [0, 5, 10]} toneMapped={false} />
          </mesh>
        </Trail>
      </group>
    </RigidBody>
  );
};

const Track = () => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(TRACK_POINTS, true), []);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-20, 0);
    s.lineTo(-10, 0);
    s.lineTo(0, 0);
    s.lineTo(10, 0);
    s.lineTo(20, 0);
    s.lineTo(20, -2);
    s.lineTo(-20, -2);
    s.lineTo(-20, 0);
    return s;
  }, []);

  const geometry = useMemo(() => new THREE.ExtrudeGeometry(shape, { extrudePath: curve, steps: 400, closed: true }), [shape, curve]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.8} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.15} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
    </RigidBody>
  );
};

const HUD = ({ onExit }) => {
  const { gameState, lap, time, maxLaps, startGame, resetGame } = useGameStore();

  useEffect(() => {
    let interval;
    if (gameState === 'PLAYING') {
      interval = setInterval(() => {
        useGameStore.getState().updateTime(0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  if (gameState === 'START') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white z-10 flex-col font-mono">
        <h1 className="text-6xl font-bold mb-4 text-cyan-400 tracking-widest" style={{ textShadow: '0 0 20px cyan' }}>FASKA ZERO 2</h1>
        <p className="mb-8 text-xl">Arrows/WASD to Move | SHIFT to Boost</p>
        <div className="flex gap-4">
          <button onClick={startGame} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded text-xl uppercase font-bold transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)] cursor-pointer">Start Race</button>
          <button onClick={onExit} className="px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded text-xl uppercase font-bold transition-all cursor-pointer">Exit</button>
        </div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white z-10 flex-col font-mono">
        <h1 className="text-6xl font-bold mb-4 text-cyan-400">RACE FINISHED</h1>
        <p className="mb-8 text-3xl">Time: {time.toFixed(1)}s</p>
        <div className="flex gap-4">
          <button onClick={resetGame} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded text-xl uppercase font-bold cursor-pointer">Play Again</button>
          <button onClick={onExit} className="px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded text-xl uppercase font-bold cursor-pointer">Exit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full p-8 flex justify-between text-white font-mono z-10 pointer-events-none">
      <div className="text-4xl font-bold" style={{ textShadow: '0 0 10px cyan' }}>
        LAP {lap}/{maxLaps}
      </div>
      <div className="text-4xl font-bold" style={{ textShadow: '0 0 10px cyan' }}>
        {time.toFixed(1)}s
      </div>
    </div>
  );
};

export default function FaskaZero2({ onExit }) {
  return (
    <div className="w-full h-full relative bg-black">
      <KeyboardControls map={CONTROLS}>
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 75 }}>
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[100, 200, 50]} intensity={2} castShadow />
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            <Physics gravity={[0, 0, 0]}>
              <Track />
              <Ship />
            </Physics>
          </Suspense>

          <EffectComposer>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} />
            <ChromaticAberration offset={[0.002, 0.002]} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </KeyboardControls>
      <HUD onExit={onExit} />
    </div>
  );
}
