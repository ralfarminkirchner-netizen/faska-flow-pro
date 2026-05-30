/**
 * UIOverlay — Standard HUD overlay for all FASKA Flow games.
 * Shows score, lives, level, pause, and exit controls.
 *
 * Props:
 *   score, lives, level      — Game state
 *   isPaused, isGameOver     — Game state flags
 *   onPause, onRestart, onExit — Callbacks
 *   gameName                 — Display name
 *   children                 — Extra HUD elements
 *   showLearncadeScore       — Show quiz score badge
 *   quizScore                — Learncade quiz points
 */
export default function UIOverlay({
  score = 0,
  lives = 3,
  level = 1,
  isPaused = false,
  isGameOver = false,
  onPause,
  onRestart,
  onExit,
  gameName = 'Game',
  children,
  showLearncadeScore = false,
  quizScore = 0,
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {/* Top Bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '12px 16px', pointerEvents: 'auto',
      }}>
        {/* Left — Score & Lives */}
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            background: 'rgba(10, 10, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12, padding: '8px 16px',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            fontFamily: 'Outfit, sans-serif',
          }}>
            <span style={{ color: '#f59e0b', fontSize: 14, fontWeight: 700 }}>
              ⭐ {score.toLocaleString()}
            </span>
          </div>
          <div style={{
            background: 'rgba(10, 10, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12, padding: '8px 12px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: 16,
          }}>
            {'❤️'.repeat(Math.max(0, lives))}
            {'🖤'.repeat(Math.max(0, 3 - lives))}
          </div>
          {level > 1 && (
            <div style={{
              background: 'rgba(10, 10, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12, padding: '8px 12px',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              fontFamily: 'Outfit, sans-serif',
              color: '#06b6d4', fontSize: 13, fontWeight: 600,
            }}>
              Lv.{level}
            </div>
          )}
          {showLearncadeScore && quizScore > 0 && (
            <div style={{
              background: 'rgba(10, 10, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12, padding: '8px 12px',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              fontFamily: 'Outfit, sans-serif',
              color: '#a855f7', fontSize: 13, fontWeight: 600,
            }}>
              🧮 {quizScore}
            </div>
          )}
        </div>

        {/* Right — Pause & Exit */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onPause}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(10, 10, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              color: '#e2e8f0', fontSize: 18,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isPaused ? '▶️' : '⏸'}
          </button>
          <button
            onClick={onExit}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(10, 10, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444', fontSize: 16,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Extra HUD elements */}
      {children}

      {/* Pause Overlay */}
      {isPaused && !isGameOver && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5, 5, 16, 0.8)',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'auto', flexDirection: 'column', gap: 20,
        }}>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 36,
            fontWeight: 800, color: '#e2e8f0',
            textShadow: '0 0 30px rgba(124, 58, 237, 0.5)',
          }}>
            ⏸ Pausiert
          </h2>
          <button onClick={onPause} className="btn-primary" style={{ pointerEvents: 'auto' }}>
            ▶️ Weiter
          </button>
        </div>
      )}

      {/* Game Over Overlay */}
      {isGameOver && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5, 5, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          pointerEvents: 'auto', flexDirection: 'column', gap: 20,
        }}>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 42,
            fontWeight: 800, color: '#ef4444',
            textShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
          }}>
            Game Over
          </h2>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 24,
            color: '#f59e0b', fontWeight: 700,
          }}>
            ⭐ {score.toLocaleString()} Punkte
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onRestart} className="btn-primary">
              🔄 Nochmal
            </button>
            <button
              onClick={onExit}
              style={{
                padding: '12px 28px', borderRadius: 12,
                background: 'rgba(42, 42, 90, 0.5)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                color: '#e2e8f0', fontFamily: 'Outfit, sans-serif',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              🏠 Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
