import { useEffect } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import { useMathDefenderStore } from './GameLogic';
import World from './World';

const panelStyle = {
  background: 'rgba(2, 6, 23, 0.76)',
  border: '1px solid rgba(34, 211, 238, 0.22)',
  borderRadius: 14,
  boxShadow: '0 14px 42px rgba(0,0,0,.32)',
  backdropFilter: 'blur(12px)',
  color: '#e5f6ff',
  fontFamily: 'Outfit, sans-serif',
};

const actionButton = (enabled, accent = '#22d3ee') => ({
  minWidth: 74,
  height: 48,
  borderRadius: 12,
  border: `1px solid ${enabled ? accent : 'rgba(148,163,184,.28)'}`,
  background: enabled ? `${accent}22` : 'rgba(15,23,42,.72)',
  color: enabled ? '#f8fafc' : '#94a3b8',
  fontWeight: 900,
  fontSize: 12,
  letterSpacing: 0,
  cursor: enabled ? 'pointer' : 'not-allowed',
  pointerEvents: 'auto',
});

function Meter({ label, value, max = 100, color = '#22d3ee' }) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1', fontWeight: 800 }}>
        <span>{label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: 'rgba(148,163,184,.16)', overflow: 'hidden' }}>
        <div style={{ width: `${ratio * 100}%`, height: '100%', borderRadius: 999, background: color, boxShadow: `0 0 16px ${color}` }} />
      </div>
    </div>
  );
}

function MathDefenderHud({ store }) {
  const contract = store.contract;
  const contractRatio = contract ? store.contractProgress / contract.target : 0;

  return (
    <>
      {store.isPlaying && !store.isGameOver && (
        <>
          <div style={{
            ...panelStyle,
            position: 'absolute',
            top: 72,
            left: 16,
            width: 286,
            padding: 14,
            pointerEvents: 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <div style={{ fontSize: 13, color: '#67e8f9', fontWeight: 900, textTransform: 'uppercase' }}>
                Welle {store.wave}
              </div>
              <div style={{ fontSize: 12, color: '#facc15', fontWeight: 900 }}>
                Combo {store.combo} / Best {store.bestCombo}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
              <Meter label="Basis-Schild" value={store.baseShield} color={store.baseShield > 45 ? '#22d3ee' : '#fb7185'} />
              <Meter label="Overdrive" value={store.overdrive} color={store.overdrive >= 100 ? '#facc15' : '#a78bfa'} />
            </div>
            <div style={{ marginTop: 12, color: '#e2e8f0', fontSize: 12, lineHeight: 1.35, fontWeight: 700 }}>
              {store.message}
            </div>
          </div>

          <div style={{
            ...panelStyle,
            position: 'absolute',
            top: 72,
            right: 16,
            width: 304,
            padding: 14,
            pointerEvents: 'none',
          }}>
            <div style={{ color: '#facc15', fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>
              Aktiver Auftrag
            </div>
            {contract ? (
              <>
                <div style={{ marginTop: 7, fontSize: 17, fontWeight: 900, color: '#f8fafc' }}>
                  {contract.label}
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', fontWeight: 800 }}>
                  <span>{store.contractProgress}/{contract.target}</span>
                  <span>{Math.max(0, Math.ceil(store.contractTimer))}s</span>
                </div>
                <div style={{ height: 8, marginTop: 7, borderRadius: 999, overflow: 'hidden', background: 'rgba(148,163,184,.18)' }}>
                  <div style={{ height: '100%', width: `${contractRatio * 100}%`, background: '#facc15', boxShadow: '0 0 18px #facc15' }} />
                </div>
              </>
            ) : (
              <div style={{ marginTop: 8, color: '#cbd5e1', fontSize: 13, fontWeight: 700 }}>
                Naechster Auftrag in {Math.max(0, Math.ceil(store.contractCooldown))}s
              </div>
            )}
            <div style={{ marginTop: 12, display: 'flex', gap: 10, fontSize: 12, color: '#94a3b8', fontWeight: 800 }}>
              <span>Medaillen {store.contractMedals}</span>
              <span>Fehlschlaege {store.contractFails}</span>
            </div>
          </div>
        </>
      )}

      {store.isPlaying && !store.isGameOver && !store.isPaused && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 14,
          alignItems: 'end',
          pointerEvents: 'none',
          width: 'min(760px, calc(100vw - 28px))',
        }}>
          <div style={{ ...panelStyle, padding: 14, minHeight: 102 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>
              <span>Antwort eintippen</span>
              <span>F Flak · X Freeze · Space Overdrive</span>
            </div>
            <div style={{
              marginTop: 4,
              minHeight: 54,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(34px, 6vw, 58px)',
              fontWeight: 950,
              color: store.errorEvent ? '#fb7185' : '#67e8f9',
              textShadow: store.errorEvent ? '0 0 22px rgba(251,113,133,.9)' : '0 0 24px rgba(103,232,249,.85)',
              letterSpacing: 0,
            }}>
              {store.currentInput || '...'}
            </div>
          </div>

          <div style={{
            ...panelStyle,
            padding: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 54px)',
            gap: 7,
            pointerEvents: 'auto',
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
              <button
                key={key}
                onClick={() => store.handleTyping(key.toString())}
                style={actionButton(true, '#22d3ee')}
              >
                {key}
              </button>
            ))}
            <button onClick={() => store.resetInput()} style={actionButton(true, '#94a3b8')}>C</button>
            <button onClick={() => store.handleTyping('0')} style={actionButton(true, '#22d3ee')}>0</button>
            <button onClick={() => store.handleTyping('Backspace')} style={actionButton(true, '#94a3b8')}>DEL</button>
          </div>
        </div>
      )}

      {store.isPlaying && !store.isGameOver && !store.isPaused && (
        <div style={{
          position: 'absolute',
          right: 18,
          bottom: 178,
          display: 'grid',
          gap: 8,
          pointerEvents: 'auto',
        }}>
          <button onClick={store.activateFlak} style={actionButton(store.flakCharges > 0, '#fb7185')}>
            FLAK {store.flakCharges}
          </button>
          <button onClick={store.activateFreezePulse} style={actionButton(store.pulseCharges > 0, '#60a5fa')}>
            FREEZE {store.pulseCharges}
          </button>
          <button onClick={store.activateOverdrive} style={actionButton(store.overdrive >= 100, '#facc15')}>
            OD
          </button>
        </div>
      )}
    </>
  );
}

export default function FaskaMathDefenderSwarm() {
  const store = useMathDefenderStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!useMathDefenderStore.getState().isPlaying) return;
      const handled = /^[0-9]$/.test(event.key)
        || ['Backspace', 'Delete', 'Enter', 'Escape', ' ', 'f', 'F', 'x', 'X', 'c', 'C'].includes(event.key);
      if (handled) {
        event.preventDefault();
        useMathDefenderStore.getState().handleTyping(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#020617' }}>
      <SwarmOrchestrator
        gameName="Math Defender Pro"
        cameraProps={{ position: [0, 8, 28], fov: 52 }}
        gravity={[0, 0, 0]}
        afterPhysics={(
          <PostProcessingStack
            preset="space"
            damageFlash={store.baseHitEvent ? 1 : 0}
          />
        )}
      >
        <World />
      </SwarmOrchestrator>

      <UIOverlay
        gameName={store.mode === 'learn' ? 'Math Defender Learncade' : 'Math Defender Pro'}
        score={store.score}
        lives={store.lives}
        level={store.wave}
        isPaused={store.isPaused}
        isGameOver={store.isGameOver}
        onPause={store.pauseGame}
        onRestart={() => store.startGame(store.mode)}
        onExit={() => window.history.back()}
        showLearncadeScore
        quizScore={store.quizScore}
      >
        <MathDefenderHud store={store} />
      </UIOverlay>

      {!store.isPlaying && !store.isGameOver && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 20%, rgba(34,211,238,.16), rgba(2,6,23,.94) 58%)',
          fontFamily: 'Outfit, sans-serif',
          color: 'white',
          padding: 24,
        }}>
          <div style={{ width: 'min(720px, 100%)', textAlign: 'center' }}>
            <div style={{ color: '#67e8f9', fontSize: 13, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>
              FASKA FLOW
            </div>
            <h1 style={{
              fontSize: 'clamp(42px, 7vw, 82px)',
              color: '#ecfeff',
              textShadow: '0 0 32px rgba(34,211,238,.55)',
              margin: '8px 0 10px',
              lineHeight: 0.95,
              letterSpacing: 0,
            }}>
              Math Defender Pro
            </h1>
            <p style={{ fontSize: 18, opacity: 0.84, lineHeight: 1.55, margin: '0 auto 24px', maxWidth: 610 }}>
              Verteidige die Basis wie in Math Blaster und Missile Command: Ergebnisse tippen, schnelle Ziele priorisieren, Flak und Freeze retten, Overdrive fuer Notlagen aufladen.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => store.startGame('arcade')}
                style={{
                  padding: '16px 28px',
                  fontSize: 17,
                  fontWeight: 950,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg,#22d3ee,#2563eb)',
                  color: '#00111f',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 28px rgba(34,211,238,.38)',
                }}
              >
                Normal starten
              </button>
              <button
                onClick={() => store.startGame('learn')}
                style={{
                  padding: '16px 28px',
                  fontSize: 17,
                  fontWeight: 950,
                  borderRadius: 14,
                  background: 'rgba(124,58,237,.26)',
                  color: '#f8fafc',
                  border: '1px solid rgba(167,139,250,.65)',
                  cursor: 'pointer',
                }}
              >
                Lernen starten
              </button>
            </div>
          </div>
        </div>
      )}

      {store.quizActive && (
        <div style={{ position: 'absolute', zIndex: 60, inset: 0 }}>
          <LearncadeQuiz
            active={store.quizActive}
            question={store.quizQuestion}
            onAnswer={store.answerQuiz}
            onBonus={() => {
              store.addScore(100);
              useMathDefenderStore.setState((state) => ({
                lives: Math.min(5, state.lives + 1),
                baseShield: Math.min(state.maxShield, state.baseShield + 25),
              }));
            }}
            streak={store.quizStreak}
            quizScore={store.quizScore}
            bonusLabel="Extra Schild"
          />
        </div>
      )}
    </div>
  );
}
