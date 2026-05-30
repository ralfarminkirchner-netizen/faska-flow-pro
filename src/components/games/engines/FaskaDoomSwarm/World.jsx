import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useDoomStore from './GameLogic';

/**
 * Doom World — Dark corridors, enemies, pickups
 */

// Wall segment component
function Wall({ position, size, color = '#2a2a3a' }) {
  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </RigidBody>
  );
}

// Floor
function Floor() {
  return (
    <RigidBody type="fixed" position={[0, 0, 0]} colliders="cuboid">
      <mesh receiveShadow>
        <boxGeometry args={[60, 0.2, 60]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.8} />
      </mesh>
    </RigidBody>
  );
}

// Ceiling (visual only for atmosphere)
function Ceiling() {
  return (
    <mesh position={[0, 5, 0]}>
      <boxGeometry args={[60, 0.2, 60]} />
      <meshStandardMaterial
        color="#0f0f1a"
        metalness={0.6}
        roughness={0.9}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Enemy visual representation
function Enemy({ enemy }) {
  const meshRef = useRef();
  const bobPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || !enemy.alive) return;
      bobPhase.current += delta * 4;

      // Update position from store
      meshRef.current.position.set(
        enemy.position[0],
        enemy.position[1] + Math.sin(bobPhase.current) * 0.1,
        enemy.position[2]
      );
    } catch (e) {
      // Silent
    }
  });

  if (!enemy.alive) return null;

  const colors = {
    grunt: '#cc3333',
    tank: '#8844aa',
    runner: '#ffaa22',
  };
  const color = colors[enemy.type] || '#cc3333';
  const scale = enemy.type === 'tank' ? 1.3 : enemy.type === 'runner' ? 0.8 : 1.0;

  return (
    <group ref={meshRef} position={enemy.position}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.6 * scale, 1.2 * scale, 0.4 * scale]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.8 * scale, 0]}>
        <sphereGeometry args={[0.25 * scale, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.08 * scale, 0.85 * scale, 0.2 * scale]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-0.08 * scale, 0.85 * scale, 0.2 * scale]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      {/* Arms */}
      <mesh castShadow position={[0.45 * scale, 0, 0]}>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh castShadow position={[-0.45 * scale, 0, 0]}>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Health bar */}
      {enemy.health < enemy.maxHealth && (
        <group position={[0, 1.3 * scale, 0]}>
          {/* Background */}
          <mesh>
            <planeGeometry args={[0.8, 0.08]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          {/* Fill */}
          <mesh position={[-(0.4 * (1 - enemy.health / enemy.maxHealth)), 0, 0.001]}>
            <planeGeometry args={[0.8 * (enemy.health / enemy.maxHealth), 0.08]} />
            <meshBasicMaterial color="#ff2222" />
          </mesh>
        </group>
      )}
      {/* Glow light */}
      <pointLight
        color={color}
        intensity={2}
        distance={4}
        decay={2}
      />
    </group>
  );
}

// Enemies manager — updates positions and renders
function EnemiesManager() {
  const enemies = useDoomStore((s) => s.enemies);
  const updateEnemies = useDoomStore((s) => s.updateEnemies);
  const playerPosition = useDoomStore((s) => s.playerPosition);

  useFrame((_, delta) => {
    try {
      updateEnemies(playerPosition, Math.min(delta, 0.05));
    } catch (e) {
      console.warn('[EnemiesManager] update error:', e);
    }
  });

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </>
  );
}

// Health pickup
function HealthPickup({ pickup }) {
  const meshRef = useRef();
  const store = useDoomStore;

  useFrame((state, delta) => {
    try {
      if (!meshRef.current || pickup.collected) return;
      meshRef.current.rotation.y += delta * 2;

      // Check proximity to player
      const playerPos = store.getState().playerPosition;
      const dx = playerPos[0] - pickup.position[0];
      const dz = playerPos[2] - pickup.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 1.5) {
        store.getState().pickupItem(pickup.id);
      }
    } catch (e) {
      // Silent
    }
  });

  if (pickup.collected) return null;

  return (
    <group ref={meshRef} position={pickup.position}>
      {/* Cross shape for health */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.15, 0.15]} />
        <meshStandardMaterial
          color="#22ff22"
          emissive="#00ff00"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial
          color="#22ff22"
          emissive="#00ff00"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight color="#00ff00" intensity={3} distance={5} decay={2} />
    </group>
  );
}

// Ammo pickup
function AmmoPickup({ pickup }) {
  const meshRef = useRef();
  const store = useDoomStore;

  useFrame((state, delta) => {
    try {
      if (!meshRef.current || pickup.collected) return;
      meshRef.current.rotation.y += delta * 2;

      // Check proximity
      const playerPos = store.getState().playerPosition;
      const dx = playerPos[0] - pickup.position[0];
      const dz = playerPos[2] - pickup.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 1.5) {
        store.getState().pickupItem(pickup.id);
      }
    } catch (e) {
      // Silent
    }
  });

  if (pickup.collected) return null;

  return (
    <group ref={meshRef} position={pickup.position}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffaa00"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Bullet shapes on top */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 6]} />
        <meshStandardMaterial color="#ccaa00" metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight color="#ffaa00" intensity={3} distance={5} decay={2} />
    </group>
  );
}

// Pickups manager
function PickupsManager() {
  const pickups = useDoomStore((s) => s.pickups);

  return (
    <>
      {pickups.map((p) =>
        p.type === 'health' ? (
          <HealthPickup key={p.id} pickup={p} />
        ) : (
          <AmmoPickup key={p.id} pickup={p} />
        )
      )}
    </>
  );
}

// Room/corridor layout
function ArenaLayout() {
  const wallColor = '#1e1e3a';
  const pillarColor = '#2a1a3a';

  return (
    <>
      {/* Outer walls */}
      <Wall position={[0, 2.5, -30]} size={[60, 5, 0.5]} color={wallColor} />
      <Wall position={[0, 2.5, 30]} size={[60, 5, 0.5]} color={wallColor} />
      <Wall position={[-30, 2.5, 0]} size={[0.5, 5, 60]} color={wallColor} />
      <Wall position={[30, 2.5, 0]} size={[0.5, 5, 60]} color={wallColor} />

      {/* Central pillars */}
      <Wall position={[-8, 2.5, -8]} size={[2, 5, 2]} color={pillarColor} />
      <Wall position={[8, 2.5, -8]} size={[2, 5, 2]} color={pillarColor} />
      <Wall position={[-8, 2.5, 8]} size={[2, 5, 2]} color={pillarColor} />
      <Wall position={[8, 2.5, 8]} size={[2, 5, 2]} color={pillarColor} />

      {/* Inner walls / corridors */}
      <Wall position={[-15, 2.5, -4]} size={[10, 5, 0.5]} color={wallColor} />
      <Wall position={[15, 2.5, 4]} size={[10, 5, 0.5]} color={wallColor} />
      <Wall position={[0, 2.5, -15]} size={[0.5, 5, 8]} color={wallColor} />
      <Wall position={[0, 2.5, 15]} size={[0.5, 5, 8]} color={wallColor} />

      {/* Cover walls */}
      <Wall position={[-20, 1.5, 0]} size={[4, 3, 0.5]} color="#2a2a4a" />
      <Wall position={[20, 1.5, 0]} size={[4, 3, 0.5]} color="#2a2a4a" />
      <Wall position={[0, 1.5, -22]} size={[0.5, 3, 6]} color="#2a2a4a" />
      <Wall position={[0, 1.5, 22]} size={[0.5, 3, 6]} color="#2a2a4a" />
    </>
  );
}

// Atmospheric lighting
function DoomLighting() {
  return (
    <>
      {/* Low ambient for darkness */}
      <ambientLight intensity={0.08} color="#1a1a3a" />

      {/* Red danger lights */}
      <pointLight position={[-15, 4, -15]} color="#ff2222" intensity={15} distance={20} decay={2} />
      <pointLight position={[15, 4, 15]} color="#ff2222" intensity={15} distance={20} decay={2} />
      <pointLight position={[15, 4, -15]} color="#ff4422" intensity={10} distance={18} decay={2} />

      {/* Green eerie lights */}
      <pointLight position={[-15, 4, 15]} color="#22ff44" intensity={12} distance={20} decay={2} />
      <pointLight position={[0, 4, 0]} color="#44ff44" intensity={8} distance={15} decay={2} />

      {/* Blue accent lights */}
      <pointLight position={[-8, 3, -8]} color="#4444ff" intensity={5} distance={8} decay={2} />
      <pointLight position={[8, 3, 8]} color="#4444ff" intensity={5} distance={8} decay={2} />

      {/* Directional for minimal shadow */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.15}
        color="#334466"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
    </>
  );
}

// Fog and atmosphere
function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={['#0a0a1a', 5, 40]} />
      <color attach="background" args={['#050510']} />
    </>
  );
}

// Wave announcement
function WaveAnnouncement() {
  const wave = useDoomStore((s) => s.wave);
  const waveCleared = useDoomStore((s) => s.waveCleared);

  // This is an HTML overlay, not 3D - but we track wave changes here
  return null;
}

export default function World() {
  return (
    <>
      <Atmosphere />
      <DoomLighting />
      <Floor />
      <Ceiling />
      <ArenaLayout />
      <EnemiesManager />
      <PickupsManager />
      <WaveAnnouncement />
    </>
  );
}
