import { useCallback, useEffect, useRef } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useSnakeStore from './GameLogic';
import World from './World';
import Player from './Player';

/**
 * FaskaSnakeSwarm — 3D Snake game with top-down camera.
 * D-pad controls (joystick translates to cardinal directions).
 * Speed increases with score. Multiplier pickups for bonus scoring.
 */
function SnakeScene() {
  const setDirection = useSnakeStore((s) => s.setDirection);
  const input = useSnakeStore((s) => s.input);
  const lastDirRef = useRef({ x: 1, z: 0 });

  // Convert continuous joystick input to cardinal direction changes
  useEffect(() => {
    const dx = input.dx;
    const dy = input.dy;

    // Deadzone
    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) return;

    // Determine dominant axis for D-pad feel
    let dirX = 0;
    let dirZ = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
      dirX = dx > 0 ? 1 : -1;
      dirZ = 0;
    } else {
      dirX = 0;
      dirZ = dy > 0 ? 1 : -1;
    }

    // Only update if direction actually changed
    if (dirX !== lastDirRef.current.x || dirZ !== lastDirRef.current.z) {
      lastDirRef.current = { x: dirX, z: dirZ };
      setDirection(dirX, dirZ);
    }
  }, [input.dx, input.dy, setDirection]);

  return (
    <>
      <World />
      <Player />
    </>
  );
}

export default function FaskaSnakeSwarm({ onExit }) {
  const {
    score,
    lives,
    level,
    isPlaying,
    isPaused,
    isGameOver,
    quizActive,
    quizQuestion,
    quizScore,
    quizStreak,
    scoreMultiplier,
    multiplierTimer,
    snakeLength,
    startSnakeGame,
    pauseGame,
    answerQuiz,
  } = useSnakeStore();

  const { onMove, onAction, onActionUp } = useGameInput(useSnakeStore);

  // Start game on mount
  useEffect(() => {
    startSnakeGame();
  }, [startSnakeGame]);

  const handleRestart = useCallback(() => {
    startSnakeGame();
  }, [startSnakeGame]);

  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const handleQuizAnswer = useCallback(
    (answer) => {
      answerQuiz(answer);
    },
    [answerQuiz]
  );

  return (
    <>
      <SwarmOrchestrator
        gameName="Faska Snake"
        gravity={[0, -9.81, 0]}
        cameraProps={{
          position: [0, 22, 0.1], // Top-down view with tiny Z offset to avoid gimbal lock
          fov: 55,
          near: 0.1,
          far: 100,
        }}
        onReset={handleRestart}
      >
        <SnakeScene />
      </SwarmOrchestrator>

      {/* HUD Overlay */}
      <UIOverlay
        score={score}
        lives={lives}
        level={level}
        isPaused={isPaused}
        isGameOver={isGameOver}
        onPause={handlePause}
        onRestart={handleRestart}
        onExit={onExit}
        gameName="Faska Snake"
        showLearncadeScore
        quizScore={quizScore}
      >
        {/* Extra HUD: Snake length + multiplier */}
        {isPlaying && (
          <div
            style={{
              position: 'absolute',
              bottom: 140,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 12,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: 'rgba(10, 10, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 12,
                padding: '6px 14px',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                fontFamily: 'Outfit, sans-serif',
                color: '#a855f7',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              🐍 Length: {snakeLength}
            </div>
            {scoreMultiplier > 1 && (
              <div
                style={{
                  background: 'rgba(10, 10, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 12,
                  padding: '6px 14px',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  fontFamily: 'Outfit, sans-serif',
                  color: '#f97316',
                  fontSize: 13,
                  fontWeight: 700,
                  animation: 'pulse 0.5s ease infinite alternate',
                }}
              >
                ⚡ {scoreMultiplier}x ({Math.ceil(multiplierTimer)}s)
              </div>
            )}
          </div>
        )}

        {/* Start screen */}
        {!isPlaying && !isGameOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(5, 5, 16, 0.85)',
              backdropFilter: 'blur(10px)',
              pointerEvents: 'auto',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <h1
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 48,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                margin: 0,
              }}
            >
              🐍 Faska Snake
            </h1>
            <p
              style={{
                fontFamily: 'Outfit, sans-serif',
                color: '#94a3b8',
                fontSize: 16,
                maxWidth: 300,
                textAlign: 'center',
                margin: 0,
              }}
            >
              Steuere die Schlange, sammle Essen, werde länger! Vermeide die Wände und dich selbst.
            </p>
            <button onClick={handleRestart} className="btn-primary">
              🎮 Los geht's!
            </button>
          </div>
        )}

        <style>
          {`@keyframes pulse { from { opacity: 1; } to { opacity: 0.6; } }`}
        </style>
      </UIOverlay>

      {/* Touch Controls — joystick only, no action buttons needed */}
      <MobileJoystick
        onMove={onMove}
        onAction={onAction}
        onActionUp={onActionUp}
        buttons={[]}
      />

      {/* Learncade Quiz */}
      <LearncadeQuiz
        active={quizActive}
        question={quizQuestion}
        onAnswer={handleQuizAnswer}
        streak={quizStreak}
        quizScore={quizScore}
      />
    </>
  );
}
