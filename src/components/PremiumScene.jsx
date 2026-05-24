import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const sceneConfig = {
  language: {
    bg: ["#fff7ed", "#fef3c7", "#fde68a"],
    ink: "#92400e",
    accent: "#f97316",
    soft: "#fed7aa",
    title: "Wortatelier",
    motifs: ["A", "B", "SCH", "RE"],
  },
  math: {
    bg: ["#eff6ff", "#dbeafe", "#bfdbfe"],
    ink: "#1d4ed8",
    accent: "#0ea5e9",
    soft: "#bae6fd",
    title: "Zahlenwerkstatt",
    motifs: ["3", "8", "+", "="],
  },
  world: {
    bg: ["#ecfdf5", "#d1fae5", "#a7f3d0"],
    ink: "#047857",
    accent: "#10b981",
    soft: "#bbf7d0",
    title: "Forscherpfad",
    motifs: ["✦", "☁", "↟", "◌"],
  },
  heart: {
    bg: ["#fdf2f8", "#fae8ff", "#fce7f3"],
    ink: "#a21caf",
    accent: "#ec4899",
    soft: "#fbcfe8",
    title: "Herzgarten",
    motifs: ["♥", "↔", "✓", "…"],
  },
  music: {
    bg: ["#fff1f2", "#ffe4e6", "#fce7f3"],
    ink: "#be123c",
    accent: "#d946ef",
    soft: "#fbcfe8",
    title: "Klangbühne",
    motifs: ["♪", "♫", "♬", "𝄞"],
  },
  default: {
    bg: ["#f8fafc", "#f1f5f9", "#e2e8f0"],
    ink: "#334155",
    accent: "#8b5cf6",
    soft: "#ddd6fe",
    title: "Spielwelt",
    motifs: ["✦", "●", "◆", "○"],
  },
};

const modeProps = {
  blitz: { icon: "⚡", path: "M40 138 C95 84 146 110 208 64 C265 22 318 56 374 30" },
  schatz: { icon: "🗺️", path: "M42 128 C92 160 142 94 196 126 C252 160 292 70 376 104" },
  wirbel: { icon: "🌀", path: "M70 102 C112 58 190 60 212 106 C234 154 152 178 120 134 C94 98 142 78 172 100" },
  meister: { icon: "🏆", path: "M52 130 C106 96 128 46 208 82 C274 112 300 56 370 74" },
  expedition: { icon: "🧭", path: "M34 148 C88 132 104 78 160 94 C216 112 230 50 286 66 C330 78 338 124 384 102" },
  atelier: { icon: "🎨", path: "M54 92 C116 42 180 158 236 94 C288 36 322 128 382 76" },
  puzzle: { icon: "🧩", path: "M42 118 C90 70 134 152 184 108 C236 64 292 146 370 76" },
  sternenlauf: { icon: "⭐", path: "M44 150 C92 90 142 92 190 136 C240 182 292 86 374 52" },
};

export default function PremiumScene({ scene = "default", mode = "blitz", compact = false }) {
  const shouldReduceMotion = useReducedMotion();
  const cfg = sceneConfig[scene] || sceneConfig.default;
  const modeCfg = modeProps[mode] || modeProps.blitz;
  const [top, middle, bottom] = cfg.bg;

  return (
    <div className={`relative overflow-hidden rounded-[38px] border-4 border-white shadow-xl ${compact ? "h-48" : "h-64 md:h-72"}`}>
      <svg viewBox="0 0 420 240" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={`premium-scene-${scene}-${mode}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={top} />
            <stop offset="54%" stopColor={middle} />
            <stop offset="100%" stopColor={bottom} />
          </linearGradient>
          <filter id={`premium-paper-${scene}-${mode}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
        </defs>

        <rect width="420" height="240" fill={`url(#premium-scene-${scene}-${mode})`} />
        <path d="M-20 194 C76 160 132 202 222 172 C302 146 360 180 444 146 L444 260 L-20 260 Z" fill="rgba(255,255,255,.58)" />
        <path d="M-10 72 C68 24 136 80 220 38 C308 -6 360 46 438 18" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="24" strokeLinecap="round" />
        <path d={modeCfg.path} fill="none" stroke="rgba(255,255,255,.88)" strokeWidth="12" strokeLinecap="round" strokeDasharray="1 22" />
        <path d={modeCfg.path} fill="none" stroke={cfg.ink} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="10 15" opacity=".32" />

        {[0, 1, 2, 3].map((item) => (
          <g key={item} transform={`translate(${44 + item * 94} ${52 + (item % 2) * 78}) rotate(${item % 2 ? 8 : -7})`}>
            <rect x="0" y="0" width="70" height="58" rx="18" fill="rgba(255,255,255,.72)" stroke="rgba(255,255,255,.9)" strokeWidth="4" />
            <circle cx="17" cy="18" r="8" fill={cfg.soft} />
            <text x="35" y="35" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="25" fontWeight="700" fill={cfg.ink}>
              {cfg.motifs[item]}
            </text>
          </g>
        ))}
      </svg>

      <MotionDiv
        className="absolute left-[9%] top-[17%] w-24 h-24 md:w-28 md:h-28 rounded-[34px] bg-white/80 border-4 border-white shadow-xl flex items-center justify-center text-5xl"
        animate={shouldReduceMotion ? { y: 0, rotate: -3 } : { y: [0, -10, 0], rotate: [-3, 4, -3] }}
        transition={{ duration: 5, repeat: shouldReduceMotion ? 0 : 2, ease: "easeInOut" }}
      >
        {modeCfg.icon}
      </MotionDiv>

      <MotionDiv
        className="absolute right-[8%] top-[18%] w-28 h-20 rounded-[32px] bg-white/75 border-4 border-white shadow-lg flex items-center justify-center"
        animate={shouldReduceMotion ? { y: 0, rotate: 4 } : { y: [0, 8, 0], rotate: [4, -3, 4] }}
        transition={{ duration: 6, repeat: shouldReduceMotion ? 0 : 2, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 110 74" className="w-24 h-16" aria-hidden>
          <path d="M14 54 C26 18 48 46 60 20 C76 -10 96 26 94 54" fill="none" stroke={cfg.accent} strokeWidth="7" strokeLinecap="round" />
          <circle cx="23" cy="54" r="6" fill={cfg.ink} opacity=".75" />
          <circle cx="56" cy="27" r="6" fill={cfg.ink} opacity=".75" />
          <circle cx="91" cy="54" r="6" fill={cfg.ink} opacity=".75" />
        </svg>
      </MotionDiv>

      <div className="absolute left-6 right-6 bottom-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-none">{cfg.title}</p>
        </div>
        <div className="hidden sm:flex gap-2">
          {[0, 1, 2].map((item) => (
            <MotionSpan
              key={item}
              className="w-9 h-9 rounded-full bg-white/75 border-2 border-white shadow-md flex items-center justify-center font-hand text-xl font-bold"
              style={{ color: cfg.ink }}
              animate={shouldReduceMotion ? { y: 0, scale: 1 } : { y: [0, -7, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4 + item * 0.35, repeat: shouldReduceMotion ? 0 : 2, ease: "easeInOut" }}
            >
              {cfg.motifs[item]}
            </MotionSpan>
          ))}
        </div>
      </div>
    </div>
  );
}
