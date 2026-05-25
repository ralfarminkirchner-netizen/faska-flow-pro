import React, { useState, useRef, useEffect, useMemo, forwardRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from '@react-three/rapier';
import { Text, Sky } from '@react-three/drei';
import * as THREE from 'three';

const QUESTIONS = [
  { text: "I ___ to the store.", options: ["go", "goes", "going"], correct: "go" },
  { text: "She ___ playing tennis.", options: ["is", "are", "am"], correct: "is" },
  { text: "They ___ a new car.", options: ["has", "have", "having"], correct: "have" },
  { text: "He ___ pizza every day.", options: ["eat", "eats", "eating"], correct: "eats" },
  { text: "We ___ to the beach yesterday.", options: ["go", "went", "gone"], correct: "went" },
  { text: "The dog ___ loudly.", options: ["barks", "bark", "barking"], correct: "barks" },
  { text: "I have ___ my homework.", options: ["finish", "finishes", "finished"], correct: "finished" },
  { text: "He is ___ than me.", options: ["tall", "taller", "tallest"], correct: "taller" },
];

const Scenery = () => (
  <group>
    {Array.from({ length: 30 }).map((_, i) => {
      const x = (Math.random() - 0.5) * 150;
      const z = -20 - Math.random() * 50;
      const h = 5 + Math.random() * 25;
      return (
        <mesh key={i} position={[x, h / 2 - 5, z]} castShadow receiveShadow>
          <boxGeometry args={[3 + Math.random() * 4, h, 3 + Math.random() * 4]} />
          <meshStandardMaterial color={['#2ecc71', '#27ae60', '#16a085'][Math.floor(Math.random() * 3)]} />
        </mesh>
      );
    })}
    <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial color="#7f8c8d" />
    </mesh>
  </group>
);

const Halfpipe = () => {
  const numSegments = 30;
  const radius = 10;
  const halfpipeLength = 10;
  const segments = [];

  for (let i = 0; i <= numSegments; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / numSegments;
    const x = Math.sin(angle) * radius;
    const y = radius - Math.cos(angle) * radius;
    const width = (Math.PI * radius) / numSegments + 0.2;
    
    // Highlight the jump zones (lips) in red
    const isLip = i < 4 || i > numSegments - 4;
    
    segments.push(
      <RigidBody key={`segment-${i}`} type="fixed" colliders="cuboid" friction={0} restitution={0}>
        <mesh position={[x, y, 0]} rotation={[0, 0, -angle]} receiveShadow>
          <boxGeometry args={[width, 0.5, halfpipeLength]} />
          <meshStandardMaterial color={isLip ? '#c0392b' : '#2c3e50'} />
        </mesh>
      </RigidBody>
    );
  }

  return (
    <group>
      {segments}
      
      {/* Slanted recovery decks to catch skater and funnel them back into the pipe */}
      <RigidBody type="fixed" colliders="cuboid" friction={0} restitution={0}>
        <mesh position={[-15, 10.5, 0]} rotation={[0, 0, -0.1]} receiveShadow>
          <boxGeometry args={[10, 1, halfpipeLength]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" friction={0} restitution={0}>
        <mesh position={[15, 10.5, 0]} rotation={[0, 0, 0.1]} receiveShadow>
          <boxGeometry args={[10, 1, halfpipeLength]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </RigidBody>

      {/* Invisible walls above the decks to keep skater in bounds */}
      <RigidBody type="fixed" position={[-19, 20, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <CuboidCollider args={[1, 15, 10]} />
      </RigidBody>
      <RigidBody type="fixed" position={[19, 20, 0]} rotation={[0, 0, Math.PI / 8]}>
        <CuboidCollider args={[1, 15, 10]} />
      </RigidBody>
    </group>
  );
};

const Explosion = ({ position, onComplete }) => {
  const groupRef = useRef();
  const timeRef = useRef(0);
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      velocity: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ],
      rotSpeed: [Math.random() * 10, Math.random() * 10, 0],
      color: ['#f1c40f', '#e74c3c', '#ffffff'][Math.floor(Math.random() * 3)]
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    if (timeRef.current > 0.8) {
      if (onComplete) onComplete();
      return;
    }
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.x += p.velocity[0] * delta;
      child.position.y += p.velocity[1] * delta;
      child.position.z += p.velocity[2] * delta;
      child.rotation.x += p.rotSpeed[0] * delta;
      child.rotation.y += p.rotSpeed[1] * delta;
      child.scale.setScalar(Math.max(0, 1 - (timeRef.current / 0.8)));
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
};

const OptionsBoxes = ({ gameState, setGameState }) => {
  if (!gameState.questionActive) return null;

  const handleHit = (option, hitPosition) => {
    const isCorrect = option === gameState.currentQuestion.correct;
    setGameState(prev => ({ 
      ...prev, 
      score: isCorrect ? prev.score + 100 : Math.max(0, prev.score - 50), 
      message: isCorrect ? 'Correct!' : 'Oops!', 
      questionActive: false,
      explosions: [...prev.explosions, { id: Date.now(), position: hitPosition }]
    }));
  };

  return (
    <group>
      {gameState.currentQuestion.options.map((option, i) => {
        const xOffset = (i - 1) * 3.5; 
        const finalX = gameState.jumpX + xOffset;
        return (
          <RigidBody key={option} type="fixed" position={[finalX, 22, 0]}>
            <CuboidCollider 
              args={[1.5, 1.2, 1.5]} 
              sensor 
              onIntersectionEnter={() => handleHit(option, [finalX, 22, 0])} 
            />
            <mesh castShadow>
              <boxGeometry args={[2.5, 2, 2]} />
              <meshStandardMaterial color="#8e44ad" opacity={0.9} transparent />
            </mesh>
            <Text 
              position={[0, 0, 1.1]} 
              fontSize={0.8} 
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#000000"
            >
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
  
  useFrame(() => {
    if (!groupRef.current || !skaterRef.current) return;
    const pos = skaterRef.current.translation();
    
    let targetAngle = 0;
    if (pos.y < 9.5) {
      const x = THREE.MathUtils.clamp(pos.x, -9.9, 9.9);
      targetAngle = Math.asin(x / 10);
    }
    
    const currentRot = groupRef.current.rotation.z;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(currentRot, targetAngle, 0.2);
  });

  return (
    <group ref={groupRef}>
      {/* Skateboard */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.8, 0.1, 0.6]} />
        <meshStandardMaterial color="#d35400" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#f1c40f" />
      </mesh>
    </group>
  );
};

const Skater = forwardRef(({ gameState, setGameState }, ref) => {
  const [keys, setKeys] = useState({ left: false, right: false, space: false });
  const inAirRef = useRef(false);
  const jumpTriggeredRef = useRef(false);
  const initialPushRef = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: true }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: true }));
      if (e.code === 'Space') setKeys(k => ({ ...k, space: true }));
    };
    const handleKeyUp = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: false }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: false }));
      if (e.code === 'Space') setKeys(k => ({ ...k, space: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.translation();
    const velocity = ref.current.linvel();

    // Initial push to start the pendulum
    if (!initialPushRef.current && pos.y < 2) {
      ref.current.setLinvel({ x: 17.2, y: 0, z: 0 }, true);
      initialPushRef.current = true;
    }

    // Auto-pump at the center to maintain perfect halfpipe height
    if ((lastX.current < 0 && pos.x >= 0) || (lastX.current > 0 && pos.x <= 0)) {
      const dir = velocity.x >= 0 ? 1 : -1;
      ref.current.setLinvel({ x: 17.2 * dir, y: velocity.y, z: 0 }, true);
    }
    lastX.current = pos.x;

    // Jump logic at the red lips (y between 8 and 11)
    if (pos.y > 8 && pos.y < 11 && !jumpTriggeredRef.current) {
      if (keys.space && velocity.y > 0) {
        // Massive vertical velocity, dampen horizontal slightly
        ref.current.setLinvel({ x: velocity.x * 0.3, y: 22, z: 0 }, true);
        jumpTriggeredRef.current = true;
        inAirRef.current = true;
        
        setGameState(prev => {
           if (prev.questionActive) return prev;
           const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
           return { 
             ...prev, 
             questionActive: true, 
             currentQuestion: q, 
             message: '',
             jumpX: pos.x > 0 ? 10 : -10
           };
        });
      }
    }

    // Mid-air steering
    if (pos.y > 11 && inAirRef.current) {
      const speed = velocity.x;
      if (keys.left && speed > -10) {
        ref.current.applyImpulse({ x: -0.4, y: 0, z: 0 }, true);
      }
      if (keys.right && speed < 10) {
        ref.current.applyImpulse({ x: 0.4, y: 0, z: 0 }, true);
      }
    }

    // Landing check
    if (pos.y < 9 && inAirRef.current) {
      inAirRef.current = false;
      jumpTriggeredRef.current = false;
      if (gameState.questionActive) {
        setGameState(prev => ({ 
          ...prev, 
          questionActive: false, 
          message: 'Missed the trick!',
          score: Math.max(0, prev.score - 20)
        }));
      }
    }
  });

  return (
    <RigidBody 
      ref={ref} 
      position={[0, 2, 0]} 
      colliders={false} 
      friction={0} 
      restitution={0}
      enabledRotations={[false, false, false]}
      enabledTranslations={[true, true, false]}
    >
      <CapsuleCollider args={[0.6, 0.3]} position={[0, 0.9, 0]} />
      <SkaterMeshes skaterRef={ref} />
    </RigidBody>
  );
});

const CameraController = ({ skaterRef }) => {
  useFrame((state) => {
    if (!skaterRef.current) return;
    const pos = skaterRef.current.translation();
    const targetX = pos.x * 0.4;
    const targetY = Math.max(12, pos.y + 2);
    state.camera.position.lerp(new THREE.Vector3(targetX, targetY, 35), 0.1);
    state.camera.lookAt(targetX * 0.5, targetY - 5, 0);
  });
  return null;
};

const GameScene = ({ gameState, setGameState }) => {
  const skaterRef = useRef();

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 30, 20]} castShadow intensity={1.2} shadow-mapSize={[2048, 2048]} />
      <Sky sunPosition={[100, 20, 100]} />
      
      <Physics gravity={[0, -15, 0]}>
        <Halfpipe />
        <Skater ref={skaterRef} gameState={gameState} setGameState={setGameState} />
        <OptionsBoxes gameState={gameState} setGameState={setGameState} />
      </Physics>

      {gameState.explosions.map(exp => (
        <Explosion 
          key={exp.id} 
          position={exp.position} 
          onComplete={() => {
            setGameState(prev => ({
              ...prev,
              explosions: prev.explosions.filter(e => e.id !== exp.id)
            }))
          }} 
        />
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
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', padding: '15px 30px', 
          borderRadius: '20px', color: '#2c3e50', fontSize: '28px', fontWeight: '900',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '4px solid #3498db'
        }}>
          SCORE: {gameState.score}
        </div>
        <button 
          onClick={onExit}
          style={{
            pointerEvents: 'auto',
            background: '#e74c3c', color: 'white', border: '4px solid #c0392b',
            padding: '15px 30px', borderRadius: '20px', fontSize: '24px',
            cursor: 'pointer', fontWeight: '900',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Beenden
        </button>
      </div>

      <div style={{ textAlign: 'center', pointerEvents: 'none', marginBottom: '15vh' }}>
        {!gameState.questionActive && !gameState.message && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)', padding: '15px 30px',
            borderRadius: '20px', display: 'inline-block',
            color: 'white', fontSize: '24px', fontWeight: 'bold'
          }}>
            Press SPACE at the red lips to jump!
          </div>
        )}

        {gameState.questionActive && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)', padding: '30px 50px',
            borderRadius: '30px', display: 'inline-block',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)', border: '5px solid #9b59b6'
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '42px', fontWeight: '900' }}>
              {gameState.currentQuestion.text}
            </h2>
            <p style={{ margin: '15px 0 0', color: '#7f8c8d', fontSize: '22px', fontWeight: 'bold' }}>
              USE <span style={{ color: '#e74c3c' }}>A / D</span> TO STEER TO THE ANSWER!
            </p>
          </div>
        )}
        
        {gameState.message && !gameState.questionActive && (
          <div key={Date.now()} style={{
            background: gameState.message === 'Correct!' ? '#2ecc71' : '#e74c3c',
            padding: '20px 40px', borderRadius: '20px', display: 'inline-block',
            color: 'white', fontSize: '36px', fontWeight: '900',
            border: `5px solid ${gameState.message === 'Correct!' ? '#27ae60' : '#c0392b'}`,
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            animation: 'popAndFade 1.5s forwards'
          }}>
            {gameState.message}
          </div>
        )}
      </div>

      <style>{`
        @keyframes popAndFade {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          15% { opacity: 1; transform: scale(1.1) translateY(0); }
          30% { opacity: 1; transform: scale(1) translateY(0); }
          70% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.9) translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default function FaskaTonyHawk({ onExit }) {
  const [gameState, setGameState] = useState({
    score: 0,
    questionActive: false,
    currentQuestion: null,
    message: '',
    jumpX: 0,
    explosions: []
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scenery />
          <GameScene gameState={gameState} setGameState={setGameState} />
        </Suspense>
      </Canvas>
      <GameUI gameState={gameState} onExit={onExit} />
    </div>
  );
}
