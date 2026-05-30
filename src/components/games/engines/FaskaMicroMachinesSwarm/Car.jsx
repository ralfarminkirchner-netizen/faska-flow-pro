import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from './GameLogic';
import * as THREE from 'three';

export default function Car() {
    const bodyRef = useRef();
    const inputs = useGameStore(state => state.inputs);
    const maxSpeed = useGameStore(state => state.maxSpeed);

    useFrame((state, delta) => {
        if (!bodyRef.current) return;

        const { up, down, left, right } = inputs;

        // Current velocity
        const linvel = bodyRef.current.linvel();
        const currentSpeed = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
        
        // Get car rotation
        const rotation = bodyRef.current.rotation();
        const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
        
        let turnSpeed = 0;
        if (currentSpeed > 2) {
            if (left) turnSpeed = 3.0 * delta;
            if (right) turnSpeed = -3.0 * delta;
        }

        // Apply angular velocity for turning
        bodyRef.current.setAngvel({ x: 0, y: turnSpeed * 10, z: 0 }, true);
        
        // Update rotation logic: calculate new forward vector based on current rotation + turnSpeed
        euler.y += turnSpeed;
        const forward = new THREE.Vector3(0, 0, -1).applyEuler(euler);
        
        // Acceleration
        const accelForce = 60;
        if (up) {
            bodyRef.current.applyImpulse({ x: forward.x * accelForce * delta, y: 0, z: forward.z * accelForce * delta }, true);
        }
        if (down) {
            bodyRef.current.applyImpulse({ x: -forward.x * accelForce * delta, y: 0, z: -forward.z * accelForce * delta }, true);
        }

        // Clamp speed
        const newLinvel = bodyRef.current.linvel();
        const newSpeed = Math.sqrt(newLinvel.x * newLinvel.x + newLinvel.z * newLinvel.z);
        if (newSpeed > maxSpeed) {
            const ratio = maxSpeed / newSpeed;
            bodyRef.current.setLinvel({ x: newLinvel.x * ratio, y: newLinvel.y, z: newLinvel.z * ratio }, true);
        }
    });

    return (
        <RigidBody ref={bodyRef} position={[0, 1, 20]} colliders="cuboid" linearDamping={2} angularDamping={5}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.5, 0.8, 3]} />
                <meshStandardMaterial color="#ff3355" />
            </mesh>
            <mesh position={[0, 0.5, -0.2]} castShadow>
                <boxGeometry args={[1.2, 0.6, 1.5]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        </RigidBody>
    );
}
