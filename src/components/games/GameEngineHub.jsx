import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';

// --- WAVE 1: HIGH QUALITY CURATED SWARM ---
const FaskaZeldaSwarm = lazy(() => import('./engines/FaskaZeldaSwarm/FaskaZeldaSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Zelda Error</div> })));
const FaskaKartSwarm = lazy(() => import('./engines/FaskaKartSwarm/FaskaKartSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Kart Error</div> })));
const FaskaWolfSwarm = lazy(() => import('./engines/FaskaWolfSwarm/FaskaWolfSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Wolf Error</div> })));
const FaskaTonyHawkSwarm = lazy(() => import('./engines/FaskaTonyHawkSwarm/FaskaTonyHawkSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Tony Hawk Error</div> })));
const FaskaAstroSwarm = lazy(() => import('./engines/FaskaAstroSwarm/FaskaAstroSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Astro Error</div> })));
const FaskaFantasySwarm = lazy(() => import('./engines/FaskaFantasySwarm/FaskaFantasySwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Fantasy Error</div> })));
const FaskaExciteSwarm = lazy(() => import('./engines/FaskaExciteSwarm/FaskaExciteSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Excite Error</div> })));
const FaskaKirbySwarm = lazy(() => import('./engines/FaskaKirbySwarm/FaskaKirbySwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Kirby Error</div> })));
const FaskaBombermanSwarm = lazy(() => import('./engines/FaskaBombermanSwarm/FaskaBombermanSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Bomberman Error</div> })));
const FaskaDoomSwarm = lazy(() => import('./engines/FaskaDoomSwarm/FaskaDoomSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Doom Error</div> })));
const FaskaTekkenSwarm = lazy(() => import('./engines/FaskaTekkenSwarm/FaskaTekkenSwarm').catch(() => ({ default: () => <div className="text-white p-8">FASKA Tekken Error</div> })));


const GAMES = [
  { id: 'faskazeldaswarm', title: 'FASKA Zelda', desc: 'Dungeon Action RPG', icon: '🗡️', component: FaskaZeldaSwarm, color: 'bg-emerald-700', shadow: 'shadow-emerald-700/50' },
  { id: 'faskakartswarm', title: 'FASKA Kart', desc: '3D Racing mit Items', icon: '🏎️', component: FaskaKartSwarm, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
  { id: 'faskawolfswarm', title: 'FASKA Wolf', desc: 'Raycast FPS Maze', icon: '🏰', component: FaskaWolfSwarm, color: 'bg-gray-800', shadow: 'shadow-gray-800/50' },
  { id: 'faskatonyhawkswarm', title: 'FASKA Tony Hawk', desc: '3D Skate Tricks', icon: '🛹', component: FaskaTonyHawkSwarm, color: 'bg-orange-400', shadow: 'shadow-orange-400/50' },
  { id: 'faskaastroswarm', title: 'FASKA Astro', desc: '3D Bot Platformer', icon: '🤖', component: FaskaAstroSwarm, color: 'bg-indigo-500', shadow: 'shadow-indigo-500/50' },
  { id: 'faskafantasyswarm', title: 'FASKA Fantasy', desc: 'Turn-Based RPG', icon: '🛡️', component: FaskaFantasySwarm, color: 'bg-purple-700', shadow: 'shadow-purple-700/50' },
  { id: 'faskaexciteswarm', title: 'FASKA Excite', desc: '2D Motocross Jumps', icon: '🏍️', component: FaskaExciteSwarm, color: 'bg-red-600', shadow: 'shadow-red-600/50' },
  { id: 'faskakirbyswarm', title: 'FASKA Kirby', desc: 'Floaty Platformer', icon: '⭐', component: FaskaKirbySwarm, color: 'bg-pink-400', shadow: 'shadow-pink-400/50' },
  { id: 'faskabombermanswarm', title: 'FASKA Bomberman', desc: 'Grid Explosions', icon: '💣', component: FaskaBombermanSwarm, color: 'bg-red-700', shadow: 'shadow-red-700/50' },
  { id: 'faskadoomswarm', title: 'FASKA Doom', desc: 'First Person Shooter', icon: '🔫', component: FaskaDoomSwarm, color: 'bg-red-900', shadow: 'shadow-red-900/50' },
  { id: 'faskatekkenswarm', title: 'FASKA Tekken', desc: '3D Fighting Game', icon: '🥋', component: FaskaTekkenSwarm, color: 'bg-zinc-800', shadow: 'shadow-zinc-800/50' }
];

export default function GameEngineHub({ onExit }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        <ErrorBoundary onExit={() => setActiveGame(null)}>
          <Suspense fallback={<div className="text-white text-2xl font-bold animate-pulse">Lade Spiel...</div>}>
            <GameComponent onExit={() => setActiveGame(null)} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-5xl">
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={onExit}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold backdrop-blur-md transition-all shadow-lg border border-white/20"
          >
            ← Zurück
          </button>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
              RETRO ARCADE (ULTIMATE)
            </h1>
            <p className="text-slate-300 mt-2 font-medium">Alle {GAMES.length} Engines der FASKA Collection!</p>
          </div>
          <div className="w-[100px]"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {GAMES.map((game) => (
            <motion.button
              key={game.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGame(game)}
              className={`relative overflow-hidden rounded-3xl p-8 text-left transition-all ${game.color} ${game.shadow} shadow-2xl border-4 border-white/20 flex items-center gap-6 group`}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="text-7xl drop-shadow-xl bg-white/20 w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white drop-shadow-md mb-1">{game.title}</h2>
                <p className="text-white/90 font-medium text-lg drop-shadow-sm">{game.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
