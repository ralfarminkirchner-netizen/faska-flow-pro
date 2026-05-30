import { useRef, useEffect } from 'react';
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
function Sword({ swinging, playerDirection }) {
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
    } catch (e) {
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
  const isPlaying = useZeldaStore((s) => s.isPlaying);
  const isPaused = useZeldaStore((s) => s.isPaused);
  const swordSwinging = useZeldaStore((s) => s.swordSwinging);
  const invulnerable = useZeldaStore((s) => s.invulnerable);
  const enemies = useZeldaStore((s) => s.enemies);

  const swingSword = useZeldaStore((s) => s.swingSword);
  const hitEnemy = useZeldaStore((s) => s.hitEnemy);
  const setPlayerPosition = useZeldaStore((s) => s.setPlayerPosition);
  const setPlayerDirection = useZeldaStore((s) => s.setPlayerDirection);
  const changeRoom = useZeldaStore((s) => s.changeRoom);
  const updateSwordCooldown = useZeldaStore((s) => s.updateSwordCooldown);
  const collectItem = useZeldaStore((s) => s.collectItem);
  const destroyBush = useZeldaStore((s) => s.destroyBush);
  const destroyPot = useZeldaStore((s) => s.destroyPot);

  // Handle sword action
  const lastActionA = useRef(false);
  useEffect(() => {
    if (actionA && !lastActionA.current && isPlaying && !isPaused) {
      swingSword();
    }
    lastActionA.current = actionA;
  }, [actionA, isPlaying, isPaused, swingSword]);

  // Invulnerability flash ref
  const flashRef = useRef(0);

  useFrame((_, delta) => {
    try {
      if (!bodyRef.current || !isPlaying || isPaused) return;

      const clampedDelta = Math.min(delta, 0.05);

      // Movement — input.dy maps: negative = up/forward, positive = down/backward
      // In top-down: dx = X movement, dy = Z movement
      const moveSpeed = 5;
      const moveX = input.dx * moveSpeed;
      const moveZ = input.dy * moveSpeed; // dy positive = move down screen (positive Z)

      const vel = bodyRef.current.linvel();
      bodyRef.current.setLinvel({ x: moveX, y: vel.y, z: moveZ }, true);

      // Update facing direction
      if (Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1) {
        facingAngle.current = Math.atan2(input.dx, input.dy);
        setPlayerDirection([input.dx, 0, input.dy]);
      }

      // Rotate character mesh to face movement direction
      if (meshGroupRef.current) {
        if (Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1) {
          meshGroupRef.current.rotation.y = facingAngle.current;
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
        const swordReach = 1.5;
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
              hitEnemy(enemy.id, knockDir);
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
      }

      // Item pickup check
      const storeState = useZeldaStore.getState();
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
        {/* Body — capsule shape */}
        <mesh castShadow position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.22, 0.3, 4, 8]} />
          <meshStandardMaterial
            color="#22aa44"
            emissive="#115522"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Head */}
        <mesh castShadow position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#ffcc88" />
        </mesh>

        {/* Hat (Link's cap) */}
        <mesh position={[0, 0.78, -0.05]}>
          <coneGeometry args={[0.15, 0.25, 4]} />
          <meshStandardMaterial
            color="#22aa44"
            emissive="#115522"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Hat tip drooping back */}
        <mesh position={[0, 0.75, -0.2]} rotation={[0.8, 0, 0]}>
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshStandardMaterial color="#22aa44" />
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
          <meshStandardMaterial color="#8B4513" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Shield on back */}
        <mesh position={[0, 0.35, -0.25]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.35, 0.04]} />
          <meshStandardMaterial
            color="#2244aa"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Shield emblem */}
        <mesh position={[0, 0.37, -0.28]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.12, 0.02]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffaa00"
            emissiveIntensity={0.4}
            metalness={0.8}
          />
        </mesh>

        {/* Sword */}
        <Sword swinging={swordSwinging} playerDirection={[0, 0, 1]} />

        {/* Player shadow */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.3} />
        </mesh>
      </group>
    </RigidBody>
  );
}
