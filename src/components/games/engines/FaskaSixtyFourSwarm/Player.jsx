import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import useFaskaSixtyFourStore from './GameLogic';

/**
 * Player — A vibrant purple/cyan capsule character with emissive glow.
 * Features: walking, jumping, double-jumping, ground pounding.
 * Third-person camera follow.
 */
export default function Player() {
  const rigidBodyRef = useRef(null);
  const meshRef = useRef(null);
  const { camera } = useThree();

  // Store refs for non-reactive reads (performance)
  const storeRef = useRef(useFaskaSixtyFourStore);

  // Input tracking refs
  const lastActionARef = useRef(false);
  const lastActionBRef = useRef(false);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 5, 0));
  const cameraOffsetRef = useRef(new THREE.Vector3(0, 8, 15));
  const playerFacingRef = useRef(0); // angle in radians
  const groundCheckCooldown = useRef(0);
  const jumpCooldownRef = useRef(0);

  // Player visual materials
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8b5cf6',
    emissive: '#6d28d9',
    emissiveIntensity: 0.3,
    metalness: 0.2,
    roughness: 0.4,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#22d3ee',
    emissive: '#06b6d4',
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.3,
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 0.8,
  }), []);

  const pupilMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e1b4b',
  }), []);

  // Ground check via raycast
  const { world } = useRapier();

  useFrame((state, delta) => {
    const store = storeRef.current;
    const { input, actions, isPlaying, isPaused, quizActive } = store.getState();

    if (!rigidBodyRef.current) return;
    if (!isPlaying || isPaused || quizActive) return;

    const rb = rigidBodyRef.current;
    const dt = Math.min(delta, 0.05); // cap delta

    try {
      // === Movement ===
      const currentVel = rb.linvel();
      const speed = 8;

      // Calculate movement relative to camera direction
      const moveX = input.dx * speed;
      const moveZ = input.dy * speed;

      rb.setLinvel(
        { x: moveX, y: currentVel.y, z: moveZ },
        true
      );

      // Update player facing direction
      if (Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1) {
        playerFacingRef.current = Math.atan2(input.dx, input.dy);
      }

      // === Ground Check ===
      groundCheckCooldown.current -= dt;
      if (groundCheckCooldown.current <= 0) {
        groundCheckCooldown.current = 0.05; // check every 50ms
        const pos = rb.translation();
        try {
          const ray = new (world.raw?.constructor?.castRay ? world.raw.constructor : Object).Ray
            ? undefined
            : undefined;

          // Simple velocity-based ground check: if vertical velocity is near zero and we were falling
          const vy = currentVel.y;
          if (Math.abs(vy) < 0.5 && pos.y < 50) {
            const storeState = store.getState();
            if (!storeState.isGrounded && !storeState.groundPounding) {
              store.getState().land();
            }
          }
        } catch {
          // Fallback ground check
          const vy = currentVel.y;
          if (Math.abs(vy) < 0.5) {
            const storeState = store.getState();
            if (!storeState.isGrounded) {
              store.getState().land();
            }
          }
        }
      }

      // === Jump ===
      jumpCooldownRef.current -= dt;
      const actionA = actions.A;
      const actionB = actions.B;

      if (actionA && !lastActionARef.current && jumpCooldownRef.current <= 0) {
        const storeState = store.getState();
        if (storeState.isGrounded) {
          const result = store.getState().jump();
          if (result === 'jump') {
            rb.applyImpulse({ x: 0, y: 12, z: 0 }, true);
            jumpCooldownRef.current = 0.2;
          }
        } else if (storeState.doubleJumpAvailable) {
          const result = store.getState().doubleJump();
          if (result === 'doubleJump') {
            // Cancel current vertical velocity then boost
            rb.setLinvel({ x: currentVel.x, y: 0, z: currentVel.z }, true);
            rb.applyImpulse({ x: 0, y: 10, z: 0 }, true);
            jumpCooldownRef.current = 0.2;
          }
        }
      }

      // === Ground Pound ===
      if (actionB && !lastActionBRef.current) {
        const storeState = store.getState();
        if (!storeState.isGrounded) {
          const result = store.getState().groundPound();
          if (result === 'groundPound') {
            rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
            rb.applyImpulse({ x: 0, y: -25, z: 0 }, true);
          }
        }
      }

      lastActionARef.current = actionA;
      lastActionBRef.current = actionB;

      // === Update Position in Store ===
      const pos = rb.translation();
      store.getState().setPlayerPosition([pos.x, pos.y, pos.z]);

      // === Fall Death ===
      if (pos.y < -10) {
        rb.setTranslation({ x: 0, y: 5, z: 0 }, true);
        rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
        store.getState().loseLife();
      }

      // === Animate Mesh ===
      if (meshRef.current) {
        // Rotate character to face movement direction
        const targetRotation = playerFacingRef.current;
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation,
          0.15
        );

        // Bob up and down while moving
        const isMoving = Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1;
        const storeState = store.getState();
        if (isMoving && storeState.isGrounded) {
          meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05;
        } else {
          meshRef.current.position.y = 0;
        }

        // Squash/stretch during jump
        if (!storeState.isGrounded) {
          if (storeState.groundPounding) {
            meshRef.current.scale.set(1.3, 0.7, 1.3);
          } else if (currentVel.y > 2) {
            meshRef.current.scale.set(0.85, 1.2, 0.85);
          } else {
            meshRef.current.scale.set(1, 1, 1);
          }
        } else {
          meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
        }
      }

      // === Camera Follow ===
      const targetPos = new THREE.Vector3(pos.x, pos.y + 3, pos.z);
      cameraTargetRef.current.lerp(targetPos, 0.06);

      const camPos = cameraTargetRef.current.clone().add(cameraOffsetRef.current);
      camera.position.lerp(camPos, 0.04);
      camera.lookAt(cameraTargetRef.current);

    } catch (err) {
      console.warn('[Player] Physics frame error:', err);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 3, 0]}
      colliders={false}
      mass={1}
      linearDamping={0.5}
      angularDamping={10}
      lockRotations
      enabledRotations={[false, false, false]}
      onCollisionEnter={(event) => {
        try {
          const store = storeRef.current;
          const storeState = store.getState();

          // Ground detection on collision
          if (!storeState.isGrounded) {
            const rb = rigidBodyRef.current;
            if (rb) {
              const vel = rb.linvel();
              if (vel.y <= 0.5) {
                store.getState().land();
              }
            }
          }
        } catch (err) {
          console.warn('[Player] Collision error:', err);
        }
      }}
    >
      <CuboidCollider args={[0.4, 0.65, 0.4]} position={[0, 0.65, 0]} />

      <group ref={meshRef}>
        {/* Body — main capsule (purple) */}
        <mesh position={[0, 0.7, 0]} material={bodyMaterial} castShadow>
          <capsuleGeometry args={[0.35, 0.6, 8, 16]} />
        </mesh>

        {/* Head — sphere (purple with cyan accent) */}
        <mesh position={[0, 1.35, 0]} material={bodyMaterial} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.12, 1.4, 0.25]} material={eyeMaterial}>
          <sphereGeometry args={[0.08, 8, 8]} />
        </mesh>
        <mesh position={[0.12, 1.4, 0.25]} material={eyeMaterial}>
          <sphereGeometry args={[0.08, 8, 8]} />
        </mesh>

        {/* Pupils */}
        <mesh position={[-0.12, 1.4, 0.32]} material={pupilMaterial}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        <mesh position={[0.12, 1.4, 0.32]} material={pupilMaterial}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>

        {/* Belt / accent ring (cyan) */}
        <mesh position={[0, 0.65, 0]} material={accentMaterial} castShadow>
          <torusGeometry args={[0.36, 0.06, 8, 16]} />
        </mesh>

        {/* Hat — cone on top (cyan) */}
        <mesh position={[0, 1.6, 0]} material={accentMaterial} castShadow>
          <coneGeometry args={[0.25, 0.3, 8]} />
        </mesh>

        {/* Glow aura — slightly larger transparent sphere */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.08} />
        </mesh>
      </group>
    </RigidBody>
  );
}
