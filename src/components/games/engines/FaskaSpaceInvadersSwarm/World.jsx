import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useSpaceInvadersStore from './GameLogic';

/**
 * Starfield — Instanced tiny spheres for space background.
 */
function Starfield({ count = 500 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const starData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40 + 5,
        z: -10 - Math.random() * 30,
        scale: 0.02 + Math.random() * 0.06,
        twinkleSpeed: 1 + Math.random() * 3,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    starData.forEach((star, i) => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);
      dummy.position.set(star.x, star.y, star.z);
      dummy.scale.setScalar(star.scale * (0.6 + twinkle * 0.4));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
}

/**
 * Invader shape varies by type.
 */
function InvaderMesh({ type, alive, hitAnim }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    if (!alive && hitAnim > 0) {
      ref.current.scale.setScalar(hitAnim * 2);
      ref.current.rotation.z += 0.2;
    }
  });

  const color = {
    elite: '#a855f7',
    soldier: '#06b6d4',
    grunt: '#10b981',
  }[type] || '#ffffff';

  const emissiveColor = {
    elite: '#7c3aed',
    soldier: '#0891b2',
    grunt: '#059669',
  }[type] || '#000000';

  if (!alive && hitAnim <= 0) return null;

  if (type === 'elite') {
    // Octopus-like: sphere body + tentacles
    return (
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.35, 8, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={alive ? 0.4 : 1}
            transparent={!alive}
            opacity={alive ? 1 : hitAnim}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.12, 0.05, 0.3]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0.05, 0.3]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Tentacles */}
        {[-0.25, -0.1, 0.1, 0.25].map((x, i) => (
          <mesh key={i} position={[x, -0.3, 0]}>
            <boxGeometry args={[0.06, 0.2, 0.06]} />
            <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.3} />
          </mesh>
        ))}
        <pointLight color={color} intensity={0.5} distance={1.5} />
      </group>
    );
  }

  if (type === 'soldier') {
    // Crab-like: box body + claws
    return (
      <group ref={ref}>
        <mesh>
          <boxGeometry args={[0.6, 0.35, 0.3]} />
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={alive ? 0.3 : 1}
            transparent={!alive}
            opacity={alive ? 1 : hitAnim}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0.12, 0.15]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.15, 0.12, 0.15]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Claws */}
        <mesh position={[-0.4, -0.1, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.15, 0.25, 0.1]} />
          <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.4, -0.1, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.15, 0.25, 0.1]} />
          <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} />
        </mesh>
        <pointLight color={color} intensity={0.3} distance={1} />
      </group>
    );
  }

  // Grunt: simple squid shape
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.45, 0.4, 0.25]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={alive ? 0.25 : 1}
          transparent={!alive}
          opacity={alive ? 1 : hitAnim}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.05, 0.13]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.13]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Antennae */}
      <mesh position={[-0.15, 0.28, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.15, 0.28, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Bullet — Glowing projectile.
 */
function Bullet({ bullet, isInvader = false }) {
  return (
    <group position={[bullet.x, bullet.y, 0]}>
      <mesh>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial
          color={isInvader ? '#ef4444' : '#4ade80'}
          emissive={isInvader ? '#ef4444' : '#22c55e'}
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight
        color={isInvader ? '#ef4444' : '#4ade80'}
        intensity={1}
        distance={1.5}
      />
    </group>
  );
}

/**
 * Shield block with damage visualization.
 */
function ShieldBlock({ shield }) {
  const opacity = shield.health / 3;
  return (
    <mesh position={[shield.x, shield.y, 0]}>
      <boxGeometry args={[0.45, 0.45, 0.3]} />
      <meshStandardMaterial
        color="#22c55e"
        emissive="#16a34a"
        emissiveIntensity={0.2}
        transparent
        opacity={opacity * 0.8}
      />
    </mesh>
  );
}

/**
 * Explosion effect.
 */
function Explosion({ explosion }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const scale = (0.5 - explosion.time) * 4 + 0.5;
    ref.current.scale.setScalar(scale);
  });

  return (
    <group ref={ref} position={[explosion.x, explosion.y, 0]}>
      {/* Central flash */}
      <mesh>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshBasicMaterial
          color={explosion.color}
          transparent
          opacity={explosion.time * 2}
        />
      </mesh>
      {/* Particles */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2;
        const dist = (0.5 - explosion.time) * 1.5;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * dist, Math.sin(angle) * dist, 0]}
          >
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshBasicMaterial
              color={explosion.color}
              transparent
              opacity={explosion.time * 2}
            />
          </mesh>
        );
      })}
      <pointLight color={explosion.color} intensity={explosion.time * 5} distance={3} />
    </group>
  );
}

/**
 * World — Space background with stars, invader grid, shields, bullets, and effects.
 */
export default function World() {
  const invaders = useSpaceInvadersStore(s => s.invaders);
  const bullets = useSpaceInvadersStore(s => s.bullets);
  const invaderBullets = useSpaceInvadersStore(s => s.invaderBullets);
  const shields = useSpaceInvadersStore(s => s.shields);
  const explosions = useSpaceInvadersStore(s => s.explosions);

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#4a5568" />
      <directionalLight
        position={[5, 10, 8]}
        intensity={0.5}
        color="#a78bfa"
      />
      <directionalLight
        position={[-3, 8, 5]}
        intensity={0.3}
        color="#06b6d4"
      />

      {/* Space background */}
      <mesh position={[0, 5, -25]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial color="#050510" />
      </mesh>

      {/* Starfield */}
      <Starfield count={400} />

      {/* Nebula glow effects */}
      <mesh position={[-8, 9, -18]}>
        <sphereGeometry args={[4, 8, 6]} />
        <meshBasicMaterial color="#4a1a8a" transparent opacity={0.08} />
      </mesh>
      <mesh position={[10, 7, -20]}>
        <sphereGeometry args={[5, 8, 6]} />
        <meshBasicMaterial color="#0e3d6b" transparent opacity={0.06} />
      </mesh>

      {/* Planet decoration */}
      <mesh position={[12, 10, -22]}>
        <sphereGeometry args={[2, 16, 12]} />
        <meshStandardMaterial color="#5b21b6" emissive="#3b0764" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[12, 10, -22]} rotation={[0.3, 0, 0.1]}>
        <torusGeometry args={[3, 0.15, 4, 32]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>

      {/* Invaders */}
      {invaders.map(inv => (
        <group key={inv.id} position={[inv.x, inv.y, 0]}>
          <InvaderMesh type={inv.type} alive={inv.alive} hitAnim={inv.hitAnim} />
        </group>
      ))}

      {/* Player bullets */}
      {bullets.map(b => (
        <Bullet key={b.id} bullet={b} />
      ))}

      {/* Invader bullets */}
      {invaderBullets.map(b => (
        <Bullet key={b.id} bullet={b} isInvader />
      ))}

      {/* Shields */}
      {shields.map(s => (
        <ShieldBlock key={s.id} shield={s} />
      ))}

      {/* Explosions */}
      {explosions.map(e => (
        <Explosion key={e.id} explosion={e} />
      ))}

      {/* Ground line */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[20, 0.02, 0.5]} />
        <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.5} />
      </mesh>

      {/* Side boundaries — faint glow lines */}
      <mesh position={[-9, 4, 0]}>
        <boxGeometry args={[0.02, 12, 0.3]} />
        <meshStandardMaterial color="#4a5568" emissive="#374151" emissiveIntensity={0.3} transparent opacity={0.3} />
      </mesh>
      <mesh position={[9, 4, 0]}>
        <boxGeometry args={[0.02, 12, 0.3]} />
        <meshStandardMaterial color="#4a5568" emissive="#374151" emissiveIntensity={0.3} transparent opacity={0.3} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#050510', 20, 45]} />
    </group>
  );
}
