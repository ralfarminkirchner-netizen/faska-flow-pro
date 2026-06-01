import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import InstancedParticles from '../../../../shared/ParticleSystem';
import { useScreenShake } from '../../../../shared/ScreenShake';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import useFaskaSixtyFourStore from './GameLogic';
import Player from './Player';
import World from './World';

// ============================================================
// StartScreen — Animated title with keyboard instructions
// ============================================================
function StartScreen({ onStart }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 50%, #0a1a3e 100%)',
      flexDirection: 'column', gap: 28,
    }}>
      <style>{`
        @keyframes f64float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes f64glow { 0%, 100% { text-shadow: 0 0 20px rgba(139,92,246,0.5); } 50% { text-shadow: 0 0 40px rgba(139,92,246,0.8), 0 0 60px rgba(34,211,238,0.3); } }
        @keyframes f64buttonGlow { 0%, 100% { box-shadow: 0 4px 30px rgba(124,58,237,.34); } 50% { box-shadow: 0 4px 42px rgba(34,211,238,.48); } }
        @keyframes f64spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
      `}</style>

      {/* Floating decorations */}
      <div style={{ position: 'absolute', top: '12%', left: '18%', fontSize: 42, animation: 'f64float 3s ease-in-out infinite, f64spin 2s linear infinite' }}>🪙</div>
      <div style={{ position: 'absolute', top: '22%', right: '14%', fontSize: 34, animation: 'f64float 2.6s ease-in-out infinite 0.4s, f64spin 1.8s linear infinite' }}>🪙</div>
      <div style={{ position: 'absolute', bottom: '22%', left: '14%', fontSize: 38, animation: 'f64float 2.8s ease-in-out infinite 0.8s, f64spin 2.2s linear infinite' }}>⭐</div>
      <div style={{ position: 'absolute', bottom: '28%', right: '18%', fontSize: 30, animation: 'f64float 3.2s ease-in-out infinite 0.2s' }}>💎</div>

      {/* Logo */}
      <div style={{ animation: 'f64float 4s ease-in-out infinite', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(38px, 8vw, 76px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #8b5cf6, #22d3ee, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'f64glow 3s ease-in-out infinite',
          margin: 0, lineHeight: 1.1,
        }}>
          FASKA 64 PRO
        </h1>
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(14px, 3vw, 20px)',
          color: '#94a3b8',
          fontWeight: 500,
          marginTop: 8,
          letterSpacing: 4,
        }}>
          3D PLATFORMER • NORMAL + LEARNCADE
        </p>
      </div>

      {/* Character preview */}
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(34,211,238,0.2)',
        animation: 'f64float 3s ease-in-out infinite 0.5s',
      }}>
        <span style={{ fontSize: 48 }}>🏃</span>
      </div>

      {/* Keyboard instructions */}
      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
        maxWidth: 520,
      }}>
        {[
          { key: 'W A S D', desc: 'Move' },
          { key: 'SPACE', desc: 'Jump / Double Jump' },
          { key: 'SHIFT', desc: 'Ground Pound' },
          { key: 'E', desc: 'Dash-Spin' },
          { key: 'ESC', desc: 'Pause' },
        ].map(({ key, desc }) => (
          <div key={key} style={{
            background: 'rgba(42, 42, 90, 0.5)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            borderRadius: 10, padding: '10px 16px',
            fontFamily: 'Outfit, sans-serif',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{
              background: 'rgba(139, 92, 246, 0.3)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: 6, padding: '3px 8px',
              fontSize: 12, fontWeight: 900,
              color: '#c4b5fd',
              fontFamily: 'monospace',
            }}>{key}</span>
            <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600 }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* Start buttons */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Normal starten', mode: 'arcade', gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)' },
          { label: 'Learncade starten', mode: 'learn', gradient: 'linear-gradient(135deg, #06b6d4, #22c55e)' },
        ].map((button) => (
          <button
            key={button.mode}
            onClick={() => onStart(button.mode)}
            style={{
              padding: '16px 34px', borderRadius: 16,
              background: button.gradient,
              border: '2px solid rgba(139, 92, 246, 0.4)',
              color: '#fff', fontFamily: 'Outfit, sans-serif',
              fontSize: 20, fontWeight: 800,
              cursor: 'pointer', letterSpacing: 1,
              boxShadow: '0 4px 30px rgba(124, 58, 237, 0.4)',
              animation: 'f64buttonGlow 2s ease-in-out infinite',
              transition: 'transform 0.2s',
            }}
            onPointerEnter={(e) => { e.target.style.transform = 'scale(1.06)'; }}
            onPointerLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CoinCounter — HUD coin/combo display
// ============================================================
function CoinCounter() {
  const mode = useFaskaSixtyFourStore(s => s.mode);
  const coinsCollected = useFaskaSixtyFourStore(s => s.coinsCollected);
  const totalCoins = useFaskaSixtyFourStore(s => s.totalCoins);
  const comboMultiplier = useFaskaSixtyFourStore(s => s.comboMultiplier);
  const comboTimer = useFaskaSixtyFourStore(s => s.comboTimer);
  const redCoins = useFaskaSixtyFourStore(s => s.redCoins);
  const stuntRings = useFaskaSixtyFourStore(s => s.stuntRings);
  const enemies = useFaskaSixtyFourStore(s => s.enemies);
  const missions = useFaskaSixtyFourStore(s => s.missions);
  const missionNotice = useFaskaSixtyFourStore(s => s.missionNotice);
  const missionNoticeTimer = useFaskaSixtyFourStore(s => s.missionNoticeTimer);
  const dashCooldown = useFaskaSixtyFourStore(s => s.dashCooldown);

  const isCombo = comboMultiplier > 1 && comboTimer > 0 && missionNoticeTimer > 0;
  const redCount = redCoins.filter(coin => coin.collected).length;
  const ringCount = stuntRings.filter(ring => ring.passed).length;
  const enemyCount = enemies.filter(enemy => enemy.defeated).length;

  return (
    <div style={{ position: 'absolute', top: 62, left: 16, pointerEvents: 'none', width: 292 }}>
      <div style={{
        background: 'rgba(10, 10, 26, 0.82)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12, padding: '8px 16px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        fontFamily: 'Outfit, sans-serif',
        display: 'grid', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#fbbf24', fontSize: 17, fontWeight: 800 }}>
            🪙 {coinsCollected} / {totalCoins}
          </span>
          <span style={{
            color: mode === 'learn' ? '#67e8f9' : '#c4b5fd',
            fontSize: 11,
            fontWeight: 900,
            textTransform: 'uppercase',
          }}>
            {mode === 'learn' ? 'Learncade' : 'Normal'}
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 6,
          color: '#e2e8f0',
          fontSize: 12,
          fontWeight: 900,
        }}>
          <span>🔴 {redCount}/8</span>
          <span>🌀 {ringCount}/4</span>
          <span>👾 {enemyCount}/4</span>
        </div>
        <div style={{
          height: 6,
          borderRadius: 999,
          background: 'rgba(30, 41, 59, 0.9)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${Math.max(0, Math.min(1, 1 - dashCooldown / 1.1)) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
          }} />
        </div>
      </div>
      <div style={{
        marginTop: 8,
        padding: '10px 12px',
        borderRadius: 12,
        background: 'rgba(10, 10, 26, 0.78)',
        border: '1px solid rgba(148, 163, 184, 0.22)',
        fontFamily: 'Outfit, sans-serif',
        display: 'grid',
        gap: 7,
      }}>
        {missions.slice(0, 4).map((mission) => {
          const progress = Math.min(1, mission.progress / mission.target);
          return (
            <div key={mission.id} style={{ opacity: mission.done ? 0.62 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 10, fontWeight: 900 }}>
                <span style={{ color: mission.done ? '#86efac' : '#e2e8f0' }}>{mission.label}</span>
                <span style={{ color: '#94a3b8' }}>{mission.progress}/{mission.target}</span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: 'rgba(30, 41, 59, 0.86)', overflow: 'hidden', marginTop: 3 }}>
                <div style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  background: mission.done ? 'linear-gradient(90deg, #22c55e, #86efac)' : 'linear-gradient(90deg, #38bdf8, #facc15)',
                }} />
              </div>
            </div>
          );
        })}
      </div>
      {isCombo && (
        <div style={{
          background: 'rgba(251, 191, 36, 0.2)',
          backdropFilter: 'blur(8px)',
          borderRadius: 10, padding: '5px 14px',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          fontFamily: 'Outfit, sans-serif',
          color: '#fbbf24', fontSize: 15, fontWeight: 800,
          marginTop: 6, textAlign: 'center',
          animation: 'f64pulse 0.5s ease-in-out infinite',
        }}>
          🔥 x{comboMultiplier} COMBO!
        </div>
      )}
      {missionNoticeTimer > 0 && missionNotice && (
        <div style={{
          marginTop: 8,
          borderRadius: 999,
          padding: '8px 14px',
          background: 'rgba(14, 165, 233, 0.22)',
          border: '1px solid rgba(103, 232, 249, 0.44)',
          color: '#e0f2fe',
          fontFamily: 'Outfit, sans-serif',
          fontSize: 13,
          fontWeight: 900,
          textAlign: 'center',
          boxShadow: '0 0 24px rgba(34, 211, 238, 0.18)',
        }}>
          {missionNotice}
        </div>
      )}
      <style>{`@keyframes f64pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }`}</style>
    </div>
  );
}

// ============================================================
// GameContent — 3D scene rendered inside SwarmOrchestrator Canvas
// ============================================================
function GameContent({ particleRef, shake, ShakeUpdater, damageFlash }) {
  return (
    <>
      <Player particleRef={particleRef} shake={shake} />
      <World particleRef={particleRef} shake={shake} />
      <InstancedParticles particleRef={particleRef} count={80} color="#ffaa00" size={0.12} />
      <ShakeUpdater />
      <PostProcessingStack preset="adventure" damageFlash={damageFlash} bloomIntensity={0.55} />
    </>
  );
}

// ============================================================
// FaskaSixtyFourSwarm — Main orchestrator (PC exclusive)
// ============================================================
export default function FaskaSixtyFourSwarm() {
  const navigate = useNavigate();
  const store = useFaskaSixtyFourStore;
  const particleRef = useRef();
  const { shake, ShakeUpdater } = useScreenShake();
  const { onMove, onAction, onActionUp } = useGameInput(store);
  const onLook = useCallback((dx, dy) => {
    useFaskaSixtyFourStore.getState().adjustCameraLook(dx, dy);
  }, []);

  // State selectors
  const isPlaying = useFaskaSixtyFourStore(s => s.isPlaying);
  const isGameOver = useFaskaSixtyFourStore(s => s.isGameOver);
  const isPaused = useFaskaSixtyFourStore(s => s.isPaused);
  const score = useFaskaSixtyFourStore(s => s.score);
  const lives = useFaskaSixtyFourStore(s => s.lives);
  const level = useFaskaSixtyFourStore(s => s.level);
  const quizActive = useFaskaSixtyFourStore(s => s.quizActive);
  const quizQuestion = useFaskaSixtyFourStore(s => s.quizQuestion);
  const quizScore = useFaskaSixtyFourStore(s => s.quizScore);
  const quizStreak = useFaskaSixtyFourStore(s => s.quizStreak);
  const damageFlash = useFaskaSixtyFourStore(s => s.damageFlash);
  const startGame = useFaskaSixtyFourStore(s => s.startGame);
  const pauseGame = useFaskaSixtyFourStore(s => s.pauseGame);
  const answerQuiz = useFaskaSixtyFourStore(s => s.answerQuiz);

  const handleExit = useCallback(() => navigate('/'), [navigate]);
  const handleStart = useCallback((mode = 'arcade') => startGame(mode), [startGame]);
  const handleRestart = useCallback(() => startGame(useFaskaSixtyFourStore.getState().mode), [startGame]);

  const handleQuizAnswer = useCallback((answer) => {
    answerQuiz(answer);
  }, [answerQuiz]);

  // Quiz bonus: extra life
  const handleQuizBonus = useCallback(() => {
    const s = useFaskaSixtyFourStore.getState();
    useFaskaSixtyFourStore.setState({ lives: s.lives + 1 });
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* Start Screen */}
      {!isPlaying && !isGameOver && (
        <StartScreen onStart={handleStart} />
      )}

      {/* 3D Canvas */}
      <SwarmOrchestrator
        gameName="Faska 64 Pro"
        gravity={[0, -20, 0]}
        cameraProps={{ position: [0, 8, 15], fov: 65 }}
      >
        {isPlaying && (
          <GameContent
            particleRef={particleRef}
            shake={shake}
            ShakeUpdater={ShakeUpdater}
            damageFlash={damageFlash}
          />
        )}
      </SwarmOrchestrator>

      {/* HUD Overlay */}
      {isPlaying && (
        <UIOverlay
          score={score}
          lives={lives}
          level={level}
          isPaused={isPaused}
          isGameOver={isGameOver}
          onPause={pauseGame}
          onRestart={handleRestart}
          onExit={handleExit}
          gameName="Faska 64 Pro"
          showLearncadeScore
          quizScore={quizScore}
        >
          <CoinCounter />
        </UIOverlay>
      )}

      {/* Learncade Quiz — compact mode, bonus = extra life */}
      <LearncadeQuiz
        active={quizActive}
        question={quizQuestion}
        onAnswer={handleQuizAnswer}
        onBonus={handleQuizBonus}
        streak={quizStreak}
        quizScore={quizScore}
        bonusLabel="❤️ Extra Leben"
        compact
      />

      {isPlaying && (
        <MobileJoystick
          onMove={onMove}
          onLook={onLook}
          onAction={onAction}
          onActionUp={onActionUp}
          buttons={[
            { label: 'JUMP', id: 'A', color: '#10b981', ariaLabel: 'Springen' },
            { label: 'POUND', id: 'B', color: '#f97316', ariaLabel: 'Ground Pound' },
            { label: 'DASH', id: 'X', color: '#06b6d4', ariaLabel: 'Dash Spin' },
          ]}
        />
      )}
    </div>
  );
}
