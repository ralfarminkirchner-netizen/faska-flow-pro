import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Cylinder, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useMathDefenderStore } from './GameLogic';
import InstancedParticles from '../../../../shared/ParticleSystem';
import { useScreenShake } from '../../../../shared/ScreenShake';

const Laser = ({ start, end, life, maxLife = 0.22, color = '#00ffff', width = 0.1 }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const distance = startVec.distanceTo(endVec);
  const midpoint = startVec.clone().lerp(endVec, 0.5);
  const direction = new THREE.Vector3().subVectors(endVec, startVec).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  const opacity = Math.max(0, life / maxLife);

  return (
    <group position={midpoint} quaternion={quaternion}>
      <Cylinder args={[width, width, distance, 10]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.8 * opacity}
          toneMapped={false}
          transparent
          opacity={opacity}
        />
      </Cylinder>
    </group>
  );
};

const TargetCore = ({ data }) => {
  const materialProps = {
    color: data.flash > 0 ? '#ffffff' : data.color,
    emissive: data.flash > 0 ? '#ffffff' : data.emissive,
    emissiveIntensity: data.type === 'boss' ? 1.2 : 0.55,
    roughness: 0.55,
    metalness: data.type === 'supply' ? 0.35 : 0.15,
  };

  if (data.type === 'boss') {
    return (
      <group>
        <mesh>
          <icosahedronGeometry args={[data.radius, 2]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[data.radius * 1.24, 0.08, 10, 42]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  if (data.type === 'shield') {
    return (
      <group>
        <mesh>
          <dodecahedronGeometry args={[data.radius, 0]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh>
          <sphereGeometry args={[data.radius * 1.2, 24, 16]} />
          <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.75} transparent opacity={0.18} />
        </mesh>
      </group>
    );
  }

  if (data.type === 'fast') {
    return (
      <mesh scale={[0.85, 1.35, 0.85]}>
        <octahedronGeometry args={[data.radius, 0]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    );
  }

  if (data.type === 'supply') {
    return (
      <group>
        <mesh>
          <boxGeometry args={[data.radius * 1.5, data.radius * 1.5, data.radius * 1.5]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[data.radius * 1.1, 0.06, 8, 32]} />
          <meshStandardMaterial color="#bbf7d0" emissive="#22c55e" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  if (data.type === 'bomb') {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[data.radius, 24, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, data.radius * 0.85, 0]}>
          <coneGeometry args={[0.28, 0.62, 10]} />
          <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh>
      <dodecahedronGeometry args={[data.radius, 0]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
};

const Asteroid = ({ data }) => {
  const hpText = data.maxHp > 1 ? `${data.hp}/${data.maxHp}` : data.label;
  return (
    <group position={data.position} rotation={data.rotation}>
      <TargetCore data={data} />
      <Text
        position={[0, 0.1, data.radius + 0.28]}
        fontSize={data.type === 'boss' ? 0.72 : 0.58}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.045}
        outlineColor="#020617"
        maxWidth={4.8}
      >
        {data.text}
      </Text>
      <Text
        position={[0, -data.radius - 0.35, data.radius * 0.65]}
        fontSize={0.32}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#020617"
      >
        {hpText}
      </Text>
    </group>
  );
};

const DefenseBase = ({ shield, freezeTimer, overdrive }) => {
  const shieldRatio = Math.max(0, Math.min(1, shield / 100));
  const hot = overdrive >= 100;
  return (
    <group>
      <mesh position={[0, -2.65, 0]}>
        <cylinderGeometry args={[5.5, 6.4, 1.1, 48]} />
        <meshStandardMaterial
          color="#111827"
          emissive={hot ? '#facc15' : '#1d4ed8'}
          emissiveIntensity={hot ? 0.85 : 0.45}
          metalness={0.75}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, -1.92, 0]}>
        <sphereGeometry args={[1.18 + shieldRatio * 0.25, 32, 32]} />
        <meshStandardMaterial
          color={freezeTimer > 0 ? '#bfdbfe' : hot ? '#facc15' : '#22d3ee'}
          emissive={freezeTimer > 0 ? '#60a5fa' : hot ? '#facc15' : '#06b6d4'}
          emissiveIntensity={freezeTimer > 0 ? 2.8 : hot ? 3.2 : 2.1}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -1.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.05 + shieldRatio * 1.7, 0.045, 8, 80]} />
        <meshStandardMaterial
          color={shieldRatio > 0.45 ? '#22d3ee' : '#fb7185'}
          emissive={shieldRatio > 0.45 ? '#06b6d4' : '#e11d48'}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      <gridHelper args={[32, 16, '#1d4ed8', '#0f172a']} position={[0, -3.16, -1]} />
    </group>
  );
};

export default function World() {
  const asteroids = useMathDefenderStore((state) => state.asteroids);
  const lasers = useMathDefenderStore((state) => state.lasers);
  const updateAsteroids = useMathDefenderStore((state) => state.updateAsteroids);
  const spawnAsteroid = useMathDefenderStore((state) => state.spawnAsteroid);
  const destroyedEvent = useMathDefenderStore((state) => state.destroyedEvent || state.asteroidDestroyedEvent);
  const baseHitEvent = useMathDefenderStore((state) => state.baseHitEvent);
  const clearEvents = useMathDefenderStore((state) => state.clearEvents);
  const wave = useMathDefenderStore((state) => state.wave);
  const shield = useMathDefenderStore((state) => state.baseShield);
  const freezeTimer = useMathDefenderStore((state) => state.freezeTimer);
  const overdrive = useMathDefenderStore((state) => state.overdrive);

  const particleRef = useRef();
  const { shake, ShakeUpdater } = useScreenShake();
  const spawnTimer = useRef(0);

  useFrame((_, dt) => {
    const cappedDt = Math.min(dt, 0.05);
    updateAsteroids(cappedDt);
    spawnTimer.current += cappedDt;
    const currentWave = useMathDefenderStore.getState().wave;
    const spawnInterval = Math.max(0.58, 2.15 - currentWave * 0.12);
    if (spawnTimer.current > spawnInterval) {
      spawnAsteroid();
      spawnTimer.current = 0;
    }
  });

  useEffect(() => {
    if (destroyedEvent) {
      if (particleRef.current) {
        particleRef.current.emit(
          new THREE.Vector3(...destroyedEvent.position),
          { x: 0, y: 0, z: 0 },
          {
            count: destroyedEvent.type === 'boss' ? 44 : 20,
            spread: destroyedEvent.type === 'boss' ? 5 : 2.8,
            speed: destroyedEvent.type === 'boss' ? 7 : 5,
            color: destroyedEvent.color || '#ffaa00',
            lifetime: destroyedEvent.type === 'boss' ? 1.2 : 0.7,
          },
        );
      }
      shake(destroyedEvent.type === 'boss' ? 0.65 : 0.3, destroyedEvent.type === 'boss' ? 420 : 160);
      clearEvents();
    }

    if (baseHitEvent) {
      shake(0.85, 420);
      if (particleRef.current) {
        particleRef.current.emit(
          new THREE.Vector3(0, -2, 0),
          { x: 0, y: 1, z: 0 },
          { count: 36, spread: 5, speed: 8, color: '#ff3355', lifetime: 1 },
        );
      }
      clearEvents();
    }
  }, [destroyedEvent, baseHitEvent, shake, clearEvents]);

  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 22, 58]} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[10, 20, 12]} intensity={2.4} castShadow />
      <pointLight position={[0, -1, 7]} intensity={wave > 3 ? 14 : 8} color={overdrive >= 100 ? '#facc15' : '#22d3ee'} />
      <Stars radius={110} depth={55} count={4200} factor={4} saturation={0} fade speed={0.75} />
      <Environment preset="night" />

      <DefenseBase shield={shield} freezeTimer={freezeTimer} overdrive={overdrive} />

      {asteroids.map((asteroid) => (
        <Asteroid key={asteroid.id} data={asteroid} />
      ))}

      {lasers.map((laser) => (
        <Laser
          key={laser.id}
          start={laser.start}
          end={laser.end}
          life={laser.life}
          maxLife={laser.maxLife}
          color={laser.color}
          width={laser.width}
        />
      ))}

      <InstancedParticles
        particleRef={particleRef}
        count={260}
        color="#ffaa00"
        emissiveIntensity={3}
      />
      <ShakeUpdater />
    </>
  );
}
