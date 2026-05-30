import { useEffect, useCallback } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useMicroStore from './GameLogic';
import World from './World';
import Player from './Player';

/**
 * FaskaMicroMachinesSwarm — Top-Down Racing on a Tabletop
 * 
 * Controls:
 *   Joystick left/right = steer (rotate car)
 *   A button (Space/Enter) = accelerate forward
 *   B button (Shift) = brake/reverse
 * 
 * Overhead camera looking straight down.
 */

// Countdown overlay
function CountdownOverlay() {
  const countdown = useMicroStore(s => s.countdown);
  const countdownActive = useMicroStore(s => s.countdownActive);

  useEffect(() => {
    if (!countdownActive) return;
    const interval = setInterval(() => {
      useMicroStore.getState().tickCountdown();
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownActive]);

  if (!countdownActive) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)',
      pointerEvents: 'none',
    }}>
      <div style={{
        fontSize: 120, fontWeight: 900,
        fontFamily: 'Outfit, sans-serif',
        color: countdown > 0 ? '#f59e0b' : '#10b981',
        textShadow: '0 0 40px rgba(245, 158, 11, 0.8), 0 4px 20px rgba(0,0,0,0.5)',
        animation: 'bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {countdown > 0 ? countdown : 'GO!'}
      </div>
      <style>{`@keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}

// Race HUD
function RaceHUD() {
  const lap = useMicroStore(s => s.lap);
  const totalLaps = useMicroStore(s => s.totalLaps);
  const raceTime = useMicroStore(s => s.raceTime);
  const carSpeed = useMicroStore(s => s.carSpeed);
  const bestLapTime = useMicroStore(s => s.bestLapTime);
  const isDrifting = useMicroStore(s => s.isDrifting);
  const finished = useMicroStore(s => s.finished);
  const collisionSlowdown = useMicroStore(s => s.collisionSlowdown);

  const formatTime = (t) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    const ms = Math.floor((t * 100) % 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Bottom HUD */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 14, alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {/* Lap */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 18px',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>LAP</div>
          <div style={{ fontSize: 22, color: '#e2e8f0', fontWeight: 800 }}>
            {Math.min(lap + 1, totalLaps)}/{totalLaps}
          </div>
        </div>

        {/* Timer */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 18px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>TIME</div>
          <div style={{ fontSize: 20, color: '#06b6d4', fontWeight: 700 }}>
            {formatTime(raceTime)}
          </div>
        </div>

        {/* Speed */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 18px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>SPEED</div>
          <div style={{ fontSize: 20, color: '#10b981', fontWeight: 700 }}>
            {Math.round(Math.abs(carSpeed) * 10)}
          </div>
        </div>

        {/* Best lap */}
        {bestLapTime < Infinity && (
          <div style={{
            background: 'rgba(10, 10, 26, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14, padding: '10px 18px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>BEST</div>
            <div style={{ fontSize: 18, color: '#f59e0b', fontWeight: 700 }}>
              {formatTime(bestLapTime)}
            </div>
          </div>
        )}

        {/* Drift indicator */}
        {isDrifting && (
          <div style={{
            background: 'rgba(236, 72, 153, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14, padding: '10px 18px',
            border: '1px solid rgba(236, 72, 153, 0.5)',
            fontFamily: 'Outfit, sans-serif',
            textAlign: 'center',
            animation: 'pulse 0.3s ease infinite alternate',
          }}>
            <div style={{ fontSize: 16, color: '#ec4899', fontWeight: 800 }}>
              🏎️ DRIFT!
            </div>
          </div>
        )}

        {/* Collision warning */}
        {collisionSlowdown > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: 14, padding: '10px 18px',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            fontFamily: 'Outfit, sans-serif',
          }}>
            <div style={{ fontSize: 14, color: '#ef4444', fontWeight: 700 }}>
              💥 HIT!
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }`}</style>

      {/* Race finished overlay */}
      {finished && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5, 5, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          flexDirection: 'column', gap: 16,
          pointerEvents: 'auto', zIndex: 90,
        }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>🏁</div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 44,
            fontWeight: 900, color: '#f59e0b',
            textShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
            margin: 0,
          }}>
            RACE COMPLETE!
          </h2>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 22,
            color: '#e2e8f0', fontWeight: 600,
          }}>
            Time: {formatTime(raceTime)}
          </p>
          {bestLapTime < Infinity && (
            <p style={{
              fontFamily: 'Outfit, sans-serif', fontSize: 18,
              color: '#f59e0b', fontWeight: 600,
            }}>
              Best Lap: {formatTime(bestLapTime)}
            </p>
          )}
          <button
            onClick={() => useMicroStore.getState().startRace()}
            className="btn-primary"
            style={{ marginTop: 8, fontSize: 18, padding: '14px 36px' }}
          >
            🔄 Race Again
          </button>
        </div>
      )}
    </>
  );
}

export default function FaskaMicroMachinesSwarm() {
  const { onMove, onAction, onActionUp } = useGameInput(useMicroStore);

  const score = useMicroStore(s => s.score);
  const lives = useMicroStore(s => s.lives);
  const level = useMicroStore(s => s.level);
  const isPaused = useMicroStore(s => s.isPaused);
  const isGameOver = useMicroStore(s => s.isGameOver);
  const isPlaying = useMicroStore(s => s.isPlaying);
  const quizActive = useMicroStore(s => s.quizActive);
  const quizQuestion = useMicroStore(s => s.quizQuestion);
  const quizScore = useMicroStore(s => s.quizScore);
  const quizStreak = useMicroStore(s => s.quizStreak);

  // Auto-start race on mount
  useEffect(() => {
    if (!isPlaying) {
      useMicroStore.getState().startRace();
    }
  }, []);

  const handlePause = useCallback(() => {
    useMicroStore.getState().pauseGame();
  }, []);

  const handleRestart = useCallback(() => {
    useMicroStore.getState().startRace();
  }, []);

  const handleQuizAnswer = useCallback((answer) => {
    useMicroStore.getState().answerQuiz(answer);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <SwarmOrchestrator
        gameName="Micro Machines"
        gravity={[0, -9.81, 0]}
        cameraProps={{
          position: [0, 30, 0.01],
          fov: 55,
          near: 0.1,
          far: 200,
        }}
        onReset={handleRestart}
      >
        <World />
        <Player />
      </SwarmOrchestrator>

      {/* Countdown */}
      <CountdownOverlay />

      {/* Standard HUD */}
      <UIOverlay
        score={score}
        lives={lives}
        level={level}
        isPaused={isPaused}
        isGameOver={isGameOver}
        onPause={handlePause}
        onRestart={handleRestart}
        gameName="Micro Machines"
        showLearncadeScore
        quizScore={quizScore}
      >
        <RaceHUD />
      </UIOverlay>

      {/* Learncade Quiz */}
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
          { label: '🏎️', id: 'A', color: '#10b981' },
          { label: '🛑', id: 'B', color: '#ef4444' },
        ]}
      />
    </div>
  );
}
