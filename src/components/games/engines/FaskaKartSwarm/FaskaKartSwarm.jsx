import { useEffect, useCallback, useRef, createContext } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import { useScreenShake } from '../../../../shared/ScreenShake';
import InstancedParticles from '../../../../shared/ParticleSystem';
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
 *   Y button (Q) = use item
 */

// Context to share shake + particle refs with child components inside Canvas
const KartFXContext = createContext(null);

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

function ModeSwitch() {
  const mode = useKartStore(s => s.mode);
  const setMode = useKartStore(s => s.setMode);

  return (
    <div style={{
      position: 'absolute',
      top: 12,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 62,
      display: 'flex',
      gap: 6,
      padding: 5,
      borderRadius: 14,
      background: 'rgba(10, 10, 26, 0.78)',
      border: '1px solid rgba(148, 163, 184, 0.22)',
      backdropFilter: 'blur(12px)',
      pointerEvents: 'auto',
      fontFamily: 'Outfit, sans-serif',
    }}>
      {[
        { id: 'arcade', label: 'Normal' },
        { id: 'learn', label: 'Learncade' },
      ].map(option => {
        const active = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setMode(option.id)}
            style={{
              border: 0,
              borderRadius: 10,
              padding: '9px 15px',
              cursor: 'pointer',
              color: active ? '#111827' : '#dbeafe',
              background: active ? '#f8fafc' : 'rgba(15, 23, 42, 0.72)',
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 0,
              boxShadow: active ? '0 0 22px rgba(56, 189, 248, 0.34)' : 'none',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// Race HUD (extra elements inside UIOverlay)
function RaceHUD() {
  const mode = useKartStore(s => s.mode);
  const lap = useKartStore(s => s.lap);
  const totalLaps = useKartStore(s => s.totalLaps);
  const position = useKartStore(s => s.position);
  const raceTime = useKartStore(s => s.raceTime);
  const boostCount = useKartStore(s => s.boostCount);
  const boostActive = useKartStore(s => s.boostActive);
  const playerSpeed = useKartStore(s => s.playerSpeed);
  const driftActive = useKartStore(s => s.driftActive);
  const driftCharge = useKartStore(s => s.driftCharge);
  const grip = useKartStore(s => s.grip);
  const offroad = useKartStore(s => s.offroad);
  const miniTurboText = useKartStore(s => s.miniTurboText);
  const miniTurboTimer = useKartStore(s => s.miniTurboTimer);
  const racecraft = useKartStore(s => s.racecraft);
  const sector = useKartStore(s => s.sector);
  const sectorTimer = useKartStore(s => s.sectorTimer);
  const lastSectorTime = useKartStore(s => s.lastSectorTime);
  const cleanSectorStreak = useKartStore(s => s.cleanSectorStreak);
  const apexCombo = useKartStore(s => s.apexCombo);
  const turboGrade = useKartStore(s => s.turboGrade);
  const goals = useKartStore(s => s.goals);
  const completedGoalNotice = useKartStore(s => s.completedGoalNotice);
  const completedGoalTimer = useKartStore(s => s.completedGoalTimer);
  const activeContract = useKartStore(s => s.activeContract);
  const contractTimer = useKartStore(s => s.contractTimer);
  const contractCooldown = useKartStore(s => s.contractCooldown);
  const contractWins = useKartStore(s => s.contractWins);
  const contractFails = useKartStore(s => s.contractFails);
  const learnGateStreak = useKartStore(s => s.learnGateStreak);
  const lastLapTime = useKartStore(s => s.lastLapTime);
  const bestLapTime = useKartStore(s => s.bestLapTime);
  const slipstreamCharge = useKartStore(s => s.slipstreamCharge);
  const slipstreamTimer = useKartStore(s => s.slipstreamTimer);
  const turboChain = useKartStore(s => s.turboChain);
  const turboChainTimer = useKartStore(s => s.turboChainTimer);
  const turboChainPeak = useKartStore(s => s.turboChainPeak);
  const turboChainSource = useKartStore(s => s.turboChainSource);
  const turboChainPulseTimer = useKartStore(s => s.turboChainPulseTimer);
  const stats = useKartStore(s => s.stats);
  const finished = useKartStore(s => s.finished);
  const itemSlot = useKartStore(s => s.itemSlot);
  const itemFlashTimer = useKartStore(s => s.itemFlashTimer);
  const shieldTimer = useKartStore(s => s.shieldTimer);
  const slipTimer = useKartStore(s => s.slipTimer);
  const coins = useKartStore(s => s.coins);
  const raceMessage = useKartStore(s => s.raceMessage);
  const raceMessageTimer = useKartStore(s => s.raceMessageTimer);
  const learnGateTask = useKartStore(s => s.getCurrentLearnGate());

  const formatTime = () => {
    const mins = Math.floor(raceTime / 60);
    const secs = Math.floor(raceTime % 60);
    const ms = Math.floor((raceTime * 100) % 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const posText = ['', '1st', '2nd', '3rd', '4th'][position] || `${position}th`;
  const racecraftGrade = racecraft >= 220 ? 'S' : racecraft >= 150 ? 'A' : racecraft >= 80 ? 'B' : 'C';
  const formatDuration = (time) => (time > 0 ? `${time.toFixed(2)}s` : '--');
  const contractProgress = activeContract
    ? Math.min(activeContract.target, Math.max(0, (stats?.[activeContract.type] ?? 0) - activeContract.startValue))
    : 0;
  const contractRatio = activeContract ? Math.min(1, contractProgress / activeContract.target) : 0;
  const itemLabel = {
    boost: 'Turbo',
    shield: 'Schild',
    rocket: 'Rakete',
    oil: 'Oel',
  }[itemSlot] || 'Leer';

  return (
    <>
      {mode === 'learn' && !finished && (
        <div style={{
          position: 'absolute',
          top: 66,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(720px, calc(100vw - 32px))',
          padding: '12px 18px',
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.78)',
          border: '1px solid rgba(34, 211, 238, 0.28)',
          color: '#e0f2fe',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
          pointerEvents: 'none',
          boxShadow: '0 18px 40px rgba(2, 6, 23, 0.35)',
        }}>
          <div style={{ fontSize: 12, color: '#67e8f9', fontWeight: 900, textTransform: 'uppercase' }}>
            Wortarten-Gate
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, marginTop: 3 }}>
            {learnGateTask.prompt}
          </div>
        </div>
      )}

      {raceMessageTimer > 0 && raceMessage && (
        <div style={{
          position: 'absolute',
          top: mode === 'learn' ? 142 : 66,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '9px 18px',
          borderRadius: 999,
          background: 'rgba(2, 6, 23, 0.72)',
          border: '1px solid rgba(251, 191, 36, 0.38)',
          color: '#fef3c7',
          fontFamily: 'Outfit, sans-serif',
          fontSize: 14,
          fontWeight: 900,
          pointerEvents: 'none',
          textShadow: '0 0 16px rgba(251, 191, 36, 0.55)',
        }}>
          {raceMessage}
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: mode === 'learn' ? 176 : 66,
        left: 16,
        width: 'min(286px, calc(100vw - 32px))',
        padding: '14px 15px',
        borderRadius: 16,
        background: 'rgba(2, 6, 23, 0.78)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        boxShadow: '0 18px 38px rgba(0, 0, 0, 0.26)',
        backdropFilter: 'blur(12px)',
        color: '#e2e8f0',
        fontFamily: 'Outfit, sans-serif',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>
              Racecraft
            </div>
            <div style={{ marginTop: 3, fontSize: 27, lineHeight: 1, fontWeight: 950, color: '#facc15' }}>
              {racecraft} <span style={{ fontSize: 17, color: '#f8fafc' }}>{racecraftGrade}</span>
            </div>
          </div>
          <div style={{
            minWidth: 82,
            padding: '8px 10px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.72)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            textAlign: 'right',
          }}>
            <div style={{ fontSize: 10, color: '#67e8f9', fontWeight: 900 }}>S{sector}</div>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{sectorTimer.toFixed(1)}s</div>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
          marginTop: 12,
        }}>
          {[
            ['APEX', apexCombo],
            ['CLEAN', cleanSectorStreak],
            ['WIND', slipstreamTimer > 0 ? `${Math.round(slipstreamCharge * 100)}%` : (stats?.slipstreams ?? 0)],
            ['CUT', stats?.shortcuts ?? 0],
            ['CHAIN', turboChain > 0 ? `x${turboChain}` : turboChainPeak],
          ].map(([label, value]) => (
            <div key={label} style={{
              borderRadius: 11,
              padding: '7px 6px',
              background: label === 'CHAIN' && turboChain > 1 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(15, 23, 42, 0.62)',
              border: label === 'CHAIN' && turboChain > 1 ? '1px solid rgba(251, 191, 36, 0.48)' : '1px solid rgba(148, 163, 184, 0.14)',
              textAlign: 'center',
              transform: label === 'CHAIN' && turboChainPulseTimer > 0 ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.14s ease, background 0.14s ease, border 0.14s ease',
            }}>
              <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 900 }}>{label}</div>
              <div style={{ fontSize: 15, color: '#f8fafc', fontWeight: 900 }}>{value}</div>
            </div>
          ))}
        </div>
        {turboChain > 0 && (
          <div style={{
            marginTop: 10,
            padding: '8px 10px',
            borderRadius: 12,
            background: 'rgba(120, 53, 15, 0.35)',
            border: '1px solid rgba(251, 191, 36, 0.24)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              fontSize: 10,
              color: '#fef3c7',
              fontWeight: 900,
              textTransform: 'uppercase',
            }}>
              <span>Turbo-Kette x{turboChain}</span>
              <span>{turboChainSource || 'Turbo'}</span>
            </div>
            <div style={{
              height: 6,
              marginTop: 6,
              borderRadius: 999,
              background: 'rgba(15, 23, 42, 0.86)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${Math.min(1, turboChainTimer / 3.6) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f97316, #facc15, #22d3ee)',
              }} />
            </div>
          </div>
        )}
        <div style={{
          marginTop: 10,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 10,
          fontSize: 10,
          color: '#cbd5e1',
          fontWeight: 800,
        }}>
          <span>Sektor {formatDuration(lastSectorTime)}</span>
          <span>Runde {formatDuration(lastLapTime)}</span>
          <span>Best {formatDuration(bestLapTime)}</span>
        </div>
        <div style={{ marginTop: 12, display: 'grid', gap: 7 }}>
          {goals.slice(0, 6).map(goal => {
            const progress = Math.min(1, goal.progress / goal.target);
            return (
              <div key={goal.id} style={{ opacity: goal.done ? 0.62 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 10, fontWeight: 900 }}>
                  <span style={{ color: goal.done ? '#86efac' : '#e2e8f0' }}>{goal.label}</span>
                  <span style={{ color: '#94a3b8' }}>{goal.progress}/{goal.target}</span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: 'rgba(30, 41, 59, 0.86)', overflow: 'hidden', marginTop: 4 }}>
                  <div style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    background: goal.done
                      ? 'linear-gradient(90deg, #22c55e, #86efac)'
                      : 'linear-gradient(90deg, #38bdf8, #facc15)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {completedGoalTimer > 0 && completedGoalNotice && (
        <div style={{
          position: 'absolute',
          top: mode === 'learn' ? 176 : 70,
          right: 16,
          padding: '12px 16px',
          borderRadius: 14,
          background: 'rgba(20, 83, 45, 0.82)',
          border: '1px solid rgba(134, 239, 172, 0.5)',
          color: '#dcfce7',
          fontFamily: 'Outfit, sans-serif',
          fontSize: 14,
          fontWeight: 900,
          pointerEvents: 'none',
          boxShadow: '0 14px 36px rgba(20, 83, 45, 0.36)',
        }}>
          {completedGoalNotice}
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: mode === 'learn' ? 236 : 158,
        right: 16,
        width: 304,
        padding: '13px 15px',
        borderRadius: 16,
        background: 'rgba(2, 6, 23, 0.78)',
        border: '1px solid rgba(216, 180, 254, 0.28)',
        color: '#e2e8f0',
        fontFamily: 'Outfit, sans-serif',
        pointerEvents: 'none',
        boxShadow: '0 18px 38px rgba(0, 0, 0, 0.26)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ fontSize: 11, color: '#c084fc', fontWeight: 900, textTransform: 'uppercase' }}>
          Rennauftrag · {contractWins} OK · {contractFails} Fail
        </div>
        {activeContract ? (
          <>
            <div style={{ marginTop: 7, fontSize: 14, color: '#f8fafc', fontWeight: 900 }}>
              {activeContract.label}
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(30, 41, 59, 0.86)', overflow: 'hidden', marginTop: 9 }}>
              <div style={{
                width: `${contractRatio * 100}%`,
                height: '100%',
                background: contractRatio >= 1
                  ? 'linear-gradient(90deg, #22c55e, #86efac)'
                  : 'linear-gradient(90deg, #a855f7, #facc15)',
              }} />
            </div>
            <div style={{ marginTop: 7, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', fontWeight: 900 }}>
              <span>{contractProgress}/{activeContract.target}</span>
              <span>{Math.ceil(contractTimer)}s</span>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 7, fontSize: 12, color: '#94a3b8', fontWeight: 900 }}>
            Naechster Auftrag in {Math.ceil(contractCooldown)}s
          </div>
        )}
      </div>

      {/* Bottom HUD bar */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        justifyContent: 'center',
        width: 'min(1060px, calc(100vw - 28px))',
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

        {/* Drift / grip */}
        <div style={{
          background: driftActive ? 'rgba(245, 158, 11, 0.2)' : offroad ? 'rgba(132, 204, 22, 0.16)' : 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 18px',
          border: `1px solid ${driftActive ? 'rgba(245, 158, 11, 0.55)' : offroad ? 'rgba(132, 204, 22, 0.45)' : 'rgba(6, 182, 212, 0.25)'}`,
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
          minWidth: 126,
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
            {driftActive ? 'DRIFT' : offroad ? 'GRASS' : 'GRIP'}
          </div>
          <div style={{
            height: 8, marginTop: 7, borderRadius: 999,
            background: 'rgba(15,23,42,.72)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.round((driftActive ? driftCharge : grip) * 100)}%`,
              background: driftActive
                ? 'linear-gradient(90deg, #f59e0b, #fef08a)'
                : offroad
                  ? 'linear-gradient(90deg, #84cc16, #bef264)'
                  : 'linear-gradient(90deg, #06b6d4, #10b981)',
            }} />
          </div>
          <div style={{ fontSize: 12, color: driftActive ? '#fbbf24' : offroad ? '#bef264' : '#67e8f9', fontWeight: 800, marginTop: 5 }}>
            {driftActive ? 'RELEASE SHIFT' : offroad ? 'SLOW' : turboGrade || `${Math.round(grip * 100)}%`}
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

        {/* Item */}
        <div style={{
          background: itemSlot ? 'rgba(168, 85, 247, 0.2)' : 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 18px',
          border: `1px solid ${itemSlot ? 'rgba(216, 180, 254, 0.58)' : 'rgba(148, 163, 184, 0.2)'}`,
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
          minWidth: 104,
          transform: itemFlashTimer > 0 ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.16s ease',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>ITEM Q</div>
          <div style={{ fontSize: 18, color: itemSlot ? '#f5d0fe' : '#64748b', fontWeight: 900 }}>
            {itemLabel}
          </div>
        </div>

        {(shieldTimer > 0 || slipTimer > 0 || coins > 0) && (
          <div style={{
            background: 'rgba(10, 10, 26, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14,
            padding: '10px 16px',
            border: '1px solid rgba(34, 211, 238, 0.24)',
            fontFamily: 'Outfit, sans-serif',
            textAlign: 'center',
            minWidth: 118,
          }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
              STATUS
            </div>
            <div style={{ fontSize: 15, color: '#e0f2fe', fontWeight: 900 }}>
              {shieldTimer > 0 ? `Schild ${Math.ceil(shieldTimer)}` : slipTimer > 0 ? 'Rutschig' : slipstreamCharge > 0 ? `Wind ${Math.round(slipstreamCharge * 100)}%` : mode === 'learn' ? `Streak ${learnGateStreak}` : `Muenzen ${coins} / Block ${stats?.hazardEvades ?? 0}`}
            </div>
          </div>
        )}
      </div>

      {miniTurboTimer > 0 && (
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: 118,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          padding: '10px 22px',
          borderRadius: 999,
          background: 'rgba(245, 158, 11, 0.18)',
          border: '1px solid rgba(251, 191, 36, 0.62)',
          color: '#fef3c7',
          fontFamily: 'Outfit, sans-serif',
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 1.5,
          textShadow: '0 0 18px rgba(245, 158, 11, .8)',
        }}>
          {miniTurboText}
        </div>
      )}

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
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 16,
            color: '#cbd5e1',
            fontWeight: 800,
            margin: '-6px 0 0',
          }}>
            Racecraft {racecraft} {racecraftGrade} • Best Lap {formatDuration(bestLapTime)}
            {turboChainPeak > 1 ? ` • Beste Kette x${turboChainPeak}` : ''}
          </p>
          <button
            onClick={() => useKartStore.getState().startRace()}
            className="btn-primary"
            style={{ marginTop: 8, fontSize: 18, padding: '14px 36px' }}
          >
            Nochmal fahren
          </button>
        </div>
      )}
    </>
  );
}

// Component rendered INSIDE Canvas (via afterPhysics) to provide FX context
function KartFXLayer() {
  const boostActive = useKartStore(s => s.boostActive);
  const { shake, ShakeUpdater } = useScreenShake();
  const boostParticleRef = useRef();
  const sparkParticleRef = useRef();
  const driftParticleRef = useRef();

  return (
    <KartFXContext.Provider value={{ shake, boostParticleRef, sparkParticleRef, driftParticleRef }}>
      <ShakeUpdater />
      <InstancedParticles particleRef={boostParticleRef} count={80} color="#ff6600" emissive="#ff4400" emissiveIntensity={3} size={0.15} />
      <InstancedParticles particleRef={sparkParticleRef} count={60} color="#fbbf24" emissive="#f59e0b" emissiveIntensity={4} size={0.08} />
      <InstancedParticles particleRef={driftParticleRef} count={50} color="#f97316" emissive="#ea580c" emissiveIntensity={3} size={0.1} />
      <PostProcessingStack preset="racing" boostActive={boostActive} />
    </KartFXContext.Provider>
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
  }, [isPlaying]);

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
        gameName="Faska Kart Pro"
        gravity={[0, -20, 0]}
        cameraProps={{ position: [0, 8, 15], fov: 65 }}
        onReset={handleRestart}
        afterPhysics={<KartFXLayer />}
      >
        <World />
        <Player />
      </SwarmOrchestrator>

      <ModeSwitch />

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
        gameName="Faska Kart Pro"
        showLives={false}
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
          { label: '🎁', id: 'Y', color: '#a855f7' },
        ]}
      />
    </div>
  );
}
