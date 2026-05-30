import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GAMES = [
  {
    id: 'faska64',
    name: 'Faska 64',
    description: '3D Platformer — Springe durch bunte Welten und sammle Sterne!',
    emoji: '🏰',
    category: 'Action',
    gradient: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    path: '/game/faska64',
  },
  {
    id: 'zelda',
    name: 'Faska Zelda',
    description: 'Top-Down Adventure — Erkunde Dungeons mit dem Schwert!',
    emoji: '⚔️',
    category: 'Adventure',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    path: '/game/zelda',
  },
  {
    id: 'doom',
    name: 'Faska Doom',
    description: 'FPS Action — Kämpfe durch dunkle Korridore!',
    emoji: '🔫',
    category: 'Action',
    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    path: '/game/doom',
  },
  {
    id: 'kart',
    name: 'Faska Kart',
    description: '3D Rennen — Fahre gegen Gegner auf der Rennstrecke!',
    emoji: '🏎️',
    category: 'Racing',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    path: '/game/kart',
  },
  {
    id: 'epic-rpg',
    name: 'Faska RPG',
    description: 'Abenteuer mit Luna & Bruno — Kämpfe, sammle, level auf!',
    emoji: '🐰',
    category: 'Adventure',
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    path: '/game/epic-rpg',
    featured: true,
  },
  {
    id: 'space-odyssey',
    name: 'Space Odyssey',
    description: 'Erkunde den Weltraum — Besuche Planeten und sammle Sterne!',
    emoji: '🚀',
    category: 'Adventure',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    path: '/game/space-odyssey',
  },
  {
    id: 'snake',
    name: 'Faska Snake',
    description: 'Klassische Schlange in 3D — Wachse und überlebe!',
    emoji: '🐍',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    path: '/game/snake',
  },
  {
    id: 'moorhuhn',
    name: 'Faska Moorhuhn',
    description: 'Schießbude — Triff die Hühner für Punkte!',
    emoji: '🐔',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    path: '/game/moorhuhn',
  },
  {
    id: 'blocks',
    name: 'Faska Blocks',
    description: 'Tetris in 3D — Räume Reihen für Highscores!',
    emoji: '🧱',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    path: '/game/blocks',
  },
  {
    id: 'space-invaders',
    name: 'Space Invaders',
    description: 'Verteidige die Erde gegen Alien-Invasoren!',
    emoji: '👾',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    path: '/game/space-invaders',
  },
  {
    id: 'micro-machines',
    name: 'Micro Machines',
    description: 'Winzige Autos auf riesigen Tischen — Top-Down Racing!',
    emoji: '🚗',
    category: 'Racing',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    path: '/game/micro-machines',
  },
];

const CATEGORIES = ['Alle', 'Action', 'Adventure', 'Arcade', 'Racing'];

export default function GameEngineHub() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredGame, setHoveredGame] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredGames = GAMES.filter(game => {
    const matchCategory = selectedCategory === 'Alle' || game.category === selectedCategory;
    const matchSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0a1a',
      overflowY: 'auto', overflowX: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124, 58, 237, 0.12), transparent),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6, 182, 212, 0.08), transparent),
          radial-gradient(ellipse 40% 30% at 10% 60%, rgba(168, 85, 247, 0.06), transparent)
        `,
      }} />

      {/* Floating Particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#06b6d4' : '#a855f7',
              opacity: Math.random() * 0.4 + 0.1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-30px) translateX(15px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-40px) translateX(20px); }
          }
        `}</style>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <header style={{
          textAlign: 'center', marginBottom: 48,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(36px, 8vw, 64px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #a855f7)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}>
            FASKA FLOW
          </h1>
          <p style={{
            color: '#94a3b8', fontSize: 'clamp(14px, 2vw, 18px)',
            maxWidth: 500, margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Deine ultimative Gaming-Arcade — 11 Spiele mit Touchsteuerung & Learncade Education
          </p>

          {/* Characters */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #a855f7',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}>
              <img
                src="/assets/characters/luna-rabbit.png"
                alt="Luna the Rabbit"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #10b981',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              animation: 'pulse-glow 3s ease-in-out infinite',
              animationDelay: '1.5s',
            }}>
              <img
                src="/assets/characters/bruno-bear.png"
                alt="Bruno the Bear"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
          <p style={{
            color: '#64748b', fontSize: 13, marginTop: 12,
            fontStyle: 'italic',
          }}>
            🎨 Handgezeichnet mit Liebe ❤️
          </p>
        </header>

        {/* Search & Filters */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 16, marginBottom: 32,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
        }}>
          {/* Search */}
          <div style={{
            position: 'relative', width: '100%', maxWidth: 400,
          }}>
            <input
              type="text"
              placeholder="🔍 Spiel suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '12px 20px',
                background: 'rgba(18, 18, 42, 0.8)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: 14, color: '#e2e8f0',
                fontFamily: 'Inter, sans-serif', fontSize: 15,
                outline: 'none', transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(124, 58, 237, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(124, 58, 237, 0.2)'}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 10,
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#7c3aed' : 'rgba(42, 42, 90, 0.5)',
                  background: selectedCategory === cat
                    ? 'rgba(124, 58, 237, 0.2)'
                    : 'rgba(18, 18, 42, 0.5)',
                  color: selectedCategory === cat ? '#a855f7' : '#94a3b8',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.3s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Game Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {filteredGames.map((game, i) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => navigate(game.path)}
              onPointerEnter={() => setHoveredGame(game.id)}
              onPointerLeave={() => setHoveredGame(null)}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.3 + i * 0.05}s`,
                ...(game.featured ? {
                  gridColumn: 'span 2',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                } : {}),
              }}
            >
              {/* Gradient Header */}
              <div style={{
                height: 100, borderRadius: 14, marginBottom: 16,
                background: game.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 48, position: 'relative', overflow: 'hidden',
              }}>
                <span style={{
                  transform: hoveredGame === game.id ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  {game.emoji}
                </span>
                {game.featured && (
                  <span style={{
                    position: 'absolute', top: 8, right: 12,
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px', borderRadius: 8,
                    fontSize: 11, fontWeight: 700,
                    fontFamily: 'Outfit, sans-serif',
                    color: '#fbbf24',
                  }}>
                    ⭐ FEATURED
                  </span>
                )}
              </div>

              {/* Info */}
              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 20, fontWeight: 700,
                color: '#e2e8f0', marginBottom: 6,
              }}>
                {game.name}
              </h3>
              <p style={{
                color: '#94a3b8', fontSize: 13,
                lineHeight: 1.5, marginBottom: 12,
              }}>
                {game.description}
              </p>

              {/* Category Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.15)',
                  color: '#a855f7', fontSize: 11,
                  fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                }}>
                  {game.category}
                </span>
                <span style={{
                  fontSize: 12, color: '#64748b',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  📱 Touch Ready
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 60,
            color: '#64748b', fontFamily: 'Outfit, sans-serif',
          }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <p style={{ fontSize: 18 }}>Kein Spiel gefunden</p>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          textAlign: 'center', padding: '40px 0 20px',
          color: '#475569', fontSize: 13,
          fontFamily: 'Outfit, sans-serif',
        }}>
          <p>FASKA FLOW — Built with React Three Fiber & Rapier Physics</p>
          <p style={{ marginTop: 4 }}>🎮 {GAMES.length} Games | 📱 Mobile Ready | 🧮 Learncade Education</p>
        </footer>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 35px rgba(168, 85, 247, 0.6); }
        }
      `}</style>
    </div>
  );
}
