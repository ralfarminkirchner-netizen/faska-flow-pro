import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { Vector3 } from 'three';
import { joystickState } from './MobileJoystick';

const useKeyboard = () => {
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false, jump: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setKeys(k => ({ ...k, forward: true })); break;
        case 'KeyS': case 'ArrowDown': setKeys(k => ({ ...k, backward: true })); break;
        case 'KeyA': case 'ArrowLeft': setKeys(k => ({ ...k, left: true })); break;
        case 'KeyD': case 'ArrowRight': setKeys(k => ({ ...k, right: true })); break;
        case 'Space': setKeys(k => ({ ...k, jump: true })); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setKeys(k => ({ ...k, forward: false })); break;
        case 'KeyS': case 'ArrowDown': setKeys(k => ({ ...k, backward: false })); break;
        case 'KeyA': case 'ArrowLeft': setKeys(k => ({ ...k, left: false })); break;
        case 'KeyD': case 'ArrowRight': setKeys(k => ({ ...k, right: false })); break;
        case 'Space': setKeys(k => ({ ...k, jump: false })); break;
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

  return keys;
};

export function PlayerController({ position = [0, 5, 0] }) {
  const bodyRef = useRef();
  const keys = useKeyboard();
  const { rapier, world } = useRapier();
  
  // Track remaining jumps for double jump
  const [jumpsLeft, setJumpsLeft] = useState(2);
  const jumpPressedRef = useRef(false);
  const targetCameraPos = useRef(new Vector3());

  const speed = 7;
  const jumpStrength = 8;
  const cameraOffset = new Vector3(0, 5, 10);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    try {
      const body = bodyRef.current;
      const translation = body.translation();
      const velocity = body.linvel();
      
      // Handle falling off edge gracefully (respawn)
      if (translation.y < -20) {
        body.setTranslation({ x: 0, y: 5, z: 0 }, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        return; // Skip rest of frame
      }

      // Ground detection via raycast (start slightly inside the player to hit ground reliably)
      const rayOrigin = { x: translation.x, y: translation.y - 0.9, z: translation.z };
      const rayDir = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(rayOrigin, rayDir);
      
      const hit = world.castRay(ray, 0.25, true);
      const isGrounded = hit != null && hit.toi < 0.25;

      // Reset double jump when on ground
      if (isGrounded && velocity.y <= 0) {
        if (jumpsLeft !== 2) setJumpsLeft(2);
      }

      // Input gathering (keyboard + joystick)
      let inputX = joystickState.x;
      let inputZ = joystickState.y;

      if (keys.forward) inputZ -= 1;
      if (keys.backward) inputZ += 1;
      if (keys.left) inputX -= 1;
      if (keys.right) inputX += 1;

      // Normalize movement vector to prevent faster diagonal movement
      const length = Math.sqrt(inputX * inputX + inputZ * inputZ);
      if (length > 1) {
        inputX /= length;
        inputZ /= length;
      }

      // Apply movement velocity
      const moveVelocity = {
        x: inputX * speed,
        y: velocity.y, // Preserve gravity
        z: inputZ * speed,
      };
      
      body.setLinvel(moveVelocity, true);

      // Handle jump & double jump
      const isJumpInput = keys.jump || joystickState.jump;
      if (isJumpInput && !jumpPressedRef.current && jumpsLeft > 0) {
        // Reset Y velocity when jumping in mid-air for consistent jump heights
        body.setLinvel({ x: velocity.x, y: jumpStrength, z: velocity.z }, true);
        setJumpsLeft(prev => prev - 1);
      }
      jumpPressedRef.current = isJumpInput;

      // Smooth camera follow
      const playerPos = new Vector3(translation.x, translation.y, translation.z);
      targetCameraPos.current.copy(playerPos).add(cameraOffset);
      
      state.camera.position.lerp(targetCameraPos.current, 5 * delta);
      state.camera.lookAt(playerPos);
      
    } catch (error) {
      // Guard against physics calls failing when body isn't fully ready
      console.warn("PlayerController: Physics step failed", error);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      enabledRotations={[false, false, false]} // Lock rotations for character controller
      friction={0} // Let custom velocity handle movement friction
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 16, 32]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  );
}
