import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy loading the games once they are built by the subagents.
// We use a fallback if the file doesn't exist yet (for development flow).
const FaskaMan = lazy(() => import('./engines/FaskaMan/FaskaMan').catch(() => ({ default: () => <div className="text-white p-8">FaskaMan wird gerade entwickelt...</div> })));
const FaskaBlocks = lazy(() => import('./engines/FaskaBlocks/FaskaBlocks').catch(() => ({ default: () => <div className="text-white p-8">FaskaBlocks wird gerade entwickelt...</div> })));
const FaskaJump = lazy(() => import('./engines/FaskaJump/FaskaJump').catch(() => ({ default: () => <div className="text-white p-8">FaskaJump wird gerade entwickelt...</div> })));
const FaskaCross = lazy(() => import('./engines/FaskaCross/FaskaCross').catch(() => ({ default: () => <div className="text-white p-8">FaskaCross wird gerade entwickelt...</div> })));

// Phase 2 Games (3D & Fighters)
const FaskaDoom = lazy(() => import('./engines/FaskaDoom/FaskaDoom').catch(() => ({ default: () => <div className="text-white p-8">FaskaDoom 3D wird gerade entwickelt...</div> })));
const FaskaKart = lazy(() => import('./engines/FaskaKart/FaskaKart').catch(() => ({ default: () => <div className="text-white p-8">FaskaKart 3D wird gerade entwickelt...</div> })));
const FaskaFighter = lazy(() => import('./engines/FaskaFighter/FaskaFighter').catch(() => ({ default: () => <div className="text-white p-8">FaskaFighter wird gerade entwickelt...</div> })));

// Phase 3 Games (The Ultimate Arcade)
const FaskaZelda = lazy(() => import('./engines/FaskaZelda/FaskaZelda').catch(() => ({ default: () => <div className="text-white p-8">FaskaZelda wird gerade entwickelt...</div> })));
const FaskaSonic = lazy(() => import('./engines/FaskaSonic/FaskaSonic').catch(() => ({ default: () => <div className="text-white p-8">FaskaSonic wird gerade entwickelt...</div> })));
const FaskaRType = lazy(() => import('./engines/FaskaRType/FaskaRType').catch(() => ({ default: () => <div className="text-white p-8">FaskaRType wird gerade entwickelt...</div> })));
const FaskaCrazyTaxi = lazy(() => import('./engines/FaskaCrazyTaxi/FaskaCrazyTaxi').catch(() => ({ default: () => <div className="text-white p-8">FaskaCrazyTaxi 3D wird gerade entwickelt...</div> })));
const FaskaPinball = lazy(() => import('./engines/FaskaPinball/FaskaPinball').catch(() => ({ default: () => <div className="text-white p-8">FaskaPinball wird gerade entwickelt...</div> })));
const FaskaMicroMachines = lazy(() => import('./engines/FaskaMicroMachines/FaskaMicroMachines').catch(() => ({ default: () => <div className="text-white p-8">FaskaMicroMachines wird gerade entwickelt...</div> })));

// Phase 4 Games (The 64-Bit Era)
const FaskaMario64 = lazy(() => import('./engines/FaskaMario64/FaskaMario64').catch(() => ({ default: () => <div className="text-white p-8">FaskaMario64 wird gerade entwickelt...</div> })));
const FaskaMarbleMadness = lazy(() => import('./engines/FaskaMarbleMadness/FaskaMarbleMadness').catch(() => ({ default: () => <div className="text-white p-8">FaskaMarbleMadness wird gerade entwickelt...</div> })));
const FaskaTekken = lazy(() => import('./engines/FaskaTekken/FaskaTekken').catch(() => ({ default: () => <div className="text-white p-8">FaskaTekken wird gerade entwickelt...</div> })));
const FaskaContra = lazy(() => import('./engines/FaskaContra/FaskaContra').catch(() => ({ default: () => <div className="text-white p-8">FaskaContra wird gerade entwickelt...</div> })));
const FaskaSpaceInvaders = lazy(() => import('./engines/FaskaSpaceInvaders/FaskaSpaceInvaders').catch(() => ({ default: () => <div className="text-white p-8">FaskaSpaceInvaders wird gerade entwickelt...</div> })));

const GAMES = [
  // Phase 4
  { id: 'faskamario64', title: 'Faska-64', desc: '3D Collectathon Platformer', icon: '⭐', component: FaskaMario64, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
  { id: 'faskamarble', title: 'Marble Madness', desc: '3D Rolling Physics', icon: '🔮', component: FaskaMarbleMadness, color: 'bg-blue-400', shadow: 'shadow-blue-400/50' },
  { id: 'faskatekken', title: 'Faska-Fighter 3D', desc: '3D Arena Brawler', icon: '🥋', component: FaskaTekken, color: 'bg-zinc-800', shadow: 'shadow-zinc-800/50' },
  { id: 'faskacontra', title: 'Faska-Contra', desc: '2D Run and Gun', icon: '💥', component: FaskaContra, color: 'bg-green-800', shadow: 'shadow-green-800/50' },
  { id: 'faskainvaders', title: 'Space Invaders', desc: 'Classic Arcade Shooter', icon: '👾', component: FaskaSpaceInvaders, color: 'bg-purple-900', shadow: 'shadow-purple-900/50' },
  // Phase 3
  { id: 'faskazelda', title: 'Faska-Zelda', desc: 'Dungeon Puzzle Adventure', icon: '🗡️', component: FaskaZelda, color: 'bg-emerald-700', shadow: 'shadow-emerald-700/50' },
  { id: 'faskasonic', title: 'Faska-Sonic', desc: 'High-Speed Platformer', icon: '🦔', component: FaskaSonic, color: 'bg-blue-600', shadow: 'shadow-blue-600/50' },
  { id: 'faskartype', title: 'Faska-RType', desc: 'Galaktischer Space-Shooter', icon: '🚀', component: FaskaRType, color: 'bg-purple-800', shadow: 'shadow-purple-800/50' },
  { id: 'faskacrazytaxi', title: 'Faska-CrazyTaxi', desc: '3D City Driving', icon: '🚕', component: FaskaCrazyTaxi, color: 'bg-yellow-400', shadow: 'shadow-yellow-500/50' },
  { id: 'faskapinball', title: 'Faska-Pinball', desc: 'Physics-based Flipper', icon: '🕹️', component: FaskaPinball, color: 'bg-cyan-700', shadow: 'shadow-cyan-700/50' },
  { id: 'faskamicromachines', title: 'Micro-Machines', desc: 'Top-Down Drifting Racer', icon: '🏎️', component: FaskaMicroMachines, color: 'bg-red-600', shadow: 'shadow-red-600/50' },
  // Phase 2
  { id: 'faskadoom', title: 'Faska-Doom 3D', desc: 'First Person Mathe-Shooter!', icon: '🔫', component: FaskaDoom, color: 'bg-red-800', shadow: 'shadow-red-900/50' },
  { id: 'faskakart', title: 'Faska-Kart 3D', desc: 'Highspeed Mode-7 Racing!', icon: '🏎️', component: FaskaKart, color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50' },
  { id: 'faskafighter', title: 'Faska-Fighter', desc: 'Tipp-Combos und Hadouken!', icon: '🥊', component: FaskaFighter, color: 'bg-orange-600', shadow: 'shadow-orange-600/50' },
  { id: 'faskaman', title: 'Faska-Man', desc: 'Sammle Wörter im Labyrinth!', icon: '🟡', component: FaskaMan, color: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' },
  { id: 'faskablocks', title: 'Faska-Blocks', desc: 'Staple Blöcke und rechne mit!', icon: '🧱', component: FaskaBlocks, color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
  { id: 'faskajump', title: 'Faska-Jump', desc: 'Springe zur richtigen Antwort!', icon: '🍄', component: FaskaJump, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
  { id: 'faskacross', title: 'Faska-Cross', desc: 'Überquere den Fluss sicher!', icon: '🐸', component: FaskaCross, color: 'bg-green-500', shadow: 'shadow-green-500/50' }
];

export default function GameEngineHub({ onExit }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        <Suspense fallback={<div className="text-white text-2xl font-bold animate-pulse">Lade Spiel...</div>}>
          <GameComponent onExit={() => setActiveGame(null)} />
        </Suspense>
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
      {/* Background glow effects */}
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
              RETRO ARCADE
            </h1>
            <p className="text-slate-300 mt-2 font-medium">Wähle ein Minispiel und trainiere deine Skills!</p>
          </div>
          <div className="w-[100px]"></div> {/* Spacer for flex balance */}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="mt-4 px-4 py-1 bg-black/30 rounded-full inline-block text-sm font-bold uppercase tracking-wider border border-white/20 group-hover:bg-black/50 transition-colors">
                  Spielen ▶
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
