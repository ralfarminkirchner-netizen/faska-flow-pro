import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useZeldaStore from './GameLogic';

/**
 * Zelda Player — Top-down character with sword swing
 * Green capsule (Link-like), moves on XZ plane
 * Sword hitbox arc on action A
 */

// Sword visual component
function makePixelTexture(draw, size = 32) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function PixelHero({ moving, rolling, shieldActive, spinAttacking, courageTimer }) {
  const state = rolling ? 'roll' : shieldActive ? 'shield' : spinAttacking ? 'spin' : moving ? 'walk' : courageTimer > 0 ? 'focus' : 'idle';
  const texture = useMemo(() => makePixelTexture((ctx) => {
    const p = (color, x, y, w, h) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    ctx.clearRect(0, 0, 32, 32);
    p('rgba(0,0,0,.35)', 9, 27, 14, 3);
    if (state === 'roll') {
      p('#fef08a', 9, 13, 14, 10);
      p('#14532d', 7, 15, 18, 6);
      p('#bbf7d0', 13, 11, 7, 5);
      return;
    }
    p(state === 'focus' ? '#facc15' : '#166534', 9, 4, 14, 6);
    p('#22c55e', 7, 8, 18, 5);
    p('#fed7aa', 11, 11, 10, 8);
    p('#064e3b', 8, 19, 16, 8);
    p('#16a34a', 10, 18, 12, 9);
    p('#111827', 13, 14, 2, 2);
    p('#111827', 18, 14, 2, 2);
    p(moving ? '#92400e' : '#78350f', 8, 26, 5, 3);
    p(moving ? '#92400e' : '#78350f', 19, 26, 5, 3);
    p('#facc15', 10, 21, 12, 2);
    if (shieldActive) {
      p('#38bdf8', 21, 15, 7, 9);
      p('#facc15', 23, 18, 3, 3);
    }
    if (spinAttacking) {
      p('#fef08a', 4, 12, 24, 2);
      p('#facc15', 3, 23, 26, 2);
    }
  }), [state, moving, shieldActive, spinAttacking]);

  return (
    <sprite position={[0, 0.72, 0]} scale={[1.16, 1.32, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function PixelSlash({ active }) {
  const texture = useMemo(() => makePixelTexture((ctx) => {
    const p = (color, x, y, w, h) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    ctx.clearRect(0, 0, 32, 32);
    p('rgba(147,197,253,.45)', 7, 6, 19, 4);
    p('#f8fafc', 9, 8, 18, 3);
    p('#facc15', 21, 11, 5, 3);
    p('rgba(56,189,248,.38)', 5, 16, 20, 3);
  }), []);

  if (!active) return null;
  return (
    <sprite position={[0.34, 0.86, -0.34]} scale={[1.35, 0.82, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function Sword({ swinging }) {
  const swordRef = useRef();
  const swingPhase = useRef(0);

  useFrame((_, delta) => {
    try {
      if (!swordRef.current) return;

      if (swinging) {
        swingPhase.current += delta * 12;
        // Swing arc from -60deg to +60deg
        const angle = Math.sin(swingPhase.current) * 1.2;
        swordRef.current.rotation.y = angle;
        swordRef.current.visible = true;
      } else {
        swingPhase.current = 0;
        swordRef.current.visible = false;
      }
    } catch {
      // Silent
    }
  });

  return (
    <group ref={swordRef} visible={false}>
      {/* Sword blade */}
      <mesh position={[0, 0.3, -0.8]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.9]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.95}
          roughness={0.1}
          emissive="#aaaaff"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Sword handle */}
      <mesh position={[0, 0.3, -0.2]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Crossguard */}
      <mesh position={[0, 0.3, -0.32]}>
        <boxGeometry args={[0.3, 0.06, 0.05]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffaa00"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Swing trail effect */}
      {swinging && (
        <mesh position={[0, 0.3, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.5, 0.02, 4, 16, Math.PI / 2]} />
          <meshBasicMaterial color="#aaddff" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

export default function Player() {
  const bodyRef = useRef();
  const meshGroupRef = useRef();
  const facingAngle = useRef(0);

  const input = useZeldaStore((s) => s.input);
  const actionA = useZeldaStore((s) => s.actions.A);
  const actionB = useZeldaStore((s) => s.actions.B);
  const actionX = useZeldaStore((s) => s.actions.X);
  const actionY = useZeldaStore((s) => s.actions.Y);
  const actionR = useZeldaStore((s) => s.actions.R);
  const actionL = useZeldaStore((s) => s.actions.L);
  const actionZ = useZeldaStore((s) => s.actions.Z);
  const isPlaying = useZeldaStore((s) => s.isPlaying);
  const isPaused = useZeldaStore((s) => s.isPaused);
  const swordSwinging = useZeldaStore((s) => s.swordSwinging);
  const invulnerable = useZeldaStore((s) => s.invulnerable);
  const rolling = useZeldaStore((s) => s.rolling);
  const rollDirection = useZeldaStore((s) => s.rollDirection);
  const shieldActive = useZeldaStore((s) => s.shieldActive);
  const shieldFlash = useZeldaStore((s) => s.shieldFlash);
  const spinAttacking = useZeldaStore((s) => s.spinAttacking);
  const courageTimer = useZeldaStore((s) => s.courageTimer);
  const flurryWindow = useZeldaStore((s) => s.flurryWindow);
  const flurryPulse = useZeldaStore((s) => s.flurryPulse);
  const enemies = useZeldaStore((s) => s.enemies);
  const targetLockId = useZeldaStore((s) => s.targetLockId);
  const roomRevision = useZeldaStore((s) => s.roomRevision);

  const swingSword = useZeldaStore((s) => s.swingSword);
  const startRoll = useZeldaStore((s) => s.startRoll);
  const startSpinAttack = useZeldaStore((s) => s.startSpinAttack);
  const setShieldActive = useZeldaStore((s) => s.setShieldActive);
  const updatePlayerAbilities = useZeldaStore((s) => s.updatePlayerAbilities);
  const hitEnemy = useZeldaStore((s) => s.hitEnemy);
  const setPlayerPosition = useZeldaStore((s) => s.setPlayerPosition);
  const setPlayerDirection = useZeldaStore((s) => s.setPlayerDirection);
  const changeRoom = useZeldaStore((s) => s.changeRoom);
  const updateSwordCooldown = useZeldaStore((s) => s.updateSwordCooldown);
  const collectItem = useZeldaStore((s) => s.collectItem);
  const destroyBush = useZeldaStore((s) => s.destroyBush);
  const destroyPot = useZeldaStore((s) => s.destroyPot);
  const activateSwitch = useZeldaStore((s) => s.activateSwitch);
  const strikeShrine = useZeldaStore((s) => s.strikeShrine);
  const fireArrow = useZeldaStore((s) => s.fireArrow);
  const placeBomb = useZeldaStore((s) => s.placeBomb);
  const toggleTargetLock = useZeldaStore((s) => s.toggleTargetLock);

  // Handle sword action
  const lastActionA = useRef(false);
  useEffect(() => {
    if (actionA && !lastActionA.current && isPlaying && !isPaused) {
      swingSword();
    }
    lastActionA.current = actionA;
  }, [actionA, isPlaying, isPaused, swingSword]);

  const lastActionB = useRef(false);
  useEffect(() => {
    if (actionB && !lastActionB.current && isPlaying && !isPaused) {
      const dx = Math.abs(input.dx) > 0.08 || Math.abs(input.dy) > 0.08 ? input.dx : Math.sin(facingAngle.current);
      const dz = Math.abs(input.dx) > 0.08 || Math.abs(input.dy) > 0.08 ? input.dy : Math.cos(facingAngle.current);
      startRoll([dx, 0, dz]);
    }
    lastActionB.current = actionB;
  }, [actionB, isPlaying, isPaused, input.dx, input.dy, startRoll]);

  useEffect(() => {
    if (!isPlaying || isPaused) {
      setShieldActive(false);
      return;
    }
    setShieldActive(actionX);
  }, [actionX, isPlaying, isPaused, setShieldActive]);

  const fireArrowFromFacing = useCallback(() => {
    const state = useZeldaStore.getState();
    const origin = state.playerPosition;
    const direction = state.playerDirection;
    fireArrow(origin, direction);
  }, [fireArrow]);

  const lastActionY = useRef(false);
  useEffect(() => {
    if (actionY && !lastActionY.current && isPlaying && !isPaused) {
      fireArrowFromFacing();
    }
    lastActionY.current = actionY;
  }, [actionY, fireArrowFromFacing, isPlaying, isPaused]);

  const lastActionR = useRef(false);
  useEffect(() => {
    if (actionR && !lastActionR.current && isPlaying && !isPaused) {
      startSpinAttack();
    }
    lastActionR.current = actionR;
  }, [actionR, isPlaying, isPaused, startSpinAttack]);

  const lastActionL = useRef(false);
  useEffect(() => {
    if (actionL && !lastActionL.current && isPlaying && !isPaused) {
      placeBomb();
    }
    lastActionL.current = actionL;
  }, [actionL, isPlaying, isPaused, placeBomb]);

  const lastActionZ = useRef(false);
  useEffect(() => {
    if (actionZ && !lastActionZ.current && isPlaying && !isPaused) {
      toggleTargetLock();
    }
    lastActionZ.current = actionZ;
  }, [actionZ, isPlaying, isPaused, toggleTargetLock]);

  useEffect(() => {
    try {
      if (!bodyRef.current) return;
      const state = useZeldaStore.getState();
      const [x, y, z] = state.playerPosition;
      bodyRef.current.setTranslation({ x, y, z }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    } catch (error) {
      console.warn('[ZeldaPlayer] room sync error:', error);
    }
  }, [roomRevision]);

  useEffect(() => {
    const handleArrowKey = (event) => {
      if (!isPlaying || isPaused) return;
      if (event.key === 'q' || event.key === 'Q') {
        event.preventDefault();
        fireArrowFromFacing();
      }
	      if (event.key === 'f' || event.key === 'F') {
	        event.preventDefault();
	        startSpinAttack();
	      }
	      if (event.key === 'c' || event.key === 'C') {
	        event.preventDefault();
	        placeBomb();
	      }
	      if (event.key === 'z' || event.key === 'Z') {
	        event.preventDefault();
	        toggleTargetLock();
	      }
	    };
	    window.addEventListener('keydown', handleArrowKey);
	    return () => window.removeEventListener('keydown', handleArrowKey);
	  }, [fireArrowFromFacing, isPlaying, isPaused, placeBomb, startSpinAttack, toggleTargetLock]);

  // Invulnerability flash ref
  const flashRef = useRef(0);

  useFrame((_, delta) => {
    try {
      if (!bodyRef.current || !isPlaying || isPaused) return;

      const clampedDelta = Math.min(delta, 0.05);
      updatePlayerAbilities(clampedDelta);

      // Movement — input.dy maps: negative = up/forward, positive = down/backward
      // In top-down: dx = X movement, dy = Z movement
	      const moveSpeed = shieldActive ? 2.8 : rolling ? 11 : 5;
	      const moveX = rolling ? rollDirection[0] * moveSpeed : input.dx * moveSpeed;
	      const moveZ = rolling ? rollDirection[2] * moveSpeed : input.dy * moveSpeed; // dy positive = move down screen (positive Z)
	      const lockedEnemy = targetLockId ? enemies.find((enemy) => enemy.id === targetLockId && enemy.alive) : null;

	      const vel = bodyRef.current.linvel();
	      bodyRef.current.setLinvel({ x: moveX, y: vel.y, z: moveZ }, true);

      // Update facing direction
	      if (!rolling && (Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1)) {
	        facingAngle.current = Math.atan2(input.dx, input.dy);
	        setPlayerDirection([input.dx, 0, input.dy]);
	      } else if (!rolling && lockedEnemy) {
	        const lockDx = lockedEnemy.position[0] - bodyRef.current.translation().x;
	        const lockDz = lockedEnemy.position[2] - bodyRef.current.translation().z;
	        const lockLen = Math.max(0.001, Math.sqrt(lockDx * lockDx + lockDz * lockDz));
	        facingAngle.current = Math.atan2(lockDx, lockDz);
	        setPlayerDirection([lockDx / lockLen, 0, lockDz / lockLen]);
	      }

      // Rotate character mesh to face movement direction
      if (meshGroupRef.current) {
        if (rolling) {
          meshGroupRef.current.rotation.y = Math.atan2(rollDirection[0], rollDirection[2]);
          meshGroupRef.current.rotation.z = Math.sin(Date.now() * 0.045) * 0.42;
	        } else if (Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1 || lockedEnemy) {
	          meshGroupRef.current.rotation.y = facingAngle.current;
	          meshGroupRef.current.rotation.z = 0;
        } else {
          meshGroupRef.current.rotation.z = 0;
        }
      }

      // Update position in store
      const pos = bodyRef.current.translation();
      setPlayerPosition([pos.x, pos.y, pos.z]);

      // Room transition check
      const roomBound = 9;
      if (pos.z < -roomBound) {
        changeRoom('forward');
      } else if (pos.z > roomBound) {
        changeRoom('backward');
      }

      // Sword hitbox check
	      if (swordSwinging) {
	        const swordReach = targetLockId ? 1.72 : 1.5;
        const swordAngle = facingAngle.current;

        // Check enemies in sword arc
        const aliveEnemies = enemies.filter((e) => e.alive);
        for (const enemy of aliveEnemies) {
          const dx = enemy.position[0] - pos.x;
          const dz = enemy.position[2] - pos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist < swordReach) {
            // Check if enemy is in swing arc (roughly in front)
            const angleToEnemy = Math.atan2(dx, dz);
            let angleDiff = angleToEnemy - swordAngle;
            // Normalize angle
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            if (Math.abs(angleDiff) < Math.PI / 2) {
              const knockDir = dist > 0 ? [dx / dist, 0, dz / dist] : [0, 0, 1];
              hitEnemy(enemy.id, knockDir, 10, 'sword');
            }
          }
        }

        // Check bushes & pots in sword arc
        const store = useZeldaStore.getState();
        for (const bush of store.bushes) {
          if (bush.destroyed) continue;
          const dx = bush.position[0] - pos.x;
          const dz = bush.position[2] - pos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < swordReach) {
            destroyBush(bush.id);
          }
        }
        for (const pot of store.pots) {
          if (pot.destroyed) continue;
          const dx = pot.position[0] - pos.x;
          const dz = pot.position[2] - pos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < swordReach) {
            destroyPot(pot.id);
          }
        }
        for (const button of store.switches) {
          if (button.active) continue;
          const dx = button.position[0] - pos.x;
          const dz = button.position[2] - pos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < swordReach) {
            activateSwitch(button.id, 'sword');
          }
        }
        for (const shrine of store.shrines) {
          if (shrine.solved || shrine.failed) continue;
          const dx = shrine.position[0] - pos.x;
          const dz = shrine.position[2] - pos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < swordReach) {
            strikeShrine(shrine.id);
          }
        }
      }

      // Item pickup check
      const storeState = useZeldaStore.getState();
      if (shieldActive) {
        for (const button of storeState.switches) {
          if (button.active || button.kind !== 'shield') continue;
          const dx = button.position[0] - pos.x;
          const dz = button.position[2] - pos.z;
          if (Math.sqrt(dx * dx + dz * dz) < 1.25) {
            activateSwitch(button.id, 'shield');
          }
        }
      }
      for (const item of storeState.items) {
        if (item.collected) continue;
        const dx = item.position[0] - pos.x;
        const dz = item.position[2] - pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 1.0) {
          collectItem(item.id);
        }
      }

      // Update sword cooldown
      updateSwordCooldown(clampedDelta);

      // Invulnerability flash
      if (invulnerable) {
        flashRef.current += delta * 15;
        if (meshGroupRef.current) {
          meshGroupRef.current.visible = Math.sin(flashRef.current) > 0;
        }
      } else {
        flashRef.current = 0;
        if (meshGroupRef.current) {
          meshGroupRef.current.visible = true;
        }
      }
    } catch (e) {
      console.warn('[ZeldaPlayer] frame error:', e);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      position={[0, 0.5, 0]}
      enabledRotations={[false, false, false]}
      mass={10}
      linearDamping={8}
      colliders="cuboid"
      lockRotations
    >
      <group ref={meshGroupRef}>
        <PixelHero
          moving={Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1}
          rolling={rolling}
          shieldActive={shieldActive}
          spinAttacking={spinAttacking}
          courageTimer={courageTimer || flurryWindow}
        />
        <PixelSlash active={swordSwinging || spinAttacking} />
        <group visible={false}>
        {/* Body — capsule shape */}
        <mesh castShadow position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.22, 0.3, 4, 8]} />
          <meshStandardMaterial
            color="#22aa44"
            emissive={courageTimer > 0 ? "#facc15" : "#115522"}
            emissiveIntensity={courageTimer > 0 ? 0.55 : 0.2}
            flatShading
          />
        </mesh>

        {/* Head */}
        <mesh castShadow position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#ffcc88" flatShading />
        </mesh>

        {/* Hat (Link's cap) */}
        <mesh position={[0, 0.78, -0.05]}>
          <coneGeometry args={[0.15, 0.25, 4]} />
          <meshStandardMaterial
            color="#22aa44"
            emissive="#115522"
            emissiveIntensity={0.3}
            flatShading
          />
        </mesh>
        {/* Hat tip drooping back */}
        <mesh position={[0, 0.75, -0.2]} rotation={[0.8, 0, 0]}>
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshStandardMaterial color="#22aa44" flatShading />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.06, 0.67, 0.15]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#222222" />
        </mesh>
        <mesh position={[-0.06, 0.67, 0.15]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#222222" />
        </mesh>

        {/* Belt */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.06, 8]} />
          <meshStandardMaterial color="#8B4513" metalness={0.25} roughness={0.8} flatShading />
        </mesh>

        {/* Shield on back */}
        <mesh position={shieldActive ? [0, 0.34, 0.36] : [0, 0.35, -0.25]} rotation={shieldActive ? [-0.1, 0, 0] : [0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.35, 0.04]} />
          <meshStandardMaterial
            color={shieldActive ? "#38bdf8" : "#2244aa"}
            metalness={0.6}
            roughness={0.3}
            emissive={shieldFlash > 0 ? "#67e8f9" : "#112266"}
            emissiveIntensity={shieldActive ? 0.8 : 0.2}
            flatShading
          />
        </mesh>
        {/* Shield emblem */}
        <mesh position={shieldActive ? [0, 0.36, 0.4] : [0, 0.37, -0.28]} rotation={shieldActive ? [-0.1, 0, 0] : [0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.12, 0.02]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffaa00"
            emissiveIntensity={0.4}
            metalness={0.8}
            flatShading
          />
        </mesh>
        </group>

        {/* Sword */}
        <Sword swinging={false} />

        {/* Roll / guard ring */}
        {(rolling || shieldActive || spinAttacking || courageTimer > 0 || flurryWindow > 0) && (
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[
              flurryWindow > 0 ? 0.42 : spinAttacking ? 0.38 : 0.34,
              flurryWindow > 0 ? 0.78 + flurryPulse : spinAttacking ? 0.92 : 0.52,
              32,
            ]} />
            <meshBasicMaterial
              color={flurryWindow > 0 ? "#fef08a" : spinAttacking ? "#facc15" : rolling ? "#fef08a" : shieldActive ? "#67e8f9" : "#86efac"}
              transparent
              opacity={flurryWindow > 0 ? 0.66 : spinAttacking ? 0.62 : rolling ? 0.5 : 0.34}
            />
          </mesh>
        )}

        {/* Player shadow */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.3} />
        </mesh>
      </group>
    </RigidBody>
  );
}
