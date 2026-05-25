import React from 'react';

export default function Faska64Part2({ onExit }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900 text-white p-8 text-center relative z-10">
      <h1 className="text-4xl font-bold mb-4">FASKA 64 Part 2</h1>
      <p className="text-xl mb-8">Agent 3 encountered a write error. This game is being re-developed.</p>
      <button 
        onClick={onExit}
        className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-full font-bold text-white transition-colors"
      >
        Beenden
      </button>
    </div>
  );
}
