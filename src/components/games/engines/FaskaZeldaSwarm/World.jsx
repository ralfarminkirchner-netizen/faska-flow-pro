import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useZeldaStore from './GameLogic';

/**
 * Zelda World — Top-down room with grass, walls, bushes, pots, enemies, items
 */

// Ground (grass floor)
function GrassFloor() {
  return (
    <RigidBody type="fixed" position={[0, 0, 0]} colliders="cuboid">
      <mesh receiveShadow>
        <boxGeometry args={[20, 0.2, 20]} />
        <meshStandardMaterial color="#4a8c3f" roughness={0.9} />
      </mesh>
      {/* Grass detail patches */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (Math.random() - 0.5) * 18;
        const z = (Math.random() - 0.5) * 18;
        return (
          <mesh key={i} position={[x, 0.11, z]} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
            <circleGeometry args={[0.3 + Math.random() * 0.3, 6]} />
            <meshStandardMaterial
              color={`hsl(${110 + Math.random() * 20}, ${60 + Math.random() * 20}%, ${30 + Math.random() * 15}%)`}
              roughness={1}
            />
          </mesh>
        );
      })}
    </RigidBody>
  );
}

// Stone walls around room
function RoomWalls() {
  const wallColor = '#7a7a6e';
  const wallHeight = 1.5;
  const roomSize = 9.5;

  return (
    <>
      {/* North wall (with gap for door) */}
      <RigidBody type="fixed" position={[-5, wallHeight / 2, -roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[5, wallHeight / 2, -roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* South wall (with gap) */}
      <RigidBody type="fixed" position={[-5, wallHeight / 2, roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[5, wallHeight / 2, roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* East wall */}
      <RigidBody type="fixed" position={[roomSize, wallHeight / 2, 0]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, wallHeight, 20]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* West wall */}
      <RigidBody type="fixed" position={[-roomSize, wallHeight / 2, 0]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, wallHeight, 20]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* Wall top decorations (darker stone) */}
      {[
        [-5, wallHeight + 0.15, -roomSize],
        [5, wallHeight + 0.15, -roomSize],
        [-5, wallHeight + 0.15, roomSize],
        [5, wallHeight + 0.15, roomSize],
      ].map((pos, i) => (
        <mesh key={`top-${i}`} position={pos}>
          <boxGeometry args={[9, 0.3, 0.7]} />
          <meshStandardMaterial color="#5a5a4e" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

// Door indicators (N and S)
function DoorIndicators() {
  const currentRoom = useZeldaStore((s) => s.currentRoom);
  const totalRooms = useZeldaStore((s) => s.totalRooms);

  return (
    <>
      {/* North door (forward) */}
      {currentRoom < totalRooms - 1 && (
        <group position={[0, 0.1, -9.5]}>
          <mesh>
            <boxGeometry args={[1.5, 0.05, 0.8]} />
            <meshStandardMaterial
              color="#8B6914"
              emissive="#aa8833"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Arrow indicator */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.3, 0.5, 3]} />
            <meshBasicMaterial color="#ffdd44" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* South door (backward) */}
      {currentRoom > 0 && (
        <group position={[0, 0.1, 9.5]}>
          <mesh>
            <boxGeometry args={[1.5, 0.05, 0.8]} />
            <meshStandardMaterial
              color="#8B6914"
              emissive="#aa8833"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <coneGeometry args={[0.3, 0.5, 3]} />
            <meshBasicMaterial color="#ffdd44" transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </>
  );
}

// Bush component
function Bush({ bush }) {
  if (bush.destroyed) return null;

  return (
    <group position={bush.position}>
      <mesh castShadow>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial
          color="#2d7a2d"
          roughness={0.9}
        />
      </mesh>
      {/* Lighter leaves on top */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.25, 6, 6]} />
        <meshStandardMaterial color="#3d9a3d" roughness={0.85} />
      </mesh>
      {/* Shadow */}
      <mesh position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Pot component
function Pot({ pot }) {
  if (pot.destroyed) return null;

  return (
    <group position={pot.position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial
          color="#c4956a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.05, 8]} />
        <meshStandardMaterial color="#a07850" roughness={0.6} />
      </mesh>
      {/* Shadow */}
      <mesh position={[0, -0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Rupee item
function Rupee({ item }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || item.collected) return;
      meshRef.current.rotation.y += delta * 3;
      meshRef.current.position.y = item.position[1] + Math.sin(Date.now() * 0.003) * 0.1;
    } catch (e) {
      // Silent
    }
  });

  if (item.collected) return null;

  const color = item.value >= 5 ? '#2244ff' : '#22dd44';
  const emissive = item.value >= 5 ? '#1133cc' : '#11aa33';

  return (
    <group ref={meshRef} position={item.position}>
      {/* Octahedron shape for rupee */}
      <mesh castShadow>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight color={color} intensity={2} distance={3} decay={2} />
    </group>
  );
}

// Heart pickup
function HeartPickup({ item }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || item.collected) return;
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.position.y = item.position[1] + Math.sin(Date.now() * 0.004) * 0.12;
    } catch (e) {
      // Silent
    }
  });

  if (item.collected) return null;

  return (
    <group ref={meshRef} position={item.position}>
      {/* Heart shape (two spheres + cone) */}
      <mesh position={[-0.08, 0.08, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ff2255"
          emissive="#ff0033"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0.08, 0.08, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ff2255"
          emissive="#ff0033"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.14, 0.2, 4]} />
        <meshStandardMaterial
          color="#ff2255"
          emissive="#ff0033"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight color="#ff2255" intensity={2} distance={3} decay={2} />
    </group>
  );
}

// Slime enemy
function SlimeEnemy({ enemy }) {
  const meshRef = useRef();

  useFrame(() => {
    try {
      if (!meshRef.current || !enemy.alive) return;
      meshRef.current.position.set(
        enemy.position[0],
        enemy.position[1] + Math.abs(Math.sin(enemy.bouncePhase)) * 0.2,
        enemy.position[2]
      );
      // Squash and stretch
      const squash = 1 + Math.sin(enemy.bouncePhase) * 0.15;
      meshRef.current.scale.set(1 / squash, squash, 1 / squash);
    } catch (e) {
      // Silent
    }
  });

  if (!enemy.alive) return null;

  return (
    <group ref={meshRef} position={enemy.position}>
      {/* Slime body — squashed sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial
          color="#cc2222"
          emissive="#aa1111"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 0.15, 0.25]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.1, 0.15, 0.25]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.1, 0.15, 0.3]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      <mesh position={[-0.1, 0.15, 0.3]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      {/* Shadow */}
      <mesh position={[0, -0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      {/* Health bar */}
      {enemy.health < enemy.maxHealth && (
        <group position={[0, 0.6, 0]}>
          <mesh>
            <planeGeometry args={[0.6, 0.06]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          <mesh position={[-(0.3 * (1 - enemy.health / enemy.maxHealth)), 0, 0.001]}>
            <planeGeometry args={[0.6 * (enemy.health / enemy.maxHealth), 0.06]} />
            <meshBasicMaterial color="#ff2222" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Bat enemy
function BatEnemy({ enemy }) {
  const meshRef = useRef();
  const wingPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || !enemy.alive) return;
      meshRef.current.position.set(
        enemy.position[0],
        enemy.position[1] + 0.5 + Math.sin(enemy.bouncePhase) * 0.3,
        enemy.position[2]
      );
      wingPhase.current += delta * 15;
    } catch (e) {
      // Silent
    }
  });

  if (!enemy.alive) return null;

  const wingAngle = Math.sin(wingPhase.current) * 0.5;

  return (
    <group ref={meshRef} position={enemy.position}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#4422aa" emissive="#331188" emissiveIntensity={0.5} />
      </mesh>
      {/* Wings */}
      <mesh position={[0.25, 0.05, 0]} rotation={[0, 0, wingAngle]}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshStandardMaterial color="#553399" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.25, 0.05, 0]} rotation={[0, 0, -wingAngle]}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshStandardMaterial color="#553399" transparent opacity={0.7} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.05, 0.05, 0.12]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      <mesh position={[-0.05, 0.05, 0.12]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      {/* Shadow */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Enemies manager
function EnemiesManager() {
  const enemies = useZeldaStore((s) => s.enemies);
  const updateEnemies = useZeldaStore((s) => s.updateEnemies);
  const playerPosition = useZeldaStore((s) => s.playerPosition);

  useFrame((_, delta) => {
    try {
      updateEnemies(playerPosition, Math.min(delta, 0.05));
    } catch (e) {
      console.warn('[EnemiesManager] error:', e);
    }
  });

  return (
    <>
      {enemies.map((enemy) =>
        enemy.type === 'bat' ? (
          <BatEnemy key={enemy.id} enemy={enemy} />
        ) : (
          <SlimeEnemy key={enemy.id} enemy={enemy} />
        )
      )}
    </>
  );
}

// All items
function ItemsManager() {
  const items = useZeldaStore((s) => s.items);

  return (
    <>
      {items.map((item) =>
        item.type === 'heart' ? (
          <HeartPickup key={item.id} item={item} />
        ) : (
          <Rupee key={item.id} item={item} />
        )
      )}
    </>
  );
}

// Bushes & pots
function DecorationManager() {
  const bushes = useZeldaStore((s) => s.bushes);
  const pots = useZeldaStore((s) => s.pots);

  return (
    <>
      {bushes.map((bush) => (
        <Bush key={bush.id} bush={bush} />
      ))}
      {pots.map((pot) => (
        <Pot key={pot.id} pot={pot} />
      ))}
    </>
  );
}

// Lighting
function ZeldaLighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffffee" />
      <directionalLight
        position={[8, 15, 5]}
        intensity={1.2}
        color="#ffffdd"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* Warm fill light */}
      <pointLight position={[0, 8, 0]} color="#ffeecc" intensity={5} distance={25} decay={2} />
    </>
  );
}

// Room transition overlay visual effect
function TransitionOverlay() {
  const transitioning = useZeldaStore((s) => s.transitioning);
  const meshRef = useRef();

  useFrame(() => {
    try {
      if (meshRef.current) {
        meshRef.current.material.opacity = transitioning ? 0.8 : 0;
      }
    } catch (e) {
      // Silent
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial color="#000000" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function World() {
  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 20, 40]} />
      <ZeldaLighting />
      <GrassFloor />
      <RoomWalls />
      <DoorIndicators />
      <DecorationManager />
      <EnemiesManager />
      <ItemsManager />
      <TransitionOverlay />
    </>
  );
}
