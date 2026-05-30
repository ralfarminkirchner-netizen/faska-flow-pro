import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useRPGStore from './GameLogic';

/**
 * RPG Player — Dual character system (Luna rabbit / Bruno bear).
 * Luna: Purple capsule with ears, fast + ranged magic.
 * Bruno: Brown capsule with round ears, slower + melee power.
 * Uses billboard sprites from /assets/characters/ when available.
 */
export default function Player() {
  const bodyRef = useRef();
  const groupRef = useRef();
  const spriteRef = useRef();
  const attackVisualRef = useRef();
  const attackTimerRef = useRef(0);
  const facingRef = useRef(new THREE.Vector3(0, 0, -1));

  const store = useRPGStore;

  // Try loading character textures
  const lunaTexture = useMemo(() => {
    try {
      const tex = new THREE.TextureLoader().load('/assets/characters/luna-rabbit.png');
      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      return tex;
    } catch { return null; }
  }, []);

  const brunoTexture = useMemo(() => {
    try {
      const tex = new THREE.TextureLoader().load('/assets/characters/bruno-bear.png');
      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      return tex;
    } catch { return null; }
  }, []);

  useFrame((state, delta) => {
    const {
      input, actions, isPlaying, isPaused, currentCharacter,
      attackCooldown,
    } = store.getState();
    if (!isPlaying || isPaused || !bodyRef.current) return;

    try {
      const body = bodyRef.current;
      const dt = Math.min(delta, 0.05);

      // Update timers
      store.getState().updateTimers(dt);

      // Movement
      const isLuna = currentCharacter === 'luna';
      const moveSpeed = isLuna ? 8 : 5.5;
      const dx = input.dx * moveSpeed;
      const dz = input.dy * moveSpeed;

      body.setLinvel({ x: dx, y: body.linvel().y, z: dz }, true);

      // Facing direction
      if (Math.abs(input.dx) > 0.1 || Math.abs(input.dy) > 0.1) {
        facingRef.current.set(input.dx, 0, input.dy).normalize();
      }

      // Character visual
      if (groupRef.current) {
        // Bounce animation while moving
        const moving = Math.abs(dx) > 0.5 || Math.abs(dz) > 0.5;
        if (moving) {
          groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.1;
          groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.05;
        } else {
          groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 5 * dt);
          groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 5 * dt);
        }

        // Flip sprite based on facing
        if (spriteRef.current) {
          spriteRef.current.scale.x = facingRef.current.x < -0.1 ? -2 : 2;
        }
      }

      // Attack (A button)
      if (actions.A && attackCooldown <= 0) {
        const result = store.getState().attack();
        if (result) {
          attackTimerRef.current = 0.3;

          if (result.isRanged) {
            // Luna — fire magic projectile
            const pos = body.translation();
            const dir = [facingRef.current.x * 15, 0, facingRef.current.z * 15];
            store.getState().addProjectile(
              [pos.x, pos.y + 0.5, pos.z],
              dir,
              result.damage
            );
          } else {
            // Bruno — melee arc hitbox
            const pos = body.translation();
            const enemies = store.getState().enemies;
            const meleeRange = 2.5;
            enemies.forEach((enemy) => {
              const ex = enemy.position[0] - pos.x;
              const ez = enemy.position[2] - pos.z;
              const dist = Math.sqrt(ex * ex + ez * ez);
              if (dist < meleeRange && enemy.stunTimer <= 0) {
                store.getState().damageEnemy(enemy.id, result.damage, enemy.position);
              }
            });
          }
        }
        store.getState().setAction('A', false);
      }

      // Use item (B button)
      if (actions.B) {
        store.getState().useItem();
        store.getState().setAction('B', false);
      }

      // Switch character (X button)
      if (actions.X) {
        store.getState().switchCharacter();
        store.getState().setAction('X', false);
      }

      // Attack visual timer
      if (attackTimerRef.current > 0) {
        attackTimerRef.current -= dt;
        if (attackVisualRef.current) {
          attackVisualRef.current.visible = true;
          attackVisualRef.current.scale.setScalar(1 + (0.3 - attackTimerRef.current) * 5);
          attackVisualRef.current.material.opacity = attackTimerRef.current / 0.3;
        }
      } else if (attackVisualRef.current) {
        attackVisualRef.current.visible = false;
      }

      // Boundary clamp
      const pos = body.translation();
      const bound = 45;
      if (Math.abs(pos.x) > bound || Math.abs(pos.z) > bound) {
        body.setTranslation({
          x: THREE.MathUtils.clamp(pos.x, -bound, bound),
          y: pos.y,
          z: THREE.MathUtils.clamp(pos.z, -bound, bound),
        }, true);
      }
    } catch (err) {
      console.warn('[RPGPlayer] Physics error:', err);
    }
  });

  const currentCharacter = useRPGStore((s) => s.currentCharacter);
  const isLuna = currentCharacter === 'luna';
  const playerHP = useRPGStore((s) => s.playerHP);
  const playerMaxHP = useRPGStore((s) => s.playerMaxHP);

  return (
    <>
      <RigidBody
        ref={bodyRef}
        type="dynamic"
        position={[0, 1, 0]}
        colliders={false}
        mass={1}
        linearDamping={3}
        angularDamping={10}
        lockRotations
        enabledRotations={[false, false, false]}
      >
        <CuboidCollider args={[0.4, 0.6, 0.4]} position={[0, 0.6, 0]} />

        <group ref={groupRef}>
          {/* Billboard sprite with character texture */}
          {((isLuna && lunaTexture) || (!isLuna && brunoTexture)) ? (
            <sprite
              ref={spriteRef}
              position={[0, 1.2, 0]}
              scale={[2, 2, 1]}
            >
              <spriteMaterial
                map={isLuna ? lunaTexture : brunoTexture}
                transparent
                alphaTest={0.1}
              />
            </sprite>
          ) : (
            /* Fallback geometric character */
            <group>
              {isLuna ? (
                // Luna — Light purple rabbit
                <group>
                  {/* Body */}
                  <mesh position={[0, 0.8, 0]} castShadow>
                    <capsuleGeometry args={[0.35, 0.6, 8, 16]} />
                    <meshStandardMaterial
                      color="#c084fc"
                      emissive="#a855f7"
                      emissiveIntensity={0.3}
                    />
                  </mesh>
                  {/* Head */}
                  <mesh position={[0, 1.5, 0]} castShadow>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="#d8b4fe" emissive="#c084fc" emissiveIntensity={0.2} />
                  </mesh>
                  {/* Left ear */}
                  <mesh position={[-0.12, 2.1, 0]} castShadow>
                    <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
                    <meshStandardMaterial color="#e9d5ff" emissive="#d8b4fe" emissiveIntensity={0.3} />
                  </mesh>
                  {/* Right ear */}
                  <mesh position={[0.12, 2.1, 0]} castShadow>
                    <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
                    <meshStandardMaterial color="#e9d5ff" emissive="#d8b4fe" emissiveIntensity={0.3} />
                  </mesh>
                  {/* Eyes */}
                  <mesh position={[-0.1, 1.55, 0.25]}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshStandardMaterial color="#1e1b4b" />
                  </mesh>
                  <mesh position={[0.1, 1.55, 0.25]}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshStandardMaterial color="#1e1b4b" />
                  </mesh>
                  {/* Cape */}
                  <mesh position={[0, 0.9, -0.35]} rotation={[0.2, 0, 0]}>
                    <planeGeometry args={[0.5, 0.7]} />
                    <meshStandardMaterial
                      color="#ef4444"
                      emissive="#dc2626"
                      emissiveIntensity={0.4}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                </group>
              ) : (
                // Bruno — Brown bear
                <group>
                  {/* Body */}
                  <mesh position={[0, 0.9, 0]} castShadow>
                    <capsuleGeometry args={[0.45, 0.7, 8, 16]} />
                    <meshStandardMaterial
                      color="#92400e"
                      emissive="#78350f"
                      emissiveIntensity={0.2}
                    />
                  </mesh>
                  {/* Head */}
                  <mesh position={[0, 1.7, 0]} castShadow>
                    <sphereGeometry args={[0.38, 16, 16]} />
                    <meshStandardMaterial color="#a16207" emissive="#92400e" emissiveIntensity={0.2} />
                  </mesh>
                  {/* Left ear (round) */}
                  <mesh position={[-0.28, 2.05, 0]} castShadow>
                    <sphereGeometry args={[0.12, 8, 8]} />
                    <meshStandardMaterial color="#78350f" />
                  </mesh>
                  {/* Right ear (round) */}
                  <mesh position={[0.28, 2.05, 0]} castShadow>
                    <sphereGeometry args={[0.12, 8, 8]} />
                    <meshStandardMaterial color="#78350f" />
                  </mesh>
                  {/* Snout */}
                  <mesh position={[0, 1.6, 0.32]}>
                    <sphereGeometry args={[0.14, 8, 8]} />
                    <meshStandardMaterial color="#d4a574" />
                  </mesh>
                  {/* Eyes */}
                  <mesh position={[-0.12, 1.78, 0.3]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color="#1c1917" />
                  </mesh>
                  <mesh position={[0.12, 1.78, 0.3]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color="#1c1917" />
                  </mesh>
                </group>
              )}
            </group>
          )}

          {/* Attack visual — Luna magic ring / Bruno melee arc */}
          <mesh
            ref={attackVisualRef}
            position={[0, 1, isLuna ? 1 : 0]}
            visible={false}
            rotation={[Math.PI / 2, 0, 0]}
          >
            {isLuna ? (
              <>
                <ringGeometry args={[0.3, 0.5, 16]} />
                <meshStandardMaterial
                  color="#a855f7"
                  emissive="#a855f7"
                  emissiveIntensity={3}
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </>
            ) : (
              <>
                <torusGeometry args={[1.5, 0.1, 8, 16, Math.PI]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  emissive="#f59e0b"
                  emissiveIntensity={3}
                  transparent
                  opacity={0.8}
                />
              </>
            )}
          </mesh>

          {/* HP bar above character */}
          <group position={[0, 2.5, 0]}>
            {/* Background */}
            <mesh>
              <planeGeometry args={[1.2, 0.12]} />
              <meshBasicMaterial color="#1e1b4b" transparent opacity={0.7} />
            </mesh>
            {/* HP fill */}
            <mesh position={[-(1.1 * (1 - playerHP / playerMaxHP)) / 2, 0, 0.01]}>
              <planeGeometry args={[1.1 * (playerHP / playerMaxHP), 0.08]} />
              <meshBasicMaterial
                color={playerHP / playerMaxHP > 0.5 ? '#22c55e' : playerHP / playerMaxHP > 0.25 ? '#f59e0b' : '#ef4444'}
              />
            </mesh>
          </group>

          {/* Character glow */}
          <pointLight
            position={[0, 1.2, 0]}
            color={isLuna ? '#c084fc' : '#f59e0b'}
            intensity={1.5}
            distance={4}
          />
        </group>
      </RigidBody>
    </>
  );
}
