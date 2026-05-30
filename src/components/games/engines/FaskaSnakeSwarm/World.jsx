import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useSnakeStore, { GRID_SIZE, CELL_SIZE } from './GameLogic';

/**
 * Snake game world: grid floor, boundary walls with glow,
 * ambient particles, and atmospheric lighting.
 */
export default function World() {
  const wallsRef = useRef();
  const particlesRef = useRef();
  const isPlaying = useSnakeStore((s) => s.isPlaying);
  const scoreMultiplier = useSnakeStore((s) => s.scoreMultiplier);
  const deathFlash = useSnakeStore((s) => s.deathFlash);

  const gridTotal = GRID_SIZE * CELL_SIZE;
  const halfGrid = gridTotal / 2;

  // Grid line geometry
  const gridLines = useMemo(() => {
    const points = [];
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = i * CELL_SIZE - halfGrid;
      // Horizontal lines
      points.push(new THREE.Vector3(pos, 0.01, -halfGrid));
      points.push(new THREE.Vector3(pos, 0.01, halfGrid));
      // Vertical lines
      points.push(new THREE.Vector3(-halfGrid, 0.01, pos));
      points.push(new THREE.Vector3(halfGrid, 0.01, pos));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [halfGrid]);

  // Floating particles
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 60; i++) {
      data.push({
        x: (Math.random() - 0.5) * gridTotal * 1.5,
        y: Math.random() * 8 + 1,
        z: (Math.random() - 0.5) * gridTotal * 1.5,
        speed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        size: 0.03 + Math.random() * 0.05,
      });
    }
    return data;
  }, [gridTotal]);

  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particleData[i];
        if (p) {
          child.position.y = p.y + Math.sin(state.clock.elapsedTime * p.speed + p.phase) * 0.5;
          child.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * p.speed * 2 + p.phase) * 0.3;
        }
      });
    }
  });

  const wallHeight = 1.5;
  const wallThickness = 0.1;

  return (
    <group>
      {/* === LIGHTING === */}
      <ambientLight intensity={0.3} color="#4a1d96" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.8}
        color="#e2e8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#7c3aed" />
      {/* Rim light */}
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#06b6d4" distance={30} />

      {/* === FOG === */}
      <fog attach="fog" args={['#0a0a1a', 15, 35]} />

      {/* === GROUND PLANE === */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[gridTotal, gridTotal]} />
        <meshStandardMaterial
          color="#0f0f2e"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* === GRID LINES === */}
      <lineSegments geometry={gridLines}>
        <lineBasicMaterial
          color="#2a2a5a"
          transparent
          opacity={0.4}
        />
      </lineSegments>

      {/* === BOUNDARY WALLS === */}
      <group ref={wallsRef}>
        {/* North wall */}
        <mesh position={[0, wallHeight / 2, -halfGrid - wallThickness / 2]}>
          <boxGeometry args={[gridTotal + wallThickness * 2, wallHeight, wallThickness]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={deathFlash ? 5 : 0.5}
            transparent
            opacity={0.25}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* South wall */}
        <mesh position={[0, wallHeight / 2, halfGrid + wallThickness / 2]}>
          <boxGeometry args={[gridTotal + wallThickness * 2, wallHeight, wallThickness]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={deathFlash ? 5 : 0.5}
            transparent
            opacity={0.25}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* East wall */}
        <mesh position={[halfGrid + wallThickness / 2, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, gridTotal]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={deathFlash ? 5 : 0.5}
            transparent
            opacity={0.25}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* West wall */}
        <mesh position={[-halfGrid - wallThickness / 2, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, gridTotal]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={deathFlash ? 5 : 0.5}
            transparent
            opacity={0.25}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Corner glow orbs */}
        {[
          [-halfGrid, 0.5, -halfGrid],
          [halfGrid, 0.5, -halfGrid],
          [-halfGrid, 0.5, halfGrid],
          [halfGrid, 0.5, halfGrid],
        ].map((pos, i) => (
          <group key={`corner-${i}`} position={pos}>
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color="#a855f7"
                emissive="#a855f7"
                emissiveIntensity={3}
              />
            </mesh>
            <pointLight
              color="#a855f7"
              intensity={1.5}
              distance={4}
            />
          </group>
        ))}

        {/* Wall edge glow strips */}
        {/* Top edge — North */}
        <mesh position={[0, wallHeight, -halfGrid]} rotation={[0, 0, 0]}>
          <boxGeometry args={[gridTotal, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Top edge — South */}
        <mesh position={[0, wallHeight, halfGrid]} rotation={[0, 0, 0]}>
          <boxGeometry args={[gridTotal, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Top edge — East */}
        <mesh position={[halfGrid, wallHeight, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.05, gridTotal]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Top edge — West */}
        <mesh position={[-halfGrid, wallHeight, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.05, gridTotal]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* === FLOATING PARTICLES === */}
      <group ref={particlesRef}>
        {particleData.map((p, i) => (
          <mesh key={`particle-${i}`} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.size, 4, 4]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#a855f7' : '#06b6d4'}
              emissive={i % 2 === 0 ? '#a855f7' : '#06b6d4'}
              emissiveIntensity={2}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* === SCORE MULTIPLIER AURA (when active) === */}
      {scoreMultiplier > 1 && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[gridTotal, gridTotal]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={0.3}
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* === DEATH FLASH OVERLAY === */}
      {deathFlash && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[gridTotal * 1.5, gridTotal * 1.5]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={5}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
