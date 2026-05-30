import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  controls: { left: false, right: false, jump: false },
  question: { num1: 0, num2: 0, op: '+', answer: 0, options: [] },
  isTransitioning: false,
  
  incrementScore: (points) => set((state) => ({ score: Math.max(0, state.score + points) })),
  
  setControl: (key, value) => set((state) => ({ controls: { ...state.controls, [key]: value } })),
  
  generateQuestion: () => {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let op = Math.random() > 0.5 ? 0 : 1;
    let answer, opStr;
    
    if (op === 0) {
      answer = num1 + num2;
      opStr = '+';
    } else {
      if (num1 < num2) { let t = num1; num1 = num2; num2 = t; }
      answer = num1 - num2;
      opStr = '-';
    }
    
    let options = [answer];
    while (options.length < 4) {
      let wrong = answer + Math.floor(Math.random() * 11) - 5;
      if (wrong !== answer && !options.includes(wrong) && wrong >= 0) {
        options.push(wrong);
      }
    }
    options.sort(() => Math.random() - 0.5);
    
    set({
      question: { num1, num2, op: opStr, answer, options },
      isTransitioning: false
    });
  },
  
  setTransitioning: (val) => set({ isTransitioning: val })
}));
