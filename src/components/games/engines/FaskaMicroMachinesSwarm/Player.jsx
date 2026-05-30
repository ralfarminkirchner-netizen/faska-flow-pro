import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useMicroStore from './GameLogic';

/**
 * Player — Tiny car viewed from above.
 * Rotates with joystick left/right, accelerates forward with A.
 * Physics-based sliding/drifting feel.
 * Uses store-driven position (no Rapier rigid body for top-down simplicity).
 */

export default function Player() {
  const carRef = useRef();
  const trailRef = useRef([]);
  const trailMeshRefs = useRef([]);

  const raceStarted = useMicroStore(s => s.raceStarted);
  const finished = useMicroStore(s => s.finished);
  const isPaused = useMicroStore(s => s.isPaused);
  const quizActive = useMicroStore(s => s.quizActive);
  const isDrifting = useMicroStore(s => s.isDrifting);
  const collisionSlowdown = useMicroStore(s => s.collisionSlowdown);

  // Obstacle collision check refs
  const lastCollisionRef = useRef(0);

  useFrame((state, delta) => {
    if (!raceStarted || finished || isPaused || quizActive) return;

    const dt = Math.min(delta, 0.05);
    const store = useMicroStore.getState();
    const { input, actions } = store;

    // Steering
    if (input.dx !== 0) {
      store.steer(-input.dx, dt);
    } else {
      // Reset drift when not steering
      if (store.isDrifting) {
        useMicroStore.setState({ isDrifting: false, driftAngle: 0 });
      }
    }

    // Acceleration / Braking
    if (actions.A) {
      store.accelerate(dt);
    } else if (actions.B) {
      store.brake(dt);
    } else {
      store.decelerate(dt);
    }

    // Update position
    store.updatePosition(dt);
    store.updateRaceTime(dt);

    // Get latest state after updates
    const { carPosition, carAngle, carSpeed, checkpoints, nextCheckpoint, obstacles } = store;

    // Update visual mesh
    if (carRef.current) {
      carRef.current.position.set(carPosition.x, 0.3, carPosition.z);
      carRef.current.rotation.y = carAngle + (store.driftAngle || 0);
    }

    // Checkpoint detection
    const cp = checkpoints[nextCheckpoint];
    if (cp) {
      const cpDist = Math.sqrt(
        (carPosition.x - cp.x) ** 2 + (carPosition.z - cp.z) ** 2
      );
      if (cpDist < 4) {
        store.passCheckpoint(nextCheckpoint);
      }
    }

    // Obstacle collision detection
    const now = state.clock.getElapsedTime();
    if (now - lastCollisionRef.current > 0.5) {
      for (const obs of obstacles) {
        let hitRadius = 1.5;
        if (obs.type === 'pencil') hitRadius = 1.2;
        if (obs.type === 'eraser') hitRadius = 1.0;
        if (obs.type === 'coin') hitRadius = 0.8;
        if (obs.type === 'bottlecap') hitRadius = 0.7;

        const dist = Math.sqrt(
          (carPosition.x - obs.x) ** 2 + (carPosition.z - obs.z) ** 2
        );
        if (dist < hitRadius && Math.abs(carSpeed) > 1) {
          store.collideObstacle();
          lastCollisionRef.current = now;
          break;
        }
      }
    }
  });

  return (
    <group ref={carRef} position={[0, 0.3, -12]}>
      {/* Car body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.25, 1.0]} />
        <meshStandardMaterial
          color={collisionSlowdown > 0 ? '#ef4444' : '#7c3aed'}
          emissive={collisionSlowdown > 0 ? '#ef4444' : '#4c1d95'}
          emissiveIntensity={collisionSlowdown > 0 ? 1.5 : 0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.15, -0.05]}>
        <boxGeometry args={[0.45, 0.12, 0.35]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, -0.02, 0.52]}>
        <boxGeometry args={[0.65, 0.1, 0.12]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
      </mesh>

      {/* Rear spoiler */}
      <mesh position={[0, 0.2, -0.5]}>
        <boxGeometry args={[0.7, 0.06, 0.12]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>

      {/* Wheels */}
      {[
        [0.32, -0.08, 0.3],
        [-0.32, -0.08, 0.3],
        [0.32, -0.08, -0.3],
        [-0.32, -0.08, -0.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}

      {/* Headlights */}
      <mesh position={[0.18, 0, 0.52]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial emissive="#fef08a" emissiveIntensity={3} color="#fef9c3" />
      </mesh>
      <mesh position={[-0.18, 0, 0.52]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial emissive="#fef08a" emissiveIntensity={3} color="#fef9c3" />
      </mesh>

      {/* Tail lights */}
      <mesh position={[0.2, 0, -0.52]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial emissive="#ef4444" emissiveIntensity={2} color="#fca5a5" />
      </mesh>
      <mesh position={[-0.2, 0, -0.52]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial emissive="#ef4444" emissiveIntensity={2} color="#fca5a5" />
      </mesh>

      {/* Drift smoke effect */}
      {isDrifting && (
        <>
          <mesh position={[0.3, 0, -0.5]}>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial
              color="#94a3b8"
              transparent
              opacity={0.4}
              emissive="#64748b"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[-0.3, 0, -0.5]}>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial
              color="#94a3b8"
              transparent
              opacity={0.4}
              emissive="#64748b"
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
