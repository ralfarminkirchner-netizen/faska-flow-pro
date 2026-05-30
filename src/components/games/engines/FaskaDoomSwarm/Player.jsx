import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useDoomStore from './GameLogic';

/**
 * FPS Player Controller
 * - First-person camera attached to a physics body
 * - PointerLock for desktop, touch-drag for mobile
 * - Gun model at bottom of screen with muzzle flash
 */

// Crosshair overlay (rendered as HTML)
export function Crosshair() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        <line x1="16" y1="4" x2="16" y2="12" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        <line x1="16" y1="20" x2="16" y2="28" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        <line x1="4" y1="16" x2="12" y2="16" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        <line x1="20" y1="16" x2="28" y2="16" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        <circle cx="16" cy="16" r="2" fill="#ff4444" opacity="0.6" />
      </svg>
    </div>
  );
}

// Gun model component (rendered in 3D space, attached to camera)
function GunModel({ isShooting, muzzleFlash }) {
  const gunRef = useRef();
  const flashRef = useRef();
  const bobPhase = useRef(0);

  useFrame((_, delta) => {
    try {
      if (!gunRef.current) return;
      // Subtle bob animation
      bobPhase.current += delta * 3;
      const bob = Math.sin(bobPhase.current) * 0.005;
      gunRef.current.position.y = -0.35 + bob;

      // Recoil
      if (isShooting) {
        gunRef.current.position.z = 0.08;
        gunRef.current.rotation.x = -0.1;
      } else {
        gunRef.current.position.z = THREE.MathUtils.lerp(
          gunRef.current.position.z,
          0,
          delta * 10
        );
        gunRef.current.rotation.x = THREE.MathUtils.lerp(
          gunRef.current.rotation.x,
          0,
          delta * 10
        );
      }

      // Muzzle flash
      if (flashRef.current) {
        flashRef.current.visible = muzzleFlash;
        if (muzzleFlash) {
          flashRef.current.scale.setScalar(0.8 + Math.random() * 0.4);
        }
      }
    } catch (e) {
      console.warn('[GunModel] frame error:', e);
    }
  });

  return (
    <group ref={gunRef} position={[0.3, -0.35, -0.6]}>
      {/* Gun body */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.08, 0.45]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0.02, -0.25]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Grip */}
      <mesh position={[0, -0.08, 0.1]} castShadow>
        <boxGeometry args={[0.06, 0.12, 0.08]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Sight */}
      <mesh position={[0, 0.06, -0.1]}>
        <boxGeometry args={[0.02, 0.03, 0.06]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      {/* Muzzle flash */}
      <group ref={flashRef} position={[0, 0, -0.38]} visible={false}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
        </mesh>
        <pointLight color="#ffaa00" intensity={8} distance={5} decay={2} />
      </group>
    </group>
  );
}

export default function Player() {
  const bodyRef = useRef();
  const { camera, gl } = useThree();
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const isLockedRef = useRef(false);
  const touchLookIdRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(new THREE.Vector3());

  const input = useDoomStore((s) => s.input);
  const actionA = useDoomStore((s) => s.actions.A);
  const isPlaying = useDoomStore((s) => s.isPlaying);
  const isPaused = useDoomStore((s) => s.isPaused);
  const isShooting = useDoomStore((s) => s.isShooting);
  const muzzleFlash = useDoomStore((s) => s.muzzleFlash);

  const shoot = useDoomStore((s) => s.shoot);
  const setPlayerPosition = useDoomStore((s) => s.setPlayerPosition);
  const damageEnemy = useDoomStore((s) => s.damageEnemy);
  const enemies = useDoomStore((s) => s.enemies);

  // Raycaster for shooting
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const shootDirection = useMemo(() => new THREE.Vector3(), []);

  // Handle shoot action
  const lastActionA = useRef(false);
  useEffect(() => {
    if (actionA && !lastActionA.current && isPlaying && !isPaused) {
      shoot();

      // Raycast to check if we hit an enemy
      try {
        shootDirection.set(0, 0, -1).applyQuaternion(camera.quaternion);
        raycaster.set(camera.position, shootDirection);
        raycaster.far = 50;

        // Check against enemy positions
        const aliveEnemies = enemies.filter((e) => e.alive);
        let closestHit = null;
        let closestDist = Infinity;

        for (const enemy of aliveEnemies) {
          const enemyPos = new THREE.Vector3(...enemy.position);
          const toEnemy = enemyPos.clone().sub(camera.position);
          const dist = toEnemy.length();

          // Project onto look direction
          const dot = toEnemy.dot(shootDirection);
          if (dot <= 0) continue;

          // Cross product to get perpendicular distance
          const cross = new THREE.Vector3().crossVectors(
            shootDirection,
            toEnemy
          );
          const perpDist = cross.length();

          // Hit radius depends on enemy type
          const hitRadius = enemy.type === 'tank' ? 1.2 : 0.8;
          if (perpDist < hitRadius && dist < closestDist) {
            closestHit = enemy;
            closestDist = dist;
          }
        }

        if (closestHit) {
          damageEnemy(closestHit.id, 15);
        }
      } catch (e) {
        console.warn('[Player] shoot raycast error:', e);
      }
    }
    lastActionA.current = actionA;
  }, [actionA, isPlaying, isPaused, shoot, damageEnemy, enemies, camera, raycaster, shootDirection]);

  // Pointer lock for desktop
  const handlePointerLock = useCallback(() => {
    try {
      if (!document.pointerLockElement) {
        gl.domElement.requestPointerLock();
      }
    } catch (e) {
      console.warn('[Player] pointer lock error:', e);
    }
  }, [gl]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onLockChange = () => {
      isLockedRef.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e) => {
      if (!isLockedRef.current) return;
      const sensitivity = 0.002;
      yawRef.current -= e.movementX * sensitivity;
      pitchRef.current -= e.movementY * sensitivity;
      pitchRef.current = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, pitchRef.current)
      );
    };

    // Touch look (right side of screen)
    const onTouchStart = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.clientX > window.innerWidth * 0.5 && touchLookIdRef.current === null) {
          touchLookIdRef.current = touch.identifier;
          touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const onTouchMove = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier === touchLookIdRef.current) {
          const sensitivity = 0.005;
          const dx = touch.clientX - touchStartRef.current.x;
          const dy = touch.clientY - touchStartRef.current.y;
          yawRef.current -= dx * sensitivity;
          pitchRef.current -= dy * sensitivity;
          pitchRef.current = Math.max(
            -Math.PI / 3,
            Math.min(Math.PI / 3, pitchRef.current)
          );
          touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const onTouchEnd = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier === touchLookIdRef.current) {
          touchLookIdRef.current = null;
        }
      }
    };

    canvas.addEventListener('click', handlePointerLock);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('click', handlePointerLock);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl, handlePointerLock]);

  // Main game loop
  useFrame((_, delta) => {
    try {
      if (!bodyRef.current || !isPlaying || isPaused) return;

      const clampedDelta = Math.min(delta, 0.05);

      // Calculate movement direction based on camera yaw
      const moveSpeed = 6;
      const forward = new THREE.Vector3(
        -Math.sin(yawRef.current),
        0,
        -Math.cos(yawRef.current)
      );
      const right = new THREE.Vector3(
        Math.cos(yawRef.current),
        0,
        -Math.sin(yawRef.current)
      );

      // input.dy is inverted: negative = forward (W key)
      const moveDir = new THREE.Vector3()
        .addScaledVector(forward, -input.dy)
        .addScaledVector(right, input.dx);

      if (moveDir.length() > 0) {
        moveDir.normalize();
      }

      // Apply velocity to rigid body
      const vel = bodyRef.current.linvel();
      const targetVel = {
        x: moveDir.x * moveSpeed,
        y: vel.y, // Keep gravity
        z: moveDir.z * moveSpeed,
      };

      bodyRef.current.setLinvel(targetVel, true);

      // Update camera
      const pos = bodyRef.current.translation();
      camera.position.set(pos.x, pos.y + 0.6, pos.z);

      // Apply rotation
      const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      // Update store
      setPlayerPosition([pos.x, pos.y, pos.z]);
    } catch (e) {
      console.warn('[Player] frame error:', e);
    }
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        type="dynamic"
        position={[0, 2, 0]}
        enabledRotations={[false, false, false]}
        mass={80}
        linearDamping={5}
        colliders="cuboid"
        lockRotations
      >
        <mesh visible={false}>
          <capsuleGeometry args={[0.3, 1.0, 4, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>

      {/* Gun model attached to camera */}
      <GunModel isShooting={isShooting} muzzleFlash={muzzleFlash} />
    </>
  );
}
