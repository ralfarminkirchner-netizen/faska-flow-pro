import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import * as THREE from 'three';

const SPEED = 6.0;
const JUMP_FORCE = 8.5;
const GRAVITY = -25.0;
const COYOTE_TIME = 0.15;
const JUMP_BUFFER_TIME = 0.15;

export function usePlayerControls() {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, jump: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp': setMovement((m) => ({ ...m, forward: true })); break;
        case 'KeyS':
        case 'ArrowDown': setMovement((m) => ({ ...m, backward: true })); break;
        case 'KeyA':
        case 'ArrowLeft': setMovement((m) => ({ ...m, left: true })); break;
        case 'KeyD':
        case 'ArrowRight': setMovement((m) => ({ ...m, right: true })); break;
        case 'Space': setMovement((m) => ({ ...m, jump: true })); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp': setMovement((m) => ({ ...m, forward: false })); break;
        case 'KeyS':
        case 'ArrowDown': setMovement((m) => ({ ...m, backward: false })); break;
        case 'KeyA':
        case 'ArrowLeft': setMovement((m) => ({ ...m, left: false })); break;
        case 'KeyD':
        case 'ArrowRight': setMovement((m) => ({ ...m, right: false })); break;
        case 'Space': setMovement((m) => ({ ...m, jump: false })); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return movement;
}

const PlayerGraphics = () => {
  return (
    <mesh castShadow receiveShadow>
      {/* Geometry representing the capsule shape: radius 0.5, total height 2.0 */}
      <capsuleGeometry args={[0.5, 1, 16, 16]} />
      <meshStandardMaterial color="#2563eb" roughness={0.8} />
    </mesh>
  );
};

export function Player({ position = [0, 5, 0] }) {
  const rigidBodyRef = useRef(null);
  const { rapier, world } = useRapier();
  const controls = usePlayerControls();
  
  const lastGroundedTime = useRef(0);
  const lastJumpPressTime = useRef(0);
  const isGrounded = useRef(false);

  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const currentVelocity = useRef(new THREE.Vector3());
  
  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const time = state.clock.getElapsedTime();
    const body = rigidBodyRef.current;
    const playerPos = body.translation();
    
    // 1. Ground detection using raycast
    // Total height of the capsule is 2.0 (halfHeight: 0.5, radius: 0.5).
    // The very bottom is at y - 1.0. We start the ray slightly below to avoid hitting ourselves.
    const rayOrigin = { x: playerPos.x, y: playerPos.y - 1.01, z: playerPos.z };
    const rayDir = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(rayOrigin, rayDir);
    
    const hit = world.castRay(ray, 0.15, true);
    isGrounded.current = hit != null && hit.toi <= 0.15;

    if (isGrounded.current) {
      lastGroundedTime.current = time;
    }

    if (controls.jump) {
      lastJumpPressTime.current = time;
    }

    // 2. Movement handling
    frontVector.current.set(0, 0, (controls.backward ? 1 : 0) - (controls.forward ? 1 : 0));
    sideVector.current.set((controls.left ? 1 : 0) - (controls.right ? 1 : 0), 0, 0);
    
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(SPEED);

    // Apply camera yaw to movement direction for third-person control
    const cameraEulerY = state.camera.rotation.y;
    direction.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraEulerY);

    const linVel = body.linvel();
    currentVelocity.current.set(linVel.x, linVel.y, linVel.z);

    // Snappy horizontal movement (lerping toward target velocity)
    const acceleration = isGrounded.current ? 15 : 5; // Less air control
    currentVelocity.current.x = THREE.MathUtils.lerp(currentVelocity.current.x, direction.current.x, acceleration * delta);
    currentVelocity.current.z = THREE.MathUtils.lerp(currentVelocity.current.z, direction.current.z, acceleration * delta);

    // 3. Jump logic (Coyote time & Jump buffering)
    const timeSinceLastGrounded = time - lastGroundedTime.current;
    const timeSinceLastJumpPress = time - lastJumpPressTime.current;

    const canJump = timeSinceLastGrounded <= COYOTE_TIME;
    const wantsToJump = timeSinceLastJumpPress <= JUMP_BUFFER_TIME;

    if (canJump && wantsToJump) {
      currentVelocity.current.y = JUMP_FORCE;
      lastJumpPressTime.current = 0; // Consume jump
      lastGroundedTime.current = 0;
    }

    // 4. Custom Gravity and Fall Logic
    if (!isGrounded.current) {
      if (currentVelocity.current.y < 0) {
        // Fall multiplier for snappy landing
        currentVelocity.current.y += GRAVITY * delta * 1.5; 
      } else if (currentVelocity.current.y > 0 && !controls.jump) {
        // Variable jump height: heavier gravity if jump button is released early
        currentVelocity.current.y += GRAVITY * delta * 2.5;
      } else {
        // Normal upward gravity
        currentVelocity.current.y += GRAVITY * delta;
      }
    } else {
      // Small constant downward force to keep grounded on slopes
      if (!wantsToJump) {
        currentVelocity.current.y = -1.0;
      }
    }

    // Apply computed velocity
    body.setLinvel(currentVelocity.current, true);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders={false}
      type="dynamic"
      enabledRotations={[false, false, false]} // Lock all rotations
      friction={0} // No friction, handled manually
      restitution={0} // No bounciness
      gravityScale={0} // Gravity handled manually for perfect curve control
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <PlayerGraphics />
    </RigidBody>
  );
}

export default Player;
