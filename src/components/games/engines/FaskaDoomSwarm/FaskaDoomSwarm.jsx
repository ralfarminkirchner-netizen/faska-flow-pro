import { useEffect, useCallback } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useDoomStore from './GameLogic';
import Player, { Crosshair } from './Player';
import World from './World';

/**
 * FaskaDoomSwarm — Simplified FPS Game
 * Features:
 * - First-person camera with pointer lock (desktop) / touch look (mobile)
 * - Wave-based enemy combat
 * - Health and ammo management
 * - Pickup items
 * - Learncade quiz integration
 */

// Custom HUD for Doom-specific info
function DoomHUD() {
  const health = useDoomStore((s) => s.health);
  const maxHealth = useDoomStore((s) => s.maxHealth);
  const ammo = useDoomStore((s) => s.ammo);
  const maxAmmo = useDoomStore((s) => s.maxAmmo);
  const wave = useDoomStore((s) => s.wave);
  const waveCleared = useDoomStore((s) => s.waveCleared);
  const enemies = useDoomStore((s) => s.enemies);
  const aliveCount = enemies.filter((e) => e.alive).length;

  const healthPct = (health / maxHealth) * 100;
  const healthColor = healthPct > 60 ? '#22ff44' : healthPct > 30 ? '#ffaa00' : '#ff2222';

  return (
    <>
      {/* Bottom HUD bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '16px 20px',
          pointerEvents: 'none',
          zIndex: 55,
        }}
      >
        {/* Health */}
        <div
          style={{
            background: 'rgba(10, 10, 26, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14,
            padding: '10px 18px',
            border: `1px solid ${healthColor}33`,
            minWidth: 140,
          }}
        >
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 11,
              color: '#94a3b8',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            ❤️ Health
          </div>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 28,
              fontWeight: 800,
              color: healthColor,
              textShadow: `0 0 20px ${healthColor}66`,
            }}
          >
            {health}
          </div>
          {/* Health bar */}
          <div
            style={{
              width: '100%',
              height: 4,
              background: '#1a1a2e',
              borderRadius: 2,
              marginTop: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${healthPct}%`,
                height: '100%',
                background: healthColor,
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Wave indicator */}
        <div
          style={{
            background: 'rgba(10, 10, 26, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14,
            padding: '8px 16px',
            border: '1px solid rgba(255, 68, 68, 0.2)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 11,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            🔥 Wave {wave}
          </div>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              color: waveCleared ? '#22ff44' : '#ff4444',
              marginTop: 2,
            }}
          >
            {waveCleared ? '✅ CLEARED!' : `👾 ${aliveCount} enemies`}
          </div>
        </div>

        {/* Ammo */}
        <div
          style={{
            background: 'rgba(10, 10, 26, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14,
            padding: '10px 18px',
            border: '1px solid rgba(255, 204, 0, 0.2)',
            minWidth: 120,
            textAlign: 'right',
          }}
        >
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 11,
              color: '#94a3b8',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            🔫 Ammo
          </div>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 28,
              fontWeight: 800,
              color: ammo > 10 ? '#ffcc00' : '#ff4444',
              textShadow: ammo <= 5 ? '0 0 20px #ff000066' : '0 0 20px #ffaa0044',
            }}
          >
            {ammo}
            <span
              style={{
                fontSize: 14,
                color: '#94a3b8',
                fontWeight: 400,
              }}
            >
              /{maxAmmo}
            </span>
          </div>
        </div>
      </div>

      {/* Damage flash overlay */}
      {health < 30 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(255, 0, 0, ${0.15 * (1 - health / 30)}) 100%)`,
            zIndex: 52,
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// Start screen
function StartScreen({ onStart }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #050510 70%)',
        zIndex: 100,
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <h1
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 52,
          fontWeight: 900,
          color: '#ff2222',
          textShadow: '0 0 40px rgba(255, 34, 34, 0.6), 0 0 80px rgba(255, 34, 34, 0.3)',
          letterSpacing: 4,
          margin: 0,
        }}
      >
        FASKA DOOM
      </h1>
      <p
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 16,
          color: '#94a3b8',
          maxWidth: 400,
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        🖱️ Click to look around • WASD to move • Space/A to shoot
        <br />
        📱 Left joystick to move • Right side to look • A button to shoot
      </p>
      <button
        onClick={onStart}
        className="btn-primary"
        style={{
          padding: '16px 48px',
          fontSize: 20,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #cc2222, #ff4444)',
          border: '2px solid #ff666644',
          borderRadius: 16,
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
          boxShadow: '0 0 30px rgba(255, 34, 34, 0.4)',
        }}
      >
        ⚔️ START GAME
      </button>
    </div>
  );
}

export default function FaskaDoomSwarm() {
  const score = useDoomStore((s) => s.score);
  const lives = useDoomStore((s) => s.lives);
  const level = useDoomStore((s) => s.level);
  const isPlaying = useDoomStore((s) => s.isPlaying);
  const isPaused = useDoomStore((s) => s.isPaused);
  const isGameOver = useDoomStore((s) => s.isGameOver);
  const quizActive = useDoomStore((s) => s.quizActive);
  const quizQuestion = useDoomStore((s) => s.quizQuestion);
  const quizScore = useDoomStore((s) => s.quizScore);
  const quizStreak = useDoomStore((s) => s.quizStreak);

  const startGame = useDoomStore((s) => s.startGame);
  const pauseGame = useDoomStore((s) => s.pauseGame);
  const answerQuiz = useDoomStore((s) => s.answerQuiz);

  // Input hook
  const { onMove, onAction, onActionUp } = useGameInput(useDoomStore);

  const handleStart = useCallback(() => {
    try {
      startGame();
    } catch (e) {
      console.error('[FaskaDoomSwarm] start error:', e);
    }
  }, [startGame]);

  const handleRestart = useCallback(() => {
    try {
      startGame();
    } catch (e) {
      console.error('[FaskaDoomSwarm] restart error:', e);
    }
  }, [startGame]);

  const handleExit = useCallback(() => {
    try {
      window.history.back();
    } catch (e) {
      // Silent
    }
  }, []);

  const handleQuizAnswer = useCallback(
    (answer) => {
      try {
        answerQuiz(answer);
      } catch (e) {
        console.warn('[FaskaDoomSwarm] quiz error:', e);
      }
    },
    [answerQuiz]
  );

  // Show start screen if not playing and not game over
  if (!isPlaying && !isGameOver) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <SwarmOrchestrator
        gameName="FASKA DOOM"
        gravity={[0, -20, 0]}
        cameraProps={{
          position: [0, 2, 0],
          fov: 75,
          near: 0.1,
          far: 100,
        }}
        onReset={handleRestart}
      >
        <World />
        <Player />
      </SwarmOrchestrator>

      {/* Crosshair */}
      {isPlaying && !isPaused && <Crosshair />}

      {/* Main HUD */}
      <UIOverlay
        score={score}
        lives={lives}
        level={level}
        isPaused={isPaused}
        isGameOver={isGameOver}
        onPause={pauseGame}
        onRestart={handleRestart}
        onExit={handleExit}
        gameName="FASKA DOOM"
        showLearncadeScore
        quizScore={quizScore}
      />

      {/* Doom-specific HUD */}
      {isPlaying && <DoomHUD />}

      {/* Quiz overlay */}
      <LearncadeQuiz
        active={quizActive}
        question={quizQuestion}
        onAnswer={handleQuizAnswer}
        streak={quizStreak}
        quizScore={quizScore}
      />

      {/* Mobile controls */}
      <MobileJoystick
        onMove={onMove}
        onAction={onAction}
        onActionUp={onActionUp}
        buttons={[
          { label: '🔫', id: 'A', color: '#ff4444' },
          { label: '🔄', id: 'B', color: '#4488ff' },
        ]}
      />
    </div>
  );
}
