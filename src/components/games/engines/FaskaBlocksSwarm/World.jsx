import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useBlocksStore, { COLS, ROWS } from './GameLogic';

/**
 * Tetris world: 3D glass well container, background effects,
 * and atmospheric lighting for the Tetris playing field.
 */
export default function World() {
  const particlesRef = useRef();
  const isPlaying = useBlocksStore((s) => s.isPlaying);
  const level = useBlocksStore((s) => s.level);
  const clearingLines = useBlocksStore((s) => s.clearingLines);

  const offsetX = -COLS / 2;
  const offsetY = -ROWS / 2;

  // Background floating particles
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 80; i++) {
      data.push({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        z: -5 - Math.random() * 15,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        size: 0.02 + Math.random() * 0.06,
        colorIndex: Math.floor(Math.random() * 5),
      });
    }
    return data;
  }, []);

  const particleColors = ['#a855f7', '#06b6d4', '#3b82f6', '#22c55e', '#f97316'];

  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particleData[i];
        if (p) {
          child.position.y = p.y + Math.sin(state.clock.elapsedTime * p.speed + p.phase) * 1.5;
          child.position.x = p.x + Math.cos(state.clock.elapsedTime * p.speed * 0.5 + p.phase) * 0.5;
        }
      });
    }
  });

  const wallThickness = 0.15;
  const wellWidth = COLS;
  const wellHeight = ROWS;
  const wellDepth = 1.2;

  return (
    <group>
      {/* === LIGHTING === */}
      <ambientLight intensity={0.35} color="#4a1d96" />
      <directionalLight
        position={[8, 15, 10]}
        intensity={0.7}
        color="#e2e8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, 8, 5]} intensity={0.3} color="#7c3aed" />
      <pointLight position={[0, 12, 5]} intensity={0.4} color="#06b6d4" distance={25} />

      {/* === FOG === */}
      <fog attach="fog" args={['#0a0a1a', 20, 45]} />

      {/* === WELL / CONTAINER === */}
      <group>
        {/* Back wall */}
        <mesh position={[0, 0, -wellDepth / 2 - wallThickness / 2]}>
          <boxGeometry args={[wellWidth + wallThickness * 2, wellHeight, wallThickness]} />
          <meshStandardMaterial
            color="#1a1a3a"
            emissive="#2a1a5a"
            emissiveIntensity={0.3}
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>

        {/* Left wall (glass) */}
        <mesh position={[offsetX - wallThickness / 2, 0, 0]}>
          <boxGeometry args={[wallThickness, wellHeight, wellDepth]} />
          <meshPhysicalMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
            roughness={0.05}
            metalness={0.1}
            transmission={0.6}
            thickness={0.5}
          />
        </mesh>

        {/* Right wall (glass) */}
        <mesh position={[offsetX + COLS + wallThickness / 2, 0, 0]}>
          <boxGeometry args={[wallThickness, wellHeight, wellDepth]} />
          <meshPhysicalMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
            roughness={0.05}
            metalness={0.1}
            transmission={0.6}
            thickness={0.5}
          />
        </mesh>

        {/* Bottom wall */}
        <mesh position={[0, offsetY - wallThickness / 2, 0]}>
          <boxGeometry args={[wellWidth + wallThickness * 2, wallThickness, wellDepth]} />
          <meshStandardMaterial
            color="#2a2a5a"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Wall edge glow strips */}
        {/* Left edge */}
        <mesh position={[offsetX - wallThickness, 0, wellDepth / 2]}>
          <boxGeometry args={[0.05, wellHeight, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={3}
          />
        </mesh>
        {/* Right edge */}
        <mesh position={[offsetX + COLS + wallThickness, 0, wellDepth / 2]}>
          <boxGeometry args={[0.05, wellHeight, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={3}
          />
        </mesh>
        {/* Bottom left corner */}
        <mesh position={[offsetX - wallThickness, offsetY - wallThickness, wellDepth / 2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={4} />
        </mesh>
        <pointLight
          position={[offsetX - wallThickness, offsetY - wallThickness, wellDepth / 2]}
          color="#06b6d4" intensity={2} distance={5}
        />
        {/* Bottom right corner */}
        <mesh position={[offsetX + COLS + wallThickness, offsetY - wallThickness, wellDepth / 2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={4} />
        </mesh>
        <pointLight
          position={[offsetX + COLS + wallThickness, offsetY - wallThickness, wellDepth / 2]}
          color="#06b6d4" intensity={2} distance={5}
        />

        {/* Bottom edge glow */}
        <mesh position={[0, offsetY - wallThickness, wellDepth / 2]}>
          <boxGeometry args={[wellWidth + wallThickness * 2, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={3}
          />
        </mesh>

        {/* Grid lines on back wall */}
        {Array.from({ length: ROWS + 1 }).map((_, i) => (
          <mesh
            key={`hline-${i}`}
            position={[0, i + offsetY, -wellDepth / 2 + 0.01]}
          >
            <boxGeometry args={[wellWidth, 0.01, 0.01]} />
            <meshStandardMaterial
              color="#2a2a5a"
              emissive="#2a2a5a"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
        {Array.from({ length: COLS + 1 }).map((_, i) => (
          <mesh
            key={`vline-${i}`}
            position={[i + offsetX, 0, -wellDepth / 2 + 0.01]}
          >
            <boxGeometry args={[0.01, wellHeight, 0.01]} />
            <meshStandardMaterial
              color="#2a2a5a"
              emissive="#2a2a5a"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* === LINE CLEAR GLOW (ambient flash) === */}
      {clearingLines.length > 0 && (
        <pointLight
          position={[0, 0, 5]}
          color="#ffffff"
          intensity={10}
          distance={20}
        />
      )}

      {/* === FLOATING BACKGROUND PARTICLES === */}
      <group ref={particlesRef}>
        {particleData.map((p, i) => (
          <mesh key={`bgp-${i}`} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.size, 4, 4]} />
            <meshStandardMaterial
              color={particleColors[p.colorIndex]}
              emissive={particleColors[p.colorIndex]}
              emissiveIntensity={2}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* === LEVEL INDICATOR — ambient color shift === */}
      <pointLight
        position={[0, -12, 3]}
        color={level > 5 ? '#ef4444' : level > 3 ? '#f97316' : '#7c3aed'}
        intensity={0.3 + level * 0.05}
        distance={20}
      />
    </group>
  );
}
