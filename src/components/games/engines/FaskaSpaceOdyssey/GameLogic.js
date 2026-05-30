import { create } from 'zustand';

const useGameLogic = create((set, get) => ({
  gameState: 'menu', // menu, playing, boss, gameover, victory
  score: 0,
  health: 100,
  bossHealth: 1000,
  playerPosition: [0, 0, 0],
  enemies: [],
  projectiles: [],
  bossProjectiles: [],
  
  startGame: () => set({ gameState: 'playing', score: 0, health: 100, enemies: [], projectiles: [], bossProjectiles: [] }),
  resetGame: () => set({ gameState: 'menu', score: 0, health: 100, bossHealth: 1000 }),
  
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  
  spawnEnemy: () => {
    const { gameState, enemies } = get();
    if (gameState !== 'playing') return;
    
    const newEnemy = {
      id: Math.random().toString(36),
      position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, -50],
    };
    set({ enemies: [...enemies, newEnemy] });
  },

  spawnProjectile: (pos) => {
    const { gameState, projectiles } = get();
    if (gameState !== 'playing' && gameState !== 'boss') return;
    
    const newProjectile = {
      id: Math.random().toString(36),
      position: [...pos],
    };
    set({ projectiles: [...projectiles, newProjectile] });
  },

  updateProjectiles: () => {
    const { projectiles } = get();
    set({ 
      projectiles: projectiles.map(p => ({...p, position: [p.position[0], p.position[1], p.position[2] - 1]})).filter(p => p.position[2] > -100)
    });
  },

  updateEnemies: () => {
    const { enemies, gameState } = get();
    if (gameState !== 'playing') return;
    
    set({
      enemies: enemies.map(e => ({...e, position: [e.position[0], e.position[1], e.position[2] + 0.2]})).filter(e => e.position[2] < 20)
    });
  },

  damagePlayer: (amount) => {
    const { health } = get();
    const newHealth = health - amount;
    if (newHealth <= 0) {
      set({ health: 0, gameState: 'gameover' });
    } else {
      set({ health: newHealth });
    }
  },

  damageEnemy: (id) => {
    const { enemies, score } = get();
    const newScore = score + 100;
    
    set({ 
      enemies: enemies.filter(e => e.id !== id),
      score: newScore,
      gameState: newScore >= 1000 ? 'boss' : get().gameState
    });
  },

  damageBoss: () => {
    const { bossHealth, score } = get();
    const newHealth = bossHealth - 50;
    
    if (newHealth <= 0) {
      set({ bossHealth: 0, gameState: 'victory', score: score + 5000 });
    } else {
      set({ bossHealth: newHealth, score: score + 50 });
    }
  }
}));

export default useGameLogic;
