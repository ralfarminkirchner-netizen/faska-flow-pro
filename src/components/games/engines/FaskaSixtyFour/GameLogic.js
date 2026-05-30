import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  collectedContinents: [],
  phase: 'playing', // 'playing', 'quiz', 'won'
  pendingContinent: null,

  collectStar: (continentName, isLearncade = true) => {
    const { collectedContinents, phase } = get();
    
    // Prevent collecting if already collected or if already in a quiz
    if (collectedContinents.includes(continentName) || phase !== 'playing') {
      return;
    }

    if (isLearncade) {
      set({ phase: 'quiz', pendingContinent: continentName });
    } else {
      set((state) => {
        const newCollected = [...state.collectedContinents, continentName];
        return {
          collectedContinents: newCollected,
          phase: newCollected.length >= 7 ? 'won' : 'playing'
        };
      });
    }
  },

  answerQuiz: (isCorrect) => {
    const { pendingContinent, collectedContinents } = get();
    if (isCorrect) {
      const newCollected = [...collectedContinents, pendingContinent];
      set({
        collectedContinents: newCollected,
        phase: newCollected.length >= 7 ? 'won' : 'playing',
        pendingContinent: null,
      });
    } else {
      // If wrong, back to playing so they can try to collect it again.
      set({ phase: 'playing', pendingContinent: null });
    }
  },
  
  resetGame: () => {
    set({ collectedContinents: [], phase: 'playing', pendingContinent: null });
  }
}));
