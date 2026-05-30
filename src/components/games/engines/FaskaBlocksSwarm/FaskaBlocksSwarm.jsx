import { useCallback, useEffect, useRef } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useBlocksStore, { SHAPES } from './GameLogic';
import World from './World';
import Player from './Player';

/**
 * FaskaBlocksSwarm — 3D Tetris game with angled camera.
 * Left/Right to move, Up to rotate, Down for soft drop, A for hard drop.
 */
function BlocksScene() {
  return (
    <>
      <World />
      <Player />
    </>
  );
}

/**
 * Next piece preview rendered in the HUD overlay (HTML)
 */
function NextPiecePreview({ nextPiece }) {
  if (!nextPiece) return null;

  const blocks = nextPiece.shape[0]; // rotation 0
  const minRow = Math.min(...blocks.map(([r]) => r));
  const maxRow = Math.max(...blocks.map(([r]) => r));
  const minCol = Math.min(...blocks.map(([, c]) => c));
  const maxCol = Math.max(...blocks.map(([, c]) => c));

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  const cellSize = 16;

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        right: 16,
        background: 'rgba(10, 10, 26, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        padding: 12,
        border: '1px solid rgba(124, 58, 237, 0.3)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'Outfit, sans-serif',
          color: '#94a3b8',
          fontSize: 11,
          fontWeight: 600,
          marginBottom: 8,
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        NÄCHSTES
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: 2,
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: rows * cols }).map((_, idx) => {
          const r = Math.floor(idx / cols) + minRow;
          const c = (idx % cols) + minCol;
          const isFilled = blocks.some(([br, bc]) => br === r && bc === c);
          return (
            <div
              key={idx}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 3,
                background: isFilled
                  ? nextPiece.color
                  : 'rgba(42, 42, 90, 0.2)',
                boxShadow: isFilled
                  ? `0 0 6px ${nextPiece.color}88, inset 0 0 4px rgba(255,255,255,0.2)`
                  : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function FaskaBlocksSwarm({ onExit }) {
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
    nextPiece,
    totalLinesCleared,
    combo,
    startBlocksGame,
    pauseGame,
    answerQuiz,
    rotatePiece,
    hardDrop,
    setSoftDrop,
  } = useBlocksStore();

  const { onMove, onAction, onActionUp } = useGameInput(useBlocksStore);

  // Track rotation input to prevent repeat
  const rotateActiveRef = useRef(false);

  // Start game on mount
  useEffect(() => {
    startBlocksGame();
  }, [startBlocksGame]);

  // Handle keyboard input for rotation and soft drop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (!rotateActiveRef.current) {
          rotateActiveRef.current = true;
          rotatePiece();
        }
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setSoftDrop(true);
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        hardDrop();
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        rotateActiveRef.current = false;
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setSoftDrop(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [rotatePiece, hardDrop, setSoftDrop]);

  const handleRestart = useCallback(() => {
    startBlocksGame();
  }, [startBlocksGame]);

  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const handleQuizAnswer = useCallback(
    (answer) => {
      answerQuiz(answer);
    },
    [answerQuiz]
  );

  // Mobile action button handlers
  const handleAction = useCallback(
    (id) => {
      if (id === 'A') {
        hardDrop();
      }
      if (id === 'B') {
        rotatePiece();
      }
    },
    [hardDrop, rotatePiece]
  );

  // Mobile joystick with soft drop
  const handleMove = useCallback(
    (dx, dy) => {
      onMove(dx, dy);
      // Soft drop when joystick pushed down
      setSoftDrop(dy > 0.5);
      // Rotate when joystick pushed up
      if (dy < -0.7 && !rotateActiveRef.current) {
        rotateActiveRef.current = true;
        rotatePiece();
      } else if (dy >= -0.5) {
        rotateActiveRef.current = false;
      }
    },
    [onMove, setSoftDrop, rotatePiece]
  );

  return (
    <>
      <SwarmOrchestrator
        gameName="Faska Blocks"
        gravity={[0, -9.81, 0]}
        cameraProps={{
          position: [2, 3, 18], // Angled view of the well
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        onReset={handleRestart}
      >
        <BlocksScene />
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
        gameName="Faska Blocks"
        showLearncadeScore
        quizScore={quizScore}
      >
        {/* Next piece preview */}
        {isPlaying && <NextPiecePreview nextPiece={nextPiece} />}

        {/* Extra HUD: Lines + Combo */}
        {isPlaying && (
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: 'rgba(10, 10, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 10,
                padding: '6px 12px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                fontFamily: 'Outfit, sans-serif',
                color: '#06b6d4',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              📏 Lines: {totalLinesCleared}
            </div>
            {combo > 1 && (
              <div
                style={{
                  background: 'rgba(10, 10, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 10,
                  padding: '6px 12px',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  fontFamily: 'Outfit, sans-serif',
                  color: '#f97316',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                🔥 Combo x{combo}
              </div>
            )}
          </div>
        )}

        {/* Controls help */}
        {isPlaying && (
          <div
            style={{
              position: 'absolute',
              bottom: 140,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 8,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: 'rgba(10, 10, 26, 0.7)',
                backdropFilter: 'blur(8px)',
                borderRadius: 8,
                padding: '4px 10px',
                fontFamily: 'Outfit, sans-serif',
                color: '#64748b',
                fontSize: 11,
              }}
            >
              ←→ Move · ↑ Rotate · ↓ Drop · Space Hard Drop
            </div>
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
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}
            >
              🧱 Faska Blocks
            </h1>
            <p
              style={{
                fontFamily: 'Outfit, sans-serif',
                color: '#94a3b8',
                fontSize: 16,
                maxWidth: 320,
                textAlign: 'center',
                margin: 0,
              }}
            >
              Stapele die Blöcke und lösche Reihen auf! Je mehr Reihen, desto mehr Punkte!
            </p>
            <button onClick={handleRestart} className="btn-primary">
              🎮 Los geht's!
            </button>
          </div>
        )}
      </UIOverlay>

      {/* Touch Controls */}
      <MobileJoystick
        onMove={handleMove}
        onAction={handleAction}
        onActionUp={onActionUp}
        buttons={[
          { label: '💥', id: 'A', color: '#ef4444' },
          { label: '🔄', id: 'B', color: '#7c3aed' },
        ]}
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
