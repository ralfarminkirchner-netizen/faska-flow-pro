import { createGameStore } from '../../../../shared/useSwarmStore';

// Grid dimensions
const COLS = 10;
const ROWS = 20;

// Tetromino shapes — each rotation is a list of [row, col] offsets
const SHAPES = {
  I: {
    blocks: [
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 0], [1, 0], [2, 0], [3, 0]],
    ],
    color: '#06b6d4', // cyan
  },
  O: {
    blocks: [
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
    ],
    color: '#eab308', // yellow
  },
  T: {
    blocks: [
      [[0, 0], [0, 1], [0, 2], [1, 1]],
      [[0, 0], [1, 0], [2, 0], [1, 1]],
      [[1, 0], [1, 1], [1, 2], [0, 1]],
      [[0, 0], [1, 0], [2, 0], [1, -1]],
    ],
    color: '#a855f7', // purple
  },
  S: {
    blocks: [
      [[0, 1], [0, 2], [1, 0], [1, 1]],
      [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[0, 1], [0, 2], [1, 0], [1, 1]],
      [[0, 0], [1, 0], [1, 1], [2, 1]],
    ],
    color: '#22c55e', // green
  },
  Z: {
    blocks: [
      [[0, 0], [0, 1], [1, 1], [1, 2]],
      [[0, 1], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [1, 1], [1, 2]],
      [[0, 1], [1, 0], [1, 1], [2, 0]],
    ],
    color: '#ef4444', // red
  },
  L: {
    blocks: [
      [[0, 0], [0, 1], [0, 2], [1, 0]],
      [[0, 0], [1, 0], [2, 0], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [0, 2]],
      [[0, 0], [0, 1], [1, 1], [2, 1]],
    ],
    color: '#f97316', // orange
  },
  J: {
    blocks: [
      [[0, 0], [0, 1], [0, 2], [1, 2]],
      [[0, 0], [1, 0], [2, 0], [0, 1]],
      [[0, 0], [1, 0], [1, 1], [1, 2]],
      [[2, 0], [0, 1], [1, 1], [2, 1]],
    ],
    color: '#3b82f6', // blue
  },
};

const SHAPE_KEYS = Object.keys(SHAPES);

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const key = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  const shape = SHAPES[key];
  return {
    type: key,
    shape: shape.blocks,
    color: shape.color,
    x: Math.floor(COLS / 2) - 1,
    y: 0,
    rotation: 0,
  };
}

function getBlocks(piece) {
  return piece.shape[piece.rotation % piece.shape.length].map(([r, c]) => ({
    row: piece.y + r,
    col: piece.x + c,
  }));
}

function isValidPosition(grid, piece, offsetX = 0, offsetY = 0, rotation = null) {
  const rot = rotation !== null ? rotation : piece.rotation;
  const blocks = piece.shape[rot % piece.shape.length];
  for (const [r, c] of blocks) {
    const row = piece.y + r + offsetY;
    const col = piece.x + c + offsetX;
    if (row < 0) continue; // Allow blocks above the top
    if (row >= ROWS || col < 0 || col >= COLS) return false;
    if (grid[row] && grid[row][col] !== null) return false;
  }
  return true;
}

function getGhostY(grid, piece) {
  let ghostY = 0;
  while (isValidPosition(grid, { ...piece, y: piece.y + ghostY + 1 }, 0, 0)) {
    ghostY++;
  }
  return piece.y + ghostY;
}

const useBlocksStore = createGameStore(
  {
    // Grid state
    grid: createEmptyGrid(),
    currentPiece: null,
    nextPiece: null,
    ghostY: 0,

    // Stats
    linesCleared: 0,
    totalLinesCleared: 0,
    combo: 0,

    // Timing
    dropTimer: 0,
    dropInterval: 0.8, // seconds
    fastDrop: false,
    lockDelay: 0,
    lockDelayMax: 0.5,

    // Effects
    clearingLines: [], // rows being cleared (for animation)
    clearAnimTimer: 0,

    // Input tracking
    lastMoveDir: 0,
    moveRepeatTimer: 0,
    dasDelay: 0.17, // Delayed Auto Shift
    dasRepeat: 0.05,
    hasMoved: false,

    // Quiz tracking
    lastQuizScore: 0,

    // Config
    cols: COLS,
    rows: ROWS,
  },
  (set, get) => ({
    // Initialize a new game
    startBlocksGame: () => {
      get().startGame();
      const first = randomPiece();
      const next = randomPiece();
      const grid = createEmptyGrid();
      set({
        grid,
        currentPiece: first,
        nextPiece: next,
        ghostY: getGhostY(grid, first),
        linesCleared: 0,
        totalLinesCleared: 0,
        combo: 0,
        dropTimer: 0,
        dropInterval: 0.8,
        fastDrop: false,
        clearingLines: [],
        clearAnimTimer: 0,
        lastQuizScore: 0,
        lockDelay: 0,
      });
    },

    // Move piece left/right
    movePiece: (dx) => {
      const { grid, currentPiece, clearingLines } = get();
      if (!currentPiece || clearingLines.length > 0) return;
      if (isValidPosition(grid, currentPiece, dx, 0)) {
        const moved = { ...currentPiece, x: currentPiece.x + dx };
        set({
          currentPiece: moved,
          ghostY: getGhostY(grid, moved),
          lockDelay: 0, // Reset lock delay on move
        });
      }
    },

    // Rotate piece
    rotatePiece: () => {
      const { grid, currentPiece, clearingLines } = get();
      if (!currentPiece || clearingLines.length > 0) return;
      const newRot = (currentPiece.rotation + 1) % 4;

      // Try basic rotation
      if (isValidPosition(grid, currentPiece, 0, 0, newRot)) {
        const rotated = { ...currentPiece, rotation: newRot };
        set({
          currentPiece: rotated,
          ghostY: getGhostY(grid, rotated),
          lockDelay: 0,
        });
        return;
      }

      // Wall kicks: try offsets
      const kicks = [
        [1, 0], [-1, 0], [0, -1], [2, 0], [-2, 0],
      ];
      for (const [kx, ky] of kicks) {
        if (isValidPosition(grid, { ...currentPiece, x: currentPiece.x + kx, y: currentPiece.y + ky }, 0, 0, newRot)) {
          const rotated = {
            ...currentPiece,
            rotation: newRot,
            x: currentPiece.x + kx,
            y: currentPiece.y + ky,
          };
          set({
            currentPiece: rotated,
            ghostY: getGhostY(grid, rotated),
            lockDelay: 0,
          });
          return;
        }
      }
    },

    // Soft drop (speed up)
    setSoftDrop: (active) => {
      set({ fastDrop: active });
    },

    // Hard drop — instant placement
    hardDrop: () => {
      const { grid, currentPiece, clearingLines } = get();
      if (!currentPiece || clearingLines.length > 0) return;

      const ghostY = getGhostY(grid, currentPiece);
      const distance = ghostY - currentPiece.y;
      get().addScore(distance * 2); // 2 points per cell dropped

      const dropped = { ...currentPiece, y: ghostY };
      get().lockPiece(dropped);
    },

    // Lock piece into grid and check lines
    lockPiece: (piece) => {
      const state = get();
      const newGrid = state.grid.map((row) => [...row]);
      const blocks = getBlocks(piece || state.currentPiece);

      // Place blocks
      for (const { row, col } of blocks) {
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
          newGrid[row][col] = (piece || state.currentPiece).color;
        }
      }

      // Check for game over (any block above row 0)
      for (const { row } of blocks) {
        if (row <= 0) {
          set({ grid: newGrid, currentPiece: null });
          get().gameOver();
          return;
        }
      }

      // Find completed lines
      const completedLines = [];
      for (let r = 0; r < ROWS; r++) {
        if (newGrid[r].every((cell) => cell !== null)) {
          completedLines.push(r);
        }
      }

      if (completedLines.length > 0) {
        // Start line clear animation
        set({
          grid: newGrid,
          currentPiece: null,
          clearingLines: completedLines,
          clearAnimTimer: 0.4, // 400ms animation
        });
      } else {
        // Spawn next piece immediately
        get().spawnNextPiece(newGrid, 0);
      }
    },

    // Process line clear animation completion
    finishLineClear: () => {
      const state = get();
      const newGrid = state.grid.map((row) => [...row]);
      const lines = state.clearingLines;

      // Remove completed lines
      const filtered = newGrid.filter((_, i) => !lines.includes(i));
      // Add empty rows at top
      while (filtered.length < ROWS) {
        filtered.unshift(Array(COLS).fill(null));
      }

      // Scoring: 100, 300, 500, 800 for 1-4 lines
      const lineScores = [0, 100, 300, 500, 800];
      const points = (lineScores[lines.length] || 0) * state.level;
      get().addScore(points);

      const newTotal = state.totalLinesCleared + lines.length;

      // Level up every 10 lines
      if (Math.floor(newTotal / 10) > Math.floor(state.totalLinesCleared / 10)) {
        get().nextLevel();
        set({ dropInterval: Math.max(0.1, state.dropInterval - 0.07) });
      }

      // Quiz trigger every 500 points
      const currentScore = get().score;
      if (
        Math.floor(currentScore / 500) > Math.floor(state.lastQuizScore / 500)
      ) {
        set({ lastQuizScore: currentScore });
        get().triggerQuiz(Math.random() > 0.5 ? 'math' : 'german');
      }

      get().spawnNextPiece(filtered, lines.length);
    },

    // Spawn next piece
    spawnNextPiece: (grid, linesJustCleared) => {
      const state = get();
      const next = state.nextPiece || randomPiece();
      const upcoming = randomPiece();

      // Check if next piece can be placed
      if (!isValidPosition(grid, next)) {
        set({ grid, currentPiece: null, clearingLines: [] });
        get().gameOver();
        return;
      }

      set({
        grid,
        currentPiece: next,
        nextPiece: upcoming,
        ghostY: getGhostY(grid, next),
        clearingLines: [],
        clearAnimTimer: 0,
        totalLinesCleared: state.totalLinesCleared + linesJustCleared,
        combo: linesJustCleared > 0 ? state.combo + 1 : 0,
        dropTimer: 0,
        lockDelay: 0,
      });
    },

    // Main game tick
    tick: (delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.quizActive) return;

      // Handle line clear animation
      if (state.clearingLines.length > 0) {
        const newTimer = state.clearAnimTimer - delta;
        if (newTimer <= 0) {
          get().finishLineClear();
        } else {
          set({ clearAnimTimer: newTimer });
        }
        return;
      }

      if (!state.currentPiece) return;

      // Handle horizontal movement repeat (DAS)
      const inputDx = state.input.dx;
      if (Math.abs(inputDx) > 0.3) {
        const dir = inputDx > 0 ? 1 : -1;
        if (dir !== state.lastMoveDir) {
          get().movePiece(dir);
          set({ lastMoveDir: dir, moveRepeatTimer: 0, hasMoved: true });
        } else {
          const newRepeat = state.moveRepeatTimer + delta;
          if (!state.hasMoved) {
            get().movePiece(dir);
            set({ hasMoved: true, moveRepeatTimer: 0 });
          } else if (newRepeat > state.dasDelay) {
            get().movePiece(dir);
            set({ moveRepeatTimer: state.dasDelay - state.dasRepeat });
          } else {
            set({ moveRepeatTimer: newRepeat });
          }
        }
      } else {
        set({ lastMoveDir: 0, moveRepeatTimer: 0, hasMoved: false });
      }

      // Drop timing
      const interval = state.fastDrop
        ? Math.min(state.dropInterval, 0.05)
        : state.dropInterval;
      const newDropTimer = state.dropTimer + delta;

      if (newDropTimer >= interval) {
        // Try to move down
        if (isValidPosition(state.grid, state.currentPiece, 0, 1)) {
          const moved = { ...state.currentPiece, y: state.currentPiece.y + 1 };
          if (state.fastDrop) get().addScore(1);
          set({
            currentPiece: moved,
            dropTimer: 0,
            lockDelay: 0,
          });
        } else {
          // Piece can't move down — lock delay
          const newLock = state.lockDelay + delta;
          if (newLock >= state.lockDelayMax) {
            get().lockPiece(state.currentPiece);
          } else {
            set({ lockDelay: newLock, dropTimer: 0 });
          }
        }
      } else {
        // Check if piece is resting and accumulate lock delay
        if (!isValidPosition(state.grid, state.currentPiece, 0, 1)) {
          const newLock = state.lockDelay + delta;
          if (newLock >= state.lockDelayMax) {
            get().lockPiece(state.currentPiece);
          } else {
            set({ dropTimer: newDropTimer, lockDelay: newLock });
          }
        } else {
          set({ dropTimer: newDropTimer });
        }
      }
    },
  })
);

export { COLS, ROWS, SHAPES, getBlocks, getGhostY };
export default useBlocksStore;
