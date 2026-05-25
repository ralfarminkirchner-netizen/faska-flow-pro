import React, { useState, useRef, useEffect, useMemo, forwardRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from '@react-three/rapier';
import { Text, Sky, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const QUESTIONS = [
  { text: "I ___ to the store.", options: ["go", "goes", "going"], correct: "go" },
  { text: "She ___ playing tennis.", options: ["is", "are", "am"], correct: "is" },
  { text: "They ___ a new car.", options: ["has", "have", "having"], correct: "have" },
  { text: "He ___ pizza every day.", options: ["eat", "eats", "eating"], correct: "eats" },
  { text: "We ___ to the beach yesterday.", options: ["go", "went", "gone"], correct: "went" },
  { text: "The dog ___ loudly.", options: ["barks", "bark", "barking"], correct: "barks" },
];

const Scenery = () => {
  const [concreteTex] = useTexture(['/textures/skate_concrete.png']);
  concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping;
  concreteTex.repeat.set(4, 4);

  return (
    <group>
      {/* Background Buildings */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 150;
        const z = -30 - Math.random() * 50;
        const h = 20 + Math.random() * 40;
        return (
          <mesh key={i} position={[x, h / 2 - 5, z]} castShadow receiveShadow>
            <boxGeometry args={[10 + Math.random() * 10, h, 10 + Math.random() * 10]} />
            <meshStandardMaterial map={concreteTex} color="#555" />
          </mesh>
        );
      })}
      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial map={concreteTex} color="#444" />
      </mesh>
    </group>
  );
};

const SmoothHalfpipe = () => {
  const [concreteTex] = useTexture(['/textures/skate_concrete.png']);
  concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping;
  concreteTex.repeat.set(2, 4);

  return (
    <group>
      {/* Perfectly smooth halfpipe using a trimesh collider */}
      <RigidBody type="fixed" colliders="trimesh" friction={0.01} restitution={0}>
        <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[10, 10, 20, 64, 1, true, 0, Math.PI]} />
          <meshStandardMaterial map={concreteTex} side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>

      {/* Red Lips for visual jump cues */}
      <mesh position={[-10, 10, 0]} receiveShadow>
        <boxGeometry args={[0.5, 0.5, 20]} />
        <meshStandardMaterial color="#ff0055" />
      </mesh>
      <mesh position={[10, 10, 0]} receiveShadow>
        <boxGeometry args={[0.5, 0.5, 20]} />
        <meshStandardMaterial color="#ff0055" />
      </mesh>

      {/* Recovery decks */}
      <RigidBody type="fixed" colliders="cuboid" friction={0.1} restitution={0}>
        <mesh position={[-15, 10, 0]} receiveShadow>
          <boxGeometry args={[10, 1, 20]} />
          <meshStandardMaterial map={concreteTex} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" friction={0.1} restitution={0}>
        <mesh position={[15, 10, 0]} receiveShadow>
          <boxGeometry args={[10, 1, 20]} />
          <meshStandardMaterial map={concreteTex} />
        </mesh>
      </RigidBody>

      {/* Invisible boundaries */}
      <RigidBody type="fixed" position={[-20, 20, 0]}><CuboidCollider args={[1, 15, 15]} /></RigidBody>
      <RigidBody type="fixed" position={[20, 20, 0]}><CuboidCollider args={[1, 15, 15]} /></RigidBody>
      <RigidBody type="fixed" position={[0, 20, -10]}><CuboidCollider args={[20, 15, 1]} /></RigidBody>
      <RigidBody type="fixed" position={[0, 20, 10]}><CuboidCollider args={[20, 15, 1]} /></RigidBody>
    </group>
  );
};

const OptionsBoxes = ({ gameState, setGameState }) => {
  if (!gameState.questionActive) return null;

  const handleHit = (option, hitPosition) => {
    const isCorrect = option === gameState.currentQuestion.correct;
    setGameState(prev => ({ 
      ...prev, 
      score: isCorrect ? prev.score + 500 : Math.max(0, prev.score - 100), 
      message: isCorrect ? 'SICK TRICK!' : 'BAIL!', 
      questionActive: false,
      explosions: [...prev.explosions, { id: Date.now(), position: hitPosition, color: isCorrect ? '#00ff00' : '#ff0000' }]
    }));
  };

  return (
    <group>
      {gameState.currentQuestion.options.map((option, i) => {
        const zOffset = (i - 1) * 4; 
        const finalX = gameState.jumpX; // Options spawn straight up from the lip
        return (
          <RigidBody key={option} type="fixed" position={[finalX, 22, zOffset]}>
            <CuboidCollider args={[1.5, 1.5, 1.5]} sensor onIntersectionEnter={() => handleHit(option, [finalX, 22, zOffset])} />
            <mesh castShadow>
              <boxGeometry args={[2.5, 2.5, 2.5]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.8} />
            </mesh>
            <Text position={[0, 0, 1.3]} fontSize={1} color="black" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="white" fontWeight="900">
              {option}
            </Text>
          </RigidBody>
        );
      })}
    </group>
  );
};

const SkaterMeshes = ({ skaterRef }) => {
  const groupRef = useRef();
  const [deckTex] = useTexture(['/textures/skate_deck.png']);
  
  useFrame(() => {
    if (!groupRef.current || !skaterRef.current) return;
    const pos = skaterRef.current.translation();
    const vel = skaterRef.current.linvel();
    
    // Smooth board alignment to the halfpipe curve
    let targetAngleZ = 0;
    if (pos.y < 10) {
      const x = THREE.MathUtils.clamp(pos.x, -9.9, 9.9);
      targetAngleZ = Math.asin(x / 10);
    }
    
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetAngleZ, 0.5);
    
    // Tilt board when moving forward/backward
    const targetAngleX = THREE.MathUtils.clamp(vel.z * 0.1, -Math.PI/6, Math.PI/6);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetAngleX, 0.2);
  });

  return (
    <group ref={groupRef}>
      {/* Skateboard */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.1, 0.6]} />
        <meshStandardMaterial map={deckTex} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.6, -0.5, 0.2]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.2, 16]}/><meshStandardMaterial color="#fff"/></mesh>
      <mesh position={[-0.6, -0.5, -0.2]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.2, 16]}/><meshStandardMaterial color="#fff"/></mesh>
      <mesh position={[0.6, -0.5, 0.2]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.2, 16]}/><meshStandardMaterial color="#fff"/></mesh>
      <mesh position={[0.6, -0.5, -0.2]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.2, 16]}/><meshStandardMaterial color="#fff"/></mesh>
      
      {/* Simple cool Skater Character */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Head with backward cap */}
      <group position={[0, 1.4, 0]}>
        <mesh castShadow><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color="#ffccaa" /></mesh>
        <mesh position={[-0.2, 0.1, 0]} castShadow><boxGeometry args={[0.4, 0.1, 0.4]} /><meshStandardMaterial color="#ff0055" /></mesh>
      </group>
    </group>
  );
};

const Skater = forwardRef(({ gameState, setGameState }, ref) => {
  const [keys, setKeys] = useState({ left: false, right: false, space: false, w: false, s: false });
  const inAirRef = useRef(false);
  const jumpTriggeredRef = useRef(false);

  useEffect(() => {
    const down = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: true }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: true }));
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(k => ({ ...k, w: true }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(k => ({ ...k, s: true }));
      if (e.code === 'Space') setKeys(k => ({ ...k, space: true }));
    };
    const up = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: false }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: false }));
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(k => ({ ...k, w: false }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(k => ({ ...k, s: false }));
      if (e.code === 'Space') setKeys(k => ({ ...k, space: false }));
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.translation();
    const vel = ref.current.linvel();

    // Ground control - Pump to build speed
    if (pos.y <= 10.5) {
      if (keys.left) ref.current.applyImpulse({ x: -0.6, y: 0, z: 0 }, true);
      if (keys.right) ref.current.applyImpulse({ x: 0.6, y: 0, z: 0 }, true);
      if (keys.w) ref.current.applyImpulse({ x: 0, y: 0, z: -0.8 }, true);
      if (keys.s) ref.current.applyImpulse({ x: 0, y: 0, z: 0.8 }, true);
      
      // Auto-pump to prevent getting stuck
      if (Math.abs(vel.x) < 5) {
        ref.current.applyImpulse({ x: pos.x > 0 ? -0.2 : 0.2, y: 0, z: 0 }, true);
      }
    }

    // Big Air Jump logic at the lip (y ~9 to 11)
    if (pos.y > 8.5 && pos.y < 11.5 && !jumpTriggeredRef.current) {
      if (keys.space && vel.y > 0) {
        ref.current.setLinvel({ x: vel.x * 0.2, y: 25, z: vel.z }, true);
        jumpTriggeredRef.current = true;
        inAirRef.current = true;
        
        setGameState(prev => {
           if (prev.questionActive) return prev;
           return { 
             ...prev, 
             questionActive: true, 
             currentQuestion: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)], 
             message: '',
             jumpX: pos.x > 0 ? 10 : -10
           };
        });
      }
    }

    // Mid-air steer along Z axis to hit the boxes
    if (pos.y > 12 && inAirRef.current) {
      if (keys.w) ref.current.applyImpulse({ x: 0, y: 0, z: -0.6 }, true);
      if (keys.s) ref.current.applyImpulse({ x: 0, y: 0, z: 0.6 }, true);
    }

    // Landing
    if (pos.y < 9 && inAirRef.current) {
      inAirRef.current = false;
      jumpTriggeredRef.current = false;
      if (gameState.questionActive) {
        setGameState(prev => ({ 
          ...prev, questionActive: false, message: 'MISSED IT!', score: Math.max(0, prev.score - 50)
        }));
      }
    }
  });

  return (
    <RigidBody 
      ref={ref} 
      position={[0, 2, 0]} 
      colliders="capsule" 
      friction={0.01} 
      restitution={0}
      enabledRotations={[false, false, false]}
      name="skater"
    >
      <SkaterMeshes skaterRef={ref} />
    </RigidBody>
  );
});

const CameraController = ({ skaterRef }) => {
  useFrame((state, delta) => {
    if (!skaterRef.current) return;
    const pos = skaterRef.current.translation();
    const targetX = pos.x * 0.2;
    const targetY = Math.max(8, pos.y + 4);
    const targetZ = pos.z + 18;
    state.camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 5 * delta);
    state.camera.lookAt(pos.x * 0.5, pos.y, pos.z);
  });
  return null;
};

// Explosion effect for hits
function Explosion({ position, color }) {
  const ref = useRef();
  const [particles] = useState(() => Array.from({length: 20}).map(() => ({
    vel: new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20)
  })));

  useFrame((state, delta) => {
    if(ref.current) {
      ref.current.children.forEach((mesh, i) => {
        mesh.position.addScaledVector(particles[i].vel, delta);
        mesh.scale.multiplyScalar(0.9);
      });
    }
  });

  return (
    <group ref={ref} position={position}>
      {particles.map((_, i) => (
        <mesh key={i}><boxGeometry args={[1,1,1]}/><meshBasicMaterial color={color}/></mesh>
      ))}
    </group>
  );
}

const GameScene = ({ gameState, setGameState }) => {
  const skaterRef = useRef();

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 50, 20]} castShadow intensity={2} shadow-mapSize={[2048, 2048]} />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} />
      
      <Physics gravity={[0, -20, 0]}>
        <SmoothHalfpipe />
        <Skater ref={skaterRef} gameState={gameState} setGameState={setGameState} />
        <OptionsBoxes gameState={gameState} setGameState={setGameState} />
      </Physics>

      {gameState.explosions.map(exp => (
        <Explosion key={exp.id} position={exp.position} color={exp.color} />
      ))}

      <CameraController skaterRef={skaterRef} />
    </>
  );
};

const GameUI = ({ gameState, onExit }) => {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '30px', boxSizing: 'border-box',
      fontFamily: 'Impact, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', padding: '15px 40px', 
          borderRadius: '10px', color: '#ff0055', fontSize: '36px',
          boxShadow: '0 10px 0 #cc0044', border: '4px solid #000'
        }}>
          SCORE: {gameState.score}
        </div>
        <button 
          onClick={onExit}
          style={{
            pointerEvents: 'auto', background: '#e74c3c', color: 'white', border: '4px solid #000',
            padding: '15px 40px', borderRadius: '10px', fontSize: '30px', cursor: 'pointer',
            boxShadow: '0 10px 0 #c0392b', fontFamily: 'Impact, sans-serif'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(10px)'; e.currentTarget.style.boxShadow = '0 0 0 #c0392b'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 0 #c0392b'; }}
        >
          BEENDEN
        </button>
      </div>

      <div style={{ textAlign: 'center', pointerEvents: 'none', marginBottom: '15vh' }}>
        {!gameState.questionActive && !gameState.message && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)', padding: '20px 40px', borderRadius: '10px', display: 'inline-block',
            color: '#00ffff', fontSize: '28px', border: '3px solid #00ffff'
          }}>
            HOLD A/D TO PUMP. PRESS SPACE AT RED LIPS TO JUMP!
          </div>
        )}

        {gameState.questionActive && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)', padding: '30px 60px', borderRadius: '15px', display: 'inline-block',
            border: '5px solid #ff0055', boxShadow: '0 0 30px #ff0055'
          }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '48px' }}>
              {gameState.currentQuestion.text}
            </h2>
            <p style={{ margin: '15px 0 0', color: '#00ffff', fontSize: '24px' }}>
              USE W / S TO STEER MIDAIR TO THE ANSWER!
            </p>
          </div>
        )}
        
        {gameState.message && !gameState.questionActive && (
          <div key={Date.now()} style={{
            background: gameState.message === 'SICK TRICK!' ? '#00ff00' : '#ff0000',
            padding: '20px 50px', borderRadius: '10px', display: 'inline-block',
            color: 'black', fontSize: '48px', border: '5px solid black',
            transform: 'rotate(-5deg)', animation: 'pop 0.5s ease-out'
          }}>
            {gameState.message}
          </div>
        )}
      </div>
      <style>{`@keyframes pop { 0% { transform: scale(0.5) rotate(-20deg); } 100% { transform: scale(1) rotate(-5deg); } }`}</style>
    </div>
  );
};

export default function FaskaTonyHawk({ onExit }) {
  const [gameState, setGameState] = useState({ score: 0, questionActive: false, currentQuestion: null, message: '', jumpX: 0, explosions: [] });
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Canvas shadows camera={{ fov: 60 }}>
        <Suspense fallback={null}><GameScene gameState={gameState} setGameState={setGameState} /></Suspense>
      </Canvas>
      <GameUI gameState={gameState} onExit={onExit} />
    </div>
  );
}
