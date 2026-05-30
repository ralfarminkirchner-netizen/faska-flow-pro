import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaSixtyFour Game Store
 * 3D platformer inspired by Mario 64 with coins, platforms, and acrobatics.
 */

// Generate platform layout — a mix of static and moving platforms
function generatePlatforms() {
  const platforms = [];

  // === Central hub area — easy starter platforms ===
  platforms.push(
    { id: 'p0', pos: [0, -0.5, 0], size: [12, 1, 12], color: '#4ade80', type: 'static', isGround: true },
  );

  // === Ring of platforms around the hub ===
  const ringCount = 8;
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2;
    const radius = 14 + Math.random() * 4;
    const height = 1 + Math.random() * 4;
    platforms.push({
      id: `ring_${i}`,
      pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
      size: [3 + Math.random() * 2, 0.8, 3 + Math.random() * 2],
      color: ['#f472b6', '#a78bfa', '#38bdf8', '#34d399', '#fbbf24', '#fb923c', '#f87171', '#818cf8'][i],
      type: i % 3 === 0 ? 'moving' : 'static',
      moveAxis: i % 2 === 0 ? 'x' : 'z',
      moveRange: 3,
      moveSpeed: 0.8 + Math.random() * 0.6,
    });
  }

  // === Tower of ascending platforms ===
  for (let i = 0; i < 5; i++) {
    platforms.push({
      id: `tower_${i}`,
      pos: [8 + i * 1.5, 3 + i * 3, -8],
      size: [2.5, 0.6, 2.5],
      color: `hsl(${200 + i * 30}, 80%, 60%)`,
      type: i % 2 === 0 ? 'static' : 'moving',
      moveAxis: 'y',
      moveRange: 1.5,
      moveSpeed: 0.6,
    });
  }

  // === Floating islands ===
  platforms.push(
    { id: 'island_1', pos: [-15, 6, 10], size: [5, 1.2, 5], color: '#a78bfa', type: 'static' },
    { id: 'island_2', pos: [15, 8, -15], size: [4, 1, 4], color: '#f472b6', type: 'static' },
    { id: 'island_3', pos: [-10, 10, -12], size: [4, 1, 3], color: '#fbbf24', type: 'moving', moveAxis: 'x', moveRange: 4, moveSpeed: 1 },
    { id: 'island_4', pos: [0, 14, 0], size: [6, 1, 6], color: '#34d399', type: 'static' }, // Sky island — final destination
  );

  return platforms;
}

// Generate coin positions on and near platforms
function generateCoins(platforms) {
  const coins = [];
  let coinId = 0;

  // Coins hovering above platforms
  for (const plat of platforms) {
    if (plat.isGround) {
      // Scatter several coins on the ground
      for (let i = 0; i < 5; i++) {
        const ox = (Math.random() - 0.5) * (plat.size[0] - 1);
        const oz = (Math.random() - 0.5) * (plat.size[2] - 1);
        coins.push({
          id: `coin_${coinId++}`,
          pos: [plat.pos[0] + ox, plat.pos[1] + plat.size[1] / 2 + 1.5, plat.pos[2] + oz],
          collected: false,
        });
      }
    } else {
      // 1–2 coins per floating platform
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const ox = (Math.random() - 0.5) * (plat.size[0] * 0.5);
        const oz = (Math.random() - 0.5) * (plat.size[2] * 0.5);
        coins.push({
          id: `coin_${coinId++}`,
          pos: [plat.pos[0] + ox, plat.pos[1] + plat.size[1] / 2 + 1.5, plat.pos[2] + oz],
          collected: false,
        });
      }
    }
  }

  // Bonus coins floating in the air between platforms — trail patterns
  const trailCoins = [
    [5, 3, 0], [7, 4, -2], [9, 5, -4],
    [-5, 4, 5], [-7, 5, 7], [-9, 6, 9],
    [0, 8, -5], [0, 10, -7], [0, 12, -2],
    [-12, 7, 5], [-13, 8, 3],
    [12, 5, 5], [13, 6, 3],
  ];
  for (const pos of trailCoins) {
    coins.push({
      id: `coin_${coinId++}`,
      pos,
      collected: false,
    });
  }

  return coins;
}

const initialPlatforms = generatePlatforms();
const initialCoins = generateCoins(initialPlatforms);

const useFaskaSixtyFourStore = createGameStore(
  {
    // === Game-Specific State ===
    playerPosition: [0, 2, 0],
    coinsCollected: 0,
    totalCoins: initialCoins.length,
    platforms: initialPlatforms,
    coins: initialCoins,
    isJumping: false,
    isGrounded: true,
    doubleJumpAvailable: true,
    groundPounding: false,
    lastQuizScore: 0,    // track score for quiz triggers
    coinParticles: [],    // visual particle effects
    comboTimer: 0,
    comboCount: 0,
  },
  (set, get) => ({
    // === Game-Specific Actions ===
    collectCoin: (coinId) => {
      const state = get();
      const coinIndex = state.coins.findIndex(c => c.id === coinId && !c.collected);
      if (coinIndex === -1) return;

      const newCoins = [...state.coins];
      newCoins[coinIndex] = { ...newCoins[coinIndex], collected: true };

      const now = Date.now();
      const isCombo = now - state.comboTimer < 2000;
      const newCombo = isCombo ? state.comboCount + 1 : 1;
      const comboMultiplier = Math.min(newCombo, 5);
      const points = 100 * comboMultiplier;

      const newCoinsCollected = state.coinsCollected + 1;
      const newScore = state.score + points;

      // Spawn particle effect
      const coinPos = newCoins[coinIndex].pos;
      const particles = Array.from({ length: 8 }, (_, i) => ({
        id: `particle_${coinId}_${i}`,
        pos: [...coinPos],
        vel: [
          (Math.random() - 0.5) * 4,
          Math.random() * 5 + 2,
          (Math.random() - 0.5) * 4,
        ],
        life: 1.0,
      }));

      set({
        coins: newCoins,
        coinsCollected: newCoinsCollected,
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
        comboTimer: now,
        comboCount: newCombo,
        coinParticles: [...state.coinParticles, ...particles],
      });

      // Trigger quiz every 500 points
      if (Math.floor(newScore / 500) > Math.floor(state.lastQuizScore / 500)) {
        set({ lastQuizScore: newScore });
        // Small delay so player sees the score first
        setTimeout(() => {
          const s = get();
          if (s.isPlaying && !s.isPaused && !s.quizActive) {
            s.triggerQuiz(Math.random() > 0.5 ? 'math' : 'german');
          }
        }, 300);
      }
    },

    setPlayerPosition: (pos) => set({ playerPosition: pos }),

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
      if (!state.isGrounded) {
        set({ groundPounding: true });
        return 'groundPound';
      }
      return null;
    },

    land: () => set({ isGrounded: true, isJumping: false, doubleJumpAvailable: true, groundPounding: false }),

    clearParticles: () => {
      const state = get();
      set({ coinParticles: state.coinParticles.filter(p => p.life > 0) });
    },

    updateParticles: (delta) => {
      const state = get();
      if (state.coinParticles.length === 0) return;
      set({
        coinParticles: state.coinParticles
          .map(p => ({
            ...p,
            pos: [p.pos[0] + p.vel[0] * delta, p.pos[1] + p.vel[1] * delta, p.pos[2] + p.vel[2] * delta],
            vel: [p.vel[0] * 0.95, p.vel[1] - 9.8 * delta, p.vel[2] * 0.95],
            life: p.life - delta * 2,
          }))
          .filter(p => p.life > 0),
      });
    },

    resetLevel: () => {
      const newPlatforms = generatePlatforms();
      const newCoins = generateCoins(newPlatforms);
      set({
        playerPosition: [0, 2, 0],
        coinsCollected: 0,
        totalCoins: newCoins.length,
        platforms: newPlatforms,
        coins: newCoins,
        isJumping: false,
        isGrounded: true,
        doubleJumpAvailable: true,
        groundPounding: false,
        lastQuizScore: 0,
        coinParticles: [],
        comboTimer: 0,
        comboCount: 0,
      });
    },

    // Override startGame to also reset level
    startGame: () => {
      const newPlatforms = generatePlatforms();
      const newCoins = generateCoins(newPlatforms);
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
        playerPosition: [0, 2, 0],
        coinsCollected: 0,
        totalCoins: newCoins.length,
        platforms: newPlatforms,
        coins: newCoins,
        isJumping: false,
        isGrounded: true,
        doubleJumpAvailable: true,
        groundPounding: false,
        lastQuizScore: 0,
        coinParticles: [],
        comboTimer: 0,
        comboCount: 0,
      });
    },
  }),
);

export default useFaskaSixtyFourStore;
