import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box, Cylinder, Environment, Float, Sparkles, Stars, Text, Torus } from '@react-three/drei';
import { CatmullRomCurve3, Vector3 } from 'three';
import { LANES, LANE_SPACING, laneToX, useGameStore } from './GameLogic';

const trackWidth = LANE_SPACING * 5.6;

function Card({ card, isActive }) {
  const remaining = card.answer.slice(card.typed.length);
  const scale = card.kind === 'boss' ? [1.18, 1.18, 1.18] : [1, 1, 1];
  const glow = isActive ? 1.2 : card.kind === 'bonus' ? 0.85 : 0.42;

  return (
    <Float speed={card.kind === 'fast' ? 2.6 : 1.4} rotationIntensity={0.08} floatIntensity={0.18}>
      <group position={[laneToX(card.lane), card.y, card.z]} scale={scale}>
        <Box args={[2.34, 1.48, 0.24]} castShadow>
          <meshStandardMaterial
            color={card.flash > 0 ? '#ffffff' : '#111827'}
            emissive={card.color}
            emissiveIntensity={glow}
            metalness={0.18}
            roughness={0.34}
          />
        </Box>
        <Box position={[0, -0.9, 0.01]} args={[2.28, 0.1, 0.28]}>
          <meshStandardMaterial color={card.color} emissive={card.color} emissiveIntensity={1.2} toneMapped={false} />
        </Box>
        {card.kind === 'boss' && (
          <Torus position={[0, 0, -0.08]} args={[1.42, 0.045, 10, 44]}>
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.35} toneMapped={false} />
          </Torus>
        )}
        <Text
          position={[0, 0.46, 0.19]}
          fontSize={0.18}
          color={card.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#020617"
          maxWidth={2.05}
        >
          {card.subject} · {card.kind === 'boss' ? `${card.hp}/${card.maxHp}` : card.kind.toUpperCase()}
        </Text>
        <Text
          position={[0, 0.08, 0.2]}
          fontSize={0.26}
          color="#e0f2fe"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#020617"
          maxWidth={2.04}
          textAlign="center"
        >
          {card.prompt}
        </Text>
        <group position={[0, -0.42, 0.21]}>
          <Text
            position={[-0.03, 0, 0]}
            anchorX="right"
            anchorY="middle"
            fontSize={0.34}
            color="#34d399"
            outlineWidth={0.018}
            outlineColor="#020617"
            maxWidth={1.8}
          >
            {card.typed}
          </Text>
          <Text
            position={[0.03, 0, 0]}
            anchorX="left"
            anchorY="middle"
            fontSize={0.34}
            color="#ffffff"
            outlineWidth={0.018}
            outlineColor="#020617"
            maxWidth={1.8}
          >
            {remaining}
          </Text>
        </group>
      </group>
    </Float>
  );
}

function Laser({ laser }) {
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(0, 1.4, 9.1),
    new Vector3(laser.target[0] * 0.45, 3.2, (laser.target[2] + 9.1) * 0.5),
    new Vector3(...laser.target),
  ]), [laser.target]);
  const opacity = Math.max(0, laser.life / laser.maxLife);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 24, 0.055, 8, false]} />
        <meshBasicMaterial color={laser.color} transparent opacity={opacity} />
      </mesh>
      <Sparkles position={laser.target} count={20} scale={1.4} size={3} speed={0.5} color={laser.color} />
    </group>
  );
}

function Core() {
  const health = useGameStore((state) => state.health);
  const freezeTimer = useGameStore((state) => state.freezeTimer);
  const overdrive = useGameStore((state) => state.overdrive);
  const ratio = Math.max(0, Math.min(1, health / 100));
  const hot = overdrive >= 100;

  return (
    <group position={[0, 0, 9.2]}>
      <Cylinder args={[2.55, 3.2, 0.75, 42]} position={[0, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#111827" emissive={hot ? '#facc15' : '#0ea5e9'} emissiveIntensity={hot ? 0.8 : 0.36} metalness={0.7} roughness={0.24} />
      </Cylinder>
      <mesh position={[0, 1.14, 0]}>
        <sphereGeometry args={[1 + ratio * 0.28, 32, 24]} />
        <meshStandardMaterial
          color={freezeTimer > 0 ? '#bfdbfe' : hot ? '#facc15' : '#22d3ee'}
          emissive={freezeTimer > 0 ? '#60a5fa' : hot ? '#facc15' : '#22d3ee'}
          emissiveIntensity={freezeTimer > 0 ? 2.4 : hot ? 2.9 : 1.9}
          toneMapped={false}
        />
      </mesh>
      <Torus position={[0, 1.14, 0]} rotation={[Math.PI / 2, 0, 0]} args={[1.55 + ratio * 0.7, 0.045, 8, 64]}>
        <meshStandardMaterial color={ratio > 0.35 ? '#22d3ee' : '#fb7185'} emissive={ratio > 0.35 ? '#22d3ee' : '#fb7185'} emissiveIntensity={1.7} toneMapped={false} />
      </Torus>
    </group>
  );
}

function Track() {
  const speedRef = useRef(0);
  const wave = useGameStore((state) => state.wave);
  const freezeTimer = useGameStore((state) => state.freezeTimer);
  const trackRef = useRef();

  useFrame((_, dt) => {
    if (!trackRef.current) return;
    speedRef.current = 8 + wave * 1.2;
    trackRef.current.position.z = (trackRef.current.position.z + speedRef.current * dt * (freezeTimer > 0 ? 0.4 : 1)) % 10;
  });

  return (
    <group ref={trackRef}>
      {Array.from({ length: 16 }, (_, index) => (
        <group key={index} position={[0, -0.06, -index * 10 + 14]}>
          <Box args={[trackWidth, 0.06, 0.48]} receiveShadow>
            <meshStandardMaterial color="#0f172a" emissive="#0ea5e9" emissiveIntensity={0.18} />
          </Box>
          {LANES.map((lane) => (
            <Box key={`${index}-${lane}`} position={[laneToX(lane), 0.03, 0]} args={[0.07, 0.05, 8.8]}>
              <meshStandardMaterial color={lane === 0 ? '#22d3ee' : '#334155'} emissive={lane === 0 ? '#22d3ee' : '#475569'} emissiveIntensity={0.62} toneMapped={false} />
            </Box>
          ))}
        </group>
      ))}
      <mesh position={[0, -0.13, -24]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 150]} />
        <meshStandardMaterial color="#020617" roughness={0.9} metalness={0.14} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const shake = useGameStore((state) => state.shake);
  const targetId = useGameStore((state) => state.activeCardId);
  const cards = useGameStore((state) => state.cards);
  const look = useRef(new Vector3(0, 1.2, 0));

  useFrame((_, dt) => {
    const target = cards.find((card) => card.id === targetId);
    const targetX = target ? laneToX(target.lane) * 0.16 : 0;
    const shakeAmount = shake * 0.45;
    const desired = new Vector3(
      targetX + (Math.random() - 0.5) * shakeAmount,
      8.2 + (Math.random() - 0.5) * shakeAmount,
      19.5,
    );
    camera.position.lerp(desired, Math.min(1, dt * 4.5));
    look.current.lerp(new Vector3(targetX, 1.2, -7), Math.min(1, dt * 3.2));
    camera.lookAt(look.current);
  });

  return null;
}

function GameLoop() {
  const updateGame = useGameStore((state) => state.updateGame);
  const destroyedEvent = useGameStore((state) => state.destroyedEvent);
  const clearDestroyedEvent = useGameStore((state) => state.clearDestroyedEvent);

  useFrame((_, dt) => {
    try {
      updateGame(dt);
    } catch (error) {
      console.error('Type Hero loop error:', error);
    }
  });

  useEffect(() => {
    if (destroyedEvent) clearDestroyedEvent();
  }, [destroyedEvent, clearDestroyedEvent]);

  return null;
}

export default function World() {
  const cards = useGameStore((state) => state.cards);
  const lasers = useGameStore((state) => state.lasers);
  const activeCardId = useGameStore((state) => state.activeCardId);

  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 24, 92]} />
      <ambientLight intensity={0.54} />
      <directionalLight position={[10, 18, 14]} intensity={1.8} castShadow />
      <pointLight position={[0, 4, 10]} intensity={8} color="#22d3ee" />
      <Stars radius={100} depth={54} count={3300} factor={3.5} saturation={0} fade speed={0.45} />
      <Environment preset="night" />

      <Track />
      <Core />
      <CameraRig />
      <GameLoop />

      {cards.map((card) => (
        <Card key={card.id} card={card} isActive={card.id === activeCardId} />
      ))}
      {lasers.map((laser) => (
        <Laser key={laser.id} laser={laser} />
      ))}
    </>
  );
}
