import { useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useZeldaStore from './GameLogic';
import Player from './Player';
import World from './World';

/**
 * FaskaZeldaSwarm — Top-down Adventure Game
 * Features:
 * - Zelda-style exploration
 * - Sword combat with slimes and bats
 * - Room transitions
 * - Rupee collection
 * - Learncade quiz integration
 */

// Hearts display (Zelda-style)
function HeartsDisplay() {
  const health = useZeldaStore((s) => s.health);
  const maxHealth = useZeldaStore((s) => s.maxHealth);

  const hearts = [];
  for (let i = 0; i < maxHealth / 2; i++) {
    const remaining = health - i * 2;
    let emoji = '🖤'; // empty
    if (remaining >= 2) emoji = '❤️'; // full
    else if (remaining === 1) emoji = '💔'; // half
    hearts.push(emoji);
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        left: 16,
        display: 'flex',
        gap: 4,
        fontSize: 22,
        zIndex: 55,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
      }}
    >
      {hearts.map((h, i) => (
        <span key={i}>{h}</span>
      ))}
    </div>
  );
}

// Zelda-specific HUD
function ZeldaHUD() {
  const rupees = useZeldaStore((s) => s.rupees);
  const currentRoom = useZeldaStore((s) => s.currentRoom);
  const totalRooms = useZeldaStore((s) => s.totalRooms);
  const enemies = useZeldaStore((s) => s.enemies);
  const aliveCount = enemies.filter((e) => e.alive).length;
  const swordSwinging = useZeldaStore((s) => s.swordSwinging);
  const transitioning = useZeldaStore((s) => s.transitioning);

  return (
    <>
      <HeartsDisplay />

      {/* Bottom HUD */}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          pointerEvents: 'none',
          zIndex: 55,
        }}
      >
        {/* Rupees */}
        <div
          style={{
            background: 'rgba(10, 40, 10, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: '8px 16px',
            border: '1px solid rgba(34, 221, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }}>💎</span>
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 22,
              fontWeight: 800,
              color: '#22dd44',
              textShadow: '0 0 10px rgba(34, 221, 68, 0.5)',
            }}
          >
            {rupees}
          </span>
        </div>

        {/* Room indicator */}
        <div
          style={{
            background: 'rgba(10, 10, 40, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: '8px 16px',
            border: '1px solid rgba(100, 100, 255, 0.3)',
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
            🗺️ Room
          </div>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              color: '#aabbff',
            }}
          >
            {currentRoom + 1}/{totalRooms}
          </div>
        </div>

        {/* Enemies count */}
        {aliveCount > 0 && (
          <div
            style={{
              background: 'rgba(40, 10, 10, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              padding: '8px 16px',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>👾</span>
            <span
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: '#ff4444',
              }}
            >
              {aliveCount}
            </span>
          </div>
        )}
      </div>

      {/* Sword indicator */}
      {swordSwinging && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 55,
          }}
        >
          <div
            style={{
              fontSize: 40,
              animation: 'swordSlash 0.3s ease-out',
              filter: 'drop-shadow(0 0 10px rgba(170, 221, 255, 0.5))',
            }}
          >
            ⚔️
          </div>
        </div>
      )}

      {/* Room transition overlay */}
      {transitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 90,
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 24,
              color: '#ffdd44',
              fontWeight: 700,
            }}
          >
            🚪 Next Room...
          </span>
        </div>
      )}

      <style>{`
        @keyframes swordSlash {
          0% { transform: rotate(-45deg) scale(0.5); opacity: 0; }
          50% { transform: rotate(15deg) scale(1.2); opacity: 1; }
          100% { transform: rotate(0deg) scale(1); opacity: 0.5; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
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
        background: 'radial-gradient(ellipse at center, #1a3a1e 0%, #0a1a0e 70%)',
        zIndex: 100,
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <h1
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 48,
          fontWeight: 900,
          color: '#22dd44',
          textShadow: '0 0 40px rgba(34, 221, 68, 0.6), 0 0 80px rgba(34, 221, 68, 0.3)',
          letterSpacing: 3,
          margin: 0,
        }}
      >
        ⚔️ FASKA ZELDA
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
        🎮 D-Pad / WASD to move • Space/A to swing sword
        <br />
        🗡️ Defeat slimes • 💎 Collect rupees • 🚪 Explore rooms
      </p>
      <button
        onClick={onStart}
        className="btn-primary"
        style={{
          padding: '16px 48px',
          fontSize: 20,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1a8a2a, #22dd44)',
          border: '2px solid #44ff6644',
          borderRadius: 16,
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
          boxShadow: '0 0 30px rgba(34, 221, 68, 0.4)',
        }}
      >
        🗡️ BEGIN ADVENTURE
      </button>
    </div>
  );
}

export default function FaskaZeldaSwarm() {
  const score = useZeldaStore((s) => s.score);
  const lives = useZeldaStore((s) => s.lives);
  const level = useZeldaStore((s) => s.level);
  const isPlaying = useZeldaStore((s) => s.isPlaying);
  const isPaused = useZeldaStore((s) => s.isPaused);
  const isGameOver = useZeldaStore((s) => s.isGameOver);
  const quizActive = useZeldaStore((s) => s.quizActive);
  const quizQuestion = useZeldaStore((s) => s.quizQuestion);
  const quizScore = useZeldaStore((s) => s.quizScore);
  const quizStreak = useZeldaStore((s) => s.quizStreak);

  const startGame = useZeldaStore((s) => s.startGame);
  const pauseGame = useZeldaStore((s) => s.pauseGame);
  const answerQuiz = useZeldaStore((s) => s.answerQuiz);

  // Input hook
  const { onMove, onAction, onActionUp } = useGameInput(useZeldaStore);

  const handleStart = useCallback(() => {
    try {
      startGame();
    } catch (e) {
      console.error('[FaskaZeldaSwarm] start error:', e);
    }
  }, [startGame]);

  const handleRestart = useCallback(() => {
    try {
      startGame();
    } catch (e) {
      console.error('[FaskaZeldaSwarm] restart error:', e);
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
        console.warn('[FaskaZeldaSwarm] quiz error:', e);
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
        gameName="FASKA ZELDA"
        gravity={[0, -20, 0]}
        cameraProps={{
          position: [0, 15, 8],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        onReset={handleRestart}
        canvasProps={{
          camera: {
            position: [0, 15, 8],
            fov: 50,
            near: 0.1,
            far: 100,
          },
        }}
      >
        {/* Top-down camera setup */}
        <TopDownCamera />
        <World />
        <Player />
      </SwarmOrchestrator>

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
        gameName="FASKA ZELDA"
        showLearncadeScore
        quizScore={quizScore}
      />

      {/* Zelda-specific HUD */}
      {isPlaying && <ZeldaHUD />}

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
          { label: '⚔️', id: 'A', color: '#22dd44' },
          { label: '🛡️', id: 'B', color: '#4488ff' },
        ]}
      />
    </div>
  );
}

// Top-down camera that follows the player
function TopDownCamera() {
  const playerPosition = useZeldaStore((s) => s.playerPosition);

  useFrame(({ camera }) => {
    try {
      // Smooth follow with offset
      const targetX = playerPosition[0];
      const targetZ = playerPosition[2] + 8;

      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.position.y = 15;

      // Look at player area
      camera.lookAt(playerPosition[0], 0, playerPosition[2]);
    } catch (e) {
      // Silent
    }
  });

  return null;
}
