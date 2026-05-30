import { useEffect, useCallback } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useKartStore from './GameLogic';
import World from './World';
import Player from './Player';

/**
 * FaskaKartSwarm — 3D Kart Racing Game Orchestrator
 * 
 * Controls:
 *   Joystick left/right = steer
 *   A button (Space/Enter) = accelerate
 *   B button (Shift) = brake/reverse
 *   X button (E) = use boost
 */

// Countdown overlay
function CountdownOverlay() {
  const countdown = useKartStore(s => s.countdown);
  const countdownActive = useKartStore(s => s.countdownActive);

  useEffect(() => {
    if (!countdownActive) return;
    const interval = setInterval(() => {
      useKartStore.getState().tickCountdown();
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

// Race HUD (extra elements inside UIOverlay)
function RaceHUD() {
  const lap = useKartStore(s => s.lap);
  const totalLaps = useKartStore(s => s.totalLaps);
  const position = useKartStore(s => s.position);
  const raceTime = useKartStore(s => s.raceTime);
  const boostCount = useKartStore(s => s.boostCount);
  const boostActive = useKartStore(s => s.boostActive);
  const playerSpeed = useKartStore(s => s.playerSpeed);
  const finished = useKartStore(s => s.finished);

  const formatTime = () => {
    const mins = Math.floor(raceTime / 60);
    const secs = Math.floor(raceTime % 60);
    const ms = Math.floor((raceTime * 100) % 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const posText = ['', '1st', '2nd', '3rd', '4th'][position] || `${position}th`;

  return (
    <>
      {/* Bottom HUD bar */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 16, alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {/* Lap counter */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 20px',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>LAP</div>
          <div style={{ fontSize: 22, color: '#e2e8f0', fontWeight: 800 }}>
            {Math.min(lap + 1, totalLaps)}/{totalLaps}
          </div>
        </div>

        {/* Position */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 20px',
          border: `1px solid ${position === 1 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(124, 58, 237, 0.3)'}`,
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>POS</div>
          <div style={{
            fontSize: 22, fontWeight: 800,
            color: position === 1 ? '#f59e0b' : position === 2 ? '#94a3b8' : '#cd7f32',
          }}>
            {posText}
          </div>
        </div>

        {/* Timer */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 20px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>TIME</div>
          <div style={{ fontSize: 20, color: '#06b6d4', fontWeight: 700 }}>
            {formatTime()}
          </div>
        </div>

        {/* Speed */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 20px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>SPEED</div>
          <div style={{ fontSize: 20, color: '#10b981', fontWeight: 700 }}>
            {Math.round(Math.abs(playerSpeed) * 12)} km/h
          </div>
        </div>

        {/* Boost */}
        <div style={{
          background: boostActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 20px',
          border: `1px solid ${boostActive ? 'rgba(245, 158, 11, 0.6)' : 'rgba(245, 158, 11, 0.2)'}`,
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
          transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>BOOST</div>
          <div style={{ fontSize: 20, color: '#f59e0b', fontWeight: 700 }}>
            {'🔥'.repeat(boostCount)}{'⬛'.repeat(3 - boostCount)}
          </div>
        </div>
      </div>

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
            fontFamily: 'Outfit, sans-serif', fontSize: 48,
            fontWeight: 900, color: '#f59e0b',
            textShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
            margin: 0,
          }}>
            RACE COMPLETE!
          </h2>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 24,
            color: '#e2e8f0', fontWeight: 600,
          }}>
            {posText} Place • {formatTime()}
          </p>
          <button
            onClick={() => useKartStore.getState().startRace()}
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

export default function FaskaKartSwarm() {
  const { onMove, onAction, onActionUp } = useGameInput(useKartStore);

  const score = useKartStore(s => s.score);
  const lives = useKartStore(s => s.lives);
  const level = useKartStore(s => s.level);
  const isPaused = useKartStore(s => s.isPaused);
  const isGameOver = useKartStore(s => s.isGameOver);
  const isPlaying = useKartStore(s => s.isPlaying);
  const quizActive = useKartStore(s => s.quizActive);
  const quizQuestion = useKartStore(s => s.quizQuestion);
  const quizScore = useKartStore(s => s.quizScore);
  const quizStreak = useKartStore(s => s.quizStreak);

  // Auto-start race on mount
  useEffect(() => {
    if (!isPlaying) {
      useKartStore.getState().startRace();
    }
  }, []);

  const handlePause = useCallback(() => {
    useKartStore.getState().pauseGame();
  }, []);

  const handleRestart = useCallback(() => {
    useKartStore.getState().startRace();
  }, []);

  const handleQuizAnswer = useCallback((answer) => {
    useKartStore.getState().answerQuiz(answer);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <SwarmOrchestrator
        gameName="Faska Kart"
        gravity={[0, -20, 0]}
        cameraProps={{ position: [0, 8, 15], fov: 65 }}
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
        gameName="Faska Kart"
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
          { label: '🔥', id: 'X', color: '#f59e0b' },
        ]}
      />
    </div>
  );
}
