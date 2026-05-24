import { useId } from "react";
import { motion } from "framer-motion";

const PALETTE = {
  ink: "#3e3c38",
  line: "#6b5f55",
  paper: "#fffaf0",
  paperWarm: "#fff4dc",
  amber: "#f59e0b",
  amberSoft: "#fde68a",
  rose: "#f9a8d4",
  roseDeep: "#db2777",
  sky: "#7dd3fc",
  skyDeep: "#0284c7",
  green: "#86efac",
  greenDeep: "#16a34a",
  violet: "#c4b5fd",
  violetDeep: "#7c3aed",
  clay: "#d97706",
  coral: "#fb7185",
};

const PREMIUM_ILLUSTRATION_VARIANTS = [
  "hero",
  "language",
  "numbers",
  "world",
  "harmony",
  "music",
];

const SUBJECT_ACCENTS = {
  hero: [PALETTE.violet, PALETTE.rose, PALETTE.amberSoft],
  language: [PALETTE.amberSoft, PALETTE.rose, PALETTE.sky],
  numbers: [PALETTE.sky, PALETTE.amberSoft, PALETTE.violet],
  world: [PALETTE.green, PALETTE.sky, PALETTE.amberSoft],
  harmony: [PALETTE.violet, PALETTE.rose, PALETTE.green],
  music: [PALETTE.rose, PALETTE.amberSoft, PALETTE.sky],
};

function makeId(raw) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "");
}

function Defs({ id, accents }) {
  const [a, b, c] = accents;

  return (
    <defs>
      <filter id={`${id}-paper`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="8" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.12" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" mode="multiply" />
      </filter>
      <filter id={`${id}-bleed`} x="-16%" y="-16%" width="132%" height="132%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" />
      </filter>
      <filter id={`${id}-shadow`} x="-24%" y="-24%" width="148%" height="148%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#6b5f55" floodOpacity="0.13" />
      </filter>
      <radialGradient id={`${id}-wash-a`} cx="42%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
        <stop offset="48%" stopColor={a} stopOpacity="0.62" />
        <stop offset="100%" stopColor={b} stopOpacity="0.28" />
      </radialGradient>
      <radialGradient id={`${id}-wash-b`} cx="58%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
        <stop offset="58%" stopColor={c} stopOpacity="0.58" />
        <stop offset="100%" stopColor={a} stopOpacity="0.22" />
      </radialGradient>
      <linearGradient id={`${id}-thread`} x1="65" y1="46" x2="285" y2="230">
        <stop stopColor={PALETTE.roseDeep} />
        <stop offset="0.42" stopColor={PALETTE.violetDeep} />
        <stop offset="1" stopColor={PALETTE.skyDeep} />
      </linearGradient>
    </defs>
  );
}

function ScribbleOval({ cx, cy, rx, ry, fill, stroke = PALETTE.line, opacity = 1 }) {
  return (
    <g filter="url(#none)" opacity={opacity}>
      <path
        d={`M${cx - rx + 4} ${cy + 3} C${cx - rx - 7} ${cy - ry + 14} ${cx - 22} ${cy - ry - 8} ${cx + 4} ${cy - ry + 2} C${cx + rx + 26} ${cy - ry + 7} ${cx + rx + 10} ${cy + ry - 9} ${cx + 10} ${cy + ry + 3} C${cx - 24} ${cy + ry + 11} ${cx - rx - 12} ${cy + ry - 10} ${cx - rx + 4} ${cy + 3} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${cx - rx + 11} ${cy - 5} C${cx - 34} ${cy - ry - 17} ${cx + 31} ${cy - ry - 11} ${cx + rx - 8} ${cy + 2} C${cx + 35} ${cy + ry + 14} ${cx - 40} ${cy + ry + 9} ${cx - rx + 11} ${cy - 5} Z`}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.42"
      />
    </g>
  );
}

function PaperCard({ id }) {
  return (
    <g filter={`url(#${id}-shadow)`}>
      <path
        d="M54 52 C92 35 234 32 292 54 C313 95 314 205 290 246 C228 270 88 266 48 244 C30 184 31 94 54 52 Z"
        fill={PALETTE.paper}
        stroke="#eadfca"
        strokeWidth="3"
        filter={`url(#${id}-paper)`}
      />
      <path
        d="M69 70 C114 57 225 55 274 72 C288 111 286 194 273 229 C216 244 101 243 68 226 C53 172 54 110 69 70 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.7"
      />
    </g>
  );
}

function Plant({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 34 C1 20 1 8 0 -4" stroke={PALETTE.greenDeep} strokeWidth="3" fill="none" />
      <path d="M0 17 C-17 8 -20 -8 -5 -14 C9 -9 11 6 0 17 Z" fill={PALETTE.green} stroke={PALETTE.greenDeep} strokeWidth="2" />
      <path d="M1 22 C18 9 25 -7 10 -14 C-4 -7 -7 9 1 22 Z" fill="#6ee7b7" stroke={PALETTE.greenDeep} strokeWidth="2" />
      <path d="M0 9 C-7 3 -11 -2 -13 -8" stroke="#ffffff" strokeWidth="1.4" opacity="0.55" />
      <path d="M2 14 C8 8 12 2 14 -6" stroke="#ffffff" strokeWidth="1.4" opacity="0.55" />
    </g>
  );
}

function GoldenBeads() {
  return (
    <g transform="translate(193 143)">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 18}
            cy={row * 18}
            r="7.4"
            fill={PALETTE.amberSoft}
            stroke={PALETTE.clay}
            strokeWidth="1.6"
          />
        )),
      )}
      <path d="M-8 -9 L45 47" stroke="#ffffff" strokeWidth="2" opacity="0.45" strokeLinecap="round" />
    </g>
  );
}

function Book() {
  return (
    <g transform="translate(82 139)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 0 C33 -7 53 -3 72 9 L72 65 C49 52 31 51 10 60 Z" fill="#fff7ed" stroke={PALETTE.clay} strokeWidth="2.6" />
      <path d="M72 9 C94 -4 113 -6 135 1 L135 60 C112 52 94 53 72 65 Z" fill="#fff1f2" stroke={PALETTE.roseDeep} strokeWidth="2.6" />
      <path d="M72 11 L72 65" stroke={PALETTE.line} strokeWidth="2" />
      <path d="M26 18 C39 15 49 16 61 21 M25 32 C40 29 49 31 60 36" stroke={PALETTE.clay} strokeWidth="1.8" opacity="0.55" />
      <path d="M87 19 C101 14 112 14 125 18 M87 33 C101 29 113 29 126 34" stroke={PALETTE.roseDeep} strokeWidth="1.8" opacity="0.5" />
    </g>
  );
}

function Globe() {
  return (
    <g transform="translate(164 121)" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="0" cy="0" r="48" fill={PALETTE.sky} stroke={PALETTE.skyDeep} strokeWidth="3" />
      <path d="M-31 -21 C-12 -33 4 -25 10 -12 C1 -9 -4 1 0 12 C-17 14 -31 7 -34 -8 Z" fill={PALETTE.green} stroke={PALETTE.greenDeep} strokeWidth="2" />
      <path d="M16 -28 C34 -18 41 2 33 22 C21 25 11 18 12 7 C22 3 24 -10 16 -28 Z" fill="#6ee7b7" stroke={PALETTE.greenDeep} strokeWidth="2" />
      <path d="M-47 2 C-17 12 16 12 47 2 M-38 -27 C-13 -18 16 -18 38 -27 M-38 27 C-12 20 14 20 38 27" stroke="#ffffff" strokeWidth="1.5" opacity="0.58" />
      <path d="M-56 58 C-19 72 21 72 58 58" stroke={PALETTE.line} strokeWidth="3" fill="none" />
      <path d="M0 49 L0 68" stroke={PALETTE.line} strokeWidth="3" />
    </g>
  );
}

function MusicNotes() {
  return (
    <g transform="translate(95 111)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 56 C45 20 92 18 140 40" stroke={PALETTE.violetDeep} strokeWidth="3" fill="none" opacity="0.55" />
      <path d="M34 23 L34 78" stroke={PALETTE.roseDeep} strokeWidth="4" />
      <ellipse cx="23" cy="80" rx="15" ry="10" fill={PALETTE.rose} stroke={PALETTE.roseDeep} strokeWidth="2.3" transform="rotate(-16 23 80)" />
      <path d="M92 8 L92 64" stroke={PALETTE.skyDeep} strokeWidth="4" />
      <ellipse cx="80" cy="67" rx="15" ry="10" fill={PALETTE.sky} stroke={PALETTE.skyDeep} strokeWidth="2.3" transform="rotate(-16 80 67)" />
      <path d="M92 8 C111 15 120 19 136 17 L136 29 C118 31 108 24 92 19 Z" fill={PALETTE.amberSoft} stroke={PALETTE.clay} strokeWidth="2" />
      <circle cx="135" cy="78" r="15" fill={PALETTE.green} stroke={PALETTE.greenDeep} strokeWidth="2.4" />
      <path d="M129 76 L135 83 L145 71" stroke="#ffffff" strokeWidth="3" fill="none" />
    </g>
  );
}

function HarmonyHands() {
  return (
    <g transform="translate(91 133)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 53 C36 45 14 29 9 9 C7 -1 17 -6 24 3 C31 13 38 21 49 27" fill="#fed7aa" stroke={PALETTE.clay} strokeWidth="2.6" />
      <path d="M113 53 C138 46 159 30 164 10 C167 0 156 -6 149 3 C141 14 134 22 124 28" fill="#fecdd3" stroke={PALETTE.roseDeep} strokeWidth="2.6" />
      <path d="M55 30 C74 10 96 10 117 30 C118 53 103 70 86 78 C69 70 54 53 55 30 Z" fill={PALETTE.violet} stroke={PALETTE.violetDeep} strokeWidth="2.8" />
      <path d="M76 38 C82 32 90 32 96 38" stroke="#ffffff" strokeWidth="2.4" fill="none" opacity="0.62" />
      <path d="M74 51 C82 58 91 58 100 51" stroke={PALETTE.violetDeep} strokeWidth="2.4" fill="none" />
    </g>
  );
}

function LanguageLetters() {
  return (
    <g transform="translate(82 97)" strokeLinecap="round" strokeLinejoin="round">
      <Book />
      <g transform="translate(18 1)">
        {[
          ["A", 0, 7, PALETTE.amberSoft, PALETTE.clay],
          ["M", 73, -9, PALETTE.sky, PALETTE.skyDeep],
          ["L", 138, 20, PALETTE.rose, PALETTE.roseDeep],
        ].map(([letter, x, y, fill, stroke]) => (
          <g key={letter} transform={`translate(${x} ${y}) rotate(${letter === "M" ? 8 : -7})`}>
            <path d="M2 7 C14 -2 35 0 45 9 C48 25 42 41 25 45 C8 43 -3 28 2 7 Z" fill={fill} stroke={stroke} strokeWidth="2.3" />
            <text x="22" y="32" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="30" fontWeight="700" fill={PALETTE.ink}>
              {letter}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

function NumbersBoard() {
  return (
    <g>
      <GoldenBeads />
      <g transform="translate(83 100)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 10 C35 -2 84 -1 112 11 L108 86 C78 94 36 94 6 84 Z" fill="#eff6ff" stroke={PALETTE.skyDeep} strokeWidth="2.8" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <path
              key={`${row}-${col}`}
              d={`M${25 + col * 27} ${28 + row * 18} C${31 + col * 27} ${25 + row * 18} ${38 + col * 27} ${25 + row * 18} ${44 + col * 27} ${28 + row * 18}`}
              stroke={row === col ? PALETTE.violetDeep : PALETTE.skyDeep}
              strokeWidth="2.6"
              fill="none"
              opacity="0.7"
            />
          )),
        )}
        <text x="56" y="72" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="36" fontWeight="700" fill={PALETTE.ink}>
          123
        </text>
      </g>
    </g>
  );
}

function HeroScene({ id }) {
  return (
    <g>
      <path d="M91 187 C122 109 202 100 242 177" stroke={`url(#${id}-thread)`} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55" />
      <ScribbleOval cx="118" cy="120" rx="43" ry="42" fill={`url(#${id}-wash-a)`} />
      <ScribbleOval cx="219" cy="125" rx="44" ry="42" fill={`url(#${id}-wash-b)`} />
      <ScribbleOval cx="168" cy="169" rx="57" ry="40" fill="#ffffff" opacity="0.88" />
      <Book />
      <GoldenBeads />
      <Plant x="69" y="209" scale="0.9" />
      <Plant x="271" y="211" scale="0.8" />
      <path d="M128 86 C141 67 158 65 171 85 C183 65 202 67 214 86 C215 111 196 129 171 143 C146 129 127 111 128 86 Z" fill={PALETTE.rose} stroke={PALETTE.roseDeep} strokeWidth="3" />
      <path d="M154 97 C164 90 177 91 187 98" stroke="#ffffff" strokeWidth="2.4" opacity="0.7" strokeLinecap="round" />
    </g>
  );
}

function VariantScene({ id, variant }) {
  if (variant === "language") return <LanguageLetters />;
  if (variant === "numbers") return <NumbersBoard />;
  if (variant === "world") return <><Globe /><Plant x="82" y="208" scale="0.85" /><Plant x="252" y="212" scale="0.75" /></>;
  if (variant === "harmony") return <><HarmonyHands /><Plant x="73" y="211" scale="0.7" /><Plant x="267" y="211" scale="0.7" /></>;
  if (variant === "music") return <><MusicNotes /><Plant x="257" y="211" scale="0.72" /></>;
  return <HeroScene id={id} />;
}

export default function PremiumIllustration({
  variant = "hero",
  title,
  size = 320,
  className = "",
  animated = true,
}) {
  const reactId = useId();
  const id = makeId(`premium-${variant}-${reactId}`);
  const safeVariant = PREMIUM_ILLUSTRATION_VARIANTS.includes(variant) ? variant : "hero";
  const accents = SUBJECT_ACCENTS[safeVariant];
  const Component = animated ? motion.svg : "svg";

  return (
    <Component
      width={size}
      height={size}
      viewBox="0 0 340 300"
      role={title ? "img" : "presentation"}
      aria-label={title}
      className={`overflow-visible drop-shadow-xl ${className}`}
      initial={animated ? { opacity: 0, y: 10, rotate: -1 } : undefined}
      animate={animated ? { opacity: 1, y: [0, -5, 0], rotate: [-1, 1, -1] } : undefined}
      transition={animated ? { opacity: { duration: 0.45 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" } } : undefined}
    >
      <Defs id={id} accents={accents} />
      <PaperCard id={id} />
      <g filter={`url(#${id}-bleed)`}>
        <path d="M71 91 C107 55 233 49 276 88 C293 124 287 204 262 232 C205 255 95 249 62 222 C42 175 42 119 71 91 Z" fill={`url(#${id}-wash-a)`} opacity="0.5" />
        <path d="M106 68 C151 51 236 65 260 108 C230 89 154 83 100 103 Z" fill={`url(#${id}-wash-b)`} opacity="0.38" />
      </g>
      <VariantScene id={id} variant={safeVariant} />
      <path d="M46 246 C101 269 237 270 294 240" stroke="#ffffff" strokeWidth="2.5" opacity="0.54" strokeLinecap="round" fill="none" />
      <path d="M54 56 C102 39 232 37 291 57" stroke="#ffffff" strokeWidth="2" opacity="0.48" strokeLinecap="round" fill="none" />
    </Component>
  );
}
