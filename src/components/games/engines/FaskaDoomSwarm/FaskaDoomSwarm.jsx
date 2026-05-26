import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CapsuleCollider } from '@react-three/rapier';
import { PointerLockControls, Billboard, Text, Sky } from '@react-three/drei';
import * as THREE from 'three';

const PLAYER_SPEED = 18;
const JUMP_FORCE = 12;
const ENEMY_SPEED = 6;

const AMMO_TYPES = {
    NOUN: { name: 'Noun', color: '#ff0044', type: 'noun' },
    VERB: { name: 'Verb', color: '#0044ff', type: 'verb' }
};

const WORDS = [
    { text: "Table", type: 'noun' },
    { text: "Run", type: 'verb' },
    { text: "Car", type: 'noun' },
    { text: "Jump", type: 'verb' },
    { text: "Apple", type: 'noun' },
    { text: "Eat", type: 'verb' },
    { text: "House", type: 'noun' },
    { text: "Sleep", type: 'verb' },
    { text: "Dog", type: 'noun' },
    { text: "Write", type: 'verb' },
    { text: "Mountain", type: 'noun' },
    { text: "Fight", type: 'verb' }
];

const globalState = {
    playerPosition: new THREE.Vector3(0, 5, 0),
};

const useKeys = () => {
    const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false, space: false });
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

const ParticleSystem = forwardRef((props, ref) => {
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

function Player({ shakeRef }) {
    const ref = useRef();
    const { camera } = useThree();
    const keys = useKeys();
    
    useFrame(() => {
        if (!ref.current) return;
        const velocity = ref.current.linvel();
        const pos = ref.current.translation();
        
        globalState.playerPosition.set(pos.x, pos.y, pos.z);
        
        const frontVector = new THREE.Vector3(0, 0, (keys.s ? 1 : 0) - (keys.w ? 1 : 0));
        const sideVector = new THREE.Vector3((keys.a ? 1 : 0) - (keys.d ? 1 : 0), 0, 0);
        const direction = new THREE.Vector3().subVectors(frontVector, sideVector).normalize().multiplyScalar(PLAYER_SPEED);
        
        const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
        direction.applyEuler(euler);
        
        ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);
        
        if (keys.space && Math.abs(velocity.y) < 0.1) {
            ref.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
        }
        
        let shakeX = 0;
        let shakeY = 0;
        if (shakeRef.current > 0) {
            shakeX = (Math.random() - 0.5) * shakeRef.current;
            shakeY = (Math.random() - 0.5) * shakeRef.current;
            shakeRef.current -= 0.02;
        }
        
        camera.position.set(pos.x + shakeX, pos.y + 0.6 + shakeY, pos.z);
    });

    return (
        <RigidBody ref={ref} colliders={false} mass={1} position={[0, 10, 0]} lockRotations>
            <CapsuleCollider args={[0.5, 0.5]} />
        </RigidBody>
    );
}

function Enemy({ data, onMelee }) {
    const ref = useRef();
    
    useFrame(() => {
        if (!ref.current) return;
        const pos = ref.current.translation();
        const playerPos = globalState.playerPosition;
        
        const target = new THREE.Vector3(playerPos.x, pos.y, playerPos.z);
        const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
        
        if (currentPos.distanceTo(playerPos) < 2.0) {
            onMelee(data.id);
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

function Level() {
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

function Shooter({ ammoType, triggerParticles, onHitEnemy, shakeCamera, isLocked }) {
    const { camera, scene } = useThree();
    
    useEffect(() => {
        const handleMouseDown = (e) => {
            if (!isLocked) return;
            if (e.button !== 0) return;
            
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
            
            shakeCamera();
            camera.rotation.x += 0.02;
            
            const intersects = raycaster.intersectObjects(scene.children, true);
            const hitObj = intersects.find(hit => hit.object.userData?.isEnemy);
            
            if (hitObj) {
                const enemyData = hitObj.object.userData;
                onHitEnemy(enemyData.id, enemyData.type, hitObj.point);
            } else if (intersects.length > 0) {
                triggerParticles(intersects[0].point, '#ffffff', 5, 5);
            }
        };
        
        window.addEventListener('mousedown', handleMouseDown);
        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, [camera, scene, ammoType, triggerParticles, onHitEnemy, shakeCamera, isLocked]);
    
    return null;
}

export default function FaskaDoomSwarm({ onExit }) {
    const [ammoType, setAmmoType] = useState(AMMO_TYPES.NOUN);
    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(100);
    const [hitFlash, setHitFlash] = useState(null);
    const [enemies, setEnemies] = useState([]);
    const [isLocked, setIsLocked] = useState(false);
    
    const particleSystemRef = useRef();
    const enemyIdCounter = useRef(0);
    const shakeRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isLocked) return;
            setEnemies(prev => {
                if (prev.length >= 15) return prev;
                const word = WORDS[Math.floor(Math.random() * WORDS.length)];
                
                const angle = Math.random() * Math.PI * 2;
                const dist = 30 + Math.random() * 15;
                const x = Math.cos(angle) * dist;
                const z = Math.sin(angle) * dist;
                
                return [...prev, {
                    id: enemyIdCounter.current++,
                    type: word.type,
                    word: word.text,
                    position: [x, 5, z]
                }];
            });
        }, 1500);
        return () => clearInterval(interval);
    }, [isLocked]);

    useEffect(() => {
        const handleSwitch = (e) => {
            const k = e.key.toLowerCase();
            if (k === '1') setAmmoType(AMMO_TYPES.NOUN);
            if (k === '2') setAmmoType(AMMO_TYPES.VERB);
            if (k === 'q') setAmmoType(prev => prev.type === 'noun' ? AMMO_TYPES.VERB : AMMO_TYPES.NOUN);
        };
        window.addEventListener('keydown', handleSwitch);
        return () => window.removeEventListener('keydown', handleSwitch);
    }, []);

    const shakeCamera = useCallback(() => {
        shakeRef.current = 0.3;
    }, []);

    const handleHitEnemy = useCallback((id, enemyType, hitPoint) => {
        if (enemyType === ammoType.type) {
            setEnemies(prev => prev.filter(e => e.id !== id));
            if (particleSystemRef.current) {
                particleSystemRef.current.trigger(hitPoint, ammoType.color, 20, 15);
            }
            setScore(s => s + 100);
            setHitFlash('rgba(0, 255, 0, 0.2)');
        } else {
            if (particleSystemRef.current) {
                particleSystemRef.current.trigger(hitPoint, '#ffffff', 5, 2);
            }
            setHitFlash('rgba(255, 0, 0, 0.3)');
        }
        setTimeout(() => setHitFlash(null), 100);
    }, [ammoType]);

    const handleMelee = useCallback((id) => {
        setEnemies(prev => prev.filter(e => e.id !== id));
        setHealth(h => {
            if (h - 20 <= 0) {
                setScore(0);
                return 100;
            }
            return h - 20;
        });
        setHitFlash('rgba(255, 0, 0, 0.6)');
        shakeCamera();
        setTimeout(() => setHitFlash(null), 200);
    }, [shakeCamera]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#000', userSelect: 'none' }}>
            {hitFlash && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: hitFlash, pointerEvents: 'none', zIndex: 10 }} />
            )}
            
            <Canvas shadows camera={{ fov: 80 }}>
                <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.1} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow />
                
                <Physics gravity={[0, -30, 0]}>
                    <Player shakeRef={shakeRef} />
                    <Level />
                    {enemies.map(e => <Enemy key={e.id} data={e} onMelee={handleMelee} />)}
                </Physics>
                
                <ParticleSystem ref={particleSystemRef} />
                <Shooter 
                    ammoType={ammoType} 
                    onHitEnemy={handleHitEnemy} 
                    triggerParticles={(pos, col, c, s) => particleSystemRef.current?.trigger(pos, col, c, s)} 
                    shakeCamera={shakeCamera} 
                    isLocked={isLocked}
                />
                
                <PointerLockControls onLock={() => setIsLocked(true)} onUnlock={() => setIsLocked(false)} />
            </Canvas>
            
            {/* Crosshair */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 20 }}>
                <div style={{ width: 8, height: 8, backgroundColor: ammoType.color, borderRadius: '50%', boxShadow: '0 0 8px white' }} />
            </div>
            
            {/* UI */}
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 30, fontFamily: 'monospace', textShadow: '2px 2px 4px #000' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#ffcc00' }}>FaskaDoomSwarm</h1>
                <p style={{ margin: '5px 0', fontSize: '24px' }}>Score: {score}</p>
                <p style={{ margin: '5px 0', fontSize: '24px', color: health > 30 ? '#00ff00' : '#ff0000' }}>Health: {health}</p>
                <p style={{ margin: '15px 0 5px 0', fontSize: '22px', color: ammoType.color, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '4px', display: 'inline-block' }}>
                    Ammo: {ammoType.name} (Q to swap)
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.9 }}>Match ammo color to enemy shield color!</p>
                <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.7 }}>WASD: Move | SPACE: Jump | Click: Shoot</p>
            </div>
            
            {!isLocked && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 25, color: 'white', fontFamily: 'monospace' }}>
                    <h2 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '2px 2px 0 #f00' }}>CLICK TO START</h2>
                    <p style={{ fontSize: '20px' }}>Press ESC to pause and show mouse</p>
                </div>
            )}
            
            <button 
                onClick={onExit}
                style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 40,
                    padding: '12px 24px', fontSize: '18px', fontWeight: 'bold',
                    backgroundColor: '#ff2222', color: 'white', border: '2px solid white',
                    borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    fontFamily: 'monospace'
                }}
            >
                Beenden
            </button>
        </div>
    );
}
