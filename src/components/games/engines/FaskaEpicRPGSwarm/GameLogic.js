import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaEpicRPG — Game Store
 * State: playerHP, playerMaxHP, xp, playerLevel, currentCharacter, enemies, inventory, questLog
 * Actions: attack, useItem, gainXP, levelUp, switchCharacter
 */

let enemyIdCounter = 0;

function createEnemy(type, position) {
  enemyIdCounter++;
  const templates = {
    slime: { hp: 30, maxHp: 30, damage: 5, xpReward: 15, speed: 1.2, color: '#22c55e' },
    bat: { hp: 20, maxHp: 20, damage: 8, xpReward: 20, speed: 2.5, color: '#8b5cf6' },
    wolf: { hp: 50, maxHp: 50, damage: 12, xpReward: 35, speed: 1.8, color: '#64748b' },
    boss: { hp: 150, maxHp: 150, damage: 20, xpReward: 100, speed: 1.0, color: '#ef4444' },
  };
  const stats = templates[type] || templates.slime;
  return {
    id: `enemy_${enemyIdCounter}`,
    type,
    position: [...position],
    ...stats,
    stunTimer: 0,
    hitFlash: 0,
  };
}

const useRPGStore = createGameStore(
  // Game-specific initial state
  {
    playerHP: 100,
    playerMaxHP: 100,
    xp: 0,
    xpToNext: 100,
    playerLevel: 1,
    currentCharacter: 'luna',
    attackCooldown: 0,
    itemCooldown: 0,
    enemies: [],
    deadEnemies: [],
    inventory: [
      { name: 'Heiltrank', effect: 'heal', value: 30, icon: '🧪', count: 3 },
      { name: 'Sternenstaub', effect: 'damage_boost', value: 2, icon: '✨', count: 2 },
    ],
    questLog: [
      { id: 'q1', title: 'Sammle 5 Sterne', type: 'collect', target: 5, progress: 0, done: false },
      { id: 'q2', title: 'Besiege 10 Feinde', type: 'defeat', target: 10, progress: 0, done: false },
    ],
    projectiles: [],
    collectibles: [],
    damageNumbers: [],
    totalEnemiesDefeated: 0,
    totalItemsCollected: 0,
    attackPower: 1,
    switchCooldown: 0,
    lastQuizScore: 0,
    spawnTimer: 0,
    waveNumber: 1,
    showLevelUp: false,
    floatingTexts: [],
  },
  // Game-specific actions
  (set, get) => ({
    attack: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.attackCooldown > 0) return;

      const isLuna = state.currentCharacter === 'luna';
      const cooldown = isLuna ? 0.4 : 0.6;
      const baseDamage = isLuna ? 12 : 20;
      const damage = baseDamage * state.attackPower * (1 + state.playerLevel * 0.1);

      set({ attackCooldown: cooldown });
      return { damage, isRanged: isLuna };
    },

    damageEnemy: (enemyId, damage, hitPosition) => {
      const state = get();
      const enemy = state.enemies.find((e) => e.id === enemyId);
      if (!enemy) return;

      const newHp = enemy.hp - damage;
      const id = Date.now() + Math.random();

      if (newHp <= 0) {
        // Enemy defeated
        const xpGain = enemy.xpReward;
        const points = enemy.xpReward * 5;
        set({
          enemies: state.enemies.filter((e) => e.id !== enemyId),
          deadEnemies: [...state.deadEnemies, { ...enemy, deathTime: Date.now() }],
          totalEnemiesDefeated: state.totalEnemiesDefeated + 1,
          score: state.score + points,
          highScore: Math.max(state.score + points, state.highScore),
          damageNumbers: [
            ...state.damageNumbers,
            { id, value: Math.round(damage), position: hitPosition || enemy.position, color: '#ef4444', time: 0 },
          ],
          questLog: state.questLog.map((q) =>
            q.type === 'defeat' && !q.done
              ? { ...q, progress: Math.min(q.progress + 1, q.target), done: q.progress + 1 >= q.target }
              : q
          ),
        });
        get().gainXP(xpGain);

        // Quiz every 500 points
        const newScore = state.score + points;
        if (Math.floor(newScore / 500) > Math.floor(state.score / 500)) {
          setTimeout(() => get().triggerQuiz('math'), 800);
        }
      } else {
        set({
          enemies: state.enemies.map((e) =>
            e.id === enemyId ? { ...e, hp: newHp, hitFlash: 0.3, stunTimer: 0.2 } : e
          ),
          damageNumbers: [
            ...state.damageNumbers,
            { id, value: Math.round(damage), position: hitPosition || enemy.position, color: '#fbbf24', time: 0 },
          ],
        });
      }
    },

    gainXP: (amount) => {
      const state = get();
      const newXP = state.xp + amount;
      if (newXP >= state.xpToNext) {
        get().levelUp();
      } else {
        set({ xp: newXP });
      }
    },

    levelUp: () => {
      const state = get();
      const newLevel = state.playerLevel + 1;
      const newMaxHP = 100 + (newLevel - 1) * 20;
      set({
        playerLevel: newLevel,
        playerMaxHP: newMaxHP,
        playerHP: newMaxHP,
        xp: 0,
        xpToNext: Math.floor(100 * Math.pow(1.5, newLevel - 1)),
        showLevelUp: true,
        floatingTexts: [
          ...state.floatingTexts,
          { id: Date.now(), text: `Level ${newLevel}!`, color: '#f59e0b', time: 0 },
        ],
      });
      get().nextLevel();
      setTimeout(() => set({ showLevelUp: false }), 2000);
    },

    switchCharacter: () => {
      const state = get();
      if (state.switchCooldown > 0) return;
      const next = state.currentCharacter === 'luna' ? 'bruno' : 'luna';
      set({
        currentCharacter: next,
        switchCooldown: 2,
        floatingTexts: [
          ...state.floatingTexts,
          {
            id: Date.now(),
            text: next === 'luna' ? '🐰 Luna!' : '🐻 Bruno!',
            color: next === 'luna' ? '#c084fc' : '#92400e',
            time: 0,
          },
        ],
      });
    },

    useItem: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.itemCooldown > 0) return;

      // Use first available healing item
      const itemIdx = state.inventory.findIndex((i) => i.count > 0 && i.effect === 'heal');
      if (itemIdx < 0) {
        // Try damage boost
        const boostIdx = state.inventory.findIndex((i) => i.count > 0 && i.effect === 'damage_boost');
        if (boostIdx >= 0) {
          const item = state.inventory[boostIdx];
          const newInv = [...state.inventory];
          newInv[boostIdx] = { ...item, count: item.count - 1 };
          set({
            inventory: newInv,
            attackPower: state.attackPower + item.value,
            itemCooldown: 1,
          });
          setTimeout(() => {
            set((s) => ({ attackPower: Math.max(1, s.attackPower - item.value) }));
          }, 10000);
        }
        return;
      }

      const item = state.inventory[itemIdx];
      const newInv = [...state.inventory];
      newInv[itemIdx] = { ...item, count: item.count - 1 };
      set({
        inventory: newInv,
        playerHP: Math.min(state.playerHP + item.value, state.playerMaxHP),
        itemCooldown: 1,
      });
    },

    takePlayerDamage: (amount) => {
      const state = get();
      if (!state.isPlaying) return;
      const newHP = Math.max(0, state.playerHP - amount);
      set({ playerHP: newHP });
      if (newHP <= 0) {
        get().loseLife();
        if (get().lives > 0) {
          set({ playerHP: get().playerMaxHP });
        }
      }
    },

    spawnEnemy: (type, position) => {
      const enemy = createEnemy(type, position);
      set((state) => ({ enemies: [...state.enemies, enemy] }));
    },

    collectItem: (collectibleId) => {
      const state = get();
      const item = state.collectibles.find((c) => c.id === collectibleId);
      if (!item) return;

      set({
        collectibles: state.collectibles.filter((c) => c.id !== collectibleId),
        totalItemsCollected: state.totalItemsCollected + 1,
        score: state.score + 25,
        highScore: Math.max(state.score + 25, state.highScore),
        questLog: state.questLog.map((q) =>
          q.type === 'collect' && !q.done
            ? { ...q, progress: Math.min(q.progress + 1, q.target), done: q.progress + 1 >= q.target }
            : q
        ),
      });

      if (item.type === 'health') {
        set({ playerHP: Math.min(state.playerHP + 20, state.playerMaxHP) });
      } else if (item.type === 'potion') {
        const inv = [...state.inventory];
        const potionIdx = inv.findIndex((i) => i.effect === 'heal');
        if (potionIdx >= 0) inv[potionIdx] = { ...inv[potionIdx], count: inv[potionIdx].count + 1 };
        set({ inventory: inv });
      }
    },

    updateTimers: (delta) => {
      const state = get();
      const updates = {};
      if (state.attackCooldown > 0) updates.attackCooldown = Math.max(0, state.attackCooldown - delta);
      if (state.itemCooldown > 0) updates.itemCooldown = Math.max(0, state.itemCooldown - delta);
      if (state.switchCooldown > 0) updates.switchCooldown = Math.max(0, state.switchCooldown - delta);

      // Cleanup old damage numbers
      if (state.damageNumbers.length > 0) {
        updates.damageNumbers = state.damageNumbers
          .map((d) => ({ ...d, time: d.time + delta }))
          .filter((d) => d.time < 1.5);
      }
      if (state.floatingTexts.length > 0) {
        updates.floatingTexts = state.floatingTexts
          .map((t) => ({ ...t, time: t.time + delta }))
          .filter((t) => t.time < 2);
      }
      // Cleanup dead enemies after animation
      if (state.deadEnemies.length > 0) {
        updates.deadEnemies = state.deadEnemies.filter((e) => Date.now() - e.deathTime < 1000);
      }
      // Update enemy hit flash / stun
      if (state.enemies.length > 0) {
        let changed = false;
        const updatedEnemies = state.enemies.map((e) => {
          if (e.hitFlash > 0 || e.stunTimer > 0) {
            changed = true;
            return {
              ...e,
              hitFlash: Math.max(0, e.hitFlash - delta),
              stunTimer: Math.max(0, e.stunTimer - delta),
            };
          }
          return e;
        });
        if (changed) updates.enemies = updatedEnemies;
      }

      if (Object.keys(updates).length > 0) set(updates);
    },

    addProjectile: (position, direction, damage) => {
      const id = Date.now() + Math.random();
      set((state) => ({
        projectiles: [...state.projectiles, { id, position: [...position], direction: [...direction], damage, life: 2 }],
      }));
    },

    removeProjectile: (id) => {
      set((state) => ({
        projectiles: state.projectiles.filter((p) => p.id !== id),
      }));
    },

    resetRPGState: () => {
      enemyIdCounter = 0;
      set({
        playerHP: 100,
        playerMaxHP: 100,
        xp: 0,
        xpToNext: 100,
        playerLevel: 1,
        currentCharacter: 'luna',
        attackCooldown: 0,
        itemCooldown: 0,
        enemies: [],
        deadEnemies: [],
        inventory: [
          { name: 'Heiltrank', effect: 'heal', value: 30, icon: '🧪', count: 3 },
          { name: 'Sternenstaub', effect: 'damage_boost', value: 2, icon: '✨', count: 2 },
        ],
        questLog: [
          { id: 'q1', title: 'Sammle 5 Sterne', type: 'collect', target: 5, progress: 0, done: false },
          { id: 'q2', title: 'Besiege 10 Feinde', type: 'defeat', target: 10, progress: 0, done: false },
        ],
        projectiles: [],
        collectibles: [],
        damageNumbers: [],
        totalEnemiesDefeated: 0,
        totalItemsCollected: 0,
        attackPower: 1,
        switchCooldown: 0,
        spawnTimer: 0,
        waveNumber: 1,
        showLevelUp: false,
        floatingTexts: [],
      });
    },
  })
);

export default useRPGStore;
