import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const G = 20;
const FLAT_WIDTH = 2;
const R = 8;
const MAX_X = FLAT_WIDTH + R;

function getRampY(x) {
  const ax = Math.abs(x);
  if (ax <= FLAT_WIDTH) return 0;
  if (ax >= MAX_X) return R;
  const xp = ax - FLAT_WIDTH;
  return R - Math.sqrt(R * R - xp * xp);
}

function getRampSlope(x) {
  const ax = Math.abs(x);
  if (ax <= FLAT_WIDTH) return 0;
  if (ax >= MAX_X) return 10000 * Math.sign(x);
  const xp = ax - FLAT_WIDTH;
  const dy = xp / Math.sqrt(R * R - xp * xp);
  return dy * Math.sign(x);
}

const HalfpipeGeometry = () => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-MAX_X - 2, R);
    for(let i=0; i<=30; i++) {
       const t = i/30;
       const x = -MAX_X + t * R; 
       const y = getRampY(x);
       s.lineTo(x, y);
    }
    s.lineTo(FLAT_WIDTH, 0);
    for(let i=0; i<=30; i++) {
       const t = i/30;
       const x = FLAT_WIDTH + t * R;
       const y = getRampY(x);
       s.lineTo(x, y);
    }
    s.lineTo(MAX_X + 2, R);
    s.lineTo(MAX_X + 2, -2);
    s.lineTo(-MAX_X - 2, -2);
    s.lineTo(-MAX_X - 2, R);
    return s;
  }, []);

  return (
    <group>
      <mesh position={[0, 0, -5]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: 10, bevelEnabled: false }]} />
        <meshStandardMaterial color="#222233" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.02, -5]}>
        <extrudeGeometry args={[shape, { depth: 10, bevelEnabled: false }]} />
        <meshBasicMaterial color="#ff00ff" wireframe={true} transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const ParticleSystem = ({ triggerRef }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useRef([]);
  
  useEffect(() => {
    triggerRef.current = (pos, type) => {
       const color = type === 'success' ? new THREE.Color('#00ffff') : new THREE.Color('#ff00ff');
       for(let i=0; i<30; i++) {
         particles.current.push({
           pos: pos.clone(),
           vel: new THREE.Vector3((Math.random()-0.5)*15, (Math.random()-0.5)*15 + 5, (Math.random()-0.5)*15),
           life: 1.0,
           maxLife: 1.0 + Math.random() * 0.5,
           color: color
         });
       }
    };
  }, [triggerRef]);

  useFrame((state, dt) => {
    const delta = Math.min(dt, 0.1);
    particles.current.forEach(p => {
      p.life -= delta;
      p.pos.addScaledVector(p.vel, delta);
      p.vel.y -= G * delta;
    });
    particles.current = particles.current.filter(p => p.life > 0);
    
    if (meshRef.current) {
      particles.current.forEach((p, i) => {
        dummy.position.copy(p.pos);
        const scale = p.life / p.maxLife;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, p.color);
      });
      meshRef.current.count = particles.current.length;
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, 200]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

const CameraRig = ({ skaterPos, shakeRef }) => {
  const { camera } = useThree();
  useFrame(() => {
     const targetX = skaterPos.current.x * 0.3;
     const targetY = Math.max(8, skaterPos.current.y * 0.8 + 4);
     
     let sx = 0, sy = 0;
     if (shakeRef.current > 0) {
       sx = (Math.random() - 0.5) * shakeRef.current;
       sy = (Math.random() - 0.5) * shakeRef.current;
       shakeRef.current *= 0.85;
     }

     camera.position.lerp(new THREE.Vector3(targetX + sx, targetY + sy, 25), 0.1);
     camera.lookAt(targetX + sx, targetY - 4 + sy, 0);
  });
  return null;
};

const GameScene = ({ pos, vel, s_vel, isAirborne, skaterRotation, answeredRef, triggerParticlesRef, generateNewQuestion, question, setQuestion, setFeedback, setStreak, shakeRef, flashRef }) => {
  const skaterRef = useRef();
  const dirLightRef = useRef();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    if (flashRef.current > 0) {
       flashRef.current -= dt * 3;
       if (dirLightRef.current) {
          dirLightRef.current.intensity = 1.5 + flashRef.current * 4;
          dirLightRef.current.color.set(answeredRef.current === true ? '#00ffff' : '#ff00ff');
       }
    } else {
       if (dirLightRef.current) {
          dirLightRef.current.intensity = 1.5;
          dirLightRef.current.color.set('#00ffff');
       }
    }

    if (isAirborne.current) {
      vel.current.y -= G * dt;
      pos.current.x += vel.current.x * dt;
      pos.current.y += vel.current.y * dt;

      if (answeredRef.current === true) {
         skaterRotation.current += 15 * dt;
         skaterRef.current.rotation.z = skaterRotation.current;
         skaterRef.current.rotation.y = skaterRotation.current * 0.5;
      } else {
         skaterRef.current.rotation.z += 5 * dt;
         skaterRef.current.rotation.x += 8 * dt;
      }

      const ry = getRampY(pos.current.x);
      if (pos.current.y <= ry && vel.current.y < 0) {
        isAirborne.current = false;
        pos.current.y = ry;
        
        if (question) {
           if (answeredRef.current === true) {
             triggerParticlesRef.current(pos.current, 'success');
             flashRef.current = 1.0;
           } else {
             triggerParticlesRef.current(pos.current, 'fail');
             shakeRef.current = 1.5;
             flashRef.current = 1.0;
             if (answeredRef.current !== 'wrong') {
                 setFeedback('TOO SLOW!');
                 setStreak(0);
             }
             s_vel.current = -Math.sign(pos.current.x) * 5; 
           }
           setQuestion(null);
           setTimeout(() => setFeedback(null), 1500);
        }
        
        const slope = getRampSlope(pos.current.x);
        const angle = Math.atan(slope);
        
        if (answeredRef.current === true || !question) {
           s_vel.current = vel.current.x * Math.cos(angle) + vel.current.y * Math.sin(angle);
           if (answeredRef.current === true) {
             s_vel.current += Math.sign(s_vel.current) * 8; 
           }
        }
        skaterRotation.current = 0;
        skaterRef.current.rotation.x = 0;
      }
    } else {
      const ax = Math.abs(pos.current.x);
      
      if (ax >= MAX_X - 0.1 && vel.current.y > 0 && pos.current.y >= R - 0.5) {
        isAirborne.current = true;
        vel.current.y = Math.abs(s_vel.current);
        vel.current.x = -Math.sign(pos.current.x) * 0.2; 
        pos.current.x = Math.sign(pos.current.x) * (MAX_X - 0.1);
        pos.current.y = getRampY(pos.current.x);
        
        generateNewQuestion();
      } else {
        const slope = getRampSlope(pos.current.x);
        const angle = Math.atan(slope);
        
        let a_tangent = -G * Math.sin(angle);
        
        const isMovingDown = (s_vel.current < 0 && pos.current.x > 0) || (s_vel.current > 0 && pos.current.x < 0);
        if (isMovingDown) {
          a_tangent += Math.sign(s_vel.current) * 20;
        } else {
          a_tangent -= Math.sign(s_vel.current) * 2;
        }
        
        s_vel.current += a_tangent * dt;
        s_vel.current *= 0.995;
        
        if (Math.abs(s_vel.current) > 35) {
            s_vel.current = Math.sign(s_vel.current) * 35;
        }

        vel.current.x = s_vel.current * Math.cos(angle);
        vel.current.y = s_vel.current * Math.sin(angle);

        pos.current.x += vel.current.x * dt;
        pos.current.y = getRampY(pos.current.x);

        skaterRef.current.rotation.z = angle;
        skaterRef.current.rotation.y = s_vel.current > 0 ? 0 : Math.PI;
        skaterRef.current.rotation.x = 0;
      }
    }
    
    if (skaterRef.current) {
        skaterRef.current.position.copy(pos.current);
    }
  });

  return (
    <>
      <color attach="background" args={['#1a0b2e']} />
      <fog attach="fog" args={['#1a0b2e', 10, 50]} />
      <ambientLight intensity={0.4} />
      <directionalLight ref={dirLightRef} position={[10, 20, 10]} intensity={1.5} color="#00ffff" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
      <directionalLight position={[-10, 10, 10]} intensity={1} color="#ff00ff" />
      
      <CameraRig skaterPos={pos} shakeRef={shakeRef} />
      <HalfpipeGeometry />
      <ParticleSystem triggerRef={triggerParticlesRef} />
      
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a0515" />
      </mesh>
      
      <group ref={skaterRef}>
        <mesh castShadow position={[0, 0.13, 0]}>
          <boxGeometry args={[1, 0.1, 0.3]} />
          <meshStandardMaterial color="#ff00ff" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[-0.4, 0.08, 0.1]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1]} />
          <meshStandardMaterial color="#00ffff" />
        </mesh>
        <mesh castShadow position={[0.4, 0.08, 0.1]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1]} />
          <meshStandardMaterial color="#00ffff" />
        </mesh>
        <mesh castShadow position={[-0.4, 0.08, -0.1]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1]} />
          <meshStandardMaterial color="#00ffff" />
        </mesh>
        <mesh castShadow position={[0.4, 0.08, -0.1]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1]} />
          <meshStandardMaterial color="#00ffff" />
        </mesh>
        <mesh castShadow position={[0, 0.7, 0]}>
          <boxGeometry args={[0.4, 1, 0.4]} />
          <meshStandardMaterial color="#00ffff" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
      </group>
    </>
  );
};

const HUD = ({ score, streak, question, feedback, onExit }) => {
  return (
    <>
      <style>
        {`
          @keyframes popIn {
            0% { transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); opacity: 0; }
            70% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes flashStreak {
            0% { color: #00ffff; }
            50% { color: #ff00ff; }
            100% { color: #00ffff; }
          }
        `}
      </style>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, color: '#00ffff', fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 0 #ff00ff, 4px 4px 0 #000', letterSpacing: '2px', pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, fontSize: '48px', fontStyle: 'italic' }}>SCORE: {score}</h1>
        <h2 style={{ margin: 0, fontSize: '32px', color: streak > 2 ? '#ff00ff' : '#00ffff', animation: streak > 2 ? 'flashStreak 0.5s infinite' : 'none' }}>
          STREAK: x{streak}
        </h2>
      </div>
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <button 
          onClick={onExit} 
          style={{ 
            padding: '12px 24px', fontSize: '20px', background: '#ff00ff', color: 'white', 
            border: '4px solid #00ffff', borderRadius: '0', cursor: 'pointer', 
            fontFamily: 'Impact, sans-serif', letterSpacing: '1px', textTransform: 'uppercase',
            boxShadow: '4px 4px 0 #00ffff', transition: 'all 0.1s'
          }}
          onMouseOver={e => e.target.style.background = '#00ffff'}
          onMouseOut={e => e.target.style.background = '#ff00ff'}
        >
          Beenden
        </button>
      </div>

      {question && (
        <div style={{ 
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', 
          zIndex: 100, color: '#00ffff', fontFamily: 'Impact, sans-serif', textAlign: 'center', pointerEvents: 'none',
          animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}>
          <div style={{ fontSize: '96px', textShadow: '4px 4px 0 #ff00ff, 8px 8px 0 #000', letterSpacing: '4px', background: 'rgba(0,0,0,0.6)', padding: '20px 40px', border: '4px solid #ff00ff', transform: 'skewX(-10deg)' }}>
            {question.a} {question.op} {question.b} = ?
          </div>
          <div style={{ fontSize: '28px', color: '#fff', marginTop: '15px', textShadow: '2px 2px 0 #000', letterSpacing: '2px' }}>
            PRESS NUMBER KEY (0-9) TO LAND!
          </div>
        </div>
      )}

      {feedback && (
        <div style={{ 
          position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', 
          zIndex: 100, color: feedback === 'RADICAL!' ? '#00ffff' : '#ff00ff', 
          fontFamily: 'Impact, sans-serif', fontSize: '80px', textShadow: '4px 4px 0 #000, 8px 8px 0 ' + (feedback === 'RADICAL!' ? '#ff00ff' : '#00ffff'), 
          pointerEvents: 'none', animation: 'popIn 0.3s ease-out forwards', letterSpacing: '5px', fontStyle: 'italic' 
        }}>
          {feedback}
        </div>
      )}
    </>
  );
}

export default function FaskaTonyHawkSwarm({ onExit }) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const s_vel = useRef(25);
  const isAirborne = useRef(false);
  const skaterRotation = useRef(0);
  const answeredRef = useRef(false);
  const triggerParticlesRef = useRef();
  const shakeRef = useRef(0);
  const flashRef = useRef(0);

  const generateNewQuestion = () => {
    const operations = ['+', '-', 'x'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer;
    if (op === '+') {
      answer = Math.floor(Math.random() * 10); 
      a = Math.floor(Math.random() * (answer + 1));
      b = answer - a;
    } else if (op === '-') {
      b = Math.floor(Math.random() * 10); 
      answer = Math.floor(Math.random() * 10); 
      a = answer + b;
    } else {
      const pairs = [
        [0,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7], [1,8], [1,9],
        [2,1], [2,2], [2,3], [2,4],
        [3,1], [3,2], [3,3],
        [4,1], [4,2],
        [5,1], [6,1], [7,1], [8,1], [9,1]
      ];
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      if (Math.random() > 0.5) {
         a = pair[0]; b = pair[1];
      } else {
         a = pair[1]; b = pair[0];
      }
      answer = a * b;
    }
    answeredRef.current = false;
    setQuestion({ a, b, op, answer });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!question || answeredRef.current) return;
      if (e.key >= '0' && e.key <= '9') {
        const val = parseInt(e.key, 10);
        if (val === question.answer) {
           answeredRef.current = true;
           setFeedback('RADICAL!');
           setScore(s => s + 100 + streak * 50);
           setStreak(s => s + 1);
        } else {
           answeredRef.current = 'wrong';
           setFeedback('WIPEOUT!');
           setStreak(0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, streak]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1a0b2e', position: 'relative' }}>
      <HUD score={score} streak={streak} question={question} feedback={feedback} onExit={onExit} />
      <Canvas shadows camera={{ position: [0, 5, 25], fov: 60 }}>
        <GameScene 
          pos={pos} vel={vel} s_vel={s_vel} isAirborne={isAirborne} 
          skaterRotation={skaterRotation} answeredRef={answeredRef}
          triggerParticlesRef={triggerParticlesRef}
          generateNewQuestion={generateNewQuestion}
          question={question}
          setQuestion={setQuestion}
          setFeedback={setFeedback}
          setStreak={setStreak}
          shakeRef={shakeRef}
          flashRef={flashRef}
        />
      </Canvas>
    </div>
  );
}
