import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaZeldaSwarm Game Store
 * Top-down adventure with sword combat, rupees, room transitions
 */

let entityIdCounter = 0;

function createSlime(position) {
  return {
    id: ++entityIdCounter,
    position: [...position],
    health: 20,
    maxHealth: 20,
    type: 'slime',
    speed: 1.5 + Math.random() * 1.0,
    damage: 10,
    points: 50,
    alive: true,
    bouncePhase: Math.random() * Math.PI * 2,
    direction: [Math.random() - 0.5, 0, Math.random() - 0.5],
    changeTimer: 0,
    lastAttack: 0,
    knockback: [0, 0, 0],
    knockbackTimer: 0,
  };
}

function createBat(position) {
  return {
    id: ++entityIdCounter,
    position: [...position],
    health: 10,
    maxHealth: 10,
    type: 'bat',
    speed: 3.0 + Math.random() * 1.5,
    damage: 5,
    points: 75,
    alive: true,
    bouncePhase: Math.random() * Math.PI * 2,
    direction: [Math.random() - 0.5, 0, Math.random() - 0.5],
    changeTimer: 0,
    lastAttack: 0,
    knockback: [0, 0, 0],
    knockbackTimer: 0,
  };
}

function generateRoom(roomId) {
  const enemies = [];
  const items = [];
  const bushes = [];
  const pots = [];

  const count = Math.min(3 + roomId, 8);

  // Enemies
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 12;
    const z = (Math.random() - 0.5) * 12;
    if (Math.abs(x) < 2 && Math.abs(z) < 2) continue; // Don't spawn on player
    if (Math.random() < 0.3 && roomId > 1) {
      enemies.push(createBat([x, 0.5, z]));
    } else {
      enemies.push(createSlime([x, 0.3, z]));
    }
  }

  // Rupees
  const rupeeCount = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < rupeeCount; i++) {
    items.push({
      id: ++entityIdCounter,
      type: 'rupee',
      position: [(Math.random() - 0.5) * 14, 0.3, (Math.random() - 0.5) * 14],
      value: Math.random() < 0.2 ? 5 : 1,
      collected: false,
    });
  }

  // Bushes (decorative obstacles)
  const bushCount = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < bushCount; i++) {
    const x = (Math.random() - 0.5) * 14;
    const z = (Math.random() - 0.5) * 14;
    if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
    bushes.push({
      id: ++entityIdCounter,
      position: [x, 0.25, z],
      destroyed: false,
    });
  }

  // Pots
  const potCount = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < potCount; i++) {
    const x = (Math.random() - 0.5) * 14;
    const z = (Math.random() - 0.5) * 14;
    if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
    pots.push({
      id: ++entityIdCounter,
      position: [x, 0.2, z],
      destroyed: false,
      hasRupee: Math.random() < 0.4,
    });
  }

  // Heart pickup chance
  if (Math.random() < 0.3) {
    items.push({
      id: ++entityIdCounter,
      type: 'heart',
      position: [(Math.random() - 0.5) * 10, 0.3, (Math.random() - 0.5) * 10],
      collected: false,
    });
  }

  return { enemies, items, bushes, pots };
}

const useZeldaStore = createGameStore(
  {
    // Player
    health: 6, // Half hearts (max 6 = 3 full hearts)
    maxHealth: 6,
    rupees: 0,
    inventory: [],
    playerPosition: [0, 0.5, 0],
    playerDirection: [0, 0, -1], // facing direction for sword
    invulnerable: false,
    invulnerableTimer: 0,

    // Sword
    swordSwinging: false,
    swordAngle: 0,
    swordCooldown: 0,
    swordHitIds: new Set(), // enemies already hit during this swing

    // Room
    currentRoom: 0,
    totalRooms: 10,
    roomData: null,

    // Enemies & items in current room
    enemies: [],
    items: [],
    bushes: [],
    pots: [],

    // Room transition
    transitioning: false,
    transitionDirection: null,

    // Score tracking for quiz
    lastQuizScore: 0,
  },
  (set, get) => ({
    // Initialize game
    initGame: () => {
      entityIdCounter = 0;
      const room = generateRoom(0);
      set({
        health: 6,
        rupees: 0,
        inventory: [],
        playerPosition: [0, 0.5, 0],
        playerDirection: [0, 0, -1],
        currentRoom: 0,
        enemies: room.enemies,
        items: room.items,
        bushes: room.bushes,
        pots: room.pots,
        swordSwinging: false,
        swordCooldown: 0,
        invulnerable: false,
        lastQuizScore: 0,
        transitioning: false,
      });
    },

    // Swing sword
    swingSword: () => {
      const state = get();
      if (state.swordSwinging || state.swordCooldown > 0 || !state.isPlaying || state.isPaused)
        return;

      set({
        swordSwinging: true,
        swordAngle: 0,
        swordHitIds: new Set(),
      });

      // Swing duration
      setTimeout(() => {
        set({
          swordSwinging: false,
          swordCooldown: 0.2,
          swordHitIds: new Set(),
        });
      }, 300);
    },

    // Damage enemy with sword
    hitEnemy: (enemyId, knockbackDir) => {
      const state = get();
      if (state.swordHitIds.has(enemyId)) return; // Already hit this swing

      const newHitIds = new Set(state.swordHitIds);
      newHitIds.add(enemyId);

      const enemies = state.enemies.map((e) => {
        if (e.id === enemyId && e.alive) {
          const newHealth = e.health - 10;
          if (newHealth <= 0) {
            // Killed!
            const newScore = state.score + e.points;
            if (Math.floor(newScore / 500) > Math.floor(state.score / 500)) {
              setTimeout(() => get().triggerQuiz('math'), 500);
            }
            set((s) => ({
              score: newScore,
              highScore: Math.max(newScore, s.highScore),
            }));
            return { ...e, health: 0, alive: false };
          }
          return {
            ...e,
            health: newHealth,
            knockback: knockbackDir
              ? [knockbackDir[0] * 4, 0, knockbackDir[2] * 4]
              : [0, 0, 0],
            knockbackTimer: 0.2,
          };
        }
        return e;
      });

      set({ enemies, swordHitIds: newHitIds });
    },

    // Player takes damage
    takeDamage: (amount) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.invulnerable) return;

      const newHealth = Math.max(0, state.health - amount);
      if (newHealth <= 0) {
        set({
          health: 0,
          lives: state.lives - 1,
          isGameOver: state.lives <= 1,
          isPlaying: state.lives > 1,
          invulnerable: true,
        });
        // Respawn if lives remain
        if (state.lives > 1) {
          setTimeout(() => {
            set({
              health: state.maxHealth,
              playerPosition: [0, 0.5, 0],
              invulnerable: false,
              isPlaying: true,
            });
          }, 1000);
        }
      } else {
        set({
          health: newHealth,
          invulnerable: true,
        });
        // I-frames
        setTimeout(() => set({ invulnerable: false }), 1000);
      }
    },

    // Collect item
    collectItem: (itemId) => {
      const state = get();
      const item = state.items.find((i) => i.id === itemId && !i.collected);
      if (!item) return;

      const updates = {
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, collected: true } : i
        ),
      };

      if (item.type === 'rupee') {
        updates.rupees = state.rupees + item.value;
        const newScore = state.score + item.value * 10;
        updates.score = newScore;
        updates.highScore = Math.max(newScore, state.highScore);
      } else if (item.type === 'heart') {
        updates.health = Math.min(state.maxHealth, state.health + 2);
      }

      set(updates);
    },

    // Destroy bush
    destroyBush: (bushId) => {
      const state = get();
      set({
        bushes: state.bushes.map((b) =>
          b.id === bushId ? { ...b, destroyed: true } : b
        ),
      });
    },

    // Destroy pot
    destroyPot: (potId) => {
      const state = get();
      const pot = state.pots.find((p) => p.id === potId && !p.destroyed);
      if (!pot) return;

      const updates = {
        pots: state.pots.map((p) =>
          p.id === potId ? { ...p, destroyed: true } : p
        ),
      };

      // Spawn rupee if pot had one
      if (pot.hasRupee) {
        updates.items = [
          ...state.items,
          {
            id: ++entityIdCounter,
            type: 'rupee',
            position: [...pot.position],
            value: 1,
            collected: false,
          },
        ];
      }

      set(updates);
    },

    // Change room
    changeRoom: (direction) => {
      const state = get();
      if (state.transitioning || !state.isPlaying) return;

      const newRoom = state.currentRoom + (direction === 'forward' ? 1 : -1);
      if (newRoom < 0 || newRoom >= state.totalRooms) return;

      set({ transitioning: true, transitionDirection: direction });

      setTimeout(() => {
        const room = generateRoom(newRoom);
        // Spawn player at opposite side
        let spawnPos = [0, 0.5, 0];
        if (direction === 'forward') spawnPos = [0, 0.5, 7];
        else if (direction === 'backward') spawnPos = [0, 0.5, -7];
        else if (direction === 'left') spawnPos = [7, 0.5, 0];
        else if (direction === 'right') spawnPos = [-7, 0.5, 0];

        set({
          currentRoom: newRoom,
          enemies: room.enemies,
          items: room.items,
          bushes: room.bushes,
          pots: room.pots,
          playerPosition: spawnPos,
          transitioning: false,
          transitionDirection: null,
          level: newRoom + 1,
        });
      }, 500);
    },

    // Update player position
    setPlayerPosition: (pos) => set({ playerPosition: pos }),
    setPlayerDirection: (dir) => set({ playerDirection: dir }),

    // Update enemies
    updateEnemies: (playerPos, delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;

      const now = Date.now();
      const enemies = state.enemies.map((e) => {
        if (!e.alive) return e;

        // Handle knockback
        if (e.knockbackTimer > 0) {
          const newTimer = e.knockbackTimer - delta;
          const kbFactor = e.knockbackTimer / 0.2;
          return {
            ...e,
            position: [
              e.position[0] + e.knockback[0] * delta * kbFactor,
              e.position[1],
              e.position[2] + e.knockback[2] * delta * kbFactor,
            ],
            knockbackTimer: Math.max(0, newTimer),
          };
        }

        // Update bounce phase
        const newPhase = e.bouncePhase + delta * (e.type === 'slime' ? 4 : 8);

        // Change direction periodically
        let dir = e.direction;
        let changeTimer = e.changeTimer + delta;
        if (changeTimer > 2) {
          changeTimer = 0;
          // Sometimes chase player, sometimes random
          if (Math.random() < 0.6) {
            const dx = playerPos[0] - e.position[0];
            const dz = playerPos[2] - e.position[2];
            const len = Math.sqrt(dx * dx + dz * dz);
            dir = len > 0 ? [dx / len, 0, dz / len] : dir;
          } else {
            const angle = Math.random() * Math.PI * 2;
            dir = [Math.cos(angle), 0, Math.sin(angle)];
          }
        }

        // Move
        const moveSpeed = e.speed * delta;
        let newX = e.position[0] + dir[0] * moveSpeed;
        let newZ = e.position[2] + dir[2] * moveSpeed;

        // Bound to room
        const bound = 8.5;
        if (Math.abs(newX) > bound) {
          newX = Math.sign(newX) * bound;
          dir = [-dir[0], 0, dir[2]];
        }
        if (Math.abs(newZ) > bound) {
          newZ = Math.sign(newZ) * bound;
          dir = [dir[0], 0, -dir[2]];
        }

        // Check attack range
        const dx = playerPos[0] - newX;
        const dz = playerPos[2] - newZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 1.0 && now - e.lastAttack > 800) {
          get().takeDamage(e.damage > 10 ? 2 : 1);
          return {
            ...e,
            position: [newX, e.position[1], newZ],
            bouncePhase: newPhase,
            direction: dir,
            changeTimer,
            lastAttack: now,
          };
        }

        return {
          ...e,
          position: [newX, e.position[1], newZ],
          bouncePhase: newPhase,
          direction: dir,
          changeTimer,
        };
      });

      set({ enemies });
    },

    // Sword cooldown update
    updateSwordCooldown: (delta) => {
      const state = get();
      if (state.swordCooldown > 0) {
        set({ swordCooldown: Math.max(0, state.swordCooldown - delta) });
      }
    },

    // Override startGame
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
        health: 6,
        rupees: 0,
      });
      setTimeout(() => get().initGame(), 50);
    },
  })
);

export default useZeldaStore;
