import React from 'react';
export default function Placeholder({ onExit }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white font-mono">
      <p className="text-2xl animate-pulse">Building...</p>
      <button onClick={onExit} className="mt-8 px-6 py-2 bg-red-600 rounded">Beenden</button>
    </div>
  );
}
