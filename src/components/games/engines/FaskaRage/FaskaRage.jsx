import React from 'react';

export default function FaskaRage({ onExit }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4 animate-pulse">FASKA Rage wird geladen...</h1>
      <p className="text-xl">Der Agent kompiliert gerade die Straßenkampf-Engine.</p>
      <button onClick={onExit} className="mt-8 px-6 py-3 bg-red-600 rounded-full font-bold">Zurück</button>
    </div>
  );
}
