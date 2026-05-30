import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
    speed: 0,
    maxSpeed: 30,
    gateActive: false,
    score: 0,
    feedback: null,
    feedbackColor: 'white',
    problem: { num1: 2, num2: 2 },
    answers: { top: 4, bottom: 5 },
    correctLocation: 'top',
    inputs: { up: false, down: false, left: false, right: false },
    setInput: (key, value) => set(state => ({ inputs: { ...state.inputs, [key]: value } })),
    generateProblem: () => {
        const num1 = Math.floor(Math.random() * 9) + 2;
        const num2 = Math.floor(Math.random() * 9) + 2;
        const answer = num1 * num2;
        let wrongAnswer = answer + Math.floor(Math.random() * 11) - 5;
        if (wrongAnswer === answer) wrongAnswer += 2;
        if (wrongAnswer <= 0) wrongAnswer = answer + 3;

        const correctLocation = Math.random() > 0.5 ? 'top' : 'bottom';
        set({
            gateActive: true,
            problem: { num1, num2 },
            answers: {
                top: correctLocation === 'top' ? answer : wrongAnswer,
                bottom: correctLocation === 'bottom' ? answer : wrongAnswer
            },
            correctLocation
        });
    },
    hitZone: (zoneName) => {
        const state = get();
        if (!state.gateActive) return;
        
        if (zoneName === state.correctLocation) {
            set({ 
                gateActive: false, 
                maxSpeed: 60, 
                score: state.score + 1,
                feedback: 'RICHTIG!',
                feedbackColor: '#00ff00'
            });
            setTimeout(() => set({ maxSpeed: 30, feedback: null }), 2000);
        } else {
            set({ 
                gateActive: false, 
                maxSpeed: 5,
                feedback: 'FALSCH!',
                feedbackColor: '#ff0000'
            });
            setTimeout(() => set({ maxSpeed: 30, feedback: null }), 3000);
        }
    },
    hitCheckpoint: () => {
        const state = get();
        if (!state.gateActive) {
            get().generateProblem();
        }
    }
}));
