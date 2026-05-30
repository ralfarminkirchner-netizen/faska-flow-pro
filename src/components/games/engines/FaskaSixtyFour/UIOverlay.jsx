import React from 'react';
import { useGameStore } from './GameLogic';

const quizQuestions = {
  'North America': {
    question: 'Which country has the largest landmass in North America?',
    options: ['USA', 'Canada', 'Mexico'],
    answer: 'Canada',
  },
  'South America': {
    question: 'Which is the longest river in South America?',
    options: ['Amazon', 'Parana', 'Orinoco'],
    answer: 'Amazon',
  },
  'Europe': {
    question: 'Which of these is the smallest country in Europe?',
    options: ['Monaco', 'Vatican City', 'San Marino'],
    answer: 'Vatican City',
  },
  'Africa': {
    question: 'What is the tallest mountain in Africa?',
    options: ['Mount Kilimanjaro', 'Mount Kenya', 'Mount Stanley'],
    answer: 'Mount Kilimanjaro',
  },
  'Asia': {
    question: 'Which is the most populous country in Asia as of 2023?',
    options: ['India', 'China', 'Indonesia'],
    answer: 'India',
  },
  'Australia': {
    question: 'Which of these animals is native to Australia?',
    options: ['Kangaroo', 'Panda', 'Tiger'],
    answer: 'Kangaroo',
  },
  'Antarctica': {
    question: 'What is the average temperature in Antarctica?',
    options: ['-10°C', '-57°C', '0°C'],
    answer: '-57°C',
  },
};

const defaultQuestion = {
  question: 'What is the capital of France?',
  options: ['London', 'Berlin', 'Paris'],
  answer: 'Paris'
};

export const UIOverlay = ({ onExit }) => {
  const { collectedContinents, phase, pendingContinent, answerQuiz } = useGameStore();

  if (phase === 'won') {
    return (
      <div style={styles.overlay}>
        <div style={styles.wonContainer}>
          <h1 style={styles.wonText}>You Win!</h1>
          <p style={styles.wonSubtext}>All 7 continents collected!</p>
        </div>
      </div>
    );
  }

  const currentQuiz = pendingContinent && quizQuestions[pendingContinent] ? quizQuestions[pendingContinent] : defaultQuestion;

  return (
    <div style={styles.overlay}>
      <div style={styles.scoreContainer}>
        <h2 style={styles.scoreText}>Stars: {collectedContinents.length} / 7</h2>
      </div>

      <button 
        style={styles.exitButton} 
        onClick={onExit}
        title="Beenden"
      >
        ✕
      </button>

      {phase === 'quiz' && (
        <div style={styles.quizOverlay}>
          <div style={styles.quizCard}>
            <h2 style={styles.questionText}>{currentQuiz.question}</h2>
            <div style={styles.buttonContainer}>
              {currentQuiz.options.map((option, idx) => (
                <button
                  key={idx}
                  style={styles.quizButton}
                  onClick={() => answerQuiz(option === currentQuiz.answer)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: 1000,
  },
  scoreContainer: {
    padding: '20px',
    pointerEvents: 'auto',
  },
  scoreText: {
    margin: 0,
    color: '#fff',
    fontSize: '28px',
    textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
    fontWeight: 'bold',
  },
  quizOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto',
    backdropFilter: 'blur(4px)',
  },
  quizCard: {
    backgroundColor: '#ffffff',
    padding: '30px 20px',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    boxSizing: 'border-box',
  },
  questionText: {
    fontSize: '1.5rem',
    marginBottom: '30px',
    color: '#1a1a1a',
    fontWeight: '700',
    lineHeight: '1.4',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  quizButton: {
    padding: '18px 24px',
    fontSize: '1.125rem',
    fontWeight: '600',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'transform 0.1s, background-color 0.2s',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
    WebkitTapHighlightColor: 'transparent',
  },
  wonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    pointerEvents: 'auto',
    backdropFilter: 'blur(8px)',
  },
  wonText: {
    fontSize: '4rem',
    color: '#fbbf24',
    textShadow: '0 0 20px rgba(251, 191, 36, 0.6), 0 4px 8px rgba(0,0,0,0.8)',
    margin: '0 0 16px 0',
    textAlign: 'center',
  },
  wonSubtext: {
    fontSize: '1.5rem',
    color: '#f3f4f6',
    textAlign: 'center',
    margin: 0,
  },
  exitButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '25px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '2px solid rgba(255,255,255,0.2)',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: 2000,
  }
};
