import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  timer: 60,
  streak: 0,
  question: null,
  feedback: null,
  addScore: (points) => set((state) => ({ score: state.score + points })),
  setStreak: (val) => set({ streak: val }),
  setQuestion: (q) => set({ question: q }),
  setFeedback: (f) => set({ feedback: f }),
  tickTimer: () => set((state) => ({ timer: Math.max(0, state.timer - 1) })),
  reset: () => set({ score: 0, timer: 60, streak: 0, question: null, feedback: null })
}));
