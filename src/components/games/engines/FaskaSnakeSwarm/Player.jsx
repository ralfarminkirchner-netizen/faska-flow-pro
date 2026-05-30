import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useSnakeStore, { GRID_SIZE, CELL_SIZE } from './GameLogic';

/**
 * Renders the snake: glowing head sphere + trailing body segments
 * with a purple-to-cyan color gradient. Also renders food items
 * and multiplier pickups.
 */
export default function Player() {
  const headRef = useRef();
  const foodRef = useRef();
  const multiplierRef = useRef();
  const particlesRef = useRef();

  // Subscribe to store
  const snakeSegments = useSnakeStore((s) => s.snakeSegments);
  const foodPosition = useSnakeStore((s) => s.foodPosition);
  const foodType = useSnakeStore((s) => s.foodType);
  const multiplierPosition = useSnakeStore((s) => s.multiplierPosition);
  const multiplierActive = useSnakeStore((s) => s.multiplierActive);
  const scoreMultiplier = useSnakeStore((s) => s.scoreMultiplier);
  const isPlaying = useSnakeStore((s) => s.isPlaying);
  const moveSnake = useSnakeStore((s) => s.moveSnake);
  const eatFlash = useSnakeStore((s) => s.eatFlash);

  // Offset to center grid in world
  const offset = -(GRID_SIZE * CELL_SIZE) / 2 + CELL_SIZE / 2;

  // Generate gradient colors for body segments
  const bodyColors = useMemo(() => {
    const colors = [];
    for (let i = 0; i < 200; i++) {
      const t = i / Math.max(1, 199);
      // Purple (#a855f7) → Cyan (#06b6d4)
      const r = THREE.MathUtils.lerp(0.66, 0.02, t);
      const g = THREE.MathUtils.lerp(0.33, 0.71, t);
      const b = THREE.MathUtils.lerp(0.97, 0.83, t);
      colors.push(new THREE.Color(r, g, b));
    }
    return colors;
  }, []);

  // Sparkle particle positions (around food)
  const sparklePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 8; i++) {
      positions.push({
        angle: (i / 8) * Math.PI * 2,
        radius: 0.5 + Math.random() * 0.3,
        speed: 1 + Math.random() * 2,
        yOffset: Math.random() * 0.5,
      });
    }
    return positions;
  }, []);

  // Game tick
  useFrame((state, delta) => {
    if (!isPlaying) return;
    try {
      moveSnake(delta);
    } catch (e) {
      console.error('[Snake Player] moveSnake error:', e);
    }

    // Animate food rotation
    if (foodRef.current) {
      foodRef.current.rotation.y += delta * 2.5;
      foodRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.2;
      foodRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }

    // Animate multiplier
    if (multiplierRef.current) {
      multiplierRef.current.rotation.y += delta * 3;
      multiplierRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
    }
  });

  if (!isPlaying) return null;

  const head = snakeSegments[0];

  return (
    <group>
      {/* === SNAKE HEAD === */}
      <group
        ref={headRef}
        position={[
          head.x * CELL_SIZE + offset,
          0.5,
          head.z * CELL_SIZE + offset,
        ]}
      >
        {/* Main head sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial
            color="#e879f9"
            emissive="#a855f7"
            emissiveIntensity={eatFlash ? 3 : 1.2}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.15, 0.15, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.15, 0.15, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
        {/* Head glow */}
        <pointLight color="#a855f7" intensity={2} distance={3} />
      </group>

      {/* === SNAKE BODY SEGMENTS === */}
      {snakeSegments.slice(1).map((seg, i) => {
        const t = i / Math.max(1, snakeSegments.length - 2);
        const size = THREE.MathUtils.lerp(0.38, 0.22, t);
        const color = bodyColors[Math.min(i, bodyColors.length - 1)];
        const emissiveIntensity = THREE.MathUtils.lerp(0.8, 0.3, t);

        return (
          <mesh
            key={`seg-${i}`}
            position={[
              seg.x * CELL_SIZE + offset,
              0.35 - t * 0.1,
              seg.z * CELL_SIZE + offset,
            ]}
            castShadow
          >
            <sphereGeometry args={[size, 12, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
        );
      })}

      {/* === FOOD ITEM === */}
      <group
        ref={foodRef}
        position={[
          foodPosition.x * CELL_SIZE + offset,
          0.5,
          foodPosition.z * CELL_SIZE + offset,
        ]}
      >
        {/* Star/gem shape using octahedron */}
        <mesh castShadow>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color={foodType === 'bonus' ? '#fbbf24' : '#10b981'}
            emissive={foodType === 'bonus' ? '#f59e0b' : '#059669'}
            emissiveIntensity={2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        {/* Inner glow */}
        <mesh>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Food light */}
        <pointLight
          color={foodType === 'bonus' ? '#fbbf24' : '#10b981'}
          intensity={3}
          distance={4}
        />

        {/* Sparkle particles */}
        {sparklePositions.map((sp, i) => {
          const time = Date.now() * 0.001 * sp.speed;
          const px = Math.cos(sp.angle + time) * sp.radius;
          const pz = Math.sin(sp.angle + time) * sp.radius;
          const py = sp.yOffset + Math.sin(time * 2) * 0.3;
          return (
            <mesh key={`sparkle-${i}`} position={[px, py, pz]}>
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={5}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>

      {/* === MULTIPLIER ITEM === */}
      {multiplierPosition && (
        <group
          ref={multiplierRef}
          position={[
            multiplierPosition.x * CELL_SIZE + offset,
            0.5,
            multiplierPosition.z * CELL_SIZE + offset,
          ]}
        >
          {/* Star shape using dodecahedron */}
          <mesh castShadow>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={2.5}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          {/* "3x" indicator ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.03, 8, 16]} />
            <meshStandardMaterial
              color="#fb923c"
              emissive="#f97316"
              emissiveIntensity={3}
              transparent
              opacity={0.7}
            />
          </mesh>
          <pointLight color="#f97316" intensity={4} distance={5} />
        </group>
      )}

      {/* === SCORE MULTIPLIER INDICATOR (when active) === */}
      {scoreMultiplier > 1 && (
        <group position={[head.x * CELL_SIZE + offset, 1.5, head.z * CELL_SIZE + offset]}>
          <pointLight color="#f97316" intensity={3} distance={5} />
        </group>
      )}
    </group>
  );
}
