import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useMoorhuhnStore from './GameLogic';

/**
 * Bird target — chicken/bird made of simple geometry.
 * Sphere head, box body, triangle wings that flap.
 */
function BirdTarget({ target, onHit }) {
  const groupRef = useRef();
  const wingPhase = useRef(target.wingPhase);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    wingPhase.current += delta * 8;

    // Update position
    groupRef.current.position.set(...target.position);

    // Bob up and down
    groupRef.current.position.y += Math.sin(Date.now() * 0.003 + target.id) * 0.15;

    // Death animation
    if (!target.alive && target.hitAnim > 0) {
      groupRef.current.position.y -= (1 - target.hitAnim) * 3;
      groupRef.current.rotation.z = (1 - target.hitAnim) * Math.PI * 0.5;
      groupRef.current.scale.setScalar(target.hitAnim);
    }
  });

  const isGolden = target.type === 'golden' || target.type === 'bonus';
  const bodyColor = target.color;
  const faceDir = target.speed > 0 ? 1 : -1;

  return (
    <group ref={groupRef} position={target.position}>
      <group scale={target.size} rotation={[0, faceDir > 0 ? 0 : Math.PI, 0]}>
        {/* Body */}
        <mesh castShadow onClick={(e) => {
          e.stopPropagation();
          if (target.alive) onHit(target.id, [e.point.x, e.point.y, e.point.z]);
        }}>
          <boxGeometry args={[0.8, 0.6, 0.5]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={isGolden ? bodyColor : '#000000'}
            emissiveIntensity={isGolden ? 0.5 : 0}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0.45, 0.35, 0]} castShadow onClick={(e) => {
          e.stopPropagation();
          if (target.alive) onHit(target.id, [e.point.x, e.point.y, e.point.z]);
        }}>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={isGolden ? '#ffdd00' : '#000000'}
            emissiveIntensity={isGolden ? 0.8 : 0}
          />
        </mesh>

        {/* Beak */}
        <mesh position={[0.7, 0.32, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.06, 0.18, 4]} />
          <meshStandardMaterial color="#ff8800" />
        </mesh>

        {/* Eye */}
        <mesh position={[0.55, 0.42, 0.12]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        {/* Left Wing */}
        <group position={[0, 0.1, 0.3]} rotation={[Math.sin(wingPhase.current) * 0.6, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.08, 0.35]} />
            <meshStandardMaterial
              color={bodyColor}
              emissive={isGolden ? bodyColor : '#000000'}
              emissiveIntensity={isGolden ? 0.3 : 0}
            />
          </mesh>
        </group>

        {/* Right Wing */}
        <group position={[0, 0.1, -0.3]} rotation={[-Math.sin(wingPhase.current) * 0.6, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.08, 0.35]} />
            <meshStandardMaterial
              color={bodyColor}
              emissive={isGolden ? bodyColor : '#000000'}
              emissiveIntensity={isGolden ? 0.3 : 0}
            />
          </mesh>
        </group>

        {/* Tail feathers */}
        <mesh position={[-0.5, 0.15, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[-0.48, 0.25, 0.06]} rotation={[0.2, 0, 0.5]}>
          <boxGeometry args={[0.25, 0.12, 0.04]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>

        {/* Legs */}
        <mesh position={[0.1, -0.4, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 4]} />
          <meshStandardMaterial color="#cc6600" />
        </mesh>
        <mesh position={[0.1, -0.4, -0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 4]} />
          <meshStandardMaterial color="#cc6600" />
        </mesh>

        {/* Golden particles for special targets */}
        {isGolden && (
          <pointLight
            color={target.type === 'bonus' ? '#a855f7' : '#ffd700'}
            intensity={2}
            distance={3}
          />
        )}
      </group>
    </group>
  );
}

/**
 * Hit marker that floats up and fades out.
 */
function HitMarker({ marker }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y += 0.02;
    ref.current.material.opacity = marker.time;
  });

  return (
    <sprite ref={ref} position={[marker.position[0], marker.position[1] + 0.5, marker.position[2]]} scale={[1.2, 0.6, 1]}>
      <spriteMaterial
        color={marker.combo > 3 ? '#f59e0b' : '#10b981'}
        transparent
        opacity={marker.time}
      />
    </sprite>
  );
}

/**
 * Crosshair rendered in HTML overlay.
 */
export function Crosshair() {
  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 60,
    }}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="12" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
        <circle cx="20" cy="20" r="2" fill="#ef4444" />
        <line x1="20" y1="2" x2="20" y2="10" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
        <line x1="20" y1="30" x2="20" y2="38" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
        <line x1="2" y1="20" x2="10" y2="20" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
        <line x1="30" y1="20" x2="38" y2="20" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
      </svg>
    </div>
  );
}

/**
 * Player — Handles raycasting on click/tap to hit targets.
 * No character model needed — this is a fixed-camera shooting gallery.
 */
export default function Player() {
  const { camera, raycaster, pointer } = useThree();
  const store = useMoorhuhnStore;

  // Targets scene group
  const targets = useMoorhuhnStore(s => s.targets);
  const hitMarkers = useMoorhuhnStore(s => s.hitMarkers);
  const isPlaying = useMoorhuhnStore(s => s.isPlaying);
  const isPaused = useMoorhuhnStore(s => s.isPaused);
  const quizActive = useMoorhuhnStore(s => s.quizActive);

  const handleShoot = useCallback((targetId, hitPos) => {
    const state = store.getState();
    if (!state.isPlaying || state.isPaused || state.isGameOver || state.quizActive) return;
    state.shootTarget(targetId, hitPos);
  }, [store]);

  const handleMiss = useCallback((e) => {
    const state = store.getState();
    if (!state.isPlaying || state.isPaused || state.isGameOver || state.quizActive) return;
    // Only count as miss if we didn't hit a target (this fires on background click)
    state.shoot();
  }, [store]);

  // Tick game
  useFrame((_, delta) => {
    store.getState().tick(delta);
  });

  return (
    <group>
      {/* Background click catcher */}
      <mesh position={[0, 4, -15]} onClick={handleMiss}>
        <planeGeometry args={[50, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render all targets */}
      {targets.map(target => (
        <BirdTarget key={target.id} target={target} onHit={handleShoot} />
      ))}

      {/* Hit markers */}
      {hitMarkers.map(marker => (
        <HitMarker key={marker.id} marker={marker} />
      ))}
    </group>
  );
}
