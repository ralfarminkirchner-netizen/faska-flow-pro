import React, { useEffect, useState } from 'react';
import useGameStore from '../store/gameStore';

export default function UI({ onExit }) {
  const { gameState, health, score, resetGame } = useGameStore();
  const [isIntro, setIsIntro] = useState(false);

  // Smooth cinematic intro transition when starting
  useEffect(() => {
    if (gameState === 'PLAYING') {
      setIsIntro(true);
      const timer = setTimeout(() => setIsIntro(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleStart = () => {
    resetGame();
  };

  const handleRestart = () => {
    resetGame();
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-50 overflow-hidden font-sans">
      
      {/* Cinematic Black Bars during intro */}
      <div 
        className={`absolute top-0 left-0 w-full h-24 bg-black transition-transform duration-1000 ease-in-out z-40 ${isIntro ? 'translate-y-0' : '-translate-y-full'}`} 
      />
      <div 
        className={`absolute bottom-0 left-0 w-full h-24 bg-black transition-transform duration-1000 ease-in-out z-40 ${isIntro ? 'translate-y-0' : 'translate-y-full'}`} 
      />

      {/* HUD - Always visible during PLAYING but fades in after intro */}
      {gameState === 'PLAYING' && (
        <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none transition-opacity duration-1000 ${isIntro ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col gap-2">
            <div className="text-white font-bold text-2xl tracking-wider drop-shadow-md">
              SCORE: {score.toString().padStart(6, '0')}
            </div>
            <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
              <div 
                className={`h-full transition-all duration-300 ${health > 30 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${health}%` }}
              />
            </div>
          </div>
          
          <button 
            onClick={onExit}
            className="pointer-events-auto px-4 py-2 bg-black/50 hover:bg-black/75 text-white font-semibold rounded backdrop-blur-sm transition-colors border border-white/20"
          >
            Exit Hub
          </button>
        </div>
      )}

      {/* Main Menu Overlay */}
      <div 
        className={`absolute inset-0 bg-black/80 flex flex-col items-center justify-center pointer-events-auto backdrop-blur-sm transition-opacity duration-700 ${gameState === 'MENU' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {gameState === 'MENU' && (
          <>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-600 mb-2 tracking-tighter drop-shadow-lg">
              FASKA RAIDER
            </h1>
            <p className="text-gray-300 mb-12 text-lg font-light tracking-widest animate-pulse">
              A NEW ADVENTURE AWAITS
            </p>
            
            <div className="flex flex-col gap-4 w-64">
              <button 
                onClick={handleStart}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xl rounded-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              >
                START GAME
              </button>
              <button 
                onClick={onExit}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700 hover:border-gray-500"
              >
                RETURN TO HUB
              </button>
            </div>
          </>
        )}
      </div>

      {/* Game Over Overlay */}
      <div 
        className={`absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center pointer-events-auto backdrop-blur-md transition-opacity duration-1000 ${gameState === 'GAMEOVER' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {gameState === 'GAMEOVER' && (
          <>
            <h1 className="text-7xl font-black text-red-500 mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              YOU DIED
            </h1>
            <div className="text-2xl text-white mb-12 font-mono">
              FINAL SCORE: <span className="text-amber-400 font-bold">{score}</span>
            </div>
            
            <div className="flex gap-6">
              <button 
                onClick={handleRestart}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
              >
                TRY AGAIN
              </button>
              <button 
                onClick={onExit}
                className="px-8 py-3 bg-transparent hover:bg-white/10 text-white font-medium rounded-lg border border-white/30 transition-colors"
              >
                QUIT
              </button>
            </div>
          </>
        )}
      </div>

      {/* Victory Overlay */}
      <div 
        className={`absolute inset-0 bg-blue-950/90 flex flex-col items-center justify-center pointer-events-auto backdrop-blur-md transition-opacity duration-1000 ${gameState === 'WIN' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {gameState === 'WIN' && (
          <>
            <h1 className="text-7xl font-black text-blue-400 mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              VICTORY
            </h1>
            <div className="text-2xl text-white mb-12 font-mono">
              FINAL SCORE: <span className="text-amber-400 font-bold">{score}</span>
            </div>
            
            <div className="flex gap-6">
              <button 
                onClick={handleStart}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={onExit}
                className="px-8 py-3 bg-transparent hover:bg-white/10 text-white font-medium rounded-lg border border-white/30 transition-colors"
              >
                CONTINUE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
