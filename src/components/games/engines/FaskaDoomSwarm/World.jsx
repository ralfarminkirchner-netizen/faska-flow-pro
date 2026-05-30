import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore, globalState, AMMO_TYPES } from './GameLogic';

const ENEMY_SPEED = 6;

function Enemy({ data }) {
    const ref = useRef();
    const handleMelee = useGameStore(state => state.handleMelee);
    
    useFrame(() => {
        if (!ref.current) return;
        const pos = ref.current.translation();
        const playerPos = globalState.playerPosition;
        
        const target = new THREE.Vector3(playerPos.x, pos.y, playerPos.z);
        const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
        
        if (currentPos.distanceTo(target) < 2.0) {
            handleMelee(data.id);
            return;
        }
        
        const direction = new THREE.Vector3().subVectors(target, currentPos).normalize();
        const currentVel = ref.current.linvel();
        
        ref.current.setLinvel({
            x: direction.x * ENEMY_SPEED,
            y: currentVel.y,
            z: direction.z * ENEMY_SPEED
        }, true);
    });
    
    const isNoun = data.type === 'noun';
    const color = isNoun ? AMMO_TYPES.NOUN.color : AMMO_TYPES.VERB.color;

    return (
        <RigidBody ref={ref} position={data.position} colliders="hull" lockRotations>
            <mesh userData={{ isEnemy: true, id: data.id, type: data.type }} castShadow>
                <sphereGeometry args={[1.5, 16, 16]} />
                <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.8} />
            </mesh>
            <mesh castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#111111" />
            </mesh>
            <Billboard position={[0, 2, 0]}>
                <Text fontSize={0.8} color={color} outlineWidth={0.05} outlineColor="#000" fontWeight="bold">
                    {data.word}
                </Text>
            </Billboard>
        </RigidBody>
    );
}

function Particle({ data, onRemove }) {
    const ref = useRef();
    const materialRef = useRef();
    
    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.position.add(data.velocity.clone().multiplyScalar(delta));
        data.life -= delta;
        if (data.life <= 0) {
            onRemove();
        } else if (materialRef.current) {
            materialRef.current.opacity = data.life / data.maxLife;
        }
    });

    return (
        <mesh ref={ref} position={data.position}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial ref={materialRef} color={data.color} transparent emissive={data.color} emissiveIntensity={2} />
        </mesh>
    );
}

export const ParticleSystem = forwardRef((props, ref) => {
    const [particles, setParticles] = useState([]);
    const particleIdCounter = useRef(0);

    useImperativeHandle(ref, () => ({
        trigger: (position, color, count, speed) => {
            const newParticles = [];
            for (let i = 0; i < count; i++) {
                newParticles.push({
                    id: particleIdCounter.current++,
                    position: position.clone(),
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * speed,
                        (Math.random() - 0.5) * speed + speed * 0.5,
                        (Math.random() - 0.5) * speed
                    ),
                    color: color,
                    life: 0.2 + Math.random() * 0.4,
                    maxLife: 0.6
                });
            }
            setParticles(prev => [...prev, ...newParticles]);
        }
    }));

    const removeParticle = useCallback((id) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    }, []);

    return (
        <>
            {particles.map(p => (
                <Particle key={p.id} data={p} onRemove={() => removeParticle(p.id)} />
            ))}
        </>
    );
});

export function Level() {
    return (
        <group>
            <RigidBody type="fixed" colliders="cuboid">
                <mesh position={[0, -1, 0]} receiveShadow>
                    <boxGeometry args={[100, 2, 100]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed" colliders="cuboid">
                <mesh position={[0, 2, -20]} receiveShadow castShadow>
                    <boxGeometry args={[10, 4, 10]} />
                    <meshStandardMaterial color="#444444" />
                </mesh>
            </RigidBody>
            {[...Array(8)].map((_, i) => (
                <RigidBody key={`stair-${i}`} type="fixed" colliders="cuboid">
                    <mesh position={[0, i * 0.5 - 0.25, -14 + i * 0.75]} receiveShadow castShadow>
                        <boxGeometry args={[4, 0.5, 2]} />
                        <meshStandardMaterial color="#555555" />
                    </mesh>
                </RigidBody>
            ))}
            <RigidBody type="fixed" colliders="cuboid">
                <mesh position={[-30, 8, -30]} receiveShadow castShadow>
                    <boxGeometry args={[20, 16, 20]} />
                    <meshStandardMaterial color="#223344" />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed" colliders="cuboid">
                <mesh position={[20, 4, -10]} receiveShadow castShadow>
                    <boxGeometry args={[2, 8, 30]} />
                    <meshStandardMaterial color="#442222" />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed" colliders="cuboid" position={[0, 10, -50]}>
                <mesh><boxGeometry args={[100, 20, 2]} /><meshStandardMaterial color="#111" /></mesh>
            </RigidBody>
            <RigidBody type="fixed" colliders="cuboid" position={[0, 10, 50]}>
                <mesh><boxGeometry args={[100, 20, 2]} /><meshStandardMaterial color="#111" /></mesh>
            </RigidBody>
            <RigidBody type="fixed" colliders="cuboid" position={[-50, 10, 0]}>
                <mesh><boxGeometry args={[2, 20, 100]} /><meshStandardMaterial color="#111" /></mesh>
            </RigidBody>
            <RigidBody type="fixed" colliders="cuboid" position={[50, 10, 0]}>
                <mesh><boxGeometry args={[2, 20, 100]} /><meshStandardMaterial color="#111" /></mesh>
            </RigidBody>
        </group>
    );
}

export function Shooter({ particleSystemRef }) {
    const { camera, scene } = useThree();
    
    const isLocked = useGameStore(state => state.isLocked);
    const ammoType = useGameStore(state => state.ammoType);
    const handleHitEnemy = useGameStore(state => state.handleHitEnemy);
    const shakeCamera = useGameStore(state => state.shakeCamera);
    const isShooting = useGameStore(state => state.isShooting);
    const setIsShooting = useGameStore(state => state.setIsShooting);

    // Function to fire
    const fire = useCallback(() => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        
        shakeCamera();
        camera.rotation.x += 0.02;
        
        const intersects = raycaster.intersectObjects(scene.children, true);
        const hitObj = intersects.find(hit => hit.object.userData?.isEnemy);
        
        const triggerParticles = (pos, col, c, s) => {
            if (particleSystemRef.current) particleSystemRef.current.trigger(pos, col, c, s);
        };

        if (hitObj) {
            const enemyData = hitObj.object.userData;
            handleHitEnemy(enemyData.id, enemyData.type, hitObj.point, triggerParticles);
        } else if (intersects.length > 0) {
            triggerParticles(intersects[0].point, '#ffffff', 5, 5);
        }
    }, [camera, scene, shakeCamera, handleHitEnemy, particleSystemRef]);

    useEffect(() => {
        if (isShooting) {
            fire();
            setIsShooting(false); // consume the shoot action
        }
    }, [isShooting, fire, setIsShooting]);

    useEffect(() => {
        const handleMouseDown = (e) => {
            if (!isLocked) return;
            if (e.button !== 0) return;
            fire();
        };
        
        window.addEventListener('mousedown', handleMouseDown);
        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, [isLocked, fire]);
    
    return null;
}

export default function World() {
    const enemies = useGameStore(state => state.enemies);
    const particleSystemRef = useRef();

    return (
        <>
            <Level />
            {enemies.map(e => <Enemy key={e.id} data={e} />)}
            <ParticleSystem ref={particleSystemRef} />
            <Shooter particleSystemRef={particleSystemRef} />
        </>
    );
}
