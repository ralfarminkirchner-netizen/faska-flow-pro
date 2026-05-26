import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Sky } from '@react-three/drei';
import * as THREE from 'three';

const GRAVITY = -30;
const JUMP_VELOCITY = 12;
const HOVER_GRAVITY = -5;
const MAX_HOVER_TIME = 1.0;
const MOVE_SPEED = 8;
const PLAYER_RADIUS = 0.4;
const MAX_PARTICLES = 50;

const getInitialState = () => ({
  player: {
    position: new THREE.Vector3(0, 3, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotationY: 0,
    isGrounded: false,
    hoverTime: MAX_HOVER_TIME,
  },
  keys: {},
  elements: { H: 0, O: 0, C: 0 },
  status: 'playing',
  enemies: [
    { id: 1, position: new THREE.Vector3(0, 1.5, -15), startX: 0, range: 4, dir: 1, alive: true },
    { id: 2, position: new THREE.Vector3(10, 5.5, -15), startX: 10, range: 3, dir: 1, alive: true },
    { id: 3, position: new THREE.Vector3(10, 7.5, -30), startX: 10, range: 4, dir: 1, alive: true }
  ],
  coins: [
    { id: 1, position: new THREE.Vector3(0, 1.5, -8), type: 'H', collected: false },
    { id: 2, position: new THREE.Vector3(-3, 3, -15), type: 'O', collected: false },
    { id: 3, position: new THREE.Vector3(5, 5.5, -15), type: 'C', collected: false },
    { id: 4, position: new THREE.Vector3(10, 8, -23), type: 'H', collected: false },
    { id: 5, position: new THREE.Vector3(14, 9, -30), type: 'C', collected: false },
  ],
  platforms: [
    { position: new THREE.Vector3(0, 0, 0), size: new THREE.Vector3(10, 1, 10) },
    { position: new THREE.Vector3(0, 0, -8), size: new THREE.Vector3(2, 1, 6) },
    { position: new THREE.Vector3(0, 1, -15), size: new THREE.Vector3(10, 1, 10) },
    { position: new THREE.Vector3(5, 3, -15), size: new THREE.Vector3(3, 1, 3) },
    { position: new THREE.Vector3(10, 5, -15), size: new THREE.Vector3(8, 1, 8) },
    { position: new THREE.Vector3(10, 6, -23), size: new THREE.Vector3(2, 1, 6) },
    { position: new THREE.Vector3(10, 7, -30), size: new THREE.Vector3(12, 1, 12) },
  ],
  exit: { position: new THREE.Vector3(10, 8, -34) },
  particles: Array.from({length: MAX_PARTICLES}).map(() => ({ active: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0 })),
  hoverParticles: Array.from({length: 20}).map(() => ({ active: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0 }))
});

const PlayerMesh = React.forwardRef((props, ref) => {
  return (
    <group ref={ref} {...props}>
      <Box args={[0.8, 0.8, 0.8]} position={[0, -0.1, 0]} castShadow>
        <meshStandardMaterial color="white" />
      </Box>
      <Sphere args={[0.4]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#00ffff" />
      </Sphere>
      {/* Eyes */}
      <Box args={[0.1, 0.05, 0.1]} position={[-0.15, 0.5, 0.35]}>
         <meshBasicMaterial color="black" />
      </Box>
      <Box args={[0.1, 0.05, 0.1]} position={[0.15, 0.5, 0.35]}>
         <meshBasicMaterial color="black" />
      </Box>
    </group>
  );
});

const EnemyMesh = React.forwardRef((props, ref) => {
  return (
    <group ref={ref} {...props}>
      <Cylinder args={[0.5, 0.5, 1, 8]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#ff4444" />
      </Cylinder>
      <Cylinder args={[0, 0.2, 0.5, 4]} position={[0, 1.25, 0]} castShadow>
        <meshStandardMaterial color="#880000" />
      </Cylinder>
    </group>
  );
});

const ElementMesh = React.forwardRef(({ type, ...props }, ref) => {
  const color = type === 'H' ? '#44aaff' : type === 'O' ? '#ff4444' : '#aaaaaa';
  return (
    <group ref={ref} {...props}>
      <Sphere args={[0.4, 16, 16]} castShadow>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </Sphere>
      <Text position={[0, 0, 0.41]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
        {type}
      </Text>
    </group>
  );
});

const GameScene = ({ stateRef }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  
  const playerRef = useRef();
  const enemiesRef = useRef([]);
  const coinsRef = useRef([]);
  const particlesRef = useRef([]);
  const hoverParticlesRef = useRef([]);
  const exitMatRef = useRef();

  useEffect(() => {
    const handleDown = (e) => {
       stateRef.current.keys[e.code] = true;
    };
    const handleUp = (e) => {
       stateRef.current.keys[e.code] = false;
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [stateRef]);

  useFrame((state, delta) => {
    const game = stateRef.current;
    const dt = Math.min(delta, 0.1);
    
    if (controlsRef.current) {
      controlsRef.current.target.lerp(game.player.position, 1.0 - Math.pow(0.001, dt));
      controlsRef.current.update();
    }

    if (game.status !== 'playing') return;

    const keys = game.keys;
    const moveDir = new THREE.Vector3(0, 0, 0);
    const camForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    camForward.y = 0;
    if (camForward.lengthSq() < 0.001) camForward.set(0, 0, -1);
    camForward.normalize();

    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    camRight.y = 0;
    if (camRight.lengthSq() < 0.001) camRight.set(1, 0, 0);
    camRight.normalize();

    if (keys['KeyW'] || keys['ArrowUp']) moveDir.add(camForward);
    if (keys['KeyS'] || keys['ArrowDown']) moveDir.sub(camForward);
    if (keys['KeyA'] || keys['ArrowLeft']) moveDir.sub(camRight);
    if (keys['KeyD'] || keys['ArrowRight']) moveDir.add(camRight);

    if (moveDir.lengthSq() > 0) moveDir.normalize();

    game.player.velocity.x = moveDir.x * MOVE_SPEED;
    game.player.velocity.z = moveDir.z * MOVE_SPEED;

    if (moveDir.lengthSq() > 0.001) {
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetRotation - game.player.rotationY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      game.player.rotationY += diff * 10 * dt;
    }

    if (keys['Space']) {
      if (game.player.isGrounded) {
        game.player.velocity.y = JUMP_VELOCITY;
        game.player.isGrounded = false;
      } else if (game.player.velocity.y < 0 && game.player.hoverTime > 0) {
        game.player.velocity.y += (HOVER_GRAVITY - GRAVITY) * dt;
        game.player.hoverTime -= dt;

        const hp = game.hoverParticles.find(p => !p.active);
        if (hp) {
          hp.active = true;
          hp.pos.copy(game.player.position);
          hp.pos.y -= 0.3;
          hp.pos.x += (Math.random()-0.5)*0.5;
          hp.pos.z += (Math.random()-0.5)*0.5;
          hp.vel.set((Math.random()-0.5)*1, -Math.random()*4, (Math.random()-0.5)*1);
          hp.life = 0.3 + Math.random()*0.3;
        }
      } else {
        game.player.velocity.y += GRAVITY * dt;
      }
    } else {
      if (!game.player.isGrounded) {
        game.player.velocity.y += GRAVITY * dt;
      }
    }

    const p = game.player.position;
    const v = game.player.velocity;
    p.addScaledVector(v, dt);

    game.player.isGrounded = false;
    let standingOnPlatform = false;

    for (let plat of game.platforms) {
      const minX = plat.position.x - plat.size.x / 2;
      const maxX = plat.position.x + plat.size.x / 2;
      const minZ = plat.position.z - plat.size.z / 2;
      const maxZ = plat.position.z + plat.size.z / 2;
      const platY = plat.position.y + plat.size.y / 2;

      if (p.x >= minX - PLAYER_RADIUS && p.x <= maxX + PLAYER_RADIUS &&
          p.z >= minZ - PLAYER_RADIUS && p.z <= maxZ + PLAYER_RADIUS) {
          
          if (p.y - PLAYER_RADIUS <= platY + 0.2 && p.y - PLAYER_RADIUS >= platY - 0.5 && v.y <= 0) {
            p.y = platY + PLAYER_RADIUS;
            v.y = 0;
            game.player.isGrounded = true;
            game.player.hoverTime = MAX_HOVER_TIME;
            standingOnPlatform = true;
          }
      }
    }

    if (!standingOnPlatform && v.y !== 0) {
      game.player.isGrounded = false;
    }

    if (p.y < -10) {
      game.status = 'dead';
    }

    game.enemies.forEach(e => {
      if (!e.alive) return;
      e.position.x += e.dir * 2 * dt;
      if (Math.abs(e.position.x - e.startX) > e.range) {
        e.dir *= -1;
      }
      
      const dist = e.position.distanceTo(p);
      if (dist < 1.0) {
        if (v.y < -1 && p.y > e.position.y + 0.5) {
          e.alive = false;
          v.y = JUMP_VELOCITY * 0.8;
          for(let i=0; i<15; i++) {
            const pt = game.particles.find(px => !px.active);
            if (pt) {
              pt.active = true;
              pt.pos.copy(e.position);
              pt.vel.set((Math.random()-0.5)*10, Math.random()*10, (Math.random()-0.5)*10);
              pt.life = 0.5 + Math.random()*0.5;
            }
          }
        } else {
          game.status = 'dead';
        }
      }
    });

    game.coins.forEach(c => {
      if (c.collected) return;
      const dist = c.position.distanceTo(p);
      if (dist < 1.5) {
        c.collected = true;
        game.elements[c.type]++;
        for(let i=0; i<5; i++) {
            const pt = game.particles.find(px => !px.active);
            if (pt) {
              pt.active = true;
              pt.pos.copy(c.position);
              pt.vel.set((Math.random()-0.5)*5, Math.random()*5, (Math.random()-0.5)*5);
              pt.life = 0.5;
            }
        }
      }
    });

    const exitDist = game.exit.position.distanceTo(p);
    if (exitDist < 3.0) {
      if (game.elements.H >= 2 && game.elements.O >= 1) {
        game.status = 'won';
      }
    }

    game.particles.forEach(pt => {
      if (!pt.active) return;
      pt.pos.addScaledVector(pt.vel, dt);
      pt.vel.y += GRAVITY * dt;
      pt.life -= dt;
      if (pt.life <= 0) pt.active = false;
    });

    game.hoverParticles.forEach(hp => {
      if (!hp.active) return;
      hp.pos.addScaledVector(hp.vel, dt);
      hp.life -= dt;
      if (hp.life <= 0) hp.active = false;
    });

    if (playerRef.current) {
      playerRef.current.position.copy(p);
      playerRef.current.rotation.y = game.player.rotationY;
    }
    
    game.enemies.forEach((e, i) => {
      if (enemiesRef.current[i]) {
        enemiesRef.current[i].position.copy(e.position);
        enemiesRef.current[i].visible = e.alive;
      }
    });

    game.coins.forEach((c, i) => {
      if (coinsRef.current[i]) {
        coinsRef.current[i].position.copy(c.position);
        coinsRef.current[i].visible = !c.collected;
        coinsRef.current[i].rotation.y += delta;
      }
    });

    game.particles.forEach((pt, i) => {
      if (particlesRef.current[i]) {
        particlesRef.current[i].position.copy(pt.pos);
        particlesRef.current[i].scale.setScalar(Math.max(0.01, pt.life));
        particlesRef.current[i].visible = pt.active;
      }
    });

    game.hoverParticles.forEach((hp, i) => {
      if (hoverParticlesRef.current[i]) {
        hoverParticlesRef.current[i].position.copy(hp.pos);
        hoverParticlesRef.current[i].scale.setScalar(Math.max(0.01, hp.life * 2));
        hoverParticlesRef.current[i].visible = hp.active;
      }
    });

    if (exitMatRef.current) {
      if (game.elements.H >= 2 && game.elements.O >= 1) {
        exitMatRef.current.color.set('lightgreen');
        exitMatRef.current.opacity = 0.8;
      }
    }
  });

  const game = stateRef.current;

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />

      <OrbitControls 
        ref={controlsRef} 
        makeDefault 
        enablePan={false} 
        minDistance={4} 
        maxDistance={12} 
        maxPolarAngle={Math.PI / 2 - 0.1}
      />

      <PlayerMesh ref={playerRef} />

      {game.platforms.map((p, i) => (
        <Box key={`plat-${i}`} position={p.position} args={p.size.toArray()} receiveShadow>
          <meshStandardMaterial color="#445566" />
        </Box>
      ))}

      {game.enemies.map((e, i) => (
        <EnemyMesh key={`enemy-${i}`} ref={(el) => enemiesRef.current[i] = el} position={e.position} />
      ))}

      {game.coins.map((c, i) => (
        <ElementMesh key={`coin-${i}`} type={c.type} ref={(el) => coinsRef.current[i] = el} position={c.position} />
      ))}

      <group position={game.exit.position}>
        <Box args={[4, 4, 0.5]} position={[0, 2, 0]}>
          <meshStandardMaterial ref={exitMatRef} color="gray" transparent opacity={0.5} />
        </Box>
        <Box args={[4.4, 4.4, 0.6]} position={[0, 2, 0]}>
          <meshStandardMaterial color="darkgray" wireframe />
        </Box>
        <Text position={[0, 4.5, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="bottom">
          H2O EXHAUST
        </Text>
      </group>

      {game.particles.map((_, i) => (
        <Box key={`part-${i}`} ref={(el) => particlesRef.current[i] = el} args={[0.2, 0.2, 0.2]} visible={false}>
          <meshStandardMaterial color="yellow" />
        </Box>
      ))}

      {game.hoverParticles.map((_, i) => (
        <Box key={`hov-${i}`} ref={(el) => hoverParticlesRef.current[i] = el} args={[0.1, 0.1, 0.1]} visible={false}>
          <meshStandardMaterial color="cyan" transparent opacity={0.6} />
        </Box>
      ))}
    </>
  );
};

export default function FaskaAstroSwarm({ onExit }) {
  const stateRef = useRef(getInitialState());
  const [hud, setHud] = useState({ H: 0, O: 0, C: 0, status: 'playing' });

  useEffect(() => {
    const interval = setInterval(() => {
      if (stateRef.current) {
        setHud({
          H: stateRef.current.elements.H,
          O: stateRef.current.elements.O,
          C: stateRef.current.elements.C,
          status: stateRef.current.status
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = () => {
    stateRef.current = getInitialState();
    setHud({ H: 0, O: 0, C: 0, status: 'playing' });
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <button 
         style={{ 
           position: 'absolute', top: 20, right: 20, zIndex: 100, 
           padding: '10px 20px', fontSize: '16px', background: '#e74c3c', 
           color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
         }}
         onClick={onExit}>
         Beenden
      </button>

      <div style={{ 
        position: 'absolute', top: 20, left: 20, zIndex: 100, 
        color: 'white', background: 'rgba(0,0,0,0.6)', 
        padding: '15px', borderRadius: '8px', fontFamily: 'sans-serif',
        pointerEvents: 'none'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>FaskaAstroSwarm</h2>
        <p style={{ margin: '0 0 5px 0' }}>Ziel: Sammle 2x H und 1x O für H2O, dann ab zum Exit!</p>
        <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#ccc' }}>Steuerung: WASD/Pfeile zum Bewegen, Leertaste für Sprung. Leertaste halten für Hover!</p>
        <p style={{ margin: '0', fontWeight: 'bold' }}>Elemente: H: {hud.H}/2 | O: {hud.O}/1 | C: {hud.C}</p>
        
        {hud.status === 'dead' && (
          <div style={{ marginTop: '15px', pointerEvents: 'auto' }}>
            <h3 style={{ color: '#ff6b6b', margin: '0 0 10px 0' }}>Game Over!</h3>
            <button onClick={handleRestart} style={{ padding: '8px 16px', cursor: 'pointer' }}>Neustart</button>
          </div>
        )}
        
        {hud.status === 'won' && (
          <div style={{ marginTop: '15px', pointerEvents: 'auto' }}>
            <h3 style={{ color: '#51cf66', margin: '0 0 10px 0' }}>Gewonnen! Wasser gebildet!</h3>
            <button onClick={handleRestart} style={{ padding: '8px 16px', cursor: 'pointer' }}>Nochmal spielen</button>
          </div>
        )}
      </div>

      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <GameScene stateRef={stateRef} />
      </Canvas>
    </div>
  );
}
