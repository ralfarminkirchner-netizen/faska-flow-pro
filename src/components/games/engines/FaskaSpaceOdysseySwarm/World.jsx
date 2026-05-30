import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier';
import { Stars, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import useSpaceStore from './GameLogic';

const STAR_COUNT = 30;
const PLANET_COUNT = 8;
const ASTEROID_COUNT = 25;
const STATION_COUNT = 3;
const SPAWN_RADIUS = 150;

function randomSpherePoint(radius) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * (0.3 + Math.random() * 0.7);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}

// ---- Collectible Star ----
function CollectibleStar({ position, id }) {
  const meshRef = useRef();
  const store = useSpaceStore;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + id) * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={() => {}}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      <pointLight color="#fbbf24" intensity={3} distance={8} />
    </group>
  );
}

// ---- Planet ----
const PLANET_CONFIGS = [
  { color: '#ef4444', emissive: '#dc2626', size: 8, hasRing: true, ringColor: '#fbbf24' },
  { color: '#3b82f6', emissive: '#2563eb', size: 10, hasRing: false },
  { color: '#22c55e', emissive: '#16a34a', size: 6, hasRing: true, ringColor: '#86efac' },
  { color: '#a855f7', emissive: '#9333ea', size: 12, hasRing: false },
  { color: '#f97316', emissive: '#ea580c', size: 7, hasRing: true, ringColor: '#fdba74' },
  { color: '#ec4899', emissive: '#db2777', size: 9, hasRing: false },
  { color: '#06b6d4', emissive: '#0891b2', size: 11, hasRing: true, ringColor: '#67e8f9' },
  { color: '#eab308', emissive: '#ca8a04', size: 5, hasRing: false },
];

function Planet({ position, config, id }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[config.size, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[config.size * 1.05, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ring */}
      {config.hasRing && (
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[config.size * 1.6, 0.4, 8, 64]} />
          <meshStandardMaterial
            color={config.ringColor}
            emissive={config.ringColor}
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      )}

      {/* Planet light */}
      <pointLight color={config.emissive} intensity={2} distance={config.size * 5} />
    </group>
  );
}

// ---- Asteroid ----
function Asteroid({ position, id, size }) {
  const meshRef = useRef();
  const rotSpeed = useMemo(() => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: (Math.random() - 0.5) * 2,
  }), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotSpeed.x * delta;
      meshRef.current.rotation.y += rotSpeed.y * delta;
      meshRef.current.rotation.z += rotSpeed.z * delta;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <dodecahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.9}
          metalness={0.1}
          emissive="#44403c"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Surface details */}
      <mesh position={[size * 0.3, size * 0.2, 0]}>
        <dodecahedronGeometry args={[size * 0.4, 0]} />
        <meshStandardMaterial color="#57534e" roughness={1} />
      </mesh>
    </group>
  );
}

// ---- Space Station ----
function SpaceStation({ position }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Central hub */}
      <mesh castShadow>
        <cylinderGeometry args={[2, 2, 1, 8]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.9}
          roughness={0.1}
          emissive="#64748b"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 0.5, 8, 32]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.8}
          roughness={0.2}
          emissive="#94a3b8"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Spokes */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5]} rotation={[0, angle, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 5, 4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Solar panels */}
      {[1, -1].map((side, i) => (
        <mesh key={`panel_${i}`} position={[side * 7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.05, 4, 2]} />
          <meshStandardMaterial
            color="#1e3a5f"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Lights */}
      <pointLight color="#3b82f6" intensity={3} distance={15} />
      <pointLight color="#ef4444" intensity={1} distance={8} position={[0, 1.5, 0]} />
    </group>
  );
}

// ---- Nebula Clouds ----
function NebulaClouds() {
  const clouds = useMemo(() => {
    const result = [];
    for (let i = 0; i < 20; i++) {
      result.push({
        position: randomSpherePoint(100 + Math.random() * 80),
        scale: 15 + Math.random() * 30,
        color: ['#7c3aed', '#ec4899', '#06b6d4', '#a855f7', '#3b82f6'][Math.floor(Math.random() * 5)],
        opacity: 0.03 + Math.random() * 0.06,
      });
    }
    return result;
  }, []);

  return (
    <>
      {clouds.map((cloud, i) => (
        <mesh key={`nebula_${i}`} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 8]} />
          <meshStandardMaterial
            color={cloud.color}
            emissive={cloud.color}
            emissiveIntensity={0.3}
            transparent
            opacity={cloud.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

// ---- Projectile ----
function Projectile({ data }) {
  const meshRef = useRef();
  const store = useSpaceStore;
  const lifeRef = useRef(data.life);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    lifeRef.current -= delta;
    if (lifeRef.current <= 0) {
      store.getState().removeProjectile(data.id);
      return;
    }

    meshRef.current.position.x += data.direction[0] * delta;
    meshRef.current.position.y += data.direction[1] * delta;
    meshRef.current.position.z += data.direction[2] * delta;

    // Check collision with asteroids
    const pos = meshRef.current.position;
    const asteroids = store.getState().asteroids;
    asteroids.forEach((ast) => {
      const dx = ast.position[0] - pos.x;
      const dy = ast.position[1] - pos.y;
      const dz = ast.position[2] - pos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < ast.size + 0.5) {
        store.getState().destroyAsteroid(ast.id);
        store.getState().addExplosion(ast.position);
        store.getState().removeProjectile(data.id);
      }
    });
  });

  return (
    <mesh ref={meshRef} position={data.position}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#06b6d4"
        emissiveIntensity={5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ---- Explosion ----
function Explosion({ data }) {
  const groupRef = useRef();
  const scaleRef = useRef(0.1);

  useFrame((_, delta) => {
    if (groupRef.current) {
      scaleRef.current += delta * 8;
      groupRef.current.scale.setScalar(scaleRef.current);
      groupRef.current.children.forEach((child) => {
        if (child.material) {
          child.material.opacity = Math.max(0, 1 - scaleRef.current / 4);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={data.position}>
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={5}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={3}
          transparent
          opacity={0.5}
        />
      </mesh>
      <pointLight color="#f97316" intensity={10} distance={20} />
    </group>
  );
}

// ---- Collision Detection System ----
function CollisionSystem() {
  const store = useSpaceStore;

  useFrame(() => {
    const state = store.getState();
    if (!state.isPlaying || state.isPaused) return;

    // This is handled by the orchestrator with player position refs
  });

  return null;
}

// ---- Main World Component ----
export default function World({ playerRef }) {
  const store = useSpaceStore;
  const { camera } = useThree();
  const spawnTimerRef = useRef(0);

  // Generate initial world objects
  const starPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      positions.push({
        id: `star_${i}`,
        position: randomSpherePoint(SPAWN_RADIUS * 0.6),
      });
    }
    return positions;
  }, []);

  const planetPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < PLANET_COUNT; i++) {
      positions.push({
        id: `planet_${i}`,
        position: randomSpherePoint(SPAWN_RADIUS * 0.8),
        config: PLANET_CONFIGS[i % PLANET_CONFIGS.length],
      });
    }
    return positions;
  }, []);

  const asteroidData = useMemo(() => {
    const data = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const pos = randomSpherePoint(SPAWN_RADIUS * 0.5);
      const size = 0.5 + Math.random() * 2;
      data.push({
        id: `asteroid_${i}`,
        position: pos,
        size,
      });
    }
    return data;
  }, []);

  // Set up initial asteroids in store
  useEffect(() => {
    useSpaceStore.setState({ asteroids: asteroidData });
  }, [asteroidData]);

  const stationPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < STATION_COUNT; i++) {
      positions.push(randomSpherePoint(SPAWN_RADIUS * 0.4));
    }
    return positions;
  }, []);

  // Collision detection + star collection via proximity
  useFrame((state, delta) => {
    const gameState = store.getState();
    if (!gameState.isPlaying || gameState.isPaused) return;

    // Respawn asteroids periodically
    spawnTimerRef.current += delta;
    if (spawnTimerRef.current > 5 && gameState.asteroids.length < ASTEROID_COUNT) {
      spawnTimerRef.current = 0;
      const newAsteroids = [];
      const needed = ASTEROID_COUNT - gameState.asteroids.length;
      for (let i = 0; i < Math.min(needed, 3); i++) {
        const pos = randomSpherePoint(SPAWN_RADIUS * 0.5);
        newAsteroids.push({
          id: `asteroid_${Date.now()}_${i}`,
          position: pos,
          size: 0.5 + Math.random() * 2,
        });
      }
      if (newAsteroids.length > 0) {
        store.setState({ asteroids: [...gameState.asteroids, ...newAsteroids] });
      }
    }
  });

  // Subscribe to store for dynamic rendering
  const projectiles = useSpaceStore((s) => s.projectiles);
  const explosions = useSpaceStore((s) => s.explosions);
  const asteroids = useSpaceStore((s) => s.asteroids);

  return (
    <>
      {/* Deep space background stars */}
      <Stars
        radius={250}
        depth={100}
        count={8000}
        factor={6}
        saturation={0.8}
        fade
        speed={0.5}
      />

      {/* Nebula clouds */}
      <NebulaClouds />

      {/* Ambient space lighting */}
      <ambientLight intensity={0.15} color="#4f46e5" />
      <directionalLight
        position={[100, 50, 100]}
        intensity={0.8}
        color="#fef3c7"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Secondary fill light */}
      <directionalLight
        position={[-50, -20, -50]}
        intensity={0.2}
        color="#7c3aed"
      />

      {/* Sun */}
      <mesh position={[200, 100, -200]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f97316"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight position={[200, 100, -200]} color="#fef3c7" intensity={5} distance={500} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#050510', 50, 300]} />

      {/* Collectible Stars */}
      {starPositions.map((star) => (
        <CollectibleStar key={star.id} id={star.id} position={star.position} />
      ))}

      {/* Planets */}
      {planetPositions.map((planet) => (
        <Planet key={planet.id} id={planet.id} position={planet.position} config={planet.config} />
      ))}

      {/* Asteroids */}
      {asteroids.map((asteroid) => (
        <Asteroid key={asteroid.id} id={asteroid.id} position={asteroid.position} size={asteroid.size} />
      ))}

      {/* Space Stations */}
      {stationPositions.map((pos, i) => (
        <SpaceStation key={`station_${i}`} position={pos} />
      ))}

      {/* Projectiles */}
      {projectiles.map((proj) => (
        <Projectile key={proj.id} data={proj} />
      ))}

      {/* Explosions */}
      {explosions.map((exp) => (
        <Explosion key={exp.id} data={exp} />
      ))}

      {/* Collision detection */}
      <CollisionSystem />
    </>
  );
}
