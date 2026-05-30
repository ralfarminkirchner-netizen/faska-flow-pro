import { useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import World from './World';
import Player from './Player';
import useSpaceInvadersStore from './GameLogic';

/**
 * GameTicker — Runs the game loop inside the Canvas via useFrame.
 */
function GameTicker() {
  const store = useSpaceInvadersStore;

  useFrame((_, delta) => {
    try {
      store.getState().tick(Math.min(delta, 0.05)); // Cap delta to avoid spiral
    } catch (err) {
      console.error('[SpaceInvaders] tick error:', err);
    }
  });

  return null;
}

/**
 * WaveDisplay — Shows current wave number.
 */
function WaveDisplay({ wave }) {
  if (wave <= 1) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 60,
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'rgba(10, 10, 26, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12, padding: '6px 18px',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        fontFamily: 'Outfit, sans-serif',
        color: '#a855f7', fontSize: 15, fontWeight: 700,
        textShadow: '0 0 10px rgba(168, 85, 247, 0.3)',
      }}>
        🌊 Welle {wave}
      </div>
    </div>
  );
}

/**
 * StartScreen — Shown before game starts.
 */
function StartScreen({ onStart, highScore }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 5, 16, 0.92)',
      backdropFilter: 'blur(14px)',
      flexDirection: 'column', gap: 20,
    }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 42,
        fontWeight: 900, color: '#a855f7',
        textShadow: '0 0 40px rgba(168, 85, 247, 0.5)',
        margin: 0, textAlign: 'center',
      }}>
        👾 FASKA SPACE INVADERS
      </h1>
      <p style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 15,
        color: '#94a3b8', maxWidth: 420, textAlign: 'center',
        lineHeight: 1.5,
      }}>
        Verteidige die Erde gegen Alien-Invasoren!
        <br />Bewege dich mit Joystick/Pfeiltasten links/rechts.
        <br />Drücke A/Leertaste zum Schießen.
      </p>
      <div style={{
        display: 'flex', gap: 24, alignItems: 'center',
        fontFamily: 'Outfit, sans-serif', fontSize: 13,
        color: '#64748b',
      }}>
        <span>👾 <span style={{ color: '#10b981' }}>10</span></span>
        <span>🦀 <span style={{ color: '#06b6d4' }}>20</span></span>
        <span>🐙 <span style={{ color: '#a855f7' }}>30</span></span>
      </div>
      {highScore > 0 && (
        <p style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 14,
          color: '#f59e0b',
        }}>
          🏆 Highscore: {highScore.toLocaleString()}
        </p>
      )}
      <button
        onClick={onStart}
        className="btn-primary"
        style={{
          padding: '14px 48px', fontSize: 18,
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          border: 'none', borderRadius: 14,
          color: '#fff', fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 4px 30px rgba(168, 85, 247, 0.4)',
        }}
      >
        🚀 Spiel starten!
      </button>
    </div>
  );
}

/**
 * FaskaSpaceInvadersSwarm — Main orchestrator for Space Invaders.
 *
 * Fixed front-facing camera. Left/right joystick + A to fire.
 * Classic Space Invaders gameplay with 3D visuals.
 */
export default function FaskaSpaceInvadersSwarm() {
  const score = useSpaceInvadersStore(s => s.score);
  const highScore = useSpaceInvadersStore(s => s.highScore);
  const lives = useSpaceInvadersStore(s => s.lives);
  const level = useSpaceInvadersStore(s => s.level);
  const isPlaying = useSpaceInvadersStore(s => s.isPlaying);
  const isPaused = useSpaceInvadersStore(s => s.isPaused);
  const isGameOver = useSpaceInvadersStore(s => s.isGameOver);
  const wave = useSpaceInvadersStore(s => s.wave);
  const quizActive = useSpaceInvadersStore(s => s.quizActive);
  const quizQuestion = useSpaceInvadersStore(s => s.quizQuestion);
  const quizScore = useSpaceInvadersStore(s => s.quizScore);
  const quizStreak = useSpaceInvadersStore(s => s.quizStreak);

  const startGame = useSpaceInvadersStore(s => s.startGame);
  const pauseGame = useSpaceInvadersStore(s => s.pauseGame);
  const answerQuiz = useSpaceInvadersStore(s => s.answerQuiz);

  // Input hook connects keyboard + joystick to store
  const { onMove, onAction, onActionUp } = useGameInput(useSpaceInvadersStore);

  const handleRestart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleExit = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Start Screen */}
      {!isPlaying && !isGameOver && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}

      {/* 3D Scene */}
      <SwarmOrchestrator
        gameName="Space Invaders"
        gravity={[0, 0, 0]}
        cameraProps={{
          position: [0, 4, 14],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        onReset={handleRestart}
      >
        <World />
        <Player />
        <GameTicker />
      </SwarmOrchestrator>

      {/* HUD */}
      {(isPlaying || isGameOver) && (
        <UIOverlay
          score={score}
          lives={lives}
          level={level}
          isPaused={isPaused}
          isGameOver={isGameOver}
          onPause={pauseGame}
          onRestart={handleRestart}
          onExit={handleExit}
          gameName="Space Invaders"
          showLearncadeScore
          quizScore={quizScore}
        >
          <WaveDisplay wave={wave} />
        </UIOverlay>
      )}

      {/* Touch Controls — Left/right + A to fire */}
      {isPlaying && !isPaused && !isGameOver && !quizActive && (
        <MobileJoystick
          onMove={onMove}
          onAction={onAction}
          onActionUp={onActionUp}
          buttons={[
            { label: '🔫', id: 'A', color: '#4ade80' },
          ]}
        />
      )}

      {/* Learncade Quiz */}
      <LearncadeQuiz
        active={quizActive}
        question={quizQuestion}
        onAnswer={answerQuiz}
        streak={quizStreak}
        quizScore={quizScore}
      />
    </div>
  );
}
