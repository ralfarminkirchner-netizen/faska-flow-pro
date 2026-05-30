import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaMoorhuhn Game Store
 * 
 * Shooting gallery state: targets fly across, player taps to shoot.
 * Features combo multiplier, ammo management, and 60-second timer.
 */

let nextTargetId = 0;

const TARGET_TYPES = [
  { type: 'normal', points: 10, color: '#8B4513', speed: 1 },
  { type: 'fast', points: 25, color: '#1e40af', speed: 2 },
  { type: 'tiny', points: 50, color: '#dc2626', speed: 1.5 },
  { type: 'golden', points: 100, color: '#f59e0b', speed: 0.8 },
  { type: 'bonus', points: 200, color: '#a855f7', speed: 0.6 },
];

function createTarget(level = 1) {
  const typeRoll = Math.random();
  let tConfig;
  if (typeRoll < 0.4) tConfig = TARGET_TYPES[0];       // normal 40%
  else if (typeRoll < 0.65) tConfig = TARGET_TYPES[1];  // fast 25%
  else if (typeRoll < 0.82) tConfig = TARGET_TYPES[2];  // tiny 17%
  else if (typeRoll < 0.95) tConfig = TARGET_TYPES[3];  // golden 13%
  else tConfig = TARGET_TYPES[4];                        // bonus 5%

  const direction = Math.random() > 0.5 ? 1 : -1;
  const y = 1.5 + Math.random() * 6;
  const z = -2 - Math.random() * 8;
  const startX = direction > 0 ? -16 : 16;
  const speedMul = 0.8 + Math.random() * 0.6 + (level - 1) * 0.1;

  return {
    id: nextTargetId++,
    type: tConfig.type,
    color: tConfig.color,
    points: tConfig.points,
    position: [startX, y, z],
    speed: tConfig.speed * speedMul * direction,
    alive: true,
    hitAnim: 0,
    size: tConfig.type === 'tiny' ? 0.4 : tConfig.type === 'bonus' ? 0.9 : 0.65,
    wingPhase: Math.random() * Math.PI * 2,
  };
}

const useMoorhuhnStore = createGameStore(
  {
    // Game-specific state
    targets: [],
    ammo: 8,
    maxAmmo: 8,
    reloading: false,
    reloadTime: 0,
    timeLeft: 60,
    combo: 0,
    comboTimer: 0,
    hitMarkers: [],
    lastQuizScore: 0,
    shotsFired: 0,
    shotsHit: 0,
    spawnTimer: 0,
  },
  (set, get) => ({
    // Reset game with Moorhuhn-specific state
    startGame: () => {
      nextTargetId = 0;
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        level: 1,
        speed: 1,
        targets: [],
        ammo: 8,
        maxAmmo: 8,
        reloading: false,
        reloadTime: 0,
        timeLeft: 60,
        combo: 0,
        comboTimer: 0,
        hitMarkers: [],
        quizActive: false,
        quizScore: 0,
        quizStreak: 0,
        lastQuizScore: 0,
        shotsFired: 0,
        shotsHit: 0,
        spawnTimer: 0,
      });
    },

    spawnTarget: () => {
      const state = get();
      const target = createTarget(state.level);
      set({ targets: [...state.targets, target] });
    },

    shootTarget: (targetId, hitPosition) => {
      const state = get();
      if (state.ammo <= 0 || state.reloading) return false;

      set({ ammo: state.ammo - 1, shotsFired: state.shotsFired + 1 });

      const target = state.targets.find(t => t.id === targetId && t.alive);
      if (!target) {
        // Missed — reset combo
        set({ combo: 0, comboTimer: 0 });
        return false;
      }

      const comboMultiplier = 1 + state.combo * 0.5;
      const points = Math.round(target.points * comboMultiplier);
      const newScore = state.score + points;
      const newCombo = state.combo + 1;

      // Add hit marker
      const marker = {
        id: Date.now(),
        position: hitPosition || target.position,
        points,
        combo: newCombo,
        time: 1.0,
      };

      // Check level up (every 500 points)
      let newLevel = state.level;
      let newTimeLeft = state.timeLeft;
      if (Math.floor(newScore / 500) > Math.floor(state.score / 500)) {
        newLevel = state.level + 1;
        newTimeLeft = Math.min(state.timeLeft + 10, 60); // Bonus time on level up
      }

      // Check quiz trigger (every 500 points)
      const shouldQuiz = Math.floor(newScore / 500) > Math.floor(state.lastQuizScore / 500);

      set({
        targets: state.targets.map(t =>
          t.id === targetId ? { ...t, alive: false, hitAnim: 1.0 } : t
        ),
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
        combo: newCombo,
        comboTimer: 2.0,
        hitMarkers: [...state.hitMarkers, marker],
        level: newLevel,
        timeLeft: newTimeLeft,
        shotsHit: state.shotsHit + 1,
      });

      if (shouldQuiz) {
        set({ lastQuizScore: newScore });
        setTimeout(() => {
          const s = get();
          if (s.isPlaying && !s.isGameOver) {
            s.triggerQuiz(Math.random() > 0.5 ? 'math' : 'german');
          }
        }, 500);
      }

      return true;
    },

    shoot: () => {
      const state = get();
      if (state.ammo <= 0 || state.reloading) return;
      set({
        ammo: state.ammo - 1,
        shotsFired: state.shotsFired + 1,
        combo: 0,
        comboTimer: 0,
      });
    },

    reload: () => {
      const state = get();
      if (state.reloading || state.ammo === state.maxAmmo) return;
      set({ reloading: true, reloadTime: 1.2 });
    },

    tick: (delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.quizActive) return;

      // Timer countdown
      const newTime = state.timeLeft - delta;
      if (newTime <= 0) {
        set({ timeLeft: 0, isPlaying: false, isGameOver: true });
        return;
      }

      // Reload timer
      let { reloading, reloadTime, ammo, maxAmmo } = state;
      if (reloading) {
        reloadTime -= delta;
        if (reloadTime <= 0) {
          reloading = false;
          reloadTime = 0;
          ammo = maxAmmo;
        }
      }

      // Auto-reload when empty
      if (ammo <= 0 && !reloading) {
        reloading = true;
        reloadTime = 1.2;
      }

      // Combo timer decay
      let comboTimer = state.comboTimer - delta;
      let combo = state.combo;
      if (comboTimer <= 0) {
        comboTimer = 0;
        combo = 0;
      }

      // Move targets and remove off-screen
      const targets = state.targets
        .map(t => {
          if (!t.alive) {
            const hitAnim = t.hitAnim - delta * 2;
            return hitAnim > 0 ? { ...t, hitAnim } : null;
          }
          const newX = t.position[0] + t.speed * delta * 3;
          // Remove if off screen
          if (Math.abs(newX) > 18) return null;
          return { ...t, position: [newX, t.position[1], t.position[2]] };
        })
        .filter(Boolean);

      // Spawn timer
      const spawnInterval = Math.max(0.4, 1.5 - (state.level - 1) * 0.1);
      let spawnTimer = state.spawnTimer + delta;
      if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        const newTarget = createTarget(state.level);
        targets.push(newTarget);
      }

      // Decay hit markers
      const hitMarkers = state.hitMarkers
        .map(m => ({ ...m, time: m.time - delta }))
        .filter(m => m.time > 0);

      set({
        timeLeft: newTime,
        targets,
        reloading,
        reloadTime,
        ammo,
        comboTimer,
        combo,
        hitMarkers,
        spawnTimer,
      });
    },
  })
);

export default useMoorhuhnStore;
