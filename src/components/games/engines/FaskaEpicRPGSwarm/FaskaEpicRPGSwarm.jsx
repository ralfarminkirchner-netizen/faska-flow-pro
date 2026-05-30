import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useRPGStore from './GameLogic';
import Player from './Player';
import World from './World';

/**
 * RPG Camera — isometric-style follow camera.
 */
function RPGCamera() {
  const { camera } = useThree();
  const smoothPos = useRef(new THREE.Vector3(0, 15, 12));
  const smoothTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const scene = camera.parent;
    if (!scene) return;

    // Find player RigidBody position by traversing scene
    let playerPos = null;
    scene.traverse((child) => {
      if (child.isGroup && child.userData?.isPlayer) {
        playerPos = new THREE.Vector3();
        child.getWorldPosition(playerPos);
      }
    });

    // Fallback — just smooth to origin
    const target = playerPos || new THREE.Vector3(0, 0, 0);

    const camOffset = new THREE.Vector3(0, 15, 12);
    const targetCamPos = target.clone().add(camOffset);

    smoothPos.current.lerp(targetCamPos, 0.05);
    smoothTarget.current.lerp(target, 0.08);

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothTarget.current);
  });

  return null;
}

/**
 * Player collision detection — checks proximity to enemies and collectibles.
 */
function PlayerCollisionSystem() {
  const store = useRPGStore;

  useFrame(() => {
    const state = store.getState();
    if (!state.isPlaying || state.isPaused) return;

    // We need the player's body position. Since we can't directly ref the body
    // from here, we'll use a simplified approach. The Player handles attack collisions.
    // Here we handle enemy→player damage and collectible pickup.
  });

  return null;
}

/**
 * RPG HUD — HP/XP bars, inventory, quest log, character switch.
 */
function RPGHUD({ onSwitchCharacter }) {
  const playerHP = useRPGStore((s) => s.playerHP);
  const playerMaxHP = useRPGStore((s) => s.playerMaxHP);
  const xp = useRPGStore((s) => s.xp);
  const xpToNext = useRPGStore((s) => s.xpToNext);
  const playerLevel = useRPGStore((s) => s.playerLevel);
  const currentCharacter = useRPGStore((s) => s.currentCharacter);
  const inventory = useRPGStore((s) => s.inventory);
  const questLog = useRPGStore((s) => s.questLog);
  const totalEnemiesDefeated = useRPGStore((s) => s.totalEnemiesDefeated);
  const showLevelUp = useRPGStore((s) => s.showLevelUp);
  const switchCooldown = useRPGStore((s) => s.switchCooldown);
  const attackCooldown = useRPGStore((s) => s.attackCooldown);

  const hpPercent = (playerHP / playerMaxHP) * 100;
  const xpPercent = (xp / xpToNext) * 100;
  const isLuna = currentCharacter === 'luna';

  return (
    <>
      {/* Character & HP/XP — bottom left */}
      <div style={{
        position: 'fixed', bottom: 140, left: 16, zIndex: 55,
        pointerEvents: 'none', maxWidth: 160,
      }}>
        {/* Character avatar */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.85)', backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 14px',
          border: `1px solid ${isLuna ? 'rgba(168, 85, 247, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
          marginBottom: 8,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
          }}>
            <span style={{ fontSize: 24 }}>{isLuna ? '🐰' : '🐻'}</span>
            <div>
              <div style={{
                fontFamily: 'Outfit, sans-serif', fontSize: 14,
                fontWeight: 700,
                color: isLuna ? '#c084fc' : '#d97706',
              }}>
                {isLuna ? 'Luna' : 'Bruno'}
              </div>
              <div style={{
                fontFamily: 'Outfit, sans-serif', fontSize: 11,
                color: '#94a3b8',
              }}>
                Lv.{playerLevel}
              </div>
            </div>
          </div>

          {/* HP Bar */}
          <div style={{ marginBottom: 6 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Outfit, sans-serif', fontSize: 10,
              color: '#94a3b8', marginBottom: 2,
            }}>
              <span>❤️ HP</span>
              <span>{playerHP}/{playerMaxHP}</span>
            </div>
            <div style={{
              height: 8, background: 'rgba(30, 27, 75, 0.6)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${hpPercent}%`,
                background: hpPercent > 50
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : hpPercent > 25
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(90deg, #ef4444, #f87171)',
                transition: 'width 0.3s ease',
                boxShadow: hpPercent < 25 ? '0 0 8px rgba(239, 68, 68, 0.5)' : 'none',
              }} />
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Outfit, sans-serif', fontSize: 10,
              color: '#94a3b8', marginBottom: 2,
            }}>
              <span>✨ XP</span>
              <span>{xp}/{xpToNext}</span>
            </div>
            <div style={{
              height: 5, background: 'rgba(30, 27, 75, 0.6)',
              borderRadius: 3, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${xpPercent}%`,
                background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div style={{
          background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)',
          borderRadius: 10, padding: '6px 10px',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          display: 'flex', gap: 6,
        }}>
          {inventory.filter(i => i.count > 0).map((item, idx) => (
            <div key={idx} style={{
              fontFamily: 'Outfit, sans-serif', fontSize: 12,
              color: '#e2e8f0',
            }}>
              {item.icon} ×{item.count}
            </div>
          ))}
        </div>
      </div>

      {/* Quest Log — top right (below pause/exit) */}
      <div style={{
        position: 'fixed', top: 56, right: 60, zIndex: 55,
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)',
          borderRadius: 10, padding: '8px 12px',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          fontFamily: 'Outfit, sans-serif', maxWidth: 180,
        }}>
          <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 600, marginBottom: 4 }}>
            📜 Quests
          </div>
          {questLog.map((quest) => (
            <div key={quest.id} style={{
              fontSize: 10, color: quest.done ? '#22c55e' : '#94a3b8',
              marginBottom: 2, display: 'flex', gap: 4,
            }}>
              <span>{quest.done ? '✅' : '⬜'}</span>
              <span>{quest.title} ({quest.progress}/{quest.target})</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
            ⚔️ Besiegt: {totalEnemiesDefeated}
          </div>
        </div>
      </div>

      {/* Character Switch Button — bottom center */}
      <div style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 55, pointerEvents: 'auto',
      }}>
        <button
          onClick={onSwitchCharacter}
          disabled={switchCooldown > 0}
          style={{
            padding: '10px 20px', borderRadius: 12,
            background: switchCooldown > 0
              ? 'rgba(30, 30, 60, 0.5)'
              : `linear-gradient(135deg, ${isLuna ? '#92400e' : '#7c3aed'}, ${isLuna ? '#b45309' : '#a855f7'})`,
            border: 'none', color: 'white',
            fontFamily: 'Outfit, sans-serif', fontSize: 14,
            fontWeight: 600, cursor: switchCooldown > 0 ? 'not-allowed' : 'pointer',
            opacity: switchCooldown > 0 ? 0.5 : 1,
            boxShadow: `0 4px 20px ${isLuna ? 'rgba(146, 64, 14, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
          }}
        >
          {isLuna ? '🐻 Wechsel zu Bruno' : '🐰 Wechsel zu Luna'}
        </button>
      </div>

      {/* Level Up Effect */}
      {showLevelUp && (
        <div style={{
          position: 'fixed', top: '35%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 70, pointerEvents: 'none',
          animation: 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 42,
            fontWeight: 900, color: '#f59e0b',
            textShadow: '0 0 40px rgba(245, 158, 11, 0.6), 0 0 80px rgba(245, 158, 11, 0.3)',
            textAlign: 'center',
          }}>
            ⬆️ Level Up!
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 18,
            color: '#fbbf24', textAlign: 'center',
            textShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
          }}>
            Level {playerLevel}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounceIn {
          from { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

/**
 * Start Screen — with Luna & Bruno prominently featured.
 */
function StartScreen({ onStart }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1a3a1a 0%, #0a150a 100%)',
      flexDirection: 'column', gap: 20,
    }}>
      {/* Character showcase */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'linear-gradient(135deg, #e9d5ff, #c084fc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 50, border: '3px solid #a855f7',
            boxShadow: '0 8px 30px rgba(168, 85, 247, 0.4)',
            margin: '0 auto 8px',
          }}>
            🐰
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 16,
            fontWeight: 700, color: '#c084fc',
          }}>Luna</div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11,
            color: '#94a3b8',
          }}>Schnell & Magie</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'linear-gradient(135deg, #fde68a, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 50, border: '3px solid #b45309',
            boxShadow: '0 8px 30px rgba(217, 119, 6, 0.4)',
            margin: '0 auto 8px',
          }}>
            🐻
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 16,
            fontWeight: 700, color: '#d97706',
          }}>Bruno</div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11,
            color: '#94a3b8',
          }}>Stark & Nahkampf</div>
        </div>
      </div>

      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 42,
        fontWeight: 900, margin: 0,
        background: 'linear-gradient(135deg, #22c55e, #f59e0b, #ef4444)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))',
      }}>
        ⚔️ Epic RPG
      </h1>
      <p style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 15,
        color: '#94a3b8', maxWidth: 380, textAlign: 'center',
      }}>
        Erkunde den Zauberwald mit Luna und Bruno! Besiege Monster, sammle Schätze und werde stärker!
      </p>
      <div style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#64748b',
        display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center',
      }}>
        <span>🕹️ WASD / Joystick — Bewegen</span>
        <span>⚔️ Space / A — Angriff</span>
        <span>🧪 Shift / B — Item benutzen</span>
        <span>🔄 E / X — Charakter wechseln</span>
      </div>
      <button
        onClick={onStart}
        style={{
          padding: '14px 40px', borderRadius: 14,
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          border: 'none', color: 'white',
          fontFamily: 'Outfit, sans-serif', fontSize: 18,
          fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)',
          transition: 'transform 0.2s',
        }}
        onPointerEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
        onPointerLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
      >
        🎮 Abenteuer starten!
      </button>
    </div>
  );
}

/**
 * Inner scene — everything inside the Canvas.
 */
function RPGScene() {
  return (
    <>
      <RPGCamera />
      <Player />
      <World />
    </>
  );
}

/**
 * FaskaEpicRPGSwarm — Main orchestrator component.
 * RPG with Luna the Rabbit and Bruno the Bear.
 */
export default function FaskaEpicRPGSwarm({ onExit }) {
  const store = useRPGStore;
  const { onMove, onAction, onActionUp } = useGameInput(store);

  const isPlaying = useRPGStore((s) => s.isPlaying);
  const isPaused = useRPGStore((s) => s.isPaused);
  const isGameOver = useRPGStore((s) => s.isGameOver);
  const score = useRPGStore((s) => s.score);
  const lives = useRPGStore((s) => s.lives);
  const level = useRPGStore((s) => s.level);
  const quizActive = useRPGStore((s) => s.quizActive);
  const quizQuestion = useRPGStore((s) => s.quizQuestion);
  const quizScore = useRPGStore((s) => s.quizScore);
  const quizStreak = useRPGStore((s) => s.quizStreak);

  const handleStart = useCallback(() => {
    store.getState().startGame();
    store.getState().resetRPGState();
  }, [store]);

  const handleRestart = useCallback(() => {
    store.getState().startGame();
    store.getState().resetRPGState();
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

  const handleSwitchCharacter = useCallback(() => {
    store.getState().switchCharacter();
  }, [store]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D Canvas */}
      <SwarmOrchestrator
        gameName="Epic RPG"
        gravity={[0, -20, 0]}
        cameraProps={{ position: [0, 15, 12], fov: 50, near: 0.1, far: 200 }}
        onReset={handleRestart}
      >
        {isPlaying && <RPGScene />}
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
            gameName="Epic RPG"
            showLearncadeScore
            quizScore={quizScore}
          />
          <RPGHUD onSwitchCharacter={handleSwitchCharacter} />
        </>
      )}

      {/* Touch Controls */}
      {isPlaying && !isPaused && (
        <MobileJoystick
          onMove={onMove}
          onAction={onAction}
          onActionUp={onActionUp}
          buttons={[
            { label: '⚔️', id: 'A', color: '#ef4444' },
            { label: '🧪', id: 'B', color: '#22c55e' },
            { label: '🔄', id: 'X', color: '#a855f7' },
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
