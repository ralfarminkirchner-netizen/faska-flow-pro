import { useCallback } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import World from './World';
import Player, { Crosshair } from './Player';
import useMoorhuhnStore from './GameLogic';

/**
 * AmmoDisplay — Shows current ammo count and reload state.
 */
function AmmoDisplay({ ammo, maxAmmo, reloading }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {reloading ? (
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12, padding: '8px 20px',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          fontFamily: 'Outfit, sans-serif',
          color: '#ef4444', fontSize: 16, fontWeight: 700,
          animation: 'pulse 0.5s ease infinite alternate',
        }}>
          🔄 NACHLADE...
          <style>{`@keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }`}</style>
        </div>
      ) : (
        Array.from({ length: maxAmmo }).map((_, i) => (
          <div key={i} style={{
            width: 10, height: 28,
            borderRadius: 3,
            background: i < ammo
              ? 'linear-gradient(to top, #b45309, #f59e0b)'
              : 'rgba(60, 60, 80, 0.5)',
            border: `1px solid ${i < ammo ? '#f59e0b' : '#333'}`,
            boxShadow: i < ammo ? '0 0 6px rgba(245, 158, 11, 0.4)' : 'none',
            transition: 'all 0.15s ease',
          }} />
        ))
      )}
    </div>
  );
}

/**
 * ComboDisplay — Shows current combo multiplier.
 */
function ComboDisplay({ combo, comboTimer }) {
  if (combo <= 0) return null;
  const opacity = Math.min(1, comboTimer);
  return (
    <div style={{
      position: 'absolute',
      bottom: 70,
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      opacity,
      transition: 'opacity 0.3s ease',
    }}>
      <div style={{
        background: combo >= 5
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(239, 68, 68, 0.3))'
          : 'rgba(10, 10, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 14, padding: '6px 18px',
        border: `1px solid ${combo >= 5 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.3)'}`,
        fontFamily: 'Outfit, sans-serif',
        color: combo >= 5 ? '#f59e0b' : '#10b981',
        fontSize: combo >= 5 ? 22 : 18,
        fontWeight: 800,
        textShadow: combo >= 5 ? '0 0 20px rgba(245, 158, 11, 0.5)' : 'none',
      }}>
        🔥 COMBO x{combo}
        <span style={{ fontSize: 13, marginLeft: 8, opacity: 0.8 }}>
          (+{Math.round(combo * 50)}%)
        </span>
      </div>
    </div>
  );
}

/**
 * TimerDisplay — Countdown timer.
 */
function TimerDisplay({ timeLeft }) {
  const isLow = timeLeft <= 10;
  const mins = Math.floor(timeLeft / 60);
  const secs = Math.floor(timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{
      position: 'absolute',
      top: 60,
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: isLow
          ? 'rgba(239, 68, 68, 0.2)'
          : 'rgba(10, 10, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 14, padding: '8px 24px',
        border: `1px solid ${isLow ? 'rgba(239, 68, 68, 0.5)' : 'rgba(124, 58, 237, 0.2)'}`,
        fontFamily: 'Outfit, monospace',
        color: isLow ? '#ef4444' : '#e2e8f0',
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: 2,
        animation: isLow ? 'pulse 0.5s ease infinite alternate' : 'none',
      }}>
        ⏱ {mins}:{secs}
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
      background: 'rgba(5, 5, 16, 0.9)',
      backdropFilter: 'blur(12px)',
      flexDirection: 'column', gap: 20,
    }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 48,
        fontWeight: 900, color: '#f59e0b',
        textShadow: '0 0 40px rgba(245, 158, 11, 0.4)',
        margin: 0,
      }}>
        🐔 FASKA MOORHUHN
      </h1>
      <p style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 16,
        color: '#94a3b8', maxWidth: 400, textAlign: 'center',
      }}>
        Schieße auf die fliegenden Hühner! Treffe die goldenen für Bonuspunkte.
        <br />Tap/Click zum Schießen. Nachlade ist automatisch.
      </p>
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
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: 'none', borderRadius: 14,
          color: '#000', fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 4px 30px rgba(245, 158, 11, 0.3)',
        }}
      >
        🎯 Spiel starten!
      </button>
    </div>
  );
}

/**
 * FaskaMoorhuhnSwarm — Main orchestrator component.
 * 
 * Shooting gallery game: tap/click to shoot flying birds.
 * Fixed camera, no joystick needed.
 * 60-second timer, ammo/reload, combo multiplier.
 */
export default function FaskaMoorhuhnSwarm() {
  const score = useMoorhuhnStore(s => s.score);
  const highScore = useMoorhuhnStore(s => s.highScore);
  const lives = useMoorhuhnStore(s => s.lives);
  const level = useMoorhuhnStore(s => s.level);
  const isPlaying = useMoorhuhnStore(s => s.isPlaying);
  const isPaused = useMoorhuhnStore(s => s.isPaused);
  const isGameOver = useMoorhuhnStore(s => s.isGameOver);
  const ammo = useMoorhuhnStore(s => s.ammo);
  const maxAmmo = useMoorhuhnStore(s => s.maxAmmo);
  const reloading = useMoorhuhnStore(s => s.reloading);
  const timeLeft = useMoorhuhnStore(s => s.timeLeft);
  const combo = useMoorhuhnStore(s => s.combo);
  const comboTimer = useMoorhuhnStore(s => s.comboTimer);
  const quizActive = useMoorhuhnStore(s => s.quizActive);
  const quizQuestion = useMoorhuhnStore(s => s.quizQuestion);
  const quizScore = useMoorhuhnStore(s => s.quizScore);
  const quizStreak = useMoorhuhnStore(s => s.quizStreak);

  const startGame = useMoorhuhnStore(s => s.startGame);
  const pauseGame = useMoorhuhnStore(s => s.pauseGame);
  const answerQuiz = useMoorhuhnStore(s => s.answerQuiz);
  const reload = useMoorhuhnStore(s => s.reload);

  const handleRestart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleExit = useCallback(() => {
    window.history.back();
  }, []);

  const handleReload = useCallback(() => {
    reload();
  }, [reload]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Start Screen */}
      {!isPlaying && !isGameOver && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}

      {/* 3D Scene */}
      <SwarmOrchestrator
        gameName="Moorhuhn"
        gravity={[0, -9.81, 0]}
        cameraProps={{
          position: [0, 4, 8],
          fov: 55,
          near: 0.1,
          far: 100,
        }}
        onReset={handleRestart}
      >
        <World />
        <Player />
      </SwarmOrchestrator>

      {/* Crosshair */}
      {isPlaying && !isPaused && !quizActive && <Crosshair />}

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
          gameName="Moorhuhn"
          showLearncadeScore
          quizScore={quizScore}
        >
          {/* Timer */}
          <TimerDisplay timeLeft={timeLeft} />

          {/* Ammo */}
          <AmmoDisplay ammo={ammo} maxAmmo={maxAmmo} reloading={reloading} />

          {/* Combo */}
          <ComboDisplay combo={combo} comboTimer={comboTimer} />

          {/* Reload button (touch) */}
          {!reloading && ammo < maxAmmo && (
            <div style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              pointerEvents: 'auto',
            }}>
              <button
                onClick={handleReload}
                onTouchStart={(e) => { e.preventDefault(); handleReload(); }}
                style={{
                  width: 56, height: 56, borderRadius: 28,
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '2px solid rgba(245, 158, 11, 0.5)',
                  color: '#f59e0b', fontSize: 22,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                }}
              >
                🔄
              </button>
            </div>
          )}

          {/* Level indicator */}
          {level > 1 && (
            <div style={{
              position: 'absolute',
              top: 60,
              right: 16,
              pointerEvents: 'none',
            }}>
              <div style={{
                background: 'rgba(10, 10, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 12, padding: '6px 14px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                fontFamily: 'Outfit, sans-serif',
                color: '#06b6d4', fontSize: 14, fontWeight: 700,
              }}>
                🎯 Level {level}
              </div>
            </div>
          )}
        </UIOverlay>
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
