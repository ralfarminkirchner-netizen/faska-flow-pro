import { useState, useCallback, useEffect } from 'react';

/**
 * LearncadeQuiz — Educational quiz as POWER-UP, not popup interruption.
 *
 * NEW BEHAVIOR:
 *   - Correct answer = bonus callback (extra life, boost, weapon, etc.)
 *   - Wrong answer = no penalty, quiz dismisses after feedback
 *   - Does NOT pause the game — appears as compact overlay
 *   - Auto-dismisses after 8 seconds if ignored
 *
 * Props:
 *   active        — Whether quiz is showing
 *   question      — { question, answer, options, type }
 *   onAnswer      — Callback with (selectedAnswer, isCorrect)
 *   onBonus       — Called when correct — game gives power-up
 *   streak        — Current correct streak
 *   quizScore     — Total quiz points
 *   bonusLabel    — What the player wins (e.g. "Extra Leben", "Speed Boost")
 *   compact       — Smaller overlay that doesn't block gameplay (default: true)
 */
export default function LearncadeQuiz({
  active, question, onAnswer, onBonus,
  streak = 0, quizScore = 0,
  bonusLabel = '⚡ Power-Up',
  compact = true,
}) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (active) {
      setSelected(null);
      setFeedback(null);
    }
  }, [active, question]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      if (selected === null && onAnswer) {
        onAnswer(null, false);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [active, selected, onAnswer]);

  const handleSelect = useCallback((option) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === question.answer;
    setFeedback(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      if (onAnswer) onAnswer(option, correct);
      if (correct && onBonus) onBonus();
    }, correct ? 600 : 1000);
  }, [selected, question, onAnswer, onBonus]);

  if (!active || !question) return null;

  const compactStyles = compact ? {
    position: 'fixed',
    bottom: 20,
    right: 20,
    left: 'auto',
    top: 'auto',
    zIndex: 200,
    maxWidth: 380,
    width: '90vw',
  } : {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(5, 5, 16, 0.6)',
  };

  return (
    <div style={compactStyles}>
      <style>{`
        @keyframes quizSlideIn { from { transform: translateY(30px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes quizPulse { 0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); } 50% { box-shadow: 0 0 40px rgba(124,58,237,0.6); } }
        @keyframes bonusGlow { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
      `}</style>

      <div style={{
        background: 'linear-gradient(145deg, rgba(26,26,58,0.95), rgba(18,18,42,0.95))',
        borderRadius: 20,
        padding: compact ? '16px 20px' : '28px 32px',
        border: feedback === 'correct'
          ? '2px solid #10b981'
          : feedback === 'wrong'
            ? '2px solid #ef4444'
            : '1px solid rgba(124, 58, 237, 0.4)',
        boxShadow: '0 15px 50px rgba(0,0,0,0.5), 0 0 30px rgba(124, 58, 237, 0.15)',
        animation: feedback === 'correct'
          ? 'bonusGlow 0.5s ease'
          : feedback === 'wrong'
            ? 'shake 0.3s ease'
            : 'quizSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backdropFilter: 'blur(16px)',
        ...(compact ? {} : { maxWidth: 420, width: '90%' }),
      }}>
        {/* Header with bonus label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: compact ? 10 : 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: compact ? 20 : 26 }}>
              {question.type === 'math' ? '🧮' : '🇩🇪'}
            </span>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: compact ? 13 : 15,
              color: '#a855f7',
              fontWeight: 700,
            }}>
              {question.type === 'math' ? 'Mathe' : 'Deutsch'}
            </span>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            borderRadius: 10,
            padding: '4px 10px',
            fontSize: compact ? 11 : 13,
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            color: 'white',
            animation: 'quizPulse 2s infinite',
          }}>
            {bonusLabel}
          </div>
        </div>

        {/* Question */}
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: compact ? 18 : 22,
          fontWeight: 700,
          color: '#e2e8f0',
          margin: '0 0 12px 0',
          textAlign: 'center',
        }}>
          {question.question}
        </p>

        {/* Options — compact 2x2 grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr 1fr' : '1fr',
          gap: compact ? 6 : 8,
        }}>
          {question.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrect = option === question.answer;
            let bg = 'rgba(42, 42, 90, 0.6)';
            let border = 'rgba(124, 58, 237, 0.2)';

            if (feedback) {
              if (isCorrect) {
                bg = 'rgba(16, 185, 129, 0.35)';
                border = '#10b981';
              } else if (isSelected && !isCorrect) {
                bg = 'rgba(239, 68, 68, 0.3)';
                border = '#ef4444';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                style={{
                  padding: compact ? '8px 10px' : '12px 16px',
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: 10,
                  color: '#e2e8f0',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: compact ? 14 : 17,
                  fontWeight: 600,
                  cursor: selected === null ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                }}
              >
                {feedback && isCorrect && '✅ '}
                {feedback && isSelected && !isCorrect && '❌ '}
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <p style={{
            textAlign: 'center',
            margin: '8px 0 0',
            fontFamily: 'Outfit, sans-serif',
            fontSize: compact ? 13 : 15,
            fontWeight: 700,
            color: feedback === 'correct' ? '#10b981' : '#94a3b8',
          }}>
            {feedback === 'correct'
              ? `🎉 ${bonusLabel} aktiviert!`
              : `Die Antwort war: ${question.answer}`}
          </p>
        )}

        {/* Streak indicator */}
        {streak > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 4,
            marginTop: 6,
          }}>
            {Array.from({ length: Math.min(streak, 5) }, (_, i) => (
              <span key={i} style={{ fontSize: 10 }}>🔥</span>
            ))}
            <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Outfit' }}>
              x{streak}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
