import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaKart Racing — Game Store
 * 
 * State: player speed/angle, lap tracking, checkpoints, boost, AI, race timer
 * Quiz triggers every 2 laps.
 */

// Oval track checkpoint positions (world-space XZ coords)
const CHECKPOINTS = [
  { x: 0, z: -18 },    // 0 — start/finish
  { x: 18, z: -10 },   // 1 — first curve exit
  { x: 18, z: 10 },    // 2 — far straight
  { x: 0, z: 18 },     // 3 — back straight
  { x: -18, z: 10 },   // 4 — second curve exit
  { x: -18, z: -10 },  // 5 — approach finish
];

const TOTAL_LAPS = 3;

const useKartStore = createGameStore(
  // Game-specific initial state
  {
    // Player racing state
    playerSpeed: 0,
    playerAngle: 0, // radians
    lap: 0,
    totalLaps: TOTAL_LAPS,
    nextCheckpoint: 0,
    checkpointsPassed: [],
    raceTime: 0,
    raceStarted: false,
    finished: false,
    boostActive: false,
    boostTimer: 0,
    boostCount: 3,
    position: 1, // 1st through 4th

    // AI state
    aiKarts: [
      { id: 1, progress: 0, speed: 6 + Math.random() * 2, color: '#ef4444', lap: 0 },
      { id: 2, progress: 0, speed: 5.5 + Math.random() * 2, color: '#3b82f6', lap: 0 },
      { id: 3, progress: 0, speed: 5 + Math.random() * 2, color: '#f59e0b', lap: 0 },
    ],

    // Track data
    checkpoints: CHECKPOINTS,
    totalCheckpoints: CHECKPOINTS.length,

    // Countdown
    countdown: 3,
    countdownActive: true,
  },
  // Game-specific actions
  (set, get) => ({
    accelerate: (dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const maxSpeed = state.boostActive ? 16 : 10;
      const accel = state.boostActive ? 14 : 8;
      set({ playerSpeed: Math.min(state.playerSpeed + accel * dt, maxSpeed) });
    },

    brake: (dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      set({ playerSpeed: Math.max(state.playerSpeed - 12 * dt, -3) });
    },

    decelerate: (dt) => {
      const state = get();
      if (state.finished || state.isPaused) return;
      // Natural drag
      const drag = 3;
      if (state.playerSpeed > 0) {
        set({ playerSpeed: Math.max(0, state.playerSpeed - drag * dt) });
      } else if (state.playerSpeed < 0) {
        set({ playerSpeed: Math.min(0, state.playerSpeed + drag * dt) });
      }
    },

    steer: (direction, dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const turnRate = 2.2;
      const speedFactor = Math.min(1, Math.abs(state.playerSpeed) / 4);
      set({ playerAngle: state.playerAngle + direction * turnRate * speedFactor * dt });
    },

    useBoost: () => {
      const state = get();
      if (state.boostCount <= 0 || state.boostActive || state.finished) return;
      set({
        boostActive: true,
        boostTimer: 1.5, // seconds
        boostCount: state.boostCount - 1,
      });
    },

    updateBoost: (dt) => {
      const state = get();
      if (!state.boostActive) return;
      const newTimer = state.boostTimer - dt;
      if (newTimer <= 0) {
        set({ boostActive: false, boostTimer: 0 });
      } else {
        set({ boostTimer: newTimer });
      }
    },

    collectBoostPad: () => {
      const state = get();
      if (state.finished) return;
      set({
        boostActive: true,
        boostTimer: 1.0,
      });
    },

    passCheckpoint: (cpIndex) => {
      const state = get();
      if (state.finished) return;
      if (cpIndex !== state.nextCheckpoint) return;

      const newPassed = [...state.checkpointsPassed, cpIndex];
      const nextCp = (cpIndex + 1) % state.totalCheckpoints;

      // Did we complete a lap? (passed checkpoint 0 after all others)
      if (cpIndex === 0 && state.checkpointsPassed.length > 0) {
        const newLap = state.lap + 1;
        
        if (newLap >= state.totalLaps) {
          // Race finished!
          set({
            finished: true,
            lap: newLap,
            nextCheckpoint: nextCp,
            checkpointsPassed: [],
          });
          get().addScore(1000);
          return;
        }

        // Quiz trigger every 2 laps
        if (newLap > 0 && newLap % 2 === 0) {
          get().triggerQuiz('math');
        }

        set({
          lap: newLap,
          nextCheckpoint: nextCp,
          checkpointsPassed: [],
        });
        get().addScore(200);
      } else {
        set({
          nextCheckpoint: nextCp,
          checkpointsPassed: newPassed,
        });
        get().addScore(50);
      }
    },

    updateRaceTime: (dt) => {
      const state = get();
      if (!state.raceStarted || state.finished || state.isPaused) return;
      set({ raceTime: state.raceTime + dt });
    },

    updateAI: (dt) => {
      const state = get();
      if (!state.raceStarted || state.finished || state.isPaused) return;
      
      const newAI = state.aiKarts.map(ai => {
        let newProgress = ai.progress + ai.speed * dt * 0.08;
        let newLap = ai.lap;
        if (newProgress >= 1) {
          newProgress -= 1;
          newLap += 1;
        }
        return { ...ai, progress: newProgress, lap: newLap };
      });
      
      // Calculate player position
      const playerProgress = state.nextCheckpoint / state.totalCheckpoints;
      const playerTotal = state.lap + playerProgress;
      
      let pos = 1;
      for (const ai of newAI) {
        const aiTotal = ai.lap + ai.progress;
        if (aiTotal > playerTotal) pos++;
      }

      set({ aiKarts: newAI, position: pos });
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
        playerSpeed: 0,
        playerAngle: 0,
        lap: 0,
        nextCheckpoint: 0,
        checkpointsPassed: [],
        raceTime: 0,
        raceStarted: false,
        finished: false,
        boostActive: false,
        boostTimer: 0,
        boostCount: 3,
        position: 1,
        countdown: 3,
        countdownActive: true,
        quizActive: false,
        aiKarts: [
          { id: 1, progress: 0, speed: 6 + Math.random() * 2, color: '#ef4444', lap: 0 },
          { id: 2, progress: 0, speed: 5.5 + Math.random() * 2, color: '#3b82f6', lap: 0 },
          { id: 3, progress: 0, speed: 5 + Math.random() * 2, color: '#f59e0b', lap: 0 },
        ],
      });
    },

    formatTime: () => {
      const t = get().raceTime;
      const mins = Math.floor(t / 60);
      const secs = Math.floor(t % 60);
      const ms = Math.floor((t * 100) % 100);
      return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    },
  })
);

export default useKartStore;
