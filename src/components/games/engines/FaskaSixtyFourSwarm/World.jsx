import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import useFaskaSixtyFourStore, {
  FASKA64_LAUNCH_PADS,
} from './GameLogic';

// ============================================================
// InstancedCoins — All coins in ONE draw call via InstancedMesh
// ============================================================
function InstancedCoins({ particleRef, shake }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const coins = useFaskaSixtyFourStore(s => s.coins);
  const playerPosition = useFaskaSixtyFourStore(s => s.playerPosition);
  const collectCoin = useFaskaSixtyFourStore(s => s.collectCoin);
  const coinCount = coins.length;

  // Gold emissive material — toneMapped=false for Bloom
  const coinMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#f59e0b',
    emissiveIntensity: 2.5,
    metalness: 0.9,
    roughness: 0.1,
    toneMapped: false,
  }), []);

  // Initialize instance transforms
  useEffect(() => {
    if (!meshRef.current) return;
    coins.forEach((coin, i) => {
      dummy.position.set(coin.pos[0], coin.pos[1], coin.pos[2]);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [coins, dummy]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const px = playerPosition[0];
    const py = playerPosition[1];
    const pz = playerPosition[2];

    for (let i = 0; i < coinCount; i++) {
      const coin = coins[i];
      if (coin.collected) {
        // Hide collected coins
        dummy.position.set(0, -200, 0);
        dummy.scale.setScalar(0);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      // Animate: rotate + bob
      const bobY = coin.pos[1] + Math.sin(t * 2.5 + coin.pos[0] * 0.7) * 0.25;
      dummy.position.set(coin.pos[0], bobY, coin.pos[2]);
      dummy.rotation.set(0, t * 3 + i * 0.5, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Proximity collection check
      const dx = px - coin.pos[0];
      const dy = py - coin.pos[1];
      const dz = pz - coin.pos[2];
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < 3.2) { // ~1.8 radius squared
        collectCoin(i);
        // Emit gold particles
        if (particleRef?.current) {
          particleRef.current.emit(
            { x: coin.pos[0], y: coin.pos[1], z: coin.pos[2] },
            { x: 0, y: 1, z: 0 },
            { count: 10, spread: 1.5, speed: 4, color: '#fbbf24' },
          );
        }
        if (shake) shake(0.2, 100);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, coinCount]} frustumCulled={false} castShadow>
      <torusGeometry args={[0.3, 0.1, 8, 16]} />
      <primitive object={coinMat} attach="material" />
    </instancedMesh>
  );
}

// ============================================================
// Platform — Static or bobbing platform with emissive edges
// ============================================================
function Platform({ pos, size, color, type, bobSpeed, bobRange }) {
  const rbRef = useRef(null);
  const origin = useRef(pos);

  const mainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    metalness: 0.15,
    roughness: 0.55,
  }), [color]);

  const edgeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.5,
    toneMapped: false,
  }), [color]);

  useFrame((state) => {
    if (type !== 'bobbing' || !rbRef.current) return;
    try {
      const t = state.clock.elapsedTime * (bobSpeed || 0.6);
      const offset = Math.sin(t) * (bobRange || 1.2);
      rbRef.current.setNextKinematicTranslation({
        x: origin.current[0],
        y: origin.current[1] + offset,
        z: origin.current[2],
      });
    } catch {
      // silently handle physics errors
    }
  });

  return (
    <RigidBody
      ref={rbRef}
      type={type === 'bobbing' ? 'kinematicPosition' : 'fixed'}
      position={pos}
      colliders={false}
    >
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />

      {/* Main body */}
      <mesh material={mainMat} receiveShadow castShadow>
        <boxGeometry args={size} />
      </mesh>

      {/* Emissive top accent */}
      <mesh position={[0, size[1] / 2 + 0.015, 0]} receiveShadow>
        <boxGeometry args={[size[0] - 0.1, 0.03, size[2] - 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Front edge glow strip */}
      <mesh position={[0, size[1] / 2 + 0.04, size[2] / 2 - 0.04]} material={edgeMat}>
        <boxGeometry args={[size[0], 0.025, 0.025]} />
      </mesh>
      {/* Back edge glow strip */}
      <mesh position={[0, size[1] / 2 + 0.04, -(size[2] / 2 - 0.04)]} material={edgeMat}>
        <boxGeometry args={[size[0], 0.025, 0.025]} />
      </mesh>
    </RigidBody>
  );
}

// ============================================================
// InstancedTrees — All trees batched into instanced meshes
// ============================================================
const TREE_POSITIONS = [
  [-5, 0, -5], [5, 0, -4], [-4, 0, 5], [6, 0, 6],
  [-6, 0, 1], [4, 0, -6], [-2, 0, 6], [1, 0, -7],
  [7, 0, 2], [-7, 0, -3],
];

function InstancedTrees() {
  const trunkRef = useRef(null);
  const foliageRef = useRef(null);
  const count = TREE_POSITIONS.length;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!trunkRef.current || !foliageRef.current) return;
    TREE_POSITIONS.forEach((pos, i) => {
      // Trunk
      dummy.position.set(pos[0], 0.8, pos[2]);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(i, dummy.matrix);

      // Foliage
      dummy.position.set(pos[0], 2.5, pos[2]);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      foliageRef.current.setMatrixAt(i, dummy.matrix);
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <>
      {/* Trunks */}
      <instancedMesh ref={trunkRef} args={[null, null, count]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.6, 6]} />
        <meshStandardMaterial color="#92400e" roughness={0.9} />
      </instancedMesh>

      {/* Foliage cones */}
      <instancedMesh ref={foliageRef} args={[null, null, count]} castShadow>
        <coneGeometry args={[0.85, 2.0, 6]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#16a34a"
          emissiveIntensity={0.3}
        />
      </instancedMesh>
    </>
  );
}

// ============================================================
// FloatingRings — Decorative rotating torus shapes
// ============================================================
function FloatingRing({ position, color, size }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.4;
    ref.current.rotation.z = state.clock.elapsedTime * 0.6;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[size, 0.07, 12, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        metalness={0.8}
        roughness={0.15}
        transparent
        opacity={0.75}
        toneMapped={false}
      />
    </mesh>
  );
}

function RedCoin({ coin, index }) {
  const ref = useRef();
  const redCoins = useFaskaSixtyFourStore(s => s.redCoins);
  const collected = redCoins[index]?.collected;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 3.8 + index * 0.5;
    ref.current.position.y = coin.pos[1] + Math.sin(state.clock.elapsedTime * 2.5 + index) * 0.16;
  });

  if (collected) return null;

  return (
    <group ref={ref} position={coin.pos}>
      <mesh castShadow>
        <torusGeometry args={[0.42, 0.13, 10, 24]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={2.2}
          metalness={0.82}
          roughness={0.16}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#ef4444" intensity={0.8} distance={4} />
    </group>
  );
}

function LaunchPad({ pad, index }) {
  const padRef = useRef();
  const launchesHit = useFaskaSixtyFourStore(s => s.launchesHit);
  const active = !launchesHit.includes(pad.id);

  useFrame((state) => {
    if (!padRef.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 5 + index) * 0.08;
    padRef.current.scale.set(pulse, 1, pulse);
  });

  return (
    <group position={pad.pos} ref={padRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.28, 36]} />
        <meshStandardMaterial
          color={active ? '#38bdf8' : '#475569'}
          emissive={active ? '#0891b2' : '#334155'}
          emissiveIntensity={active ? 1.8 : 0.5}
          transparent
          opacity={0.82}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.42, 0.9, 4]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive={active ? '#67e8f9' : '#64748b'}
          emissiveIntensity={active ? 1.8 : 0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function StuntRing({ ring, index }) {
  const ref = useRef();
  const stuntRings = useFaskaSixtyFourStore(s => s.stuntRings);
  const passed = stuntRings[index]?.passed;
  const color = ring.label === 'LEARN' ? '#22d3ee' : ring.label === 'DASH' ? '#a855f7' : '#fbbf24';

  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.8;
    ref.current.position.y = ring.pos[1] + Math.sin(state.clock.elapsedTime * 1.7 + index) * 0.18;
  });

  return (
    <group ref={ref} position={ring.pos}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ring.radius, 0.08, 12, 48]} />
        <meshStandardMaterial
          color={passed ? '#64748b' : color}
          emissive={passed ? '#334155' : color}
          emissiveIntensity={passed ? 0.45 : 2.1}
          transparent
          opacity={passed ? 0.28 : 0.86}
          toneMapped={false}
        />
      </mesh>
      {!passed && (
        <mesh>
          <octahedronGeometry args={[0.22]} />
          <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function StompEnemy({ enemy, index }) {
  const ref = useRef();
  const enemies = useFaskaSixtyFourStore(s => s.enemies);
  const defeated = enemies[index]?.defeated;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = enemy.pos[1] + Math.sin(state.clock.elapsedTime * 3.2 + index) * 0.12;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.35;
  });

  if (defeated) return null;

  return (
    <group ref={ref} position={enemy.pos}>
      <mesh castShadow>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial
          color={enemy.color}
          emissive={enemy.color}
          emissiveIntensity={0.9}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.18, 0.12, 0.45]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.18, 0.12, 0.45]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.2, 0.42, 8]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

// ============================================================
// Boundaries — Invisible walls
// ============================================================
function Boundaries() {
  const s = 35;
  const h = 25;
  return (
    <group>
      <RigidBody type="fixed" position={[0, h / 2, -s]} colliders={false}>
        <CuboidCollider args={[s, h, 0.5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, h / 2, s]} colliders={false}>
        <CuboidCollider args={[s, h, 0.5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[s, h / 2, 0]} colliders={false}>
        <CuboidCollider args={[0.5, h, s]} />
      </RigidBody>
      <RigidBody type="fixed" position={[-s, h / 2, 0]} colliders={false}>
        <CuboidCollider args={[0.5, h, s]} />
      </RigidBody>
    </group>
  );
}

// ============================================================
// World — Main world component
// ============================================================
export default function World({ particleRef, shake }) {
  const platforms = useFaskaSixtyFourStore(s => s.platforms);
  const redCoins = useFaskaSixtyFourStore(s => s.redCoins);
  const stuntRings = useFaskaSixtyFourStore(s => s.stuntRings);
  const enemies = useFaskaSixtyFourStore(s => s.enemies);

  return (
    <group>
      {/* === Lighting === */}
      <ambientLight intensity={0.3} color="#b4c5e4" />
      <directionalLight
        position={[20, 30, 15]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={70}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.001}
        color="#fff5e1"
      />
      {/* Cool fill light */}
      <directionalLight position={[-12, 15, -10]} intensity={0.25} color="#a78bfa" />
      <hemisphereLight args={['#87ceeb', '#4ade80', 0.35]} />
      {/* Colored accent point lights */}
      <pointLight position={[0, 15, 0]} color="#a855f7" intensity={2} distance={30} />
      <pointLight position={[10, 5, -10]} color="#06b6d4" intensity={1} distance={20} />

      {/* === Sky & Stars === */}
      <Sky
        sunPosition={[50, 30, 20]}
        turbidity={5}
        rayleigh={1.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <Stars radius={120} depth={60} count={2500} factor={4} saturation={0.6} />
      <fog attach="fog" args={['#b4d4e8', 35, 80]} />

      {/* === Ground === */}
      <RigidBody type="fixed" position={[0, -2, 0]} colliders={false}>
        <CuboidCollider args={[30, 1, 30]} />
        <mesh receiveShadow>
          <boxGeometry args={[60, 2, 60]} />
          <meshStandardMaterial color="#22c55e" roughness={0.85} />
        </mesh>
        {/* Subtle grid overlay */}
        <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60, 30, 30]} />
          <meshStandardMaterial
            color="#4ade80"
            roughness={1}
            transparent
            opacity={0.15}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
      </RigidBody>

      {/* === Water void below === */}
      <mesh position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#2563eb"
          emissiveIntensity={0.4}
          transparent
          opacity={0.65}
          metalness={0.8}
          roughness={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* === Platforms === */}
      {platforms.map(p => (
        <Platform key={p.id} {...p} />
      ))}

      {/* === Instanced Coins (single draw call) === */}
      <InstancedCoins particleRef={particleRef} shake={shake} />

      {/* === Mission collectibles and interaction set pieces === */}
      {redCoins.map((coin, index) => (
        <RedCoin key={coin.id} coin={coin} index={index} />
      ))}
      {FASKA64_LAUNCH_PADS.map((pad, index) => (
        <LaunchPad key={pad.id} pad={pad} index={index} />
      ))}
      {stuntRings.map((ring, index) => (
        <StuntRing key={ring.id} ring={ring} index={index} />
      ))}
      {enemies.map((enemy, index) => (
        <StompEnemy key={enemy.id} enemy={enemy} index={index} />
      ))}

      {/* === Instanced Trees === */}
      <InstancedTrees />

      {/* === Floating Decorative Rings === */}
      <FloatingRing position={[0, 18, 0]} color="#a78bfa" size={3} />
      <FloatingRing position={[10, 12, -10]} color="#f472b6" size={2} />
      <FloatingRing position={[-12, 15, 8]} color="#38bdf8" size={2.5} />
      <FloatingRing position={[5, 20, 5]} color="#fbbf24" size={1.5} />

      {/* === Boundaries === */}
      <Boundaries />
    </group>
  );
}
