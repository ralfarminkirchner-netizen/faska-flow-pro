import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import useGameInput from '../../../../shared/useGameInput';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import { useRunnerStore } from './GameLogic';
import World from './World';

const panel = {
  background: 'rgba(2, 6, 23, 0.74)',
  border: '1px solid rgba(34, 211, 238, 0.22)',
  borderRadius: 14,
  boxShadow: '0 16px 42px rgba(0,0,0,.34)',
  backdropFilter: 'blur(12px)',
  color: '#e5f6ff',
  fontFamily: 'Outfit, sans-serif',
};

function InputController() {
  const prevDx = useRef(0);
  const moveLeft = useRunnerStore((state) => state.moveLeft);
  const moveRight = useRunnerStore((state) => state.moveRight);
  const isPlaying = useRunnerStore((state) => state.isPlaying);

  useFrame(() => {
    const currentDx = useRunnerStore.getState().input.dx;
    if (!isPlaying) {
      prevDx.current = currentDx;
      return;
    }
    if (currentDx < -0.5 && prevDx.current >= -0.5) moveLeft();
    if (currentDx > 0.5 && prevDx.current <= 0.5) moveRight();
    prevDx.current = currentDx;
  });

  return null;
}

function Meter({ label, value, max = 100, color = '#22d3ee' }) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900, color: '#cbd5e1' }}>
        <span>{label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(148,163,184,.18)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${ratio * 100}%`, height: '100%', borderRadius: 999, background: color, boxShadow: `0 0 16px ${color}` }} />
      </div>
    </div>
  );
}

function GeoRunnerHud({ store }) {
  const contract = store.contract;
  const progress = contract ? store.contractProgress / contract.target : 0;

  if (!store.isPlaying || store.isGameOver) return null;

  return (
    <>
      <div style={{
        ...panel,
        position: 'absolute',
        top: 72,
        left: 16,
        width: 292,
        padding: 14,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
          <div style={{ color: '#67e8f9', fontSize: 13, fontWeight: 950, textTransform: 'uppercase' }}>
            Zone {store.wave}
          </div>
          <div style={{ color: '#facc15', fontSize: 12, fontWeight: 900 }}>
            Combo {store.combo} / {store.bestCombo}
          </div>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          <Meter label="Schild" value={store.shield} color={store.shield > 35 ? '#22d3ee' : '#fb7185'} />
          <Meter label="Turbo" value={store.turbo} color={store.turbo >= 100 ? '#facc15' : '#a78bfa'} />
        </div>
        <div style={{ marginTop: 12, color: '#dbeafe', fontSize: 12, fontWeight: 800, lineHeight: 1.35 }}>
          {store.message}
        </div>
        <div style={{ marginTop: 10, color: '#94a3b8', fontSize: 11, fontWeight: 800 }}>
          Distanz {Math.round(store.distance)} m · Spur {store.playerLane + 3}/5
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
          {store.currentSubject || 'Aufgabe'}
        </div>
        <div style={{ marginTop: 8, color: '#f8fafc', fontSize: 18, fontWeight: 950, lineHeight: 1.25 }}>
          {store.currentQuestion || 'Halte den Flow'}
        </div>
        {store.mode === 'learn' && (
          <div style={{ marginTop: 7, color: '#94a3b8', fontSize: 12, fontWeight: 800 }}>
            Laufe durch die richtige Antwort.
          </div>
        )}
      </div>

      <div style={{
        ...panel,
        position: 'absolute',
        left: 16,
        bottom: 18,
        width: 308,
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
              <div style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%`, height: '100%', background: '#facc15', boxShadow: '0 0 16px #facc15' }} />
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

      <div style={{
        ...panel,
        position: 'absolute',
        right: 16,
        bottom: 18,
        padding: '11px 13px',
        color: '#cbd5e1',
        fontSize: 12,
        fontWeight: 850,
        lineHeight: 1.45,
        pointerEvents: 'none',
      }}>
        Pfeile/A-D: Spur · Space: Sprung · Shift: Slide · E: Schild · Q: Turbo
      </div>
    </>
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
      background: 'radial-gradient(circle at 50% 18%, rgba(34,211,238,.16), rgba(3,7,18,.94) 58%)',
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
          Geo Runner Pro
        </h1>
        <p style={{ maxWidth: 650, margin: '0 auto 24px', color: '#cbd5e1', fontSize: 18, lineHeight: 1.55 }}>
          Fuenf-Spur-Runner mit Gates, Huerden, Slides, Schild-Burst, Turbo, Pickups und aktiven Auftraegen. Im Lernmodus werden Geografie, Deutsch, Mathe und Englisch direkt als Spurentscheidungen gespielt.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => store.startGame('arcade')}
            style={{
              padding: '16px 28px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg,#22d3ee,#2563eb)',
              color: '#00111f',
              fontSize: 17,
              fontWeight: 950,
              cursor: 'pointer',
              boxShadow: '0 0 28px rgba(34,211,238,.36)',
            }}
          >
            Normal starten
          </button>
          <button
            type="button"
            onClick={() => store.startGame('learn')}
            style={{
              padding: '16px 28px',
              borderRadius: 14,
              border: '1px solid rgba(167,139,250,.68)',
              background: 'rgba(124,58,237,.26)',
              color: '#f8fafc',
              fontSize: 17,
              fontWeight: 950,
              cursor: 'pointer',
            }}
          >
            Lernen starten
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FaskaGeoRunnerSwarm() {
  const { onMove, onAction, onActionUp } = useGameInput(useRunnerStore);
  const store = useRunnerStore();

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#030712' }}>
      <SwarmOrchestrator
        gameName="Geo Runner Pro"
        cameraProps={{ position: [0, 6.4, 13.2], fov: 58 }}
        gravity={[0, 0, 0]}
        afterPhysics={<PostProcessingStack preset="adventure" />}
      >
        <InputController />
        <World />
      </SwarmOrchestrator>

      <UIOverlay
        gameName={store.mode === 'learn' ? 'Geo Runner Learncade' : 'Geo Runner Pro'}
        score={store.score}
        lives={store.lives}
        level={store.wave}
        isPaused={store.isPaused}
        isGameOver={store.isGameOver}
        onPause={store.pauseGame}
        onRestart={() => store.startGame(store.mode)}
        onExit={() => window.history.back()}
        showLearncadeScore={false}
      >
        <GeoRunnerHud store={store} />
      </UIOverlay>

      <StartScreen store={store} />

      <MobileJoystick
        onMove={onMove}
        onAction={onAction}
        onActionUp={onActionUp}
        buttons={[
          { label: 'SPR', id: 'A', color: '#10b981', ariaLabel: 'Springen' },
          { label: 'SLD', id: 'B', color: '#f97316', ariaLabel: 'Rutschen' },
          { label: 'SH', id: 'X', color: '#22d3ee', ariaLabel: 'Schild-Burst' },
          { label: 'TBO', id: 'Y', color: '#facc15', ariaLabel: 'Turbo' },
        ]}
      />
    </div>
  );
}
