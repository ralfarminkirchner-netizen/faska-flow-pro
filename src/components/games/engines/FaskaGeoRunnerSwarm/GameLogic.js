import { createGameStore } from '../../../../shared/useSwarmStore';

const COUNTRIES = [
  { name: 'Frankreich', flag: '🇫🇷' },
  { name: 'Deutschland', flag: '🇩🇪' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Brasilien', flag: '🇧🇷' },
  { name: 'Italien', flag: '🇮🇹' },
  { name: 'Kanada', flag: '🇨🇦' },
  { name: 'Großbritannien', flag: '🇬🇧' },
  { name: 'Spanien', flag: '🇪🇸' },
  { name: 'Indien', flag: '🇮🇳' },
  { name: 'Südkorea', flag: '🇰🇷' },
  { name: 'Mexiko', flag: '🇲🇽' },
];

export const useRunnerStore = createGameStore(
  {
    playerLane: 0, // -1, 0, 1
    gates: [],
    currentQuestion: '',
    speed: 25, 
  },
  (set, get) => ({
    moveLeft: () => set(state => {
      if (!state.isPlaying || state.isGameOver || state.isPaused) return state;
      return { playerLane: Math.max(-1, state.playerLane - 1) };
    }),
    
    moveRight: () => set(state => {
      if (!state.isPlaying || state.isGameOver || state.isPaused) return state;
      return { playerLane: Math.min(1, state.playerLane + 1) };
    }),
    
    spawnGate: () => {
      const targetCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      
      const availableWrong = COUNTRIES.filter(c => c.name !== targetCountry.name);
      const wrong1 = availableWrong.splice(Math.floor(Math.random() * availableWrong.length), 1)[0];
      const wrong2 = availableWrong.splice(Math.floor(Math.random() * availableWrong.length), 1)[0];
      
      const choices = [
        { ...targetCountry, isCorrect: true },
        { ...wrong1, isCorrect: false },
        { ...wrong2, isCorrect: false },
      ].sort(() => Math.random() - 0.5);
      
      const newGate = {
        id: Date.now() + Math.random(),
        z: -80, // Spawn far ahead
        passed: false,
        doors: [
          { lane: -1, flag: choices[0].flag, isCorrect: choices[0].isCorrect },
          { lane: 0, flag: choices[1].flag, isCorrect: choices[1].isCorrect },
          { lane: 1, flag: choices[2].flag, isCorrect: choices[2].isCorrect },
        ]
      };
      
      set({
        gates: [newGate],
        currentQuestion: `Finde die Flagge von:\n${targetCountry.name}`,
      });
    },

    update: (dt) => {
      const state = get();
      if (!state.isPlaying || state.isGameOver || state.isPaused) return;

      const activeGates = state.gates;
      let needsStateUpdate = false;

      for (let i = 0; i < activeGates.length; i++) {
        let gate = activeGates[i];
        gate.z += state.speed * dt;
        
        // Collision threshold (player is at z=0, so if it crosses this threshold it's evaluated)
        if (gate.z > -0.5 && gate.z < 1.0 && !gate.passed) {
          gate.passed = true;
          
          const correctDoor = gate.doors.find(d => d.isCorrect);
          if (state.playerLane === correctDoor.lane) {
            state.addScore(100);
            const newScore = get().score;
            // Trigger Learncade Quiz every 500 points
            if (newScore > 0 && newScore % 500 === 0) {
              state.triggerQuiz('math');
            }
            set({ speed: state.speed + 1 });
          } else {
            state.loseLife();
          }
        }
        
        // Remove gate once past the camera
        if (gate.z > 12) {
          activeGates.splice(i, 1);
          i--;
          needsStateUpdate = true;
        }
      }

      if (activeGates.length === 0) {
        get().spawnGate();
        needsStateUpdate = true;
      }
      
      if (needsStateUpdate) {
        set({ gates: [...activeGates] });
      }
    }
  })
);
