import { createGameStore } from '../../../../shared/useSwarmStore';

/* ───────────────────────────── constants ───────────────────────────── */

export const ENEMY_TYPES = {
  grunt:   { health: 35, speed: 2.5,  damage: 8,  points: 100, scale: 1.0,  color: '#ef4444' },
  runner:  { health: 22, speed: 4.2,  damage: 10, points: 140, scale: 0.8,  color: '#f97316' },
  tank:    { health: 90, speed: 1.3,  damage: 18, points: 300, scale: 1.5,  color: '#7c3aed' },
  brute:   { health: 130, speed: 1.1, damage: 22, points: 450, scale: 1.8,  color: '#dc2626' },
  archon:  { health: 200, speed: 1.0, damage: 28, points: 800, scale: 2.1,  color: '#eab308' },
};

export const DOOM_WEAPONS = {
  repeater: {
    id: 'repeater',
    label: 'Repeater',
    ammoCost: 1,
    cooldown: 145,
    damage: 38,
    range: 52,
    hitRadius: 0.72,
    pierce: 1,
    color: '#22d3ee',
  },
  scatter: {
    id: 'scatter',
    label: 'Scatter',
    ammoCost: 3,
    cooldown: 620,
    damage: 62,
    range: 24,
    hitRadius: 1.35,
    pierce: 3,
    falloff: 0.55,
    color: '#f97316',
  },
  ripper: {
    id: 'ripper',
    label: 'Ripper',
    ammoCost: 2,
    cooldown: 86,
    damage: 30,
    range: 46,
    hitRadius: 0.95,
    pierce: 2,
    color: '#a855f7',
  },
};

export const DOOM_HAZARDS = [
  { id: 'acid-north', label: 'ACID', x: -18, z: -17, radius: 3.4, damage: 8, color: '#22c55e' },
  { id: 'reactor-west', label: 'CORE', x: 16.5, z: -13.5, radius: 3.1, damage: 10, color: '#f97316' },
  { id: 'spark-south', label: 'SPARK', x: -2, z: 18.5, radius: 3.0, damage: 9, color: '#a855f7' },
];

export const DOOM_PICKUPS = [
  { id: 'health-a', type: 'health', amount: 28, position: [-12, 0.6, -12] },
  { id: 'health-b', type: 'health', amount: 28, position: [12, 0.6, 12] },
  { id: 'ammo-a', type: 'ammo', amount: 18, position: [12, 0.6, -12] },
  { id: 'ammo-b', type: 'ammo', amount: 18, position: [-12, 0.6, 12] },
  { id: 'armor-a', type: 'armor', amount: 35, position: [-20, 0.6, 0] },
  { id: 'grenade-a', type: 'grenade', amount: 1, position: [20, 0.6, 0] },
  { id: 'scatter', type: 'weapon', weaponId: 'scatter', amount: 12, position: [0, 0.6, -22] },
  { id: 'ripper', type: 'weapon', weaponId: 'ripper', amount: 16, position: [0, 0.6, 22] },
];

export const DOOM_SEALS = [
  { id: 'seal-alpha', label: 'A', position: [-23, 0.9, -23] },
  { id: 'seal-beta', label: 'B', position: [23, 0.9, -23] },
  { id: 'seal-gamma', label: 'C', position: [23, 0.9, 23] },
  { id: 'seal-delta', label: 'D', position: [-23, 0.9, 23] },
];

const LEARN_QUESTIONS = [
  { subject: 'Deutsch', question: 'Welche Wortart ist "rennt" in: Der Mutant rennt schnell?', answer: 'Verb', options: ['Verb', 'Nomen', 'Adjektiv'] },
  { subject: 'Deutsch', question: 'Welche Wortart ist "dunkel" in: Der dunkle Gang bebt?', answer: 'Adjektiv', options: ['Verb', 'Adjektiv', 'Artikel'] },
  { subject: 'Deutsch', question: 'Welche Wortart ist "Reaktor" in: Der Reaktor glimmt?', answer: 'Nomen', options: ['Nomen', 'Adverb', 'Praeposition'] },
  { subject: 'Deutsch', question: 'Welche Wortart ist "hinter" in: Hinter der Tuer lauert Gefahr?', answer: 'Praeposition', options: ['Pronomen', 'Praeposition', 'Verb'] },
  { subject: 'Deutsch', question: 'Welche Wortart ist "leise" in: Der Kultist schleicht leise?', answer: 'Adverb', options: ['Adverb', 'Adjektiv', 'Nomen'] },
  { subject: 'Mathe', question: 'Ein Reaktor hat 18 Energiekerne. 7 sind leer. Wie viele leuchten?', answer: '11', options: ['10', '11', '12'] },
  { subject: 'Englisch', question: 'Was bedeutet "shield" im Arsenal?', answer: 'Schild', options: ['Schild', 'Schwert', 'Schalter'] },
  { subject: 'Sachkunde', question: 'Welche Kraft zieht dich im Sprung nach unten?', answer: 'Schwerkraft', options: ['Schwerkraft', 'Magnetismus', 'Licht'] },
];

/* ───────────────────────────── helpers ───────────────────────────── */

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

let enemyIdCounter = 0;

function createEnemy(position, type = 'grunt', wave = 1, extra = {}) {
  const profile = ENEMY_TYPES[type] || ENEMY_TYPES.grunt;
  const waveBonus = Math.max(0, wave - 1);
  const championBonus = extra.champion ? 55 + waveBonus * 7 : 0;
  const hp = profile.health + waveBonus * 5 + championBonus;
  return {
    id: ++enemyIdCounter,
    position: { x: position[0], y: position[1], z: position[2] },
    health: hp,
    maxHealth: hp,
    type,
    speed: profile.speed + waveBonus * 0.04,
    damage: profile.damage + Math.floor(waveBonus * 0.5),
    points: profile.points + waveBonus * 15,
    scale: profile.scale,
    color: profile.color,
    champion: Boolean(extra.champion),
    alive: true,
    lastAttack: 0,
    deathTimer: 0,
    stunnedTimer: 0,
    hitFlashTimer: 0,
  };
}

function generateWave(waveNumber, mode = 'arcade') {
  const enemies = [];
  const count = Math.min(4 + waveNumber * 2, 16);
  const radius = 14 + waveNumber * 2;

  // Boss every 4 waves
  if (waveNumber % 4 === 0) {
    enemies.push(createEnemy([0, 1, -(radius + 4)], 'archon', waveNumber));
  }

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + waveNumber * 0.3;
    const dist = radius + Math.random() * 4;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    let type = 'grunt';
    if (waveNumber >= 5 && i === 0) type = 'brute';
    else if (waveNumber >= 3 && i % 5 === 0) type = 'tank';
    else if (waveNumber >= 2 && i % 3 === 0) type = 'runner';

    const champion = mode === 'learn' && i === Math.floor(count / 2);
    enemies.push(createEnemy([x, 1, z], type, waveNumber, { champion }));
  }
  return enemies;
}

function getWeaponCycle(unlockedWeapons = ['repeater']) {
  return ['repeater', 'scatter', 'ripper'].filter((id) => unlockedWeapons.includes(id));
}

function pickupMessage(pickup) {
  if (pickup.type === 'health') return `+${pickup.amount} HP`;
  if (pickup.type === 'ammo') return `+${pickup.amount} Munition`;
  if (pickup.type === 'armor') return `+${pickup.amount} Armor`;
  if (pickup.type === 'grenade') return '+1 Granate';
  if (pickup.type === 'weapon') return `${DOOM_WEAPONS[pickup.weaponId]?.label ?? 'Waffe'} gefunden`;
  return 'Pickup';
}

/* ───────────────────────────── store ───────────────────────────── */

const useDoomStore = createGameStore(
  {
    // Player
    health: 100,
    maxHealth: 100,
    armor: 0,
    maxArmor: 100,
    ammo: 30,
    maxAmmo: 60,
    grenades: 2,
    weaponId: 'repeater',
    unlockedWeapons: ['repeater'],
    dashCooldown: 0,
    dashTimer: 0,
    grenadeCooldown: 0,
    gloryWindowTimer: 0,
    gloryTargetId: null,
    ripperCharge: 0,
    ripperModeTimer: 0,
    reactorSeals: [],
    collectedPickups: [],
    hazardCooldown: 0,
    hazardId: null,
    damageFlash: 0,

    // Player transform
    playerPosition: [0, 1.6, 0],
    playerRotation: 0, // yaw

    // Enemies
    enemies: [],
    enemiesKilled: 0,

    // Waves
    waveNumber: 0,
    waveCleared: false,

    // Mode
    mode: 'arcade',
    lastQuizScoreThreshold: 0,

    // Combat timers
    elapsed: 0,
    message: '',
    messageTimer: 0,
    isShooting: false,
    muzzleFlash: false,
    lastShootTime: 0,
  },
  (set, get) => ({
    /* ─── shoot ─── */
    shoot: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return false;
      const weapon = DOOM_WEAPONS[state.weaponId] ?? DOOM_WEAPONS.repeater;
      const ammoCost = state.ripperModeTimer > 0 ? Math.max(1, weapon.ammoCost - 1) : weapon.ammoCost;
      if (state.ammo < ammoCost) {
        set({ message: 'Keine Munition!', messageTimer: 0.8 });
        return false;
      }
      const now = Date.now();
      const cooldown = state.ripperModeTimer > 0 ? weapon.cooldown * 0.6 : weapon.cooldown;
      if (now - state.lastShootTime < cooldown) return false;

      set({
        ammo: state.ammo - ammoCost,
        isShooting: true,
        muzzleFlash: true,
        lastShootTime: now,
      });
      setTimeout(() => set({ isShooting: false, muzzleFlash: false }), 100);
      return weapon;
    },

    /* ─── take damage ─── */
    takeDamage: (amount) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;
      const armorBlock = Math.min(state.armor, Math.ceil(amount * 0.62));
      const healthDamage = Math.max(0, amount - armorBlock);
      const newArmor = Math.max(0, state.armor - armorBlock);
      const newHealth = Math.max(0, state.health - healthDamage);
      if (newHealth <= 0) {
        set({ health: 0, armor: newArmor, damageFlash: 1, isPlaying: false, isGameOver: true });
      } else {
        set({ health: newHealth, armor: newArmor, damageFlash: 1 });
      }
    },

    finishEnemy: (id, source = 'kill') => {
      const state = get();
      const enemy = state.enemies.find(e => e.id === id && e.alive);
      if (!enemy) return false;

      const sourceBonus = source === 'glory' ? 110 : source === 'grenade' ? 55 : 0;
      const championBonus = enemy.champion ? 180 : 0;
      const points = enemy.points + sourceBonus + championBonus;
      const newScore = state.score + points;
      const newKills = state.enemiesKilled + 1;

      const updatedEnemies = state.enemies.map(e =>
        e.id === id ? { ...e, alive: false, deathTimer: 0.4 } : e
      );

      const aliveCount = updatedEnemies.filter(e => e.alive).length;

      set({
        enemies: updatedEnemies,
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
        enemiesKilled: newKills,
        ammo: source === 'glory' ? Math.min(state.maxAmmo, state.ammo + 8) : state.ammo,
        health: source === 'glory' ? Math.min(state.maxHealth, state.health + 14) : state.health,
        ripperCharge: clamp(state.ripperCharge + (enemy.champion ? 24 : 12), 0, 100),
        gloryTargetId: state.gloryTargetId === id ? null : state.gloryTargetId,
        gloryWindowTimer: state.gloryTargetId === id ? 0 : state.gloryWindowTimer,
        message: source === 'glory' ? `Glory-Finisher +${points}` : `Kill! +${points}`,
        messageTimer: 0.75,
      });

      // Wave cleared
      if (aliveCount === 0) {
        set({ waveCleared: true, message: 'Welle geschafft!', messageTimer: 1.5 });
        setTimeout(() => {
          const latest = get();
          if (!latest.isPlaying || latest.isPaused) return;
          latest.spawnWave();
        }, 2000);
      }

      // Quiz trigger every 500 points
      const prevThreshold = state.lastQuizScoreThreshold;
      const nextThreshold = Math.floor(newScore / 500);
      if (nextThreshold > prevThreshold && state.mode === 'learn') {
        set({ lastQuizScoreThreshold: nextThreshold });
        setTimeout(() => get().triggerDoomQuiz(), 300);
      }
      if (enemy.champion && state.mode === 'learn') {
        setTimeout(() => get().triggerDoomQuiz(), 250);
      }
      return true;
    },

    killEnemy: (id) => get().finishEnemy(id),

    damageEnemy: (id, damage, source = 'shot') => {
      const state = get();
      const enemy = state.enemies.find(e => e.id === id && e.alive);
      if (!enemy) return { hit: false, killed: false, stunned: false };
      const nextHealth = enemy.health - damage;
      if (nextHealth <= 0) {
        const killed = get().finishEnemy(id, source);
        return { hit: true, killed, stunned: false };
      }

      const shouldStun = nextHealth <= enemy.maxHealth * 0.28 && enemy.stunnedTimer <= 0;
      set({
        enemies: state.enemies.map(e => (
          e.id === id
            ? {
                ...e,
                health: nextHealth,
                stunnedTimer: shouldStun ? 2.6 : e.stunnedTimer,
                hitFlashTimer: 0.12,
              }
            : e
        )),
        gloryTargetId: shouldStun ? id : state.gloryTargetId,
        gloryWindowTimer: shouldStun ? 2.6 : state.gloryWindowTimer,
        message: shouldStun ? 'Glory-Fenster!' : state.message,
        messageTimer: shouldStun ? 0.9 : state.messageTimer,
      });
      return { hit: true, killed: false, stunned: shouldStun };
    },

    /* ─── spawn wave ─── */
    spawnWave: () => {
      const state = get();
      const nextWave = state.waveNumber + 1;
      const newEnemies = generateWave(nextWave, state.mode);
      set({
        enemies: newEnemies,
        waveNumber: nextWave,
        waveCleared: false,
        level: nextWave,
        message: `Welle ${nextWave}`,
        messageTimer: 1.2,
      });
    },

    /* ─── pickups ─── */
    pickupHealth: (amount = 25) => {
      set(s => ({
        health: Math.min(s.maxHealth, s.health + amount),
        message: `+${amount} HP`,
        messageTimer: 0.6,
      }));
    },

    pickupAmmo: (amount = 15) => {
      set(s => ({
        ammo: Math.min(s.maxAmmo, s.ammo + amount),
        message: `+${amount} Munition`,
        messageTimer: 0.6,
      }));
    },

    collectPickup: (pickup) => {
      const state = get();
      if (!pickup || state.collectedPickups.includes(pickup.id)) return;
      const nextCollected = [...state.collectedPickups, pickup.id];
      const nextUnlocked = pickup.type === 'weapon'
        ? Array.from(new Set([...state.unlockedWeapons, pickup.weaponId]))
        : state.unlockedWeapons;
      set({
        collectedPickups: nextCollected,
        health: pickup.type === 'health' ? Math.min(state.maxHealth, state.health + pickup.amount) : state.health,
        ammo: pickup.type === 'ammo' || pickup.type === 'weapon'
          ? Math.min(state.maxAmmo, state.ammo + (pickup.amount ?? 0))
          : state.ammo,
        armor: pickup.type === 'armor' ? Math.min(state.maxArmor, state.armor + pickup.amount) : state.armor,
        grenades: pickup.type === 'grenade' ? Math.min(5, state.grenades + pickup.amount) : state.grenades,
        unlockedWeapons: nextUnlocked,
        weaponId: pickup.type === 'weapon' ? pickup.weaponId : state.weaponId,
        message: pickupMessage(pickup),
        messageTimer: 0.9,
      });
      get().addScore(pickup.type === 'weapon' ? 120 : 35);
    },

    collectSeal: (sealId) => {
      const state = get();
      if (state.reactorSeals.includes(sealId)) return;
      const seals = [...state.reactorSeals, sealId];
      set({
        reactorSeals: seals,
        ripperCharge: clamp(state.ripperCharge + 18, 0, 100),
        message: `Reaktor-Siegel ${seals.length}/4`,
        messageTimer: 1,
      });
      get().addScore(180);
      if (seals.length >= DOOM_SEALS.length) {
        set({
          ammo: Math.min(get().maxAmmo, get().ammo + 18),
          grenades: Math.min(5, get().grenades + 1),
          message: 'Reaktor stabilisiert: Ripper geladen',
          messageTimer: 1.5,
          ripperCharge: 100,
        });
      }
    },

    switchWeapon: () => {
      const state = get();
      const cycle = getWeaponCycle(state.unlockedWeapons);
      const index = cycle.indexOf(state.weaponId);
      const weaponId = cycle[(index + 1) % cycle.length] ?? 'repeater';
      set({
        weaponId,
        message: DOOM_WEAPONS[weaponId]?.label ?? 'Weapon',
        messageTimer: 0.65,
      });
    },

    tryDash: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.dashCooldown > 0) return false;
      set({
        dashTimer: 0.18,
        dashCooldown: 1.25,
        message: 'Dash',
        messageTimer: 0.35,
      });
      return true;
    },

    throwGrenade: (origin, direction) => {
      const state = get();
      if (state.grenades <= 0 || state.grenadeCooldown > 0 || !state.isPlaying || state.isPaused) return false;
      const impact = {
        x: clamp(origin[0] + direction[0] * 9, -26, 26),
        y: 1,
        z: clamp(origin[2] + direction[2] * 9, -26, 26),
      };
      const radius = 5.2;
      const enemies = state.enemies.map((enemy) => {
        if (!enemy.alive) return enemy;
        const dx = enemy.position.x - impact.x;
        const dz = enemy.position.z - impact.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > radius) return enemy;
        const damage = Math.round(95 * (1 - dist / radius) + 38);
        return {
          ...enemy,
          health: enemy.health - damage,
          hitFlashTimer: 0.16,
        };
      });

      set({
        grenades: state.grenades - 1,
        grenadeCooldown: 1.1,
        enemies,
        message: 'Granate',
        messageTimer: 0.7,
      });

      const defeated = enemies.filter(enemy => enemy.alive && enemy.health <= 0).map(enemy => enemy.id);
      defeated.forEach((id) => get().finishEnemy(id, 'grenade'));
      return impact;
    },

    performGloryFinisher: (playerPos) => {
      const state = get();
      if (!state.gloryTargetId || state.gloryWindowTimer <= 0) return false;
      const enemy = state.enemies.find(e => e.id === state.gloryTargetId && e.alive);
      if (!enemy) return false;
      const dx = playerPos[0] - enemy.position.x;
      const dz = playerPos[2] - enemy.position.z;
      if (Math.sqrt(dx * dx + dz * dz) > 3.2) return false;
      return get().finishEnemy(enemy.id, 'glory');
    },

    activateRipperMode: () => {
      const state = get();
      if (state.ripperCharge < 100 || state.ripperModeTimer > 0) return false;
      set({
        ripperCharge: 0,
        ripperModeTimer: 6,
        weaponId: state.unlockedWeapons.includes('ripper') ? 'ripper' : state.weaponId,
        message: 'RIPPER-MODUS',
        messageTimer: 1.3,
      });
      return true;
    },

    touchHazard: (hazard) => {
      const state = get();
      if (!hazard || state.hazardCooldown > 0) return;
      set({
        hazardCooldown: 0.85,
        hazardId: hazard.id,
        message: `${hazard.label} Zone`,
        messageTimer: 0.65,
      });
      get().takeDamage(hazard.damage);
    },

    /* ─── player position ─── */
    setPlayerPosition: (pos) => set({ playerPosition: pos }),
    setPlayerRotation: (yaw) => set({ playerRotation: yaw }),

    /* ─── tick timers ─── */
    tickTimers: (delta) => {
      set(s => ({
        damageFlash: Math.max(0, s.damageFlash - delta * 3),
        messageTimer: Math.max(0, s.messageTimer - delta),
        dashCooldown: Math.max(0, s.dashCooldown - delta),
        dashTimer: Math.max(0, s.dashTimer - delta),
        grenadeCooldown: Math.max(0, s.grenadeCooldown - delta),
        gloryWindowTimer: Math.max(0, s.gloryWindowTimer - delta),
        ripperModeTimer: Math.max(0, s.ripperModeTimer - delta),
        hazardCooldown: Math.max(0, s.hazardCooldown - delta),
        elapsed: s.elapsed + delta,
        // Remove dead enemies after death animation
        enemies: s.enemies.map(e => {
          if (!e.alive && e.deathTimer > 0) {
            return { ...e, deathTimer: Math.max(0, e.deathTimer - delta) };
          }
          return {
            ...e,
            stunnedTimer: Math.max(0, e.stunnedTimer - delta),
            hitFlashTimer: Math.max(0, e.hitFlashTimer - delta),
          };
        }).filter(e => e.alive || e.deathTimer > 0),
      }));
    },

    /* ─── update enemies (move toward player) ─── */
    updateEnemies: (playerPos, delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;

      const now = Date.now();

      const enemies = state.enemies.map(enemy => {
        if (!enemy.alive) return enemy;

        const dx = playerPos[0] - enemy.position.x;
        const dz = playerPos[2] - enemy.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Attack when close
        if (dist < 1.8) {
          if (enemy.stunnedTimer > 0) return enemy;
          if (now - enemy.lastAttack > 1000) {
            get().takeDamage(enemy.damage);
            return { ...enemy, lastAttack: now };
          }
          return enemy;
        }

        // Move toward player
        if (dist > 0.1) {
          const moveSpeed = enemy.speed * (enemy.stunnedTimer > 0 ? 0.1 : 1) * delta;
          const nx = (dx / dist) * moveSpeed;
          const nz = (dz / dist) * moveSpeed;
          return {
            ...enemy,
            position: {
              x: clamp(enemy.position.x + nx, -28, 28),
              y: enemy.position.y,
              z: clamp(enemy.position.z + nz, -28, 28),
            },
          };
        }

        return enemy;
      });

      set({ enemies });
    },

    /* ─── mode ─── */
    setMode: (mode) => set({ mode }),

    /* ─── quiz integration ─── */
    triggerDoomQuiz: () => {
      const state = get();
      if (state.mode !== 'learn' || state.quizActive) return;
      const q = LEARN_QUESTIONS[Math.floor(Math.random() * LEARN_QUESTIONS.length)];
      set({
        quizActive: true,
        quizQuestion: { ...q, type: q.subject === 'Mathe' ? 'math' : 'doom-german' },
      });
    },

    answerQuiz: (answer) => {
      const state = get();
      if (!state.quizQuestion) return false;
      const correct = answer === state.quizQuestion.answer;
      const streak = correct ? state.quizStreak + 1 : 0;
      set({
        quizActive: false,
        quizQuestion: null,
        quizScore: state.quizScore + (correct ? 1 : 0),
        quizStreak: streak,
        score: correct ? state.score + 100 * streak : state.score,
        ammo: correct ? Math.min(state.maxAmmo, state.ammo + 20) : state.ammo,
        message: correct ? `Richtig! +20 Munition (Streak x${streak})` : 'Falsch!',
        messageTimer: 1.2,
      });
      if (!correct) {
        setTimeout(() => get().takeDamage(5), 100);
      }
      return correct;
    },

    /* ─── quiz bonus (for LearncadeQuiz onBonus) ─── */
    quizBonus: () => {
      set(s => ({
        ammo: Math.min(s.maxAmmo, s.ammo + 20),
        message: '🔫 +20 Munition!',
        messageTimer: 1.0,
      }));
    },

    /* ─── start game (override base) ─── */
    startGame: () => {
      enemyIdCounter = 0;
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        level: 1,
        speed: 1,
        health: 100,
        armor: 0,
        ammo: 30,
        grenades: 2,
        weaponId: 'repeater',
        unlockedWeapons: ['repeater'],
        dashCooldown: 0,
        dashTimer: 0,
        grenadeCooldown: 0,
        gloryWindowTimer: 0,
        gloryTargetId: null,
        ripperCharge: 0,
        ripperModeTimer: 0,
        reactorSeals: [],
        collectedPickups: [],
        hazardCooldown: 0,
        hazardId: null,
        damageFlash: 0,
        playerPosition: [0, 1.6, 0],
        playerRotation: 0,
        enemies: [],
        enemiesKilled: 0,
        waveNumber: 0,
        waveCleared: false,
        elapsed: 0,
        isShooting: false,
        muzzleFlash: false,
        lastShootTime: 0,
        lastQuizScoreThreshold: 0,
        quizActive: false,
        quizScore: 0,
        quizStreak: 0,
        message: 'Arena online!',
        messageTimer: 2,
      });
      // Spawn first wave after small delay
      setTimeout(() => get().spawnWave(), 300);
    },
  })
);

export default useDoomStore;
