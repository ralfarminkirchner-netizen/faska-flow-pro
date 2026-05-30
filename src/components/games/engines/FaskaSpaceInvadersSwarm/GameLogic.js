import { create } from 'zustand';

const TARGET_NUMBERS = [12, 18, 20, 24, 30, 36, 40, 42, 48, 50];

export const useGameStore = create((set, get) => ({
  score: 0,
  targetNumber: 24,
  gameOverState: false,
  alienSpeed: 2,
  alienDirection: 1,
  
  lasers: [],
  aliens: [],
  
  playerX: 0,
  
  initLevel: () => {
    const targetNumber = TARGET_NUMBERS[Math.floor(Math.random() * TARGET_NUMBERS.length)];
    const aliens = [];
    
    // Grid: 4 rows, 10 columns
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 10; x++) {
        aliens.push({
          id: `alien_${Date.now()}_${x}_${y}`,
          x: -4.5 + x * 1.0,
          z: -6 + y * 1.0,
          numberValue: Math.floor(Math.random() * 9) + 2 // 2 to 10
        });
      }
    }
    
    set({
      targetNumber,
      aliens,
      lasers: [],
      alienDirection: 1,
      playerX: 0
    });
  },

  restartGame: () => {
    set({ score: 0, alienSpeed: 2, gameOverState: false });
    get().initLevel();
  },

  setPlayerX: (x) => set({ playerX: x }),
  
  fireLaser: () => {
    if (get().gameOverState) return;
    set((state) => ({
      lasers: [...state.lasers, { id: Date.now() + Math.random(), x: state.playerX, z: 4 }]
    }));
  },

  updateGameState: (delta) => {
    if (get().gameOverState) return;
    
    set((state) => {
      // update lasers
      const newLasers = state.lasers.map(l => ({ ...l, z: l.z - 15 * delta })).filter(l => l.z > -10);
      
      // update aliens
      let hitBound = false;
      let newAliens = state.aliens.map(a => {
        const nextX = a.x + state.alienSpeed * state.alienDirection * delta;
        if (nextX > 5 || nextX < -5) hitBound = true;
        return { ...a, x: nextX };
      });

      let nextDirection = state.alienDirection;
      if (hitBound) {
        nextDirection *= -1;
        newAliens = newAliens.map(a => ({ ...a, z: a.z + 0.5 }));
      }

      let currentScore = state.score;
      let isGameOver = false;

      const survivingLasers = [];
      const survivingAliens = [...newAliens];

      newLasers.forEach(laser => {
        let hit = false;
        for (let i = survivingAliens.length - 1; i >= 0; i--) {
          const a = survivingAliens[i];
          const dist = Math.sqrt(Math.pow(laser.x - a.x, 2) + Math.pow(laser.z - a.z, 2));
          if (dist < 0.8) {
            hit = true;
            const isCorrect = (state.targetNumber % a.numberValue === 0);
            if (isCorrect) currentScore += 10;
            else currentScore -= 5;
            
            survivingAliens.splice(i, 1);
            break;
          }
        }
        if (!hit) survivingLasers.push(laser);
      });

      survivingAliens.forEach(a => {
        if (a.z > 3.5) isGameOver = true;
      });

      let levelComplete = false;
      let nextSpeed = state.alienSpeed;
      if (survivingAliens.length === 0) {
        levelComplete = true;
      } else {
        const hasCorrect = survivingAliens.some(a => state.targetNumber % a.numberValue === 0);
        if (!hasCorrect) {
            currentScore += 50;
            levelComplete = true;
        }
      }

      if (levelComplete) {
        setTimeout(() => get().initLevel(), 0);
        nextSpeed += 0.5;
      }

      return {
        lasers: survivingLasers,
        aliens: survivingAliens,
        alienDirection: nextDirection,
        score: currentScore,
        gameOverState: isGameOver,
        alienSpeed: nextSpeed
      };
    });
  }
}));
