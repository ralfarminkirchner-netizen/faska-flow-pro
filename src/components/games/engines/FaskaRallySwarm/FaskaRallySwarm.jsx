import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sky } from '@react-three/drei';
import * as THREE from 'three';

const vocabulary = [
  { singular: "Auto", plural: "Autos", wrong: "Auten" },
  { singular: "Haus", plural: "Häuser", wrong: "Hausen" },
  { singular: "Hund", plural: "Hunde", wrong: "Hünds" },
  { singular: "Maus", plural: "Mäuse", wrong: "Mausen" },
  { singular: "Kind", plural: "Kinder", wrong: "Kinds" },
  { singular: "Wald", plural: "Wälder", wrong: "Walde" },
  { singular: "Stadt", plural: "Städte", wrong: "Stadts" },
  { singular: "Buch", plural: "Bücher", wrong: "Buchs" },
  { singular: "Frau", plural: "Frauen", wrong: "Fräulein" },
  { singular: "Mann", plural: "Männer", wrong: "Manns" },
  { singular: "Vogel", plural: "Vögel", wrong: "Vogels" },
  { singular: "Baum", plural: "Bäume", wrong: "Baums" },
];

let segmentIdCounter = 0;
function createRandomSegment(z) {
  const word = vocabulary[Math.floor(Math.random() * vocabulary.length)];
  const swap = Math.random() > 0.5;
  const rocks = [];
  for (let i = 0; i < 15; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    rocks.push({
      x: side * (22 + Math.random() * 30),
      z: z - Math.random() * 200,
      scale: 1 + Math.random() * 3
    });
  }
  return {
    id: segmentIdCounter++,
    z: z,
    question: word.singular,
    leftOption: swap ? word.wrong : word.plural,
    rightOption: swap ? word.plural : word.wrong,
    correctAnswer: word.plural,
    passed: false,
    rocks
  };
}

const useKeyboard = () => {
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false });
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') setKeys(k => ({ ...k, forward: true }));
      if (key === 'arrowdown' || key === 's') setKeys(k => ({ ...k, backward: true }));
      if (key === 'arrowleft' || key === 'a') setKeys(k => ({ ...k, left: true }));
      if (key === 'arrowright' || key === 'd') setKeys(k => ({ ...k, right: true }));
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') setKeys(k => ({ ...k, forward: false }));
      if (key === 'arrowdown' || key === 's') setKeys(k => ({ ...k, backward: false }));
      if (key === 'arrowleft' || key === 'a') setKeys(k => ({ ...k, left: false }));
      if (key === 'arrowright' || key === 'd') setKeys(k => ({ ...k, right: false }));
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

const CarVisuals = React.forwardRef((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Main Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color="#d12a2a" />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.25, -0.2]} castShadow>
        <boxGeometry args={[1.6, 0.6, 1.5]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.7, 0.75, -2.05]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.7, 0.75, -2.05]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} />
      </mesh>
      {/* Wheels */}
      {[-1.1, 1.1].map(x => 
        [-1.2, 1.2].map(z => (
          <mesh key={`${x}-${z}`} position={[x, 0.4, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))
      )}
    </group>
  );
});

const LightSetup = ({ carRef }) => {
  const lightRef = useRef();
  useFrame(() => {
    if (carRef.current && lightRef.current) {
       lightRef.current.position.set(
         carRef.current.position.x + 50,
         50,
         carRef.current.position.z + 50
       );
       lightRef.current.target.position.copy(carRef.current.position);
       lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <directionalLight 
      ref={lightRef}
      intensity={1.2} 
      castShadow 
      shadow-mapSize={[1024, 1024]} 
      shadow-camera-far={200} 
      shadow-camera-left={-60} 
      shadow-camera-right={60} 
      shadow-camera-top={60} 
      shadow-camera-bottom={-60} 
    />
  );
};

const Ground = ({ carRef }) => {
  const groundRef = useRef();
  useFrame(() => {
    if (carRef.current && groundRef.current) {
      groundRef.current.position.z = carRef.current.position.z;
    }
  });
  return (
    <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#e6d3a8" roughness={1} />
    </mesh>
  );
};

const Track = ({ segments }) => {
  return (
    <group>
      {segments.map(seg => (
        <group key={seg.id}>
          {/* Main Road segment */}
          <mesh position={[0, 0, seg.z - 100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[40, 200]} />
            <meshStandardMaterial color="#c2a77a" roughness={0.9} />
          </mesh>
          
          {/* Divider Wall (from -100 to -180 relative to seg.z) */}
          <mesh position={[0, 1, seg.z - 140]} castShadow receiveShadow>
            <boxGeometry args={[2, 2, 80]} />
            <meshStandardMaterial color="#b35900" roughness={0.6} />
          </mesh>

          {/* Left Signpost */}
          <group position={[-10, 0, seg.z - 120]}>
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 4]} />
              <meshStandardMaterial color="#555" />
            </mesh>
            <mesh position={[0, 4, 0]} castShadow>
              <boxGeometry args={[10, 3, 0.5]} />
              <meshStandardMaterial color="#1a5276" />
            </mesh>
            <Text position={[0, 4, 0.26]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
              {seg.leftOption}
            </Text>
          </group>

          {/* Right Signpost */}
          <group position={[10, 0, seg.z - 120]}>
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 4]} />
              <meshStandardMaterial color="#555" />
            </mesh>
            <mesh position={[0, 4, 0]} castShadow>
              <boxGeometry args={[10, 3, 0.5]} />
              <meshStandardMaterial color="#1a5276" />
            </mesh>
            <Text position={[0, 4, 0.26]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
              {seg.rightOption}
            </Text>
          </group>

          {/* Trigger Line Visual */}
          <mesh position={[0, 0.01, seg.z - 120]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[40, 1]} />
            <meshBasicMaterial color="white" transparent opacity={0.6} />
          </mesh>
          
          {/* Rocks */}
          {seg.rocks.map((rock, idx) => (
            <mesh key={idx} position={[rock.x, rock.scale/2, rock.z]} castShadow receiveShadow>
              <dodecahedronGeometry args={[rock.scale]} />
              <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

const Scene = ({ setScore, segments, setSegments, onFlash }) => {
  const carRef = useRef();
  const keys = useKeyboard();
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  const speed = useRef(0);

  // Particles state
  const dustMeshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useRef(Array.from({length: 150}, () => ({
    active: false, position: new THREE.Vector3(), velocity: new THREE.Vector3(), life: 0
  })));
  let pIdx = useRef(0);

  useFrame((state, delta) => {
    if (!carRef.current) return;
    
    // Smooth delta to avoid physics glitches on lag spikes
    const dt = Math.min(delta, 0.1);

    const maxSpeed = 60;
    const accel = 35;
    const decel = 15;
    const turnSpeed = 2.5;
    
    if (keys.forward) speed.current = Math.min(speed.current + accel * dt, maxSpeed);
    else if (keys.backward) speed.current = Math.max(speed.current - accel * dt, -maxSpeed / 2);
    else {
      if (speed.current > 0) speed.current = Math.max(0, speed.current - decel * dt);
      if (speed.current < 0) speed.current = Math.min(0, speed.current + decel * dt);
    }
    
    const speedFactor = Math.abs(speed.current) / maxSpeed;
    if (keys.left) rotation.current += turnSpeed * dt * Math.max(0.3, speedFactor);
    if (keys.right) rotation.current -= turnSpeed * dt * Math.max(0.3, speedFactor);
    
    const forward = new THREE.Vector3(-Math.sin(rotation.current), 0, -Math.cos(rotation.current));
    const desiredVelocity = forward.multiplyScalar(speed.current);
    
    // Drifty feel via lerp
    velocity.current.lerp(desiredVelocity, 4.0 * dt);
    
    carRef.current.position.add(velocity.current.clone().multiplyScalar(dt));
    carRef.current.rotation.y = rotation.current;
    
    // Track boundaries (Off-road slow down)
    if (carRef.current.position.x < -20) {
       carRef.current.position.x = -20;
       speed.current *= 0.9;
    }
    if (carRef.current.position.x > 20) {
       carRef.current.position.x = 20;
       speed.current *= 0.9;
    }
    
    const cx = carRef.current.position.x;
    const cz = carRef.current.position.z;
    
    segments.forEach(seg => {
      // Wall collision
      if (cz < seg.z - 100 && cz > seg.z - 180) {
        if (cx > -2.5 && cx < 2.5) {
          if (cx > 0) {
            carRef.current.position.x = 2.5;
            velocity.current.x = Math.max(0, velocity.current.x);
          } else {
            carRef.current.position.x = -2.5;
            velocity.current.x = Math.min(0, velocity.current.x);
          }
          speed.current *= 0.6; // crash slowdown
        }
      }
      
      // Educational trigger
      if (!seg.passed && cz < seg.z - 120) {
        seg.passed = true;
        const lane = cx < 0 ? 'left' : 'right';
        const chosen = lane === 'left' ? seg.leftOption : seg.rightOption;
        
        if (chosen === seg.correctAnswer) {
          setScore(s => s + 10);
          onFlash('rgba(0, 255, 0, 0.4)');
        } else {
          setScore(s => Math.max(0, s - 5));
          onFlash('rgba(255, 0, 0, 0.4)');
          speed.current *= 0.5; // penalty slow
        }
      }
    });
    
    // Spawn new segments ahead
    const lastSeg = segments[segments.length - 1];
    if (cz < lastSeg.z - 50) {
       setSegments(prev => {
          // keep local state clean by only keeping nearby segments
          const newSegs = prev.filter(s => s.z < cz + 300);
          newSegs.push(createRandomSegment(lastSeg.z - 200));
          return newSegs;
       });
    }
    
    // Camera follow (fixed angle)
    const idealPos = carRef.current.position.clone().add(new THREE.Vector3(0, 12, 30));
    state.camera.position.lerp(idealPos, 6 * dt);
    const lookAtPos = carRef.current.position.clone().add(new THREE.Vector3(0, 0, -10));
    state.camera.lookAt(lookAtPos);
    
    // Dust Particles Emission
    if (Math.abs(speed.current) > 10 && dustMeshRef.current) {
       for(let i=0; i<2; i++) {
         const p = particles.current[pIdx.current];
         p.active = true;
         p.life = 1.0;
         p.position.copy(carRef.current.position);
         p.position.y = 0.2;
         p.position.x += (Math.random() - 0.5) * 2;
         p.position.z += (Math.random() - 0.5) * 2;
         p.velocity.set((Math.random() - 0.5)*3, Math.random()*2+1, (Math.random() - 0.5)*3);
         pIdx.current = (pIdx.current + 1) % 150;
       }
    }
    
    // Update Particles
    if (dustMeshRef.current) {
      particles.current.forEach((p, i) => {
        if (p.active) {
          p.life -= dt * 2.0;
          p.position.addScaledVector(p.velocity, dt);
          if (p.life <= 0) p.active = false;
          
          if (p.active) {
            dummy.position.copy(p.position);
            dummy.scale.setScalar(p.life * 1.5);
            dummy.updateMatrix();
            dustMeshRef.current.setMatrixAt(i, dummy.matrix);
          } else {
            dummy.scale.setScalar(0);
            dummy.updateMatrix();
            dustMeshRef.current.setMatrixAt(i, dummy.matrix);
          }
        }
      });
      dustMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.3} rayleigh={0.5} />
      <ambientLight intensity={0.5} />
      <LightSetup carRef={carRef} />
      
      <CarVisuals ref={carRef} />
      
      <Ground carRef={carRef} />
      <Track segments={segments} />
      
      <instancedMesh ref={dustMeshRef} args={[null, null, 150]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#e6d3a8" transparent opacity={0.5} />
      </instancedMesh>
    </>
  );
};

export default function FaskaRallySwarm({ onExit }) {
  const [score, setScore] = useState(0);
  const [segments, setSegments] = useState(() => [
    createRandomSegment(0),
    createRandomSegment(-200),
    createRandomSegment(-400)
  ]);
  const [flash, setFlash] = useState(null);

  const currentSeg = segments.find(s => !s.passed) || segments[0];

  const handleFlash = (color) => {
    setFlash(color);
    setTimeout(() => setFlash(null), 300);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#87CEEB' }}>
      
      {/* Flash overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: flash || 'transparent',
        pointerEvents: 'none',
        zIndex: 5,
        transition: 'background-color 0.1s'
      }} />
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
          <button 
            onClick={onExit} 
            style={{ 
              pointerEvents: 'auto', padding: '12px 24px', fontSize: '18px', 
              background: '#ff4444', color: 'white', border: 'none', 
              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)', height: 'fit-content'
            }}>
            Beenden
          </button>
          
          <div style={{ 
            background: 'rgba(0,0,0,0.8)', color: 'white', padding: '15px 40px', 
            borderRadius: '12px', textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '18px', opacity: 0.9, marginBottom: '5px' }}>Finde die Mehrzahl von:</div>
            <div style={{ fontSize: '40px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {currentSeg.question}
            </div>
            <div style={{ fontSize: '14px', marginTop: '10px', color: '#ffcc00' }}>
              Nutze W A S D oder Pfeiltasten
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(0,0,0,0.8)', color: 'white', padding: '15px 30px', 
            borderRadius: '12px', fontSize: '28px', fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)', height: 'fit-content',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            Punkte: <span style={{ color: '#44ff44' }}>{score}</span>
          </div>
        </div>
      </div>

      <Canvas shadows camera={{ fov: 60, position: [0, 15, 30] }}>
        <Scene 
          setScore={setScore} 
          segments={segments} setSegments={setSegments}
          onFlash={handleFlash}
        />
      </Canvas>
    </div>
  );
}
