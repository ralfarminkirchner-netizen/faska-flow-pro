import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useKartStore from './GameLogic';

/**
 * World — Oval racetrack with barriers, boost pads, AI karts, trees, and decorations.
 * The track is an oval shape ~40 units long, with inner and outer barriers.
 */

// Generate oval track points
function generateOvalPoints(count, rx, rz) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    points.push({ x: Math.sin(t) * rx, z: -Math.cos(t) * rz });
  }
  return points;
}

// Track barrier segment
function BarrierSegment({ x1, z1, x2, z2, color, height = 0.8 }) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, -dz);
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;

  return (
    <RigidBody type="fixed" position={[cx, height / 2, cz]} rotation={[0, angle, 0]} colliders={false}>
      <CuboidCollider args={[0.3, height / 2, length / 2]} />
      <mesh castShadow>
        <boxGeometry args={[0.6, height, length]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.5}
        />
      </mesh>
    </RigidBody>
  );
}

// Track barriers
function TrackBarriers() {
  const outerPoints = useMemo(() => generateOvalPoints(24, 22, 22), []);
  const innerPoints = useMemo(() => generateOvalPoints(24, 12, 12), []);

  return (
    <group>
      {/* Outer barriers — red/white */}
      {outerPoints.map((p, i) => {
        const next = outerPoints[(i + 1) % outerPoints.length];
        return (
          <BarrierSegment
            key={`outer-${i}`}
            x1={p.x} z1={p.z} x2={next.x} z2={next.z}
            color={i % 2 === 0 ? '#ef4444' : '#f8fafc'}
            height={0.8}
          />
        );
      })}
      {/* Inner barriers — blue/white */}
      {innerPoints.map((p, i) => {
        const next = innerPoints[(i + 1) % innerPoints.length];
        return (
          <BarrierSegment
            key={`inner-${i}`}
            x1={p.x} z1={p.z} x2={next.x} z2={next.z}
            color={i % 2 === 0 ? '#3b82f6' : '#f8fafc'}
            height={0.6}
          />
        );
      })}
    </group>
  );
}

// Boost pad
function BoostPad({ position }) {
  const meshRef = useRef();
  
  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Flat yellow strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Arrow indicator */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Finish line
function FinishLine() {
  return (
    <group position={[0, 0.02, -18]}>
      {/* Checkered pattern */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[(i - 3.5) * 1.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 2]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#ffffff' : '#0f172a'}
            emissive={i % 2 === 0 ? '#ffffff' : '#000000'}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      {/* Finish arch */}
      <mesh position={[-5, 2.5, 0]}>
        <boxGeometry args={[0.3, 5, 0.3]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[5, 2.5, 0]}>
        <boxGeometry args={[0.3, 5, 0.3]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[10.6, 0.4, 0.4]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// Checkpoint marker (subtle)
function CheckpointMarker({ position, index, isNext }) {
  return (
    <mesh position={[position.x, 0.1, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 2, 16]} />
      <meshStandardMaterial
        color={isNext ? '#10b981' : '#475569'}
        emissive={isNext ? '#10b981' : '#1e293b'}
        emissiveIntensity={isNext ? 1.5 : 0.2}
        transparent
        opacity={isNext ? 0.6 : 0.15}
      />
    </mesh>
  );
}

// Simple tree decoration
function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#92400e" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
}

// AI opponent kart
function AIKart({ id, color }) {
  const meshRef = useRef();
  const aiKarts = useKartStore(s => s.aiKarts);
  const raceStarted = useKartStore(s => s.raceStarted);

  useFrame(() => {
    if (!meshRef.current || !raceStarted) return;
    const ai = aiKarts.find(a => a.id === id);
    if (!ai) return;

    // Place on oval track based on progress
    const t = ai.progress * Math.PI * 2;
    const trackRadius = 17;
    const x = Math.sin(t) * trackRadius;
    const z = -Math.cos(t) * trackRadius;
    
    meshRef.current.position.set(x, 0.4, z);
    meshRef.current.rotation.y = t + Math.PI;
  });

  return (
    <group ref={meshRef} position={[0, 0.4, -15]}>
      {/* AI kart body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.4, 1.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.25, -0.1]}>
        <boxGeometry args={[0.6, 0.25, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Wheels */}
      {[[0.55, -0.15, 0.55], [-0.55, -0.15, 0.55], [0.55, -0.15, -0.55], [-0.55, -0.15, -0.55]].map((p, i) => (
        <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.15, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
}

// Track surface (oval ring)
function TrackSurface() {
  return (
    <group>
      {/* Asphalt track ring — using multiple plane segments */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[11, 23, 64]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Track center lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[16.8, 17.2, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function World() {
  const checkpoints = useKartStore(s => s.checkpoints);
  const nextCheckpoint = useKartStore(s => s.nextCheckpoint);
  const aiKarts = useKartStore(s => s.aiKarts);

  // Tree positions around the track
  const trees = useMemo(() => {
    const t = [];
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const r = 28 + Math.random() * 8;
      t.push([Math.sin(angle) * r, 0, -Math.cos(angle) * r]);
    }
    // Inner trees
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 5 + Math.random() * 4;
      t.push([Math.sin(angle) * r, 0, -Math.cos(angle) * r]);
    }
    return t;
  }, []);

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[30, 50, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
      />
      <hemisphereLight args={['#87ceeb', '#3d5c3a', 0.5]} />

      {/* Sky color via fog */}
      <fog attach="fog" args={['#87ceeb', 50, 120]} />

      {/* Ground */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[60, 0.1, 60]} position={[0, -0.1, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#22c55e" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* Track surface */}
      <TrackSurface />

      {/* Track Barriers */}
      <TrackBarriers />

      {/* Finish line */}
      <FinishLine />

      {/* Boost pads */}
      <BoostPad position={[14, 0.05, 0]} />
      <BoostPad position={[-14, 0.05, 0]} />

      {/* Checkpoint markers */}
      {checkpoints.map((cp, i) => (
        <CheckpointMarker
          key={i}
          position={cp}
          index={i}
          isNext={i === nextCheckpoint}
        />
      ))}

      {/* AI Karts */}
      {aiKarts.map(ai => (
        <AIKart key={ai.id} id={ai.id} color={ai.color} />
      ))}

      {/* Trees */}
      {trees.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}

      {/* Decorative objects — grandstand */}
      <group position={[0, 0, -30]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[12, 3, 3]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[14, 0.3, 4]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} />
        </mesh>
        {/* Crowd (colorful boxes) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[(i - 5.5) * 1, 3, -0.5]}>
            <boxGeometry args={[0.4, 0.8, 0.4]} />
            <meshStandardMaterial
              color={['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'][i % 6]}
            />
          </mesh>
        ))}
      </group>

      {/* Small hills in the background */}
      <mesh position={[40, 2, -40]} castShadow>
        <sphereGeometry args={[8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#16a34a" roughness={0.9} />
      </mesh>
      <mesh position={[-35, 1.5, 40]} castShadow>
        <sphereGeometry args={[6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
    </group>
  );
}
