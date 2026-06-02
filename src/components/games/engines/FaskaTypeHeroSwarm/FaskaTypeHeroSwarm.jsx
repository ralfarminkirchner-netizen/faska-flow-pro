import { useEffect } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import { useGameStore } from './GameLogic';
import World from './World';

const panel = {
  background: 'rgba(2, 6, 23, 0.76)',
  border: '1px solid rgba(34, 211, 238, 0.22)',
  borderRadius: 14,
  boxShadow: '0 16px 44px rgba(0,0,0,.34)',
  backdropFilter: 'blur(12px)',
  color: '#e5f6ff',
  fontFamily: 'Outfit, sans-serif',
};

const letters = [
  'QWERTZUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'YXCVBNM'.split(''),
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
];

function Meter({ label, value, max = 100, color = '#22d3ee' }) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1', fontWeight: 900 }}>
        <span>{label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(148,163,184,.18)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${ratio * 100}%`, height: '100%', background: color, borderRadius: 999, boxShadow: `0 0 16px ${color}` }} />
      </div>
    </div>
  );
}

function TypeHeroHud({ store }) {
  const active = store.cards.find((card) => card.id === store.activeCardId);
  const contract = store.contract;
  const contractRatio = contract ? store.contractProgress / contract.target : 0;

  if (!store.isPlaying || store.isGameOver) return null;

  return (
    <>
      <div style={{
        ...panel,
        position: 'absolute',
        top: 72,
        left: 16,
        width: 300,
        padding: 14,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
          <div style={{ color: '#67e8f9', fontSize: 13, fontWeight: 950, textTransform: 'uppercase' }}>
            Welle {store.wave}
          </div>
          <div style={{ color: '#facc15', fontSize: 12, fontWeight: 900 }}>
            Combo {store.combo} / {store.bestCombo}
          </div>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          <Meter label="Core" value={store.health} max={store.maxHealth} color={store.health > 35 ? '#22d3ee' : '#fb7185'} />
          <Meter label="Overdrive" value={store.overdrive} color={store.overdrive >= 100 ? '#facc15' : '#a78bfa'} />
        </div>
        <div style={{ marginTop: 12, color: '#dbeafe', fontSize: 12, fontWeight: 800, lineHeight: 1.35 }}>
          {store.message}
        </div>
        <div style={{ marginTop: 10, color: '#94a3b8', fontSize: 11, fontWeight: 850 }}>
          Freeze {store.freezeCharges} · Karten {store.cardsCleared} · Modus {store.mode === 'learn' ? 'Lernen' : 'Normal'}
        </div>
      </div>

      <div style={{
        ...panel,
        position: 'absolute',
        top: 72,
        right: 16,
        width: 318,
        padding: 14,
        pointerEvents: 'none',
      }}>
        <div style={{ color: '#c4b5fd', fontSize: 12, fontWeight: 950, textTransform: 'uppercase' }}>
          Aktives Ziel
        </div>
        {active ? (
          <>
            <div style={{ marginTop: 8, color: active.color, fontSize: 13, fontWeight: 950 }}>
              {active.subject} · {active.kind} · {active.hp}/{active.maxHp}
            </div>
            <div style={{ marginTop: 6, color: '#f8fafc', fontSize: 18, fontWeight: 950, lineHeight: 1.2 }}>
              {active.prompt}
            </div>
            <div style={{ marginTop: 8, color: '#e2e8f0', fontSize: 22, fontWeight: 950, letterSpacing: 1 }}>
              <span style={{ color: '#34d399' }}>{active.typed}</span>
              <span>{active.answer.slice(active.typed.length)}</span>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 8, color: '#cbd5e1', fontSize: 14, fontWeight: 850 }}>
            Tippe den ersten Buchstaben einer Karte.
          </div>
        )}
      </div>

      <div style={{
        ...panel,
        position: 'absolute',
        left: 16,
        bottom: 18,
        width: 310,
        padding: 14,
        pointerEvents: 'none',
      }}>
        <div style={{ color: '#facc15', fontSize: 12, fontWeight: 950, textTransform: 'uppercase' }}>
          Aktiver Auftrag
        </div>
        {contract ? (
          <>
            <div style={{ marginTop: 7, fontSize: 16, color: '#f8fafc', fontWeight: 950 }}>
              {contract.label}
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 12, fontWeight: 850 }}>
              <span>{Math.floor(store.contractProgress)}/{contract.target}</span>
              <span>{Math.max(0, Math.ceil(store.contractTimer))}s</span>
            </div>
            <div style={{ marginTop: 7, height: 8, background: 'rgba(148,163,184,.18)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(0, Math.min(1, contractRatio)) * 100}%`, height: '100%', background: '#facc15', boxShadow: '0 0 16px #facc15' }} />
            </div>
          </>
        ) : (
          <div style={{ marginTop: 8, color: '#cbd5e1', fontSize: 13, fontWeight: 800 }}>
            Neuer Auftrag in {Math.max(0, Math.ceil(store.contractCooldown))}s
          </div>
        )}
        <div style={{ marginTop: 11, display: 'flex', gap: 10, color: '#94a3b8', fontSize: 11, fontWeight: 850 }}>
          <span>Medaillen {store.contractMedals}</span>
          <span>Fehlschlaege {store.contractFails}</span>
        </div>
      </div>
    </>
  );
}

function Keyboard({ store }) {
  if (!store.isPlaying || store.isGameOver || store.isPaused) return null;

  const keyStyle = {
    minWidth: 34,
    height: 34,
    borderRadius: 8,
    border: '1px solid rgba(34,211,238,.25)',
    background: 'rgba(15,23,42,.72)',
    color: '#e0f2fe',
    fontWeight: 950,
    fontSize: 12,
    cursor: 'pointer',
    pointerEvents: 'auto',
  };

  return (
    <div style={{
      ...panel,
      position: 'absolute',
      left: '50%',
      bottom: 18,
      transform: 'translateX(-50%)',
      padding: 10,
      display: 'grid',
      gap: 6,
      pointerEvents: 'auto',
      maxWidth: 'calc(100vw - 36px)',
    }}>
      {letters.map((row, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
          {row.map((key) => (
            <button key={key} type="button" onClick={() => store.handleKey(key)} style={keyStyle}>
              {key}
            </button>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button type="button" onClick={store.activateFreeze} style={{ ...keyStyle, minWidth: 86, color: store.freezeCharges > 0 ? '#bfdbfe' : '#64748b' }}>
          Freeze {store.freezeCharges}
        </button>
        <button type="button" onClick={store.activateOverdrive} style={{ ...keyStyle, minWidth: 112, color: store.overdrive >= 100 ? '#facc15' : '#64748b' }}>
          Overdrive
        </button>
        <button type="button" onClick={() => store.handleKey('Escape')} style={{ ...keyStyle, minWidth: 72 }}>
          Clear
        </button>
      </div>
    </div>
  );
}

function StartScreen({ store }) {
  if (store.isPlaying || store.isGameOver) return null;
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(circle at 50% 18%, rgba(34,211,238,.16), rgba(2,6,23,.95) 58%)',
      color: '#f8fafc',
      fontFamily: 'Outfit, sans-serif',
      textAlign: 'center',
    }}>
      <div style={{ width: 'min(760px, 100%)' }}>
        <div style={{ color: '#67e8f9', fontSize: 13, fontWeight: 950, letterSpacing: 2, textTransform: 'uppercase' }}>
          FASKA FLOW
        </div>
        <h1 style={{
          margin: '8px 0 12px',
          fontSize: 'clamp(44px, 8vw, 84px)',
          lineHeight: 0.95,
          letterSpacing: 0,
          textShadow: '0 0 34px rgba(34,211,238,.5)',
        }}>
          Type Hero Pro
        </h1>
        <p style={{ maxWidth: 650, margin: '0 auto 24px', color: '#cbd5e1', fontSize: 18, lineHeight: 1.55 }}>
          Typing-Arcade mit Kartenwellen, Ziel-Lock, Bossketten, Bonuskarten, Fehlerdruck, Freeze, Overdrive und Lernkarten fuer Deutsch, Mathe, Englisch, Geografie und Sachkunde.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => store.startGame('arcade')} style={{
            padding: '16px 28px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg,#22d3ee,#2563eb)',
            color: '#00111f',
            fontSize: 17,
            fontWeight: 950,
            cursor: 'pointer',
            boxShadow: '0 0 28px rgba(34,211,238,.36)',
          }}>
            Normal starten
          </button>
          <button type="button" onClick={() => store.startGame('learn')} style={{
            padding: '16px 28px',
            borderRadius: 14,
            border: '1px solid rgba(167,139,250,.68)',
            background: 'rgba(124,58,237,.26)',
            color: '#f8fafc',
            fontSize: 17,
            fontWeight: 950,
            cursor: 'pointer',
          }}>
            Lernen starten
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FaskaTypeHeroSwarm() {
  const store = useGameStore();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!useGameStore.getState().isPlaying) return;
      const handled = event.key.length === 1
        || ['Backspace', 'Escape', 'Enter', ' ', 'Shift'].includes(event.key);
      if (!handled) return;
      event.preventDefault();
      useGameStore.getState().handleKey(event.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#020617' }}>
      <SwarmOrchestrator
        gameName="Type Hero Pro"
        cameraProps={{ position: [0, 8.2, 19.5], fov: 55 }}
        gravity={[0, 0, 0]}
        afterPhysics={<PostProcessingStack preset="space" damageFlash={store.shake > 0.5 ? 1 : 0} />}
      >
        <World />
      </SwarmOrchestrator>

      <UIOverlay
        gameName={store.mode === 'learn' ? 'Type Hero Learncade' : 'Type Hero Pro'}
        score={store.score}
        lives={Math.max(0, Math.ceil(store.health / 34))}
        level={store.wave}
        isPaused={store.isPaused}
        isGameOver={store.isGameOver}
        onPause={store.pauseGame}
        onRestart={() => store.startGame(store.mode)}
        onExit={() => window.history.back()}
        showLearncadeScore={false}
      >
        <TypeHeroHud store={store} />
      </UIOverlay>

      <Keyboard store={store} />
      <StartScreen store={store} />

      <MobileJoystick
        onMove={() => {}}
        onAction={(id) => {
          if (id === 'A') store.activateFreeze();
          if (id === 'B') store.activateOverdrive();
        }}
        buttons={[
          { label: 'FRZ', id: 'A', color: '#60a5fa', ariaLabel: 'Freeze' },
          { label: 'OD', id: 'B', color: '#facc15', ariaLabel: 'Overdrive' },
        ]}
      />
    </div>
  );
}
