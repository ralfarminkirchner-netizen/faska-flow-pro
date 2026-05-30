import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useKartStore from './GameLogic';

/**
 * Player Kart — A colorful box-body car with 4 cylinder wheels.
 * Uses Rapier kinematic body for arcade-style racing.
 * Third-person chase camera follows behind the kart.
 */

// Kart body colors
const BODY_COLOR = '#7c3aed';
const BODY_EMISSIVE = '#4c1d95';
const WHEEL_COLOR = '#1e293b';

function Wheel({ position }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
      <meshStandardMaterial color={WHEEL_COLOR} roughness={0.4} />
    </mesh>
  );
}

export default function Player() {
  const rigidBodyRef = useRef();
  const kartGroupRef = useRef();
  const { camera } = useThree();

  // Store selectors
  const raceStarted = useKartStore(s => s.raceStarted);
  const finished = useKartStore(s => s.finished);
  const isPaused = useKartStore(s => s.isPaused);
  const quizActive = useKartStore(s => s.quizActive);
  const boostActive = useKartStore(s => s.boostActive);

  // Refs for smooth camera
  const posRef = useRef(new THREE.Vector3(0, 0.5, -18));
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const cameraTargetRef = useRef(new THREE.Vector3());
  const cameraLookRef = useRef(new THREE.Vector3());

  // Track checkpoint zones for detection
  const checkpoints = useKartStore(s => s.checkpoints);
  const nextCheckpoint = useKartStore(s => s.nextCheckpoint);
  const lastCpRef = useRef(-1);

  // Boost pads positions on the oval
  const boostPads = useMemo(() => [
    { x: 14, z: 0 },
    { x: -14, z: 0 },
  ], []);
  const lastBoostRef = useRef(-1);

  useFrame((state, delta) => {
    if (!raceStarted || finished || isPaused || quizActive) return;

    const dt = Math.min(delta, 0.05);
    const store = useKartStore.getState();
    const { input, actions } = store;

    // Steering
    if (input.dx !== 0) {
      store.steer(-input.dx, dt);
    }

    // Acceleration / Braking
    if (actions.A) {
      store.accelerate(dt);
    } else if (actions.B) {
      store.brake(dt);
    } else {
      store.decelerate(dt);
    }

    // Boost button (X)
    if (actions.X) {
      store.useBoost();
      store.setAction('X', false); // one-shot
    }

    store.updateBoost(dt);
    store.updateRaceTime(dt);
    store.updateAI(dt);

    // Get current values
    const angle = store.playerAngle;
    const speed = store.playerSpeed;
    angleRef.current = angle;
    speedRef.current = speed;

    // Move position
    const dx = Math.sin(angle) * speed * dt;
    const dz = -Math.cos(angle) * speed * dt;
    posRef.current.x += dx;
    posRef.current.z += dz;

    // Boundary clamp (keep on track area)
    const maxRadius = 28;
    const dist = Math.sqrt(posRef.current.x ** 2 + posRef.current.z ** 2);
    if (dist > maxRadius) {
      posRef.current.x *= maxRadius / dist;
      posRef.current.z *= maxRadius / dist;
      // Slow down when hitting boundary
      useKartStore.setState({ playerSpeed: speed * 0.5 });
    }

    // Update rigid body position
    try {
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setTranslation(
          { x: posRef.current.x, y: 0.5, z: posRef.current.z },
          true
        );
        // Build quaternion from angle
        const quat = new THREE.Quaternion();
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        rigidBodyRef.current.setRotation(
          { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
          true
        );
      }
    } catch (e) {
      // Rapier safety
    }

    // Checkpoint detection
    const cp = checkpoints[store.nextCheckpoint];
    if (cp) {
      const cpDist = Math.sqrt(
        (posRef.current.x - cp.x) ** 2 + (posRef.current.z - cp.z) ** 2
      );
      if (cpDist < 5 && lastCpRef.current !== store.nextCheckpoint) {
        lastCpRef.current = store.nextCheckpoint;
        store.passCheckpoint(store.nextCheckpoint);
      }
    }

    // Boost pad detection
    for (let i = 0; i < boostPads.length; i++) {
      const bp = boostPads[i];
      const bpDist = Math.sqrt(
        (posRef.current.x - bp.x) ** 2 + (posRef.current.z - bp.z) ** 2
      );
      if (bpDist < 3 && lastBoostRef.current !== i) {
        lastBoostRef.current = i;
        store.collectBoostPad();
        setTimeout(() => { lastBoostRef.current = -1; }, 3000);
      }
    }

    // Chase camera
    const camDist = 8;
    const camHeight = 4;
    const camX = posRef.current.x - Math.sin(angle) * camDist;
    const camZ = posRef.current.z + Math.cos(angle) * camDist;

    cameraTargetRef.current.set(camX, camHeight, camZ);
    cameraLookRef.current.set(posRef.current.x, 1, posRef.current.z);

    camera.position.lerp(cameraTargetRef.current, 0.08);
    const lp = new THREE.Vector3();
    lp.copy(camera.position);
    camera.lookAt(cameraLookRef.current);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={[0, 0.5, -18]}
      colliders={false}
    >
      <CuboidCollider args={[0.6, 0.3, 1]} />
      <group ref={kartGroupRef}>
        {/* Kart Body */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.2, 0.5, 2]} />
          <meshStandardMaterial
            color={BODY_COLOR}
            emissive={boostActive ? '#ff6600' : BODY_EMISSIVE}
            emissiveIntensity={boostActive ? 1.5 : 0.3}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Cockpit */}
        <mesh position={[0, 0.45, -0.1]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Front spoiler */}
        <mesh position={[0, 0, 1.1]}>
          <boxGeometry args={[1.4, 0.1, 0.3]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
        </mesh>

        {/* Rear wing */}
        <mesh position={[0, 0.6, -1]}>
          <boxGeometry args={[1.3, 0.08, 0.3]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
        </mesh>
        {/* Wing supports */}
        <mesh position={[0.5, 0.4, -1]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[-0.5, 0.4, -1]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Wheels */}
        <Wheel position={[0.7, -0.15, 0.65]} />
        <Wheel position={[-0.7, -0.15, 0.65]} />
        <Wheel position={[0.7, -0.15, -0.65]} />
        <Wheel position={[-0.7, -0.15, -0.65]} />

        {/* Headlights */}
        <mesh position={[0.35, 0.1, 1.05]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="#fef08a" emissiveIntensity={2} color="#fef9c3" />
        </mesh>
        <mesh position={[-0.35, 0.1, 1.05]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="#fef08a" emissiveIntensity={2} color="#fef9c3" />
        </mesh>

        {/* Boost flame effect */}
        {boostActive && (
          <mesh position={[0, 0.1, -1.4]}>
            <coneGeometry args={[0.3, 1.2, 8]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff6600"
              emissiveIntensity={3}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
}
