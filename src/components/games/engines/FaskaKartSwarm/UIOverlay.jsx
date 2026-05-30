import React from 'react';
import { useGameStore, LAP_COUNT, COUNTRIES } from './GameLogic';

export function UIOverlay({ onExit }) {
  const {
    phase,
    laps,
    heldItem,
    pendingCountry,
    showCountryModal,
    countryOptions,
    wrongAnswer,
    boostTimer,
    raceTime,
    updateGame,
  } = useGameStore();

  const handleCountryCorrect = () => {
    updateGame({
      showCountryModal: false,
      pendingCountry: null,
      countryAnswer: '',
      wrongAnswer: false,
      phase: 'racing'
    });
  };

  const handleCountryWrong = () => {
    updateGame({ wrongAnswer: true, countryAnswer: '' });
    setTimeout(() => updateGame({ wrongAnswer: false }), 600);
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const mins = String(Math.floor(raceTime / 60)).padStart(2, '0');
  const secs = String(raceTime % 60).padStart(2, '0');

  const itemEmoji = { shell: '🐚', boost: '⚡', banana: '🍌' }[heldItem] || null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, fontFamily: 'sans-serif' }}>
      
      {/* Top-left title */}
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', fontStyle: 'italic', color: '#facc15', textShadow: '2px 2px 0 #000' }}>
          🏎 FaskaKart Swarm
        </div>
        {phase === 'racing' && (
          <div style={{ color: 'white', fontSize: '16px', textShadow: '1px 1px 0 #000', marginTop: '4px' }}>
            Runde {Math.min(laps + 1, 3)}/3
          </div>
        )}
      </div>

      {/* Timer top-center */}
      {phase === 'racing' && (
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 20px', borderRadius: '10px',
          fontSize: '24px', fontWeight: 'bold', border: '2px solid #94a3b8'
        }}>
          ⏱ {mins}:{secs}
        </div>
      )}

      {/* Exit Button */}
      <div style={{ position: 'absolute', top: 20, right: 20, pointerEvents: 'auto' }}>
        <button
          onClick={onExit}
          style={{
            padding: '12px 24px', fontSize: '18px', fontWeight: 'bold', background: '#ef4444', color: 'white',
            border: '2px solid white', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            textTransform: 'uppercase'
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#dc2626')}
          onMouseOut={e => (e.currentTarget.style.background = '#ef4444')}
        >
          Beenden
        </button>
      </div>

      {/* Countdown */}
      {phase === 'countdown' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '140px', fontWeight: 'bold', color: '#facc15', textShadow: '0 0 30px rgba(0,0,0,0.8), 4px 4px 0 #000', animation: 'pulse 0.3s ease-in-out' }}>
            {raceTime === 0 && laps === 0 && boostTimer === 0 ? 'READY' : ''}
          </div>
        </div>
      )}

      {/* HUD */}
      {phase === 'racing' && (
        <div style={{ position: 'absolute', bottom: 180, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.75)', color: 'white', padding: '10px 18px', borderRadius: '12px', fontSize: '22px', fontWeight: 'bold', border: '2px solid #facc15' }}>
            🏁 Runde {Math.min(laps + 1, 3)}/3
          </div>
          <div style={{ background: 'rgba(0,0,0,0.75)', padding: '10px 18px', borderRadius: '12px', fontSize: '36px', border: '2px solid #6366f1', minWidth: '64px', textAlign: 'center' }}>
            {itemEmoji || <span style={{ fontSize: '22px', color: '#64748b' }}>—</span>}
          </div>
          {boostTimer > 0 && (
            <div style={{ background: 'rgba(251,191,36,0.9)', color: '#111', padding: '10px 18px', borderRadius: '12px', fontSize: '22px', fontWeight: 'bold' }}>
              ⚡ BOOST!
            </div>
          )}
        </div>
      )}

      {/* Country Modal */}
      {showCountryModal && pendingCountry && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 50, pointerEvents: 'auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', border: wrongAnswer ? '4px solid #ef4444' : '4px solid #facc15',
            borderRadius: '20px', padding: '36px 44px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', maxWidth: '420px', width: '90%', transition: 'border-color 0.2s'
          }}>
            <div style={{ fontSize: '90px', lineHeight: 1, textShadow: '4px 4px 0 #000' }}>
              {pendingCountry.flag}
            </div>
            <h2 style={{ color: '#facc15', fontSize: '26px', margin: '16px 0 8px', textShadow: '2px 2px 0 #000' }}>
              {{ shell: '🐚', boost: '⚡', banana: '🍌' }[heldItem] || '❓'} Item erhalten!
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '18px', margin: '0 0 20px', fontWeight: 'bold' }}>
              Welches Land zeigt diese Flagge?
            </p>
            {wrongAnswer && <p style={{ color: '#ef4444', fontSize: '16px', margin: '0 0 12px', fontWeight: 'bold' }}>❌ Falsch! Versuche es nochmal.</p>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {countryOptions && countryOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => { if (opt.name === pendingCountry.name) handleCountryCorrect(); else handleCountryWrong(); }}
                  style={{
                    padding: '16px', fontSize: '20px', fontWeight: 'bold', background: '#2563eb', color: 'white',
                    border: '2px solid #3b82f6', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 0 #1d4ed8', transition: 'all 0.1s'
                  }}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {phase === 'won' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', zIndex: 50, pointerEvents: 'auto' }}>
          <div style={{ fontSize: '80px' }}>🏆</div>
          <h1 style={{ color: '#facc15', fontSize: '52px', margin: '16px 0 8px', textShadow: '3px 3px 0 #000' }}>ZIEL ERREICHT!</h1>
          <p style={{ color: '#cbd5e1', fontSize: '24px', margin: '0 0 32px' }}>Zeit: {mins}:{secs}s</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={handleRestart} style={{ padding: '14px 32px', fontSize: '20px', fontWeight: 'bold', background: '#16a34a', color: 'white', border: '2px solid white', borderRadius: '10px', cursor: 'pointer' }}>Nochmal spielen</button>
            <button onClick={onExit} style={{ padding: '14px 32px', fontSize: '20px', fontWeight: 'bold', background: '#ef4444', color: 'white', border: '2px solid white', borderRadius: '10px', cursor: 'pointer' }}>Beenden</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
