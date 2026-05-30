import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

// A simple moving platform
const MovingPlatform = ({ position, args = [4, 0.5, 4], color = "orange", speed = 2, range = 5, axis = 'x' }) => {
    const ref = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        if (!ref.current) return;
        const time = state.clock.getElapsedTime() * speed + timeOffset;
        const offset = Math.sin(time) * range;
        
        const currentPos = ref.current.translation();
        if (axis === 'x') {
            ref.current.setNextKinematicTranslation({ x: position[0] + offset, y: position[1], z: position[2] });
        } else if (axis === 'y') {
            ref.current.setNextKinematicTranslation({ x: position[0], y: position[1] + offset, z: position[2] });
        } else {
            ref.current.setNextKinematicTranslation({ x: position[0], y: position[1], z: position[2] + offset });
        }
    });

    return (
        <RigidBody type="kinematicPosition" ref={ref} position={position}>
            <mesh receiveShadow castShadow>
                <boxGeometry args={args} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
            </mesh>
        </RigidBody>
    );
};

// 1. North America Area
const NorthAmerica = () => {
    return (
        <group position={[0, 0, 0]}>
            {/* Central hub */}
            <RigidBody type="fixed" friction={1}>
                <mesh receiveShadow position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[10, 12, 1, 32]} />
                    <meshStandardMaterial color="#3b5998" />
                </mesh>
            </RigidBody>
            
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[-5, 0.5, -5]}>
                    <boxGeometry args={[4, 2, 4]} />
                    <meshStandardMaterial color="#8b9dc3" />
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[5, 1.5, 5]}>
                    <boxGeometry args={[3, 4, 3]} />
                    <meshStandardMaterial color="#dfe3ee" />
                </mesh>
            </RigidBody>
        </group>
    );
};

// 2. South America Area
const SouthAmerica = () => {
    return (
        <group position={[-25, 0, 10]}>
            <RigidBody type="fixed" friction={1.2}>
                <mesh receiveShadow position={[0, -0.5, 0]}>
                    <boxGeometry args={[15, 1, 15]} />
                    <meshStandardMaterial color="#2e7d32" />
                </mesh>
            </RigidBody>
            {/* Stepped pyramid like structure */}
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
                    <boxGeometry args={[10, 1, 10]} />
                    <meshStandardMaterial color="#388e3c" />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[0, 1.5, 0]}>
                    <boxGeometry args={[5, 1, 5]} />
                    <meshStandardMaterial color="#4caf50" />
                </mesh>
            </RigidBody>

            {/* Connecting ramp from NA */}
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[12.5, 0, -5]} rotation={[0, 0, 0.1]}>
                    <boxGeometry args={[10, 0.5, 4]} />
                    <meshStandardMaterial color="#795548" />
                </mesh>
            </RigidBody>
        </group>
    );
};

// 3. Europe Area
const Europe = () => {
    return (
        <group position={[20, 2, -15]}>
            <RigidBody type="fixed">
                <mesh receiveShadow position={[0, 0, 0]}>
                    <boxGeometry args={[12, 1, 16]} />
                    <meshStandardMaterial color="#5d4037" />
                </mesh>
            </RigidBody>

            {/* Columns/Arches representation */}
            {[-4, 4].map((x, i) => (
                <RigidBody type="fixed" key={`col-${i}`}>
                    <mesh receiveShadow castShadow position={[x, 2, -6]}>
                        <cylinderGeometry args={[0.5, 0.5, 4, 16]} />
                        <meshStandardMaterial color="#d7ccc8" />
                    </mesh>
                </RigidBody>
            ))}
            
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[0, 4, -6]}>
                    <boxGeometry args={[10, 1, 2]} />
                    <meshStandardMaterial color="#d7ccc8" />
                </mesh>
            </RigidBody>
            
            <MovingPlatform position={[-12, -0.5, 5]} color="#8d6e63" axis="x" range={4} speed={1.5} />
        </group>
    );
};

// 4. Africa Area
const Africa = () => {
    return (
        <group position={[15, -2, 20]}>
            <RigidBody type="fixed" friction={0.8}>
                <mesh receiveShadow position={[0, 0, 0]}>
                    <cylinderGeometry args={[14, 12, 1, 6]} />
                    <meshStandardMaterial color="#fbc02d" roughness={0.9} />
                </mesh>
            </RigidBody>
            
            {/* Dunes */}
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[3, 1, -3]} rotation={[Math.PI/4, 0, 0]}>
                    <boxGeometry args={[8, 4, 0.5]} />
                    <meshStandardMaterial color="#f9a825" />
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[-4, 1.5, 4]} rotation={[-Math.PI/6, Math.PI/4, 0]}>
                    <boxGeometry args={[6, 6, 0.5]} />
                    <meshStandardMaterial color="#f57f17" />
                </mesh>
            </RigidBody>

            <MovingPlatform position={[-8, 1, -12]} args={[3, 0.5, 3]} color="#ffb300" axis="y" range={3} speed={1} />
        </group>
    );
};

// 5. Asia Area
const Asia = () => {
    return (
        <group position={[-20, 5, -25]}>
            <RigidBody type="fixed">
                <mesh receiveShadow position={[0, 0, 0]}>
                    <cylinderGeometry args={[10, 8, 1, 8]} />
                    <meshStandardMaterial color="#c62828" />
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[0, 2, 0]}>
                    <cylinderGeometry args={[6, 8, 3, 8]} />
                    <meshStandardMaterial color="#b71c1c" />
                </mesh>
            </RigidBody>
            
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[0, 5, 0]}>
                    <cylinderGeometry args={[3, 5, 3, 8]} />
                    <meshStandardMaterial color="#ffc107" />
                </mesh>
            </RigidBody>

            {/* Stepping stones up */}
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[10, -2, 10]}>
                    <boxGeometry args={[2, 0.5, 2]} />
                    <meshStandardMaterial color="#8e24aa" />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[6, -0.5, 6]}>
                    <boxGeometry args={[2, 0.5, 2]} />
                    <meshStandardMaterial color="#8e24aa" />
                </mesh>
            </RigidBody>
        </group>
    );
};

// 6. Oceania Area
const Oceania = () => {
    return (
        <group position={[35, -5, 0]}>
            <RigidBody type="fixed">
                <mesh receiveShadow position={[0, 0, 0]}>
                    <cylinderGeometry args={[18, 18, 0.5, 32]} />
                    <meshStandardMaterial color="#00bcd4" transparent opacity={0.6} />
                </mesh>
            </RigidBody>

            {/* Small islands */}
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[-5, 0.5, 5]}>
                    <cylinderGeometry args={[3, 4, 1, 16]} />
                    <meshStandardMaterial color="#cddc39" />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[6, 1, -4]}>
                    <cylinderGeometry args={[2, 3, 2, 16]} />
                    <meshStandardMaterial color="#cddc39" />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh receiveShadow castShadow position={[2, 0.2, 8]}>
                    <cylinderGeometry args={[1.5, 2, 0.5, 16]} />
                    <meshStandardMaterial color="#cddc39" />
                </mesh>
            </RigidBody>

            <MovingPlatform position={[-15, 0, 0]} args={[3, 0.5, 3]} color="#0097a7" axis="z" range={8} speed={1.2} />
        </group>
    );
};

// 7. Antarctica Area
const Antarctica = () => {
    return (
        <group position={[0, -8, -35]}>
            {/* Low friction icy surface */}
            <RigidBody type="fixed" friction={0.05}>
                <mesh receiveShadow position={[0, 0, 0]}>
                    <cylinderGeometry args={[15, 12, 1, 16]} />
                    <meshStandardMaterial color="#e0f7fa" roughness={0.1} metalness={0.5} />
                </mesh>
            </RigidBody>
            
            {/* Ice spikes */}
            {[[-5, 2, -5], [5, 3, 2], [0, 4, 6], [-8, 2, 3]].map((pos, i) => (
                <RigidBody type="fixed" key={`ice-${i}`}>
                    <mesh receiveShadow castShadow position={pos}>
                        <coneGeometry args={[1.5, pos[1]*2, 8]} />
                        <meshStandardMaterial color="#b2ebf2" roughness={0} metalness={0.8} />
                    </mesh>
                </RigidBody>
            ))}

            {/* Connecting moving platform */}
            <MovingPlatform position={[0, -2, 18]} args={[4, 0.5, 4]} color="#80deea" axis="z" range={10} speed={2} />
        </group>
    );
};

export const World = () => {
    return (
        <group>
            {/* Global lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight 
                castShadow 
                position={[50, 50, 50]} 
                intensity={1.5} 
                shadow-mapSize={[2048, 2048]} 
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
            />

            {/* The 7 Continents */}
            <NorthAmerica />
            <SouthAmerica />
            <Europe />
            <Africa />
            <Asia />
            <Oceania />
            <Antarctica />

            {/* A bottom kill-plane catcher could go here if needed */}
        </group>
    );
};

export default World;
