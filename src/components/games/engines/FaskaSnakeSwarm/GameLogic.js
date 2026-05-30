import { createGameStore } from '../../../../shared/useSwarmStore';

// Grid configuration
const GRID_SIZE = 20; // 20x20 grid
const CELL_SIZE = 1; // 1 unit per cell
const INITIAL_SNAKE = [
  { x: 10, y: 0, z: 10 },
  { x: 9, y: 0, z: 10 },
  { x: 8, y: 0, z: 10 },
];

function randomFoodPosition(snakeSegments) {
  let pos;
  const occupied = new Set(snakeSegments.map((s) => `${s.x},${s.z}`));
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: 0,
      z: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${pos.x},${pos.z}`));
  return pos;
}

function randomMultiplierPosition(snakeSegments, foodPos) {
  let pos;
  const occupied = new Set(snakeSegments.map((s) => `${s.x},${s.z}`));
  occupied.add(`${foodPos.x},${foodPos.z}`);
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: 0,
      z: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${pos.x},${pos.z}`));
  return pos;
}

const useSnakeStore = createGameStore(
  {
    // Snake state
    snakeSegments: [...INITIAL_SNAKE],
    direction: { x: 1, z: 0 }, // Moving right initially
    nextDirection: { x: 1, z: 0 },
    snakeLength: 3,
    growing: false,

    // Food state
    foodPosition: { x: 15, y: 0, z: 10 },
    foodType: 'normal', // 'normal' | 'bonus'
    foodRotation: 0,

    // Multiplier state
    multiplierPosition: null,
    multiplierActive: false,
    scoreMultiplier: 1,
    multiplierTimer: 0,

    // Timing
    moveTimer: 0,
    moveInterval: 0.18, // Seconds between moves — starts moderate
    tickCount: 0,

    // Effects
    eatFlash: false,
    deathFlash: false,

    // Grid config (exported for other components)
    gridSize: GRID_SIZE,
    cellSize: CELL_SIZE,

    // Quiz tracking
    lastQuizScore: 0,
  },
  (set, get) => ({
    setDirection: (x, z) => {
      const state = get();
      // Prevent 180-degree turns
      if (x === -state.direction.x && z === -state.direction.z) return;
      if (x === 0 && z === 0) return;
      set({ nextDirection: { x, z } });
    },

    moveSnake: (delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.quizActive) return;

      // Accumulate time
      const newTimer = state.moveTimer + delta;
      if (newTimer < state.moveInterval) {
        set({
          moveTimer: newTimer,
          foodRotation: state.foodRotation + delta * 2,
          multiplierTimer: Math.max(0, state.multiplierTimer - delta),
        });

        // Remove multiplier when timer expires
        if (state.multiplierTimer > 0 && state.multiplierTimer - delta <= 0) {
          set({ scoreMultiplier: 1, multiplierActive: false, multiplierPosition: null });
        }
        return;
      }

      // Apply queued direction
      const dir = state.nextDirection;
      set({ direction: dir, moveTimer: 0 });

      const head = state.snakeSegments[0];
      const newHead = {
        x: head.x + dir.x,
        y: 0,
        z: head.z + dir.z,
      };

      // Wall collision — wrap or die
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.z < 0 ||
        newHead.z >= GRID_SIZE
      ) {
        set({ deathFlash: true });
        setTimeout(() => set({ deathFlash: false }), 300);
        get().loseLife();
        // Reset snake on death
        if (get().lives > 0) {
          get().resetSnake();
        }
        return;
      }

      // Self collision
      const selfHit = state.snakeSegments.some(
        (seg, i) => i > 0 && seg.x === newHead.x && seg.z === newHead.z
      );
      if (selfHit) {
        set({ deathFlash: true });
        setTimeout(() => set({ deathFlash: false }), 300);
        get().loseLife();
        if (get().lives > 0) {
          get().resetSnake();
        }
        return;
      }

      // Build new segments
      const newSegments = [newHead, ...state.snakeSegments];
      let ate = false;
      let ateMultiplier = false;

      // Food collision
      if (
        newHead.x === state.foodPosition.x &&
        newHead.z === state.foodPosition.z
      ) {
        ate = true;
        const points = (state.foodType === 'bonus' ? 30 : 10) * state.scoreMultiplier;
        get().addScore(points);
        set({
          growing: true,
          snakeLength: state.snakeLength + 1,
          eatFlash: true,
        });
        setTimeout(() => set({ eatFlash: false }), 200);
        get().spawnFood();

        // Speed up every 5 foods
        if ((state.snakeLength + 1) % 5 === 0) {
          set({ moveInterval: Math.max(0.06, state.moveInterval - 0.012) });
          get().nextLevel();
        }

        // Quiz trigger every 500 points
        const currentScore = get().score;
        if (
          Math.floor(currentScore / 500) > Math.floor(state.lastQuizScore / 500)
        ) {
          set({ lastQuizScore: currentScore });
          get().triggerQuiz(Math.random() > 0.5 ? 'math' : 'german');
        }
      }

      // Multiplier collision
      if (
        state.multiplierPosition &&
        newHead.x === state.multiplierPosition.x &&
        newHead.z === state.multiplierPosition.z
      ) {
        ateMultiplier = true;
        set({
          scoreMultiplier: 3,
          multiplierActive: true,
          multiplierTimer: 10, // 10 seconds of 3x
          multiplierPosition: null,
          eatFlash: true,
        });
        setTimeout(() => set({ eatFlash: false }), 200);
      }

      // Trim tail if not growing
      if (!ate) {
        newSegments.pop();
      }

      // Maybe spawn multiplier (5% chance per move, if none active)
      let newMultPos = state.multiplierPosition;
      if (!state.multiplierActive && !newMultPos && Math.random() < 0.05) {
        newMultPos = randomMultiplierPosition(newSegments, state.foodPosition);
      }

      set({
        snakeSegments: newSegments,
        growing: false,
        tickCount: state.tickCount + 1,
        multiplierPosition: ateMultiplier ? null : newMultPos,
        foodRotation: state.foodRotation + 0.1,
      });
    },

    spawnFood: () => {
      const state = get();
      const pos = randomFoodPosition(state.snakeSegments);
      const type = Math.random() < 0.2 ? 'bonus' : 'normal';
      set({ foodPosition: pos, foodType: type });
    },

    resetSnake: () => {
      set({
        snakeSegments: [...INITIAL_SNAKE],
        direction: { x: 1, z: 0 },
        nextDirection: { x: 1, z: 0 },
        snakeLength: 3,
        growing: false,
        moveTimer: 0,
        moveInterval: 0.18,
        multiplierPosition: null,
        multiplierActive: false,
        scoreMultiplier: 1,
        multiplierTimer: 0,
      });
      get().spawnFood();
    },

    startSnakeGame: () => {
      get().startGame();
      set({
        snakeSegments: [...INITIAL_SNAKE],
        direction: { x: 1, z: 0 },
        nextDirection: { x: 1, z: 0 },
        snakeLength: 3,
        growing: false,
        moveTimer: 0,
        moveInterval: 0.18,
        tickCount: 0,
        lastQuizScore: 0,
        multiplierPosition: null,
        multiplierActive: false,
        scoreMultiplier: 1,
        multiplierTimer: 0,
      });
      get().spawnFood();
    },
  })
);

export { GRID_SIZE, CELL_SIZE };
export default useSnakeStore;
