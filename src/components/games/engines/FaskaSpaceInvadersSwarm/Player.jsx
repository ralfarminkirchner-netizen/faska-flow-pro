import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useSpaceInvadersStore from './GameLogic';

/**
 * Spaceship — Wedge/triangle shape with glowing engines at bottom.
 * Moves left/right based on input.dx.
 */
export default function Player() {
  const groupRef = useRef();
  const engineGlow = useRef();
  const engineGlow2 = useRef();

  const playerX = useSpaceInvadersStore(s => s.playerX);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth movement
    const targetX = playerX;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 12 * delta;

    // Engine glow pulse
    if (engineGlow.current) {
      engineGlow.current.intensity = 2 + Math.sin(Date.now() * 0.01) * 0.5;
    }
    if (engineGlow2.current) {
      engineGlow2.current.intensity = 1.5 + Math.cos(Date.now() * 0.012) * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main hull — wedge shape */}
      <mesh castShadow rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.25, 0.6]} />
        <meshStandardMaterial color="#1e88e5" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cockpit — pointed front (cone) */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial
          color="#42a5f5"
          emissive="#2196f3"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Cockpit glass */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial
          color="#81d4fa"
          emissive="#4fc3f7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.7, -0.05, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.5, 0.08, 0.4]} />
        <meshStandardMaterial color="#1565c0" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Right wing */}
      <mesh position={[0.7, -0.05, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.5, 0.08, 0.4]} />
        <meshStandardMaterial color="#1565c0" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Left wing tip */}
      <mesh position={[-0.95, -0.1, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color="#0d47a1" emissive="#1565c0" emissiveIntensity={0.2} />
      </mesh>

      {/* Right wing tip */}
      <mesh position={[0.95, -0.1, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color="#0d47a1" emissive="#1565c0" emissiveIntensity={0.2} />
      </mesh>

      {/* Engine left */}
      <mesh position={[-0.35, -0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.2, 6]} />
        <meshStandardMaterial color="#ff6f00" emissive="#ff6f00" emissiveIntensity={0.8} />
      </mesh>

      {/* Engine right */}
      <mesh position={[0.35, -0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.2, 6]} />
        <meshStandardMaterial color="#ff6f00" emissive="#ff6f00" emissiveIntensity={0.8} />
      </mesh>

      {/* Engine glow lights */}
      <pointLight
        ref={engineGlow}
        position={[0, -0.4, 0]}
        color="#ff8f00"
        intensity={2}
        distance={3}
      />
      <pointLight
        ref={engineGlow2}
        position={[0, -0.3, 0]}
        color="#ffab00"
        intensity={1.5}
        distance={2}
      />

      {/* Thruster flames */}
      <mesh position={[-0.35, -0.35, 0]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshBasicMaterial color="#ffab00" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.35, -0.35, 0]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshBasicMaterial color="#ffab00" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
