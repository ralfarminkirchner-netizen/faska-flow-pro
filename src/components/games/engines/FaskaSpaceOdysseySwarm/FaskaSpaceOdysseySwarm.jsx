import { useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useSpaceStore from './GameLogic';
import Player from './Player';
import World from './World';

/**
 * Chase camera that follows behind the player ship.
 */
function ChaseCamera() {
  const { camera } = useThree();
  const store = useSpaceStore;
  const smoothPos = useRef(new THREE.Vector3(0, 3, 12));
  const smoothTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const state = store.getState();
    if (!state.isPlaying || state.isPaused) return;

    // Find the player rigid body position — search scene for it
    // We approximate by using input to track logical position
    // Since the player body drives itself, we'll track it via scene
    const playerObj = camera.parent?.getObjectByName?.('__player');

    // Try to find the player's RigidBody mesh in the scene
    const scene = camera.parent;
    if (!scene) return;

    // Find player position from scene graph
    let playerPos = null;
    scene.traverse((child) => {
      if (child.isGroup && child.parent?.userData?.isPlayer) {
        playerPos = new THREE.Vector3();
        child.getWorldPosition(playerPos);
      }
    });

    if (!playerPos) {
      // Fallback: try to find any rigidBody-controlled mesh
      // by checking the first RigidBody in the scene
      return;
    }

    const dt = Math.min(delta, 0.05);

    // Camera offset — behind and above the ship
    const offset = new THREE.Vector3(0, 3, 10);
    const quat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, 0, 0) // Would need ship rotation
    );
    offset.applyQuaternion(quat);

    const targetCamPos = playerPos.clone().add(offset);
    smoothPos.current.lerp(targetCamPos, 3 * dt);
    smoothTarget.current.lerp(playerPos, 5 * dt);

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothTarget.current);
  });

  return null;
}

/**
 * Simplified chase camera using direct rigid body reference.
 */
function SimpleChaseCamera({ bodyRef }) {
  const { camera } = useThree();
  const smoothPos = useRef(new THREE.Vector3(0, 5, 15));

  useFrame((_, delta) => {
    if (!bodyRef?.current) return;

    try {
      const pos = bodyRef.current.translation();
      const rot = bodyRef.current.rotation();
      const dt = Math.min(delta, 0.05);

      // Get ship's forward direction
      const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
      const backward = new THREE.Vector3(0, 2, 8).applyQuaternion(quat);

      const targetPos = new THREE.Vector3(
        pos.x + backward.x,
        pos.y + backward.y + 3,
        pos.z + backward.z
      );

      smoothPos.current.lerp(targetPos, 3 * dt);
      camera.position.copy(smoothPos.current);
      camera.lookAt(pos.x, pos.y, pos.z);
    } catch (err) {
      // Silently handle physics errors
    }
  });

  return null;
}

/**
 * Player proximity detection for star collection, planet visits, asteroid damage.
 */
function ProximitySystem() {
  const store = useSpaceStore;

  useFrame(() => {
    const state = store.getState();
    if (!state.isPlaying || state.isPaused) return;

    // We'd need player position — approximate from velocity integration
    // For a complete system, the Player component handles most collision.
  });

  return null;
}

/**
 * Space HUD — fuel gauge, shield indicator, combo display.
 */
function SpaceHUD() {
  const fuel = useSpaceStore((s) => s.fuel);
  const maxFuel = useSpaceStore((s) => s.maxFuel);
  const shieldActive = useSpaceStore((s) => s.shieldActive);
  const shieldCooldown = useSpaceStore((s) => s.shieldCooldown);
  const boostFuel = useSpaceStore((s) => s.boostFuel);
  const comboMultiplier = useSpaceStore((s) => s.comboMultiplier);
  const comboTimer = useSpaceStore((s) => s.comboTimer);
  const asteroidsDestroyed = useSpaceStore((s) => s.asteroidsDestroyed);
  const starsCollected = useSpaceStore((s) => s.starsCollected);
  const planetsVisited = useSpaceStore((s) => s.planetsVisited);
  const warningFlash = useSpaceStore((s) => s.warningFlash);

  const fuelPercent = (fuel / maxFuel) * 100;

  return (
    <>
      {/* Fuel gauge — bottom left */}
      <div style={{
        position: 'fixed', bottom: 140, left: 16, zIndex: 55,
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)',
          borderRadius: 12, padding: '10px 14px',
          border: `1px solid ${fuelPercent < 25 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.2)'}`,
          minWidth: 120,
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11,
            color: '#94a3b8', marginBottom: 4, display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span>⛽ Fuel</span>
            <span>{Math.round(fuelPercent)}%</span>
          </div>
          <div style={{
            height: 6, background: 'rgba(30, 27, 75, 0.6)',
            borderRadius: 3, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${fuelPercent}%`,
              background: fuelPercent > 50 ? '#22c55e' : fuelPercent > 25 ? '#f59e0b' : '#ef4444',
              transition: 'width 0.3s ease',
              boxShadow: fuelPercent < 25 ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none',
            }} />
          </div>
        </div>

        {/* Boost gauge */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)',
          borderRadius: 12, padding: '8px 14px', marginTop: 6,
          border: '1px solid rgba(59, 130, 246, 0.2)', minWidth: 120,
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11,
            color: '#94a3b8', marginBottom: 3,
          }}>
            🚀 Boost
          </div>
          <div style={{ height: 4, background: 'rgba(30, 27, 75, 0.6)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2, width: `${boostFuel}%`,
              background: '#3b82f6', transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Shield & combo — top center */}
      <div style={{
        position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
        zIndex: 55, display: 'flex', gap: 12, pointerEvents: 'none',
      }}>
        {shieldActive && (
          <div style={{
            background: 'rgba(6, 182, 212, 0.2)', backdropFilter: 'blur(10px)',
            borderRadius: 10, padding: '6px 14px',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            fontFamily: 'Outfit, sans-serif', fontSize: 13,
            color: '#22d3ee', fontWeight: 600,
            animation: 'pulse 1s infinite',
          }}>
            🛡️ Shield Active
          </div>
        )}
        {comboTimer > 0 && comboMultiplier > 1 && (
          <div style={{
            background: 'rgba(249, 115, 22, 0.2)', backdropFilter: 'blur(10px)',
            borderRadius: 10, padding: '6px 14px',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            fontFamily: 'Outfit, sans-serif', fontSize: 13,
            color: '#f97316', fontWeight: 700,
          }}>
            🔥 x{comboMultiplier.toFixed(1)}
          </div>
        )}
      </div>

      {/* Stats — bottom right */}
      <div style={{
        position: 'fixed', bottom: 140, right: 16, zIndex: 55,
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)',
          borderRadius: 12, padding: '10px 14px',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          fontFamily: 'Outfit, sans-serif', fontSize: 12,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <span style={{ color: '#fbbf24' }}>⭐ Stars: {starsCollected}</span>
          <span style={{ color: '#3b82f6' }}>🌍 Planets: {planetsVisited}</span>
          <span style={{ color: '#ef4444' }}>☄️ Asteroids: {asteroidsDestroyed}</span>
        </div>
      </div>

      {/* Damage flash */}
      {warningFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(239, 68, 68, 0.3)',
          pointerEvents: 'none',
          animation: 'fadeIn 0.1s ease',
        }} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

/**
 * Start Screen
 */
function StartScreen({ onStart }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0f0a2a 0%, #050510 100%)',
      flexDirection: 'column', gap: 24,
    }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 48,
        fontWeight: 900, margin: 0,
        background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textShadow: 'none',
        filter: 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.5))',
      }}>
        🚀 Space Odyssey
      </h1>
      <p style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 16,
        color: '#94a3b8', maxWidth: 400, textAlign: 'center',
      }}>
        Erkunde den Weltraum! Sammle Sterne, besuche Planeten und zerstöre Asteroiden.
      </p>
      <div style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#64748b',
        display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center',
      }}>
        <span>🕹️ WASD / Joystick — Steuern</span>
        <span>⚡ Space / A — Boost</span>
        <span>🛡️ Shift / B — Schild</span>
        <span>🔫 E / X — Feuer</span>
      </div>
      <button
        onClick={onStart}
        style={{
          padding: '14px 40px', borderRadius: 14,
          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
          border: 'none', color: 'white',
          fontFamily: 'Outfit, sans-serif', fontSize: 18,
          fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
          transition: 'transform 0.2s',
        }}
        onPointerEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
        onPointerLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
      >
        🎮 Start!
      </button>
    </div>
  );
}

/**
 * Inner scene — everything inside the Canvas.
 */
function SpaceScene() {
  const playerRef = useRef();

  return (
    <>
      <Player ref={playerRef} />
      <World playerRef={playerRef} />
    </>
  );
}

/**
 * FaskaSpaceOdysseySwarm — Main orchestrator component.
 * Zero-gravity space exploration game with chase camera.
 */
export default function FaskaSpaceOdysseySwarm({ onExit }) {
  const store = useSpaceStore;
  const { onMove, onAction, onActionUp } = useGameInput(store);

  const isPlaying = useSpaceStore((s) => s.isPlaying);
  const isPaused = useSpaceStore((s) => s.isPaused);
  const isGameOver = useSpaceStore((s) => s.isGameOver);
  const score = useSpaceStore((s) => s.score);
  const lives = useSpaceStore((s) => s.lives);
  const level = useSpaceStore((s) => s.level);
  const quizActive = useSpaceStore((s) => s.quizActive);
  const quizQuestion = useSpaceStore((s) => s.quizQuestion);
  const quizScore = useSpaceStore((s) => s.quizScore);
  const quizStreak = useSpaceStore((s) => s.quizStreak);

  const handleStart = useCallback(() => {
    store.getState().startGame();
    store.getState().resetSpaceState();
  }, [store]);

  const handleRestart = useCallback(() => {
    store.getState().startGame();
    store.getState().resetSpaceState();
  }, [store]);

  const handlePause = useCallback(() => {
    store.getState().pauseGame();
  }, [store]);

  const handleExit = useCallback(() => {
    store.getState().gameOver();
    if (onExit) onExit();
  }, [store, onExit]);

  const handleQuizAnswer = useCallback((answer) => {
    store.getState().answerQuiz(answer);
  }, [store]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D Canvas */}
      <SwarmOrchestrator
        gameName="Space Odyssey"
        gravity={[0, 0, 0]}
        cameraProps={{ position: [0, 5, 15], fov: 70, near: 0.1, far: 500 }}
        onReset={handleRestart}
      >
        {isPlaying && <SpaceScene />}
      </SwarmOrchestrator>

      {/* Start Screen */}
      {!isPlaying && !isGameOver && <StartScreen onStart={handleStart} />}

      {/* HUD */}
      {isPlaying && (
        <>
          <UIOverlay
            score={score}
            lives={lives}
            level={level}
            isPaused={isPaused}
            isGameOver={isGameOver}
            onPause={handlePause}
            onRestart={handleRestart}
            onExit={handleExit}
            gameName="Space Odyssey"
            showLearncadeScore
            quizScore={quizScore}
          />
          <SpaceHUD />
        </>
      )}

      {/* Touch Controls */}
      {isPlaying && !isPaused && (
        <MobileJoystick
          onMove={onMove}
          onAction={onAction}
          onActionUp={onActionUp}
          buttons={[
            { label: '🚀', id: 'A', color: '#3b82f6' },
            { label: '🛡️', id: 'B', color: '#06b6d4' },
            { label: '🔫', id: 'X', color: '#ef4444' },
          ]}
        />
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
