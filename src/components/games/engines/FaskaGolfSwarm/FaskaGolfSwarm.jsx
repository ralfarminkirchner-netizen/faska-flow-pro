import React, { useState, useRef, useEffect, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Trail } from '@react-three/drei';
import { Physics, RigidBody, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';

const GameContext = React.createContext();

const ButtonOverlay = ({ onExit }) => (
  <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, pointerEvents: 'auto' }}>
    <button 
      onClick={onExit}
      style={{
        padding: '10px 20px',
        fontSize: '18px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        fontWeight: 'bold'
      }}
    >
      Beenden
    </button>
  </div>
);

const PowerMeter = () => {
  const { store } = useContext(GameContext);
  const barRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    let animationFrameId;
    const loop = () => {
      if (barRef.current && textRef.current) {
        const power = store.current.power;
        barRef.current.style.width = `${power}%`;
        barRef.current.style.backgroundColor = power > 80 ? '#ff3333' : power > 50 ? '#ffcc00' : '#33cc33';
        textRef.current.innerText = `POWER ${Math.round(power)}%`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [store]);

  return (
    <div style={{ marginTop: '30px', width: '250px', height: '30px', background: 'rgba(0,0,0,0.7)', border: '2px solid white', position: 'relative', borderRadius: '15px', overflow: 'hidden' }}>
       <div ref={barRef} style={{ width: '0%', height: '100%', background: '#33cc33' }} />
       <div ref={textRef} style={{ position: 'absolute', top: '5px', left: '10px', fontWeight: 'bold', textShadow: '1px 1px 2px black' }}>POWER 0%</div>
    </div>
  );
};

const UI = () => {
  const { store } = useContext(GameContext);
  const [state, setState] = useState('aiming');
  const [strokes, setStrokes] = useState(0);
  const [wind, setWind] = useState({ x: 0, z: 0 });

  useEffect(() => {
    let animationFrameId;
    let lastState = '';
    let lastStrokes = -1;
    const loop = () => {
      const s = store.current;
      if (lastState !== s.state) {
        setState(s.state);
        lastState = s.state;
      }
      if (lastStrokes !== s.strokes) {
        setStrokes(s.strokes);
        lastStrokes = s.strokes;
      }
      setWind({ x: s.wind.x.toFixed(1), z: s.wind.z.toFixed(1) });
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [store]);

  const handleRestart = () => {
    store.current.state = 'aiming';
    store.current.strokes = 0;
    store.current.wind.set((Math.random() * 2 - 1), 0, (Math.random() * 2 - 1));
    store.current.resetFlag = true;
  };

  return (
    <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'monospace', fontSize: '18px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
        <h2 style={{ margin: 0, color: '#00ffcc' }}>Faska Golf Swarm</h2>
        <p style={{ margin: '5px 0' }}>Strokes: {strokes}</p>
        <p style={{ margin: '5px 0' }}>Wind: X:{wind.x} Z:{wind.z} (m/s)</p>
        
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.6)', borderRadius: '8px', border: '1px solid #00ffcc' }}>
           <h4 style={{ margin: '0 0 10px 0', color: '#00ffcc' }}>Hole Trajectory Math</h4>
           <p style={{ margin: '5px 0' }}><code>x(t) = 6 * cos(t / 2)</code></p>
           <p style={{ margin: '5px 0' }}><code>z(t) = -15 + 6 * sin(t / 2)</code></p>
           <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#aaa' }}>Observe the flag's parametric movement!</p>
        </div>

        {state === 'hole_in' && (
          <div style={{ pointerEvents: 'auto', marginTop: '20px', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', border: '2px solid #ffd700' }}>
            <div style={{ color: '#ffd700', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
              HOLE IN! YOU WIN!
            </div>
            <button 
              onClick={handleRestart} 
              style={{ 
                padding: '10px 20px', 
                fontSize: '18px', 
                cursor: 'pointer',
                backgroundColor: '#00ffcc',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}>
              Play Again
            </button>
          </div>
        )}

        {(state === 'aiming' || state === 'power') && (
          <div style={{ marginTop: '20px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#00ffcc' }}>Controls:</p>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>Left / Right Arrows : Aim</li>
              <li>Spacebar : Hold to Power, Release to Hit</li>
            </ul>
          </div>
        )}

        {(state === 'aiming' || state === 'power') && <PowerMeter />}
      </div>
    </div>
  );
};

const AimIndicator = () => {
  const { store } = useContext(GameContext);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const s = store.current;
      if (s.state === 'aiming' || s.state === 'power') {
         meshRef.current.visible = true;
         const bp = s.ballPosition;
         const angle = s.aimAngle;
         
         meshRef.current.position.set(
           bp.x - Math.sin(angle) * 2.5,
           bp.y,
           bp.z - Math.cos(angle) * 2.5
         );
         meshRef.current.rotation.y = angle;
      } else {
         meshRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.05, 0.05, 5]} />
      <meshBasicMaterial color="rgba(255, 255, 255, 0.8)" transparent />
    </mesh>
  );
};

const Hole = () => {
  const { store } = useContext(GameContext);
  const holeRef = useRef();
  
  useFrame(() => {
    const s = store.current;
    
    // Trajectory
    const hX = 0 + 6 * Math.cos(s.time * 0.5);
    const hZ = -15 + 6 * Math.sin(s.time * 0.5);
    
    s.holePos.set(hX, 0, hZ);
    
    if (holeRef.current) {
       holeRef.current.setNextKinematicTranslation({ x: hX, y: 0, z: hZ });
    }
  });

  return (
    <RigidBody 
      type="kinematicPosition" 
      ref={holeRef}
      colliders={false}
    >
      <CylinderCollider 
        args={[1, 1.5]} 
        sensor 
        onIntersectionEnter={(payload) => {
          if (payload.other.rigidBodyObject?.name === 'ball') {
             store.current.state = 'hole_in';
          }
        }}
      />
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.2, 1.5, 32]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      {/* Flag pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Flag */}
      <mesh position={[0.5, 3.5, 0]}>
        <planeGeometry args={[1, 0.6]} />
        <meshStandardMaterial color="red" side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
};

const Terrain = () => {
  return (
    <>
      {/* Main ground */}
      <RigidBody type="fixed" friction={0.8} restitution={0.2}>
        <mesh receiveShadow position={[0, -0.5, -10]}>
          <boxGeometry args={[40, 1, 60]} />
          <meshStandardMaterial color="#2E8B57" />
        </mesh>
      </RigidBody>

      {/* Slopes */}
      <RigidBody type="fixed" friction={0.5}>
        <mesh receiveShadow position={[-8, 0, -5]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[10, 1, 10]} />
          <meshStandardMaterial color="#3CB371" />
        </mesh>
      </RigidBody>
      
      <RigidBody type="fixed" friction={0.5}>
        <mesh receiveShadow position={[8, 0, -15]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[10, 1, 10]} />
          <meshStandardMaterial color="#3CB371" />
        </mesh>
      </RigidBody>
      
      <RigidBody type="fixed" friction={0.5}>
        <mesh receiveShadow position={[0, -1, -25]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[20, 1, 15]} />
          <meshStandardMaterial color="#3CB371" />
        </mesh>
      </RigidBody>

      {/* Obstacles */}
      <RigidBody type="fixed" restitution={0.8}>
        <mesh castShadow receiveShadow position={[0, 1, -8]}>
          <boxGeometry args={[10, 2, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      
      {/* Side walls */}
      <RigidBody type="fixed" restitution={0.5}>
        <mesh castShadow receiveShadow position={[-20, 1, -10]}>
          <boxGeometry args={[1, 4, 60]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" restitution={0.5}>
        <mesh castShadow receiveShadow position={[20, 1, -10]}>
          <boxGeometry args={[1, 4, 60]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" restitution={0.5}>
        <mesh castShadow receiveShadow position={[0, 1, -40]}>
          <boxGeometry args={[40, 4, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" restitution={0.5}>
        <mesh castShadow receiveShadow position={[0, 1, 20]}>
          <boxGeometry args={[40, 4, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
    </>
  );
};

const WindParticles = () => {
  const { store } = useContext(GameContext);
  const groupRef = useRef();
  
  const particles = useRef(Array.from({ length: 30 }).map(() => ({
    x: (Math.random() - 0.5) * 40,
    y: Math.random() * 5 + 1,
    z: (Math.random() - 0.5) * 40,
    speedScale: Math.random() * 0.5 + 0.5
  })));

  useFrame((state, delta) => {
    const s = store.current;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
         const p = particles.current[i];
         p.x += s.wind.x * p.speedScale * delta * 5;
         p.z += s.wind.z * p.speedScale * delta * 5;
         
         // wrap around
         if (p.x > 20) p.x -= 40;
         if (p.x < -20) p.x += 40;
         if (p.z > 20) p.z -= 60;
         if (p.z < -40) p.z += 60;
         
         child.position.set(p.x, p.y, p.z);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.2, 0.05, 0.4]} />
          <meshBasicMaterial color="white" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = () => {
  const { store } = useContext(GameContext);
  const ballRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const s = store.current;
      if (s.state === 'aiming') {
        if (e.code === 'ArrowLeft') {
          s.aimAngle += 0.1;
        } else if (e.code === 'ArrowRight') {
          s.aimAngle -= 0.1;
        } else if (e.code === 'Space') {
          s.state = 'power';
          s.power = 0;
          s.powerIncreasing = true;
        }
      }
    };
    
    const handleKeyUp = (e) => {
       const s = store.current;
       if (s.state === 'power' && e.code === 'Space') {
          s.state = 'moving';
          s.strokes += 1;
          s.shakeTime = 0.2; 
          
          if (ballRef.current) {
            const powerScaled = s.power * 0.3; // max power 100 -> 30 impulse
            const impulse = {
              x: -Math.sin(s.aimAngle) * powerScaled,
              y: 0.1 * powerScaled, 
              z: -Math.cos(s.aimAngle) * powerScaled
            };
            ballRef.current.applyImpulse(impulse, true);
          }
       }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
       window.removeEventListener('keydown', handleKeyDown);
       window.removeEventListener('keyup', handleKeyUp);
    };
  }, [store]);

  useFrame((state, delta) => {
    const s = store.current;
    s.time += delta;

    if (s.resetFlag && ballRef.current) {
      ballRef.current.setTranslation({ x: 0, y: 1, z: 5 }, true);
      ballRef.current.setLinvel({x:0, y:0, z:0}, true);
      ballRef.current.setAngvel({x:0, y:0, z:0}, true);
      s.resetFlag = false;
    }

    if (s.state === 'power') {
      if (s.powerIncreasing) {
        s.power += delta * 150; 
        if (s.power >= 100) {
          s.power = 100;
          s.powerIncreasing = false;
        }
      } else {
        s.power -= delta * 150;
        if (s.power <= 0) {
          s.power = 0;
          s.powerIncreasing = true;
        }
      }
    }

    if (s.state === 'moving' && ballRef.current) {
      const vel = ballRef.current.linvel();
      const speed = Math.sqrt(vel.x*vel.x + vel.y*vel.y + vel.z*vel.z);
      
      ballRef.current.applyImpulse({ x: s.wind.x * delta, y: 0, z: s.wind.z * delta }, true);

      if (speed < 0.2 && ballRef.current.translation().y <= 1.0) {
        s.state = 'aiming';
        ballRef.current.setLinvel({x:0, y:0, z:0}, true);
        ballRef.current.setAngvel({x:0, y:0, z:0}, true);
      }
      
      if (ballRef.current.translation().y < -10) {
        // Fall out of bounds
        ballRef.current.setTranslation({ x: 0, y: 1, z: 5 }, true);
        ballRef.current.setLinvel({x:0, y:0, z:0}, true);
        ballRef.current.setAngvel({x:0, y:0, z:0}, true);
        s.state = 'aiming';
      }
    }

    // Camera
    if (ballRef.current) {
      const t = ballRef.current.translation();
      s.ballPosition.set(t.x, t.y, t.z);
      
      let camDist = 8;
      let camHeight = 4;
      let idealX, idealZ;

      if (s.state === 'hole_in') {
        // Orbit around hole
        idealX = s.holePos.x + Math.sin(s.time) * 5;
        idealZ = s.holePos.z + Math.cos(s.time) * 5;
        state.camera.position.lerp(new THREE.Vector3(idealX, 5, idealZ), 0.05);
        state.camera.lookAt(s.holePos.x, 0, s.holePos.z);
      } else {
        idealX = t.x + Math.sin(s.aimAngle) * camDist;
        idealZ = t.z + Math.cos(s.aimAngle) * camDist;
        
        let targetCamPos = new THREE.Vector3(idealX, t.y + camHeight, idealZ);
        
        // Shake
        if (s.shakeTime > 0) {
          s.shakeTime -= delta;
          const shakeAmt = s.shakeTime * 0.5;
          targetCamPos.x += (Math.random() - 0.5) * shakeAmt;
          targetCamPos.y += (Math.random() - 0.5) * shakeAmt;
          targetCamPos.z += (Math.random() - 0.5) * shakeAmt;
        }

        state.camera.position.lerp(targetCamPos, 0.1);
        state.camera.lookAt(t.x, t.y, t.z);
      }
    }
  });

  return (
    <>
      <RigidBody 
        ref={ballRef} 
        name="ball" 
        colliders="ball" 
        mass={1} 
        restitution={0.5} 
        friction={0.8} 
        position={[0, 1, 5]}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <Trail width={0.3} length={8} color="#ffff00" decay={1}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="white" roughness={0.2} />
          </mesh>
        </Trail>
      </RigidBody>

      <AimIndicator />
      <Hole />
      <Terrain />
      <WindParticles />
    </>
  );
};

export default function FaskaGolfSwarm({ onExit }) {
  const store = useRef({
    state: 'aiming',
    aimAngle: 0,
    power: 0,
    powerIncreasing: true,
    strokes: 0,
    wind: new THREE.Vector3((Math.random() * 2 - 1), 0, (Math.random() * 2 - 1)),
    holePos: new THREE.Vector3(0, 0, -15),
    ballPosition: new THREE.Vector3(0, 1, 5),
    time: 0,
    shakeTime: 0,
    resetFlag: false
  });

  return (
    <GameContext.Provider value={{ store }}>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#87CEEB', position: 'relative' }}>
        <ButtonOverlay onExit={onExit} />
        <UI />
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <color attach="background" args={['#87CEEB']} />
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <directionalLight 
              castShadow 
              position={[10, 20, 10]} 
              intensity={1.5} 
              shadow-mapSize-width={2048} 
              shadow-mapSize-height={2048} 
          />
          
          <Physics>
            <Scene />
          </Physics>
        </Canvas>
      </div>
    </GameContext.Provider>
  );
}
