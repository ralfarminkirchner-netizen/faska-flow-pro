import React from 'react';

export default function FaskaWario({ onExit }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4 animate-pulse">FASKA Wario wird geladen...</h1>
      <p className="text-xl">Die WarioWare Microgame Engine wird gerade kompiliert.</p>
      <button onClick={onExit} className="mt-8 px-6 py-3 bg-purple-600 rounded-full font-bold">Zurück</button>
    </div>
  );
}
