import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  phase: 'playing', // 'playing', 'quiz', 'gameOver', 'victory'
  playerPos: { x: 400, y: 500 },
  health: 6,
  maxHealth: 6,
  inventory: { keys: 0, bombs: 3 },
  doors: [
    { id: 'door1', x: 400, y: 100, open: false },
  ],
  switches: [
    { id: 'switch1', x: 200, y: 300, active: false },
  ],
  chests: [
    { id: 'chest1', x: 600, y: 300, open: false, question: 'Capital of France?', answer: 'paris' },
    { id: 'chest2', x: 600, y: 150, open: false, question: 'Capital of Japan?', answer: 'tokyo' }
  ],
  activeQuiz: null,
  
  movePlayer: (dx, dy) => set(state => {
    if (state.phase !== 'playing') return state;
    
    // Bounds checking (assuming 800x600 world, 20px walls)
    let nx = state.playerPos.x + dx;
    let ny = state.playerPos.y + dy;
    nx = Math.max(36, Math.min(764, nx));
    ny = Math.max(36, Math.min(564, ny));
    
    // Simple door collision
    const door = state.doors[0];
    if (!door.open) {
      if (nx > door.x - 40 && nx < door.x + 40 && ny < door.y + 20 && ny > door.y - 20) {
        if (state.inventory.keys > 0) {
           return {
             playerPos: { x: nx, y: ny },
             doors: [{ ...door, open: true }],
             inventory: { ...state.inventory, keys: state.inventory.keys - 1 }
           };
        }
        // block
        ny = state.playerPos.y;
      }
    }
    
    return { playerPos: { x: nx, y: ny } };
  }),

  interact: () => set(state => {
    if (state.phase !== 'playing') return state;
    
    const px = state.playerPos.x;
    const py = state.playerPos.y;
    
    // Switch
    let newSwitches = state.switches;
    const s = state.switches.find(s => Math.hypot(s.x - px, s.y - py) < 50);
    if (s && !s.active) {
      newSwitches = state.switches.map(sw => sw.id === s.id ? { ...sw, active: true } : sw);
    }

    // Chest (starts quiz)
    const c = state.chests.find(c => Math.hypot(c.x - px, c.y - py) < 50);
    if (c && !c.open) {
      return { phase: 'quiz', activeQuiz: c, switches: newSwitches };
    }

    return { switches: newSwitches };
  }),

  submitQuiz: (answer) => set(state => {
    if (state.activeQuiz && answer.toLowerCase().trim() === state.activeQuiz.answer) {
      return {
        phase: 'playing',
        activeQuiz: null,
        chests: state.chests.map(c => c.id === state.activeQuiz.id ? { ...c, open: true } : c),
        inventory: { ...state.inventory, keys: state.inventory.keys + 1 }
      };
    }
    return { phase: 'playing', activeQuiz: null, health: Math.max(0, state.health - 1) };
  }),

  setPhase: (phase) => set({ phase }),
  
  resetGame: () => set({
    phase: 'playing',
    playerPos: { x: 400, y: 500 },
    health: 6,
    inventory: { keys: 0, bombs: 3 },
    doors: [{ id: 'door1', x: 400, y: 100, open: false }],
    switches: [{ id: 'switch1', x: 200, y: 300, active: false }],
    chests: [
      { id: 'chest1', x: 600, y: 300, open: false, question: 'Capital of France?', answer: 'paris' },
      { id: 'chest2', x: 600, y: 150, open: false, question: 'Capital of Japan?', answer: 'tokyo' }
    ],
    activeQuiz: null
  })
}));
