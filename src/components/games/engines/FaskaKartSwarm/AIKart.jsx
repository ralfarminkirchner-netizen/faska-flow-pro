import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useGameStore } from './GameLogic';
import { TRACK_RADIUS, getTrackPoint, getTrackT } from './World';
import { KartMesh } from './PlayerKart';

const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
const lerp = (a, b, t) => a + (b - a) * t;

export const AIKart = ({ index, color, name }) => {
  const groupRef = useRef();

  const phase = useGameStore(s => s.phase);
  const setBananas = useGameStore(s => s.setBananas);
  const setProjectiles = useGameStore(s => s.setProjectiles);

  const state = useRef({
    t: (index + 1) * 0.07,
    x: Math.cos((index + 1) * 0.07 * Math.PI * 2) * TRACK_RADIUS,
    z: Math.sin((index + 1) * 0.07 * Math.PI * 2) * TRACK_RADIUS,
    rotation: (index + 1) * 0.07 * Math.PI * 2 + Math.PI / 2,
    speed: 18 + index * 1.5,
    targetT: (index + 1) * 0.07 + 0.02,
    fireTimer: 4 + index * 2.5,
    dropTimer: 6 + index * 3,
  });

  useFrame((_, delta) => {
    if (phase !== 'racing' && phase !== 'quiz') return;
    let dt = clamp(delta, 0.001, 0.08);
    if (phase === 'quiz') dt *= 0.15; // BULLET TIME
    const s = state.current;

    // AI follows track centerline
    s.targetT = (s.t + 0.02) % 1;
    const target = getTrackPoint(s.targetT);
    const dx = target.x - s.x;
    const dz = target.z - s.z;
    const targetAngle = Math.atan2(dx, dz);

    // Smooth rotation toward target
    let diff = targetAngle - s.rotation;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    s.rotation += diff * 5 * dt;

    const baseSpeed = 18 + index * 1.5;
    s.speed = lerp(s.speed, baseSpeed, 0.02);

    const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
    s.x += dir.x * s.speed * dt;
    s.z += dir.z * s.speed * dt;
    s.t = getTrackT(new THREE.Vector3(s.x, 0, s.z));

    // Snap to track
    const distC = Math.sqrt(s.x * s.x + s.z * s.z);
    if (Math.abs(distC - TRACK_RADIUS) > 4) {
      const ang = Math.atan2(s.z, s.x);
      s.x = Math.cos(ang) * TRACK_RADIUS;
      s.z = Math.sin(ang) * TRACK_RADIUS;
    }

    if (groupRef.current) {
      groupRef.current.position.set(s.x, 0, s.z);
      groupRef.current.rotation.y = s.rotation;
    }

    // AI fire shell occasionally
    s.fireTimer -= dt;
    if (s.fireTimer <= 0) {
      s.fireTimer = 8 + Math.random() * 8;
      setProjectiles(prev => [...prev, {
        id: Date.now() + index * 100,
        x: s.x + dir.x * 3,
        z: s.z + dir.z * 3,
        vx: dir.x,
        vz: dir.z,
        owner: `ai_${index}`
      }]);
    }

    // AI drop banana occasionally
    s.dropTimer -= dt;
    if (s.dropTimer <= 0) {
      s.dropTimer = 10 + Math.random() * 10;
      setBananas(prev => [...prev, {
        id: Date.now() + index * 200,
        x: s.x - dir.x * 3,
        z: s.z - dir.z * 3
      }]);
    }
  });

  return (
    <group ref={groupRef}>
      <KartMesh color={color} name={name} isPlayer={false} isDrifting={false} isHit={false} />
      <Html position={[0, 2.2, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.6)', color: 'white',
          padding: '2px 6px', borderRadius: '5px',
          fontSize: '12px', whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none'
        }}>{name}</div>
      </Html>
    </group>
  );
};
