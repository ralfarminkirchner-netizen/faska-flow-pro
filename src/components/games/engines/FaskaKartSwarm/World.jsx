import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './GameLogic';

// ─── Constants ────────────────────────────────────────────────────────────────
export const TRACK_RADIUS = 80;
export const TRACK_WIDTH = 18;
export const TRACK_SEGMENTS = 80;

// ─── Track Math ───────────────────────────────────────────────────────────────
export const getTrackPoint = (t) => {
  const angle = t * Math.PI * 2;
  return new THREE.Vector3(
    Math.cos(angle) * TRACK_RADIUS,
    0,
    Math.sin(angle) * TRACK_RADIUS
  );
};

export const getTrackTangent = (t) => {
  const angle = t * Math.PI * 2;
  return new THREE.Vector3(
    -Math.sin(angle),
    0,
    Math.cos(angle)
  ).normalize();
};

export const getTrackT = (pos) => {
  const angle = Math.atan2(pos.z, pos.x);
  let t = angle / (Math.PI * 2);
  if (t < 0) t += 1;
  return t;
};

// ─── Track Geometry ─────────────────────────────────────────────────────────
const buildTrackGeometry = () => {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= TRACK_SEGMENTS; i++) {
    const t = i / TRACK_SEGMENTS;
    const center = getTrackPoint(t);
    const tangent = getTrackTangent(t);
    const right = new THREE.Vector3(-tangent.z, 0, tangent.x);

    const left = center.clone().addScaledVector(right, -TRACK_WIDTH / 2);
    const rightPt = center.clone().addScaledVector(right, TRACK_WIDTH / 2);

    positions.push(left.x, 0.01, left.z);
    positions.push(rightPt.x, 0.01, rightPt.z);
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, t * 10, 1, t * 10);

    if (i < TRACK_SEGMENTS) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2);
      indices.push(base + 1, base + 3, base + 2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
};

// ─── Track Component ──────────────────────────────────────────────────────────
export const Track = () => {
  const geo = useMemo(() => buildTrackGeometry(), []);

  return (
    <group>
      <primitive object={new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: '#444444', roughness: 0.9, side: THREE.DoubleSide })
      )} />
      {/* Center line dashes */}
      {Array.from({ length: TRACK_SEGMENTS }).map((_, i) => {
        if (i % 4 !== 0) return null;
        const t = i / TRACK_SEGMENTS;
        const p = getTrackPoint(t);
        return (
          <mesh key={i} position={[p.x, 0.02, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 3]} />
            <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
          </mesh>
        );
      })}
      {/* Track borders */}
      {Array.from({ length: TRACK_SEGMENTS }).map((_, i) => {
        const t = i / TRACK_SEGMENTS;
        const center = getTrackPoint(t);
        const tangent = getTrackTangent(t);
        const right = new THREE.Vector3(-tangent.z, 0, tangent.x);
        const lp = center.clone().addScaledVector(right, -TRACK_WIDTH / 2);
        const rp = center.clone().addScaledVector(right, TRACK_WIDTH / 2);
        return (
          <group key={i}>
            <mesh position={[lp.x, 0.3, lp.z]}>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial color={i % 6 < 3 ? '#ef4444' : '#ffffff'} />
            </mesh>
            <mesh position={[rp.x, 0.3, rp.z]}>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial color={i % 6 < 3 ? '#ef4444' : '#ffffff'} />
            </mesh>
          </group>
        );
      })}
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#3d7a20" roughness={1} />
      </mesh>
      {/* Decorative trees around the outside */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = TRACK_RADIUS + TRACK_WIDTH / 2 + 15;
        return (
          <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.4, 0.6, 4, 6]} />
              <meshStandardMaterial color="#6b3a1f" />
            </mesh>
            <mesh position={[0, 6, 0]}>
              <coneGeometry args={[3, 6, 6]} />
              <meshStandardMaterial color="#22863a" />
            </mesh>
          </group>
        );
      })}
      {/* Start/Finish banner */}
      <group position={[TRACK_RADIUS, 0, 0]}>
        <mesh position={[-TRACK_WIDTH / 2 - 1, 4, 0]}>
          <boxGeometry args={[0.4, 8, 0.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[TRACK_WIDTH / 2 + 1, 4, 0]}>
          <boxGeometry args={[0.4, 8, 0.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0, 8.2, 0]}>
          <boxGeometry args={[TRACK_WIDTH + 2, 0.5, 0.4]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>
    </group>
  );
};

// ─── Item Box Component ───────────────────────────────────────────────────────
export const ItemBox = ({ pos, active, index }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 2;
      ref.current.position.y = 0.8 + Math.sin(clock.elapsedTime * 3 + index) * 0.2;
    }
  });

  if (!active) return null;

  return (
    <group ref={ref} position={pos}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#f59e0b"
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#ffffff" wireframe opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

export const ITEM_BOX_POSITIONS = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map(t => {
  const p = getTrackPoint(t);
  return { t, pos: [p.x, 0.8, p.z] };
});

// ─── Projectile (Shell) ───────────────────────────────────────────────────────
export const Projectile = ({ proj, onHit }) => {
  const ref = useRef();
  const vel = useRef(new THREE.Vector3(proj.vx, 0, proj.vz));
  const pos = useRef(new THREE.Vector3(proj.x, 0.5, proj.z));

  const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = clamp(delta, 0.001, 0.05);
    pos.current.addScaledVector(vel.current, dt * 30);
    ref.current.position.copy(pos.current);
    ref.current.rotation.y += 0.3;

    const distFromCenter = Math.sqrt(pos.current.x ** 2 + pos.current.z ** 2);
    if (distFromCenter > TRACK_RADIUS + TRACK_WIDTH + 5 || distFromCenter < TRACK_RADIUS - TRACK_WIDTH - 5) {
      onHit(proj.id);
    }
  });

  return (
    <mesh ref={ref} position={[proj.x, 0.5, proj.z]} castShadow>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial color="#16a34a" emissive="#16a34a" emissiveIntensity={0.6} />
    </mesh>
  );
};

// ─── Banana Peel ──────────────────────────────────────────────────────────────
export const BananaPeel = ({ banana }) => {
  return (
    <group position={[banana.x, 0.2, banana.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.15, 6, 12]} />
        <meshStandardMaterial color="#fde047" />
      </mesh>
    </group>
  );
};

// ─── Particle Explosion ───────────────────────────────────────────────────────
export const Particles = ({ particles }) => {
  return (
    <>
      {particles.map(p => (
        <mesh key={p.id} position={p.pos} scale={p.scale}>
          <sphereGeometry args={[0.3, 4, 4]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </>
  );
};
