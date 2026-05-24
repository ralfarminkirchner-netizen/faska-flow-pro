import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VOCABULARY = [
  { de: 'Hund', en: 'dog' },
  { de: 'Katze', en: 'cat' },
  { de: 'Haus', en: 'house' },
  { de: 'Auto', en: 'car' },
  { de: 'Apfel', en: 'apple' },
  { de: 'Wasser', en: 'water' },
  { de: 'Feuer', en: 'fire' },
  { de: 'Erde', en: 'earth' },
  { de: 'Wind', en: 'wind' },
  { de: 'Sonne', en: 'sun' },
  { de: 'Baum', en: 'tree' },
  { de: 'Blume', en: 'flower' },
  { de: 'Buch', en: 'book' },
  { de: 'Tisch', en: 'table' },
  { de: 'Stuhl', en: 'chair' },
];

function Particle({ velocity }) {
   const ref = useRef();
   const pos = useRef([0, 2, 0]); // Start at chest height
   const vel = useRef([...velocity]);
   const life = useRef(1.0);

   useFrame((state, delta) => {
      if (life.current <= 0) {
         if (ref.current) ref.current.visible = false;
         return;
      }
      life.current -= delta;
      
      vel.current[1] -= 20 * delta; // gravity
      pos.current[0] += vel.current[0] * delta;
      pos.current[1] += vel.current[1] * delta;
      pos.current[2] += vel.current[2] * delta;

      if (ref.current) {
          ref.current.position.set(...pos.current);
          ref.current.rotation.x += delta * 10;
          ref.current.rotation.y += delta * 10;
          const scale = Math.max(0, life.current);
          ref.current.scale.setScalar(scale);
      }
   });

   return (
       <mesh ref={ref}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#fbbf24" />
       </mesh>
   );
}

function Character({ isPlayer, action, health }) {
  const groupRef = useRef();
  const matRef = useRef();
  const timeRef = useRef(0);
  const prevAction = useRef(action);
  const prevHealth = useRef(health);

  const basePos = isPlayer ? [-3, 0, 0] : [3, 0, 0];
  const lungePos = isPlayer ? [1.5, 0, 0] : [-1.5, 0, 0];
  const originalColor = isPlayer ? new THREE.Color('#3b82f6') : new THREE.Color('#ef4444');
  
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (action !== prevAction.current) {
       timeRef.current = 0;
       prevAction.current = action;
    }
  }, [action]);

  useEffect(() => {
    if (health < prevHealth.current) {
        timeRef.current = 0; // reset for hit flash
        
        // Spawn particles
        const newParticles = Array.from({ length: 15 }).map((_, i) => ({
           id: Date.now() + i,
           velocity: [
             (Math.random() - 0.5) * 10,
             (Math.random() + 0.5) * 10,
             (Math.random() - 0.5) * 10
           ]
        }));
        setParticles(newParticles);
    }
    prevHealth.current = health;
  }, [health]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    
    if (groupRef.current) {
        let x = basePos[0];
        let y = basePos[1];
        let z = basePos[2];
        let rotZ = 0;

        const isPunching = (isPlayer && action === 'playerPunch') || (!isPlayer && action === 'opponentPunch');
        
        if (isPunching) {
            if (t < 0.2) { // Faster lunge
                const p = t / 0.2;
                x = THREE.MathUtils.lerp(basePos[0], lungePos[0], p);
                rotZ = THREE.MathUtils.lerp(0, isPlayer ? -0.5 : 0.5, p);
            } else if (t < 0.4) {
                x = lungePos[0];
                rotZ = isPlayer ? -0.5 : 0.5;
            } else if (t < 0.8) {
                const p = (t - 0.4) / 0.4;
                x = THREE.MathUtils.lerp(lungePos[0], basePos[0], p);
                rotZ = THREE.MathUtils.lerp(isPlayer ? -0.5 : 0.5, 0, p);
            }
        }
        
        const isHit = (!isPlayer && action === 'playerPunch') || (isPlayer && action === 'opponentPunch');
        let isFlash = false;
        if (isHit && t > 0.2 && t < 0.5) {
           x += (Math.random() - 0.5) * 0.3;
           y += (Math.random() - 0.5) * 0.3;
           isFlash = true;
        }

        groupRef.current.position.set(x, y, z);
        groupRef.current.rotation.z = rotZ;
        
        if (matRef.current) {
            if (isFlash) {
                matRef.current.color.set('#ffffff');
                matRef.current.emissive.set('#ffffff');
            } else {
                matRef.current.color.copy(originalColor);
                matRef.current.emissive.set('#000000');
            }
        }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.2, 2.2, 1.2]} />
        <meshStandardMaterial ref={matRef} color={originalColor} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isPlayer ? '#93c5fd' : '#fca5a5'} />
      </mesh>
      <mesh position={isPlayer ? [0.7, 1.5, 0] : [-0.7, 1.5, 0]} castShadow>
         <boxGeometry args={[0.6, 1.6, 0.6]} />
         <meshStandardMaterial color={originalColor} />
      </mesh>

      {particles.map(p => (
         <Particle key={p.id} velocity={p.velocity} />
      ))}
    </group>
  );
}

function CameraShake({ action }) {
  const { camera } = useThree();
  const initialPos = useRef(new THREE.Vector3(0, 4, 12));
  const timeRef = useRef(0);
  const prevAction = useRef(action);

  useEffect(() => {
     if (action !== prevAction.current) {
         timeRef.current = 0;
         prevAction.current = action;
     }
  }, [action]);

  useFrame((state, delta) => {
      timeRef.current += delta;
      const t = timeRef.current;
      let shake = 0;
      
      if ((action === 'playerPunch' || action === 'opponentPunch') && t > 0.2 && t < 0.5) {
          shake = 0.6; 
      }
      
      if (shake > 0) {
          camera.position.x = initialPos.current.x + (Math.random() - 0.5) * shake;
          camera.position.y = initialPos.current.y + (Math.random() - 0.5) * shake;
          camera.position.z = initialPos.current.z + (Math.random() - 0.5) * shake;
      } else {
          camera.position.lerp(initialPos.current, 0.1);
      }
      camera.lookAt(0, 2, 0);
  });
  
  return null;
}

export default function FaskaTekken({ onExit }) {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  
  const [words, setWords] = useState([...VOCABULARY].sort(() => Math.random() - 0.5));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState('playing'); 
  const [action, setAction] = useState('idle'); 

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    if (gameState !== 'playing' || action !== 'idle') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, action, currentWordIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || action !== 'idle') return;
      if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1 && e.key.match(/^[a-zA-Z]$/)) {
        setUserInput(prev => prev + e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, action]);

  useEffect(() => {
    if (gameState === 'playing' && action === 'idle' && userInput === currentWord?.en) {
      handlePlayerSuccess();
    }
  }, [userInput, gameState, action, currentWord]);

  const nextRound = (newPlayerHealth, newOpponentHealth) => {
    if (newPlayerHealth <= 0) {
      setGameState('lost');
      return;
    }
    if (newOpponentHealth <= 0) {
      setGameState('won');
      return;
    }
    setAction('idle');
    setUserInput('');
    setTimeLeft(10);
    setCurrentWordIndex(i => (i + 1) % words.length);
  };

  const handlePlayerSuccess = () => {
    setAction('playerPunch');
    let newOpp = opponentHealth - 34;
    if (newOpp < 0) newOpp = 0;
    
    setTimeout(() => {
      setOpponentHealth(newOpp);
    }, 200);
    
    setTimeout(() => {
      nextRound(playerHealth, newOpp);
    }, 1200);
  };

  const handleTimeout = () => {
    setAction('opponentPunch');
    let newPlayer = playerHealth - 34;
    if (newPlayer < 0) newPlayer = 0;

    setTimeout(() => {
      setPlayerHealth(newPlayer);
    }, 200);
    
    setTimeout(() => {
      nextRound(newPlayer, opponentHealth);
    }, 1200);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#111', overflow: 'hidden', fontFamily: 'sans-serif' }}>
       <Canvas shadows camera={{ position: [0, 4, 12], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#3b82f6" />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#ef4444" />
          
          <Character isPlayer={true} action={action} health={playerHealth} />
          <Character isPlayer={false} action={action} health={opponentHealth} />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
             <planeGeometry args={[100, 100]} />
             <meshStandardMaterial color="#222" roughness={0.8} />
          </mesh>
          
          <CameraShake action={action} />
       </Canvas>

       <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
               <div style={{ width: '35%', backgroundColor: '#444', height: '30px', border: '3px solid #3b82f6', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: `${playerHealth}%`, backgroundColor: '#3b82f6', height: '100%', transition: 'width 0.3s ease-out' }} />
               </div>
               
               <button 
                 onClick={onExit}
                 style={{ pointerEvents: 'auto', padding: '10px 20px', fontSize: '18px', backgroundColor: '#dc2626', color: 'white', border: '2px solid white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
               >
                 Beenden
               </button>
               
               <div style={{ width: '35%', backgroundColor: '#444', height: '30px', border: '3px solid #ef4444', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: `${opponentHealth}%`, backgroundColor: '#ef4444', height: '100%', transition: 'width 0.3s ease-out', float: 'right' }} />
               </div>
           </div>

           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '10vh' }}>
               {gameState === 'playing' ? (
                   <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: '30px 50px', borderRadius: '15px', border: '2px solid #555' }}>
                       <div style={{ fontSize: '48px', color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>{currentWord?.de}</div>
                       <div style={{ fontSize: '20px', color: '#aaa', marginBottom: '20px' }}>Translate to English</div>
                       <div style={{ fontSize: '36px', color: '#fbbf24', minHeight: '50px', borderBottom: '3px solid #fbbf24', display: 'inline-block', minWidth: '250px', letterSpacing: '2px' }}>
                           {userInput}
                       </div>
                       <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold', color: timeLeft <= 3 ? '#ef4444' : 'white' }}>
                           Time: {timeLeft}s
                       </div>
                   </div>
               ) : (
                   <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.85)', padding: '50px', borderRadius: '20px', border: `4px solid ${gameState === 'won' ? '#34d399' : '#ef4444'}`, pointerEvents: 'auto' }}>
                       <div style={{ fontSize: '64px', fontWeight: 'bold', color: gameState === 'won' ? '#34d399' : '#ef4444', marginBottom: '30px' }}>
                           {gameState === 'won' ? 'YOU WIN!' : 'DEFEATED'}
                       </div>
                       <button 
                           onClick={() => {
                               setPlayerHealth(100);
                               setOpponentHealth(100);
                               setGameState('playing');
                               setWords([...VOCABULARY].sort(() => Math.random() - 0.5));
                               setCurrentWordIndex(0);
                               setUserInput('');
                               setTimeLeft(10);
                               setAction('idle');
                           }}
                           style={{ padding: '15px 40px', fontSize: '24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                       >
                           Play Again
                       </button>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
}
