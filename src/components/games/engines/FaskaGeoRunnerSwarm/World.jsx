import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Float, Sphere, Stars, Text, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { LANE_SPACING, LANES, laneToX, useRunnerStore } from './GameLogic';

const laneColor = (lane) => (lane === 0 ? '#22d3ee' : Math.abs(lane) === 1 ? '#60a5fa' : '#a78bfa');

export default function World() {
  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 18, 92]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 18, 10]} intensity={1.85} castShadow />
      <pointLight position={[0, 5, 4]} intensity={8} color="#22d3ee" />
      <Stars radius={95} depth={48} count={2800} factor={3.8} saturation={0} fade speed={0.55} />
      <Track />
      <Player />
      <Rows />
      <GameLoop />
    </>
  );
}

function Track() {
  const trackRef = useRef();
  const speed = useRunnerStore((state) => state.speed);
  const boostTimer = useRunnerStore((state) => state.boostTimer);

  useFrame((_, dt) => {
    if (!trackRef.current) return;
    trackRef.current.position.z = (trackRef.current.position.z + speed * dt) % 12;
  });

  return (
    <group ref={trackRef}>
      {Array.from({ length: 18 }, (_, row) => (
        <group key={row} position={[0, -0.08, -row * 12 + 18]}>
          <Box args={[LANE_COUNT_WIDTH, 0.08, 0.7]} receiveShadow>
            <meshStandardMaterial color={boostTimer > 0 ? '#1e3a8a' : '#0f172a'} emissive="#0ea5e9" emissiveIntensity={boostTimer > 0 ? 0.45 : 0.18} />
          </Box>
          {LANES.map((lane) => (
            <Box key={`${row}-${lane}`} position={[laneToX(lane), 0.03, 0]} args={[0.08, 0.06, 10.8]}>
              <meshStandardMaterial color={laneColor(lane)} emissive={laneColor(lane)} emissiveIntensity={0.65} toneMapped={false} />
            </Box>
          ))}
        </group>
      ))}
      <mesh position={[0, -0.14, -36]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 160]} />
        <meshStandardMaterial color="#020617" roughness={0.9} metalness={0.15} />
      </mesh>
    </group>
  );
}

const LANE_COUNT_WIDTH = LANE_SPACING * 5.6;

function Player() {
  const lane = useRunnerStore((state) => state.playerLane);
  const playerY = useRunnerStore((state) => state.playerY);
  const slideTimer = useRunnerStore((state) => state.slideTimer);
  const shield = useRunnerStore((state) => state.shield);
  const invincibleTimer = useRunnerStore((state) => state.invincibleTimer);
  const boostTimer = useRunnerStore((state) => state.boostTimer);
  const groupRef = useRef();
  const tiltRef = useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const targetX = laneToX(lane);
    const currentX = groupRef.current.position.x;
    const nextX = THREE.MathUtils.lerp(currentX, targetX, 12 * dt);
    tiltRef.current = THREE.MathUtils.lerp(tiltRef.current, (currentX - nextX) * 2.7, 9 * dt);
    groupRef.current.position.x = nextX;
    groupRef.current.position.y = 0.75 + playerY;
    groupRef.current.rotation.z = tiltRef.current;
  });

  const sliding = slideTimer > 0;
  const flicker = invincibleTimer > 0.2 && Math.floor(invincibleTimer * 12) % 2 === 0;

  return (
    <group ref={groupRef} position={[0, 0.75, 0]}>
      <group scale={[1, sliding ? 0.55 : 1, 1]}>
        <Box args={[1.15, 0.62, 2.05]} castShadow>
          <meshStandardMaterial
            color={flicker ? '#fef3c7' : '#083344'}
            emissive={boostTimer > 0 ? '#facc15' : '#22d3ee'}
            emissiveIntensity={boostTimer > 0 ? 1.45 : 0.85}
            roughness={0.35}
            metalness={0.28}
          />
        </Box>
        <Box position={[0, 0.45, -0.35]} args={[0.62, 0.48, 0.82]} castShadow>
          <meshStandardMaterial color="#0f172a" emissive="#a78bfa" emissiveIntensity={0.65} />
        </Box>
        <Cylinder args={[0.18, 0.18, 2.28, 14]} position={[-0.72, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} toneMapped={false} />
        </Cylinder>
        <Cylinder args={[0.18, 0.18, 2.28, 14]} position={[0.72, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} toneMapped={false} />
        </Cylinder>
      </group>
      {shield > 0 && (
        <Sphere args={[1.55, 24, 16]}>
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} transparent opacity={Math.min(0.22, 0.08 + shield / 550)} />
        </Sphere>
      )}
    </group>
  );
}

function Rows() {
  const rows = useRunnerStore((state) => state.rows);
  const currentQuestion = useRunnerStore((state) => state.currentQuestion);
  const mode = useRunnerStore((state) => state.mode);

  return (
    <>
      {currentQuestion && (
        <Float speed={1.1} rotationIntensity={0.03} floatIntensity={0.22}>
          <Text
            position={[0, 7.2, -28]}
            fontSize={mode === 'learn' ? 1.05 : 0.85}
            color="#f8fafc"
            outlineWidth={0.035}
            outlineColor="#0f172a"
            anchorX="center"
            anchorY="middle"
            maxWidth={18}
            textAlign="center"
          >
            {currentQuestion}
          </Text>
        </Float>
      )}

      {rows.map((row) => {
        if (row.kind === 'gate') return <GateRow key={row.id} row={row} />;
        if (row.kind === 'obstacle') return <ObstacleRow key={row.id} row={row} />;
        return <PickupRow key={row.id} row={row} />;
      })}
    </>
  );
}

function GateRow({ row }) {
  return (
    <group position={[0, 0, row.z]}>
      <Box position={[0, 4.15, 0]} args={[LANE_COUNT_WIDTH + 1.2, 0.25, 0.3]} castShadow>
        <meshStandardMaterial color="#111827" emissive="#7c3aed" emissiveIntensity={1.35} />
      </Box>
      <Text
        position={[0, 4.72, 0.08]}
        fontSize={0.34}
        color="#c4b5fd"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.018}
        outlineColor="#020617"
      >
        {row.subject}
      </Text>
      {row.doors.map((door) => (
        <group key={`${row.id}-${door.lane}`} position={[laneToX(door.lane), 1.78, 0]}>
          <Box args={[2.35, 3.3, 0.24]} castShadow>
            <meshStandardMaterial
              color="#0f172a"
              emissive={door.correct ? '#22d3ee' : '#334155'}
              emissiveIntensity={door.correct ? 0.42 : 0.14}
              transparent
              opacity={0.78}
            />
          </Box>
          <Box position={[0, -1.82, 0]} args={[2.5, 0.18, 0.4]}>
            <meshStandardMaterial color={laneColor(door.lane)} emissive={laneColor(door.lane)} emissiveIntensity={1.1} toneMapped={false} />
          </Box>
          <Text
            position={[0, 0.1, 0.22]}
            fontSize={0.42}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.026}
            outlineColor="#020617"
            maxWidth={2.15}
            textAlign="center"
          >
            {door.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

function ObstacleRow({ row }) {
  const color = row.obstacle === 'spikes' ? '#fb7185' : row.obstacle === 'lowbar' ? '#facc15' : '#f97316';
  return (
    <group position={[0, 0, row.z]}>
      {row.lanes.map((lane) => (
        <group key={`${row.id}-${lane}`} position={[laneToX(lane), 0, 0]}>
          {row.obstacle === 'hurdle' && (
            <Box position={[0, 0.62, 0]} args={[2.1, 1.2, 0.46]} castShadow>
              <meshStandardMaterial color="#7c2d12" emissive={color} emissiveIntensity={0.55} />
            </Box>
          )}
          {row.obstacle === 'lowbar' && (
            <Box position={[0, 1.95, 0]} args={[2.25, 0.48, 0.48]} castShadow>
              <meshStandardMaterial color="#713f12" emissive={color} emissiveIntensity={0.72} />
            </Box>
          )}
          {row.obstacle === 'blocker' && (
            <Box position={[0, 0.9, 0]} args={[2.12, 1.8, 0.58]} castShadow>
              <meshStandardMaterial color="#450a0a" emissive="#ef4444" emissiveIntensity={0.68} />
            </Box>
          )}
          {row.obstacle === 'spikes' && (
            <group>
              {[0, 1, 2].map((index) => (
                <mesh key={index} position={[-0.7 + index * 0.7, 0.55, 0]} rotation={[0, 0, Math.PI]}>
                  <coneGeometry args={[0.3, 1.1, 6]} />
                  <meshStandardMaterial color="#881337" emissive="#fb7185" emissiveIntensity={0.9} />
                </mesh>
              ))}
            </group>
          )}
          <Text
            position={[0, 2.75, 0.08]}
            fontSize={0.3}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.018}
            outlineColor="#020617"
          >
            {row.obstacle === 'hurdle' ? 'SPRUNG' : row.obstacle === 'lowbar' ? 'SLIDE' : row.obstacle === 'spikes' ? 'SCHILD' : 'AUSWEICHEN'}
          </Text>
        </group>
      ))}
    </group>
  );
}

function PickupRow({ row }) {
  const color = row.pickup === 'shield' ? '#22d3ee' : row.pickup === 'turbo' ? '#facc15' : row.pickup === 'magnet' ? '#a78bfa' : '#34d399';
  const label = row.pickup === 'shield' ? 'SH' : row.pickup === 'turbo' ? 'TB' : row.pickup === 'magnet' ? 'MG' : '+';

  return (
    <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <group position={[laneToX(row.lane), 1.22, row.z]}>
        {row.pickup === 'coin' ? (
          <Torus args={[0.54, 0.1, 12, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
          </Torus>
        ) : (
          <Sphere args={[0.56, 18, 14]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.25} toneMapped={false} />
          </Sphere>
        )}
        <Text
          position={[0, 0.02, 0.64]}
          fontSize={0.24}
          color="#020617"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function GameLoop() {
  const update = useRunnerStore((state) => state.update);
  useFrame((_, dt) => {
    try {
      update(dt);
    } catch (error) {
      console.error('Geo Runner loop error:', error);
    }
  });
  return null;
}
