import React from 'react';
import { useGameStore } from './GameLogic';

export default function MobileJoystick() {
  const setJoystickVector = useGameStore((state) => state.setJoystickVector);
  const setInteractPressed = useGameStore((state) => state.setInteractPressed);

  return (
    <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-between items-center pointer-events-none z-20">
      {/* Simple D-Pad for Movement */}
      <div className="grid grid-cols-3 gap-2 pointer-events-auto">
        <div />
        <button 
          className="w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors"
          onTouchStart={() => setJoystickVector({x: 0, y: -1})}
          onTouchEnd={() => setJoystickVector({x: 0, y: 0})}
          onMouseDown={() => setJoystickVector({x: 0, y: -1})}
          onMouseUp={() => setJoystickVector({x: 0, y: 0})}
          onMouseLeave={() => setJoystickVector({x: 0, y: 0})}
        >↑</button>
        <div />
        <button 
          className="w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors"
          onTouchStart={() => setJoystickVector({x: -1, y: 0})}
          onTouchEnd={() => setJoystickVector({x: 0, y: 0})}
          onMouseDown={() => setJoystickVector({x: -1, y: 0})}
          onMouseUp={() => setJoystickVector({x: 0, y: 0})}
          onMouseLeave={() => setJoystickVector({x: 0, y: 0})}
        >←</button>
        <button 
          className="w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors"
          onTouchStart={() => setJoystickVector({x: 0, y: 1})}
          onTouchEnd={() => setJoystickVector({x: 0, y: 0})}
          onMouseDown={() => setJoystickVector({x: 0, y: 1})}
          onMouseUp={() => setJoystickVector({x: 0, y: 0})}
          onMouseLeave={() => setJoystickVector({x: 0, y: 0})}
        >↓</button>
        <button 
          className="w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors"
          onTouchStart={() => setJoystickVector({x: 1, y: 0})}
          onTouchEnd={() => setJoystickVector({x: 0, y: 0})}
          onMouseDown={() => setJoystickVector({x: 1, y: 0})}
          onMouseUp={() => setJoystickVector({x: 0, y: 0})}
          onMouseLeave={() => setJoystickVector({x: 0, y: 0})}
        >→</button>
      </div>

      {/* Interact Button */}
      <div className="pointer-events-auto">
        <button
          className="w-24 h-24 bg-blue-500/50 hover:bg-blue-500/70 rounded-full active:bg-blue-500/90 touch-none border-4 border-white/20 text-white font-bold text-lg flex items-center justify-center shadow-2xl transition-colors"
          onTouchStart={() => setInteractPressed(true)}
          onTouchEnd={() => setInteractPressed(false)}
          onMouseDown={() => setInteractPressed(true)}
          onMouseUp={() => setInteractPressed(false)}
          onMouseLeave={() => setInteractPressed(false)}
        >
          A
        </button>
      </div>
    </div>
  );
}
