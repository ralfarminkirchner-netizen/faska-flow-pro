import { create } from 'zustand';

const useGameStore = create((set) => ({
  gameState: 'MENU', // 'MENU', 'PLAYING', 'GAMEOVER', 'WIN'
  health: 100,
  score: 0,
  
  setGameState: (newState) => set({ gameState: newState }),
  setHealth: (newHealth) => set({ health: newHealth }),
  setScore: (newScore) => set({ score: newScore }),
  
  takeDamage: (amount) => set((state) => {
    const newHealth = Math.max(0, state.health - amount);
    return {
      health: newHealth,
      gameState: newHealth <= 0 ? 'GAMEOVER' : state.gameState
    };
  }),
  
  addScore: (amount) => set((state) => ({ score: state.score + amount })),
  
  resetGame: () => set({
    gameState: 'PLAYING',
    health: 100,
    score: 0
  })
}));
export default useGameStore;
