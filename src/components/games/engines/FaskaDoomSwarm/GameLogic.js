import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaDoomSwarm Game Store
 * FPS-style game with health, ammo, enemies, shooting mechanics
 */

let enemyIdCounter = 0;

function createEnemy(position, type = 'grunt') {
  return {
    id: ++enemyIdCounter,
    position: [...position],
    health: type === 'grunt' ? 30 : type === 'tank' ? 80 : 50,
    maxHealth: type === 'grunt' ? 30 : type === 'tank' ? 80 : 50,
    type,
    speed: type === 'grunt' ? 2.5 : type === 'tank' ? 1.2 : 3.5,
    damage: type === 'grunt' ? 10 : type === 'tank' ? 25 : 15,
    points: type === 'grunt' ? 100 : type === 'tank' ? 300 : 200,
    alive: true,
    lastAttack: 0,
  };
}

function generateWave(waveNumber) {
  const enemies = [];
  const count = Math.min(3 + waveNumber * 2, 15);
  const radius = 15 + waveNumber * 2;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist = radius + Math.random() * 5;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    let type = 'grunt';
    if (waveNumber >= 3 && Math.random() < 0.3) type = 'tank';
    if (waveNumber >= 2 && Math.random() < 0.25) type = 'runner';

    enemies.push(createEnemy([x, 1, z], type));
  }
  return enemies;
}

const useDoomStore = createGameStore(
  {
    // Player state
    health: 100,
    maxHealth: 100,
    ammo: 30,
    maxAmmo: 50,
    playerPosition: [0, 1.6, 0],
    playerRotation: [0, 0, 0],

    // Combat
    enemies: [],
    wave: 0,
    waveCleared: false,
    isShooting: false,
    muzzleFlash: false,
    lastShootTime: 0,
    shootCooldown: 150, // ms

    // Pickups
    pickups: [],
    pickupIdCounter: 0,

    // Score tracking for quiz
    lastQuizScore: 0,

    // Camera
    cameraYaw: 0,
    cameraPitch: 0,
  },
  (set, get) => ({
    // Initialize first wave
    initGame: () => {
      enemyIdCounter = 0;
      const wave1 = generateWave(1);
      set({
        health: 100,
        ammo: 30,
        enemies: wave1,
        wave: 1,
        waveCleared: false,
        playerPosition: [0, 1.6, 0],
        cameraYaw: 0,
        cameraPitch: 0,
        lastQuizScore: 0,
        pickups: [],
        pickupIdCounter: 0,
      });
    },

    // Shooting
    shoot: () => {
      const state = get();
      if (state.ammo <= 0 || state.isPaused || !state.isPlaying) return;

      const now = Date.now();
      if (now - state.lastShootTime < state.shootCooldown) return;

      set({
        ammo: state.ammo - 1,
        isShooting: true,
        muzzleFlash: true,
        lastShootTime: now,
      });

      // Auto-reset muzzle flash
      setTimeout(() => set({ muzzleFlash: false, isShooting: false }), 80);
    },

    // Damage an enemy by ID
    damageEnemy: (enemyId, damage) => {
      const state = get();
      const enemies = state.enemies.map((e) => {
        if (e.id === enemyId && e.alive) {
          const newHealth = e.health - damage;
          if (newHealth <= 0) {
            // Enemy killed - add score
            const newScore = state.score + e.points;
            // Check for quiz trigger every 500 points
            if (Math.floor(newScore / 500) > Math.floor(state.score / 500)) {
              setTimeout(() => get().triggerQuiz('math'), 300);
            }
            set((s) => ({
              score: newScore,
              highScore: Math.max(newScore, s.highScore),
            }));
            return { ...e, health: 0, alive: false };
          }
          return { ...e, health: newHealth };
        }
        return e;
      });

      // Check if wave cleared
      const aliveEnemies = enemies.filter((e) => e.alive);
      if (aliveEnemies.length === 0) {
        set({ enemies, waveCleared: true });
        // Spawn next wave after delay
        setTimeout(() => {
          const nextWave = state.wave + 1;
          const newEnemies = generateWave(nextWave);
          // Spawn pickups
          const pickups = [];
          let pid = state.pickupIdCounter;
          // Health pickup
          pickups.push({
            id: ++pid,
            type: 'health',
            position: [
              (Math.random() - 0.5) * 20,
              0.5,
              (Math.random() - 0.5) * 20,
            ],
            amount: 25,
            collected: false,
          });
          // Ammo pickup
          pickups.push({
            id: ++pid,
            type: 'ammo',
            position: [
              (Math.random() - 0.5) * 20,
              0.5,
              (Math.random() - 0.5) * 20,
            ],
            amount: 15,
            collected: false,
          });
          set({
            enemies: newEnemies,
            wave: nextWave,
            waveCleared: false,
            level: nextWave,
            speed: 1 + nextWave * 0.1,
            pickups: [...state.pickups.filter((p) => !p.collected), ...pickups],
            pickupIdCounter: pid,
          });
        }, 2000);
      } else {
        set({ enemies });
      }
    },

    // Player takes damage
    takeDamage: (amount) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;
      const newHealth = Math.max(0, state.health - amount);
      if (newHealth <= 0) {
        set({ health: 0, isPlaying: false, isGameOver: true });
      } else {
        set({ health: newHealth });
      }
    },

    // Pickup item
    pickupItem: (pickupId) => {
      const state = get();
      const pickup = state.pickups.find(
        (p) => p.id === pickupId && !p.collected
      );
      if (!pickup) return;

      const updates = {
        pickups: state.pickups.map((p) =>
          p.id === pickupId ? { ...p, collected: true } : p
        ),
      };

      if (pickup.type === 'health') {
        updates.health = Math.min(state.maxHealth, state.health + pickup.amount);
      } else if (pickup.type === 'ammo') {
        updates.ammo = Math.min(state.maxAmmo, state.ammo + pickup.amount);
      }

      set(updates);
    },

    // Update player position
    setPlayerPosition: (pos) => set({ playerPosition: pos }),
    setPlayerRotation: (rot) => set({ playerRotation: rot }),

    // Camera look
    setCameraLook: (yaw, pitch) => set({ cameraYaw: yaw, cameraPitch: pitch }),
    addCameraLook: (deltaYaw, deltaPitch) => {
      const state = get();
      const newPitch = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, state.cameraPitch + deltaPitch)
      );
      set({
        cameraYaw: state.cameraYaw + deltaYaw,
        cameraPitch: newPitch,
      });
    },

    // Update enemy positions (called from game loop)
    updateEnemies: (playerPos, delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;

      const now = Date.now();
      const enemies = state.enemies.map((e) => {
        if (!e.alive) return e;

        // Move toward player
        const dx = playerPos[0] - e.position[0];
        const dz = playerPos[2] - e.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 1.8) {
          // Attack player
          if (now - e.lastAttack > 1000) {
            get().takeDamage(e.damage);
            return { ...e, lastAttack: now };
          }
          return e;
        }

        // Move toward player
        const moveSpeed = e.speed * delta;
        const nx = (dx / dist) * moveSpeed;
        const nz = (dz / dist) * moveSpeed;

        return {
          ...e,
          position: [e.position[0] + nx, e.position[1], e.position[2] + nz],
        };
      });

      set({ enemies });
    },

    // Override startGame to also init
    startGame: () => {
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
        health: 100,
        ammo: 30,
      });
      // Small delay to let state settle
      setTimeout(() => get().initGame(), 50);
    },
  })
);

export default useDoomStore;
