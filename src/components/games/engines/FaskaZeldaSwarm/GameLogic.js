import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaZeldaSwarm Game Store
 * Top-down adventure with sword combat, rupees, room transitions
 */

let entityIdCounter = 0;

const LEARN_SHRINES = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "funkelt" in: Der Kristall funkelt hell?',
    word: 'funkelt',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "alte" in: Die alte Tuer knarrt?',
    word: 'alte',
    answer: 'Adjektiv',
    options: ['Adjektiv', 'Verb', 'Pronomen'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "unter" in: Unter der Bruecke wartet ein Schleim?',
    word: 'unter',
    answer: 'Praeposition',
    options: ['Nomen', 'Praeposition', 'Adverb'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "mutig" in: Link kaempft mutig?',
    word: 'mutig',
    answer: 'Adverb',
    options: ['Verb', 'Artikel', 'Adverb'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "zwei" in: Zwei Fackeln brennen?',
    word: 'zwei',
    answer: 'Zahlwort',
    options: ['Zahlwort', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist das Subjekt in: Der Drache bewacht den Turm?',
    word: 'Der Drache',
    answer: 'Der Drache',
    options: ['Der Drache', 'bewacht', 'den Turm'],
  },
  {
    subject: 'Mathe',
    prompt: 'Welche Zahl oeffnet das Tor? 9 x 6 = ?',
    word: '9 x 6',
    answer: '54',
    options: ['45', '54', '63'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "courage"?',
    word: 'courage',
    answer: 'Mut',
    options: ['Mut', 'Karte', 'Bruecke'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was ist eine Quelle?',
    word: 'Quelle',
    answer: 'Dort beginnt ein Bach oder Fluss',
    options: ['Ein hoher Turm', 'Dort beginnt ein Bach oder Fluss', 'Ein Werkzeug fuer Holz'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein zusammengesetztes Nomen?',
    word: 'Mondtor',
    answer: 'Mondtor',
    options: ['Mondtor', 'mutig', 'rennen'],
  },
  {
    subject: 'Mathe',
    prompt: 'Du findest 4 Truhen mit je 7 Rubinen. Wie viele Rubine sind das?',
    word: '4 x 7',
    answer: '28',
    options: ['24', '28', '32'],
  },
];

const ZELDA_GOALS = [
  { id: 'combo-5', label: '5er Kampf-Serie', type: 'bestCombo', target: 5, reward: 160 },
  { id: 'blocks-3', label: '3 perfekte Blocks', type: 'perfectBlocks', target: 3, reward: 180 },
  { id: 'spin-5', label: '5 Spin-Treffer', type: 'spinHits', target: 5, reward: 190 },
  { id: 'bomb-hits-4', label: '4 Bombentreffer', type: 'bombHits', target: 4, reward: 210 },
  { id: 'lock-finisher-3', label: '3 Lock-on-Finisher', type: 'lockOnKills', target: 3, reward: 210 },
  { id: 'tool-seals-4', label: '4 Werkzeug-Siegel', type: 'toolSeals', target: 4, reward: 260 },
  { id: 'rooms-3', label: '3 Raeume oeffnen', type: 'roomsOpened', target: 3, reward: 220 },
  { id: 'boss-1', label: 'Tempelritter bezwingen', type: 'bossDefeated', target: 1, reward: 420 },
  { id: 'shrines-3', label: '3 Wort-Schreine', type: 'shrinesSolved', target: 3, reward: 240, learnOnly: true },
];

const ZELDA_CONTRACTS = [
  { id: 'roll-3', label: '3 Rollen ausweichen', type: 'rolls', target: 3, duration: 28, reward: { score: 140, rupees: 3, stamina: 18 } },
  { id: 'arrow-2', label: '2 Pfeiltreffer landen', type: 'arrowHits', target: 2, duration: 34, reward: { score: 170, arrows: 3, courage: 16 } },
  { id: 'seal-1', label: '1 Werkzeug-Siegel', type: 'toolSeals', target: 1, duration: 42, reward: { score: 190, rupees: 4, stamina: 22 } },
  { id: 'bomb-place-2', label: '2 Bomben platzieren', type: 'bombsPlaced', target: 2, duration: 38, reward: { score: 150, bombs: 1, courage: 12 } },
  { id: 'bomb-hit-1', label: '1 Bombentreffer', type: 'bombHits', target: 1, duration: 46, reward: { score: 230, bombs: 2, courage: 18 } },
  { id: 'block-2', label: '2 perfekte Blocks', type: 'perfectBlocks', target: 2, duration: 44, reward: { score: 210, health: 1, stamina: 28 } },
  { id: 'combo-3', label: '3er Kampf-Serie', type: 'bestCombo', target: 3, duration: 40, reward: { score: 220, rupees: 5, courage: 18 } },
  { id: 'item-4', label: '4 Funde sammeln', type: 'itemsCollected', target: 4, duration: 52, reward: { score: 180, arrows: 2, bombs: 1 } },
  { id: 'room-open', label: '1 Raumtor oeffnen', type: 'roomsOpened', target: 1, duration: 62, reward: { score: 260, rupees: 6, health: 1, courage: 20 } },
  { id: 'lock-kill', label: '1 Lock-on-Finisher', type: 'lockOnKills', target: 1, duration: 56, reward: { score: 260, arrows: 4, courage: 24 } },
  { id: 'learn-shrine', label: '1 Wort-Schrein loesen', type: 'shrinesSolved', target: 1, duration: 70, reward: { score: 280, rupees: 5, stamina: 30 }, mode: 'learn' },
];

const SWITCH_PROFILES = {
  blade: { label: 'BLADE', source: 'Schwert' },
  arrow: { label: 'ARROW', source: 'Bogen' },
  bomb: { label: 'BOMB', source: 'Bombe' },
  shield: { label: 'GUARD', source: 'Schild' },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function createStats() {
  return {
    bestCombo: 0,
    perfectBlocks: 0,
    spinHits: 0,
    roomsOpened: 0,
    shrinesSolved: 0,
    enemiesDefeated: 0,
    bombsPlaced: 0,
    bombHits: 0,
    lockOnKills: 0,
    bossDefeated: 0,
    toolSeals: 0,
    rolls: 0,
    arrowsFired: 0,
    arrowHits: 0,
    itemsCollected: 0,
    keysCollected: 0,
  };
}

function statValue(state, goal) {
  return state.stats?.[goal.type] || 0;
}

function activeContractsForMode(mode) {
  return ZELDA_CONTRACTS.filter((contract) => !contract.mode || contract.mode === mode);
}

function contractProgress(state, contract = state.activeContract) {
  if (!contract) return 0;
  return Math.max(0, (state.stats?.[contract.type] || 0) - (contract.startValue || 0));
}

function activeGoalsForMode(mode) {
  return ZELDA_GOALS
    .filter((goal) => mode === 'learn' || !goal.learnOnly)
    .map((goal) => ({ ...goal, complete: false }));
}

function distanceXZ(a, b) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dz * dz);
}

function normalizeXZ(dx, dz) {
  const length = Math.max(0.001, Math.sqrt(dx * dx + dz * dz));
  return [dx / length, 0, dz / length];
}

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

function createGuardian(position, roomId, mode) {
  return {
    id: ++entityIdCounter,
    position: [...position],
    health: 34 + roomId * 4,
    maxHealth: 34 + roomId * 4,
    type: mode === 'learn' ? 'scribe' : 'guardian',
    speed: 1.15 + roomId * 0.04,
    damage: 12,
    points: mode === 'learn' ? 180 : 150,
    alive: true,
    bouncePhase: Math.random() * Math.PI * 2,
    direction: [Math.random() - 0.5, 0, Math.random() - 0.5],
    changeTimer: 0,
    lastAttack: 0,
    lastShot: 0,
    attackWindup: 0,
    knockback: [0, 0, 0],
    knockbackTimer: 0,
  };
}

function createTempleKnight(position, roomId, mode) {
  return {
    id: ++entityIdCounter,
    position: [...position],
    health: 150 + roomId * 16,
    maxHealth: 150 + roomId * 16,
    type: 'boss',
    speed: 1.35 + roomId * 0.03,
    damage: 18,
    points: mode === 'learn' ? 820 : 760,
    alive: true,
    bouncePhase: 0,
    direction: [0, 0, 1],
    changeTimer: 0,
    lastAttack: 0,
    lastShot: 0,
    attackWindup: 0,
    phase: 1,
    knockback: [0, 0, 0],
    knockbackTimer: 0,
  };
}

function makeLearnShrines(roomId) {
  const task = LEARN_SHRINES[roomId % LEARN_SHRINES.length];
  return task.options.map((label, index) => ({
    id: ++entityIdCounter,
    label,
    correct: label === task.answer,
    subject: task.subject,
    prompt: task.prompt,
    word: task.word,
    answer: task.answer,
    position: [[-4.8, 0.25, -2.8], [0, 0.25, -4.6], [4.8, 0.25, -2.8]][index],
    solved: false,
    failed: false,
  }));
}

function generateRoom(roomId, mode = 'arcade') {
  const enemies = [];
  const items = [];
  const bushes = [];
  const pots = [];
  const switches = [];
  const shrines = mode === 'learn' ? makeLearnShrines(roomId) : [];

  const bossRoom = roomId > 0 && (roomId + 1) % 5 === 0;
  const count = bossRoom ? Math.min(3 + Math.floor(roomId / 2), 6) : Math.min(3 + roomId, 8);

  if (bossRoom) {
    enemies.push(createTempleKnight([0, 0.72, -4.6], roomId, mode));
  }

  // Enemies
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 12;
    const z = (Math.random() - 0.5) * 12;
    if (Math.abs(x) < 2 && Math.abs(z) < 2) continue; // Don't spawn on player
    if (bossRoom && i === 0) {
      enemies.push(createBat([x, 0.5, z]));
    } else if (roomId >= 2 && i === 0) {
      enemies.push(createGuardian([x, 0.55, z], roomId, mode));
    } else if (Math.random() < 0.3 && roomId > 1) {
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

  if (roomId > 0 && roomId % 2 === 1) {
    const kind = roomId % 4 === 1 ? 'arrow' : 'blade';
    switches.push({
      id: ++entityIdCounter,
      position: [0, 0.12, 3.8],
      active: false,
      kind,
      label: SWITCH_PROFILES[kind].label,
    });
  }

  if (roomId > 1 && roomId % 3 === 2) {
    switches.push({
      id: ++entityIdCounter,
      position: [-4.4, 0.12, -3.8],
      active: false,
      kind: 'bomb',
      label: SWITCH_PROFILES.bomb.label,
    });
  }

  if (roomId > 2 && roomId % 4 === 0) {
    switches.push({
      id: ++entityIdCounter,
      position: [4.4, 0.12, -3.8],
      active: false,
      kind: 'shield',
      label: SWITCH_PROFILES.shield.label,
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

  if (roomId > 0 && roomId % 3 === 0) {
    items.push({
      id: ++entityIdCounter,
      type: 'arrow',
      position: [4.2, 0.3, 3.8],
      value: 4,
      collected: false,
    });
  }

  if (roomId > 1 && Math.random() < 0.45) {
    items.push({
      id: ++entityIdCounter,
      type: 'bomb',
      position: [-4.2, 0.3, 3.8],
      value: 2,
      collected: false,
    });
  }

  return { enemies, items, bushes, pots, switches, shrines };
}

function roomUnlocked(state, enemies = state.enemies, switches = state.switches, shrines = state.shrines) {
  const enemiesCleared = enemies.every((enemy) => !enemy.alive);
  const switchesCleared = switches.every((button) => button.active);
  const shrinesCleared = state.mode !== 'learn' || shrines.length === 0 || shrines.some((shrine) => shrine.correct && shrine.solved);
  return enemiesCleared && switchesCleared && shrinesCleared;
}

const useZeldaStore = createGameStore(
 {
    mode: 'arcade',
    // Player
    health: 6, // Half hearts (max 6 = 3 full hearts)
    maxHealth: 6,
    rupees: 0,
    keys: 0,
    relics: 0,
    arrows: 8,
    maxArrows: 20,
    bombs: 3,
    maxBombs: 8,
    inventory: [],
    playerPosition: [0, 0.5, 0],
    playerDirection: [0, 0, -1], // facing direction for sword
    targetLockId: null,
    roomRevision: 0,
    invulnerable: false,
    invulnerableTimer: 0,
    stamina: 100,
    maxStamina: 100,
    combo: 0,
    comboTimer: 0,
    courageCharge: 0,
    courageTimer: 0,
    rolling: false,
    rollTimer: 0,
    rollCooldown: 0,
    rollDirection: [0, 0, -1],
    shieldActive: false,
    shieldFlash: 0,
    arrowCooldown: 0,
    spinAttacking: false,
    spinTimer: 0,
    spinCooldown: 0,

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
    switches: [],
    shrines: [],
    arrowsInFlight: [],
    enemyProjectiles: [],
    activeBombs: [],
    projectileIdCounter: 0,
    roomUnlocked: false,
    roomMessage: 'Finde das Nordtor.',
    roomMessageTimer: 2,

    // Room transition
    transitioning: false,
    transitionDirection: null,

    // Score tracking for quiz
    lastQuizScore: 0,
    stats: createStats(),
    goals: activeGoalsForMode('arcade'),
    activeContract: null,
    contractIndex: 0,
    contractTimer: 0,
    contractCooldown: 2,
    contractMedals: 0,
    contractFails: 0,
  },
  (set, get) => ({
    startNextContract: () => {
      const state = get();
      const pool = activeContractsForMode(state.mode);
      if (!state.isPlaying || state.isPaused || pool.length === 0) return;
      const contract = pool[state.contractIndex % pool.length];
      set({
        activeContract: { ...contract, startValue: state.stats?.[contract.type] || 0 },
        contractIndex: state.contractIndex + 1,
        contractTimer: contract.duration,
        roomMessage: `Raumauftrag: ${contract.label}`,
        roomMessageTimer: 1.25,
      });
    },

    completeContract: () => {
      const state = get();
      const contract = state.activeContract;
      if (!contract) return;
      const reward = contract.reward || {};
      const nextScore = state.score + (reward.score || 0);
      set((s) => ({
        score: nextScore,
        highScore: Math.max(s.highScore, nextScore),
        rupees: s.rupees + (reward.rupees || 0),
        arrows: clamp(s.arrows + (reward.arrows || 0), 0, s.maxArrows),
        bombs: clamp(s.bombs + (reward.bombs || 0), 0, s.maxBombs),
        health: clamp(s.health + (reward.health || 0), 0, s.maxHealth),
        stamina: clamp(s.stamina + (reward.stamina || 0), 0, s.maxStamina),
        courageCharge: clamp(s.courageCharge + (reward.courage || 0), 0, 100),
        contractMedals: s.contractMedals + 1,
        activeContract: null,
        contractTimer: 0,
        contractCooldown: 2.6,
        roomMessage: `Auftrag geschafft +${reward.score || 0}`,
        roomMessageTimer: 1.35,
      }));
    },

    failContract: () => {
      const state = get();
      const contract = state.activeContract;
      if (!contract) return;
      set((s) => ({
        activeContract: null,
        contractTimer: 0,
        contractCooldown: 2,
        contractFails: s.contractFails + 1,
        roomMessage: `Auftrag verpasst: ${contract.label}`,
        roomMessageTimer: 1.2,
      }));
    },

    updateContract: (delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver) return;
      if (!state.activeContract) {
        const nextCooldown = Math.max(0, state.contractCooldown - delta);
        if (nextCooldown <= 0) {
          set({ contractCooldown: 0 });
          get().startNextContract();
        } else {
          set({ contractCooldown: nextCooldown });
        }
        return;
      }
      if (contractProgress(state) >= state.activeContract.target) {
        get().completeContract();
        return;
      }
      const nextTimer = Math.max(0, state.contractTimer - delta);
      if (nextTimer <= 0) {
        get().failContract();
      } else {
        set({ contractTimer: nextTimer });
      }
    },

    evaluateGoals: () => {
      const state = get();
      let reward = 0;
      let completedLabel = '';
      const goals = state.goals.map((goal) => {
        if (goal.complete || statValue(state, goal) < goal.target) return goal;
        reward += goal.reward;
        completedLabel = goal.label;
        return { ...goal, complete: true };
      });
      if (reward <= 0) return;
      set((s) => ({
        goals,
        score: s.score + reward,
        highScore: Math.max(s.highScore, s.score + reward),
        rupees: s.rupees + Math.ceil(reward / 40),
        arrows: Math.min(s.maxArrows, s.arrows + 3),
        courageCharge: Math.min(100, s.courageCharge + 24),
        roomMessage: `${completedLabel} +${reward}`,
        roomMessageTimer: 1.4,
      }));
    },

    addCourageCharge: (amount) => {
      const state = get();
      if (state.courageTimer > 0) return;
      const nextCharge = clamp(state.courageCharge + amount, 0, 100);
      if (nextCharge >= 100) {
        set({
          courageCharge: 0,
          courageTimer: 6,
          stamina: state.maxStamina,
          roomMessage: 'Mut-Fokus aktiv',
          roomMessageTimer: 1.2,
        });
        return;
      }
      set({ courageCharge: nextCharge });
    },

    setMode: (mode) => {
      set({ mode });
      const state = get();
      if (state.isPlaying || state.isGameOver) setTimeout(() => get().startGame(), 0);
    },

    // Initialize game
    initGame: () => {
      entityIdCounter = 0;
      const mode = get().mode;
      const room = generateRoom(0, mode);
      set({
        health: 6,
        rupees: 0,
        keys: 0,
        relics: 0,
        arrows: mode === 'learn' ? 12 : 8,
        bombs: mode === 'learn' ? 5 : 3,
        inventory: [],
        playerPosition: [0, 0.5, 0],
        playerDirection: [0, 0, -1],
        targetLockId: null,
        roomRevision: 0,
        stamina: 100,
        combo: 0,
        comboTimer: 0,
        courageCharge: 0,
        courageTimer: 0,
        rolling: false,
        rollTimer: 0,
        rollCooldown: 0,
        rollDirection: [0, 0, -1],
        shieldActive: false,
        shieldFlash: 0,
        spinAttacking: false,
        spinTimer: 0,
        spinCooldown: 0,
        currentRoom: 0,
        enemies: room.enemies,
        items: room.items,
        bushes: room.bushes,
        pots: room.pots,
        switches: room.switches,
        shrines: room.shrines,
        arrowsInFlight: [],
        enemyProjectiles: [],
        activeBombs: [],
        projectileIdCounter: 0,
        roomUnlocked: false,
        roomMessage: mode === 'learn' ? 'Triff den richtigen Wort-Schrein und sichere den Raum.' : 'Besiege Gegner und loese Schalter fuer das Tor.',
        roomMessageTimer: 2.4,
        swordSwinging: false,
        swordCooldown: 0,
        invulnerable: false,
        lastQuizScore: 0,
        stats: createStats(),
        goals: activeGoalsForMode(mode),
        activeContract: null,
        contractIndex: 0,
        contractTimer: 0,
        contractCooldown: 2,
        contractMedals: 0,
        contractFails: 0,
        transitioning: false,
      });
    },

    // Swing sword
    swingSword: () => {
      const state = get();
      if (state.swordSwinging || state.swordCooldown > 0 || state.rolling || !state.isPlaying || state.isPaused)
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
    hitEnemy: (enemyId, knockbackDir, damage = 10, source = 'sword') => {
      const state = get();
      if (source === 'sword' && state.swordHitIds.has(enemyId)) return; // Already hit this swing

	      const newHitIds = new Set(state.swordHitIds);
	      if (source === 'sword') newHitIds.add(enemyId);
	      const finalDamage = damage + (state.courageTimer > 0 ? 4 : 0);
	      const lockedHit = state.targetLockId === enemyId;

	      const enemies = state.enemies.map((e) => {
	        if (e.id === enemyId && e.alive) {
          const newHealth = e.health - finalDamage;
          if (newHealth <= 0) {
            // Killed!
            const projectedScore = state.score + e.points;
            const closeKill = distanceXZ(state.playerPosition, e.position) < 2.25;
            if (state.mode === 'learn' && Math.floor(projectedScore / 450) > Math.floor(state.score / 450)) {
              setTimeout(() => get().triggerQuiz('german'), 500);
            }
            set((s) => ({
              score: s.score + e.points + s.combo * 14 + (closeKill ? 60 : 0),
              highScore: Math.max(s.score + e.points + s.combo * 14 + (closeKill ? 60 : 0), s.highScore),
              combo: s.combo + 1,
              comboTimer: 4,
              rupees: s.rupees + (e.type === 'guardian' || e.type === 'scribe' ? 3 : 1) + (closeKill ? 1 : 0),
              arrows: Math.min(s.maxArrows, s.arrows + (e.type === 'bat' ? 1 : 0) + (source === 'spin' ? 1 : 0)),
	              stats: {
	                ...s.stats,
	                enemiesDefeated: s.stats.enemiesDefeated + 1,
	                bestCombo: Math.max(s.stats.bestCombo, s.combo + 1),
	                lockOnKills: lockedHit ? s.stats.lockOnKills + 1 : s.stats.lockOnKills,
	                bossDefeated: e.type === 'boss' ? s.stats.bossDefeated + 1 : s.stats.bossDefeated,
	              },
	              targetLockId: lockedHit ? null : s.targetLockId,
	              roomMessage: e.type === 'boss' ? 'Tempelritter besiegt' : closeKill ? 'Mutiger Nahkampf-Finish' : `Kampf-Serie x${s.combo + 1}`,
	              roomMessageTimer: 0.9,
	              items: e.type === 'guardian' || e.type === 'scribe'
	                ? [
                    ...s.items,
                    {
                      id: ++entityIdCounter,
                      type: 'key',
                      position: [e.position[0], 0.3, e.position[2]],
                      collected: false,
                    },
                  ]
                : s.items,
            }));
            get().addCourageCharge(closeKill ? 18 : source === 'spin' ? 14 : 10);
            get().evaluateGoals();
            return { ...e, health: 0, alive: false };
          }
          get().addCourageCharge(source === 'spin' ? 5 : 2);
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

      const unlocked = roomUnlocked(state, enemies);
      set((s) => ({
        enemies,
        swordHitIds: newHitIds,
        roomUnlocked: unlocked,
        stats: {
          ...s.stats,
          roomsOpened: unlocked && !s.roomUnlocked ? s.stats.roomsOpened + 1 : s.stats.roomsOpened,
        },
        roomMessage: unlocked ? 'Nordtor geoeffnet.' : state.roomMessage,
        roomMessageTimer: unlocked ? 1.3 : state.roomMessageTimer,
      }));
      if (unlocked && !state.roomUnlocked) get().evaluateGoals();
    },

    // Player takes damage
    takeDamage: (amount) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.invulnerable) return;

      if (state.shieldActive && state.stamina >= 14) {
        set((s) => ({
          stamina: Math.max(0, s.stamina - 18),
          shieldFlash: 0.28,
          invulnerable: true,
          stats: {
            ...s.stats,
            perfectBlocks: s.stats.perfectBlocks + 1,
          },
          roomMessage: 'Perfekter Block',
          roomMessageTimer: 0.8,
        }));
        setTimeout(() => set({ invulnerable: false }), 220);
        get().addScore(15);
        get().addCourageCharge(10);
        get().evaluateGoals();
        return;
      }

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
              stamina: state.maxStamina,
              rolling: false,
              shieldActive: false,
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
	      } else if (item.type === 'key') {
	        updates.keys = state.keys + 1;
	        updates.score = state.score + 120;
	      } else if (item.type === 'arrow') {
	        updates.arrows = Math.min(state.maxArrows, state.arrows + item.value);
      } else if (item.type === 'bomb') {
        updates.bombs = Math.min(state.maxBombs, state.bombs + item.value);
        updates.score = state.score + 60;
      }

      updates.stats = {
        ...state.stats,
        itemsCollected: state.stats.itemsCollected + 1,
        keysCollected: item.type === 'key' ? state.stats.keysCollected + 1 : state.stats.keysCollected,
      };

      set(updates);
      if (item.type === 'key' || item.type === 'heart') get().addCourageCharge(8);
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
	      } else if (Math.random() < 0.22) {
	        updates.items = [
	          ...state.items,
	          {
	            id: ++entityIdCounter,
	            type: 'bomb',
	            position: [...pot.position],
	            value: 1,
	            collected: false,
	          },
	        ];
	      } else if (Math.random() < 0.35) {
	        updates.items = [
          ...state.items,
          {
            id: ++entityIdCounter,
            type: 'arrow',
            position: [...pot.position],
            value: 2,
            collected: false,
          },
        ];
      }

      set(updates);
    },

    activateSwitch: (switchId, source = 'sword') => {
      const state = get();
      const switchPlate = state.switches.find((button) => button.id === switchId);
      if (!switchPlate || switchPlate.active) return false;
      const required = switchPlate.kind || 'blade';
      const accepted = required === 'blade'
        ? source === 'sword' || source === 'spin'
        : required === source;
      if (!accepted) {
        set({
          roomMessage: `${SWITCH_PROFILES[required]?.source || 'Dieses Werkzeug'}-Siegel`,
          roomMessageTimer: 0.9,
        });
        return false;
      }
      const switches = state.switches.map((button) =>
        button.id === switchId ? { ...button, active: true } : button
      );
      const unlocked = roomUnlocked(state, state.enemies, switches, state.shrines);
      set((s) => ({
        switches,
        roomUnlocked: unlocked,
        score: state.score + (source === 'shield' ? 55 : 45),
        stats: {
          ...s.stats,
          toolSeals: s.stats.toolSeals + 1,
          roomsOpened: unlocked && !s.roomUnlocked ? s.stats.roomsOpened + 1 : s.stats.roomsOpened,
        },
        roomMessage: unlocked ? 'Nordtor geoeffnet.' : `${SWITCH_PROFILES[required]?.source || 'Werkzeug'}-Siegel aktiv`,
        roomMessageTimer: 1.2,
      }));
      if (unlocked && !state.roomUnlocked) get().evaluateGoals();
      else get().evaluateGoals();
      return true;
    },

    strikeShrine: (shrineId) => {
      const state = get();
      const shrine = state.shrines.find((candidate) => candidate.id === shrineId);
      if (!shrine || shrine.solved || shrine.failed) return;

      const shrines = state.shrines.map((candidate) => {
        if (candidate.id !== shrineId) return candidate;
        return { ...candidate, solved: shrine.correct, failed: !shrine.correct };
      });

      if (shrine.correct) {
        const unlocked = roomUnlocked(state, state.enemies, state.switches, shrines);
        set((s) => ({
          shrines,
          roomUnlocked: unlocked,
          relics: s.relics + 1,
          rupees: s.rupees + 5,
          arrows: Math.min(s.maxArrows, s.arrows + 4),
          stamina: s.maxStamina,
          score: s.score + 180 + s.quizStreak * 25,
          highScore: Math.max(s.highScore, s.score + 180 + s.quizStreak * 25),
          stats: {
            ...s.stats,
            shrinesSolved: s.stats.shrinesSolved + 1,
            roomsOpened: unlocked && !s.roomUnlocked ? s.stats.roomsOpened + 1 : s.stats.roomsOpened,
          },
          roomMessage: `${shrine.word}: ${shrine.answer}`,
          roomMessageTimer: 1.5,
        }));
        get().addCourageCharge(18);
        get().evaluateGoals();
      } else {
        set({
          shrines,
          roomMessage: `${shrine.label} war falsch.`,
          roomMessageTimer: 1.25,
        });
        get().takeDamage(1);
      }
    },

    // Change room
    changeRoom: (direction) => {
      const state = get();
      if (state.transitioning || !state.isPlaying) return;

      const newRoom = state.currentRoom + (direction === 'forward' ? 1 : -1);
      if (newRoom < 0 || newRoom >= state.totalRooms) return;
      if (direction === 'forward' && !state.roomUnlocked && state.currentRoom < state.totalRooms - 1) {
        set({
          roomMessage: state.mode === 'learn' ? 'Erst Schrein loesen und Gegner besiegen.' : 'Erst den Raum sichern.',
          roomMessageTimer: 1.4,
        });
        return;
      }

      set({ transitioning: true, transitionDirection: direction });

      setTimeout(() => {
        const mode = get().mode;
        const room = generateRoom(newRoom, mode);
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
          switches: room.switches,
          shrines: room.shrines,
	          arrowsInFlight: [],
	          enemyProjectiles: [],
	          activeBombs: [],
	          playerPosition: spawnPos,
	          targetLockId: null,
	          roomRevision: get().roomRevision + 1,
	          transitioning: false,
          transitionDirection: null,
          level: newRoom + 1,
          roomUnlocked: false,
          roomMessage: mode === 'learn' ? 'Lies den Schrein und triff die richtige Antwort.' : 'Erkunden, kaempfen, Tor oeffnen.',
          roomMessageTimer: 1.6,
        });
      }, 500);
    },

    // Update player position
    setPlayerPosition: (pos) => set({ playerPosition: pos }),
    setPlayerDirection: (dir) => set({ playerDirection: dir }),

    setShieldActive: (active) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.rolling) return;
      set({ shieldActive: active && state.stamina > 4 });
    },

	    fireArrow: (origin, direction) => {
	      const state = get();
	      if (!state.isPlaying || state.isPaused || state.arrows <= 0 || state.arrowCooldown > 0 || state.rolling) return false;
      const dx = direction?.[0] || state.playerDirection[0] || 0;
      const dz = direction?.[2] || state.playerDirection[2] || -1;
      const length = Math.max(0.001, Math.sqrt(dx * dx + dz * dz));
      set({
        arrows: state.arrows - 1,
        arrowCooldown: 0.42,
        stats: {
          ...state.stats,
          arrowsFired: state.stats.arrowsFired + 1,
        },
        arrowsInFlight: [
          ...state.arrowsInFlight,
          {
            id: ++entityIdCounter,
            position: [origin[0], 0.58, origin[2]],
            velocity: [(dx / length) * 11.5, 0, (dz / length) * 11.5],
            life: 1.2,
          },
        ],
	      });
	      return true;
	    },

	    placeBomb: () => {
	      const state = get();
	      if (!state.isPlaying || state.isPaused || state.rolling || state.bombs <= 0 || state.activeBombs.length >= 3) return false;
	      const dir = normalizeXZ(state.playerDirection[0] || 0, state.playerDirection[2] || -1);
	      const position = [
	        clamp(state.playerPosition[0] + dir[0] * 0.9, -8.2, 8.2),
	        0.28,
	        clamp(state.playerPosition[2] + dir[2] * 0.9, -8.2, 8.2),
	      ];
	      set((s) => ({
	        bombs: s.bombs - 1,
	        activeBombs: [
	          ...s.activeBombs,
	          {
	            id: ++entityIdCounter,
	            position,
	            fuse: 1.35,
	            exploding: false,
	            explosionTimer: 0,
	            radius: s.courageTimer > 0 ? 3.1 : 2.45,
	          },
	        ],
	        stats: {
	          ...s.stats,
	          bombsPlaced: s.stats.bombsPlaced + 1,
	        },
	        roomMessage: 'Bombe gelegt',
	        roomMessageTimer: 0.8,
	      }));
	      get().evaluateGoals();
	      return true;
	    },

	    toggleTargetLock: () => {
	      const state = get();
	      if (!state.isPlaying || state.isPaused) return false;
	      if (state.targetLockId && state.enemies.some((enemy) => enemy.id === state.targetLockId && enemy.alive)) {
	        set({ targetLockId: null, roomMessage: 'Lock-on geloest', roomMessageTimer: 0.55 });
	        return true;
	      }
	      const target = state.enemies
	        .filter((enemy) => enemy.alive)
	        .map((enemy) => ({ enemy, distance: distanceXZ(state.playerPosition, enemy.position) }))
	        .filter(({ distance }) => distance < 8.8)
	        .sort((a, b) => a.distance - b.distance)[0]?.enemy;
	      if (!target) {
	        set({ roomMessage: 'Kein Ziel in Reichweite', roomMessageTimer: 0.75 });
	        return false;
	      }
      set({
        targetLockId: target.id,
        roomMessage: target.type === 'boss' ? 'Lock-on: Tempelritter' : 'Lock-on aktiv',
	        roomMessageTimer: 0.8,
	      });
	      return true;
	    },

	    startSpinAttack: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.rolling || state.spinCooldown > 0 || state.stamina < 36) return false;
      const origin = state.playerPosition;
      const radius = state.courageTimer > 0 ? 3.15 : 2.45;
      const enemiesHit = state.enemies.filter((enemy) => enemy.alive && distanceXZ(origin, enemy.position) <= radius);
      const bushes = state.bushes.map((bush) =>
        !bush.destroyed && distanceXZ(origin, bush.position) <= radius ? { ...bush, destroyed: true } : bush
      );
      const potsDestroyed = state.pots.filter((pot) => !pot.destroyed && distanceXZ(origin, pot.position) <= radius);
      const pots = state.pots.map((pot) =>
        !pot.destroyed && distanceXZ(origin, pot.position) <= radius ? { ...pot, destroyed: true } : pot
      );
      const spawnedItems = potsDestroyed
        .filter((pot) => pot.hasRupee || Math.random() < 0.35)
        .map((pot) => ({
          id: ++entityIdCounter,
          type: pot.hasRupee ? 'rupee' : 'arrow',
          position: [...pot.position],
          value: pot.hasRupee ? 1 : 2,
          collected: false,
        }));

      set((s) => ({
        spinAttacking: true,
        spinTimer: 0.38,
        spinCooldown: 1.1,
        stamina: Math.max(0, s.stamina - 36),
        bushes,
        pots,
        items: [...s.items, ...spawnedItems],
        stats: {
          ...s.stats,
          spinHits: s.stats.spinHits + enemiesHit.length,
        },
        roomMessage: enemiesHit.length > 0 ? `Spin-Treffer x${enemiesHit.length}` : 'Wirbelhieb',
        roomMessageTimer: 0.9,
      }));

      enemiesHit.forEach((enemy) => {
        const dx = enemy.position[0] - origin[0];
        const dz = enemy.position[2] - origin[2];
        const len = Math.max(0.001, Math.sqrt(dx * dx + dz * dz));
        get().hitEnemy(enemy.id, [dx / len, 0, dz / len], state.courageTimer > 0 ? 24 : 18, 'spin');
      });

      get().addCourageCharge(6 + enemiesHit.length * 5);
      get().evaluateGoals();
      return true;
    },

	    startRoll: (direction) => {
	      const state = get();
	      if (!state.isPlaying || state.isPaused || state.rolling || state.rollCooldown > 0 || state.stamina < 24) return false;
      const dx = direction?.[0] || state.playerDirection[0] || 0;
      const dz = direction?.[2] || state.playerDirection[2] || -1;
      const length = Math.max(0.001, Math.sqrt(dx * dx + dz * dz));
      set({
        rolling: true,
        rollTimer: 0.28,
        rollCooldown: 0.58,
        rollDirection: [dx / length, 0, dz / length],
        stamina: Math.max(0, state.stamina - 24),
        shieldActive: false,
        invulnerable: true,
        stats: {
          ...state.stats,
          rolls: state.stats.rolls + 1,
        },
      });
	      return true;
	    },

	    updateBombs: (delta) => {
	      const state = get();
	      if (!state.isPlaying || state.isPaused || state.activeBombs.length === 0) return;

	      const bombs = [];
	      const explosions = [];
	      state.activeBombs.forEach((bomb) => {
	        if (bomb.exploding) {
	          const nextTimer = bomb.explosionTimer - delta;
	          if (nextTimer > 0) bombs.push({ ...bomb, explosionTimer: nextTimer });
	          return;
	        }
	        const nextFuse = bomb.fuse - delta;
	        if (nextFuse > 0) {
	          bombs.push({ ...bomb, fuse: nextFuse });
	          return;
	        }
	        const exploded = {
	          ...bomb,
	          fuse: 0,
	          exploding: true,
	          explosionTimer: 0.36,
	        };
	        bombs.push(exploded);
	        explosions.push(exploded);
	      });

	      if (explosions.length === 0) {
	        set({ activeBombs: bombs });
	        return;
	      }

	      const destroyedBushIds = new Set();
	      const destroyedPotIds = new Set();
	      const activatedSwitchIds = new Set();
	      const hitEnemies = new Map();
	      const spawnedItems = [];

	      explosions.forEach((bomb) => {
	        state.enemies.forEach((enemy) => {
	          if (!enemy.alive) return;
	          const distance = distanceXZ(bomb.position, enemy.position);
	          if (distance <= bomb.radius) hitEnemies.set(enemy.id, { enemy, bomb });
	        });
	        state.bushes.forEach((bush) => {
	          if (!bush.destroyed && distanceXZ(bomb.position, bush.position) <= bomb.radius) destroyedBushIds.add(bush.id);
	        });
	        state.pots.forEach((pot) => {
	          if (!pot.destroyed && distanceXZ(bomb.position, pot.position) <= bomb.radius) {
	            destroyedPotIds.add(pot.id);
	            if (pot.hasRupee || Math.random() < 0.3) {
	              spawnedItems.push({
	                id: ++entityIdCounter,
	                type: pot.hasRupee ? 'rupee' : 'bomb',
	                position: [...pot.position],
	                value: pot.hasRupee ? 1 : 1,
	                collected: false,
	              });
	            }
	          }
	        });
	        state.switches.forEach((button) => {
	          if (!button.active && button.kind === 'bomb' && distanceXZ(bomb.position, button.position) <= bomb.radius * 0.9) activatedSwitchIds.add(button.id);
	        });
	      });

	      const bushes = state.bushes.map((bush) =>
	        destroyedBushIds.has(bush.id) ? { ...bush, destroyed: true } : bush
	      );
	      const pots = state.pots.map((pot) =>
	        destroyedPotIds.has(pot.id) ? { ...pot, destroyed: true } : pot
	      );
	      const switches = state.switches.map((button) =>
	        activatedSwitchIds.has(button.id) ? { ...button, active: true } : button
	      );
	      const unlocked = roomUnlocked(state, state.enemies, switches, state.shrines);

	      set((s) => ({
	        activeBombs: bombs,
	        bushes,
	        pots,
	        switches,
	        items: [...s.items, ...spawnedItems],
	        roomUnlocked: unlocked,
	        stats: {
	          ...s.stats,
	          bombHits: s.stats.bombHits + hitEnemies.size,
	          toolSeals: s.stats.toolSeals + activatedSwitchIds.size,
	          roomsOpened: unlocked && !s.roomUnlocked ? s.stats.roomsOpened + 1 : s.stats.roomsOpened,
	        },
	        roomMessage: activatedSwitchIds.size > 0 ? 'Bomben-Siegel aktiv' : hitEnemies.size > 0 ? `Bombentreffer x${hitEnemies.size}` : 'Bombe explodiert',
	        roomMessageTimer: 0.9,
	      }));

	      hitEnemies.forEach(({ enemy, bomb }) => {
	        const dx = enemy.position[0] - bomb.position[0];
	        const dz = enemy.position[2] - bomb.position[2];
	        const knock = normalizeXZ(dx, dz);
	        get().hitEnemy(enemy.id, knock, enemy.type === 'boss' ? 34 : 30, 'bomb');
	      });
	      get().evaluateGoals();
	    },

	    updatePlayerAbilities: (delta) => {
      const state = get();
      const rolling = state.rollTimer > 0;
      const nextRollTimer = Math.max(0, state.rollTimer - delta);
      const nextRollCooldown = Math.max(0, state.rollCooldown - delta);
      const nextArrowCooldown = Math.max(0, state.arrowCooldown - delta);
      const nextSpinTimer = Math.max(0, state.spinTimer - delta);
      const nextSpinCooldown = Math.max(0, state.spinCooldown - delta);
      const nextCourageTimer = Math.max(0, state.courageTimer - delta);
      const nextComboTimer = Math.max(0, state.comboTimer - delta);
      const shieldDrain = state.shieldActive ? 18 * delta : 0;
      const staminaRegen = !state.shieldActive && !rolling ? (state.courageTimer > 0 ? 48 : 32) * delta : 0;
      const nextStamina = Math.max(0, Math.min(state.maxStamina, state.stamina - shieldDrain + staminaRegen));
      const shieldStillActive = state.shieldActive && nextStamina > 0 && !rolling;

      set({
        rolling: nextRollTimer > 0,
        rollTimer: nextRollTimer,
        rollCooldown: nextRollCooldown,
        arrowCooldown: nextArrowCooldown,
        spinAttacking: nextSpinTimer > 0,
        spinTimer: nextSpinTimer,
        spinCooldown: nextSpinCooldown,
        courageTimer: nextCourageTimer,
        comboTimer: nextComboTimer,
        combo: nextComboTimer <= 0 ? 0 : state.combo,
        stamina: nextStamina,
        shieldActive: shieldStillActive,
        shieldFlash: Math.max(0, state.shieldFlash - delta),
        roomMessageTimer: Math.max(0, state.roomMessageTimer - delta),
        invulnerable: nextRollTimer > 0 ? true : state.invulnerable,
      });
      get().updateContract(delta);

      if (rolling && nextRollTimer <= 0) {
        setTimeout(() => {
          if (!get().rolling) set({ invulnerable: false });
        }, 80);
      }
    },

    // Update enemies
    updateEnemies: (playerPos, delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;

      const now = Date.now();
      let projectileId = state.projectileIdCounter;
      const enemyProjectiles = [];

      state.enemyProjectiles.forEach((projectile) => {
        const nextPosition = [
          projectile.position[0] + projectile.velocity[0] * delta,
          projectile.position[1],
          projectile.position[2] + projectile.velocity[2] * delta,
        ];
        const dx = playerPos[0] - nextPosition[0];
        const dz = playerPos[2] - nextPosition[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 0.7) {
          get().takeDamage(1);
          return;
        }
        if (projectile.life - delta > 0 && Math.abs(nextPosition[0]) < 9 && Math.abs(nextPosition[2]) < 9) {
          enemyProjectiles.push({ ...projectile, position: nextPosition, life: projectile.life - delta });
        }
      });

	      const enemies = state.enemies.map((e) => {
	        if (!e.alive) return e;
	        const boss = e.type === 'boss';
	        const phase = boss && e.health < e.maxHealth * 0.52 ? 2 : e.phase || 1;
	        const attackWindup = Math.max(0, (e.attackWindup || 0) - delta);

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
	              attackWindup,
	              phase,
	            };
	        }

	        // Update bounce phase
	        const newPhase = e.bouncePhase + delta * (boss ? 3.2 : e.type === 'slime' ? 4 : 8);

        // Change direction periodically
        let dir = e.direction;
        let changeTimer = e.changeTimer + delta;
	        if (changeTimer > (boss ? 0.65 : 2)) {
	          changeTimer = 0;
	          // Sometimes chase player, sometimes random
	          if (boss || Math.random() < 0.6) {
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
	        const moveSpeed = e.speed * (phase === 2 ? 1.28 : 1) * delta;
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

	        if (boss && dist < 7.6 && now - e.lastShot > (phase === 2 ? 1050 : 1450)) {
	          const base = Math.atan2(dx, dz);
	          [-0.22, 0, 0.22].forEach((offset) => {
	            const angle = base + offset;
	            enemyProjectiles.push({
	              id: ++projectileId,
	              position: [newX, 0.82, newZ],
	              velocity: [Math.sin(angle) * (phase === 2 ? 7.2 : 6.2), 0, Math.cos(angle) * (phase === 2 ? 7.2 : 6.2)],
	              life: 2.15,
	              color: phase === 2 ? '#ef4444' : '#facc15',
	            });
	          });
	          return {
	            ...e,
	            position: [newX, e.position[1], newZ],
	            bouncePhase: newPhase,
	            direction: dir,
	            changeTimer,
	            lastShot: now,
	            attackWindup: 0.42,
	            phase,
	          };
	        }

	        if ((e.type === 'guardian' || e.type === 'scribe') && dist < 7 && now - e.lastShot > 1500) {
	          const len = Math.max(0.001, dist);
	          enemyProjectiles.push({
            id: ++projectileId,
            position: [newX, 0.65, newZ],
            velocity: [(dx / len) * 5.8, 0, (dz / len) * 5.8],
            life: 2,
            color: e.type === 'scribe' ? '#a78bfa' : '#f97316',
          });
          return {
            ...e,
            position: [newX, e.position[1], newZ],
            bouncePhase: newPhase,
            direction: dir,
	            changeTimer,
	            lastShot: now,
	            attackWindup: 0.22,
	            phase,
	          };
	        }

	        if (dist < (boss ? 1.55 : 1.0) && now - e.lastAttack > (boss ? 1050 : 800)) {
	          get().takeDamage(boss ? 2 : e.damage > 10 ? 2 : 1);
	          return {
	            ...e,
            position: [newX, e.position[1], newZ],
            bouncePhase: newPhase,
	            direction: dir,
	            changeTimer,
	            lastAttack: now,
	            attackWindup: boss ? 0.34 : attackWindup,
	            phase,
	          };
	        }

        return {
          ...e,
          position: [newX, e.position[1], newZ],
	          bouncePhase: newPhase,
	          direction: dir,
	          changeTimer,
	          attackWindup,
	          phase,
	        };
	      });

	      const targetStillAlive = !state.targetLockId || enemies.some((enemy) => enemy.id === state.targetLockId && enemy.alive);
	      set({ enemies, enemyProjectiles, projectileIdCounter: projectileId, targetLockId: targetStillAlive ? state.targetLockId : null });
	    },

    updateArrows: (delta) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;
      const arrows = [];
      let arrowHits = 0;
      state.arrowsInFlight.forEach((arrow) => {
        const nextArrow = {
          ...arrow,
          position: [
            arrow.position[0] + arrow.velocity[0] * delta,
            arrow.position[1],
            arrow.position[2] + arrow.velocity[2] * delta,
          ],
          life: arrow.life - delta,
        };
        let hit = false;
        state.enemies.forEach((enemy) => {
          if (hit || !enemy.alive) return;
          const dx = enemy.position[0] - nextArrow.position[0];
          const dz = enemy.position[2] - nextArrow.position[2];
          if (Math.sqrt(dx * dx + dz * dz) < (enemy.type === 'bat' ? 0.65 : 0.78)) {
            hit = true;
            arrowHits += 1;
            get().hitEnemy(enemy.id, [dx, 0, dz], enemy.type === 'guardian' || enemy.type === 'scribe' ? 12 : 14, 'arrow');
          }
        });
        if (!hit) {
          state.switches.forEach((button) => {
            if (hit || button.active || button.kind !== 'arrow') return;
            const dx = button.position[0] - nextArrow.position[0];
            const dz = button.position[2] - nextArrow.position[2];
            if (Math.sqrt(dx * dx + dz * dz) < 0.78) {
              hit = true;
              arrowHits += 1;
              get().activateSwitch(button.id, 'arrow');
            }
          });
        }
        if (!hit && nextArrow.life > 0 && Math.abs(nextArrow.position[0]) < 9 && Math.abs(nextArrow.position[2]) < 9) {
          arrows.push(nextArrow);
        }
      });
      set((s) => ({
        arrowsInFlight: arrows,
        stats: arrowHits > 0
          ? { ...s.stats, arrowHits: s.stats.arrowHits + arrowHits }
          : s.stats,
      }));
      if (arrowHits > 0) get().evaluateGoals();
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
	        keys: 0,
	        relics: 0,
	        arrows: get().mode === 'learn' ? 12 : 8,
	        bombs: get().mode === 'learn' ? 5 : 3,
	        stamina: 100,
        combo: 0,
        comboTimer: 0,
        courageCharge: 0,
        courageTimer: 0,
        rolling: false,
        rollTimer: 0,
        rollCooldown: 0,
        shieldActive: false,
        shieldFlash: 0,
        arrowCooldown: 0,
        spinAttacking: false,
        spinTimer: 0,
	        spinCooldown: 0,
	        arrowsInFlight: [],
	        enemyProjectiles: [],
	        activeBombs: [],
	        targetLockId: null,
	        roomUnlocked: false,
	        roomMessage: 'Abenteuer startet.',
	        roomMessageTimer: 1,
        activeContract: null,
        contractIndex: 0,
        contractTimer: 0,
        contractCooldown: 2,
        contractMedals: 0,
        contractFails: 0,
      });
      setTimeout(() => get().initGame(), 50);
    },
  })
);

export default useZeldaStore;
