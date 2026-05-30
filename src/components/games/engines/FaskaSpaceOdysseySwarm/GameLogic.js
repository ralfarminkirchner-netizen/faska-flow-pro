import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaSpaceOdyssey — Game Store
 * State: fuel, cargo, asteroidsDestroyed, planetsVisited, starsCollected, shieldActive
 * Actions: collectStar, visitPlanet, destroyAsteroid, useFuel, activateShield
 */
const useSpaceStore = createGameStore(
  // Game-specific initial state
  {
    fuel: 100,
    maxFuel: 100,
    cargo: [],
    asteroidsDestroyed: 0,
    planetsVisited: 0,
    starsCollected: 0,
    shieldActive: false,
    shieldCooldown: 0,
    boostActive: false,
    boostFuel: 100,
    comboMultiplier: 1,
    comboTimer: 0,
    lastQuizScore: 0,
    // Collectible positions — generated dynamically
    stars: [],
    planets: [],
    asteroids: [],
    projectiles: [],
    explosions: [],
    speedBonus: 0,
    warningFlash: false,
  },
  // Game-specific actions
  (set, get) => ({
    collectStar: (starId) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;
      const points = 100 * state.comboMultiplier;
      set({
        starsCollected: state.starsCollected + 1,
        score: state.score + points,
        highScore: Math.max(state.score + points, state.highScore),
        comboMultiplier: Math.min(state.comboMultiplier + 0.5, 5),
        comboTimer: 3,
        fuel: Math.min(state.fuel + 5, state.maxFuel),
        stars: state.stars.filter((s) => s.id !== starId),
      });
      // Quiz trigger every 500 points
      const newScore = state.score + points;
      if (Math.floor(newScore / 500) > Math.floor(state.score / 500)) {
        setTimeout(() => get().triggerQuiz('math'), 500);
      }
    },

    visitPlanet: (planetId) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;
      const points = 250 * state.comboMultiplier;
      set({
        planetsVisited: state.planetsVisited + 1,
        score: state.score + points,
        highScore: Math.max(state.score + points, state.highScore),
        fuel: Math.min(state.fuel + 25, state.maxFuel),
      });
      // Level up every 3 planets
      if ((state.planetsVisited + 1) % 3 === 0) {
        get().nextLevel();
      }
    },

    destroyAsteroid: (asteroidId) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;
      const points = 50 * state.comboMultiplier;
      set({
        asteroidsDestroyed: state.asteroidsDestroyed + 1,
        score: state.score + points,
        highScore: Math.max(state.score + points, state.highScore),
        asteroids: state.asteroids.filter((a) => a.id !== asteroidId),
        comboMultiplier: Math.min(state.comboMultiplier + 0.25, 5),
        comboTimer: 3,
      });
    },

    useFuel: (amount) => {
      const state = get();
      if (!state.isPlaying) return;
      const newFuel = Math.max(0, state.fuel - amount);
      set({ fuel: newFuel });
      if (newFuel <= 0) {
        get().loseLife();
        set({ fuel: 50 }); // Partial refuel on life loss
      }
    },

    activateShield: () => {
      const state = get();
      if (!state.isPlaying || state.shieldCooldown > 0 || state.fuel < 15) return;
      set({
        shieldActive: true,
        shieldCooldown: 5,
        fuel: state.fuel - 15,
      });
      setTimeout(() => {
        set({ shieldActive: false });
      }, 3000);
    },

    activateBoost: () => {
      const state = get();
      if (!state.isPlaying || state.boostFuel < 10) return;
      set({ boostActive: true, boostFuel: state.boostFuel - 10 });
      setTimeout(() => set({ boostActive: false }), 500);
    },

    fireProjectile: (position, direction) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;
      const id = Date.now() + Math.random();
      set({
        projectiles: [
          ...state.projectiles,
          { id, position: [...position], direction: [...direction], life: 2 },
        ],
      });
    },

    removeProjectile: (id) => {
      set((state) => ({
        projectiles: state.projectiles.filter((p) => p.id !== id),
      }));
    },

    addExplosion: (position) => {
      const id = Date.now() + Math.random();
      set((state) => ({
        explosions: [...state.explosions, { id, position: [...position], time: 0 }],
      }));
      setTimeout(() => {
        set((state) => ({
          explosions: state.explosions.filter((e) => e.id !== id),
        }));
      }, 1000);
    },

    updateTimers: (delta) => {
      const state = get();
      const updates = {};
      if (state.comboTimer > 0) {
        updates.comboTimer = Math.max(0, state.comboTimer - delta);
        if (updates.comboTimer <= 0) {
          updates.comboMultiplier = 1;
        }
      }
      if (state.shieldCooldown > 0) {
        updates.shieldCooldown = Math.max(0, state.shieldCooldown - delta);
      }
      if (state.boostFuel < 100) {
        updates.boostFuel = Math.min(100, state.boostFuel + delta * 5);
      }
      if (Object.keys(updates).length > 0) {
        set(updates);
      }
    },

    takeDamage: () => {
      const state = get();
      if (state.shieldActive || !state.isPlaying) return;
      set({ warningFlash: true });
      setTimeout(() => set({ warningFlash: false }), 300);
      get().loseLife();
      if (get().lives > 0) {
        set({ fuel: Math.min(state.fuel, 50), shieldActive: true });
        setTimeout(() => set({ shieldActive: false }), 2000);
      }
    },

    resetSpaceState: () => {
      set({
        fuel: 100,
        cargo: [],
        asteroidsDestroyed: 0,
        planetsVisited: 0,
        starsCollected: 0,
        shieldActive: false,
        shieldCooldown: 0,
        boostActive: false,
        boostFuel: 100,
        comboMultiplier: 1,
        comboTimer: 0,
        projectiles: [],
        explosions: [],
        speedBonus: 0,
        warningFlash: false,
      });
    },
  })
);

export default useSpaceStore;
