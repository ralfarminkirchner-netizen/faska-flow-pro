import { useState, useCallback, useEffect } from 'react';

/**
 * LearncadeQuiz — Educational quiz overlay for FASKA Flow games.
 * Shows math or German vocabulary questions as a modal overlay.
 * Features Luna the Rabbit as the quiz host character.
 *
 * Props:
 *   active     — Whether quiz is showing
 *   question   — { question, answer, options, type }
 *   onAnswer   — Callback with selected answer
 *   streak     — Current correct streak
 *   quizScore  — Total quiz points
 */
export default function LearncadeQuiz({ active, question, onAnswer, streak = 0, quizScore = 0 }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (active) {
      setSelected(null);
      setFeedback(null);
    }
  }, [active, question]);

  const handleSelect = useCallback((option) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === question.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    
    // Brief delay then dismiss
    setTimeout(() => {
      if (onAnswer) onAnswer(option);
    }, 800);
  }, [selected, question, onAnswer]);

  if (!active || !question) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 5, 16, 0.85)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounceIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-60px) rotate(360deg); opacity: 0; } }
      `}</style>
      
      <div style={{
        maxWidth: 440, width: '90%',
        background: 'linear-gradient(145deg, #1a1a3a, #12122a)',
        borderRadius: 24, padding: 32,
        border: '1px solid rgba(124, 58, 237, 0.3)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124, 58, 237, 0.1)',
        animation: 'bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
      }}>
        {/* Luna character avatar */}
        <div style={{
          position: 'absolute', top: -40, right: -10,
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e9d5ff, #c4b5fd)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, border: '3px solid #7c3aed',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
        }}>
          🐰
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
        }}>
          <span style={{ fontSize: 28 }}>
            {question.type === 'math' ? '🧮' : '🇩🇪'}
          </span>
          <div>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: 16,
              color: '#a855f7', fontWeight: 600, margin: 0,
            }}>
              {question.type === 'math' ? 'Mathe-Challenge' : 'Deutsch-Quiz'}
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
              🔥 Streak: {streak} | ⭐ {quizScore} Punkte
            </p>
          </div>
        </div>

        {/* Question */}
        <div style={{
          background: 'rgba(124, 58, 237, 0.1)',
          borderRadius: 16, padding: 20,
          marginBottom: 20, textAlign: 'center',
          border: '1px solid rgba(124, 58, 237, 0.2)',
        }}>
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 24, fontWeight: 700,
            color: '#e2e8f0', margin: 0,
            ...(feedback === 'wrong' ? { animation: 'shake 0.4s ease' } : {}),
          }}>
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrect = option === question.answer;
            let bg = 'rgba(42, 42, 90, 0.5)';
            let borderColor = 'rgba(124, 58, 237, 0.2)';
            
            if (feedback) {
              if (isCorrect) {
                bg = 'rgba(16, 185, 129, 0.3)';
                borderColor = '#10b981';
              } else if (isSelected && !isCorrect) {
                bg = 'rgba(239, 68, 68, 0.3)';
                borderColor = '#ef4444';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '14px 20px',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  borderRadius: 14,
                  color: '#e2e8f0',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 18, fontWeight: 600,
                  cursor: selected === null ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  ...(selected === null ? {} : {}),
                }}
                onPointerEnter={(e) => {
                  if (selected === null) {
                    e.target.style.background = 'rgba(124, 58, 237, 0.2)';
                    e.target.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                  }
                }}
                onPointerLeave={(e) => {
                  if (selected === null) {
                    e.target.style.background = bg;
                    e.target.style.borderColor = borderColor;
                  }
                }}
              >
                {feedback && isCorrect && '✅ '}{feedback && isSelected && !isCorrect && '❌ '}{option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <p style={{
            textAlign: 'center', marginTop: 16,
            fontFamily: 'Outfit, sans-serif',
            fontSize: 16, fontWeight: 600,
            color: feedback === 'correct' ? '#10b981' : '#ef4444',
          }}>
            {feedback === 'correct'
              ? `🎉 Richtig! +${50 * (streak + 1)} Punkte!`
              : `💪 Nächstes Mal! Die Antwort war: ${question.answer}`}
          </p>
        )}
      </div>
    </div>
  );
}
