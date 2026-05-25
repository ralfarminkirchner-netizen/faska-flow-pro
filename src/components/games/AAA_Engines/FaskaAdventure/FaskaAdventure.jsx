import React from 'react';
import LabRoom from './components/LabRoom';
import Interface from './components/Interface';

export default function FaskaAdventure({ onExit }) {
  return (
    <div className="w-full h-full relative bg-black flex flex-col font-mono text-white overflow-hidden">
      {/* Viewport for the Room (Top 70%) */}
      <div className="relative w-full h-[70%]">
        <LabRoom />
      </div>
      
      {/* SCUMM Interface (Bottom 30%) */}
      <div className="relative w-full h-[30%]">
        <Interface onExit={onExit} />
      </div>
    </div>
  );
}
