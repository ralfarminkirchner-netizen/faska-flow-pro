import { createGameStore } from '../../../../shared/useSwarmStore';

export const useMathDefenderStore = createGameStore(
  {
    asteroids: [],
    currentInput: '',
    lasers: [],
    asteroidDestroyedEvent: null,
    baseHitEvent: null,
    errorEvent: null,
  },
  (set, get) => ({
    spawnAsteroid: () => {
      const { level, asteroids, isGameOver, isPaused, isPlaying } = get();
      
      if (isGameOver || isPaused || !isPlaying) return;
      
      // generate math problem
      let a, b, operator;
      if (level < 3) {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        operator = '+';
      } else if (level < 6) {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && a < b) {
          let temp = a;
          a = b;
          b = temp;
        }
      } else {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        operator = 'x';
      }
      
      let text, answer;
      if (operator === '+') {
        text = `${a} + ${b}`;
        answer = (a + b).toString();
      } else if (operator === '-') {
        text = `${a} - ${b}`;
        answer = (a - b).toString();
      } else {
        text = `${a} x ${b}`;
        answer = (a * b).toString();
      }
      
      const newAsteroid = {
        id: Math.random().toString(36).substring(2, 9),
        text,
        answer,
        position: [(Math.random() - 0.5) * 20, 25, (Math.random() - 0.5) * 5 - 5],
        speed: Math.random() * 2 + 2 + level * 0.5,
        type: Math.floor(Math.random() * 3),
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        rotSpeed: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]
      };
      
      set({ asteroids: [...asteroids, newAsteroid] });
    },
    
    handleTyping: (char) => {
      const state = get();
      if (state.lives <= 0 || state.isGameOver || state.isPaused || state.quizActive) return;
      
      // Allow clearing
      if (char === 'Backspace' || char === 'Delete') {
        set({ currentInput: state.currentInput.slice(0, -1) });
        return;
      }

      // Only accept numbers
      if (!/^[0-9]$/.test(char)) return;
      
      const newInput = state.currentInput + char;
      
      const matchedAsteroid = state.asteroids.find(a => a.answer === newInput);
      
      if (matchedAsteroid) {
        // Laser targeting
        const laser = {
          id: Math.random().toString(36).substring(2, 9),
          start: [0, -2, 0], // base position
          end: matchedAsteroid.position,
          life: 0.2 // fast laser
        };
        
        state.addScore(10);
        
        const newAsteroids = state.asteroids.filter(a => a.id !== matchedAsteroid.id);
        
        set({
          asteroids: newAsteroids,
          currentInput: '',
          lasers: [...state.lasers, laser],
          asteroidDestroyedEvent: matchedAsteroid
        });
        
        // Trigger quiz and level up
        const newScore = get().score;
        if (newScore > 0 && newScore % 100 === 0) {
           state.nextLevel();
           state.triggerQuiz('math');
        } else if (newScore > 0 && newScore % 50 === 0) {
           state.nextLevel();
        }
      } else {
        const isPrefix = state.asteroids.some(a => a.answer.startsWith(newInput));
        if (isPrefix) {
          set({ currentInput: newInput });
        } else {
          if (newInput.length >= 3 || !isPrefix) {
             set({ currentInput: '', errorEvent: Date.now() });
          } else {
             set({ currentInput: newInput });
          }
        }
      }
    },
    
    updateAsteroids: (dt) => {
      const state = get();
      if (state.lives <= 0 || state.isGameOver || state.isPaused || state.quizActive) return;
      
      let lifeLost = false;
      
      const updatedAsteroids = state.asteroids.map(a => ({
        ...a,
        position: [a.position[0], a.position[1] - a.speed * dt, a.position[2]],
        rotation: [
          a.rotation[0] + a.rotSpeed[0] * dt,
          a.rotation[1] + a.rotSpeed[1] * dt,
          a.rotation[2] + a.rotSpeed[2] * dt,
        ]
      })).filter(a => {
        if (a.position[1] < -2) {
          lifeLost = true;
          return false;
        }
        return true;
      });
      
      const updatedLasers = state.lasers.map(l => ({
        ...l,
        life: l.life - dt
      })).filter(l => l.life > 0);
      
      if (lifeLost) {
        state.loseLife();
        set({
          asteroids: updatedAsteroids,
          lasers: updatedLasers,
          currentInput: '',
          baseHitEvent: Date.now()
        });
      } else {
        set({ asteroids: updatedAsteroids, lasers: updatedLasers });
      }
    },
    
    clearEvents: () => set({ asteroidDestroyedEvent: null, baseHitEvent: null, errorEvent: null }),
    resetInput: () => set({ currentInput: '' }),
  })
);
