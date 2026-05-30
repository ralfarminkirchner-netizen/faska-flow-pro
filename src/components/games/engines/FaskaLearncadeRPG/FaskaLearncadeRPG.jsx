import React from 'react';
import World from './World';
import MobileJoystick from './MobileJoystick';
import UIOverlay from './UIOverlay';
import { useGameStore } from './GameLogic';

export default function FaskaLearncadeRPG() {
  const activeNPC = useGameStore((state) => state.activeNPC);
  const score = useGameStore((state) => state.score);

  return (
    <div className="relative w-full h-[100dvh] bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl z-10">
        <h1 className="text-2xl font-bold text-white tracking-wider">Score: <span className="text-yellow-400">{score}</span></h1>
      </div>
      
      <World />
      <MobileJoystick />
      
      {activeNPC && <UIOverlay />}
    </div>
  );
}
