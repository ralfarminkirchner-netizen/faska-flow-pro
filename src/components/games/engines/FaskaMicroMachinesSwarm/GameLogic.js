import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaMicroMachines — Game Store
 * 
 * Top-down racing on a giant tabletop with toy-scale car.
 * State: car angle, speed, position, obstacles, lap tracking.
 * Quiz triggers every 2 laps.
 */

// Track checkpoint positions (tabletop coordinates)
const CHECKPOINTS = [
  { x: 0, z: -12 },   // 0 — start/finish
  { x: 12, z: -6 },   // 1
  { x: 12, z: 6 },    // 2
  { x: 0, z: 12 },    // 3
  { x: -12, z: 6 },   // 4
  { x: -12, z: -6 },  // 5
];

const TOTAL_LAPS = 5;

const useMicroStore = createGameStore(
  // Game-specific initial state
  {
    carAngle: 0,
    carSpeed: 0,
    carPosition: { x: 0, z: -12 },
    
    // Track / racing
    lap: 0,
    totalLaps: TOTAL_LAPS,
    nextCheckpoint: 1, // start at CP0, next is 1
    checkpointsPassed: [0],
    raceTime: 0,
    raceStarted: false,
    finished: false,
    bestLapTime: Infinity,
    currentLapStart: 0,

    // Obstacles list (generated once)
    obstacles: generateObstacles(),
    
    // Track checkpoints
    checkpoints: CHECKPOINTS,
    totalCheckpoints: CHECKPOINTS.length,

    // Drift
    driftAngle: 0,
    isDrifting: false,

    // Countdown
    countdown: 3,
    countdownActive: true,

    // Slowdown from collisions
    collisionSlowdown: 0,
  },
  // Game-specific actions
  (set, get) => ({
    accelerate: (dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const maxSpeed = 12;
      const accel = 10;
      const slow = state.collisionSlowdown > 0 ? 0.4 : 1;
      set({ carSpeed: Math.min(state.carSpeed + accel * dt * slow, maxSpeed) });
    },

    brake: (dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      set({ carSpeed: Math.max(state.carSpeed - 15 * dt, -4) });
    },

    decelerate: (dt) => {
      const state = get();
      if (state.finished || state.isPaused) return;
      const drag = 4;
      if (state.carSpeed > 0) {
        set({ carSpeed: Math.max(0, state.carSpeed - drag * dt) });
      } else if (state.carSpeed < 0) {
        set({ carSpeed: Math.min(0, state.carSpeed + drag * dt) });
      }
    },

    steer: (direction, dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const turnRate = 3.0;
      const speedFactor = Math.min(1, Math.abs(state.carSpeed) / 3);
      const newAngle = state.carAngle + direction * turnRate * speedFactor * dt;
      
      // Drift detection
      const isDrifting = Math.abs(direction) > 0.5 && Math.abs(state.carSpeed) > 6;
      set({
        carAngle: newAngle,
        isDrifting,
        driftAngle: isDrifting ? direction * 0.3 : 0,
      });
    },

    updatePosition: (dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      
      const dx = Math.sin(state.carAngle) * state.carSpeed * dt;
      const dz = -Math.cos(state.carAngle) * state.carSpeed * dt;
      const newX = state.carPosition.x + dx;
      const newZ = state.carPosition.z + dz;

      // Table boundary (keep on the table)
      const maxBound = 22;
      const clampedX = Math.max(-maxBound, Math.min(maxBound, newX));
      const clampedZ = Math.max(-maxBound, Math.min(maxBound, newZ));

      // Slow down at edges
      if (Math.abs(newX) > maxBound || Math.abs(newZ) > maxBound) {
        set({ carSpeed: state.carSpeed * 0.8 });
      }

      set({ carPosition: { x: clampedX, z: clampedZ } });

      // Collision slowdown decay
      if (state.collisionSlowdown > 0) {
        set({ collisionSlowdown: Math.max(0, state.collisionSlowdown - dt) });
      }
    },

    collideObstacle: () => {
      const state = get();
      if (state.collisionSlowdown > 0) return; // debounce
      set({
        carSpeed: state.carSpeed * 0.3,
        collisionSlowdown: 0.8,
      });
      // Lose a small bit of time, not a life
    },

    passCheckpoint: (cpIndex) => {
      const state = get();
      if (state.finished) return;
      if (cpIndex !== state.nextCheckpoint) return;

      const newPassed = [...state.checkpointsPassed, cpIndex];
      const nextCp = (cpIndex + 1) % state.totalCheckpoints;

      // Completed a lap?
      if (cpIndex === 0 && state.checkpointsPassed.length >= state.totalCheckpoints) {
        const newLap = state.lap + 1;
        const lapTime = state.raceTime - state.currentLapStart;

        if (newLap >= state.totalLaps) {
          set({
            finished: true,
            lap: newLap,
            bestLapTime: Math.min(state.bestLapTime, lapTime),
          });
          get().addScore(1000);
          return;
        }

        // Quiz every 2 laps
        if (newLap > 0 && newLap % 2 === 0) {
          get().triggerQuiz('math');
        }

        set({
          lap: newLap,
          nextCheckpoint: 1,
          checkpointsPassed: [0],
          bestLapTime: Math.min(state.bestLapTime, lapTime),
          currentLapStart: state.raceTime,
        });
        get().addScore(150);
      } else {
        set({
          nextCheckpoint: nextCp,
          checkpointsPassed: newPassed,
        });
        get().addScore(30);
      }
    },

    updateRaceTime: (dt) => {
      const state = get();
      if (!state.raceStarted || state.finished || state.isPaused) return;
      set({ raceTime: state.raceTime + dt });
    },

    tickCountdown: () => {
      const state = get();
      if (!state.countdownActive) return;
      if (state.countdown <= 1) {
        set({ countdown: 0, countdownActive: false, raceStarted: true, isPlaying: true });
      } else {
        set({ countdown: state.countdown - 1 });
      }
    },

    startRace: () => {
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        carAngle: 0,
        carSpeed: 0,
        carPosition: { x: 0, z: -12 },
        lap: 0,
        nextCheckpoint: 1,
        checkpointsPassed: [0],
        raceTime: 0,
        raceStarted: false,
        finished: false,
        bestLapTime: Infinity,
        currentLapStart: 0,
        isDrifting: false,
        driftAngle: 0,
        countdown: 3,
        countdownActive: true,
        collisionSlowdown: 0,
        quizActive: false,
        obstacles: generateObstacles(),
      });
    },
  })
);

/**
 * Generate random tabletop obstacles
 * Pencils, erasers, coins, bottle caps, paper clips
 */
function generateObstacles() {
  const obs = [];
  const rng = () => (Math.random() - 0.5) * 36;

  // Pencils (long thin cylinders) — scattered around
  for (let i = 0; i < 6; i++) {
    const x = rng();
    const z = rng();
    // Don't place too close to start
    if (Math.sqrt(x * x + (z + 12) * (z + 12)) < 5) continue;
    obs.push({
      type: 'pencil',
      x, z,
      rotation: Math.random() * Math.PI,
      color: ['#f59e0b', '#3b82f6', '#ef4444', '#10b981'][Math.floor(Math.random() * 4)],
    });
  }

  // Erasers (boxes)
  for (let i = 0; i < 5; i++) {
    const x = rng();
    const z = rng();
    if (Math.sqrt(x * x + (z + 12) * (z + 12)) < 5) continue;
    obs.push({
      type: 'eraser',
      x, z,
      rotation: Math.random() * Math.PI,
      color: ['#ec4899', '#f8fafc', '#a855f7'][Math.floor(Math.random() * 3)],
    });
  }

  // Coins (flat cylinders)
  for (let i = 0; i < 8; i++) {
    const x = rng();
    const z = rng();
    if (Math.sqrt(x * x + (z + 12) * (z + 12)) < 5) continue;
    obs.push({
      type: 'coin',
      x, z,
      rotation: 0,
    });
  }

  // Bottle caps
  for (let i = 0; i < 4; i++) {
    const x = rng();
    const z = rng();
    if (Math.sqrt(x * x + (z + 12) * (z + 12)) < 5) continue;
    obs.push({
      type: 'bottlecap',
      x, z,
      rotation: Math.random() * Math.PI * 2,
      color: ['#ef4444', '#3b82f6', '#f59e0b'][Math.floor(Math.random() * 3)],
    });
  }

  return obs;
}

export default useMicroStore;
