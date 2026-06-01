import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaSixtyFour Game Store — Rebuilt for performance.
 * Clean 3D platformer: score, coins, lives, combo, double jump, ground pound.
 */

const PLATFORM_COLORS = [
  '#a855f7', '#06b6d4', '#ec4899', '#22c55e', '#f97316',
  '#8b5cf6', '#14b8a6', '#f472b6', '#38bdf8', '#fbbf24',
];

export const FASKA64_RED_COINS = [
  { id: 'red-ground', pos: [-5.5, 1.35, -4.8] },
  { id: 'red-ring-a', pos: [12, 4.1, 0] },
  { id: 'red-ring-b', pos: [-12.5, 6.2, 8.5] },
  { id: 'red-tower-a', pos: [10.3, 7.1, -9.2] },
  { id: 'red-tower-b', pos: [13.4, 12.2, -10.5] },
  { id: 'red-island', pos: [-10, 11, -10] },
  { id: 'red-sky-a', pos: [-1.8, 15.9, 1.8] },
  { id: 'red-sky-b', pos: [2.2, 15.9, -1.8] },
];

export const FASKA64_LAUNCH_PADS = [
  { id: 'hub-pad', pos: [4.5, 0.12, 4.5], impulse: 19, label: 'A' },
  { id: 'tower-pad', pos: [8, 3.45, -8], impulse: 22, label: 'B' },
  { id: 'island-pad', pos: [-14, 5.55, 10], impulse: 18, label: 'C' },
];

export const FASKA64_STUNT_RINGS = [
  { id: 'ring-bridge', pos: [7.2, 5.9, -2.4], radius: 1.6, label: 'FLOW' },
  { id: 'ring-tower', pos: [12.4, 10.2, -9.5], radius: 1.55, label: 'DASH' },
  { id: 'ring-sky', pos: [0, 17.5, 0], radius: 2.2, label: 'STAR' },
  { id: 'ring-back', pos: [-8.5, 8.2, 8.4], radius: 1.65, label: 'LEARN' },
];

export const FASKA64_ENEMIES = [
  { id: 'goomba-hub', pos: [5.5, 0.55, -4.5], color: '#ef4444', label: 'G1' },
  { id: 'goomba-island', pos: [-13.3, 5.75, 10.4], color: '#f97316', label: 'G2' },
  { id: 'goomba-tower', pos: [13.8, 9.55, -10.6], color: '#8b5cf6', label: 'G3' },
  { id: 'goomba-sky', pos: [0, 14.65, 0], color: '#06b6d4', label: 'G4' },
];

const FASKA64_MISSIONS = [
  { id: 'coins-20', label: '20 Muenzen', type: 'coins', target: 20, reward: 500 },
  { id: 'red-8', label: '8 rote Muenzen', type: 'redCoins', target: 8, reward: 900 },
  { id: 'rings-4', label: '4 Stunt-Ringe', type: 'rings', target: 4, reward: 700 },
  { id: 'enemies-4', label: '4 Gegner stompen', type: 'enemies', target: 4, reward: 650 },
  { id: 'launches-3', label: '3 Launch-Pads', type: 'launches', target: 3, reward: 420 },
  { id: 'quiz-3', label: '3 Learncade-Antworten', type: 'quizCorrect', target: 3, reward: 650, mode: 'learn' },
];

// Deterministic pseudo-random — no Math.random at init
function seeded(index, salt = 0) {
  const v = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

// Static platform data — computed once
function generatePlatforms() {
  const platforms = [];

  // Ground hub
  platforms.push({
    id: 'ground', pos: [0, -0.5, 0], size: [16, 1, 16],
    color: '#22c55e', type: 'static', isGround: true,
  });

  // Ring of platforms around hub
  const ringCount = 8;
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2;
    const r = 12 + seeded(i, 1) * 5;
    const h = 1.5 + seeded(i, 2) * 5;
    platforms.push({
      id: `ring_${i}`,
      pos: [Math.cos(angle) * r, h, Math.sin(angle) * r],
      size: [3 + seeded(i, 3) * 1.5, 0.7, 3 + seeded(i, 4) * 1.5],
      color: PLATFORM_COLORS[i % PLATFORM_COLORS.length],
      type: i % 3 === 0 ? 'bobbing' : 'static',
      bobSpeed: 0.6 + seeded(i, 5) * 0.5,
      bobRange: 1.2,
    });
  }

  // Ascending tower
  for (let i = 0; i < 6; i++) {
    platforms.push({
      id: `tower_${i}`,
      pos: [8 + i * 1.2, 3 + i * 2.8, -8 - i * 0.5],
      size: [2.2, 0.6, 2.2],
      color: `hsl(${210 + i * 25}, 75%, 58%)`,
      type: i % 2 === 0 ? 'static' : 'bobbing',
      bobSpeed: 0.5,
      bobRange: 1.0,
    });
  }

  // Floating islands
  platforms.push(
    { id: 'island_a', pos: [-14, 5, 10], size: [5, 1, 5], color: '#a78bfa', type: 'static' },
    { id: 'island_b', pos: [14, 7, -14], size: [4, 0.8, 4], color: '#f472b6', type: 'static' },
    { id: 'island_c', pos: [-10, 9, -10], size: [3.5, 0.8, 3.5], color: '#fbbf24', type: 'bobbing', bobSpeed: 0.8, bobRange: 1.5 },
    { id: 'sky', pos: [0, 14, 0], size: [6, 1, 6], color: '#34d399', type: 'static' },
  );

  return platforms;
}

// Static coin positions — max 50 for InstancedMesh
function generateCoins(platforms) {
  const coins = [];
  let id = 0;

  for (const p of platforms) {
    if (id >= 50) break;
    if (p.isGround) {
      for (let i = 0; i < 6 && id < 50; i++) {
        const ox = (seeded(id, 10) - 0.5) * (p.size[0] - 2);
        const oz = (seeded(id, 11) - 0.5) * (p.size[2] - 2);
        coins.push({
          id: id++,
          pos: [p.pos[0] + ox, p.pos[1] + p.size[1] / 2 + 1.2, p.pos[2] + oz],
          collected: false,
        });
      }
    } else {
      if (id >= 50) break;
      coins.push({
        id: id++,
        pos: [p.pos[0], p.pos[1] + p.size[1] / 2 + 1.2, p.pos[2]],
        collected: false,
      });
    }
  }

  // Trail coins in the air
  const trails = [
    [5, 3, 0], [7, 4, -2], [9, 5, -4],
    [-5, 3.5, 5], [-7, 4.5, 7],
    [0, 8, -5], [0, 10, -3], [0, 12, 0],
  ];
  for (const pos of trails) {
    if (id >= 50) break;
    coins.push({ id: id++, pos, collected: false });
  }

  return coins;
}

const INITIAL_PLATFORMS = generatePlatforms();
const INITIAL_COINS = generateCoins(INITIAL_PLATFORMS);
const createMissionStats = () => ({
  coins: 0,
  redCoins: 0,
  rings: 0,
  enemies: 0,
  launches: 0,
  quizCorrect: 0,
});

const createMissions = (mode) => FASKA64_MISSIONS
  .filter((mission) => !mission.mode || mission.mode === mode)
  .map((mission) => ({ ...mission, progress: 0, done: false }));

const useFaskaSixtyFourStore = createGameStore(
  {
    mode: 'arcade',

    // Player state
    playerPosition: [0, 2, 0],
    isGrounded: true,
    isJumping: false,
    doubleJumpAvailable: true,
    groundPounding: false,
    dashCooldown: 0,
    spinTimer: 0,
    enemyContactCooldown: 0,
    cameraYaw: 0,
    cameraPitch: 0,

    // Coins & combo
    coins: INITIAL_COINS,
    coinsCollected: 0,
    totalCoins: INITIAL_COINS.length,
    comboMultiplier: 1,
    comboTimer: 0,
    redCoins: FASKA64_RED_COINS.map((coin) => ({ ...coin, collected: false })),
    stuntRings: FASKA64_STUNT_RINGS.map((ring) => ({ ...ring, passed: false })),
    enemies: FASKA64_ENEMIES.map((enemy) => ({ ...enemy, defeated: false })),
    launchesHit: [],
    missionStats: createMissionStats(),
    missions: createMissions('arcade'),
    missionNotice: '',
    missionNoticeTimer: 0,

    // Platforms
    platforms: INITIAL_PLATFORMS,

    // Damage flash for post-processing
    damageFlash: 0,

    // Quiz tracking
    lastQuizScore: 0,
  },
  (set, get) => ({
    recordMissionStat: (type, amount = 1) => {
      set((state) => {
        const missionStats = {
          ...state.missionStats,
          [type]: (state.missionStats?.[type] ?? 0) + amount,
        };
        let reward = 0;
        let missionNotice = state.missionNotice;
        let missionNoticeTimer = state.missionNoticeTimer;
        const missions = (state.missions ?? []).map((mission) => {
          const progress = Math.min(mission.target, missionStats[mission.type] ?? 0);
          if (!mission.done && progress >= mission.target) {
            reward += mission.reward;
            missionNotice = `${mission.label} +${mission.reward}`;
            missionNoticeTimer = 2.6;
            return { ...mission, progress, done: true };
          }
          return { ...mission, progress };
        });
        const nextScore = state.score + reward;
        return {
          missionStats,
          missions,
          score: nextScore,
          highScore: Math.max(state.highScore, nextScore),
          missionNotice,
          missionNoticeTimer,
        };
      });
    },

    showMissionNotice: (missionNotice, missionNoticeTimer = 1.2) => {
      set({ missionNotice, missionNoticeTimer });
    },

    // === Coin Collection ===
    collectCoin: (coinIndex) => {
      const state = get();
      if (coinIndex < 0 || coinIndex >= state.coins.length) return;
      if (state.coins[coinIndex].collected) return;

      const newCoins = [...state.coins];
      newCoins[coinIndex] = { ...newCoins[coinIndex], collected: true };

      // Combo logic: if collecting within 2s window, boost multiplier
      const now = performance.now();
      const isCombo = (now - state.comboTimer) < 2000;
      const newMultiplier = isCombo ? Math.min(state.comboMultiplier + 1, 5) : 1;
      const points = 100 * newMultiplier;
      const newScore = state.score + points;

      set({
        coins: newCoins,
        coinsCollected: state.coinsCollected + 1,
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
        comboMultiplier: newMultiplier,
        comboTimer: now,
      });
      get().recordMissionStat('coins');

      // Quiz trigger every 500 points
      if (state.mode === 'learn' && Math.floor(newScore / 500) > Math.floor(state.lastQuizScore / 500)) {
        set({ lastQuizScore: newScore });
        const s = get();
        if (s.isPlaying && !s.isPaused && !s.quizActive) {
          s.triggerQuiz('german');
        }
      }
    },

    setPlayerPosition: (pos) => set({ playerPosition: pos }),

    collectRedCoin: (coinIndex) => {
      const state = get();
      if (coinIndex < 0 || coinIndex >= state.redCoins.length) return false;
      if (state.redCoins[coinIndex].collected) return false;
      const redCoins = [...state.redCoins];
      redCoins[coinIndex] = { ...redCoins[coinIndex], collected: true };
      const nextScore = state.score + 250 + state.coinsCollected * 3;
      set({
        redCoins,
        score: nextScore,
        highScore: Math.max(state.highScore, nextScore),
        comboMultiplier: Math.min(5, state.comboMultiplier + 1),
        comboTimer: performance.now(),
        missionNotice: `Rote Muenze ${redCoins.filter((coin) => coin.collected).length}/8`,
        missionNoticeTimer: 1.4,
      });
      get().recordMissionStat('redCoins');
      if (state.mode === 'learn' && !state.quizActive && redCoins.filter((coin) => coin.collected).length % 2 === 0) {
        get().triggerQuiz('german');
      }
      return true;
    },

    passStuntRing: (ringIndex) => {
      const state = get();
      if (ringIndex < 0 || ringIndex >= state.stuntRings.length) return false;
      if (state.stuntRings[ringIndex].passed) return false;
      const stuntRings = [...state.stuntRings];
      stuntRings[ringIndex] = { ...stuntRings[ringIndex], passed: true };
      const nextScore = state.score + 320;
      set({
        stuntRings,
        score: nextScore,
        highScore: Math.max(state.highScore, nextScore),
        missionNotice: `${state.stuntRings[ringIndex].label}-Ring!`,
        missionNoticeTimer: 1.25,
      });
      get().recordMissionStat('rings');
      return true;
    },

    defeatEnemy: (enemyIndex) => {
      const state = get();
      if (enemyIndex < 0 || enemyIndex >= state.enemies.length) return false;
      if (state.enemies[enemyIndex].defeated) return false;
      const enemies = [...state.enemies];
      enemies[enemyIndex] = { ...enemies[enemyIndex], defeated: true };
      const nextScore = state.score + 360;
      set({
        enemies,
        score: nextScore,
        highScore: Math.max(state.highScore, nextScore),
        missionNotice: `${state.enemies[enemyIndex].label} gestompt`,
        missionNoticeTimer: 1.2,
      });
      get().recordMissionStat('enemies');
      return true;
    },

    hitLaunchPad: (padId) => {
      const state = get();
      if (state.launchesHit.includes(padId)) return;
      const launchesHit = [...state.launchesHit, padId];
      const nextScore = state.score + 120;
      set({
        launchesHit,
        score: nextScore,
        highScore: Math.max(state.highScore, nextScore),
        missionNotice: 'Launch-Pad!',
        missionNoticeTimer: 0.9,
      });
      get().recordMissionStat('launches');
    },

    useDash: () => {
      const state = get();
      if (state.dashCooldown > 0 || state.isPaused || state.quizActive || !state.isPlaying) return false;
      set({
        dashCooldown: 1.1,
        spinTimer: 0.34,
        missionNotice: 'Dash-Spin',
        missionNoticeTimer: 0.65,
      });
      return true;
    },

    tickWorldTimers: (dt) => {
      const state = get();
      set({
        dashCooldown: Math.max(0, state.dashCooldown - dt),
        spinTimer: Math.max(0, state.spinTimer - dt),
        enemyContactCooldown: Math.max(0, state.enemyContactCooldown - dt),
        missionNoticeTimer: Math.max(0, state.missionNoticeTimer - dt),
      });
    },

    // === Jump System ===
    jump: () => {
      const state = get();
      if (state.isGrounded) {
        set({ isJumping: true, isGrounded: false, doubleJumpAvailable: true, groundPounding: false });
        return 'jump';
      }
      return null;
    },

    doubleJump: () => {
      const state = get();
      if (!state.isGrounded && state.doubleJumpAvailable) {
        set({ doubleJumpAvailable: false, groundPounding: false });
        return 'doubleJump';
      }
      return null;
    },

    groundPound: () => {
      const state = get();
      if (!state.isGrounded && !state.groundPounding) {
        set({ groundPounding: true });
        return 'groundPound';
      }
      return null;
    },

    land: () => set({
      isGrounded: true, isJumping: false,
      doubleJumpAvailable: true, groundPounding: false,
    }),

    // === Lives ===
    loseLife: () => {
      const state = get();
      const newLives = state.lives - 1;
      set({
        lives: newLives,
        isGameOver: newLives <= 0,
        isPlaying: newLives > 0,
        damageFlash: 1,
        enemyContactCooldown: 1.4,
        missionNotice: newLives <= 0 ? 'Game Over' : 'Treffer!',
        missionNoticeTimer: 1.2,
      });
      // Decay damage flash
      setTimeout(() => set({ damageFlash: 0 }), 300);
    },

    answerQuiz: (answer) => {
      const state = get();
      if (!state.quizQuestion) return false;
      const correct = answer === state.quizQuestion.answer;
      const nextStreak = correct ? state.quizStreak + 1 : 0;
      const nextScore = correct ? state.score + 100 * nextStreak : state.score;
      set({
        quizActive: false,
        quizQuestion: null,
        quizScore: state.quizScore + (correct ? 1 : 0),
        quizStreak: nextStreak,
        score: nextScore,
        highScore: Math.max(state.highScore, nextScore),
        missionNotice: correct ? `Learncade x${nextStreak}` : 'Weiterfahren',
        missionNoticeTimer: correct ? 1.1 : 0.7,
      });
      if (correct) get().recordMissionStat('quizCorrect');
      return correct;
    },

    respawn: () => {
      set({ playerPosition: [0, 3, 0] });
    },

    adjustCameraLook: (dx, dy) => {
      set((state) => ({
        cameraYaw: state.cameraYaw - dx * 0.008,
        cameraPitch: Math.max(-0.6, Math.min(0.55, state.cameraPitch + dy * 0.006)),
      }));
    },

    // === Game Lifecycle ===
    startGame: (mode = get().mode || 'arcade') => {
      const freshCoins = generateCoins(INITIAL_PLATFORMS);
      set({
        mode,
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
        playerPosition: [0, 2, 0],
        isGrounded: true,
        isJumping: false,
        doubleJumpAvailable: true,
        groundPounding: false,
        dashCooldown: 0,
        spinTimer: 0,
        enemyContactCooldown: 0,
        cameraYaw: 0,
        cameraPitch: 0,
        coins: freshCoins,
        coinsCollected: 0,
        totalCoins: freshCoins.length,
        comboMultiplier: 1,
        comboTimer: 0,
        redCoins: FASKA64_RED_COINS.map((coin) => ({ ...coin, collected: false })),
        stuntRings: FASKA64_STUNT_RINGS.map((ring) => ({ ...ring, passed: false })),
        enemies: FASKA64_ENEMIES.map((enemy) => ({ ...enemy, defeated: false })),
        launchesHit: [],
        missionStats: createMissionStats(),
        missions: createMissions(mode),
        missionNotice: mode === 'learn' ? 'Learncade: Sammle rote Muenzen fuer Fragen.' : 'Missionen aktiv.',
        missionNoticeTimer: 2,
        damageFlash: 0,
        lastQuizScore: 0,
      });
    },
  }),
);

export { INITIAL_PLATFORMS, INITIAL_COINS };
export default useFaskaSixtyFourStore;
