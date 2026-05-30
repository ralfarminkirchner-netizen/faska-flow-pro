import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './GameLogic';
import { Text, Sky } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

const Target = ({ id, word, isOdd, position, speed, fleeing }) => {
    const ref = useRef();
    const hitTarget = useGameStore(state => state.hitTarget);
    const [color] = useState(() => ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ff9900'][Math.floor(Math.random() * 7)]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.x += speed * delta * (fleeing ? 3 : 1);
            if (!fleeing) {
                ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 1.5;
            }

            if (ref.current.position.x > 50) ref.current.position.x = -50;
            if (ref.current.position.x < -50) ref.current.position.x = 50;
        }
    });

    return (
        <group ref={ref} position={position} onClick={() => hitTarget(id, isOdd)}>
            <RigidBody type="kinematicPosition">
                <mesh position={[0, 2, 0]}>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0, -0.5, 0]}>
                    <boxGeometry args={[1.5, 1, 1]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                {/* Lines */}
                <mesh position={[-0.5, 0.75, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.5, 0.75, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                    <meshStandardMaterial color="black" />
                </mesh>

                {/* Text Board */}
                <mesh position={[0, -0.5, 0.6]}>
                    <boxGeometry args={[3, 1, 0.1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <Text position={[0, -0.5, 0.66]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
                    {word}
                </Text>
            </RigidBody>
        </group>
    );
};

const World = () => {
    const targets = useGameStore(state => state.targets);

    return (
        <>
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#228B22" />
            </mesh>

            {targets.map(t => (
                <Target key={t.id} {...t} />
            ))}
        </>
    );
};

export default World;
