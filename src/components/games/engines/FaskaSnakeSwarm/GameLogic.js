import { create } from 'zustand';

const WORDS = ['HUND', 'KATZE', 'MAUS', 'BAUM', 'AUTO', 'SONNE', 'MOND', 'STERN', 'APFEL', 'VOGEL', 'FISCH'];

export const useGameStore = create((set, get) => ({
  snake: [{ x: 0, z: 0 }, { x: -1, z: 0 }, { x: -2, z: 0 }],
  dir: { x: 1, z: 0 },
  nextDir: { x: 1, z: 0 },
  letters: [],
  targetWord: WORDS[0],
  targetIndex: 0,
  wordCount: 1,
  gameOver: false,
  moveDelay: 150,
  score: 0,
  isPaused: false,

  initGame: () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    set({
      snake: [{ x: 0, z: 0 }, { x: -1, z: 0 }, { x: -2, z: 0 }],
      dir: { x: 1, z: 0 },
      nextDir: { x: 1, z: 0 },
      targetWord: word,
      targetIndex: 0,
      wordCount: 1,
      gameOver: false,
      moveDelay: 200,
      score: 0,
      isPaused: false,
    });
    get().spawnLetters();
  },

  setDir: (x, z) => {
    const { dir } = get();
    // prevent reversing into oneself
    if (dir.x !== 0 && x === -dir.x) return;
    if (dir.z !== 0 && z === -dir.z) return;
    set({ nextDir: { x, z } });
  },

  setPaused: (p) => set({ isPaused: p }),

  spawnLetters: () => {
    const { snake, targetWord, targetIndex } = get();
    const letters = [];
    const getFreePos = () => {
      let x, z;
      while (true) {
        x = Math.floor(Math.random() * 20) - 10;
        z = Math.floor(Math.random() * 20) - 10;
        let ok = true;
        for (let s of snake) {
          if (s.x === x && s.z === z) ok = false;
        }
        for (let l of letters) {
          if (l.x === x && l.z === z) ok = false;
        }
        if (ok) return { x, z };
      }
    };

    const targetChar = targetWord[targetIndex];
    if (targetChar) {
      const p = getFreePos();
      letters.push({ x: p.x, z: p.z, char: targetChar, isTarget: true, id: Date.now() });

      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < 4; i++) {
        const rp = getFreePos();
        let randomChar = alphabet[Math.floor(Math.random() * 26)];
        while (randomChar === targetChar) {
          randomChar = alphabet[Math.floor(Math.random() * 26)];
        }
        letters.push({ x: rp.x, z: rp.z, char: randomChar, isTarget: false, id: Date.now() + i + 1 });
      }
    }
    set({ letters });
  },

  tick: () => {
    const state = get();
    if (state.gameOver || state.isPaused) return;

    const { snake, nextDir, letters, targetWord, targetIndex, wordCount, moveDelay } = state;
    const dir = { ...nextDir };
    
    const head = snake[0];
    const nx = head.x + dir.x;
    const nz = head.z + dir.z;

    // Bounds check
    if (nx < -15 || nx > 15 || nz < -15 || nz > 15) {
      set({ gameOver: true });
      return;
    }

    // Self check
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === nx && snake[i].z === nz) {
        set({ gameOver: true });
        return;
      }
    }

    const newHead = { x: nx, z: nz };
    const newSnake = [newHead, ...snake];

    let ate = false;
    let newLetters = [...letters];
    let newTargetIndex = targetIndex;
    let newTargetWord = targetWord;
    let newWordCount = wordCount;
    let newMoveDelay = moveDelay;
    let newScore = state.score;

    const hitIdx = newLetters.findIndex(l => l.x === nx && l.z === nz);
    if (hitIdx !== -1) {
      const hitLetter = newLetters[hitIdx];
      newLetters.splice(hitIdx, 1);
      ate = true;

      if (hitLetter.isTarget) {
        newScore += 10;
        newTargetIndex++;
        if (newTargetIndex >= targetWord.length) {
          newWordCount++;
          newTargetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
          newTargetIndex = 0;
          newMoveDelay = Math.max(80, moveDelay - 10);
          newScore += 50; 
        }
      } else {
        newScore -= 5;
        newSnake.pop(); // normal move
        if (newSnake.length > 2) {
          newSnake.pop(); // penalty
        } else {
          set({ gameOver: true, score: newScore });
          return;
        }
      }
    } else {
      newSnake.pop(); // normal move
    }

    set({ 
      snake: newSnake, 
      dir, 
      letters: newLetters,
      targetIndex: newTargetIndex,
      targetWord: newTargetWord,
      wordCount: newWordCount,
      moveDelay: newMoveDelay,
      score: newScore
    });

    if (ate) {
      get().spawnLetters();
    }
  }
}));
