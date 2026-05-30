import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useSpaceStore from './GameLogic';

/**
 * Spaceship Player — Elongated octahedron with engine glow and trail particles.
 * Joystick controls pitch/yaw, A = boost, B = shield.
 */
export default function Player() {
  const bodyRef = useRef();
  const meshRef = useRef();
  const trailRef = useRef([]);
  const shieldRef = useRef();
  const engineGlow1 = useRef();
  const engineGlow2 = useRef();
  const lastFireRef = useRef(0);
  const velocityRef = useRef(new THREE.Vector3(0, 0, -1));
  const rotationRef = useRef(new THREE.Euler(0, 0, 0));
  const trailParticles = useRef([]);

  const store = useSpaceStore;
  const trailGeometry = useMemo(() => new THREE.SphereGeometry(0.08, 4, 4), []);

  // Trail particle pool
  const MAX_TRAIL = 40;
  const trailMeshes = useMemo(() => {
    const meshes = [];
    for (let i = 0; i < MAX_TRAIL; i++) {
      meshes.push({
        position: new THREE.Vector3(0, -1000, 0),
        opacity: 0,
        scale: 1,
      });
    }
    return meshes;
  }, []);

  useFrame((state, delta) => {
    const { input, actions, isPlaying, isPaused, boostActive, shieldActive, fuel } =
      store.getState();
    if (!isPlaying || isPaused || !bodyRef.current) return;

    try {
      const body = bodyRef.current;
      const currentPos = body.translation();
      const dt = Math.min(delta, 0.05);

      // Consume fuel over time
      store.getState().useFuel(dt * 0.8);

      // Update timers
      store.getState().updateTimers(dt);

      // Ship rotation from input
      const turnSpeed = 2.5;
      const pitchSpeed = 2.0;
      rotationRef.current.y -= input.dx * turnSpeed * dt;
      rotationRef.current.x -= input.dy * pitchSpeed * dt;
      rotationRef.current.x = THREE.MathUtils.clamp(rotationRef.current.x, -Math.PI / 3, Math.PI / 3);

      // Forward direction from rotation
      const forward = new THREE.Vector3(0, 0, -1);
      const quat = new THREE.Quaternion().setFromEuler(rotationRef.current);
      forward.applyQuaternion(quat);

      // Speed calculation
      const baseSpeed = 12;
      const boostMult = boostActive ? 2.5 : 1;
      const speed = baseSpeed * boostMult * (1 + store.getState().speedBonus * 0.1);

      velocityRef.current.copy(forward).multiplyScalar(speed);

      // Apply velocity
      body.setLinvel(
        { x: velocityRef.current.x, y: velocityRef.current.y, z: velocityRef.current.z },
        true
      );
      body.setRotation(
        { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
        true
      );

      // Boost action (A button)
      if (actions.A) {
        store.getState().activateBoost();
        store.getState().setAction('A', false);
      }

      // Shield action (B button)
      if (actions.B) {
        store.getState().activateShield();
        store.getState().setAction('B', false);
      }

      // Fire projectile (X button)
      if (actions.X) {
        const now = state.clock.elapsedTime;
        if (now - lastFireRef.current > 0.25) {
          lastFireRef.current = now;
          const pos = [currentPos.x, currentPos.y, currentPos.z];
          const dir = [forward.x * 40, forward.y * 40, forward.z * 40];
          store.getState().fireProjectile(pos, dir);
        }
        store.getState().setAction('X', false);
      }

      // Update ship mesh rotation for visual banking
      if (meshRef.current) {
        const bankAngle = -input.dx * 0.4;
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, bankAngle, 5 * dt);
      }

      // Shield visual
      if (shieldRef.current) {
        shieldRef.current.visible = shieldActive;
        if (shieldActive) {
          shieldRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
        }
      }

      // Engine glow
      const glowIntensity = boostActive ? 3 : 1;
      if (engineGlow1.current) {
        engineGlow1.current.material.emissiveIntensity = glowIntensity + Math.sin(state.clock.elapsedTime * 15) * 0.3;
      }
      if (engineGlow2.current) {
        engineGlow2.current.material.emissiveIntensity = glowIntensity + Math.cos(state.clock.elapsedTime * 15) * 0.3;
      }

      // Trail particles
      const trailIdx = Math.floor(state.clock.elapsedTime * 30) % MAX_TRAIL;
      if (trailRef.current[trailIdx]) {
        const engineOffset = new THREE.Vector3(0, 0, 1.5).applyQuaternion(quat);
        trailRef.current[trailIdx].position.set(
          currentPos.x + engineOffset.x,
          currentPos.y + engineOffset.y,
          currentPos.z + engineOffset.z
        );
        trailRef.current[trailIdx].scale.setScalar(boostActive ? 0.3 : 0.15);
        trailRef.current[trailIdx].material.opacity = 1;
      }

      // Fade old trail particles
      trailRef.current.forEach((mesh, i) => {
        if (mesh && i !== trailIdx) {
          mesh.material.opacity *= 0.94;
          mesh.scale.multiplyScalar(0.97);
        }
      });

      // Boundary wrap — keep player in a large sphere
      const maxRadius = 200;
      const dist = Math.sqrt(currentPos.x ** 2 + currentPos.y ** 2 + currentPos.z ** 2);
      if (dist > maxRadius) {
        body.setTranslation(
          { x: -currentPos.x * 0.8, y: -currentPos.y * 0.8, z: -currentPos.z * 0.8 },
          true
        );
      }
    } catch (err) {
      console.warn('[SpacePlayer] Physics error:', err);
    }
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        type="dynamic"
        position={[0, 0, 0]}
        colliders="ball"
        mass={1}
        linearDamping={0.5}
        angularDamping={5}
        gravityScale={0}
        enabledRotations={[false, false, false]}
      >
        <group ref={meshRef}>
          {/* Ship body — elongated octahedron */}
          <mesh castShadow>
            <octahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial
              color="#4f46e5"
              metalness={0.8}
              roughness={0.2}
              emissive="#6366f1"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Scale the octahedron to be elongated */}
          <mesh castShadow scale={[0.6, 0.4, 1.6]}>
            <octahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial
              color="#7c3aed"
              metalness={0.9}
              roughness={0.1}
              emissive="#8b5cf6"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Cockpit canopy */}
          <mesh position={[0, 0.25, -0.5]} scale={[0.3, 0.2, 0.4]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color="#06b6d4"
              metalness={0.3}
              roughness={0.1}
              emissive="#22d3ee"
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Wings */}
          <mesh position={[0.9, 0, 0.3]} rotation={[0, 0, -0.3]} scale={[0.7, 0.05, 0.5]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#4338ca" metalness={0.7} roughness={0.3} emissive="#4f46e5" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[-0.9, 0, 0.3]} rotation={[0, 0, 0.3]} scale={[0.7, 0.05, 0.5]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#4338ca" metalness={0.7} roughness={0.3} emissive="#4f46e5" emissiveIntensity={0.2} />
          </mesh>

          {/* Engine glow — left */}
          <mesh ref={engineGlow1} position={[0.3, 0, 1.2]} scale={[0.15, 0.15, 0.3]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={2}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Engine glow — right */}
          <mesh ref={engineGlow2} position={[-0.3, 0, 1.2]} scale={[0.15, 0.15, 0.3]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color="#fb923c"
              emissive="#fb923c"
              emissiveIntensity={2}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Center engine */}
          <mesh position={[0, 0, 1.4]} scale={[0.12, 0.12, 0.25]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={3}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Shield bubble */}
          <mesh ref={shieldRef} visible={false}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
              wireframe
            />
          </mesh>
        </group>
      </RigidBody>

      {/* Engine trail particles */}
      {Array.from({ length: MAX_TRAIL }).map((_, i) => (
        <mesh
          key={`trail_${i}`}
          ref={(el) => { trailRef.current[i] = el; }}
          position={[0, -1000, 0]}
        >
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#fb923c"
            emissiveIntensity={2}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </>
  );
}
