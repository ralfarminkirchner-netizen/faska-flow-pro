import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const seededUnit = (index, salt) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const PARTICLES = Array.from({ length: 30 }, (_, index) => ({
  width: seededUnit(index, 1) * 3 + 1,
  height: seededUnit(index, 2) * 3 + 1,
  opacity: seededUnit(index, 3) * 0.4 + 0.1,
  left: `${seededUnit(index, 4) * 100}%`,
  top: `${seededUnit(index, 5) * 100}%`,
  duration: seededUnit(index, 6) * 10 + 10,
  delay: seededUnit(index, 7) * 5,
}));

const GAMES = [
  {
    id: 'faska64',
    name: 'Faska 64 Abschluss: Lernpark',
    description: 'Stabile Learncade-Sammlung statt wackligem 3D-Experiment: Wort-Taxi, Lese-Labyrinth, Sortier-Dojo, Satzwerkstatt und Blitzduell mit Normalmodus, Lernmodus, Fachwahl, Wiederholung falscher Aufgaben, Zugbonus und Mastery-Fortschritt.',
    emoji: '🏰',
    category: 'Education',
    gradient: 'linear-gradient(135deg, #0891b2, #16a34a)',
    path: '/game/faska64',
    featured: true,
  },
  {
    id: 'zelda',
    name: 'Faska Zelda Pro',
    description: 'Godot-4-16-Bit-Top-Down-Adventure mit normalem Quest-Modus, Wegen, Ruinen, Truhen, Schluesseln, verriegelten Gates, Schwert, Schild, Dash, Bomben, Torwaechter, Sternentor, Touchsteuerung und zuschaltbaren Learncade-Schreinen!',
    emoji: '⚔️',
    category: 'Adventure',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    path: '/game/zelda',
    engine: 'Godot 4',
  },
  {
    id: 'temple-quest',
    name: 'Faska Temple Quest Pro',
    description: 'Dungeon-Adventure mit Werkzeug-Meisterung, aktiven Fallen, Truhen, bombbaren Geheimwaenden, Raumpruefungen, Siegel-Tueren, Hookshot-Raetseln, Bossphasen, Missionen und Learncade-Altaren!',
    emoji: '🗝️',
    category: 'Adventure',
    gradient: 'linear-gradient(135deg, #0f766e, #facc15)',
    path: '/game/temple-quest',
  },
  {
    id: 'tactics',
    name: 'Faska Tactics Pro',
    description: 'Runden-Taktik mit Missionszielen, Kartenzielen, Fallen, Deckung, Hoehenvorteil, Flanken, Status-Effekten, Klassen-Fokus-Skills, Overwatch, Boss-Verstaerkung, Undo und Learncade-Zonen!',
    emoji: '♟️',
    category: 'Strategy',
    gradient: 'linear-gradient(135deg, #1d4ed8, #14b8a6)',
    path: '/game/tactics',
  },
  {
    id: 'pinball',
    name: 'Faska Pinball Pro',
    description: 'Flipper-Arcade mit Skill-Shot, Dropbank, Ramp-/Orbit-Shots, Magnet-Lock, Wizard-Mode, Nudge/Tilt-Risiko, Jackpot, Multiball, Missionen und Learncade-Targets!',
    emoji: '🎱',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #0ea5e9, #a855f7)',
    path: '/game/pinball',
    engine: 'Godot 4',
  },
  {
    id: 'bomb-maze',
    name: 'Faska Bomb Maze Pro',
    description: 'Godot-4-Grid-Bomber nach Bomberman-Prinzip mit Kettenreaktionen, sichtbarer Blast-Vorschau, Jaeger-/Guard-/Runner-Gegnern, Kisten- und Schluesselzielen, Powerups, Zeitdruck, Touchsteuerung und Learncade fuer Wortarten, Mathe, Satzbau, Komposita und Englisch!',
    emoji: '💣',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #f97316, #7c3aed)',
    path: '/game/bomb-maze',
    engine: 'Godot 4',
  },
  {
    id: 'trick-park',
    name: 'Faska Trick Park Pro',
    description: 'Skate-Combo-Spiel mit Park-Lines, Boost-Pads, beweglichen Hazards, Bail-Risiko, Special-Flow, Grinds, Manuals, Stars, erweiterten Missionen und Learncade-Gates!',
    emoji: '🛹',
    category: 'Sports',
    gradient: 'linear-gradient(135deg, #22c55e, #facc15)',
    path: '/game/trick-park',
  },
  {
    id: 'doom',
    name: 'Faska Doom Pro',
    description: 'Godot-4-Raycaster-Shooter mit Normalmodus zuerst, pseudo-3D-Korridoren, Waffenfeedback, Reaktor-Keys, Gegnerwellen, Runner/Brutes/Elite-Gegnern, Ammo/Armor, Granaten, Dash, Accuracy-/Alarmwertung, Exit-Ziel, Minimap, Touch-Move/Look, Fehler-Wiederholung und optionalen Learncade-Terminals fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch!',
    emoji: '🔫',
    category: 'Action',
    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    path: '/game/doom',
    engine: 'Godot 4',
  },
  {
    id: 'arsenal',
    name: 'Faska Arsenal Pro',
    description: 'Godot-4-Arena-Shooter nach Quake/Unreal-Prinzip mit schnellem Strafing, Pulse/Scatter/Rail/Rocket, Snipern, Bosswellen, Rocket-Impulse, Jump-Pads, Mega-/Quad-Pickups, Kontrollpunkten, Touchsteuerung und Learncade-Saeulen fuer Wortarten, Lesen, Satzbau, Komposita, Mathe, Englisch und Sachkunde mit Fehler-Wiederholung!',
    emoji: '⚡',
    category: 'Arena',
    gradient: 'linear-gradient(135deg, #2563eb, #facc15)',
    path: '/game/arsenal',
    engine: 'Godot 4',
  },
  {
    id: 'descent',
    name: 'Faska Descent Pro',
    description: 'Godot-4-6DOF-Tunnel-Shooter nach Descent/Star-Fox-Prinzip mit freier X/Y-Fluglage, Roll-Gefuehl, Pulse Laser, Scatter, Rail Lance, Lock-on-Raketen, Shield-Pulse, Flow-Ringen, Bosskern, Fehler-Wiederholung, Touchsteuerung und Learncade-Gates fuer Deutsch, Mathe, Satzbau, Lesen, Komposita, Englisch und Sachkunde!',
    emoji: '🛸',
    category: 'Shooter',
    gradient: 'linear-gradient(135deg, #0f172a, #0891b2)',
    path: '/game/descent',
    engine: 'Godot 4',
  },
  {
    id: 'sky-rail',
    name: 'Faska Sky Rail Pro',
    description: 'Godot-4-On-Rails-Shooter nach Star-Fox-/Panzer-Dragoon-Prinzip mit Rail-Flug, Pulsefire, geladenen Lock-on-Salven, Nova-Burst, Wingman, Apex-Ringen, Supply-Pods, Minen, Turrets, Sturmtraeger-Bossphasen, Touchsteuerung und Learncade-Gates fuer Wortarten, Lesen, Satzbau, Komposita, Mathe, Englisch und Sachkunde mit Fehler-Wiederholung!',
    emoji: '🛩️',
    category: 'Shooter',
    gradient: 'linear-gradient(135deg, #0369a1, #22d3ee)',
    path: '/game/sky-rail',
    engine: 'Godot 4',
  },
  {
    id: 'parkour',
    name: 'Faska Parkour Pro',
    description: "Godot-4-Jump'n'Run mit Normalmodus zuerst, Kamera, Plattformkollision, Coyote-Jump, Double-Jump, Dash-Charges, Wall-Kick/Wall-Slide, Grapple-Punkten, Gegner-Stomps, Runen, Checkpoints, Flow-Multiplikator, Touchsteuerung, Portalziel und optionalen Learncade-Gates fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch mit Fehler-Wiederholung!",
    emoji: '🕹️',
    category: 'Platformer',
    gradient: 'linear-gradient(135deg, #0ea5e9, #22c55e)',
    path: '/game/parkour',
    engine: 'Godot 4',
  },
  {
    id: 'gadget-quest',
    name: 'Faska Gadget Quest Pro',
    description: 'Godot-4-Action-Platformer nach Ratchet-&-Astrobot-Prinzip mit Normalmodus zuerst, Stomp-Angriffen, Dash-Hits, Wrench-Chain, Blaster, Hoverboots, Grapple-Ankern, Upgrade-Stationen, Kisten, Bolts, Energie, Combo-Multiplikator, dreiphasigem Bossbot, Sternentor, Touchsteuerung und optionalen Learncade-Terminals fuer Wortarten, Lesen, Satzbau, Komposita, Mathe, Englisch und Sachkunde mit Fehler-Wiederholung!',
    emoji: '🛠️',
    category: 'Platformer',
    gradient: 'linear-gradient(135deg, #2563eb, #f97316)',
    path: '/game/gadget-quest',
    engine: 'Godot 4',
  },
  {
    id: 'fighter',
    name: 'Faska Fighter Pro',
    description: 'Godot-4-1v1-Fighter mit Normalmodus zuerst, Best-of-3-Runden, Blocken, Guard-Breaks, Counter-Hits, Low/Mid-Mixups, Jab/Kick/Low/Throw/Super, Parry-Fenster, Throw-Tech, Knockdowns, wechselnden CPU-Stilen, Hitstun, Pushback, Supermeter, Touchsteuerung und zuschaltbaren Learncade-Kristallen!',
    emoji: '🥊',
    category: 'Fighting',
    gradient: 'linear-gradient(135deg, #e11d48, #7c2d12)',
    path: '/game/fighter',
    engine: 'Godot 4',
  },
  {
    id: 'brawler',
    name: 'Faska Brawler Pro',
    description: 'Godot-4-2.5D-Beat-em-up nach Final-Fight-/Streets-of-Rage-Prinzip mit Lanes, sichtbaren Figuren, Kombos, Guard/Parry, Wuerfen, Waffen, zerstoerbaren Props, Fernkampf-/Medic-/Brute-Gegnern, Bosswellen, Touchsteuerung und Learncade-Antworttoren fuer Wortarten, Lesen, Satzbau, Komposita, Mathe, Englisch und Sachkunde mit Fehler-Wiederholung!',
    emoji: '👊',
    category: 'Fighting',
    gradient: 'linear-gradient(135deg, #e11d48, #facc15)',
    path: '/game/brawler',
    engine: 'Godot 4',
  },
  {
    id: 'souls',
    name: 'Faska Souls Pro',
    description: 'Godot-4-Soulslike-Bossarena mit Normalmodus zuerst, Light/Heavy-Angriffen, Schildblock, Rollen-Iframes, Parry-Fenster, Riposte, Rally-Heal, Heilflaschen, Minions, Slash/Thrust/Slam-Telegraphs, Boss-Stagger, Phasenwechsel, Touchsteuerung und zuschaltbaren Learncade-Runen!',
    emoji: '🛡️',
    category: 'Soulslike',
    gradient: 'linear-gradient(135deg, #111827, #991b1b)',
    path: '/game/souls',
    engine: 'Godot 4',
  },
  {
    id: 'night-hunt',
    name: 'Faska Night Hunt Pro',
    description: 'Godot-4-Nachtjagd nach Bloodborne-Prinzip mit Roll-Iframes, Rally-Heal, Blutfieber, Trickwaffe, Pistolen-Parry, Visceral-Fenstern, Fokus-Zauber, knappen Blood Vials, Kugel-Pickups, Bell-/Gunner-/Beast-Gegnern, Boss jede 4. Welle, Touchsteuerung und Learncade-Runen fuer Wortarten, Lesen, Satzbau, Komposita, Mathe, Englisch und Sachkunde mit Fehler-Wiederholung!',
    emoji: '🌙',
    category: 'Soulslike',
    gradient: 'linear-gradient(135deg, #0f172a, #7c3aed)',
    path: '/game/night-hunt',
    engine: 'Godot 4',
  },
  {
    id: 'mansion',
    name: 'Faska Mansion Pro',
    description: 'Godot-4-Top-Down-Survival-Horror nach Resident-Evil-Prinzip mit Villa, Safe-Rooms, knapper Munition, Reload-Panik, Zielpfeil, Minimap, Gegnerdruck, Barrikaden, Fallen, Schluesseln, Beweisen, Exit-Ziel, Touchsteuerung und Learncade-Siegeln fuer Wortarten, Lesen, Satzbau, Komposita, Mathe und Englisch mit Fehler-Wiederholung!',
    emoji: '🔦',
    category: 'Horror',
    gradient: 'linear-gradient(135deg, #111827, #581c87)',
    path: '/game/mansion',
    engine: 'Godot 4',
  },
  {
    id: 'kart',
    name: 'Faska Kart Pro',
    description: 'Godot-4-Arcade-Kart nach Mario-Kart-Prinzip mit Rundkurs, Drift-Mini-Turbo, Rivalen, Itemboxen, Boost, Rocket, Shield, Oelspur, Checkpoints, Rundenzeit, Fehler-Wiederholung, Touchsteuerung und Learncade-Gates fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch!',
    emoji: '🏎️',
    category: 'Racing',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    path: '/game/kart',
    engine: 'Godot 4',
  },
  {
    id: 'rally',
    name: 'Faska Rally Pro',
    description: 'Godot-4-Pseudo-3D-Rally nach Sega-Rally/OutRun-Prinzip mit grosser Fullscreen-Streckenprojektion, Driftwertung, Near-Miss-Boni, Ueberholungen, Boost-Pads, Oel/Matsch/Pylonen, Sektor-Splits, Touchsteuerung und Learncade-Antwortspuren fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch!',
    emoji: '🏁',
    category: 'Racing',
    gradient: 'linear-gradient(135deg, #0ea5e9, #facc15)',
    path: '/game/rally',
    engine: 'Godot 4',
  },
  {
    id: 'taxi-rush',
    name: 'Faska Taxi Rush Pro',
    description: 'Godot-4-Crazy-Taxi-Top-Down mit Drift-Boost, Verkehr, Minimap, Wort-Fahrgaesten, Express-/Vorsicht-/Linie-/Stunt-Vertraegen, Stadt-Landmarken, falschen Ablieferungen, Wiederholungsqueue, Route-Pfeil, Touchsteuerung sowie Learncade fuer Wortarten, Satzstellen, Lese-Orte, Mathe und Englisch!',
    emoji: '🚕',
    category: 'Racing',
    gradient: 'linear-gradient(135deg, #facc15, #f97316)',
    path: '/game/taxi-rush',
    engine: 'Godot 4',
  },
  {
    id: 'epic-rpg',
    name: 'Faska Bruno & Luna Quest Pro',
    description: 'Top-Down-Action-RPG mit Bruno/Luna-Wechsel, Dash, Relikt-Upgrades, Energie-Spezialfaehigkeiten, Boss-Phasen, Minion-Wellen, feindlicher Magie, Beute, Missionen und Learncade-Schreinen!',
    emoji: '🐰',
    category: 'Adventure',
    gradient: 'linear-gradient(135deg, #22c55e, #a855f7)',
    path: '/game/epic-rpg',
    featured: true,
  },
  {
    id: 'space-odyssey',
    name: 'Faska Star Odyssey Pro',
    description: 'Freier Space-Run mit Flugphysik, Planetenroute, Rifts, Wurmloechern, EMP-Pulse, Capital-Ship, Drohnen, Asteroiden, Missionszielen und Learncade-Beacons!',
    emoji: '🚀',
    category: 'Adventure',
    gradient: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
    path: '/game/space-odyssey',
  },
  {
    id: 'snake',
    name: 'Faska Snake Arena Pro',
    description: 'Arena-Snake mit Dash-Linien, Pulse-Welle, Rival-Schlangen, Guardian-Boss, Schockfeldern, Missionen, Magnet-Futter und faecherflexiblen Learncade-Antworten!',
    emoji: '🐍',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    path: '/game/snake',
  },
  {
    id: 'moorhuhn',
    name: 'Faska Target Rush',
    description: 'Zielspiel mit Waffenwechsel, Powerschuss, Bosswellen, Schildzielen, Combo-Schuesse, Munition, Fever, Missionen und Learncade-Antwortziele!',
    emoji: '🎯',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    path: '/game/moorhuhn',
  },
  {
    id: 'blocks',
    name: 'Faska Blocks Pro',
    description: 'Falling-Blocks-Pro mit Hold, Ghost, Combos, Bomb-/Laser-/Prisma-Steinen, Board-Blast, Garbage-Druck, Missionen und Learncade-Antwortzonen!',
    emoji: '🧱',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    path: '/game/blocks',
  },
  {
    id: 'space-invaders',
    name: 'Faska Invaders Pro',
    description: 'Godot-4-Formation-Shooter nach Space-Invaders-/Galaga-Prinzip mit echten Wellen, Deckungsbarrieren, Elite-Invadern, Bossmutterschiff, Drohnen-/Wide-/Shield-Powerups, Charge-Beam, Heat-Management, Dash, Overdrive, Touchsteuerung und Learncade-Antwortzielen fuer Wortarten, Lesen, Satzbau, Komposita, Mathe, Englisch und Sachkunde mit Fehler-Wiederholung!',
    emoji: '👾',
    category: 'Arcade',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    path: '/game/space-invaders',
    engine: 'Godot 4',
  },
  {
    id: 'micro-machines',
    name: 'Faska Micro Rally Pro',
    description: 'Top-Down-Mini-Racer mit Drift-Boni, Windschatten, Items, Turbo-Pads, Boxenstopps, Gegnern, Powerups, Missionen und Learncade-Gates!',
    emoji: '🏎️',
    category: 'Racing',
    gradient: 'linear-gradient(135deg, #f97316, #0ea5e9)',
    path: '/game/micro-machines',
  },
  {
    id: 'math-defender',
    name: 'Faska Math Defender',
    description: 'NEU: Rette die Basis! Tippe das richtige Mathe-Ergebnis ein, um Orbitallaser auf herabfallende Asteroiden abzufeuern.',
    emoji: '☄️',
    category: 'Education',
    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    path: '/game/math-defender',
    featured: true,
  },
  {
    id: 'type-hero',
    name: 'Faska Type Hero Pro',
    description: 'Godot-4-Word-Blaster nach Typing-/Math-Blaster-Prinzip: fallende Wortkarten tippen, adaptive Wortarten-, Mathe- und Lesephasen, Fehler-Wiederholung, Mastery-Anzeige, Focus-Burst, Prefix-Lock-on, Touch-Tastatur und sichtbares Lernziel!',
    emoji: '⌨️',
    category: 'Education',
    gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
    path: '/game/type-hero',
    featured: true,
    engine: 'Godot 4',
  },
  {
    id: 'geo-runner',
    name: 'Faska Geo Runner',
    description: 'NEU: 3D-Endless-Runner! Laufe durch das korrekte Tor mit der passenden Flagge zur gesuchten Hauptstadt oder dem Land.',
    emoji: '🌍',
    category: 'Education',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    path: '/game/geo-runner',
    featured: true,
  },
];

const CATEGORIES = ['Alle', 'Education', 'Action', 'Adventure', 'Arcade', 'Racing', 'Shooter', 'Arena', 'Platformer', 'Fighting', 'Soulslike', 'Horror', 'Strategy', 'Sports'];

export default function GameEngineHub() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredGame, setHoveredGame] = useState(null);
  const mounted = true;

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
        {PARTICLES.map((particle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: particle.width,
              height: particle.height,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#06b6d4' : '#a855f7',
              opacity: particle.opacity,
              left: particle.left,
              top: particle.top,
              animation: `float-particle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
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
            letterSpacing: 0,
          }}>
            FASKA FLOW
          </h1>
          <p style={{
            color: '#94a3b8', fontSize: 'clamp(14px, 2vw, 18px)',
            maxWidth: 500, margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Deine ultimative Gaming-Arcade — 28 Spiele mit Touchsteuerung & Learncade Education
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
                  {game.engine ? `⚙️ ${game.engine}` : '📱 Touch Ready'}
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
          <p>FASKA FLOW — React Hub, Godot Web-Spielslots, React Three Fiber & Rapier</p>
          <p style={{ marginTop: 4 }}>🎮 {GAMES.length} Games | ⚙️ Godot-Migration gestartet | 🧮 Learncade Education</p>
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
