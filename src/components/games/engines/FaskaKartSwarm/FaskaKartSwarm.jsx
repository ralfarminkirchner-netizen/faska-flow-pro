import React, { useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PerspectiveCamera } from '@react-three/drei';
import { useGameStore } from './GameLogic';
import { Track, ItemBox, BananaPeel, Projectile, Particles } from './World';
import { PlayerKart } from './PlayerKart';
import { AIKart } from './AIKart';
import { MobileJoystick } from './MobileJoystick';
import { UIOverlay } from './UIOverlay';
import { TRACK_RADIUS } from './World';


const KART_COLORS = ['#e11d48', '#2563eb', '#16a34a', '#d97706'];
const KART_NAMES = ['Rosi', 'Bruno', 'Kira', 'PLAYER'];

const Scene = ({ isLearncade }) => {
  const itemBoxes = useGameStore(s => s.itemBoxes);
  const bananas = useGameStore(s => s.bananas);
  const projectiles = useGameStore(s => s.projectiles);
  const particles = useGameStore(s => s.particles);
  const setProjectiles = useGameStore(s => s.setProjectiles);
  const setParticles = useGameStore(s => s.setParticles);

  // Initialize item boxes on first render
  const setItemBoxes = useGameStore(s => s.setItemBoxes);
  useEffect(() => {
    // Check GameLogic.js: ITEM_BOX_POSITIONS is not there, we import it from World.jsx? Wait! 
    // I put ITEM_BOX_POSITIONS in World.jsx! I'll fix this above.
  }, []);

  const removeProjectile = useCallback((id) => {
    setProjectiles(prev => {
      const proj = prev.find(p => p.id === id);
      if (proj) {
        const burst = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          pos: [proj.x, 0.5 + Math.random(), proj.z],
          scale: Math.random() * 0.5 + 0.3,
          color: ['#ff6600', '#facc15', '#ef4444'][Math.floor(Math.random() * 3)]
        }));
        setParticles(old => [...old, ...burst]);
        setTimeout(() => setParticles(old => old.filter(p => !burst.find(b => b.id === p.id))), 600);
      }
      return prev.filter(p => p.id !== id);
    });
  }, [setProjectiles, setParticles]);

  return (
    <>
      <Track />
      {itemBoxes.map((box, i) => (
        <ItemBox key={i} index={i} pos={box.pos} active={box.active} />
      ))}
      {bananas.map(b => <BananaPeel key={b.id} banana={b} />)}
      {projectiles.map(p => (
        <Projectile key={p.id} proj={p} onHit={removeProjectile} />
      ))}
      <Particles particles={particles} />
      
      {[0, 1, 2].map(i => (
        <AIKart
          key={i}
          index={i}
          color={KART_COLORS[i]}
          name={KART_NAMES[i]}
        />
      ))}
      
      <PlayerKart isLearncade={isLearncade} />
    </>
  );
};

const FaskaKartSwarm = ({ onExit, isLearncade = true }) => {
  const phase = useGameStore(s => s.phase);
  const updateGame = useGameStore(s => s.updateGame);
  const reset = useGameStore(s => s.reset);
  const setItemBoxes = useGameStore(s => s.setItemBoxes);

  // Initialization
  useEffect(() => {
    reset();
    
    // We need to fetch ITEM_BOX_POSITIONS from World.jsx dynamically or just import it.
    // Wait, let's just initialize them.
    import('./World').then(({ ITEM_BOX_POSITIONS }) => {
      setItemBoxes(ITEM_BOX_POSITIONS.map(ib => ({ ...ib, active: true })));
    });

    let count = 3;
    const tick = () => {
      count -= 1;
      if (count === 0) {
        updateGame({ phase: 'racing' });
      } else {
        setTimeout(tick, 1000);
      }
    };
    const t = setTimeout(tick, 1000);
    return () => clearTimeout(t);
  }, [reset, setItemBoxes, updateGame]);

  // Race Timer
  useEffect(() => {
    if (phase !== 'racing') return;
    const id = setInterval(() => {
      useGameStore.setState(prev => ({ raceTime: prev.raceTime + 1 }));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: '#87ceeb' }}>
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[TRACK_RADIUS, 8, -14]} fov={65} />
        <Sky sunPosition={[100, 30, 50]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[60, 120, 60]}
          castShadow
          intensity={1.2}
          shadow-mapSize={[2048, 2048]}
        >
          <orthographicCamera attach="shadow-camera" args={[-200, 200, 200, -200]} />
        </directionalLight>

        <Scene isLearncade={isLearncade} />
      </Canvas>

      <UIOverlay onExit={onExit} />
      <MobileJoystick />

      {phase === 'racing' && (
        <div style={{
          position: 'absolute', bottom: 180, right: 20,
          color: 'white', fontFamily: 'sans-serif', fontSize: '14px',
          textShadow: '1px 1px 0 #000', textAlign: 'right',
          pointerEvents: 'none', zIndex: 10, lineHeight: '1.8'
        }}>
          <span style={{ color: '#facc15' }}>W/↑</span> Gas &nbsp;
          <span style={{ color: '#facc15' }}>S/↓</span> Bremse<br />
          <span style={{ color: '#facc15' }}>A/D</span> Lenken &nbsp;
          <span style={{ color: '#facc15' }}>Shift/Leertaste</span> Drift<br />
          <span style={{ color: '#facc15' }}>E/F</span> Item benutzen
        </div>
      )}
    </div>
  );
};

export default FaskaKartSwarm;
