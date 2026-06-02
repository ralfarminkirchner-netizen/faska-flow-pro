import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-load all game engines for code splitting
const GameEngineHub = lazy(() => import('./components/hub/GameEngineHub'));
const FaskaLearncadeEssentials = lazy(() => import('./components/games/learncade/FaskaLearncadeEssentials'));
const FaskaSixtyFourSwarm = lazy(() => import('./components/games/engines/FaskaSixtyFourSwarm/FaskaSixtyFourSwarm'));
const FaskaSixtyFourGodot = lazy(() => import('./components/games/godot/FaskaSixtyFourGodot'));
const FaskaSnakeSwarm = lazy(() => import('./components/games/engines/FaskaSnakeSwarm/FaskaSnakeSwarm'));
const FaskaMoorhuhnSwarm = lazy(() => import('./components/games/engines/FaskaMoorhuhnSwarm/FaskaMoorhuhnSwarm'));
const FaskaBlocksSwarm = lazy(() => import('./components/games/engines/FaskaBlocksSwarm/FaskaBlocksSwarm'));
const FaskaSpaceInvadersSwarm = lazy(() => import('./components/games/engines/FaskaSpaceInvadersSwarm/FaskaSpaceInvadersSwarm'));
const FaskaInvadersGodot = lazy(() => import('./components/games/godot/FaskaInvadersGodot'));
const FaskaMicroMachinesSwarm = lazy(() => import('./components/games/engines/FaskaMicroMachinesSwarm/FaskaMicroMachinesSwarm'));
const FaskaSpaceOdysseySwarm = lazy(() => import('./components/games/engines/FaskaSpaceOdysseySwarm/FaskaSpaceOdysseySwarm'));
const FaskaEpicRPGSwarm = lazy(() => import('./components/games/engines/FaskaEpicRPGSwarm/FaskaEpicRPGSwarm'));
const FaskaDoomSwarm = lazy(() => import('./components/games/engines/FaskaDoomSwarm/FaskaDoomSwarm'));
const FaskaDoomGodot = lazy(() => import('./components/games/godot/FaskaDoomGodot'));
const FaskaZeldaSwarm = lazy(() => import('./components/games/engines/FaskaZeldaSwarm/FaskaZeldaSwarm'));
const FaskaZeldaGodot = lazy(() => import('./components/games/godot/FaskaZeldaGodot'));
const FaskaKartSwarm = lazy(() => import('./components/games/engines/FaskaKartSwarm/FaskaKartSwarm'));
const FaskaKartGodot = lazy(() => import('./components/games/godot/FaskaKartGodot'));
const FaskaTaxiRushSwarm = lazy(() => import('./components/games/engines/FaskaTaxiRushSwarm/FaskaTaxiRushSwarm'));
const FaskaTaxiRushGodot = lazy(() => import('./components/games/godot/FaskaTaxiRushGodot'));
const FaskaFighterSwarm = lazy(() => import('./components/games/engines/FaskaFighterSwarm/FaskaFighterSwarm'));
const FaskaFighterGodot = lazy(() => import('./components/games/godot/FaskaFighterGodot'));
const FaskaSoulsSwarm = lazy(() => import('./components/games/engines/FaskaSoulsSwarm/FaskaSoulsSwarm'));
const FaskaSoulsGodot = lazy(() => import('./components/games/godot/FaskaSoulsGodot'));
const FaskaDescentSwarm = lazy(() => import('./components/games/engines/FaskaDescentSwarm/FaskaDescentSwarm'));
const FaskaDescentGodot = lazy(() => import('./components/games/godot/FaskaDescentGodot'));
const FaskaParkourSwarm = lazy(() => import('./components/games/engines/FaskaParkourSwarm/FaskaParkourSwarm'));
const FaskaParkourGodot = lazy(() => import('./components/games/godot/FaskaParkourGodot'));
const FaskaMansionSwarm = lazy(() => import('./components/games/engines/FaskaMansionSwarm/FaskaMansionSwarm'));
const FaskaMansionGodot = lazy(() => import('./components/games/godot/FaskaMansionGodot'));
const FaskaRallySwarm = lazy(() => import('./components/games/engines/FaskaRallySwarm/FaskaRallySwarm'));
const FaskaRallyGodot = lazy(() => import('./components/games/godot/FaskaRallyGodot'));
const FaskaArsenalSwarm = lazy(() => import('./components/games/engines/FaskaArsenalSwarm/FaskaArsenalSwarm'));
const FaskaArsenalGodot = lazy(() => import('./components/games/godot/FaskaArsenalGodot'));
const FaskaGadgetQuestSwarm = lazy(() => import('./components/games/engines/FaskaGadgetQuestSwarm/FaskaGadgetQuestSwarm'));
const FaskaGadgetQuestGodot = lazy(() => import('./components/games/godot/FaskaGadgetQuestGodot'));
const FaskaTempleQuestSwarm = lazy(() => import('./components/games/engines/FaskaTempleQuestSwarm/FaskaTempleQuestSwarm'));
const FaskaTacticsSwarm = lazy(() => import('./components/games/engines/FaskaTacticsSwarm/FaskaTacticsSwarm'));
const FaskaPinballSwarm = lazy(() => import('./components/games/engines/FaskaPinballSwarm/FaskaPinballSwarm'));
const FaskaPinballGodot = lazy(() => import('./components/games/godot/FaskaPinballGodot'));
const FaskaNightHuntSwarm = lazy(() => import('./components/games/engines/FaskaNightHuntSwarm/FaskaNightHuntSwarm'));
const FaskaNightHuntGodot = lazy(() => import('./components/games/godot/FaskaNightHuntGodot'));
const FaskaSkyRailSwarm = lazy(() => import('./components/games/engines/FaskaSkyRailSwarm/FaskaSkyRailSwarm'));
const FaskaSkyRailGodot = lazy(() => import('./components/games/godot/FaskaSkyRailGodot'));
const FaskaTrickParkSwarm = lazy(() => import('./components/games/engines/FaskaTrickParkSwarm/FaskaTrickParkSwarm'));
const FaskaBombMazeSwarm = lazy(() => import('./components/games/engines/FaskaBombMazeSwarm/FaskaBombMazeSwarm'));
const FaskaBombMazeGodot = lazy(() => import('./components/games/godot/FaskaBombMazeGodot'));
const FaskaBrawlerSwarm = lazy(() => import('./components/games/engines/FaskaBrawlerSwarm/FaskaBrawlerSwarm'));
const FaskaBrawlerGodot = lazy(() => import('./components/games/godot/FaskaBrawlerGodot'));
const FaskaMathDefenderSwarm = lazy(() => import('./components/games/engines/FaskaMathDefenderSwarm/FaskaMathDefenderSwarm'));
const FaskaTypeHeroSwarm = lazy(() => import('./components/games/engines/FaskaTypeHeroSwarm/FaskaTypeHeroSwarm'));
const FaskaTypeHeroGodot = lazy(() => import('./components/games/godot/FaskaTypeHeroGodot'));
const FaskaGeoRunnerSwarm = lazy(() => import('./components/games/engines/FaskaGeoRunnerSwarm/FaskaGeoRunnerSwarm'));

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
        <Route path="/game/faska64" element={<FaskaLearncadeEssentials />} />
        <Route path="/game/faska64-godot" element={<FaskaSixtyFourGodot />} />
        <Route path="/game/faska64-react" element={<FaskaSixtyFourSwarm />} />
        <Route path="/game/snake" element={<FaskaSnakeSwarm />} />
        <Route path="/game/moorhuhn" element={<FaskaMoorhuhnSwarm />} />
        <Route path="/game/blocks" element={<FaskaBlocksSwarm />} />
        <Route path="/game/space-invaders" element={<FaskaInvadersGodot />} />
        <Route path="/game/space-invaders-react" element={<FaskaSpaceInvadersSwarm />} />
        <Route path="/game/micro-machines" element={<FaskaMicroMachinesSwarm />} />
        <Route path="/game/space-odyssey" element={<FaskaSpaceOdysseySwarm />} />
        <Route path="/game/epic-rpg" element={<FaskaEpicRPGSwarm />} />
        <Route path="/game/doom" element={<FaskaDoomGodot />} />
        <Route path="/game/doom-react" element={<FaskaDoomSwarm />} />
        <Route path="/game/zelda" element={<FaskaZeldaSwarm />} />
        <Route path="/game/zelda-react" element={<FaskaZeldaSwarm />} />
        <Route path="/game/zelda-godot" element={<FaskaZeldaGodot />} />
        <Route path="/game/kart" element={<FaskaKartGodot />} />
        <Route path="/game/kart-react" element={<FaskaKartSwarm />} />
        <Route path="/game/taxi-rush" element={<FaskaTaxiRushSwarm />} />
        <Route path="/game/taxi-rush-react" element={<FaskaTaxiRushSwarm />} />
        <Route path="/game/taxi-rush-godot" element={<FaskaTaxiRushGodot />} />
        <Route path="/game/fighter" element={<FaskaFighterGodot />} />
        <Route path="/game/fighter-react" element={<FaskaFighterSwarm />} />
        <Route path="/game/souls" element={<FaskaSoulsGodot />} />
        <Route path="/game/souls-react" element={<FaskaSoulsSwarm />} />
        <Route path="/game/descent" element={<FaskaDescentGodot />} />
        <Route path="/game/descent-react" element={<FaskaDescentSwarm />} />
        <Route path="/game/parkour" element={<FaskaParkourGodot />} />
        <Route path="/game/parkour-react" element={<FaskaParkourSwarm />} />
        <Route path="/game/mansion" element={<FaskaMansionGodot />} />
        <Route path="/game/mansion-react" element={<FaskaMansionSwarm />} />
        <Route path="/game/rally" element={<FaskaRallyGodot />} />
        <Route path="/game/rally-react" element={<FaskaRallySwarm />} />
        <Route path="/game/arsenal" element={<FaskaArsenalGodot />} />
        <Route path="/game/arsenal-react" element={<FaskaArsenalSwarm />} />
        <Route path="/game/gadget-quest" element={<FaskaGadgetQuestGodot />} />
        <Route path="/game/gadget-quest-react" element={<FaskaGadgetQuestSwarm />} />
        <Route path="/game/temple-quest" element={<FaskaTempleQuestSwarm />} />
        <Route path="/game/tactics" element={<FaskaTacticsSwarm />} />
        <Route path="/game/pinball" element={<FaskaPinballGodot />} />
        <Route path="/game/pinball-react" element={<FaskaPinballSwarm />} />
        <Route path="/game/night-hunt" element={<FaskaNightHuntGodot />} />
        <Route path="/game/night-hunt-react" element={<FaskaNightHuntSwarm />} />
        <Route path="/game/sky-rail" element={<FaskaSkyRailGodot />} />
        <Route path="/game/sky-rail-react" element={<FaskaSkyRailSwarm />} />
        <Route path="/game/trick-park" element={<FaskaTrickParkSwarm />} />
        <Route path="/game/bomb-maze" element={<FaskaBombMazeGodot />} />
        <Route path="/game/bomb-maze-react" element={<FaskaBombMazeSwarm />} />
        <Route path="/game/brawler" element={<FaskaBrawlerGodot />} />
        <Route path="/game/brawler-react" element={<FaskaBrawlerSwarm />} />
        <Route path="/game/math-defender" element={<FaskaMathDefenderSwarm />} />
        <Route path="/game/type-hero" element={<FaskaTypeHeroSwarm />} />
        <Route path="/game/type-hero-godot" element={<FaskaTypeHeroGodot />} />
        <Route path="/game/type-hero-react" element={<FaskaTypeHeroSwarm />} />
        <Route path="/game/geo-runner" element={<FaskaGeoRunnerSwarm />} />
      </Routes>
    </Suspense>
  );
}
