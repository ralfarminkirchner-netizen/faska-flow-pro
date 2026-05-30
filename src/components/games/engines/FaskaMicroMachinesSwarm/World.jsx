import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from './GameLogic';
import { Text } from '@react-three/drei';

export default function World() {
    const hitZone = useGameStore(state => state.hitZone);
    const hitCheckpoint = useGameStore(state => state.hitCheckpoint);
    const answers = useGameStore(state => state.answers);

    return (
        <group>
            {/* Floor */}
            <RigidBody type="fixed" friction={1}>
                <mesh receiveShadow position={[0, -0.5, 0]}>
                    <boxGeometry args={[100, 1, 100]} />
                    <meshStandardMaterial color="#0a0a1a" />
                </mesh>
            </RigidBody>

            {/* Grid Pattern */}
            <gridHelper args={[100, 20, '#334455', '#112233']} position={[0, 0.01, 0]} />

            {/* Outer bounds */}
            <RigidBody type="fixed"><CuboidCollider position={[0, 0.5, -40]} args={[50, 2, 1]} /></RigidBody>
            <RigidBody type="fixed"><CuboidCollider position={[0, 0.5, 40]} args={[50, 2, 1]} /></RigidBody>
            <RigidBody type="fixed"><CuboidCollider position={[-50, 0.5, 0]} args={[1, 2, 40]} /></RigidBody>
            <RigidBody type="fixed"><CuboidCollider position={[50, 0.5, 0]} args={[1, 2, 40]} /></RigidBody>
            
            {/* Inner bounds */}
            <RigidBody type="fixed"><CuboidCollider position={[0, 0.5, 0]} args={[30, 2, 20]} /></RigidBody>

            {/* Visual Walls */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[60, 2, 40]} />
                <meshStandardMaterial color="#0088ff" wireframe />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[100, 2, 80]} />
                <meshStandardMaterial color="#0088ff" wireframe />
            </mesh>

            {/* Divider */}
            <RigidBody type="fixed"><CuboidCollider position={[0, 0.5, -30]} args={[10, 2, 1]} /></RigidBody>
            <mesh position={[0, 0.5, -30]}>
                <boxGeometry args={[20, 2, 2]} />
                <meshStandardMaterial color="#ff00ff" wireframe />
            </mesh>

            {/* Top Zone */}
            <CuboidCollider 
                position={[0, 1, -35]} 
                args={[10, 2, 4]} 
                sensor 
                onIntersectionEnter={() => hitZone('top')} 
            />
            <Text position={[0, 0.1, -35]} rotation={[-Math.PI / 2, 0, 0]} fontSize={8} color="#0ff">
                {answers.top}
            </Text>

            {/* Bottom Zone */}
            <CuboidCollider 
                position={[0, 1, -25]} 
                args={[10, 2, 4]} 
                sensor 
                onIntersectionEnter={() => hitZone('bottom')} 
            />
            <Text position={[0, 0.1, -25]} rotation={[-Math.PI / 2, 0, 0]} fontSize={8} color="#0ff">
                {answers.bottom}
            </Text>

            {/* Checkpoint */}
            <CuboidCollider 
                position={[40, 1, 0]} 
                args={[10, 2, 20]} 
                sensor 
                onIntersectionEnter={() => hitCheckpoint()} 
            />
            <mesh position={[40, 0.02, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[20, 40]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
        </group>
    );
}
