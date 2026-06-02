import { useRef, useCallback } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import InstancedParticles from '../../../../shared/ParticleSystem';
import { useScreenShake } from '../../../../shared/ScreenShake';
import useGameInput from '../../../../shared/useGameInput';
import useDoomStore, { DOOM_WEAPONS, DOOM_SEALS } from './GameLogic';
import Player from './Player';
import World from './World';

/**
 * FaskaDoomSwarm — Arena FPS Orchestrator
 * Shooting MUST WORK: click to shoot, enemies die, particles burst, screen shakes.
 */

/* ─────────────────────────── Custom Doom HUD ─────────────────────────── */
function DoomHUD() {
  const health = useDoomStore(s => s.health);
  const maxHealth = useDoomStore(s => s.maxHealth);
  const armor = useDoomStore(s => s.armor);
  const maxArmor = useDoomStore(s => s.maxArmor);
  const ammo = useDoomStore(s => s.ammo);
  const maxAmmo = useDoomStore(s => s.maxAmmo);
  const grenades = useDoomStore(s => s.grenades);
  const weaponId = useDoomStore(s => s.weaponId);
  const dashCooldown = useDoomStore(s => s.dashCooldown);
  const ripperCharge = useDoomStore(s => s.ripperCharge);
  const ripperModeTimer = useDoomStore(s => s.ripperModeTimer);
  const reactorSeals = useDoomStore(s => s.reactorSeals);
  const waveNumber = useDoomStore(s => s.waveNumber);
  const waveCleared = useDoomStore(s => s.waveCleared);
  const enemies = useDoomStore(s => s.enemies);
  const enemiesKilled = useDoomStore(s => s.enemiesKilled);
  const score = useDoomStore(s => s.score);
  const damageFlash = useDoomStore(s => s.damageFlash);
  const message = useDoomStore(s => s.message);
  const messageTimer = useDoomStore(s => s.messageTimer);
  const activeContract = useDoomStore(s => s.activeContract);
  const contractCooldown = useDoomStore(s => s.contractCooldown);
  const contractWins = useDoomStore(s => s.contractWins);
  const contractFails = useDoomStore(s => s.contractFails);
  const criticalHits = useDoomStore(s => s.doomStats.criticalHits || 0);
  const contractProgress = useDoomStore(s => {
    const contract = s.activeContract;
    if (!contract) return 0;
    return Math.min(Math.max((s.doomStats[contract.stat] || 0) - contract.startValue, 0), contract.target);
  });

  const aliveCount = enemies.filter(e => e.alive).length;
  const healthPct = (health / maxHealth) * 100;
  const armorPct = (armor / maxArmor) * 100;
  const healthColor = healthPct > 60 ? '#22c55e' : healthPct > 30 ? '#eab308' : '#ef4444';
  const weapon = DOOM_WEAPONS[weaponId] ?? DOOM_WEAPONS.repeater;

  return (
    <>
      {/* ── Crosshair ── */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 60,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28">
          <line x1="14" y1="2" x2="14" y2="10" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />
          <line x1="14" y1="18" x2="14" y2="26" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />
          <line x1="2" y1="14" x2="10" y2="14" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />
          <line x1="18" y1="14" x2="26" y2="14" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />
          <circle cx="14" cy="14" r="2" fill="#22d3ee" opacity="0.5" />
        </svg>
      </div>

      {/* ── Bottom HUD bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        padding: '16px 20px', pointerEvents: 'none', zIndex: 55,
      }}>
        {/* Health bar (left) */}
        <div style={{
          background: 'rgba(10,10,26,0.88)', backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 18px',
          border: `1px solid ${healthColor}33`, minWidth: 130,
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11,
            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
          }}>
            HEALTH
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 900,
            color: healthColor, textShadow: `0 0 20px ${healthColor}66`,
          }}>
            {health}
          </div>
          <div style={{
            width: '100%', height: 5, background: '#1a1a2e',
            borderRadius: 3, marginTop: 6, overflow: 'hidden',
          }}>
            <div style={{
              width: `${healthPct}%`, height: '100%',
              background: `linear-gradient(90deg, ${healthColor}, ${healthColor}cc)`,
              borderRadius: 3, transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{
            width: '100%', height: 4, background: '#0f172a',
            borderRadius: 3, marginTop: 5, overflow: 'hidden',
          }}>
            <div style={{
              width: `${armorPct}%`, height: '100%',
              background: 'linear-gradient(90deg, #38bdf8, #a5f3fc)',
              borderRadius: 3,
            }} />
          </div>
          <div style={{ marginTop: 4, fontSize: 10, color: '#93c5fd', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
            ARMOR {armor}
          </div>
        </div>

        {/* Wave + Score (center) */}
        <div style={{
          background: 'rgba(10,10,26,0.88)', backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '8px 20px',
          border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11,
            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1,
          }}>
            WELLE {waveNumber}
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800,
            color: waveCleared ? '#22c55e' : '#ef4444', marginTop: 2,
          }}>
            {waveCleared ? 'GESCHAFFT' : `${aliveCount} Gegner`}
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 13,
            color: '#94a3b8', marginTop: 4,
          }}>
            Score: <span style={{ color: '#f8fafc', fontWeight: 900 }}>{score}</span>
            {' · '}
            Kills: <span style={{ color: '#f8fafc', fontWeight: 900 }}>{enemiesKilled}</span>
          </div>
          <div style={{
            marginTop: 8,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 6,
            minWidth: 380,
          }}>
            {[
              ['DASH', dashCooldown <= 0 ? 'OK' : `${dashCooldown.toFixed(1)}s`],
              ['BOMB', grenades],
              ['SEAL', `${reactorSeals.length}/${DOOM_SEALS.length}`],
              ['CRIT', criticalHits],
              ['RIP', ripperModeTimer > 0 ? `${Math.ceil(ripperModeTimer)}s` : `${ripperCharge}%`],
            ].map(([label, value]) => (
              <div key={label} style={{
                borderRadius: 9,
                padding: '5px 7px',
                background: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(148, 163, 184, 0.16)',
              }}>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 900 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 900 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 8,
            padding: '8px 10px',
            borderRadius: 10,
            background: 'rgba(15, 23, 42, 0.78)',
            border: '1px solid rgba(196,181,253,0.22)',
            textAlign: 'left',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 10,
              fontFamily: 'Outfit, sans-serif',
              fontSize: 10,
              color: '#c4b5fd',
              fontWeight: 900,
              letterSpacing: 0.7,
              textTransform: 'uppercase',
            }}>
              <span>Einsatzauftrag</span>
              <span>{contractWins} OK · {contractFails} Fail</span>
            </div>
            {activeContract ? (
              <>
                <div style={{
                  marginTop: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 12,
                  color: '#f8fafc',
                  fontWeight: 900,
                }}>
                  <span>{activeContract.label}</span>
                  <span style={{ color: activeContract.timeLeft < 8 ? '#fb7185' : '#fde68a' }}>{Math.ceil(activeContract.timeLeft)}s</span>
                </div>
                <div style={{
                  height: 7,
                  marginTop: 7,
                  overflow: 'hidden',
                  borderRadius: 999,
                  background: 'rgba(148,163,184,0.22)',
                }}>
                  <div style={{
                    width: `${Math.min(100, (contractProgress / activeContract.target) * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #a78bfa, #67e8f9)',
                  }} />
                </div>
                <div style={{ marginTop: 4, fontSize: 10, color: '#94a3b8', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
                  {contractProgress}/{activeContract.target}
                </div>
              </>
            ) : (
              <div style={{ marginTop: 5, fontSize: 12, color: '#cbd5e1', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
                Naechster Einsatz in {Math.ceil(contractCooldown)}s
              </div>
            )}
          </div>
        </div>

        {/* Ammo counter (right) */}
        <div style={{
          background: 'rgba(10,10,26,0.88)', backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 18px',
          border: '1px solid rgba(34,211,238,0.25)', minWidth: 110, textAlign: 'right',
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11,
            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
          }}>
            {weapon.label}
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 900,
            color: ripperModeTimer > 0 ? '#c084fc' : ammo > 10 ? weapon.color : ammo > 5 ? '#eab308' : '#ef4444',
            textShadow: ammo <= 5 ? '0 0 20px #ff000066' : '0 0 20px #22d3ee44',
          }}>
            {ammo}
            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>/{maxAmmo}</span>
          </div>
        </div>
      </div>

      {/* ── Message toast ── */}
      {messageTimer > 0 && (
        <div style={{
          position: 'fixed', left: '50%', top: 120,
          transform: 'translateX(-50%)',
          background: 'rgba(10,10,26,0.82)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, color: '#f8fafc', fontFamily: 'Outfit, sans-serif',
          fontSize: 16, fontWeight: 900, padding: '8px 20px',
          textTransform: 'uppercase', letterSpacing: 1,
          pointerEvents: 'none', zIndex: 56,
        }}>
          {message}
        </div>
      )}

      {/* ── Damage vignette ── */}
      {damageFlash > 0.01 && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 52,
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(220,38,38,${0.35 * damageFlash}) 100%)`,
          transition: 'opacity 0.15s ease',
        }} />
      )}

      {/* ── Low health pulse vignette ── */}
      {health < 30 && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 51,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(220,38,38,${0.18 * (1 - health / 30)}) 100%)`,
          animation: 'doomPulse 1.2s ease-in-out infinite',
        }} />
      )}

      <style>{`
        @keyframes doomPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────── Scene Content (inside Canvas) ─────────────────────────── */
function SceneContent({ particleRef }) {
  const { shake, ShakeUpdater } = useScreenShake();
  const damageFlash = useDoomStore(s => s.damageFlash);

  return (
    <>
      <World />
      <Player particleRef={particleRef} shake={shake} />
      <ShakeUpdater />
      <InstancedParticles particleRef={particleRef} count={80} color="#ff4444" size={0.12} />
      <PostProcessingStack preset="action" damageFlash={damageFlash} />
    </>
  );
}

/* ─────────────────────────── Start Screen ─────────────────────────── */
function StartScreen({ onStart, mode, onModeChange }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #050510 70%)',
      zIndex: 100, flexDirection: 'column', gap: 24,
    }}>
      <h1 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 52, fontWeight: 900,
        color: '#ef4444',
        textShadow: '0 0 40px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.3)',
        letterSpacing: 4, margin: 0,
      }}>
        FASKA DOOM
      </h1>
      <p style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 15, color: '#94a3b8',
        maxWidth: 420, textAlign: 'center', lineHeight: 1.6,
      }}>
        Klicken zum Umschauen · WASD bewegen · Klick schiessen · Shift Sprint
        <br />
        Space Dash/Glory · E Granate · Q Waffenwechsel · R Ripper · Weakpoints treffen
        <br />
        {mode === 'learn'
          ? 'Learncade: Champions und Score-Quiz — richtig = +20 Munition!'
          : 'Wellen, Waffenfundorte, Reaktor-Siegel, Dash, Granaten und Glory-Finisher.'}
      </p>

      {/* Mode switch */}
      <div style={{ display: 'flex', gap: 8, zIndex: 102 }}>
        {[['arcade', 'Normal'], ['learn', 'Learncade']].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onModeChange(id)}
            style={{
              padding: '9px 18px', borderRadius: 10,
              border: mode === id ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.14)',
              background: mode === id ? 'rgba(234,179,8,0.2)' : 'rgba(10,10,26,0.76)',
              color: mode === id ? '#fef3c7' : '#cbd5e1',
              fontFamily: 'Outfit, sans-serif', fontWeight: 900,
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.8,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          padding: '16px 52px', fontSize: 20, fontWeight: 700,
          background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
          border: '2px solid #ef444444', borderRadius: 16,
          color: '#fff', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
          boxShadow: '0 0 30px rgba(239,68,68,0.4)',
        }}
      >
        START GAME
      </button>
    </div>
  );
}

/* ─────────────────────────── Main Orchestrator ─────────────────────────── */
export default function FaskaDoomSwarm() {
  const particleRef = useRef();

  const score = useDoomStore(s => s.score);
  const isPlaying = useDoomStore(s => s.isPlaying);
  const isPaused = useDoomStore(s => s.isPaused);
  const isGameOver = useDoomStore(s => s.isGameOver);
  const quizActive = useDoomStore(s => s.quizActive);
  const quizQuestion = useDoomStore(s => s.quizQuestion);
  const quizScore = useDoomStore(s => s.quizScore);
  const quizStreak = useDoomStore(s => s.quizStreak);
  const mode = useDoomStore(s => s.mode);
  const contractWins = useDoomStore(s => s.contractWins);
  const contractFails = useDoomStore(s => s.contractFails);

  const startGame = useDoomStore(s => s.startGame);
  const pauseGame = useDoomStore(s => s.pauseGame);
  const answerQuiz = useDoomStore(s => s.answerQuiz);
  const quizBonus = useDoomStore(s => s.quizBonus);
  const setMode = useDoomStore(s => s.setMode);

  // Input hook for mobile joystick
  const { onMove, onAction, onActionUp } = useGameInput(useDoomStore);
  const onLook = useCallback((dx, dy) => {
    window.dispatchEvent(new CustomEvent('faska:touch-look', { detail: { dx, dy } }));
  }, []);

  const handleStart = useCallback(() => {
    try { startGame(); } catch (e) { console.error('[FaskaDoomSwarm] start error:', e); }
  }, [startGame]);

  const handleRestart = useCallback(() => {
    try { startGame(); } catch (e) { console.error('[FaskaDoomSwarm] restart error:', e); }
  }, [startGame]);

  const handlePause = useCallback(() => {
    try { pauseGame(); } catch (e) { console.error('[FaskaDoomSwarm] pause error:', e); }
  }, [pauseGame]);

  const handleExit = useCallback(() => {
    try { window.history.back(); } catch { /* silent */ }
  }, []);

  const handleQuizAnswer = useCallback((answer) => {
    try { answerQuiz(answer); } catch (e) { console.warn('[FaskaDoomSwarm] quiz error:', e); }
  }, [answerQuiz]);

  // Start screen
  if (!isPlaying && !isGameOver) {
    return <StartScreen onStart={handleStart} mode={mode} onModeChange={setMode} />;
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <SwarmOrchestrator
        gameName="FASKA DOOM"
        gravity={[0, -9.81, 0]}
        cameraProps={{ position: [0, 1.6, 0], fov: 75, near: 0.1, far: 100 }}
        onReset={handleRestart}
        canvasProps={{ dpr: [1, 1.5] }}
      >
        <SceneContent particleRef={particleRef} />
      </SwarmOrchestrator>

      {/* Custom Doom HUD (NOT UIOverlay) */}
      {isPlaying && !isPaused && <DoomHUD />}

      {isPlaying && (
        <div style={{
          position: 'fixed',
          top: 14,
          right: 14,
          zIndex: 70,
          display: 'flex',
          gap: 10,
          pointerEvents: 'auto',
        }}>
          <button
            type="button"
            onClick={handlePause}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: '1px solid rgba(148, 163, 184, 0.26)',
              background: 'rgba(15, 23, 42, 0.82)',
              color: '#e2e8f0',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <button
            type="button"
            onClick={handleExit}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: '1px solid rgba(248, 113, 113, 0.38)',
              background: 'rgba(15, 23, 42, 0.82)',
              color: '#fca5a5',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
      )}

      {/* Game over screen */}
      {isGameOver && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,16,0.85)', zIndex: 100,
          flexDirection: 'column', gap: 20,
        }}>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 42, fontWeight: 900,
            color: '#ef4444', textShadow: '0 0 30px rgba(239,68,68,0.5)',
            margin: 0,
          }}>
            GAME OVER
          </h2>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 18, color: '#94a3b8',
          }}>
            Score: <span style={{ color: '#f8fafc', fontWeight: 900 }}>{score}</span>
          </p>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 15, color: '#c4b5fd', fontWeight: 800, margin: -8,
          }}>
            Einsatzauftraege {contractWins}/{contractWins + contractFails}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleRestart}
              style={{
                padding: '14px 36px', fontSize: 16, fontWeight: 700,
                background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
                border: '2px solid #ef444444', borderRadius: 14,
                color: '#fff', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              }}
            >
              NOCHMAL
            </button>
            <button
              onClick={handleExit}
              style={{
                padding: '14px 36px', fontSize: 16, fontWeight: 700,
                background: 'rgba(30,30,60,0.8)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
                color: '#94a3b8', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              }}
            >
              EXIT
            </button>
          </div>
        </div>
      )}

      {/* Pause screen */}
      {isPaused && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,16,0.7)', zIndex: 100,
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 900,
            color: '#e2e8f0', textAlign: 'center',
          }}>
            PAUSIERT
            <br />
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 400 }}>
              ESC / P zum Fortfahren
            </span>
          </div>
        </div>
      )}

      {/* Learncade Quiz — compact mode */}
      <LearncadeQuiz
        active={quizActive}
        question={quizQuestion}
        onAnswer={handleQuizAnswer}
        onBonus={quizBonus}
        streak={quizStreak}
        quizScore={quizScore}
        bonusLabel="🔫 +20 Munition"
        compact
      />

      {/* Mobile controls */}
      <MobileJoystick
        onMove={onMove}
        onLook={onLook}
        onAction={onAction}
        onActionUp={onActionUp}
        buttons={[
          { label: 'FIRE', id: 'A', color: '#ef4444', ariaLabel: 'Schiessen' },
          { label: 'DASH', id: 'B', color: '#3b82f6', ariaLabel: 'Dash oder Glory Finisher' },
          { label: 'NADE', id: 'X', color: '#f97316', ariaLabel: 'Granate' },
          { label: 'WPN', id: 'Y', color: '#a855f7', ariaLabel: 'Waffe wechseln' },
        ]}
      />
    </div>
  );
}
