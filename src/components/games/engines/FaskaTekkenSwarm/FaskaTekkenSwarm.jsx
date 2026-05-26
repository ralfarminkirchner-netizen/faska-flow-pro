import React from 'react';

export default function FaskaTekkenSwarm({ onExit }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white font-mono">
      <h1 className="text-4xl text-zinc-500 mb-4">FASKA Tekken</h1>
      <p className="animate-pulse">Agent is generating...</p>
      <button onClick={onExit} className="mt-8 px-6 py-2 bg-red-600 rounded">Beenden</button>
    </div>
  );
}
