import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, globalState } from './GameLogic';

const PLAYER_SPEED = 18;
const JUMP_FORCE = 12;

const useKeys = () => {
    const [keys, setKeys] = React.useState({ w: false, a: false, s: false, d: false, space: false });
    useEffect(() => {
        const handleKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (k === ' ') setKeys(p => ({ ...p, space: true }));
            if (['w','a','s','d'].includes(k)) setKeys(p => ({ ...p, [k]: true }));
        };
        const handleKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (k === ' ') setKeys(p => ({ ...p, space: false }));
            if (['w','a','s','d'].includes(k)) setKeys(p => ({ ...p, [k]: false }));
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

export default function Player() {
    const ref = useRef();
    const { camera } = useThree();
    const keys = useKeys();
    
    const cameraShake = useGameStore(state => state.cameraShake);
    const consumeCameraShake = useGameStore(state => state.consumeCameraShake);
    const joystickMove = useGameStore(state => state.joystickMove);

    useFrame(() => {
        if (!ref.current) return;
        const velocity = ref.current.linvel();
        const pos = ref.current.translation();
        
        globalState.playerPosition = { x: pos.x, y: pos.y, z: pos.z };
        
        // Keyboard input
        let moveForward = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
        let moveRight = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);
        
        // Joystick input overrides keyboard if present
        if (Math.abs(joystickMove.y) > 0.05 || Math.abs(joystickMove.x) > 0.05) {
            moveForward = joystickMove.y;
            moveRight = joystickMove.x; // Flip depending on joystick logic
        }

        const frontVector = new THREE.Vector3(0, 0, moveForward);
        const sideVector = new THREE.Vector3(moveRight, 0, 0);
        const direction = new THREE.Vector3().subVectors(frontVector, sideVector).normalize().multiplyScalar(PLAYER_SPEED);
        
        const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
        direction.applyEuler(euler);
        
        ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);
        
        if (keys.space && Math.abs(velocity.y) < 0.1) {
            ref.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
        }
        
        let shakeX = 0;
        let shakeY = 0;
        if (cameraShake > 0) {
            shakeX = (Math.random() - 0.5) * cameraShake;
            shakeY = (Math.random() - 0.5) * cameraShake;
            consumeCameraShake(0.02);
        }
        
        camera.position.set(pos.x + shakeX, pos.y + 0.6 + shakeY, pos.z);
    });

    return (
        <RigidBody ref={ref} colliders={false} mass={1} position={[0, 10, 0]} lockRotations>
            <CapsuleCollider args={[0.5, 0.5]} />
        </RigidBody>
    );
}
