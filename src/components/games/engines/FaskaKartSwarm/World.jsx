import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useKartStore, {
  KART_APEX_GATES,
  KART_BOOST_PADS,
  KART_HAZARD_ZONES,
  KART_ITEM_BOXES,
  KART_LEARN_GATE_POSITIONS,
  KART_SHORTCUT_GATES,
  KART_STATIC_OIL_SLICKS,
} from './GameLogic';

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

function seededUnit(index, salt = 0) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createLabelTexture(text, color = '#f8fafc', background = 'rgba(15, 23, 42, 0.88)') {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = background;
  roundRect(ctx, 18, 22, 476, 148, 30);
  ctx.fill();
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.62)';
  ctx.lineWidth = 8;
  roundRect(ctx, 18, 22, 476, 148, 30);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = '900 66px Outfit, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 96, 430);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function FloatingLabel({ text, color = '#f8fafc', background, position = [0, 0, 0], scale = [3.5, 1.3, 1] }) {
  const labelRef = useRef();
  const texture = useMemo(() => createLabelTexture(text, color, background), [text, color, background]);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame(({ camera }) => {
    if (labelRef.current) {
      labelRef.current.lookAt(camera.position);
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={labelRef} position={position} scale={scale}>
      <planeGeometry args={[1, 0.38]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
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

function ItemBox({ position, index }) {
  const boxRef = useRef();

  useFrame((state, dt) => {
    if (!boxRef.current) return;
    boxRef.current.rotation.y += dt * 1.8;
    boxRef.current.position.y = 0.78 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.12;
  });

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.55, 24]} />
        <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={0.9} transparent opacity={0.58} />
      </mesh>
      <mesh ref={boxRef} position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#f59e0b"
          emissiveIntensity={0.78}
          metalness={0.25}
          roughness={0.32}
          transparent
          opacity={0.9}
        />
      </mesh>
      <FloatingLabel
        text="ITEM"
        color="#fef3c7"
        background="rgba(91, 33, 182, 0.88)"
        position={[0, 2.05, 0]}
        scale={[2.45, 0.95, 1]}
      />
    </group>
  );
}

function OilSlick({ position, dropped = false }) {
  const ringRef = useRef();

  useFrame((_, dt) => {
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.65;
  });

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.15, 28]} />
        <meshStandardMaterial color="#020617" roughness={0.34} transparent opacity={dropped ? 0.86 : 0.68} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[1.18, 1.38, 28]} />
        <meshStandardMaterial color="#94a3b8" emissive="#334155" emissiveIntensity={0.7} transparent opacity={0.52} />
      </mesh>
    </group>
  );
}

function LearnGate({ position, label, lane }) {
  const color = lane === 0 ? '#06b6d4' : lane < 0 ? '#f59e0b' : '#10b981';

  return (
    <group position={position}>
      <mesh position={[-1.18, 1.12, 0]} castShadow>
        <boxGeometry args={[0.2, 2.2, 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} />
      </mesh>
      <mesh position={[1.18, 1.12, 0]} castShadow>
        <boxGeometry args={[0.2, 2.2, 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} />
      </mesh>
      <mesh position={[0, 2.25, 0]} castShadow>
        <boxGeometry args={[2.6, 0.2, 0.24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[2.35, 2.35]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.42} transparent opacity={0.28} />
      </mesh>
      <FloatingLabel
        text={label}
        color="#ffffff"
        background="rgba(15, 23, 42, 0.92)"
        position={[0, 3.02, 0]}
        scale={[3.25, 1.08, 1]}
      />
    </group>
  );
}

function ApexGate({ gate }) {
  const ringRef = useRef();
  const beaconRef = useRef();
  const color = gate.sector % 2 === 0 ? '#38bdf8' : '#facc15';

  useFrame((state, dt) => {
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.7;
    if (beaconRef.current) {
      beaconRef.current.position.y = 1.55 + Math.sin(state.clock.elapsedTime * 3.8 + gate.sector) * 0.12;
    }
  });

  return (
    <group position={[gate.x, 0.07, gate.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.28, 1.76, 36]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.95} transparent opacity={0.68} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[1.18, 28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} transparent opacity={0.18} />
      </mesh>
      <mesh ref={beaconRef} position={[0, 1.55, 0]} castShadow>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} roughness={0.24} />
      </mesh>
      <FloatingLabel
        text={gate.label}
        color="#020617"
        background={gate.sector % 2 === 0 ? 'rgba(125, 211, 252, 0.88)' : 'rgba(254, 240, 138, 0.9)'}
        position={[0, 2.24, 0]}
        scale={[1.9, 0.72, 1]}
      />
    </group>
  );
}

function ShortcutGate({ gate }) {
  const ringRef = useRef();
  const color = gate.sector % 2 === 0 ? '#22c55e' : '#f97316';

  useFrame((state, dt) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += dt * 1.15;
    ringRef.current.position.y = 0.13 + Math.sin(state.clock.elapsedTime * 4.4 + gate.sector) * 0.035;
  });

  return (
    <group position={[gate.x, 0.08, gate.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.48, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.25} transparent opacity={0.72} />
      </mesh>
      <mesh position={[-1.35, 0.72, 0]} castShadow>
        <coneGeometry args={[0.34, 1.35, 6]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.35, 0.72, 0]} castShadow>
        <coneGeometry args={[0.34, 1.35, 6]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, gate.sector * 0.55]} position={[0, 0.02, 0]}>
        <planeGeometry args={[2.8, 0.42]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} transparent opacity={0.42} />
      </mesh>
      <FloatingLabel
        text={gate.label}
        color="#ffffff"
        background="rgba(15, 23, 42, 0.9)"
        position={[0, 2.2, 0]}
        scale={[2.45, 0.86, 1]}
      />
    </group>
  );
}

function HazardZone({ hazard }) {
  const ringRef = useRef();

  useFrame((state, dt) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += dt * (hazard.type === 'spark' ? 1.8 : 0.55);
    ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3.6) * 0.035);
  });

  return (
    <group position={[hazard.x, 0.045, hazard.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[hazard.radius, 34]} />
        <meshStandardMaterial color={hazard.color} emissive={hazard.color} emissiveIntensity={0.28} transparent opacity={0.38} roughness={0.88} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[hazard.radius * 0.72, hazard.radius * 0.95, 36]} />
        <meshStandardMaterial color="#f8fafc" emissive={hazard.color} emissiveIntensity={0.8} transparent opacity={0.36} />
      </mesh>
      <FloatingLabel
        text={hazard.label}
        color="#ffffff"
        background="rgba(2, 6, 23, 0.86)"
        position={[0, 1.64, 0]}
        scale={[2.2, 0.76, 1]}
      />
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
      <mesh position={[-5.9, 0.72, 0]} castShadow>
        <boxGeometry args={[0.5, 1.4, 0.5]} />
        <meshStandardMaterial color="#7c3aed" emissive="#4c1d95" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[5.9, 0.72, 0]} castShadow>
        <boxGeometry args={[0.5, 1.4, 0.5]} />
        <meshStandardMaterial color="#7c3aed" emissive="#4c1d95" emissiveIntensity={0.55} />
      </mesh>
    </group>
  );
}

// Checkpoint marker (subtle)
function CheckpointMarker({ position, isNext }) {
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
      {KART_APEX_GATES.map((gate, index) => (
        <mesh
          key={`line-${gate.id}`}
          rotation={[-Math.PI / 2, 0, index % 2 === 0 ? 0.42 : -0.38]}
          position={[gate.x * 0.97, 0.035, gate.z * 0.97]}
        >
          <planeGeometry args={[3.8, 0.22]} />
          <meshStandardMaterial color="#e2e8f0" emissive="#38bdf8" emissiveIntensity={0.28} transparent opacity={0.34} />
        </mesh>
      ))}
    </group>
  );
}

export default function World() {
  const checkpoints = useKartStore(s => s.checkpoints);
  const nextCheckpoint = useKartStore(s => s.nextCheckpoint);
  const aiKarts = useKartStore(s => s.aiKarts);
  const mode = useKartStore(s => s.mode);
  const learnGateCooldown = useKartStore(s => s.learnGateCooldown);
  const learnGateTask = useKartStore(s => s.getCurrentLearnGate());
  const droppedOils = useKartStore(s => s.droppedOils);

  // Tree positions around the track
  const trees = useMemo(() => {
    const t = [];
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const r = 28 + seededUnit(i, 1) * 8;
      t.push([Math.sin(angle) * r, 0, -Math.cos(angle) * r]);
    }
    // Inner trees
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 5 + seededUnit(i, 2) * 4;
      t.push([Math.sin(angle) * r, 0, -Math.cos(angle) * r]);
    }
    return t;
  }, []);

  return (
    <>
      <color attach="background" args={['#8bd3ff']} />
      <fog attach="fog" args={['#87ceeb', 50, 120]} />
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
      {KART_BOOST_PADS.map((pad, i) => (
        <BoostPad key={`boost-${i}`} position={[pad.x, 0.05, pad.z]} />
      ))}

      {KART_ITEM_BOXES.map((box, i) => (
        <ItemBox key={`item-${i}`} position={[box.x, 0, box.z]} index={i} />
      ))}

      {KART_STATIC_OIL_SLICKS.map((oil) => (
        <OilSlick key={oil.id} position={[oil.x, 0.04, oil.z]} />
      ))}

      {KART_HAZARD_ZONES.map((hazard) => (
        <HazardZone key={hazard.id} hazard={hazard} />
      ))}

      {droppedOils.map((oil) => (
        <OilSlick key={oil.id} position={[oil.x, 0.055, oil.z]} dropped />
      ))}

      {KART_APEX_GATES.map((gate) => (
        <ApexGate key={gate.id} gate={gate} />
      ))}

      {KART_SHORTCUT_GATES.map((gate) => (
        <ShortcutGate key={gate.id} gate={gate} />
      ))}

      {mode === 'learn' && learnGateCooldown <= 0 && (
        <group>
          {KART_LEARN_GATE_POSITIONS.map((gate, i) => (
            <LearnGate
              key={`${learnGateTask.word}-${gate.lane}`}
              position={[gate.x, 0, gate.z]}
              label={learnGateTask.options[i]}
              lane={gate.lane}
            />
          ))}
        </group>
      )}

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
    </>
  );
}
