import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useDoomStore, { DOOM_HAZARDS, DOOM_PICKUPS, DOOM_SEALS } from './GameLogic';

/**
 * World.jsx — Dark atmospheric arena with enemies, pickups, pillars, lighting.
 */

/* ─────────────────────── Floor ─────────────────────── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#242b3f"
        metalness={0.45}
        roughness={0.5}
        emissive="#111827"
        emissiveIntensity={0.28}
      />
    </mesh>
  );
}

/* ─────────────────────── Ceiling ─────────────────────── */
function Ceiling() {
  return (
    <mesh position={[0, 6, 0]}>
      <boxGeometry args={[60, 0.2, 60]} />
      <meshStandardMaterial
        color="#0a0a14"
        emissive="#050510"
        emissiveIntensity={0.1}
        metalness={0.5}
        roughness={0.9}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* ─────────────────────── Wall ─────────────────────── */
function Wall({ position, size, color = '#1e1e2e' }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.35}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

/* ─────────────────────── Accent Strip ─────────────────────── */
function AccentStrip({ position, size, color, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ─────────────────────── Pillar ─────────────────────── */
function Pillar({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 5, 2]} />
        <meshStandardMaterial
          color="#1a1a2a"
          metalness={0.7}
          roughness={0.25}
          emissive="#0a0a18"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Red accent strip */}
      <AccentStrip
        position={[0, 1.5, 1.01]}
        size={[0.08, 1.5, 0.02]}
        color="#ef4444"
      />
      <AccentStrip
        position={[0, 1.5, -1.01]}
        size={[0.08, 1.5, 0.02]}
        color="#ef4444"
      />
    </group>
  );
}

/* ─────────────────────── Arena Layout ─────────────────────── */
function ArenaLayout() {
  const wallColor = '#23283a';

  return (
    <>
      {/* Outer walls */}
      <Wall position={[0, 2.5, -30]} size={[60, 5, 0.6]} color={wallColor} />
      <Wall position={[0, 2.5, 30]} size={[60, 5, 0.6]} color={wallColor} />
      <Wall position={[-30, 2.5, 0]} size={[0.6, 5, 60]} color={wallColor} />
      <Wall position={[30, 2.5, 0]} size={[0.6, 5, 60]} color={wallColor} />

      {/* Corner accent strips — red */}
      <AccentStrip position={[-29.6, 2, -29.6]} size={[0.1, 4, 0.1]} color="#ef4444" />
      <AccentStrip position={[29.6, 2, -29.6]} size={[0.1, 4, 0.1]} color="#ef4444" />
      <AccentStrip position={[-29.6, 2, 29.6]} size={[0.1, 4, 0.1]} color="#ef4444" />
      <AccentStrip position={[29.6, 2, 29.6]} size={[0.1, 4, 0.1]} color="#ef4444" />

      {/* Wall accent strips — green */}
      <AccentStrip position={[0, 0.8, -29.6]} size={[20, 0.06, 0.06]} color="#22c55e" />
      <AccentStrip position={[0, 0.8, 29.6]} size={[20, 0.06, 0.06]} color="#22c55e" />
      <AccentStrip position={[-29.6, 0.8, 0]} size={[0.06, 0.06, 20]} color="#22c55e" />
      <AccentStrip position={[29.6, 0.8, 0]} size={[0.06, 0.06, 20]} color="#22c55e" />

      {/* Inner corridor walls */}
      <Wall position={[-14, 2.5, -5]} size={[8, 5, 0.5]} color="#1e1e30" />
      <Wall position={[14, 2.5, 5]} size={[8, 5, 0.5]} color="#1e1e30" />
      <Wall position={[0, 2.5, -14]} size={[0.5, 5, 8]} color="#1e1e30" />
      <Wall position={[0, 2.5, 14]} size={[0.5, 5, 8]} color="#1e1e30" />

      {/* Pillars for cover */}
      <Pillar position={[-8, 2.5, -8]} />
      <Pillar position={[8, 2.5, -8]} />
      <Pillar position={[-8, 2.5, 8]} />
      <Pillar position={[8, 2.5, 8]} />
      <Pillar position={[-18, 2.5, 0]} />
      <Pillar position={[18, 2.5, 0]} />
      <Pillar position={[0, 2.5, -20]} />
      <Pillar position={[0, 2.5, 20]} />
    </>
  );
}

/* ─────────────────────── Single Enemy ─────────────────────── */
function Enemy({ enemy }) {
  const groupRef = useRef();
  const eyePulse = useRef((enemy.id * 1.618) % (Math.PI * 2));

  useFrame((_, delta) => {
    try {
      if (!groupRef.current) return;

      eyePulse.current += delta * 6;

      if (enemy.alive) {
        // Update position
        groupRef.current.position.set(
          enemy.position.x,
          enemy.position.y + Math.sin(eyePulse.current * 0.7) * 0.08,
          enemy.position.z
        );
        groupRef.current.scale.setScalar(enemy.scale || 1);
      } else {
        // Death animation — shrink to 0
        const s = groupRef.current.scale.x;
        if (s > 0.01) {
          const ns = THREE.MathUtils.lerp(s, 0, delta * 8);
          groupRef.current.scale.setScalar(ns);
        }
      }
    } catch {
      // silent
    }
  });

  if (!enemy.alive && enemy.deathTimer <= 0) return null;

  const baseColor = enemy.hitFlashTimer > 0
    ? '#f8fafc'
    : enemy.stunnedTimer > 0
      ? '#facc15'
      : enemy.color || '#ef4444';
  const healthPct = enemy.health / enemy.maxHealth;

  return (
    <group ref={groupRef} position={[enemy.position.x, enemy.position.y, enemy.position.z]}>
      {enemy.champion && (
        <mesh position={[0, 1.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.045, 8, 24]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.8} transparent opacity={0.82} />
        </mesh>
      )}

      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.4}
          metalness={0.4}
          roughness={0.55}
        />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Left eye — emissive red, glowing */}
      <mesh position={[-0.08, 0.9, 0.22]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={6}
          toneMapped={false}
        />
      </mesh>

      {/* Right eye — emissive red, glowing */}
      <mesh position={[0.08, 0.9, 0.22]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={6}
          toneMapped={false}
        />
      </mesh>

      {/* Left arm */}
      <mesh castShadow position={[-0.42, 0, 0]}>
        <boxGeometry args={[0.14, 0.8, 0.14]} />
        <meshStandardMaterial color={baseColor} metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Right arm */}
      <mesh castShadow position={[0.42, 0, 0]}>
        <boxGeometry args={[0.14, 0.8, 0.14]} />
        <meshStandardMaterial color={baseColor} metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Left leg */}
      <mesh castShadow position={[-0.15, -0.8, 0]}>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={baseColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Right leg */}
      <mesh castShadow position={[0.15, -0.8, 0]}>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={baseColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Health bar — only show when damaged */}
      {enemy.alive && healthPct < 1.0 && (
        <group position={[0, 1.4, 0]}>
          {/* BG */}
          <mesh>
            <planeGeometry args={[0.8, 0.06]} />
            <meshBasicMaterial color="#1a1a1a" transparent opacity={0.7} />
          </mesh>
          {/* Fill */}
          <mesh position={[-(0.4 * (1 - healthPct)), 0, 0.001]}>
            <planeGeometry args={[0.8 * healthPct, 0.06]} />
            <meshBasicMaterial color={healthPct > 0.5 ? '#22c55e' : healthPct > 0.25 ? '#eab308' : '#ef4444'} />
          </mesh>
        </group>
      )}

      {/* Enemy glow */}
      <pointLight
        color={baseColor}
        intensity={enemy.type === 'archon' || enemy.champion ? 6 : 2}
        distance={enemy.type === 'archon' ? 8 : 4}
        decay={2}
      />
    </group>
  );
}

/* ─────────────────────── Enemies Manager ─────────────────────── */
function EnemiesManager() {
  const enemies = useDoomStore(s => s.enemies);

  return (
    <>
      {enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </>
  );
}

/* ─────────────────────── Pickup ─────────────────────── */
function Pickup({ pickup, onPickup }) {
  const meshRef = useRef();
  const isHealth = pickup.type === 'health';
  const isAmmo = pickup.type === 'ammo';
  const isArmor = pickup.type === 'armor';
  const isGrenade = pickup.type === 'grenade';
  const isWeapon = pickup.type === 'weapon';
  const color = isHealth
    ? '#22c55e'
    : isArmor
      ? '#38bdf8'
      : isGrenade
        ? '#f97316'
        : isWeapon
          ? '#a855f7'
          : '#eab308';

  useFrame((_, delta) => {
    try {
      if (!meshRef.current) return;

      // Rotate + bob
      meshRef.current.rotation.y += delta * 2.5;
      meshRef.current.position.y = pickup.position[1] + Math.sin(performance.now() * 0.003) * 0.15;

      // Check proximity to player
      const playerPos = useDoomStore.getState().playerPosition;
      const dx = playerPos[0] - pickup.position[0];
      const dz = playerPos[2] - pickup.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 1.8) {
        if (onPickup) onPickup();
      }
    } catch {
      // silent
    }
  });

  return (
    <group ref={meshRef} position={pickup.position}>
      {isHealth ? (
        <>
          {/* Health cross */}
          <mesh castShadow>
            <boxGeometry args={[0.45, 0.12, 0.12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.45, 0.12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </>
      ) : isWeapon ? (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.68, 0.22, 0.36]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2.2}
              metalness={0.8}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.2, 0.18, 0.48]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ) : isArmor ? (
        <mesh castShadow>
          <icosahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.8}
            metalness={0.5}
            roughness={0.22}
            toneMapped={false}
          />
        </mesh>
      ) : isGrenade ? (
        <mesh castShadow>
          <sphereGeometry args={[0.26, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} metalness={0.65} roughness={0.2} />
        </mesh>
      ) : isAmmo ? (
        /* Ammo box */
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.25, 0.25]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            metalness={0.7}
            roughness={0.25}
            toneMapped={false}
          />
        </mesh>
      ) : null}
      <pointLight color={color} intensity={4} distance={5} decay={2} />
    </group>
  );
}

/* ─────────────────────── Pickups Manager ─────────────────────── */
function PickupsManager() {
  const collectedPickups = useDoomStore(s => s.collectedPickups);
  const collectPickup = useDoomStore(s => s.collectPickup);

  return (
    <>
      {DOOM_PICKUPS.filter(p => !collectedPickups.includes(p.id)).map(p => (
        <Pickup
          key={p.id}
          pickup={p}
          onPickup={() => collectPickup(p)}
        />
      ))}
    </>
  );
}

function Seal({ seal }) {
  const groupRef = useRef();
  const collectSeal = useDoomStore(s => s.collectSeal);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 1.35;
    groupRef.current.position.y = seal.position[1] + Math.sin(state.clock.elapsedTime * 3 + seal.position[0]) * 0.16;
    const playerPos = useDoomStore.getState().playerPosition;
    const dx = playerPos[0] - seal.position[0];
    const dz = playerPos[2] - seal.position[2];
    if (Math.sqrt(dx * dx + dz * dz) < 2.0) collectSeal(seal.id);
  });

  return (
    <group ref={groupRef} position={seal.position}>
      <mesh castShadow>
        <octahedronGeometry args={[0.52]} />
        <meshStandardMaterial color="#facc15" emissive="#f97316" emissiveIntensity={2.8} metalness={0.55} roughness={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.035, 8, 32]} />
        <meshStandardMaterial color="#f8fafc" emissive="#facc15" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function SealsManager() {
  const reactorSeals = useDoomStore(s => s.reactorSeals);
  return (
    <>
      {DOOM_SEALS.filter(seal => !reactorSeals.includes(seal.id)).map(seal => (
        <Seal key={seal.id} seal={seal} />
      ))}
    </>
  );
}

function HazardZone({ hazard }) {
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.7;
    ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.045);
  });

  return (
    <group position={[hazard.x, 0.035, hazard.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[hazard.radius, 36]} />
        <meshStandardMaterial color={hazard.color} emissive={hazard.color} emissiveIntensity={0.45} transparent opacity={0.34} roughness={0.6} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[hazard.radius * 0.62, hazard.radius * 0.95, 34]} />
        <meshStandardMaterial color="#f8fafc" emissive={hazard.color} emissiveIntensity={1.2} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/* ─────────────────────── Lighting ─────────────────────── */
function DoomLighting() {
  return (
    <>
      {/* Very low ambient — dark atmosphere */}
      <ambientLight intensity={0.36} color="#3b4266" />
      <hemisphereLight args={['#64748b', '#111827', 0.42]} />

      {/* Red corner lights */}
      <pointLight position={[-25, 4, -25]} color="#ef4444" intensity={22} distance={26} decay={2} />
      <pointLight position={[25, 4, 25]} color="#ef4444" intensity={22} distance={26} decay={2} />
      <pointLight position={[25, 4, -25]} color="#ef4444" intensity={18} distance={24} decay={2} />
      <pointLight position={[-25, 4, 25]} color="#ef4444" intensity={18} distance={24} decay={2} />

      {/* Green pickup lights */}
      <pointLight position={[-12, 3, -12]} color="#22c55e" intensity={8} distance={10} decay={2} />
      <pointLight position={[12, 3, 12]} color="#22c55e" intensity={8} distance={10} decay={2} />

      {/* Blue accent lights near center */}
      <pointLight position={[-8, 3, -8]} color="#3b82f6" intensity={6} distance={8} decay={2} />
      <pointLight position={[8, 3, 8]} color="#3b82f6" intensity={6} distance={8} decay={2} />

      {/* Central dim cyan light */}
      <pointLight position={[0, 4, 0]} color="#22d3ee" intensity={16} distance={22} decay={2} />
      <pointLight position={[0, 2.3, -10]} color="#f8fafc" intensity={7} distance={18} decay={2} />

      {/* Directional for minimal shadow */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.46}
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

/* ─────────────────────── Atmosphere ─────────────────────── */
function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={['#080c18', 13, 42]} />
      <color attach="background" args={['#070b13']} />
    </>
  );
}

/* ─────────────────────── Export ─────────────────────── */
export default function World() {
  return (
    <>
      <Atmosphere />
      <DoomLighting />
      <Floor />
      <Ceiling />
      <ArenaLayout />
      {DOOM_HAZARDS.map((hazard) => (
        <HazardZone key={hazard.id} hazard={hazard} />
      ))}
      <EnemiesManager />
      <PickupsManager />
      <SealsManager />
    </>
  );
}
