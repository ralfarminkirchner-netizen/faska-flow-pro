import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const UI_STYLES = {
  container: {
    width: '100vw', height: '100vh', background: '#111',
    position: 'absolute', top: 0, left: 0, zIndex: 9999,
    fontFamily: 'Impact, sans-serif'
  },
  hud: {
    position: 'absolute', top: 20, left: 0, width: '100%',
    display: 'flex', justifyContent: 'space-between', padding: '0 50px',
    boxSizing: 'border-box', zIndex: 10
  },
  healthBarContainer: {
    width: '40%', height: '40px', background: 'rgba(50,0,0,0.8)',
    border: '4px solid #fff', borderRadius: '4px', overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
  },
  healthFill: (hp) => ({
    width: `${Math.max(0, hp)}%`, height: '100%', background: hp > 30 ? '#ffd700' : '#ff0000',
    transition: 'width 0.1s linear'
  }),
  nameBox: {
    color: 'white', fontSize: '28px', textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
    marginTop: '5px', textTransform: 'uppercase'
  },
  timer: {
    color: '#fff', fontSize: '48px', textShadow: '2px 2px 0 #000'
  },
  controls: {
    position: 'absolute', bottom: 20, left: 20, color: 'white',
    fontFamily: 'monospace', fontSize: '14px', zIndex: 10,
    background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px'
  },
  exitBtn: {
    position: 'absolute', bottom: 20, right: 20, padding: '10px 20px',
    background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', zIndex: 10
  },
  winner: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    color: '#ffd700', fontSize: '80px', textShadow: '4px 4px 0 #000', zIndex: 20, textAlign: 'center'
  }
};

function Fighter({ isPlayer, startPos, color, myRef, opponentRef, onDamage, gameOver }) {
  const groupRef = useRef();
  const [attacking, setAttacking] = useState(false);
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    if (!isPlayer || gameOver) return;
    const handleKeyDown = (e) => {
      if (e.code === 'KeyW') setMovement(m => ({ ...m, forward: true }));
      if (e.code === 'KeyS') setMovement(m => ({ ...m, backward: true }));
      if (e.code === 'KeyA') setMovement(m => ({ ...m, left: true }));
      if (e.code === 'KeyD') setMovement(m => ({ ...m, right: true }));
      if (e.code === 'KeyJ' || e.code === 'Space') doAttack();
    };
    const handleKeyUp = (e) => {
      if (e.code === 'KeyW') setMovement(m => ({ ...m, forward: false }));
      if (e.code === 'KeyS') setMovement(m => ({ ...m, backward: false }));
      if (e.code === 'KeyA') setMovement(m => ({ ...m, left: false }));
      if (e.code === 'KeyD') setMovement(m => ({ ...m, right: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlayer, gameOver]);

  const doAttack = () => {
    if (attacking || gameOver) return;
    setAttacking(true);
    
    if (opponentRef.current && myRef.current) {
      const myPos = myRef.current.translation();
      const oppPos = opponentRef.current.translation();
      const dist = Math.sqrt(Math.pow(myPos.x - oppPos.x, 2) + Math.pow(myPos.z - oppPos.z, 2));
      
      if (dist < 2.5) {
        opponentRef.current.applyImpulse({ 
          x: (oppPos.x - myPos.x) * 4, 
          y: 2, 
          z: (oppPos.z - myPos.z) * 4 
        }, true);
        onDamage(10);
      }
    }

    setTimeout(() => setAttacking(false), 300);
  };

  useFrame(() => {
    if (!myRef.current || gameOver) return;
    
    const pos = myRef.current.translation();
    const vel = myRef.current.linvel();
    
    let moveX = 0;
    let moveZ = 0;

    if (isPlayer) {
      if (movement.forward) moveZ -= 1;
      if (movement.backward) moveZ += 1;
      if (movement.left) moveX -= 1;
      if (movement.right) moveX += 1;
    } else {
      if (opponentRef.current) {
        const oppPos = opponentRef.current.translation();
        const dx = oppPos.x - pos.x;
        const dz = oppPos.z - pos.z;
        const dist = Math.sqrt(dx*dx + dz*dz);
        
        if (dist > 2.0) {
          moveX = dx / dist;
          moveZ = dz / dist;
        } else {
          if (Math.random() < 0.03 && !attacking) {
            doAttack();
          }
        }
      }
    }

    const speed = isPlayer ? 6 : 4.5;
    if (Math.abs(vel.y) < 0.1) {
      myRef.current.setLinvel({ x: moveX * speed, y: vel.y, z: moveZ * speed }, true);
    }

    if (opponentRef.current && groupRef.current) {
      const oppPos = opponentRef.current.translation();
      const angle = Math.atan2(oppPos.x - pos.x, oppPos.z - pos.z);
      groupRef.current.rotation.y = angle;
    }
  });

  return (
    <RigidBody ref={myRef} position={startPos} lockRotations colliders="cuboid" mass={1} friction={0}>
      <group ref={groupRef}>
        <mesh castShadow position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh castShadow position={[0, 2.3, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#f0c297" />
        </mesh>
        {attacking && (
          <mesh position={[0, 1.2, 0.8]} castShadow>
            <boxGeometry args={[0.4, 0.4, 1.2]} />
            <meshStandardMaterial color="#ff3333" />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
}

export default function FaskaTekken({ onExit }) {
  const [p1Hp, setP1Hp] = useState(100);
  const [p2Hp, setP2Hp] = useState(100);
  const [timer, setTimer] = useState(60);
  
  const p1Ref = useRef();
  const p2Ref = useRef();

  const gameOver = p1Hp <= 0 || p2Hp <= 0 || timer <= 0;

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimer(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  return (
    <div style={UI_STYLES.container}>
      <div style={UI_STYLES.hud}>
        <div style={{ width: '40%' }}>
          <div style={UI_STYLES.healthBarContainer}>
            <div style={UI_STYLES.healthFill(p1Hp)}></div>
          </div>
          <div style={UI_STYLES.nameBox}>PLAYER 1</div>
        </div>
        <div style={UI_STYLES.timer}>{timer}</div>
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ ...UI_STYLES.healthBarContainer, transform: 'scaleX(-1)' }}>
            <div style={UI_STYLES.healthFill(p2Hp)}></div>
          </div>
          <div style={UI_STYLES.nameBox}>CPU</div>
        </div>
      </div>

      {gameOver && (
        <div style={UI_STYLES.winner}>
          {p1Hp <= 0 ? 'CPU WINS' : (p2Hp <= 0 ? 'PLAYER 1 WINS' : 'TIME UP')}
        </div>
      )}

      <div style={UI_STYLES.controls}>
        WASD: Move | J / SPACE: Attack
      </div>
      <button style={UI_STYLES.exitBtn} onClick={onExit}>EXIT MATCH</button>

      <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }}>
        <color attach="background" args={['#202030']} />
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
        
        <Physics>
          <Fighter 
            isPlayer={true} startPos={[-3, 2, 0]} color="#2196f3" 
            myRef={p1Ref} opponentRef={p2Ref} 
            onDamage={(amount) => setP2Hp(prev => Math.max(0, prev - amount))} 
            gameOver={gameOver} 
          />
          <Fighter 
            isPlayer={false} startPos={[3, 2, 0]} color="#f44336" 
            myRef={p2Ref} opponentRef={p1Ref} 
            onDamage={(amount) => setP1Hp(prev => Math.max(0, prev - amount))} 
            gameOver={gameOver} 
          />

          {/* Arena Floor */}
          <RigidBody type="fixed">
            <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#444" roughness={0.8} />
            </mesh>
            <mesh position={[0, 2, -10]} receiveShadow>
               <boxGeometry args={[20, 4, 1]} />
               <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0, 2, 10]} receiveShadow>
               <boxGeometry args={[20, 4, 1]} />
               <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[-10, 2, 0]} receiveShadow>
               <boxGeometry args={[1, 4, 20]} />
               <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[10, 2, 0]} receiveShadow>
               <boxGeometry args={[1, 4, 20]} />
               <meshStandardMaterial color="#222" />
            </mesh>
          </RigidBody>
        </Physics>
        
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
