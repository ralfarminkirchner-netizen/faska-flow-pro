import React from 'react';

export default function FaskaDoomSwarm({ onExit }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white font-mono">
      <h1 className="text-4xl text-red-700 mb-4">FASKA Doom</h1>
      <p className="animate-pulse">Agent is generating...</p>
      <button onClick={onExit} className="mt-8 px-6 py-2 bg-red-600 rounded">Beenden</button>
    </div>
  );
}
