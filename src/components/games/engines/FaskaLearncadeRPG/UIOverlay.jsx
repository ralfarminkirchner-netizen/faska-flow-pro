import React, { useState, useEffect } from 'react';
import { useGameStore } from './GameLogic';

export default function UIOverlay() {
  const { activeNPC, setActiveNPC, addScore } = useGameStore();
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (activeNPC === 'math') {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setQuestion({
        text: `What is ${a} + ${b}?`,
        options: [
          a + b,
          a + b + 2,
          a + b - 1,
          a + b + 5
        ].sort(() => Math.random() - 0.5),
        answer: a + b
      });
    } else if (activeNPC === 'german') {
      const q = [
        { text: 'Which article is correct for "Hund"?', options: ['der', 'die', 'das', 'dem'], answer: 'der' },
        { text: 'Which article is correct for "Katze"?', options: ['der', 'die', 'das', 'dem'], answer: 'die' },
        { text: 'Which article is correct for "Auto"?', options: ['der', 'die', 'das', 'dem'], answer: 'das' }
      ];
      setQuestion(q[Math.floor(Math.random() * q.length)]);
    }
  }, [activeNPC]);

  const handleAnswer = (opt) => {
    if (opt === question.answer) {
      setFeedback('Correct!');
      addScore(10);
      setTimeout(() => {
        setFeedback('');
        setActiveNPC(null);
      }, 1500);
    } else {
      setFeedback('Try again!');
    }
  };

  if (!activeNPC || !question) return null;

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-4 pointer-events-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2 capitalize drop-shadow-md">
          {activeNPC} Challenge
        </h2>
        <p className="text-xl text-blue-200 mb-8 font-medium">{question.text}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="py-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl text-white font-bold text-xl transition-all shadow-sm active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`text-2xl font-bold mb-6 drop-shadow-md ${feedback === 'Correct!' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback}
          </div>
        )}

        <button
          onClick={() => {
            setFeedback('');
            setActiveNPC(null);
          }}
          className="mt-4 px-10 py-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full font-bold shadow-lg transition-all active:scale-95"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
