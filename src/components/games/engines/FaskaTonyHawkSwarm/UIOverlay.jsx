import React, { useEffect } from 'react';
import { useGameStore } from './GameLogic';

export default function UIOverlay({ onExit, isLearncade }) {
  const { score, timer, streak, question, feedback, tickTimer, setFeedback, addScore, setStreak, setQuestion } = useGameStore();

  useEffect(() => {
    const int = setInterval(tickTimer, 1000);
    return () => clearInterval(int);
  }, [tickTimer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!question) return;
      if (e.key >= '0' && e.key <= '9') {
        const val = parseInt(e.key, 10);
        if (val === question.answer) {
           setFeedback('RADICAL!');
           addScore(100 + streak * 50);
           setStreak(streak + 1);
        } else {
           setFeedback('WIPEOUT!');
           setStreak(0);
        }
        setQuestion(null);
        setTimeout(() => setFeedback(null), 1500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, streak, addScore, setFeedback, setQuestion, setStreak]);

  return (
    <>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, color: '#00ffff', fontFamily: 'Impact, sans-serif' }}>
        <h1 style={{ margin: 0, fontSize: '48px', textShadow: '2px 2px 0 #ff00ff' }}>SCORE: {score}</h1>
        <h2 style={{ margin: 0, fontSize: '32px', color: streak > 2 ? '#ff00ff' : '#00ffff', textShadow: '2px 2px 0 #000' }}>STREAK: x{streak}</h2>
        <h3 style={{ margin: 0, fontSize: '32px', textShadow: '2px 2px 0 #000' }}>TIME: {timer}</h3>
      </div>
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <button onClick={onExit} style={{ 
            padding: '12px 24px', fontSize: '20px', background: '#ff00ff', color: 'white', 
            border: '4px solid #00ffff', cursor: 'pointer', fontFamily: 'Impact, sans-serif'
          }}>
          EXIT
        </button>
      </div>

      {question && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100, color: '#00ffff', fontFamily: 'Impact, sans-serif', textAlign: 'center' }}>
          <div style={{ fontSize: '96px', background: 'rgba(0,0,0,0.8)', padding: '20px 40px', border: '4px solid #ff00ff', textShadow: '4px 4px 0 #ff00ff' }}>
            {question.a} {question.op} {question.b} = ?
          </div>
          <div style={{ fontSize: '28px', color: '#fff', marginTop: '10px', textShadow: '2px 2px 0 #000' }}>
            PRESS NUMBER KEY (0-9) TO LAND!
          </div>
        </div>
      )}

      {feedback && (
        <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100, color: feedback === 'RADICAL!' ? '#00ffff' : '#ff00ff', fontFamily: 'Impact, sans-serif', fontSize: '80px', textShadow: '4px 4px 0 #000' }}>
          {feedback}
        </div>
      )}
    </>
  );
}
