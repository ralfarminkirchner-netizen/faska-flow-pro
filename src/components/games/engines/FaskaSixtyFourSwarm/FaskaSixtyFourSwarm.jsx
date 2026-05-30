import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useFaskaSixtyFourStore from './GameLogic';
import Player from './Player';
import World from './World';

/**
 * StartScreen — Stylish title screen before gameplay begins.
 */
function StartScreen({ onStart }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 50%, #0a1a3e 100%)',
      flexDirection: 'column', gap: 24,
    }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes glow { 0%, 100% { text-shadow: 0 0 20px rgba(139, 92, 246, 0.5); } 50% { text-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(34, 211, 238, 0.3); } }
        @keyframes coinSpin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>

      {/* Floating coins decoration */}
      <div style={{ position: 'absolute', top: '15%', left: '20%', fontSize: 40, animation: 'float 3s ease-in-out infinite, coinSpin 2s linear infinite' }}>🪙</div>
      <div style={{ position: 'absolute', top: '25%', right: '15%', fontSize: 32, animation: 'float 2.5s ease-in-out infinite 0.5s, coinSpin 1.8s linear infinite' }}>🪙</div>
      <div style={{ position: 'absolute', bottom: '25%', left: '15%', fontSize: 36, animation: 'float 2.8s ease-in-out infinite 1s, coinSpin 2.2s linear infinite' }}>🪙</div>
      <div style={{ position: 'absolute', bottom: '30%', right: '20%', fontSize: 28, animation: 'float 3.2s ease-in-out infinite 0.3s, coinSpin 1.5s linear infinite' }}>⭐</div>

      {/* Logo */}
      <div style={{ animation: 'float 4s ease-in-out infinite', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(36px, 8vw, 72px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #8b5cf6, #22d3ee, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'glow 3s ease-in-out infinite',
          margin: 0, lineHeight: 1.1,
        }}>
          FASKA 64
        </h1>
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(14px, 3vw, 20px)',
          color: '#94a3b8',
          fontWeight: 500,
          marginTop: 8,
          letterSpacing: 4,
        }}>
          3D PLATFORMER ADVENTURE
        </p>
      </div>

      {/* Character preview */}
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(34, 211, 238, 0.2)',
        animation: 'float 3s ease-in-out infinite 0.5s',
      }}>
        <span style={{ fontSize: 48 }}>🏃</span>
      </div>

      {/* Instructions */}
      <div style={{
        display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
        maxWidth: 400,
      }}>
        {[
          { icon: '🕹️', text: 'WASD / Joystick' },
          { icon: '🦘', text: 'Space = Jump' },
          { icon: '✨', text: 'Double Jump in air' },
          { icon: '💥', text: 'Shift = Ground Pound' },
          { icon: '🪙', text: 'Collect all coins!' },
        ].map(({ icon, text }) => (
          <div key={text} style={{
            background: 'rgba(42, 42, 90, 0.5)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: 10, padding: '8px 14px',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 13, color: '#cbd5e1',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span>{icon}</span> {text}
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        style={{
          padding: '16px 48px', borderRadius: 16,
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          color: '#fff', fontFamily: 'Outfit, sans-serif',
          fontSize: 22, fontWeight: 700,
          cursor: 'pointer', letterSpacing: 2,
          boxShadow: '0 4px 30px rgba(124, 58, 237, 0.4)',
          animation: 'pulse 2s ease-in-out infinite',
          transition: 'transform 0.2s',
        }}
        onPointerEnter={(e) => { e.target.style.transform = 'scale(1.08)'; }}
        onPointerLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
      >
        🚀 START GAME
      </button>
    </div>
  );
}

/**
 * CoinCounter — Shows coin collection progress.
 */
function CoinCounter() {
  const coinsCollected = useFaskaSixtyFourStore(s => s.coinsCollected);
  const totalCoins = useFaskaSixtyFourStore(s => s.totalCoins);
  const comboCount = useFaskaSixtyFourStore(s => s.comboCount);
  const comboTimer = useFaskaSixtyFourStore(s => s.comboTimer);

  const isCombo = Date.now() - comboTimer < 2000 && comboCount > 1;

  return (
    <div style={{
      position: 'absolute', top: 60, left: 16,
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'rgba(10, 10, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12, padding: '8px 16px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        fontFamily: 'Outfit, sans-serif',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <span style={{ fontSize: 18 }}>🪙</span>
        <span style={{ color: '#fbbf24', fontSize: 16, fontWeight: 700 }}>
          {coinsCollected} / {totalCoins}
        </span>
      </div>
      {isCombo && (
        <div style={{
          background: 'rgba(251, 191, 36, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: 10, padding: '4px 12px',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          fontFamily: 'Outfit, sans-serif',
          color: '#fbbf24', fontSize: 14, fontWeight: 700,
          marginTop: 6, textAlign: 'center',
          animation: 'pulse 0.5s ease-in-out infinite',
        }}>
          🔥 x{comboCount} COMBO!
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>
    </div>
  );
}

/**
 * GameContent — The 3D scene content rendered inside SwarmOrchestrator.
 */
function GameContent() {
  return (
    <>
      <Player />
      <World />
    </>
  );
}

/**
 * FaskaSixtyFourSwarm — Main orchestrator component.
 */
export default function FaskaSixtyFourSwarm() {
  const navigate = useNavigate();
  const store = useFaskaSixtyFourStore;

  // State selectors
  const isPlaying = useFaskaSixtyFourStore(s => s.isPlaying);
  const isPaused = useFaskaSixtyFourStore(s => s.isPaused);
  const isGameOver = useFaskaSixtyFourStore(s => s.isGameOver);
  const score = useFaskaSixtyFourStore(s => s.score);
  const lives = useFaskaSixtyFourStore(s => s.lives);
  const level = useFaskaSixtyFourStore(s => s.level);
  const quizActive = useFaskaSixtyFourStore(s => s.quizActive);
  const quizQuestion = useFaskaSixtyFourStore(s => s.quizQuestion);
  const quizScore = useFaskaSixtyFourStore(s => s.quizScore);
  const quizStreak = useFaskaSixtyFourStore(s => s.quizStreak);
  const startGame = useFaskaSixtyFourStore(s => s.startGame);
  const pauseGame = useFaskaSixtyFourStore(s => s.pauseGame);
  const answerQuiz = useFaskaSixtyFourStore(s => s.answerQuiz);

  // Hook up keyboard + touch input
  const { onMove, onAction, onActionUp } = useGameInput(store);

  const handleExit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleRestart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleQuizAnswer = useCallback((answer) => {
    answerQuiz(answer);
  }, [answerQuiz]);

  // Mobile button config
  const mobileButtons = [
    { label: '🦘', id: 'A', color: '#10b981' },  // Jump — green
    { label: '💥', id: 'B', color: '#ef4444' },  // Ground Pound — red
  ];

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* Start Screen */}
      {!isPlaying && !isGameOver && (
        <StartScreen onStart={handleStart} />
      )}

      {/* 3D Canvas */}
      <SwarmOrchestrator
        gameName="Faska 64"
        gravity={[0, -20, 0]}
        cameraProps={{ position: [0, 8, 15], fov: 65 }}
      >
        {isPlaying && <GameContent />}
      </SwarmOrchestrator>

      {/* HUD Overlay */}
      {isPlaying && (
        <>
          <UIOverlay
            score={score}
            lives={lives}
            level={level}
            isPaused={isPaused}
            isGameOver={isGameOver}
            onPause={pauseGame}
            onRestart={handleRestart}
            onExit={handleExit}
            gameName="Faska 64"
            showLearncadeScore
            quizScore={quizScore}
          >
            <CoinCounter />
          </UIOverlay>

          {/* Mobile Joystick */}
          <MobileJoystick
            onMove={onMove}
            onAction={onAction}
            onActionUp={onActionUp}
            buttons={mobileButtons}
          />
        </>
      )}

      {/* Learncade Quiz */}
      <LearncadeQuiz
        active={quizActive}
        question={quizQuestion}
        onAnswer={handleQuizAnswer}
        streak={quizStreak}
        quizScore={quizScore}
      />
    </div>
  );
}
