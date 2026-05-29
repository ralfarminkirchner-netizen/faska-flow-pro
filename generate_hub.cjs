const fs = require('fs');
const path = require('path');

const enginesDir = path.join(__dirname, 'src/components/games/engines');
const dirs = fs.readdirSync(enginesDir).filter(f => {
  if (!fs.statSync(path.join(enginesDir, f)).isDirectory()) return false;
  // Check if the component file actually exists
  const componentPath = path.join(enginesDir, f, `${f}.jsx`);
  return fs.existsSync(componentPath);
});

let imports = `import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';\n\n`;

let gamesArray = `const GAMES = [\n`;

const ICONS = ['🕹️', '👾', '🚀', '🏎️', '🎮', '⚔️', '🛡️', '💣', '⭐', '🛹', '🏁', '⚽', '🐍', '🧩'];
const COLORS = ['bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500', 'bg-purple-600', 'bg-pink-600', 'bg-teal-600', 'bg-zinc-800', 'bg-orange-500'];

dirs.sort((a, b) => a.localeCompare(b));

dirs.forEach((dir, i) => {
  const componentName = dir;
  imports += `const ${componentName} = lazy(() => import('./engines/${dir}/${componentName}').catch(() => ({ default: () => <div className="text-white p-8">Error loading ${componentName}</div> })));\n`;
  
  const title = dir.replace('Faska', 'FASKA ').replace(/Swarm/g, ' (Pro)');
  const icon = ICONS[i % ICONS.length];
  const color = COLORS[i % COLORS.length];
  
  gamesArray += `  { id: '${dir.toLowerCase()}', title: '${title}', desc: 'Retro Arcade Game', icon: '${icon}', component: ${componentName}, color: '${color}', shadow: 'shadow-white/10' },\n`;
});

gamesArray += `];\n\n`;

const remainingCode = `export default function GameEngineHub({ onExit }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
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
      className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col items-center relative overflow-y-auto custom-scrollbar"
    >
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-7xl">
        <div className="sticky top-0 z-20 flex justify-between items-center mb-8 bg-slate-900/80 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div>
            <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500">
              RETRO ARCADE
            </h2>
            <p className="text-slate-400 text-sm md:text-lg mt-1 font-bold tracking-widest uppercase">Wähle dein Spiel ({GAMES.length} verfügbar)</p>
          </div>
          <button 
            onClick={onExit}
            className="w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-400 rounded-2xl flex items-center justify-center transition-all border border-white/10 hover:border-rose-500/50"
          >
            <span className="text-xl md:text-2xl font-bold">✕</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 pb-20">
          {GAMES.map(game => (
            <motion.button
              key={game.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGame(game)}
              className={\`relative overflow-hidden text-left \${game.color} rounded-3xl p-4 md:p-5 shadow-2xl transition-all border border-white/20 group hover:ring-4 ring-white/30\`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[80px] -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <span className="text-4xl drop-shadow-lg inline-block mb-3 group-hover:animate-bounce">{game.icon}</span>
                <h3 className="font-black text-lg md:text-xl leading-tight mb-1 tracking-tight drop-shadow-md">{game.title}</h3>
                <p className="font-bold text-[10px] text-white/80 uppercase tracking-widest bg-black/20 rounded px-2 py-0.5 inline-block">{game.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src/components/games/GameEngineHub.jsx'), imports + gamesArray + remainingCode);
console.log('Generated GameEngineHub.jsx');
