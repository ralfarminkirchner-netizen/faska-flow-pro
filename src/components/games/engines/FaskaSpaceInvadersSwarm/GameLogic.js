import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaSpaceInvaders Game Store
 *
 * Classic Space Invaders in 3D: rows of invaders march side-to-side,
 * descend, and the player fires bullets upward.
 */

const GRID_COLS = 11;
const GRID_ROWS = 5;
const INVADER_SPACING_X = 1.4;
const INVADER_SPACING_Y = 1.2;
const GRID_START_X = -(GRID_COLS - 1) * INVADER_SPACING_X / 2;
const GRID_START_Y = 8;

// Invader types per row (from top)
const ROW_TYPES = ['elite', 'elite', 'soldier', 'soldier', 'grunt'];
const ROW_POINTS = { elite: 30, soldier: 20, grunt: 10 };
const ROW_COLORS = {
  elite: '#a855f7',
  soldier: '#06b6d4',
  grunt: '#10b981',
};

function buildInvaderGrid() {
  const invaders = [];
  let id = 0;
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      invaders.push({
        id: id++,
        row, col,
        type: ROW_TYPES[row],
        x: GRID_START_X + col * INVADER_SPACING_X,
        y: GRID_START_Y - row * INVADER_SPACING_Y,
        alive: true,
        hitAnim: 0,
      });
    }
  }
  return invaders;
}

function buildShields() {
  const shields = [];
  const positions = [-6, -2, 2, 6];
  let id = 0;
  for (const baseX of positions) {
    // Each shield is a cluster of small blocks
    for (let bx = -1; bx <= 1; bx++) {
      for (let by = 0; by <= 2; by++) {
        // Skip corners for rounded shape
        if ((by === 2 && Math.abs(bx) === 1)) continue;
        shields.push({
          id: id++,
          x: baseX + bx * 0.5,
          y: 1.5 + by * 0.5,
          health: 3,
        });
      }
    }
  }
  return shields;
}

let bulletIdCounter = 0;
let invaderBulletIdCounter = 0;

const useSpaceInvadersStore = createGameStore(
  {
    // Game-specific state
    invaders: [],
    bullets: [],
    invaderBullets: [],
    shields: [],
    playerX: 0,
    playerWidth: 1.2,
    invaderDirection: 1,
    invaderSpeed: 0.5,
    invaderMoveTimer: 0,
    invaderMoveInterval: 0.8,
    invaderShootTimer: 0,
    shootCooldown: 0,
    lastQuizScore: 0,
    explosions: [],
    wave: 1,
  },
  (set, get) => ({
    startGame: () => {
      bulletIdCounter = 0;
      invaderBulletIdCounter = 0;
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        level: 1,
        speed: 1,
        invaders: buildInvaderGrid(),
        bullets: [],
        invaderBullets: [],
        shields: buildShields(),
        playerX: 0,
        invaderDirection: 1,
        invaderSpeed: 0.5,
        invaderMoveTimer: 0,
        invaderMoveInterval: 0.8,
        invaderShootTimer: 0,
        shootCooldown: 0,
        quizActive: false,
        quizScore: 0,
        quizStreak: 0,
        lastQuizScore: 0,
        explosions: [],
        wave: 1,
      });
    },

    shoot: () => {
      const state = get();
      if (state.shootCooldown > 0) return;
      if (state.bullets.length >= 3) return; // Max 3 bullets on screen

      const bullet = {
        id: bulletIdCounter++,
        x: state.playerX,
        y: 0.5,
        speed: 15,
      };
      set({
        bullets: [...state.bullets, bullet],
        shootCooldown: 0.25,
      });
    },

    nextWave: () => {
      const state = get();
      const newWave = state.wave + 1;
      const newInterval = Math.max(0.2, 0.8 - (newWave - 1) * 0.08);
      set({
        invaders: buildInvaderGrid(),
        shields: buildShields(),
        bullets: [],
        invaderBullets: [],
        invaderDirection: 1,
        invaderSpeed: 0.5 + (newWave - 1) * 0.15,
        invaderMoveTimer: 0,
        invaderMoveInterval: newInterval,
        wave: newWave,
        level: newWave,
        speed: 1 + (newWave - 1) * 0.15,
        explosions: [],
      });
    },

    tick: (delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.quizActive) return;

      // === Player movement ===
      const moveSpeed = 8;
      const { dx } = state.input;
      let playerX = state.playerX + dx * moveSpeed * delta;
      playerX = Math.max(-8, Math.min(8, playerX));

      // === Shoot cooldown ===
      let shootCooldown = Math.max(0, state.shootCooldown - delta);

      // === Action A = shoot ===
      if (state.actions.A && shootCooldown <= 0 && state.bullets.length < 3) {
        const bullet = {
          id: bulletIdCounter++,
          x: playerX,
          y: 0.5,
          speed: 15,
        };
        state.bullets.push(bullet);
        shootCooldown = 0.25;
        // Reset action
        set({ actions: { ...state.actions, A: false } });
      }

      // === Move bullets ===
      let bullets = state.bullets
        .map(b => ({ ...b, y: b.y + b.speed * delta }))
        .filter(b => b.y < 12);

      // === Move invader bullets ===
      let invaderBullets = state.invaderBullets
        .map(b => ({ ...b, y: b.y - b.speed * delta }))
        .filter(b => b.y > -1);

      // === Invader movement (step-based like classic) ===
      let invaders = [...state.invaders];
      let invaderDirection = state.invaderDirection;
      let invaderMoveTimer = state.invaderMoveTimer + delta;
      let invaderMoveInterval = state.invaderMoveInterval;
      let shouldDescend = false;

      if (invaderMoveTimer >= invaderMoveInterval) {
        invaderMoveTimer = 0;

        // Check if any alive invader would hit a wall
        const aliveInvaders = invaders.filter(inv => inv.alive);
        const step = invaderDirection * INVADER_SPACING_X * 0.4;

        let hitWall = false;
        for (const inv of aliveInvaders) {
          const newX = inv.x + step;
          if (Math.abs(newX) > 9) {
            hitWall = true;
            break;
          }
        }

        if (hitWall) {
          // Descend and reverse
          invaders = invaders.map(inv => ({
            ...inv,
            y: inv.y - 0.4,
          }));
          invaderDirection *= -1;
          // Speed up slightly
          invaderMoveInterval = Math.max(0.1, invaderMoveInterval - 0.02);
        } else {
          // Move sideways
          invaders = invaders.map(inv => ({
            ...inv,
            x: inv.x + step,
          }));
        }
      }

      // === Invader shooting ===
      let invaderShootTimer = state.invaderShootTimer + delta;
      const shootInterval = Math.max(0.5, 2.0 - (state.wave - 1) * 0.15);
      if (invaderShootTimer >= shootInterval) {
        invaderShootTimer = 0;
        // Pick random alive invader from bottom of each column
        const aliveInvaders = invaders.filter(inv => inv.alive);
        if (aliveInvaders.length > 0) {
          // Get bottom-most alive invader per column
          const bottomInvaders = new Map();
          for (const inv of aliveInvaders) {
            const existing = bottomInvaders.get(inv.col);
            if (!existing || inv.row > existing.row) {
              bottomInvaders.set(inv.col, inv);
            }
          }
          const candidates = Array.from(bottomInvaders.values());
          const shooter = candidates[Math.floor(Math.random() * candidates.length)];
          if (shooter) {
            invaderBullets.push({
              id: invaderBulletIdCounter++,
              x: shooter.x,
              y: shooter.y,
              speed: 5 + state.wave * 0.5,
            });
          }
        }
      }

      // === Collision: player bullets vs invaders ===
      let score = state.score;
      let explosions = [...state.explosions];
      const bulletsToRemove = new Set();
      const invadersHit = new Set();

      for (const bullet of bullets) {
        for (const inv of invaders) {
          if (!inv.alive) continue;
          const hitDist = 0.6;
          if (Math.abs(bullet.x - inv.x) < hitDist && Math.abs(bullet.y - inv.y) < hitDist) {
            bulletsToRemove.add(bullet.id);
            invadersHit.add(inv.id);
            score += ROW_POINTS[inv.type] || 10;
            explosions.push({
              id: Date.now() + inv.id,
              x: inv.x,
              y: inv.y,
              time: 0.5,
              color: ROW_COLORS[inv.type] || '#ffffff',
            });
            break;
          }
        }
      }

      bullets = bullets.filter(b => !bulletsToRemove.has(b.id));
      invaders = invaders.map(inv =>
        invadersHit.has(inv.id) ? { ...inv, alive: false, hitAnim: 0.5 } : inv
      );

      // === Collision: player bullets vs shields ===
      let shields = [...state.shields];
      const shieldBulletsToRemove = new Set();
      for (const bullet of bullets) {
        for (let si = 0; si < shields.length; si++) {
          const s = shields[si];
          if (s.health <= 0) continue;
          if (Math.abs(bullet.x - s.x) < 0.3 && Math.abs(bullet.y - s.y) < 0.3) {
            shieldBulletsToRemove.add(bullet.id);
            shields[si] = { ...s, health: s.health - 1 };
            break;
          }
        }
      }
      bullets = bullets.filter(b => !shieldBulletsToRemove.has(b.id));

      // === Collision: invader bullets vs shields ===
      const iBulletsToRemove = new Set();
      for (const bullet of invaderBullets) {
        for (let si = 0; si < shields.length; si++) {
          const s = shields[si];
          if (s.health <= 0) continue;
          if (Math.abs(bullet.x - s.x) < 0.3 && Math.abs(bullet.y - s.y) < 0.3) {
            iBulletsToRemove.add(bullet.id);
            shields[si] = { ...s, health: s.health - 1 };
            break;
          }
        }
      }
      invaderBullets = invaderBullets.filter(b => !iBulletsToRemove.has(b.id));

      // === Collision: invader bullets vs player ===
      let lives = state.lives;
      let isGameOver = false;
      for (const bullet of invaderBullets) {
        if (Math.abs(bullet.x - playerX) < 0.8 && bullet.y < 0.5) {
          lives -= 1;
          invaderBullets = invaderBullets.filter(b => b.id !== bullet.id);
          explosions.push({
            id: Date.now() + 9999,
            x: playerX,
            y: 0,
            time: 0.8,
            color: '#ef4444',
          });
          if (lives <= 0) {
            isGameOver = true;
          }
          break;
        }
      }

      // === Check if invaders reached bottom ===
      const aliveInvadersCheck = invaders.filter(inv => inv.alive);
      for (const inv of aliveInvadersCheck) {
        if (inv.y <= 0.5) {
          isGameOver = true;
          lives = 0;
          break;
        }
      }

      // === Decay explosions ===
      explosions = explosions
        .map(e => ({ ...e, time: e.time - delta }))
        .filter(e => e.time > 0);

      // === Decay dead invader anims ===
      invaders = invaders.map(inv => {
        if (!inv.alive && inv.hitAnim > 0) {
          return { ...inv, hitAnim: inv.hitAnim - delta * 2 };
        }
        return inv;
      });

      // === Check all invaders dead → next wave ===
      if (aliveInvadersCheck.length === 0 && !isGameOver) {
        // Trigger quiz before next wave
        const shouldQuiz = Math.floor(score / 500) > Math.floor(state.lastQuizScore / 500);
        if (shouldQuiz) {
          set({
            score,
            highScore: Math.max(score, state.highScore),
            lastQuizScore: score,
            playerX,
            shootCooldown,
            bullets,
            invaderBullets,
            invaders,
            shields,
            invaderDirection,
            invaderMoveTimer,
            invaderMoveInterval,
            invaderShootTimer,
            explosions,
            lives,
          });
          setTimeout(() => {
            const s = get();
            if (s.isPlaying && !s.isGameOver) {
              s.triggerQuiz(Math.random() > 0.5 ? 'math' : 'german');
            }
          }, 300);
          setTimeout(() => get().nextWave(), 1500);
          return;
        }
        // Next wave immediately
        set({
          score,
          highScore: Math.max(score, state.highScore),
          playerX,
          lives,
        });
        setTimeout(() => get().nextWave(), 500);
        return;
      }

      // === Quiz check on score milestones ===
      const shouldQuiz = Math.floor(score / 500) > Math.floor(state.lastQuizScore / 500);
      let lastQuizScore = state.lastQuizScore;
      if (shouldQuiz && !isGameOver) {
        lastQuizScore = score;
        setTimeout(() => {
          const s = get();
          if (s.isPlaying && !s.isGameOver) {
            s.triggerQuiz(Math.random() > 0.5 ? 'math' : 'german');
          }
        }, 500);
      }

      set({
        playerX,
        shootCooldown,
        bullets,
        invaderBullets,
        invaders,
        shields: shields.filter(s => s.health > 0),
        invaderDirection,
        invaderMoveTimer,
        invaderMoveInterval,
        invaderShootTimer,
        score,
        highScore: Math.max(score, state.highScore),
        lives,
        isGameOver,
        isPlaying: !isGameOver,
        explosions,
        lastQuizScore,
      });
    },
  })
);

export default useSpaceInvadersStore;
