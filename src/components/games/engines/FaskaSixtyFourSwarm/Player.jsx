import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useFaskaSixtyFourStore, {
  FASKA64_ENEMIES,
  FASKA64_LAUNCH_PADS,
  FASKA64_RED_COINS,
  FASKA64_STUNT_RINGS,
} from './GameLogic';

/**
 * Player — Vibrant purple/cyan capsule character with emissive Bloom glow.
 * WASD camera-relative movement, jump, double jump, ground pound.
 * Smooth third-person camera. Zero per-frame allocations.
 */
export default function Player({ particleRef, shake }) {
  const rigidBodyRef = useRef(null);
  const meshRef = useRef(null);
  const { camera } = useThree();

  // Pre-allocated vectors — no per-frame allocations
  const _forward = useRef(new THREE.Vector3()).current;
  const _right = useRef(new THREE.Vector3()).current;
  const _move = useRef(new THREE.Vector3()).current;
  const _camTarget = useRef(new THREE.Vector3(0, 5, 0)).current;
  const _camPos = useRef(new THREE.Vector3(0, 8, 15)).current;
  const _scaleTarget = useRef(new THREE.Vector3(1, 1, 1)).current;

  // Refs for state tracking
  const facingAngle = useRef(0);
  const jumpCooldown = useRef(0);
  const lastActionA = useRef(false);
  const lastActionB = useRef(false);
  const lastActionX = useRef(false);
  const trailTimer = useRef(0);
  const wasGrounded = useRef(true);
  const launchCooldowns = useRef(new Set());

  // Emissive materials with toneMapped=false for Bloom glow
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8b5cf6',
    emissive: '#7c3aed',
    emissiveIntensity: 1.5,
    metalness: 0.3,
    roughness: 0.35,
    toneMapped: false,
  }), []);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#22d3ee',
    emissive: '#06b6d4',
    emissiveIntensity: 2.0,
    metalness: 0.4,
    roughness: 0.25,
    toneMapped: false,
  }), []);

  const eyeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 1.5,
    toneMapped: false,
  }), []);

  const pupilMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e1b4b',
    roughness: 1,
  }), []);

  // Shared geometries
  const capsuleGeo = useMemo(() => new THREE.CapsuleGeometry(0.35, 0.6, 6, 12), []);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.3, 12, 12), []);
  const eyeGeo = useMemo(() => new THREE.SphereGeometry(0.08, 6, 6), []);
  const pupilGeo = useMemo(() => new THREE.SphereGeometry(0.04, 6, 6), []);
  const torusGeo = useMemo(() => new THREE.TorusGeometry(0.37, 0.055, 6, 12), []);
  const coneGeo = useMemo(() => new THREE.ConeGeometry(0.25, 0.35, 6), []);

  useFrame((state, delta) => {
    const store = useFaskaSixtyFourStore;
    const s = store.getState();

    if (!rigidBodyRef.current || !s.isPlaying || s.isPaused || s.quizActive) return;

      const rb = rigidBodyRef.current;
      const dt = Math.min(delta, 0.05);

    try {
      const vel = rb.linvel();
      const { input, actions } = s;
      store.getState().tickWorldTimers(dt);

      // === Camera-relative movement ===
      const cameraYaw = s.cameraYaw ?? 0;
      const cameraPitch = s.cameraPitch ?? 0;
      _forward.set(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
      _right.set(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));

      _move.copy(_right).multiplyScalar(input.dx)
        .addScaledVector(_forward, -input.dy);
      if (_move.lengthSq() > 1) _move.normalize();

      const speed = s.groundPounding ? 3 : 10;
      rb.setLinvel(
        { x: _move.x * speed, y: vel.y, z: _move.z * speed },
        true,
      );

      // Update facing
      if (Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1) {
        facingAngle.current = Math.atan2(_move.x, _move.z);
      }

      // === Ground check via velocity + collision ===
      jumpCooldown.current -= dt;

      // === Jump (Space) ===
      const actionA = actions.A;
      if (actionA && !lastActionA.current && jumpCooldown.current <= 0) {
        if (s.isGrounded) {
          const result = store.getState().jump();
          if (result === 'jump') {
            rb.applyImpulse({ x: 0, y: 14, z: 0 }, true);
            jumpCooldown.current = 0.18;
          }
        } else if (s.doubleJumpAvailable) {
          const result = store.getState().doubleJump();
          if (result === 'doubleJump') {
            rb.setLinvel({ x: vel.x, y: 0, z: vel.z }, true);
            rb.applyImpulse({ x: 0, y: 12, z: 0 }, true);
            jumpCooldown.current = 0.18;
            // Particle burst on double jump
            if (particleRef?.current) {
              const pos = rb.translation();
              particleRef.current.emit(
                { x: pos.x, y: pos.y, z: pos.z },
                { x: 0, y: -1, z: 0 },
                { count: 8, spread: 1.5, speed: 3, color: '#a855f7' },
              );
            }
          }
        }
      }

      // === Ground Pound (Shift) ===
      const actionB = actions.B;
      if (actionB && !lastActionB.current && !s.isGrounded) {
        const result = store.getState().groundPound();
        if (result === 'groundPound') {
          rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rb.applyImpulse({ x: 0, y: -30, z: 0 }, true);
        }
      }

      // === Dash / spin attack (E) ===
      const actionX = actions.X;
      if (actionX && !lastActionX.current) {
        const result = store.getState().useDash();
        if (result) {
          const moving = _move.lengthSq() > 0.01;
          const dashX = moving ? _move.x : Math.sin(facingAngle.current);
          const dashZ = moving ? _move.z : Math.cos(facingAngle.current);
          rb.setLinvel(
            {
              x: dashX * 18,
              y: Math.max(vel.y, 2.5),
              z: dashZ * 18,
            },
            true,
          );
          if (particleRef?.current) {
            const pos = rb.translation();
            particleRef.current.emit(
              { x: pos.x, y: pos.y + 0.35, z: pos.z },
              { x: -dashX, y: 0.25, z: -dashZ },
              { count: 14, spread: 1.2, speed: 5.2, lifetime: 0.55, color: '#22d3ee' },
            );
          }
          if (shake) shake(0.25, 120);
        }
      }

      lastActionA.current = actionA;
      lastActionB.current = actionB;
      lastActionX.current = actionX;

      // === Update store position ===
      const pos = rb.translation();
      store.getState().setPlayerPosition([pos.x, pos.y, pos.z]);

      // === Launch pads ===
      for (const pad of FASKA64_LAUNCH_PADS) {
        const dx = pos.x - pad.pos[0];
        const dy = pos.y - pad.pos[1];
        const dz = pos.z - pad.pos[2];
        if ((dx * dx + dz * dz) < 2.2 && Math.abs(dy) < 2.8 && !launchCooldowns.current.has(pad.id)) {
          launchCooldowns.current.add(pad.id);
          setTimeout(() => launchCooldowns.current.delete(pad.id), 950);
          rb.setLinvel({ x: vel.x * 0.55, y: 0, z: vel.z * 0.55 }, true);
          rb.applyImpulse({ x: dx * 0.35, y: pad.impulse, z: dz * 0.35 }, true);
          store.getState().hitLaunchPad(pad.id);
          if (particleRef?.current) {
            particleRef.current.emit(
              { x: pad.pos[0], y: pad.pos[1] + 0.6, z: pad.pos[2] },
              { x: 0, y: 1, z: 0 },
              { count: 22, spread: 2.2, speed: 6, lifetime: 0.75, color: '#38bdf8' },
            );
          }
          if (shake) shake(0.32, 140);
        }
      }

      // === Red coins ===
      for (let i = 0; i < FASKA64_RED_COINS.length; i++) {
        const coin = FASKA64_RED_COINS[i];
        const dx = pos.x - coin.pos[0];
        const dy = pos.y - coin.pos[1];
        const dz = pos.z - coin.pos[2];
        if ((dx * dx + dy * dy + dz * dz) < 2.8 && store.getState().collectRedCoin(i)) {
          if (particleRef?.current) {
            particleRef.current.emit(
              { x: coin.pos[0], y: coin.pos[1], z: coin.pos[2] },
              { x: 0, y: 1, z: 0 },
              { count: 14, spread: 1.7, speed: 4.5, lifetime: 0.65, color: '#ef4444' },
            );
          }
          if (shake) shake(0.22, 90);
        }
      }

      // === Stunt rings ===
      for (let i = 0; i < FASKA64_STUNT_RINGS.length; i++) {
        const ring = FASKA64_STUNT_RINGS[i];
        const dx = pos.x - ring.pos[0];
        const dy = pos.y - ring.pos[1];
        const dz = pos.z - ring.pos[2];
        if ((dx * dx + dy * dy + dz * dz) < (ring.radius + 0.75) ** 2 && store.getState().passStuntRing(i)) {
          rb.applyImpulse({ x: 0, y: 3.5, z: 0 }, true);
          if (particleRef?.current) {
            particleRef.current.emit(
              { x: ring.pos[0], y: ring.pos[1], z: ring.pos[2] },
              { x: 0, y: 0.5, z: 0 },
              { count: 18, spread: 2.5, speed: 4.6, lifetime: 0.7, color: '#fbbf24' },
            );
          }
          if (shake) shake(0.24, 110);
        }
      }

      // === Stompable enemies ===
      for (let i = 0; i < FASKA64_ENEMIES.length; i++) {
        const enemy = store.getState().enemies[i];
        if (!enemy || enemy.defeated) continue;
        const dx = pos.x - enemy.pos[0];
        const dy = pos.y - enemy.pos[1];
        const dz = pos.z - enemy.pos[2];
        if ((dx * dx + dz * dz) > 2.1 || Math.abs(dy) > 1.9) continue;
        const attacking = s.groundPounding || store.getState().spinTimer > 0 || (vel.y < -4 && pos.y > enemy.pos[1] + 0.42);
        if (attacking && store.getState().defeatEnemy(i)) {
          rb.setLinvel({ x: vel.x * 0.42, y: 10.5, z: vel.z * 0.42 }, true);
          if (particleRef?.current) {
            particleRef.current.emit(
              { x: enemy.pos[0], y: enemy.pos[1] + 0.8, z: enemy.pos[2] },
              { x: 0, y: 1, z: 0 },
              { count: 18, spread: 1.8, speed: 5.2, lifetime: 0.65, color: enemy.color },
            );
          }
          if (shake) shake(0.32, 130);
        } else if (!attacking && s.enemyContactCooldown <= 0) {
          const knockLen = Math.max(0.01, Math.sqrt(dx * dx + dz * dz));
          rb.setLinvel({ x: (dx / knockLen) * 7, y: 5, z: (dz / knockLen) * 7 }, true);
          store.getState().loseLife();
          if (shake) shake(0.5, 220);
        }
      }

      // === Ground pound landing effects ===
      if (s.isGrounded && !wasGrounded.current && s.groundPounding) {
        // Was ground pounding and just landed
        if (shake) shake(0.6, 250);
        if (particleRef?.current) {
          particleRef.current.emit(
            { x: pos.x, y: pos.y, z: pos.z },
            { x: 0, y: 1, z: 0 },
            { count: 16, spread: 2, speed: 5, color: '#8b5cf6' },
          );
        }
      }
      wasGrounded.current = s.isGrounded;

      // === Fall death ===
      if (pos.y < -12) {
        rb.setTranslation({ x: 0, y: 4, z: 0 }, true);
        rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
        store.getState().loseLife();
        if (shake) shake(0.8, 300);
      }

      // === Animate mesh ===
      if (meshRef.current) {
        // Smooth rotation to facing
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          facingAngle.current,
          0.15,
        );

        // Run bob
        const isMoving = Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1;
        if (isMoving && s.isGrounded) {
          meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 12) * 0.04;
        } else {
          meshRef.current.position.y *= 0.9;
        }

        // Squash/stretch
        if (!s.isGrounded) {
          if (s.groundPounding) {
            _scaleTarget.set(1.3, 0.65, 1.3);
          } else if (vel.y > 3) {
            _scaleTarget.set(0.85, 1.2, 0.85);
          } else {
            _scaleTarget.set(1, 1, 1);
          }
        } else {
          _scaleTarget.set(1, 1, 1);
        }
        meshRef.current.scale.lerp(_scaleTarget, 0.2);

      }

      // === Trail particles when moving fast ===
      const hSpeed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      trailTimer.current -= dt;
      if (hSpeed > 6 && trailTimer.current <= 0 && particleRef?.current) {
        trailTimer.current = 0.08;
        particleRef.current.emit(
          { x: pos.x, y: pos.y + 0.3, z: pos.z },
          { x: -vel.x * 0.1, y: 0.5, z: -vel.z * 0.1 },
          { count: 2, spread: 0.3, speed: 1.5, lifetime: 0.4, color: '#c084fc' },
        );
      }

      // === Third-person camera ===
      const cameraDistance = 12;
      const cameraHeight = 6 + cameraPitch * 5;
      _camTarget.set(pos.x, pos.y + 2.7 + cameraPitch * 1.4, pos.z);
      _camPos.set(
        pos.x + Math.sin(cameraYaw) * cameraDistance,
        pos.y + cameraHeight,
        pos.z + Math.cos(cameraYaw) * cameraDistance,
      );

      camera.position.lerp(_camPos, 0.05);
      camera.lookAt(
        THREE.MathUtils.lerp(camera.position.x, _camTarget.x, 0.1),
        THREE.MathUtils.lerp(camera.position.y, _camTarget.y, 0.1),
        THREE.MathUtils.lerp(camera.position.z, _camTarget.z, 0.1),
      );
    } catch (err) {
      console.warn('[Player] Frame error:', err);
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
      onCollisionEnter={() => {
        try {
          const s = useFaskaSixtyFourStore.getState();
          if (!s.isGrounded) {
            const rb = rigidBodyRef.current;
            if (rb && rb.linvel().y <= 0.5) {
              useFaskaSixtyFourStore.getState().land();
            }
          }
        } catch (err) {
          console.warn('[Player] Collision error:', err);
        }
      }}
    >
      <CuboidCollider args={[0.4, 0.65, 0.4]} position={[0, 0.65, 0]} />

      <group ref={meshRef}>
        {/* Body capsule — purple glow */}
        <mesh position={[0, 0.7, 0]} geometry={capsuleGeo} material={bodyMat} castShadow />

        {/* Head */}
        <mesh position={[0, 1.35, 0]} geometry={sphereGeo} material={bodyMat} castShadow />

        {/* Eyes */}
        <mesh position={[-0.12, 1.4, 0.25]} geometry={eyeGeo} material={eyeMat} />
        <mesh position={[0.12, 1.4, 0.25]} geometry={eyeGeo} material={eyeMat} />

        {/* Pupils */}
        <mesh position={[-0.12, 1.4, 0.32]} geometry={pupilGeo} material={pupilMat} />
        <mesh position={[0.12, 1.4, 0.32]} geometry={pupilGeo} material={pupilMat} />

        {/* Belt accent — cyan glow */}
        <mesh position={[0, 0.65, 0]} geometry={torusGeo} material={accentMat} castShadow />

        {/* Hat — cyan cone */}
        <mesh position={[0, 1.65, 0]} geometry={coneGeo} material={accentMat} castShadow />

        {/* Player point light for local illumination */}
        <pointLight color="#8b5cf6" intensity={1.5} distance={5} />
      </group>
    </RigidBody>
  );
}
