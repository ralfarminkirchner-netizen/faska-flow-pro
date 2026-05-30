import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import useFaskaSixtyFourStore from './GameLogic';

/**
 * Coin — A rotating golden torus that can be collected.
 */
function Coin({ id, position }) {
  const meshRef = useRef(null);
  const collected = useFaskaSixtyFourStore(s => s.coins.find(c => c.id === id)?.collected);
  const collectCoin = useFaskaSixtyFourStore(s => s.collectCoin);
  const playerPosition = useFaskaSixtyFourStore(s => s.playerPosition);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#f59e0b',
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  useFrame((state) => {
    if (collected || !meshRef.current) return;

    // Rotate
    meshRef.current.rotation.y = state.clock.elapsedTime * 3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;

    // Float up and down
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;

    // Check distance to player for collection
    const dx = playerPosition[0] - position[0];
    const dy = playerPosition[1] - position[1];
    const dz = playerPosition[2] - position[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < 1.8) {
      collectCoin(id);
    }
  });

  if (collected) return null;

  return (
    <group ref={meshRef} position={position}>
      {/* Main coin torus */}
      <mesh material={material} castShadow>
        <torusGeometry args={[0.35, 0.1, 12, 24]} />
      </mesh>
      {/* Inner star shape */}
      <mesh material={material}>
        <octahedronGeometry args={[0.15, 0]} />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.1} />
      </mesh>
      {/* Point light for glow */}
      <pointLight color="#fbbf24" intensity={0.5} distance={3} />
    </group>
  );
}

/**
 * Platform — A static or moving colored platform block.
 */
function Platform({ id, pos, size, color, type, moveAxis, moveRange, moveSpeed }) {
  const rbRef = useRef(null);
  const initialPos = useRef(pos);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    metalness: 0.1,
    roughness: 0.6,
  }), [color]);

  const topMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.15,
    metalness: 0.2,
    roughness: 0.5,
  }), [color]);

  useFrame((state) => {
    if (type !== 'moving' || !rbRef.current) return;

    try {
      const t = state.clock.elapsedTime * (moveSpeed || 1);
      const offset = Math.sin(t) * (moveRange || 3);
      const newPos = { x: initialPos.current[0], y: initialPos.current[1], z: initialPos.current[2] };

      if (moveAxis === 'x') newPos.x += offset;
      else if (moveAxis === 'y') newPos.y += offset;
      else if (moveAxis === 'z') newPos.z += offset;

      rbRef.current.setNextKinematicTranslation(newPos);
    } catch (err) {
      // Silently handle physics errors
    }
  });

  return (
    <RigidBody
      ref={rbRef}
      type={type === 'moving' ? 'kinematicPosition' : 'fixed'}
      position={pos}
      colliders={false}
    >
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />

      {/* Main platform body */}
      <mesh position={[0, 0, 0]} material={material} receiveShadow castShadow>
        <boxGeometry args={size} />
      </mesh>

      {/* Top accent layer */}
      <mesh position={[0, size[1] / 2 + 0.02, 0]} material={topMaterial} receiveShadow>
        <boxGeometry args={[size[0] - 0.1, 0.05, size[2] - 0.1]} />
      </mesh>

      {/* Edge glow strips */}
      <mesh position={[0, size[1] / 2 + 0.05, size[2] / 2 - 0.05]}>
        <boxGeometry args={[size[0], 0.03, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, size[1] / 2 + 0.05, -(size[2] / 2 - 0.05)]}>
        <boxGeometry args={[size[0], 0.03, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </RigidBody>
  );
}

/**
 * CoinParticles — Visual particle effects when coins are collected.
 */
function CoinParticles() {
  const particles = useFaskaSixtyFourStore(s => s.coinParticles);
  const updateParticles = useFaskaSixtyFourStore(s => s.updateParticles);

  useFrame((_, delta) => {
    updateParticles(delta);
  });

  return (
    <group>
      {particles.map(p => (
        <mesh key={p.id} position={p.pos}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={Math.max(0, p.life)}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Boundary walls — invisible walls to keep player in bounds.
 */
function Boundaries() {
  const wallSize = 40;
  const wallHeight = 30;

  return (
    <group>
      {/* North */}
      <RigidBody type="fixed" position={[0, wallHeight / 2, -wallSize]} colliders={false}>
        <CuboidCollider args={[wallSize, wallHeight, 0.5]} />
      </RigidBody>
      {/* South */}
      <RigidBody type="fixed" position={[0, wallHeight / 2, wallSize]} colliders={false}>
        <CuboidCollider args={[wallSize, wallHeight, 0.5]} />
      </RigidBody>
      {/* East */}
      <RigidBody type="fixed" position={[wallSize, wallHeight / 2, 0]} colliders={false}>
        <CuboidCollider args={[0.5, wallHeight, wallSize]} />
      </RigidBody>
      {/* West */}
      <RigidBody type="fixed" position={[-wallSize, wallHeight / 2, 0]} colliders={false}>
        <CuboidCollider args={[0.5, wallHeight, wallSize]} />
      </RigidBody>
    </group>
  );
}

/**
 * Decorative trees made of geometry primitives.
 */
function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 8]} />
        <meshStandardMaterial color="#92400e" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <coneGeometry args={[0.9, 1.2, 8]} />
        <meshStandardMaterial color="#16a34a" emissive="#15803d" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <coneGeometry args={[0.65, 1.0, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[0.4, 0.8, 8]} />
        <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

/**
 * World — The 3D environment with ground, platforms, coins, decorations, and sky.
 */
export default function World() {
  const platforms = useFaskaSixtyFourStore(s => s.platforms);
  const coins = useFaskaSixtyFourStore(s => s.coins);

  // Tree positions
  const treePositions = useMemo(() => [
    [-4, 0, -4], [4, 0, -3], [-3, 0, 4], [5, 0, 5],
    [-5, 0, 0], [3, 0, -5], [-2, 0, 5], [0, 0, -5.5],
  ], []);

  return (
    <group>
      {/* === Lighting === */}
      <ambientLight intensity={0.5} color="#b4c5e4" />
      <directionalLight
        position={[20, 30, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.001}
        color="#fff5e1"
      />
      <directionalLight position={[-10, 15, -10]} intensity={0.3} color="#a78bfa" />
      <hemisphereLight args={['#87ceeb', '#4ade80', 0.4]} />

      {/* === Sky & Atmosphere === */}
      <Sky
        sunPosition={[50, 30, 20]}
        turbidity={6}
        rayleigh={1.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} />
      <fog attach="fog" args={['#b4d4e8', 30, 80]} />

      {/* === Ground Plane (below the hub) === */}
      <RigidBody type="fixed" position={[0, -2, 0]} colliders={false}>
        <CuboidCollider args={[35, 1, 35]} />
        <mesh receiveShadow>
          <boxGeometry args={[70, 2, 70]} />
          <meshStandardMaterial color="#22c55e" roughness={0.9} />
        </mesh>
        {/* Grass texture pattern */}
        <mesh position={[0, 1.01, 0]} receiveShadow>
          <planeGeometry args={[70, 70, 20, 20]} />
          <meshStandardMaterial
            color="#4ade80"
            roughness={1}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </RigidBody>

      {/* === Water / Void below ground === */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#1d4ed8"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* === Platforms === */}
      {platforms.map(plat => (
        <Platform key={plat.id} {...plat} />
      ))}

      {/* === Coins === */}
      {coins.map(coin => (
        <Coin key={coin.id} id={coin.id} position={coin.pos} />
      ))}

      {/* === Decorative Trees on ground === */}
      {treePositions.map((pos, i) => (
        <Tree key={`tree_${i}`} position={pos} />
      ))}

      {/* === Coin Particles === */}
      <CoinParticles />

      {/* === Boundary Walls === */}
      <Boundaries />

      {/* === Decorative Floating Rings === */}
      <FloatingRing position={[0, 18, 0]} color="#a78bfa" size={3} />
      <FloatingRing position={[10, 12, -10]} color="#f472b6" size={2} />
      <FloatingRing position={[-12, 15, 8]} color="#38bdf8" size={2.5} />
    </group>
  );
}

/**
 * FloatingRing — Decorative rotating ring in the sky.
 */
function FloatingRing({ position, color, size }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.z = state.clock.elapsedTime * 0.5;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[size, 0.08, 16, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}
