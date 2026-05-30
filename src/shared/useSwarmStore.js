import { create } from 'zustand';

/**
 * Creates a Zustand game store with the standard FASKA Flow state shape.
 * Each game extends this with game-specific state.
 */
export function createGameStore(gameSpecificState = {}, gameSpecificActions = () => ({})) {
  return create((set, get) => ({
    // === Core Game State ===
    score: 0,
    highScore: 0,
    lives: 3,
    level: 1,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    speed: 1,

    // === Input State ===
    input: { dx: 0, dy: 0 },
    actions: { A: false, B: false, X: false, Y: false },

    // === Learncade State ===
    quizActive: false,
    quizQuestion: null,
    quizScore: 0,
    quizStreak: 0,

    // === Math Questions Pool ===
    mathQuestions: generateMathQuestions(),
    germanQuestions: generateGermanQuestions(),

    // === Core Actions ===
    setInput: (dx, dy) => set({ input: { dx, dy } }),
    setAction: (name, pressed) =>
      set((state) => ({
        actions: { ...state.actions, [name]: pressed },
      })),

    addScore: (points) =>
      set((state) => {
        const newScore = state.score + points;
        return {
          score: newScore,
          highScore: Math.max(newScore, state.highScore),
        };
      }),

    loseLife: () =>
      set((state) => {
        const newLives = state.lives - 1;
        return {
          lives: newLives,
          isGameOver: newLives <= 0,
          isPlaying: newLives > 0,
        };
      }),

    startGame: () =>
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        level: 1,
        speed: 1,
        quizActive: false,
        quizScore: 0,
        quizStreak: 0,
      }),

    pauseGame: () => set((state) => ({ isPaused: !state.isPaused })),

    gameOver: () => set({ isPlaying: false, isGameOver: true }),

    nextLevel: () =>
      set((state) => ({
        level: state.level + 1,
        speed: state.speed + 0.15,
      })),

    // === Learncade Actions ===
    triggerQuiz: (type = 'math') => {
      const state = get();
      const pool = type === 'math' ? state.mathQuestions : state.germanQuestions;
      const q = pool[Math.floor(Math.random() * pool.length)];
      set({ quizActive: true, quizQuestion: { ...q, type } });
    },

    answerQuiz: (answer) => {
      const state = get();
      if (!state.quizQuestion) return false;
      const correct = answer === state.quizQuestion.answer;
      set({
        quizActive: false,
        quizQuestion: null,
        quizScore: state.quizScore + (correct ? 1 : 0),
        quizStreak: correct ? state.quizStreak + 1 : 0,
        score: correct ? state.score + 50 * (state.quizStreak + 1) : state.score,
      });
      return correct;
    },

    // === Game-Specific Overrides ===
    ...gameSpecificState,
    ...gameSpecificActions(set, get),
  }));
}

function generateMathQuestions() {
  const questions = [];
  for (let i = 0; i < 50; i++) {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const ops = [
      { q: `${a} + ${b}`, answer: `${a + b}` },
      { q: `${a + b} - ${a}`, answer: `${b}` },
      { q: `${a} × ${b}`, answer: `${a * b}` },
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const wrong1 = `${parseInt(op.answer) + Math.floor(Math.random() * 5) + 1}`;
    const wrong2 = `${Math.max(0, parseInt(op.answer) - Math.floor(Math.random() * 5) - 1)}`;
    const options = [op.answer, wrong1, wrong2].sort(() => Math.random() - 0.5);
    questions.push({ question: op.q, answer: op.answer, options });
  }
  return questions;
}

function generateGermanQuestions() {
  const vocab = [
    { de: 'der Hund', en: 'the dog', options: ['the dog', 'the cat', 'the bird'] },
    { de: 'die Katze', en: 'the cat', options: ['the cat', 'the dog', 'the fish'] },
    { de: 'der Apfel', en: 'the apple', options: ['the apple', 'the banana', 'the cherry'] },
    { de: 'die Sonne', en: 'the sun', options: ['the sun', 'the moon', 'the star'] },
    { de: 'der Baum', en: 'the tree', options: ['the tree', 'the flower', 'the grass'] },
    { de: 'das Haus', en: 'the house', options: ['the house', 'the school', 'the shop'] },
    { de: 'die Blume', en: 'the flower', options: ['the flower', 'the tree', 'the leaf'] },
    { de: 'der Stern', en: 'the star', options: ['the star', 'the cloud', 'the moon'] },
    { de: 'das Buch', en: 'the book', options: ['the book', 'the pen', 'the paper'] },
    { de: 'der Fisch', en: 'the fish', options: ['the fish', 'the whale', 'the shark'] },
    { de: 'die Milch', en: 'the milk', options: ['the milk', 'the water', 'the juice'] },
    { de: 'der Vogel', en: 'the bird', options: ['the bird', 'the bee', 'the ant'] },
    { de: 'das Auto', en: 'the car', options: ['the car', 'the bus', 'the train'] },
    { de: 'die Schule', en: 'the school', options: ['the school', 'the house', 'the church'] },
    { de: 'der Ball', en: 'the ball', options: ['the ball', 'the toy', 'the game'] },
    { de: 'rot', en: 'red', options: ['red', 'blue', 'green'] },
    { de: 'blau', en: 'blue', options: ['blue', 'yellow', 'red'] },
    { de: 'grün', en: 'green', options: ['green', 'black', 'white'] },
    { de: 'groß', en: 'big', options: ['big', 'small', 'tall'] },
    { de: 'klein', en: 'small', options: ['small', 'big', 'thin'] },
  ];
  return vocab.map(v => ({
    question: `Was bedeutet "${v.de}"?`,
    answer: v.en,
    options: v.options.sort(() => Math.random() - 0.5),
  }));
}

export default createGameStore;
