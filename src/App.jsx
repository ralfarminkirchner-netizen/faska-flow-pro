import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-load all game engines for code splitting
const GameEngineHub = lazy(() => import('./components/hub/GameEngineHub'));
const FaskaSixtyFourSwarm = lazy(() => import('./components/games/engines/FaskaSixtyFourSwarm/FaskaSixtyFourSwarm'));
const FaskaSnakeSwarm = lazy(() => import('./components/games/engines/FaskaSnakeSwarm/FaskaSnakeSwarm'));
const FaskaMoorhuhnSwarm = lazy(() => import('./components/games/engines/FaskaMoorhuhnSwarm/FaskaMoorhuhnSwarm'));
const FaskaBlocksSwarm = lazy(() => import('./components/games/engines/FaskaBlocksSwarm/FaskaBlocksSwarm'));
const FaskaSpaceInvadersSwarm = lazy(() => import('./components/games/engines/FaskaSpaceInvadersSwarm/FaskaSpaceInvadersSwarm'));
const FaskaMicroMachinesSwarm = lazy(() => import('./components/games/engines/FaskaMicroMachinesSwarm/FaskaMicroMachinesSwarm'));
const FaskaSpaceOdysseySwarm = lazy(() => import('./components/games/engines/FaskaSpaceOdysseySwarm/FaskaSpaceOdysseySwarm'));
const FaskaEpicRPGSwarm = lazy(() => import('./components/games/engines/FaskaEpicRPGSwarm/FaskaEpicRPGSwarm'));
const FaskaDoomSwarm = lazy(() => import('./components/games/engines/FaskaDoomSwarm/FaskaDoomSwarm'));
const FaskaZeldaSwarm = lazy(() => import('./components/games/engines/FaskaZeldaSwarm/FaskaZeldaSwarm'));
const FaskaKartSwarm = lazy(() => import('./components/games/engines/FaskaKartSwarm/FaskaKartSwarm'));

function LoadingFallback() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a1a', flexDirection: 'column', gap: 24,
    }}>
      <div style={{
        width: 64, height: 64,
        border: '3px solid #2a2a5a',
        borderTopColor: '#7c3aed',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{
        color: '#94a3b8', fontFamily: 'Outfit, sans-serif',
        fontSize: 18, letterSpacing: 3, textTransform: 'uppercase',
      }}>
        FASKA FLOW
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<GameEngineHub />} />
        <Route path="/game/faska64" element={<FaskaSixtyFourSwarm />} />
        <Route path="/game/snake" element={<FaskaSnakeSwarm />} />
        <Route path="/game/moorhuhn" element={<FaskaMoorhuhnSwarm />} />
        <Route path="/game/blocks" element={<FaskaBlocksSwarm />} />
        <Route path="/game/space-invaders" element={<FaskaSpaceInvadersSwarm />} />
        <Route path="/game/micro-machines" element={<FaskaMicroMachinesSwarm />} />
        <Route path="/game/space-odyssey" element={<FaskaSpaceOdysseySwarm />} />
        <Route path="/game/epic-rpg" element={<FaskaEpicRPGSwarm />} />
        <Route path="/game/doom" element={<FaskaDoomSwarm />} />
        <Route path="/game/zelda" element={<FaskaZeldaSwarm />} />
        <Route path="/game/kart" element={<FaskaKartSwarm />} />
      </Routes>
    </Suspense>
  );
}
