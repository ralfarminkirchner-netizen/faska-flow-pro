import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  activeNPC: null,
  joystickVector: { x: 0, y: 0 },
  interactPressed: false,
  setActiveNPC: (npc) => set({ activeNPC: npc }),
  setJoystickVector: (vector) => set({ joystickVector: vector }),
  setInteractPressed: (pressed) => set({ interactPressed: pressed }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
}));
