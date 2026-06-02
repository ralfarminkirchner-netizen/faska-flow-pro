import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useDoomStore, { DOOM_WEAPONS, DOOM_HAZARDS } from './GameLogic';

/**
 * FPS Player Controller — FIRST PERSON, NO PointerLockControls.
 * Direct camera manipulation via mouse movement events on canvas.
 * WASD movement, click-to-shoot with raycasting, gun model attached to camera.
 */

export default function Player({ particleRef, shake }) {
  const { camera, gl } = useThree();
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const keysRef = useRef(new Set());
  const isLockedRef = useRef(false);
  const gunGroupRef = useRef();
  const muzzleLightRef = useRef();
  const muzzleFlashTimer = useRef(0);
  const gunRecoil = useRef(0);
  const bobPhase = useRef(0);
  const dashBoostRef = useRef(0);
  const lastActionRef = useRef({ A: false, B: false, X: false, Y: false });
  const reusableForward = useRef(new THREE.Vector3());
  const reusableRight = useRef(new THREE.Vector3());
  const reusableDirection = useRef(new THREE.Vector3());
  const gunOffsetRef = useRef(new THREE.Vector3());
  const gunWorldRef = useRef(new THREE.Vector3());

  // Store selectors
  const isPlaying = useDoomStore(s => s.isPlaying);
  const isPaused = useDoomStore(s => s.isPaused);
  const muzzleFlash = useDoomStore(s => s.muzzleFlash);
  const setPlayerPosition = useDoomStore(s => s.setPlayerPosition);
  const setPlayerRotation = useDoomStore(s => s.setPlayerRotation);
  const tickTimers = useDoomStore(s => s.tickTimers);
  const updateEnemies = useDoomStore(s => s.updateEnemies);

  // Joystick input from store
  const input = useDoomStore(s => s.input);
  const actionA = useDoomStore(s => s.actions.A);
  const actionB = useDoomStore(s => s.actions.B);
  const actionX = useDoomStore(s => s.actions.X);
  const actionY = useDoomStore(s => s.actions.Y);

  /* ─── Perform shoot (shared by click and actionA) ─── */
  const performShoot = useCallback(() => {
    try {
      const state = useDoomStore.getState();
      if (!state.isPlaying || state.isPaused) return;

      const weapon = state.shoot();
      if (!weapon) return;

      gunRecoil.current = weapon.id === 'scatter' ? 0.26 : 0.14;
      muzzleFlashTimer.current = 0.1;
      if (shake) shake(weapon.id === 'scatter' ? 0.24 : 0.15, 110);

      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const candidates = state.enemies
        .filter((enemy) => enemy.alive)
        .map((enemy) => {
          const enemyPos = new THREE.Vector3(enemy.position.x, enemy.position.y + 0.25, enemy.position.z);
          const weakpointPos = new THREE.Vector3(
            enemy.position.x,
            enemy.position.y + 0.9 * (enemy.scale || 1),
            enemy.position.z
          );
          const toEnemy = enemyPos.clone().sub(camera.position);
          const toWeakpoint = weakpointPos.clone().sub(camera.position);
          const dist = toEnemy.length();
          if (dist > weapon.range) return null;
          const dot = toEnemy.dot(direction);
          if (dot <= 0) return null;
          const closest = camera.position.clone().add(direction.clone().multiplyScalar(dot));
          const perpDist = closest.distanceTo(enemyPos);
          const weakpointDot = toWeakpoint.dot(direction);
          const weakpointClosest = camera.position.clone().add(direction.clone().multiplyScalar(weakpointDot));
          const weakpointDist = weakpointClosest.distanceTo(weakpointPos);
          const dynamicRadius = (enemy.scale || 1) * weapon.hitRadius + dist * (weapon.id === 'scatter' ? 0.028 : 0.006);
          const weakpointRadius = 0.22 + (enemy.scale || 1) * (weapon.id === 'scatter' ? 0.13 : 0.09);
          const critical = weakpointDot > 0 && weakpointDist <= weakpointRadius;
          if (perpDist > dynamicRadius && !critical) return null;
          return { enemy, dist, perpDist, critical };
        })
        .filter(Boolean)
        .sort((a, b) => (a.critical === b.critical ? a.dist - b.dist : a.critical ? -1 : 1));

      const hits = candidates.slice(0, weapon.pierce);
      if (hits.length === 0) return;

      for (const hit of hits) {
        const falloff = weapon.falloff
          ? Math.max(weapon.falloff, 1 - hit.dist / weapon.range)
          : 1;
        const criticalBonus = hit.critical ? (weapon.id === 'scatter' ? 1.22 : 1.55) : 1;
        const damage = Math.round(weapon.damage * falloff * criticalBonus * (state.ripperModeTimer > 0 ? 1.35 : 1));
        const result = useDoomStore.getState().damageEnemy(hit.enemy.id, damage, hit.critical ? 'critical' : 'shot');
        if (result.hit && particleRef?.current) {
          particleRef.current.emit(
            { x: hit.enemy.position.x, y: hit.enemy.position.y + 0.5, z: hit.enemy.position.z },
            { x: 0, y: 1, z: 0 },
            {
              count: hit.critical ? 18 : result.killed ? 20 : 9,
              spread: hit.critical ? 1.8 : result.killed ? 2.5 : 1.4,
              speed: hit.critical ? 4.6 : result.killed ? 5 : 3,
              color: hit.critical ? '#fef08a' : weapon.color || '#ff4444',
            }
          );
        }
      }
    } catch (e) {
      console.warn('[Player] shoot error:', e);
    }
  }, [camera, shake, particleRef]);

  const performGrenade = useCallback(() => {
    try {
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const impact = useDoomStore.getState().throwGrenade(
        [camera.position.x, camera.position.y, camera.position.z],
        [direction.x, direction.y, direction.z]
      );
      if (impact && particleRef?.current) {
        particleRef.current.emit(
          { x: impact.x, y: 1, z: impact.z },
          { x: 0, y: 1, z: 0 },
          { count: 34, spread: 4.6, speed: 6, color: '#f97316' }
        );
      }
      if (impact && shake) shake(0.38, 190);
    } catch (e) {
      console.warn('[Player] grenade error:', e);
    }
  }, [camera, particleRef, shake]);

  const performDashOrGlory = useCallback(() => {
    try {
      const state = useDoomStore.getState();
      const pos = [camera.position.x, camera.position.y, camera.position.z];
      if (state.performGloryFinisher(pos)) {
        if (shake) shake(0.42, 180);
        return;
      }
      if (state.tryDash()) {
        dashBoostRef.current = 1;
        if (shake) shake(0.18, 90);
      }
    } catch (e) {
      console.warn('[Player] dash/glory error:', e);
    }
  }, [camera, shake]);

  /* ─── Pointer lock + mouse look ─── */
  useEffect(() => {
    const canvas = gl.domElement;

    const requestLock = () => {
      try {
        if (!document.pointerLockElement) {
          const request = canvas.requestPointerLock();
          if (request?.catch) {
            request.catch(() => {
              isLockedRef.current = false;
            });
          }
        }
      } catch (e) {
        console.warn('[Player] pointer lock error:', e);
      }
    };

    const onLockChange = () => {
      isLockedRef.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e) => {
      if (!isLockedRef.current) return;
      const sensitivity = 0.002;
      yawRef.current -= e.movementX * sensitivity;
      pitchRef.current -= e.movementY * sensitivity;
      pitchRef.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitchRef.current));
    };

    const onTouchLook = (e) => {
      const { dx = 0, dy = 0 } = e.detail || {};
      const sensitivity = 0.006;
      yawRef.current -= dx * sensitivity;
      pitchRef.current -= dy * sensitivity;
      pitchRef.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitchRef.current));
    };

    // Click to lock AND shoot
    const onClick = () => {
      if (!isLockedRef.current) {
        requestLock();
      }
      performShoot();
    };

    canvas.addEventListener('mousedown', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('faska:touch-look', onTouchLook);

    return () => {
      canvas.removeEventListener('mousedown', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('faska:touch-look', onTouchLook);
    };
  }, [gl, performShoot]);

  /* ─── Keyboard movement ─── */
  useEffect(() => {
    const onKeyDown = (e) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.code === 'Space') performDashOrGlory();
      if (e.code === 'KeyE') performGrenade();
      if (e.code === 'KeyQ') useDoomStore.getState().switchWeapon();
      if (e.code === 'KeyR') useDoomStore.getState().activateRipperMode();
    };
    const onKeyUp = (e) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [performDashOrGlory, performGrenade]);

  /* ─── Mobile action buttons ─── */
  useEffect(() => {
    const last = lastActionRef.current;
    if (actionA && !last.A && isPlaying && !isPaused) {
      performShoot();
    }
    if (actionB && !last.B && isPlaying && !isPaused) {
      performDashOrGlory();
    }
    if (actionX && !last.X && isPlaying && !isPaused) {
      performGrenade();
    }
    if (actionY && !last.Y && isPlaying && !isPaused) {
      const state = useDoomStore.getState();
      if (!state.activateRipperMode()) state.switchWeapon();
    }
    lastActionRef.current = { A: actionA, B: actionB, X: actionX, Y: actionY };
  }, [actionA, actionB, actionX, actionY, isPlaying, isPaused, performShoot, performDashOrGlory, performGrenade]);

  /* ─── Main game loop ─── */
  useFrame((_, delta) => {
    try {
      if (!isPlaying || isPaused) return;

      const dt = Math.min(delta, 0.05);

      // Tick timers
      tickTimers(dt);

      // Update enemy movement
      const playerPos = useDoomStore.getState().playerPosition;
      updateEnemies(playerPos, dt);

      // ── Movement from keyboard ──
      const keys = keysRef.current;
      let moveX = 0;
      let moveZ = 0;

      if (keys.has('w') || keys.has('arrowup')) moveZ -= 1;
      if (keys.has('s') || keys.has('arrowdown')) moveZ += 1;
      if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
      if (keys.has('d') || keys.has('arrowright')) moveX += 1;

      // Also factor in mobile joystick input
      moveX += input.dx;
      moveZ += input.dy; // negative = forward

      const sprint = keys.has('shift');
      const stateNow = useDoomStore.getState();
      const dashMultiplier = stateNow.dashTimer > 0 ? 2.55 : 1;
      const ripperMoveBonus = stateNow.ripperModeTimer > 0 ? 1.12 : 1;
      const speed = (sprint ? 10 : 6) * dashMultiplier * ripperMoveBonus;

      // Camera-relative movement
      const forward = reusableForward.current.set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current));
      const right = reusableRight.current.set(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current));

      const moveDir = reusableDirection.current.set(0, 0, 0)
        .addScaledVector(forward, -moveZ)
        .addScaledVector(right, moveX);

      if (moveDir.length() > 0) {
        moveDir.normalize();
      } else if (stateNow.dashTimer > 0 && dashBoostRef.current > 0) {
        moveDir.copy(forward);
      }

      // Apply movement
      const pos = camera.position.clone();
      pos.x += moveDir.x * speed * dt;
      pos.z += moveDir.z * speed * dt;
      dashBoostRef.current = Math.max(0, dashBoostRef.current - dt * 5);

      // Clamp to arena bounds
      pos.x = Math.max(-28, Math.min(28, pos.x));
      pos.z = Math.max(-28, Math.min(28, pos.z));
      pos.y = 1.6; // Fixed height (no physics needed for FPS)

      camera.position.copy(pos);

      // ── Camera rotation ──
      const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      // Update store
      setPlayerPosition([pos.x, pos.y, pos.z]);
      setPlayerRotation(yawRef.current);

      for (const hazard of DOOM_HAZARDS) {
        const hx = pos.x - hazard.x;
        const hz = pos.z - hazard.z;
        if (Math.sqrt(hx * hx + hz * hz) < hazard.radius) {
          useDoomStore.getState().touchHazard(hazard);
          break;
        }
      }

      // ── Walking bob ──
      const isMoving = moveDir.length() > 0.01;
      if (isMoving) {
        bobPhase.current += dt * (sprint ? 14 : 9);
      }

      // ── Gun animation ──
      if (gunGroupRef.current) {
        const bob = isMoving ? Math.sin(bobPhase.current) * 0.015 : 0;
        const swayX = isMoving ? Math.cos(bobPhase.current * 0.5) * 0.008 : 0;

        gunOffsetRef.current.set(
          0.38 + swayX,
          -0.36 + bob,
          -0.78
        );
        gunWorldRef.current.copy(gunOffsetRef.current).applyQuaternion(camera.quaternion).add(camera.position);
        gunGroupRef.current.position.copy(gunWorldRef.current);
        gunGroupRef.current.quaternion.copy(camera.quaternion);

        // Recoil spring-back
        gunRecoil.current = THREE.MathUtils.lerp(gunRecoil.current, 0, dt * 12);
        gunGroupRef.current.rotateX(-gunRecoil.current);
        gunGroupRef.current.rotateZ(gunRecoil.current * 0.3);
        const weapon = DOOM_WEAPONS[useDoomStore.getState().weaponId] ?? DOOM_WEAPONS.repeater;
        const scale = weapon.id === 'scatter' ? 1.18 : weapon.id === 'ripper' ? 1.08 : 1;
        gunGroupRef.current.scale.setScalar(scale);
      }

      // ── Muzzle flash decay ──
      if (muzzleLightRef.current) {
        muzzleFlashTimer.current = Math.max(0, muzzleFlashTimer.current - dt);
        const flashIntensity = muzzleFlashTimer.current > 0 ? (muzzleFlashTimer.current / 0.1) * 8 : 0;
        muzzleLightRef.current.intensity = flashIntensity;
      }

    } catch (e) {
      console.warn('[Player] frame error:', e);
    }
  });

  return (
    <group ref={gunGroupRef} position={[0.3, -0.3, -0.5]}>
      {/* Gun body — dark metallic */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.08, 0.45]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.15}
          emissive="#0a0a1e"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Barrel */}
      <mesh position={[0, 0.02, -0.28]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Grip */}
      <mesh position={[0, -0.09, 0.1]} castShadow>
        <boxGeometry args={[0.06, 0.14, 0.08]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Cyan accent strip top */}
      <mesh position={[0, 0.05, -0.1]}>
        <boxGeometry args={[0.09, 0.015, 0.3]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Cyan accent strip side left */}
      <mesh position={[-0.045, 0, -0.05]}>
        <boxGeometry args={[0.01, 0.06, 0.2]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Cyan accent strip side right */}
      <mesh position={[0.045, 0, -0.05]}>
        <boxGeometry args={[0.01, 0.06, 0.2]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Sight dot */}
      <mesh position={[0, 0.065, -0.15]}>
        <boxGeometry args={[0.02, 0.025, 0.04]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#f43f5e"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Muzzle flash light */}
      <pointLight
        ref={muzzleLightRef}
        position={[0, 0, -0.4]}
        color="#22d3ee"
        intensity={0}
        distance={6}
        decay={2}
      />

      {/* Muzzle flash visual */}
      {muzzleFlash && (
        <mesh position={[0, 0, -0.4]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={8}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}
