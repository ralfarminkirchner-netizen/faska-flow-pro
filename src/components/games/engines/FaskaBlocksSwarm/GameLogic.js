import { create } from 'zustand';

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[1, 1], [1, 1]], // O
  [[0, 1, 1], [1, 1, 0]], // S
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]]  // Z
];

const COLORS = [
  '#00FFFF', '#0000FF', '#FFA500', '#FFFF00', '#00FF00', '#800080', '#FF0000'
];

const COLS = 10;
const ROWS = 20;

export const useGameStore = create((set, get) => ({
  grid: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
  currentPiece: null,
  score: 0,
  gameOver: false,
  isResolving: false,
  isPlaying: false,

  startGame: () => {
    set({
      grid: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
      score: 0,
      gameOver: false,
      isResolving: false,
      isPlaying: true
    });
    get().spawnPiece();
  },

  exitGame: () => {
    set({ isPlaying: false, gameOver: false, currentPiece: null });
  },

  spawnPiece: () => {
    const typeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[typeIndex];
    const color = COLORS[typeIndex];
    const values = shape.map(row => row.map(cell => cell ? Math.floor(Math.random() * 9) + 1 : 0));
    
    const newPiece = {
      shape,
      values,
      color,
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0
    };

    if (!get().isValid(newPiece.x, newPiece.y, newPiece.shape)) {
      set({ gameOver: true, isPlaying: false });
    } else {
      set({ currentPiece: newPiece });
    }
  },

  isValid: (px, py, shape) => {
    const { grid } = get();
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          let nx = px + c;
          let ny = py + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
          if (ny >= 0 && grid[ny][nx]) return false;
        }
      }
    }
    return true;
  },

  movePiece: (dx, dy) => {
    const { currentPiece, gameOver, isResolving, isValid } = get();
    if (gameOver || !currentPiece || isResolving) return false;
    
    if (isValid(currentPiece.x + dx, currentPiece.y + dy, currentPiece.shape)) {
      set(state => ({
        currentPiece: {
          ...state.currentPiece,
          x: state.currentPiece.x + dx,
          y: state.currentPiece.y + dy
        }
      }));
      return true;
    }
    return false;
  },

  rotatePiece: () => {
    const { currentPiece, gameOver, isResolving, isValid } = get();
    if (gameOver || !currentPiece || isResolving) return;

    const { shape, values } = currentPiece;
    const newShape = [];
    const newValues = [];
    const rows = shape.length;
    const cols = shape[0].length;
    
    for (let c = 0; c < cols; c++) {
      newShape[c] = [];
      newValues[c] = [];
      for (let r = 0; r < rows; r++) {
        newShape[c][rows - 1 - r] = shape[r][c];
        newValues[c][rows - 1 - r] = values[r][c];
      }
    }
    
    if (isValid(currentPiece.x, currentPiece.y, newShape)) {
      set(state => ({
        currentPiece: {
          ...state.currentPiece,
          shape: newShape,
          values: newValues
        }
      }));
    }
  },

  hardDrop: () => {
    const { gameOver, isResolving } = get();
    if (gameOver || isResolving) return;
    
    while (get().movePiece(0, 1)) {
      // Loop until it can't move down
    }
    get().settlePiece();
  },

  settlePiece: () => {
    const { currentPiece, grid, resolveBoard } = get();
    if (!currentPiece) return;

    const newGrid = grid.map(row => [...row]);
    const { x, y, shape, values, color } = currentPiece;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          let gx = x + c;
          let gy = y + r;
          if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
            newGrid[gy][gx] = { value: values[r][c], color };
          }
        }
      }
    }

    set({ grid: newGrid, currentPiece: null });
    resolveBoard();
  },

  resolveBoard: () => {
    set({ isResolving: true });
    const { grid } = get();
    let toDestroy = new Set();
    
    // Horizontal check
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!grid[y][x]) continue;
        let sum = 0;
        let seq = [];
        for (let i = x; i < COLS; i++) {
          if (!grid[y][i]) break;
          sum += grid[y][i].value;
          seq.push({ y, x: i });
          if (sum === 10) {
            seq.forEach(pos => toDestroy.add(`${pos.y},${pos.x}`));
            break;
          } else if (sum > 10) {
            break;
          }
        }
      }
    }
    
    // Vertical check
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (!grid[y][x]) continue;
        let sum = 0;
        let seq = [];
        for (let i = y; i < ROWS; i++) {
          if (!grid[i][x]) break;
          sum += grid[i][x].value;
          seq.push({ y: i, x });
          if (sum === 10) {
            seq.forEach(pos => toDestroy.add(`${pos.y},${pos.x}`));
            break;
          } else if (sum > 10) {
            break;
          }
        }
      }
    }
    
    if (toDestroy.size > 0) {
      const newGrid = grid.map(row => [...row]);
      toDestroy.forEach(posStr => {
        let [y, x] = posStr.split(',').map(Number);
        newGrid[y][x] = null;
      });

      set(state => ({
        score: state.score + toDestroy.size * 10,
        grid: newGrid
      }));

      // Schedule gravity
      setTimeout(() => {
        get().applyGravity();
      }, 300);
    } else {
      set({ isResolving: false });
      get().spawnPiece();
    }
  },

  applyGravity: () => {
    const { grid, resolveBoard } = get();
    const newGrid = grid.map(row => [...row]);
    let moved = false;

    for (let x = 0; x < COLS; x++) {
      for (let y = ROWS - 2; y >= 0; y--) {
        if (newGrid[y][x] && !newGrid[y+1][x]) {
          let dropY = y;
          while (dropY < ROWS - 1 && !newGrid[dropY+1][x]) {
            dropY++;
          }
          newGrid[dropY][x] = newGrid[y][x];
          newGrid[y][x] = null;
          moved = true;
        }
      }
    }

    set({ grid: newGrid });

    if (moved) {
      setTimeout(() => {
        resolveBoard();
      }, 300);
    } else {
      resolveBoard();
    }
  },
  
  tick: () => {
    if (!get().movePiece(0, 1)) {
      get().settlePiece();
    }
  }
}));
