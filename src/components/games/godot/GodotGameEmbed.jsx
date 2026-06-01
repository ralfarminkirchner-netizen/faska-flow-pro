import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GodotGameEmbed({
  title,
  src,
  controls = 'WASD/Pfeile bewegen · J Angriff · K Block · Space Rolle · L Learncade',
}) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const frameSrc = useMemo(() => `${src}?run=${frameKey}`, [src, frameKey]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#020617',
        overflow: 'hidden',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            display: 'grid',
            placeItems: 'center',
            background: 'radial-gradient(circle at 50% 35%, #111827, #020617 62%)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 54,
                height: 54,
                margin: '0 auto 18px',
                border: '4px solid rgba(148,163,184,.22)',
                borderTopColor: '#facc15',
                borderRadius: '50%',
                animation: 'godot-spin .7s linear infinite',
              }}
            />
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1 }}>{title}</div>
            <div style={{ marginTop: 7, color: '#94a3b8', fontSize: 13 }}>Godot 4 Web-Export wird geladen</div>
          </div>
        </div>
      )}

      <iframe
        key={frameKey}
        title={title}
        src={frameSrc}
        allow="autoplay; fullscreen; gamepad"
        onLoad={() => setLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
          background: '#020617',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          pointerEvents: 'none',
        }}
      >
        <div />

        <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
          <button
            type="button"
            aria-label="Neustart"
            title="Neustart"
            onClick={() => {
              setLoaded(false);
              setFrameKey((value) => value + 1);
            }}
            style={buttonStyle}
          >
            ↻
          </button>
          <button type="button" aria-label="Zurueck" title="Zurueck" onClick={() => navigate('/')} style={buttonStyle}>
            ←
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 10,
          zIndex: 4,
          maxWidth: 'calc(100vw - 24px)',
          transform: 'translateX(-50%)',
          padding: '6px 9px',
          background: 'rgba(2, 6, 23, .68)',
          border: '1px solid rgba(148, 163, 184, .22)',
          color: '#cbd5e1',
          fontSize: 10,
          fontWeight: 800,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
        }}
      >
        {controls}
      </div>

      <style>{`
        @keyframes godot-spin { to { transform: rotate(360deg); } }
        @media (max-width: 760px) {
          iframe { height: 100dvh; }
        }
      `}</style>
    </div>
  );
}

const buttonStyle = {
  width: 42,
  height: 42,
  background: 'rgba(15, 23, 42, .84)',
  color: '#f8fafc',
  border: '1px solid rgba(148, 163, 184, .28)',
  boxShadow: '4px 4px 0 rgba(0,0,0,.5)',
  fontSize: 22,
  fontWeight: 900,
  cursor: 'pointer',
};
