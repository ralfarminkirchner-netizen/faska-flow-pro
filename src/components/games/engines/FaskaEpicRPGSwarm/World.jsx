import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useRPGStore from './GameLogic';

const WORLD_SIZE = 50;
const TREE_COUNT = 40;
const FLOWER_COUNT = 60;
const CHEST_COUNT = 8;
const MAX_ENEMIES = 12;

// ---- Tree ----
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 3, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial
          color="#16a34a"
          emissive="#15803d"
          emissiveIntensity={0.1}
          roughness={0.8}
        />
      </mesh>
      {/* Second canopy layer */}
      <mesh position={[0.3, 4.2, 0.2]} castShadow>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#16a34a"
          emissiveIntensity={0.1}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

// ---- Flower ----
function Flower({ position, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 4]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      {/* Petals */}
      <mesh ref={meshRef} position={[0, 0.25, 0]}>
        <coneGeometry args={[0.08, 0.06, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// ---- Treasure Chest ----
function TreasureChest({ position, id }) {
  const meshRef = useRef();
  const store = useRPGStore;
  const collected = useRef(false);

  useFrame((state) => {
    if (meshRef.current && !collected.current) {
      meshRef.current.position.y = 0.4 + Math.sin(state.clock.elapsedTime * 3 + id.charCodeAt(0)) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      {/* Chest body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.4, 0.4]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Chest lid */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.62, 0.08, 0.42]} />
        <meshStandardMaterial
          color="#eab308"
          emissive="#f59e0b"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Lock */}
      <mesh position={[0, 0.1, 0.21]}>
        <boxGeometry args={[0.08, 0.12, 0.02]} />
        <meshStandardMaterial color="#854d0e" metalness={0.9} />
      </mesh>
      {/* Glow */}
      <pointLight color="#f59e0b" intensity={2} distance={5} />
    </group>
  );
}

// ---- Enemy Component ----
function Enemy({ data }) {
  const meshRef = useRef();
  const store = useRPGStore;
  const moveAngleRef = useRef(Math.random() * Math.PI * 2);
  const moveTimerRef = useRef(0);

  useFrame((state, delta) => {
    const gameState = store.getState();
    if (!gameState.isPlaying || gameState.isPaused || !meshRef.current) return;
    if (data.stunTimer > 0) return;

    const dt = Math.min(delta, 0.05);

    // Simple AI: wander + chase player when nearby
    moveTimerRef.current += dt;
    if (moveTimerRef.current > 2 + Math.random() * 2) {
      moveTimerRef.current = 0;
      moveAngleRef.current = Math.random() * Math.PI * 2;
    }

    const speed = data.speed * dt;
    let dx = Math.cos(moveAngleRef.current) * speed;
    let dz = Math.sin(moveAngleRef.current) * speed;

    // Update position in store for collision detection
    const newX = THREE.MathUtils.clamp(data.position[0] + dx, -WORLD_SIZE + 2, WORLD_SIZE - 2);
    const newZ = THREE.MathUtils.clamp(data.position[2] + dz, -WORLD_SIZE + 2, WORLD_SIZE - 2);

    // Update enemy position in store
    store.setState((prev) => ({
      enemies: prev.enemies.map((e) =>
        e.id === data.id
          ? { ...e, position: [newX, data.position[1], newZ] }
          : e
      ),
    }));

    // Visuals
    meshRef.current.position.set(newX, data.position[1], newZ);

    // Bounce animation
    const bounce = Math.sin(state.clock.elapsedTime * 5 + data.id.charCodeAt(6)) * 0.15;
    meshRef.current.position.y += bounce;

    // Hit flash
    if (data.hitFlash > 0) {
      meshRef.current.children[0].material.emissiveIntensity = 3;
    } else {
      meshRef.current.children[0].material.emissiveIntensity = 0.3;
    }
  });

  const getEnemyGeometry = () => {
    switch (data.type) {
      case 'slime':
        return (
          <group>
            <mesh castShadow>
              <sphereGeometry args={[0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={data.color}
                emissive={data.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* Eyes */}
            <mesh position={[-0.15, 0.3, 0.3]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0.15, 0.3, 0.3]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[-0.15, 0.3, 0.35]}>
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0.15, 0.3, 0.35]}>
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      case 'bat':
        return (
          <group>
            {/* Body */}
            <mesh castShadow>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial
                color={data.color}
                emissive={data.color}
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Wings */}
            <mesh position={[0.5, 0.1, 0]} rotation={[0, 0, -0.3]}>
              <planeGeometry args={[0.6, 0.3]} />
              <meshStandardMaterial
                color={data.color}
                emissive={data.color}
                emissiveIntensity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[-0.5, 0.1, 0]} rotation={[0, 0, 0.3]}>
              <planeGeometry args={[0.6, 0.3]} />
              <meshStandardMaterial
                color={data.color}
                emissive={data.color}
                emissiveIntensity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Eyes */}
            <mesh position={[-0.1, 0.1, 0.25]}>
              <sphereGeometry args={[0.06, 4, 4]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.1, 0.1, 0.25]}>
              <sphereGeometry args={[0.06, 4, 4]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>
          </group>
        );
      case 'wolf':
        return (
          <group>
            {/* Body */}
            <mesh castShadow>
              <capsuleGeometry args={[0.3, 0.5, 6, 12]} />
              <meshStandardMaterial
                color={data.color}
                emissive={data.color}
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.5, 0.3]}>
              <coneGeometry args={[0.2, 0.4, 6]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {/* Ears */}
            <mesh position={[-0.12, 0.65, 0.2]}>
              <coneGeometry args={[0.06, 0.15, 4]} />
              <meshStandardMaterial color={data.color} />
            </mesh>
            <mesh position={[0.12, 0.65, 0.2]}>
              <coneGeometry args={[0.06, 0.15, 4]} />
              <meshStandardMaterial color={data.color} />
            </mesh>
            {/* Eyes */}
            <mesh position={[-0.08, 0.5, 0.45]}>
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0.08, 0.5, 0.45]}>
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.3} />
          </mesh>
        );
    }
  };

  // HP bar
  const hpRatio = data.hp / data.maxHp;

  return (
    <group ref={meshRef} position={data.position}>
      {getEnemyGeometry()}
      {/* HP bar */}
      <group position={[0, data.type === 'bat' ? 0.8 : 1.0, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 0.06]} />
          <meshBasicMaterial color="#1e1b4b" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-(0.7 * (1 - hpRatio)) / 2, 0, 0.01]}>
          <planeGeometry args={[0.7 * hpRatio, 0.04]} />
          <meshBasicMaterial color={hpRatio > 0.5 ? '#22c55e' : '#ef4444'} />
        </mesh>
      </group>
      {/* Shadow */}
      <mesh position={[0, -data.position[1] + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// ---- Dead Enemy Effect ----
function DeadEnemy({ data }) {
  const meshRef = useRef();
  const elapsed = (Date.now() - data.deathTime) / 1000;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.multiplyScalar(0.95);
      meshRef.current.rotation.z += 0.1;
      meshRef.current.position.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={data.position}>
      <sphereGeometry args={[0.3, 6, 6]} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={2}
        transparent
        opacity={Math.max(0, 1 - elapsed * 2)}
      />
    </mesh>
  );
}

// ---- Magic Projectile ----
function MagicProjectile({ data }) {
  const meshRef = useRef();
  const store = useRPGStore;
  const lifeRef = useRef(data.life);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    lifeRef.current -= delta;
    if (lifeRef.current <= 0) {
      store.getState().removeProjectile(data.id);
      return;
    }

    meshRef.current.position.x += data.direction[0] * delta;
    meshRef.current.position.y += data.direction[1] * delta;
    meshRef.current.position.z += data.direction[2] * delta;
    meshRef.current.rotation.z += delta * 10;

    // Check collision with enemies
    const pos = meshRef.current.position;
    const enemies = store.getState().enemies;
    for (const enemy of enemies) {
      const dx = enemy.position[0] - pos.x;
      const dz = enemy.position[2] - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 1.0) {
        store.getState().damageEnemy(enemy.id, data.damage, enemy.position);
        store.getState().removeProjectile(data.id);
        break;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={data.position}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial
        color="#c084fc"
        emissive="#a855f7"
        emissiveIntensity={5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ---- NPC Companion (whichever character you're NOT playing) ----
function NPCCompanion({ character, position }) {
  const meshRef = useRef();
  const isLuna = character === 'luna';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      {/* Speech bubble */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[1.5, 0.4]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>

      {isLuna ? (
        <group>
          <mesh position={[0, 0.8, 0]} castShadow>
            <capsuleGeometry args={[0.3, 0.5, 6, 12]} />
            <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#d8b4fe" />
          </mesh>
          <mesh position={[-0.1, 1.8, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.5, 6]} />
            <meshStandardMaterial color="#e9d5ff" />
          </mesh>
          <mesh position={[0.1, 1.8, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.5, 6]} />
            <meshStandardMaterial color="#e9d5ff" />
          </mesh>
          {/* Idle particles */}
          <pointLight color="#c084fc" intensity={1} distance={4} />
        </group>
      ) : (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow>
            <capsuleGeometry args={[0.4, 0.6, 6, 12]} />
            <meshStandardMaterial color="#92400e" emissive="#78350f" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <sphereGeometry args={[0.32, 12, 12]} />
            <meshStandardMaterial color="#a16207" />
          </mesh>
          <mesh position={[-0.24, 1.9, 0]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.24, 1.9, 0]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <pointLight color="#f59e0b" intensity={1} distance={4} />
        </group>
      )}
    </group>
  );
}

// ---- Collectible Item ----
function Collectible({ data }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    }
  });

  const color = data.type === 'health' ? '#22c55e' : data.type === 'potion' ? '#a855f7' : '#fbbf24';

  return (
    <group ref={meshRef} position={data.position}>
      <mesh>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <pointLight color={color} intensity={1.5} distance={4} />
    </group>
  );
}

// ---- Enemy Spawner & Game Loop ----
function GameLoop() {
  const store = useRPGStore;
  const spawnTimerRef = useRef(0);
  const collectibleTimerRef = useRef(0);

  useFrame((_, delta) => {
    const state = store.getState();
    if (!state.isPlaying || state.isPaused) return;

    const dt = Math.min(delta, 0.05);

    // Spawn enemies
    spawnTimerRef.current += dt;
    const spawnRate = Math.max(2, 6 - state.waveNumber * 0.3);
    if (spawnTimerRef.current > spawnRate && state.enemies.length < MAX_ENEMIES) {
      spawnTimerRef.current = 0;

      // Pick random enemy type based on level
      const types = ['slime'];
      if (state.playerLevel >= 2) types.push('bat');
      if (state.playerLevel >= 3) types.push('wolf');
      const type = types[Math.floor(Math.random() * types.length)];

      // Spawn at random position away from center
      const angle = Math.random() * Math.PI * 2;
      const dist = 15 + Math.random() * 25;
      const y = type === 'bat' ? 1.5 : 0.5;
      const position = [Math.cos(angle) * dist, y, Math.sin(angle) * dist];

      store.getState().spawnEnemy(type, position);
    }

    // Spawn collectibles
    collectibleTimerRef.current += dt;
    if (collectibleTimerRef.current > 8 && state.collectibles.length < 5) {
      collectibleTimerRef.current = 0;
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * 30;
      const types = ['health', 'potion', 'star'];
      const type = types[Math.floor(Math.random() * types.length)];
      const id = `collect_${Date.now()}`;
      store.setState((prev) => ({
        collectibles: [
          ...prev.collectibles,
          { id, type, position: [Math.cos(angle) * dist, 0.5, Math.sin(angle) * dist] },
        ],
      }));
    }

    // Enemy-player collision (damage)
    // Using a simple distance check to player position (0,0,0 as approximation)
    // The actual position is managed through the RigidBody in Player.jsx
  });

  return null;
}

// ---- Damage Number ----
function DamageNumber({ data }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y += 0.03;
    }
  });

  return (
    <group ref={meshRef} position={[data.position[0], data.position[1] + 1.5, data.position[2]]}>
      <sprite scale={[0.8, 0.4, 1]}>
        <spriteMaterial
          color={data.color}
          transparent
          opacity={Math.max(0, 1 - data.time)}
        />
      </sprite>
    </group>
  );
}

// ---- Main World Component ----
export default function World() {
  const store = useRPGStore;

  // Generate static world elements
  const trees = useMemo(() => {
    const result = [];
    for (let i = 0; i < TREE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * (WORLD_SIZE - 10);
      result.push({
        position: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        scale: 0.6 + Math.random() * 0.8,
      });
    }
    return result;
  }, []);

  const flowers = useMemo(() => {
    const colors = ['#ef4444', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#22c55e'];
    const result = [];
    for (let i = 0; i < FLOWER_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 3 + Math.random() * (WORLD_SIZE - 5);
      result.push({
        position: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return result;
  }, []);

  const chests = useMemo(() => {
    const result = [];
    for (let i = 0; i < CHEST_COUNT; i++) {
      const angle = (i / CHEST_COUNT) * Math.PI * 2;
      const dist = 10 + Math.random() * 25;
      result.push({
        id: `chest_${i}`,
        position: [Math.cos(angle) * dist, 0.3, Math.sin(angle) * dist],
      });
    }
    return result;
  }, []);

  // NPC companion position
  const npcPos = useMemo(() => [5, 0, 5], []);

  // Subscribe to reactive state
  const enemies = useRPGStore((s) => s.enemies);
  const deadEnemies = useRPGStore((s) => s.deadEnemies);
  const projectiles = useRPGStore((s) => s.projectiles);
  const collectibles = useRPGStore((s) => s.collectibles);
  const damageNumbers = useRPGStore((s) => s.damageNumbers);
  const currentCharacter = useRPGStore((s) => s.currentCharacter);

  const npcCharacter = currentCharacter === 'luna' ? 'bruno' : 'luna';

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#fef3c7" />
      <directionalLight
        position={[30, 50, 20]}
        intensity={1.2}
        color="#fef3c7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight
        position={[-20, 30, -10]}
        intensity={0.3}
        color="#93c5fd"
      />
      <hemisphereLight args={['#87ceeb', '#15803d', 0.3]} />

      {/* Sky color via fog */}
      <fog attach="fog" args={['#87ceeb', 40, 90]} />
      <color attach="background" args={['#87ceeb']} />

      {/* Ground */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[WORLD_SIZE, 0.5, WORLD_SIZE]} position={[0, -0.5, 0]} />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[WORLD_SIZE * 2, WORLD_SIZE * 2]} />
          <meshStandardMaterial
            color="#22c55e"
            roughness={0.9}
          />
        </mesh>
      </RigidBody>

      {/* Ground details — darker grass patches */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * WORLD_SIZE * 0.8;
        return (
          <mesh
            key={`grass_${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[Math.cos(angle) * dist, 0.01, Math.sin(angle) * dist]}
          >
            <circleGeometry args={[2 + Math.random() * 4, 8]} />
            <meshStandardMaterial
              color="#16a34a"
              roughness={1}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}

      {/* Path — stone road */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={`path_${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[i * 3 - 30, 0.02, Math.sin(i * 0.5) * 3]}
        >
          <circleGeometry args={[0.8 + Math.random() * 0.5, 6]} />
          <meshStandardMaterial color="#a8a29e" roughness={1} />
        </mesh>
      ))}

      {/* Trees */}
      {trees.map((tree, i) => (
        <Tree key={`tree_${i}`} position={tree.position} scale={tree.scale} />
      ))}

      {/* Flowers */}
      {flowers.map((flower, i) => (
        <Flower key={`flower_${i}`} position={flower.position} color={flower.color} />
      ))}

      {/* Treasure Chests */}
      {chests.map((chest) => (
        <TreasureChest key={chest.id} id={chest.id} position={chest.position} />
      ))}

      {/* NPC Companion */}
      <NPCCompanion character={npcCharacter} position={npcPos} />

      {/* Enemies */}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} data={enemy} />
      ))}

      {/* Dead enemy effects */}
      {deadEnemies.map((enemy) => (
        <DeadEnemy key={`dead_${enemy.id}`} data={enemy} />
      ))}

      {/* Magic projectiles */}
      {projectiles.map((proj) => (
        <MagicProjectile key={proj.id} data={proj} />
      ))}

      {/* Collectibles */}
      {collectibles.map((item) => (
        <Collectible key={item.id} data={item} />
      ))}

      {/* Damage numbers */}
      {damageNumbers.map((dmg) => (
        <DamageNumber key={dmg.id} data={dmg} />
      ))}

      {/* World boundary walls (invisible) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[WORLD_SIZE, 10, 0.5]} position={[0, 5, WORLD_SIZE]} />
        <CuboidCollider args={[WORLD_SIZE, 10, 0.5]} position={[0, 5, -WORLD_SIZE]} />
        <CuboidCollider args={[0.5, 10, WORLD_SIZE]} position={[WORLD_SIZE, 5, 0]} />
        <CuboidCollider args={[0.5, 10, WORLD_SIZE]} position={[-WORLD_SIZE, 5, 0]} />
      </RigidBody>

      {/* Game loop (enemy spawning, collectible spawning) */}
      <GameLoop />
    </>
  );
}
