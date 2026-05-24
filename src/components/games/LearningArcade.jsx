import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { Car, Compass, DoorOpen, RotateCw, Snowflake, Sparkles, Star, Target, Trophy, Zap } from "lucide-react";
import { ANIMAL_FRIENDS } from "../../data/animalFriends";
import { getArcadeLearningPack } from "../../data/arcadeLearningPack";
import { getDeepLearningPack } from "../../data/deepLearningContentPack";
import { SUBJECT_VARIANT_CONTENT } from "../../data/learningContent";
import { withPremiumCollections } from "../../data/premiumGamePack";
import { playCoin, playError, playJingle, playMagicDust, playPop, playWhoosh } from "../../utils/sounds";

const MotionButton = motion.button;

const MODE_META = {
  taxi: { icon: Car, color: "bg-yellow-500", short: "Fahr", title: "Sprach-Taxi", description: "Top-Down fahren, Wort abholen, richtiges Ziel ansteuern." },
  ninja: { icon: Target, color: "bg-slate-900", short: "Wirf", title: "Ninja-Dojo", description: "Shuriken auf die richtige Wortkarte werfen." },
  maze: { icon: DoorOpen, color: "bg-teal-500", short: "Such", title: "Labyrinth", description: "Durch Wege steuern und den passenden Ausgang finden." },
  parkour: { icon: Zap, color: "bg-orange-500", short: "Spring" },
  snowball: { icon: Snowflake, color: "bg-sky-500", short: "Triff" },
  runner: { icon: Compass, color: "bg-emerald-500", short: "Lauf" },
  vault: { icon: Trophy, color: "bg-violet-500", short: "Serie" },
};

const THEMES = {
  deutsch: {
    title: "Sprach-Arcade",
    kicker: "Wortarten, Bilder, Sätze",
    accent: "#f97316",
    dark: "#431407",
    glow: "rgba(249, 115, 22, .3)",
    background: "/premium-sky/backgrounds/sky-rainbow.jpg",
    sprite: "/premium-sky/sprites/story-book.png",
    friendIndex: 4,
    modeLabels: {
      taxi: "Sprach-Taxi",
      ninja: "Ninja-Dojo",
      maze: "Wort-Labyrinth",
      parkour: "Wortarten-Parkour",
      snowball: "Schneeball-Wörter",
      runner: "Satz-Tore",
      vault: "Sprach-Schatz",
    },
  },
  mathe: {
    title: "Zahlen-Arcade",
    kicker: "Rechnen, Muster, Beweise",
    accent: "#0ea5e9",
    dark: "#075985",
    glow: "rgba(14, 165, 233, .3)",
    background: "/premium-sky/backgrounds/sky-morning.jpg",
    sprite: "/premium-sky/sprites/number-balloon.png",
    friendIndex: 0,
    modeLabels: {
      taxi: "Zahlen-Taxi",
      ninja: "Rechen-Dojo",
      maze: "Zahlen-Labyrinth",
      parkour: "Zahlen-Parkour",
      snowball: "Schneeball-Zahlen",
      runner: "Rechen-Tore",
      vault: "Zahlen-Schatz",
    },
  },
  sachunterricht: {
    title: "Forscher-Arcade",
    kicker: "Natur, Wetter, Lebensräume",
    accent: "#10b981",
    dark: "#064e3b",
    glow: "rgba(16, 185, 129, .3)",
    background: "/premium-sky/backgrounds/sky-rain.jpg",
    sprite: "/premium-sky/sprites/leaf-glider.png",
    friendIndex: 8,
    modeLabels: {
      taxi: "Forscher-Taxi",
      ninja: "Spuren-Dojo",
      maze: "Natur-Labyrinth",
      parkour: "Forscher-Parkour",
      snowball: "Schneeball-Spuren",
      runner: "Natur-Tore",
      vault: "Forscher-Schatz",
    },
  },
  ethik: {
    title: "Herz-Arcade",
    kicker: "Gefühle, Grenzen, gute Schritte",
    accent: "#ec4899",
    dark: "#831843",
    glow: "rgba(236, 72, 153, .28)",
    background: "/premium-sky/backgrounds/sky-sunset.jpg",
    sprite: "/premium-sky/sprites/heart-balloon.png",
    friendIndex: 7,
    modeLabels: {
      taxi: "Herz-Taxi",
      ninja: "Stopp-Dojo",
      maze: "Miteinander-Labyrinth",
      parkour: "Herz-Parkour",
      snowball: "Schneeball-Stopp",
      runner: "Miteinander-Tore",
      vault: "Herz-Schatz",
    },
  },
  musik: {
    title: "Klang-Arcade",
    kicker: "Instrumente, Rhythmus, Klangfarben",
    accent: "#a855f7",
    dark: "#581c87",
    glow: "rgba(168, 85, 247, .3)",
    background: "/premium-sky/backgrounds/sky-aurora.jpg",
    sprite: "/premium-sky/sprites/music-notes.png",
    friendIndex: 1,
    modeLabels: {
      taxi: "Klang-Taxi",
      ninja: "Rhythmus-Dojo",
      maze: "Klang-Labyrinth",
      parkour: "Klang-Parkour",
      snowball: "Schneeball-Klänge",
      runner: "Rhythmus-Tore",
      vault: "Klang-Schatz",
    },
  },
};

const FALLBACK_THEME = THEMES.deutsch;

const COMMON_OPTIONS = {
  deutsch: ["Nomen", "Verb", "Adjektiv", "Artikel", "Präposition", "Der", "Die", "Das"],
  mathe: ["10", "12", "20", "24", "Kreis", "Quadrat", "größer", "kleiner"],
  sachunterricht: ["Wasser", "Licht", "Wiese", "Wald", "Winter", "Frühling", "beobachten", "schützen"],
  ethik: ["Stopp sagen", "zuhören", "Pause nehmen", "Hilfe holen", "teilen", "nachfragen"],
  musik: ["leise", "laut", "schnell", "langsam", "Streicher", "Blechbläser", "ABAB", "AAB"],
};

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 420;

const normalizeText = (value) => String(value ?? "").trim();
const unique = (items) => Array.from(new Set(items.map(normalizeText).filter(Boolean)));

const shuffleBySeed = (items, seed) =>
  [...items]
    .map((item, index) => ({
      item,
      sortKey: (index * 47 + seed * 31 + normalizeText(item?.id || item).length * 13) % 997,
    }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ item }) => item);

const normalizeCollections = (collections = [], subject = "deutsch") =>
  collections
    .map((collection, collectionIndex) => {
      const rawItems = Array.isArray(collection?.items) ? collection.items.filter((item) => item?.prompt && item?.answer) : [];
      const answerPool = unique(rawItems.map((item) => item.answer));

      return {
        id: collection?.id || `arcade-collection-${collectionIndex}`,
        label: collection?.label || collection?.title || `Welt ${collectionIndex + 1}`,
        icon: collection?.icon || "✦",
        color: collection?.color || "bg-slate-700",
        items: rawItems.map((item, itemIndex) => {
          const answer = normalizeText(item.answer);
          const sourceOptions = unique([
            answer,
            ...(Array.isArray(item.options) ? item.options : []),
            ...shuffleBySeed(answerPool, itemIndex + collectionIndex * 17),
            ...(COMMON_OPTIONS[subject] || COMMON_OPTIONS.deutsch),
          ]);
          const optionsWithAnswer = unique([answer, ...sourceOptions.filter((option) => option !== answer)]).slice(0, 4);

          return {
            ...item,
            id: item.id || `${collection?.id || collectionIndex}-${itemIndex}`,
            prompt: normalizeText(item.prompt),
            answer,
            options: shuffleBySeed(optionsWithAnswer, itemIndex + answer.length).slice(0, 4),
            support: normalizeText(item.support),
            example: normalizeText(item.example),
            imageCue: normalizeText(item.imageCue),
          };
        }),
      };
    })
    .filter((collection) => collection.items.length > 0);

const getSourceCollections = (subject) => [
  ...getArcadeLearningPack(subject),
  ...withPremiumCollections(subject, SUBJECT_VARIANT_CONTENT[subject] || []),
  ...getDeepLearningPack(subject),
];

function StatPill({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">{label}</p>
      <p className="mt-1 font-hand text-3xl font-bold leading-none" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function ArcadeSky({ theme, reduceMotion }) {
  const cloudMotion = reduceMotion ? {} : { x: [0, 18, -10, 0], y: [0, -6, 4, 0] };

  return (
    <>
      <motion.div
        aria-hidden
        className="absolute left-[8%] top-[12%] h-12 w-36 rounded-full bg-white/70 blur-[1px]"
        animate={cloudMotion}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[12%] top-[18%] h-16 w-44 rounded-full bg-white/65 blur-[1px]"
        animate={reduceMotion ? {} : { x: [0, -14, 12, 0], y: [0, 5, -6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div aria-hidden className="absolute right-10 top-8 h-24 w-24 rounded-full bg-amber-200/80 shadow-[0_0_70px_rgba(253,224,71,.65)]" />
      <div aria-hidden className="absolute -bottom-10 left-0 right-0 h-44 bg-gradient-to-t from-emerald-500/45 via-lime-300/35 to-transparent" />
      <div aria-hidden className="absolute bottom-5 left-0 right-0 h-28 rounded-[50%_50%_0_0] bg-emerald-500/35" />
      <img
        src={theme.sprite}
        alt=""
        className="absolute right-7 bottom-9 h-20 w-20 object-contain opacity-75 drop-shadow-xl"
        draggable="false"
      />
    </>
  );
}

function FriendPicker({ friends, activeFriend, setFriendIndex, color }) {
  return (
    <div className="flex min-w-0 gap-2 overflow-x-auto rounded-[28px] border-2 border-white bg-white/58 p-2 shadow-inner">
      {friends.map((friend, index) => {
        const active = friend.id === activeFriend.id;
        return (
          <button
            key={friend.id}
            type="button"
            onClick={() => {
              playPop();
              setFriendIndex(index);
            }}
            className={`h-20 w-16 shrink-0 rounded-2xl border-2 bg-white/85 p-1 shadow-sm transition-all ${
              active ? "scale-105 border-sky-300 shadow-lg" : "border-white opacity-75 hover:opacity-100"
            }`}
            aria-label={`${friend.name} wählen`}
          >
            <img src={friend.image} alt="" className="mx-auto h-11 w-11 object-contain drop-shadow-sm" draggable="false" />
            <span className="block truncate font-hand text-lg font-bold leading-none" style={{ color: active ? color : "#64748b" }}>
              {friend.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CollectionStrip({ collections, activeCollection, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-[28px] border-2 border-white bg-white/58 p-2 shadow-inner">
      {collections.map((collection) => {
        const active = collection.id === activeCollection.id;
        return (
          <button
            key={collection.id}
            type="button"
            onClick={() => onSelect(collection.id)}
            className={`min-h-20 w-36 shrink-0 rounded-2xl border-2 px-3 py-2 shadow-sm transition-all sm:w-40 ${
              active ? `${collection.color} border-white text-white shadow-lg` : "border-white bg-white/85 text-slate-600 hover:bg-white"
            }`}
          >
            <span className="block text-2xl">{collection.icon}</span>
            <span className="block min-h-10 font-hand text-lg font-bold leading-tight">{collection.label}</span>
            <span className={`font-sans text-[10px] font-bold uppercase tracking-wide ${active ? "text-white/75" : "text-slate-400"}`}>
              {collection.items.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PromptRibbon({ collection, challenge, theme }) {
  return (
    <div className="relative z-20 rounded-[30px] border-2 border-white bg-white/86 p-4 shadow-xl backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
            {collection.icon} {collection.label}
          </p>
          <h3 className="mt-1 font-hand text-3xl font-bold leading-tight text-slate-800 md:text-4xl">{challenge.prompt}</h3>
        </div>
        {challenge.imageCue && (
          <div className="max-w-48 rounded-2xl bg-slate-900/5 px-3 py-2 text-right font-hand text-xl font-bold text-slate-500">
            {challenge.imageCue}
          </div>
        )}
      </div>
      {(challenge.support || challenge.example) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {challenge.support && (
            <span className="rounded-full bg-white px-4 py-2 font-hand text-xl font-bold shadow-sm" style={{ color: theme.dark }}>
              {challenge.support}
            </span>
          )}
          {challenge.example && (
            <span className="rounded-full bg-white/70 px-4 py-2 font-hand text-xl font-bold text-slate-500 shadow-sm">
              {challenge.example}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function FeedbackBurst({ feedback, challenge, color }) {
  return (
    <AnimatePresence mode="wait">
      {feedback && (
        <motion.div
          key={feedback}
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.94 }}
          className={`absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border-4 border-white px-6 py-3 font-hand text-3xl font-bold shadow-2xl ${
            feedback === "richtig" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
          }`}
        >
          {feedback === "richtig" ? "Treffer" : `Spur: ${challenge.answer}`}
          {feedback === "richtig" && <Sparkles className="ml-2 inline" size={24} color={color} fill={color} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModeButton({ mode, active, label, onClick }) {
  const Icon = MODE_META[mode].icon;
  return (
    <MotionButton
      type="button"
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 shadow-md transition-all ${
        active ? `${MODE_META[mode].color} border-white text-white ring-4 ring-white/70` : "border-white bg-white/78 text-slate-600"
      }`}
    >
      <Icon size={22} />
      <span className="font-hand text-2xl font-bold leading-none">{label}</span>
    </MotionButton>
  );
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const roundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const wrapCanvasText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) => {
  const words = normalizeText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth || !line) {
      line = testLine;
      return;
    }
    lines.push(line);
    line = word;
  });
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((entry, index) => {
    const label = index === maxLines - 1 && lines.length > maxLines ? `${entry.replace(/\s+\S+$/, "")}...` : entry;
    ctx.fillText(label, x, y + index * lineHeight);
  });
};

const rectsOverlap = (a, b, padding = 0) =>
  a.x + padding < b.x + b.w &&
  a.x + a.w - padding > b.x &&
  a.y + padding < b.y + b.h &&
  a.y + a.h - padding > b.y;

const getCargoLabel = (challenge) => {
  const quoted = normalizeText(challenge?.prompt).match(/"([^"]+)"/)?.[1];
  return normalizeText(challenge?.taxiCargo || quoted || challenge?.answer || challenge?.imageCue || "Wort");
};

const getDirectionKey = (key) => {
  if (key === "ArrowUp" || key === "w" || key === "W") return "up";
  if (key === "ArrowDown" || key === "s" || key === "S") return "down";
  if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
  if (key === "ArrowRight" || key === "d" || key === "D") return "right";
  return null;
};

const getControlVector = (controls) => {
  let x = 0;
  let y = 0;
  if (controls.left) x -= 1;
  if (controls.right) x += 1;
  if (controls.up) y -= 1;
  if (controls.down) y += 1;
  const length = Math.hypot(x, y);
  return length > 0 ? { x: x / length, y: y / length } : { x: 0, y: 0 };
};

const moveTowardTarget = (player, target, speed, dt) => {
  if (!target) return { x: 0, y: 0, reached: true };
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h / 2;
  const dx = target.x - centerX;
  const dy = target.y - centerY;
  const distance = Math.hypot(dx, dy);
  if (distance < 10) return { x: 0, y: 0, reached: true };
  return { x: (dx / distance) * speed * dt, y: (dy / distance) * speed * dt, reached: false };
};

const drawCanvasCard = (ctx, x, y, width, height, label, theme, state = "idle") => {
  ctx.save();
  const body = ctx.createLinearGradient(x, y, x, y + height);
  if (state === "hit") {
    body.addColorStop(0, "rgba(236, 253, 245, .98)");
    body.addColorStop(0.56, "rgba(167, 243, 208, .94)");
    body.addColorStop(1, "rgba(52, 211, 153, .78)");
  } else if (state === "wrong") {
    body.addColorStop(0, "rgba(255, 241, 242, .98)");
    body.addColorStop(0.58, "rgba(254, 205, 211, .92)");
    body.addColorStop(1, "rgba(251, 113, 133, .76)");
  } else {
    body.addColorStop(0, "rgba(255, 255, 255, .98)");
    body.addColorStop(0.52, "rgba(248, 250, 252, .88)");
    body.addColorStop(1, "rgba(251, 191, 36, .22)");
  }

  ctx.shadowColor = "rgba(15, 23, 42, .24)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 12;
  roundedRect(ctx, x, y, width, height, 24);
  ctx.fillStyle = body;
  ctx.strokeStyle = state === "hit" ? "#34d399" : state === "wrong" ? "#fb7185" : "rgba(255,255,255,.98)";
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "transparent";

  ctx.save();
  ctx.globalAlpha = 0.38;
  roundedRect(ctx, x + 10, y + 9, width - 20, Math.max(18, height * 0.34), 18);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = state === "idle" ? 0.72 : 0.9;
  ctx.fillStyle = state === "wrong" ? "#fb7185" : state === "hit" ? "#10b981" : theme.accent;
  roundedRect(ctx, x + width / 2 - 35, y + 13, 70, 8, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 18, y + height - 18, 4, 0, Math.PI * 2);
  ctx.arc(x + width - 18, y + height - 18, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = state === "hit" ? "#065f46" : state === "wrong" ? "#9f1239" : "#1f2937";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${width < 140 ? 25 : 31}px Caveat, Nunito, sans-serif`;
  wrapCanvasText(ctx, label, x + width / 2, y + height / 2 - 8, width - 28, 30, 2);
  ctx.restore();
};

const drawFriend = (ctx, image, player, fallbackColor) => {
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, .32)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;
  if (image?.complete && image.naturalWidth) {
    ctx.drawImage(image, player.x, player.y, player.w, player.h);
  } else {
    roundedRect(ctx, player.x, player.y, player.w, player.h, 28);
    ctx.fillStyle = fallbackColor;
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.x + player.w * 0.35, player.y + player.h * 0.4, 7, 0, Math.PI * 2);
    ctx.arc(player.x + player.w * 0.65, player.y + player.h * 0.4, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

function CanvasArcadeStage({
  mode,
  challenge,
  collection,
  theme,
  activeFriend,
  feedback,
  locked,
  onPick,
  roundSeed,
  reduceMotion,
}) {
  const canvasRef = useRef(null);
  const onPickRef = useRef(onPick);
  const feedbackRef = useRef(feedback);
  const lockedRef = useRef(locked);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    feedbackRef.current = feedback;
    lockedRef.current = locked;
  }, [feedback, locked]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !challenge) return undefined;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let animationFrame = 0;
    let last = performance.now();
    const friendImage = new Image();
    friendImage.src = activeFriend.image;

    const pointer = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
    const controls = { up: false, down: false, left: false, right: false };
    const optionCount = Math.max(1, challenge.options.length);
    const optionState = { hit: null, wrong: null };
    const particles = [];
    const taxiCargo = getCargoLabel(challenge);
    const destinationSlots = [
      { x: 62, y: 282, w: 190, h: 84 },
      { x: 392, y: 46, w: 205, h: 84 },
      { x: 736, y: 284, w: 200, h: 84 },
      { x: 728, y: 56, w: 205, h: 84 },
    ];
    const mazeExitSlots = [
      { x: 762, y: 46, w: 184, h: 78 },
      { x: 762, y: 292, w: 184, h: 78 },
      { x: 410, y: 174, w: 184, h: 78 },
      { x: 60, y: 54, w: 184, h: 78 },
    ];
    const mazeWalls = [
      { x: 292, y: 34, w: 24, h: 166 },
      { x: 292, y: 248, w: 24, h: 136 },
      { x: 142, y: 178, w: 246, h: 24 },
      { x: 462, y: 76, w: 24, h: 126 },
      { x: 462, y: 244, w: 24, h: 132 },
      { x: 586, y: 178, w: 248, h: 24 },
      { x: 650, y: 34, w: 24, h: 110 },
      { x: 650, y: 244, w: 24, h: 142 },
      { x: 116, y: 284, w: 226, h: 24 },
      { x: 536, y: 288, w: 220, h: 24 },
    ];

    const burst = (x, y, color) => {
      for (let i = 0; i < 18; i += 1) {
        particles.push({
          x,
          y,
          vx: Math.cos((Math.PI * 2 * i) / 18) * (80 + (i % 4) * 30),
          vy: Math.sin((Math.PI * 2 * i) / 18) * (70 + (i % 5) * 25),
          life: 0.7,
          color,
        });
      }
    };

    const finishWith = (option, x, y) => {
      if (optionState.hit || optionState.wrong || feedbackRef.current || lockedRef.current) return;
      if (option === challenge.answer) {
        optionState.hit = option;
        burst(x, y, theme.accent);
      } else {
        optionState.wrong = option;
        burst(x, y, "#fb7185");
      }
      onPickRef.current(option);
    };

    const state = {
      parkour: {
        player: { x: 122, y: 310, w: 92, h: 102, vy: 0, onGround: true },
        groundY: 396,
        speed: 190,
        platforms: challenge.options.map((option, index) => ({
          option,
          x: 455 + index * 235,
          y: [280, 245, 304, 260][index % 4],
          w: 178,
          h: 72,
          checked: false,
        })),
        distance: 0,
      },
      snowball: {
        targets: challenge.options.map((option, index) => ({
          option,
          x: 140 + index * (720 / Math.max(1, optionCount - 1 || 1)),
          y: 72 + (index % 2) * 120,
          w: 170,
          h: 86,
          vx: (index % 2 === 0 ? 1 : -1) * (45 + index * 9),
          vy: (index % 2 === 0 ? -1 : 1) * (28 + index * 4),
        })),
        projectiles: [],
        cooldown: 0,
      },
      runner: {
        playerLane: 1,
        gateY: 28,
        speed: 155,
        laneFlash: null,
      },
      taxi: {
        player: { x: 446, y: 322, w: 78, h: 46, angle: 0, target: null },
        pickup: { x: 84, y: 64, w: 218, h: 92, collected: false },
        destinations: challenge.options.map((option, index) => ({
          option,
          ...(destinationSlots[index % destinationSlots.length]),
        })),
        speed: 270,
      },
      maze: {
        player: { x: 72, y: 336, w: 62, h: 62, target: null },
        exits: challenge.options.map((option, index) => ({
          option,
          ...(mazeExitSlots[index % mazeExitSlots.length]),
        })),
        speed: 238,
      },
    };

    const getCanvasPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * GAME_WIDTH,
        y: ((event.clientY - rect.top) / rect.height) * GAME_HEIGHT,
      };
    };

    const jump = () => {
      const player = state.parkour.player;
      if (mode !== "parkour" || !player.onGround || optionState.hit || optionState.wrong) return;
      player.vy = -650;
      player.onGround = false;
      playWhoosh();
    };

    const fireSnowball = (targetPoint = pointer) => {
      if (!["snowball", "ninja"].includes(mode) || optionState.hit || optionState.wrong) return;
      const snowball = state.snowball;
      if (snowball.cooldown > 0) return;
      const start = { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 30 };
      const dx = targetPoint.x - start.x;
      const dy = targetPoint.y - start.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      snowball.projectiles.push({
        x: start.x,
        y: start.y,
        vx: (dx / length) * 760,
        vy: (dy / length) * 760,
        life: 1.2,
      });
      snowball.cooldown = 0.22;
      playWhoosh();
    };

    const setPointerTarget = (targetState, point) => {
      targetState.target = point;
      playWhoosh();
    };

    const setRunnerLane = (lane) => {
      if (mode !== "runner" || optionState.hit || optionState.wrong) return;
      state.runner.playerLane = clamp(lane, 0, challenge.options.length - 1);
      state.runner.laneFlash = state.runner.playerLane;
      playPop();
    };

    const handlePointerMove = (event) => {
      const point = getCanvasPoint(event);
      pointer.x = point.x;
      pointer.y = point.y;
    };

    const handlePointerDown = (event) => {
      const point = getCanvasPoint(event);
      pointer.x = point.x;
      pointer.y = point.y;
      if (mode === "parkour") jump();
      if (mode === "snowball" || mode === "ninja") fireSnowball(point);
      if (mode === "runner") setRunnerLane(Math.floor((point.x / GAME_WIDTH) * challenge.options.length));
      if (mode === "taxi") setPointerTarget(state.taxi.player, point);
      if (mode === "maze") setPointerTarget(state.maze.player, point);
    };

    const handleKeyDown = (event) => {
      const direction = getDirectionKey(event.key);
      if ((mode === "taxi" || mode === "maze") && direction) {
        event.preventDefault();
        controls[direction] = true;
      }
      if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        event.preventDefault();
        if (mode === "parkour") jump();
        if (mode === "snowball" || mode === "ninja") fireSnowball(pointer);
      }
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        event.preventDefault();
        setRunnerLane(state.runner.playerLane - 1);
      }
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        event.preventDefault();
        setRunnerLane(state.runner.playerLane + 1);
      }
      if (/^[1-4]$/.test(event.key)) {
        setRunnerLane(Number(event.key) - 1);
      }
    };

    const handleKeyUp = (event) => {
      const direction = getDirectionKey(event.key);
      if (!direction) return;
      controls[direction] = false;
    };

    const drawBackdrop = (time) => {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.save();
      const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      sky.addColorStop(0, mode === "snowball" ? "rgba(219, 234, 254, .74)" : "rgba(125, 211, 252, .54)");
      sky.addColorStop(0.52, mode === "snowball" ? "rgba(240, 249, 255, .52)" : "rgba(186, 230, 253, .32)");
      sky.addColorStop(1, "rgba(16, 185, 129, .18)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#fde68a";
      ctx.beginPath();
      ctx.arc(GAME_WIDTH - 105, 76, 38 + Math.sin(time / 360) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(253, 230, 138, .55)";
      ctx.lineWidth = 6;
      for (let ray = 0; ray < 12; ray += 1) {
        const angle = (Math.PI * 2 * ray) / 12 + time / 2600;
        ctx.beginPath();
        ctx.moveTo(GAME_WIDTH - 105 + Math.cos(angle) * 52, 76 + Math.sin(angle) * 52);
        ctx.lineTo(GAME_WIDTH - 105 + Math.cos(angle) * 68, 76 + Math.sin(angle) * 68);
        ctx.stroke();
      }
      ctx.restore();

      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 10; i += 1) {
        const x = ((time * 0.018 + i * 142) % 1160) - 80;
        const y = 30 + (i % 4) * 42;
        ctx.beginPath();
        ctx.ellipse(x, y, 46, 13, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 38, y + 6, 34, 11, 0, 0, Math.PI * 2);
        ctx.ellipse(x - 32, y + 8, 28, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.save();
      const farHills = ctx.createLinearGradient(0, 180, 0, 320);
      farHills.addColorStop(0, "rgba(34, 197, 94, .18)");
      farHills.addColorStop(1, "rgba(16, 185, 129, .38)");
      ctx.fillStyle = farHills;
      ctx.beginPath();
      ctx.moveTo(0, 265);
      ctx.bezierCurveTo(160, 205, 270, 302, 440, 236);
      ctx.bezierCurveTo(610, 178, 705, 302, 1000, 216);
      ctx.lineTo(1000, 420);
      ctx.lineTo(0, 420);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.restore();
    };

    const drawParticles = (dt) => {
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.life -= dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 260 * dt;
        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = clamp(particle.life / 0.7, 0, 1);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const updateParkour = (dt) => {
      const parkour = state.parkour;
      const player = parkour.player;
      if (!feedbackRef.current && !lockedRef.current && !optionState.hit && !optionState.wrong) {
        parkour.distance += parkour.speed * dt;
        player.vy += 1500 * dt;
        player.y += player.vy * dt;
        if (player.y + player.h >= parkour.groundY) {
          player.y = parkour.groundY - player.h;
          player.vy = 0;
          player.onGround = true;
        }
        parkour.platforms.forEach((platform) => {
          platform.x -= parkour.speed * dt;
          if (platform.x + platform.w < -30) {
            const rightMost = Math.max(...parkour.platforms.map((entry) => entry.x));
            platform.x = rightMost + 230 + (parkour.distance % 50);
            platform.y = 238 + ((Math.floor(parkour.distance / 120) + platform.option.length) % 4) * 22;
            platform.checked = false;
          }
          const feet = player.y + player.h;
          const overlapsX = player.x + player.w * 0.78 > platform.x && player.x + player.w * 0.24 < platform.x + platform.w;
          const landsOnTop = player.vy >= 0 && feet >= platform.y - 8 && feet <= platform.y + platform.h * 0.7;
          if (!platform.checked && overlapsX && landsOnTop) {
            platform.checked = true;
            player.y = platform.y - player.h;
            player.vy = 0;
            player.onGround = true;
            finishWith(platform.option, platform.x + platform.w / 2, platform.y + platform.h / 2);
          }
        });
      }
    };

    const drawParkour = (time) => {
      const parkour = state.parkour;
      const player = parkour.player;
      ctx.save();
      const track = ctx.createLinearGradient(0, 292, 0, GAME_HEIGHT);
      track.addColorStop(0, "rgba(21, 128, 61, .48)");
      track.addColorStop(0.4, "rgba(22, 101, 52, .58)");
      track.addColorStop(1, "rgba(15, 23, 42, .38)");
      ctx.fillStyle = track;
      roundedRect(ctx, 0, 300, GAME_WIDTH, 120, 0);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,.56)";
      ctx.lineWidth = 6;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.moveTo(0, 326 + i * 43);
        ctx.lineTo(GAME_WIDTH, 326 + i * 43);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255,255,255,.28)";
      ctx.lineWidth = 4;
      for (let dash = 0; dash < 14; dash += 1) {
        const x = ((dash * 92 - time * 0.12) % 1100) - 80;
        ctx.beginPath();
        ctx.moveTo(x, 382);
        ctx.lineTo(x + 42, 382);
        ctx.stroke();
      }

      parkour.platforms.forEach((platform) => {
        const visualState = optionState.hit === platform.option ? "hit" : optionState.wrong === platform.option ? "wrong" : "idle";
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.ellipse(platform.x + platform.w / 2, platform.y + platform.h + 16, platform.w * 0.42, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        drawCanvasCard(ctx, platform.x, platform.y, platform.w, platform.h, platform.option, theme, visualState);
      });
      drawFriend(ctx, friendImage, player, theme.accent);
      ctx.fillStyle = "rgba(255,255,255,.78)";
      ctx.font = "800 18px Nunito, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("SPACE / SPRUNG", 18, 34);
      ctx.fillStyle = theme.accent;
      ctx.fillRect(18, 43, 130 + Math.sin(time / 180) * 20, 5);
      ctx.restore();
    };

    const updateSnowball = (dt) => {
      const snowball = state.snowball;
      snowball.cooldown = Math.max(0, snowball.cooldown - dt);
      if (!feedbackRef.current && !lockedRef.current && !optionState.hit && !optionState.wrong) {
        snowball.targets.forEach((target) => {
          target.x += target.vx * dt;
          target.y += target.vy * dt;
          if (target.x < 40 || target.x + target.w > GAME_WIDTH - 40) target.vx *= -1;
          if (target.y < 18 || target.y + target.h > GAME_HEIGHT - 145) target.vy *= -1;
        });
        for (let projectileIndex = snowball.projectiles.length - 1; projectileIndex >= 0; projectileIndex -= 1) {
          const projectile = snowball.projectiles[projectileIndex];
          projectile.x += projectile.vx * dt;
          projectile.y += projectile.vy * dt;
          projectile.vy += 120 * dt;
          projectile.life -= dt;
          if (projectile.life <= 0 || projectile.x < -30 || projectile.x > GAME_WIDTH + 30 || projectile.y < -40 || projectile.y > GAME_HEIGHT + 40) {
            snowball.projectiles.splice(projectileIndex, 1);
            continue;
          }
          const hitTarget = snowball.targets.find(
            (target) =>
              projectile.x > target.x &&
              projectile.x < target.x + target.w &&
              projectile.y > target.y &&
              projectile.y < target.y + target.h
          );
          if (hitTarget) {
            snowball.projectiles.splice(projectileIndex, 1);
            finishWith(hitTarget.option, hitTarget.x + hitTarget.w / 2, hitTarget.y + hitTarget.h / 2);
            break;
          }
        }
      }
    };

    const drawSnowball = () => {
      const snowball = state.snowball;
      const isNinja = mode === "ninja";
      ctx.save();
      ctx.fillStyle = isNinja ? "rgba(15, 23, 42, .62)" : "rgba(255,255,255,.62)";
      roundedRect(ctx, 0, GAME_HEIGHT - 80, GAME_WIDTH, 120, 0);
      ctx.fill();
      snowball.targets.forEach((target) => {
        const visualState = optionState.hit === target.option ? "hit" : optionState.wrong === target.option ? "wrong" : "idle";
        drawCanvasCard(ctx, target.x, target.y, target.w, target.h, target.option, theme, visualState);
      });
      snowball.projectiles.forEach((projectile) => {
        ctx.save();
        ctx.shadowColor = isNinja ? "rgba(15, 23, 42, .4)" : "rgba(14, 165, 233, .35)";
        ctx.shadowBlur = 18;
        if (isNinja) {
          ctx.translate(projectile.x, projectile.y);
          ctx.rotate(projectile.life * 18);
          ctx.fillStyle = "#e5e7eb";
          ctx.strokeStyle = "#111827";
          ctx.lineWidth = 3;
          for (let blade = 0; blade < 4; blade += 1) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(21, -7);
            ctx.lineTo(13, 0);
            ctx.lineTo(21, 7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#64748b";
          ctx.fill();
        } else {
          ctx.fillStyle = "#f8fafc";
          ctx.strokeStyle = "#bfdbfe";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(projectile.x, projectile.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      });
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 24, 0, Math.PI * 2);
      ctx.moveTo(pointer.x - 36, pointer.y);
      ctx.lineTo(pointer.x - 12, pointer.y);
      ctx.moveTo(pointer.x + 12, pointer.y);
      ctx.lineTo(pointer.x + 36, pointer.y);
      ctx.moveTo(pointer.x, pointer.y - 36);
      ctx.lineTo(pointer.x, pointer.y - 12);
      ctx.moveTo(pointer.x, pointer.y + 12);
      ctx.lineTo(pointer.x, pointer.y + 36);
      ctx.stroke();
      ctx.fillStyle = "rgba(15,23,42,.72)";
      ctx.font = "800 18px Nunito, sans-serif";
      ctx.fillText(isNinja ? "ZIELEN + SHURIKEN" : "ZIELEN + WURF", 18, GAME_HEIGHT - 28);
      ctx.restore();
    };

    const updateRunner = (dt) => {
      const runner = state.runner;
      if (!feedbackRef.current && !lockedRef.current && !optionState.hit && !optionState.wrong) {
        runner.gateY += runner.speed * dt;
        if (runner.gateY >= 266) {
          const option = challenge.options[runner.playerLane] || challenge.options[0];
          finishWith(option, 150 + runner.playerLane * 235, GAME_HEIGHT - 110);
        }
      }
    };

    const drawRunner = () => {
      const runner = state.runner;
      ctx.save();
      const laneWidth = GAME_WIDTH / challenge.options.length;
      const road = ctx.createLinearGradient(0, 40, 0, GAME_HEIGHT);
      road.addColorStop(0, "rgba(15, 23, 42, .16)");
      road.addColorStop(1, "rgba(15, 23, 42, .5)");
      ctx.fillStyle = road;
      roundedRect(ctx, 38, 34, GAME_WIDTH - 76, GAME_HEIGHT - 52, 42);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.54)";
      ctx.lineWidth = 5;
      for (let i = 1; i < challenge.options.length; i += 1) {
        const x = i * laneWidth;
        ctx.beginPath();
        ctx.moveTo(GAME_WIDTH / 2 + (x - GAME_WIDTH / 2) * 0.16, 60);
        ctx.lineTo(x, GAME_HEIGHT - 24);
        ctx.stroke();
      }
      challenge.options.forEach((option, index) => {
        const scale = 0.62 + runner.gateY / 360;
        const width = laneWidth * 0.6 * scale;
        const height = 78 * scale;
        const x = index * laneWidth + laneWidth / 2 - width / 2;
        const y = runner.gateY;
        const visualState = optionState.hit === option ? "hit" : optionState.wrong === option ? "wrong" : "idle";
        drawCanvasCard(ctx, x, y, width, height, option, theme, visualState);
      });
      const player = {
        x: runner.playerLane * laneWidth + laneWidth / 2 - 48,
        y: GAME_HEIGHT - 122,
        w: 96,
        h: 104,
      };
      ctx.fillStyle = "rgba(255,255,255,.22)";
      roundedRect(ctx, runner.playerLane * laneWidth + 10, GAME_HEIGHT - 142, laneWidth - 20, 130, 26);
      ctx.fill();
      drawFriend(ctx, friendImage, player, theme.accent);
      ctx.fillStyle = "rgba(255,255,255,.82)";
      ctx.font = "800 18px Nunito, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("←  →  / SPUR", 18, 34);
      ctx.restore();
    };

    const updateTaxi = (dt) => {
      const taxi = state.taxi;
      const player = taxi.player;
      if (feedbackRef.current || lockedRef.current || optionState.hit || optionState.wrong) return;

      const vector = getControlVector(controls);
      let dx = vector.x * taxi.speed * dt;
      let dy = vector.y * taxi.speed * dt;
      if (Math.hypot(vector.x, vector.y) === 0 && player.target) {
        const targetMove = moveTowardTarget(player, player.target, taxi.speed, dt);
        dx = targetMove.x;
        dy = targetMove.y;
        if (targetMove.reached) player.target = null;
      }
      if (dx || dy) {
        player.angle = Math.atan2(dy, dx);
        player.x = clamp(player.x + dx, 30, GAME_WIDTH - player.w - 30);
        player.y = clamp(player.y + dy, 28, GAME_HEIGHT - player.h - 26);
      }

      if (!taxi.pickup.collected && rectsOverlap(player, taxi.pickup, 10)) {
        taxi.pickup.collected = true;
        playPop();
        burst(taxi.pickup.x + taxi.pickup.w / 2, taxi.pickup.y + taxi.pickup.h / 2, theme.accent);
      }

      if (taxi.pickup.collected) {
        const target = taxi.destinations.find((destination) => rectsOverlap(player, destination, 8));
        if (target) finishWith(target.option, target.x + target.w / 2, target.y + target.h / 2);
      }
    };

    const drawTaxi = (time) => {
      const taxi = state.taxi;
      const player = taxi.player;
      ctx.save();
      const asphalt = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      asphalt.addColorStop(0, "rgba(71, 85, 105, .52)");
      asphalt.addColorStop(1, "rgba(15, 23, 42, .56)");
      ctx.fillStyle = asphalt;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.fillStyle = "rgba(255,255,255,.1)";
      for (let block = 0; block < 6; block += 1) {
        const x = 42 + (block % 3) * 318;
        const y = 28 + Math.floor(block / 3) * 210;
        roundedRect(ctx, x, y, 180, 92, 18);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(255,255,255,.62)";
      ctx.lineWidth = 8;
      ctx.setLineDash([34, 28]);
      ctx.beginPath();
      ctx.moveTo(0, 214);
      ctx.lineTo(GAME_WIDTH, 214);
      ctx.moveTo(500, 0);
      ctx.lineTo(500, GAME_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "rgba(250, 204, 21, .8)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 236);
      ctx.lineTo(GAME_WIDTH, 236);
      ctx.moveTo(522, 0);
      ctx.lineTo(522, GAME_HEIGHT);
      ctx.stroke();

      taxi.destinations.forEach((destination) => {
        const visualState = optionState.hit === destination.option ? "hit" : optionState.wrong === destination.option ? "wrong" : "idle";
        drawCanvasCard(ctx, destination.x, destination.y, destination.w, destination.h, destination.option, theme, visualState);
      });

      drawCanvasCard(
        ctx,
        taxi.pickup.x,
        taxi.pickup.y,
        taxi.pickup.w,
        taxi.pickup.h,
        taxi.pickup.collected ? `An Bord: ${taxiCargo}` : taxiCargo,
        theme,
        taxi.pickup.collected ? "hit" : "idle"
      );

      if (!taxi.pickup.collected) {
        ctx.save();
        ctx.globalAlpha = 0.76 + Math.sin(time / 180) * 0.14;
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(taxi.pickup.x + taxi.pickup.w / 2, taxi.pickup.y + taxi.pickup.h / 2, 64, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
      ctx.rotate(player.angle);
      ctx.shadowColor = "rgba(15, 23, 42, .38)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;
      roundedRect(ctx, -player.w / 2, -player.h / 2, player.w, player.h, 15);
      ctx.fillStyle = "#facc15";
      ctx.fill();
      ctx.strokeStyle = "#fef3c7";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#111827";
      roundedRect(ctx, -24, -16, 30, 32, 7);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "800 13px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("TAXI", 20, 0);
      ctx.fillStyle = "#0f172a";
      [-30, 30].forEach((x) => {
        roundedRect(ctx, x - 9, -28, 18, 10, 5);
        ctx.fill();
        roundedRect(ctx, x - 9, 18, 18, 10, 5);
        ctx.fill();
      });
      ctx.restore();

      if (taxi.pickup.collected) {
        ctx.fillStyle = "rgba(255,255,255,.9)";
        ctx.font = "800 20px Caveat, Nunito, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(taxiCargo, player.x + player.w / 2, player.y - 12);
      }

      ctx.fillStyle = "rgba(255,255,255,.84)";
      ctx.font = "800 18px Nunito, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("WASD / PFEILE / TIPPE ZUM FAHREN", 18, GAME_HEIGHT - 24);
      ctx.restore();
    };

    const collidesWithMaze = (rect) => mazeWalls.some((wall) => rectsOverlap(rect, wall, 0));

    const moveMazePlayer = (dx, dy) => {
      const player = state.maze.player;
      const nextX = { ...player, x: clamp(player.x + dx, 22, GAME_WIDTH - player.w - 22) };
      if (!collidesWithMaze(nextX)) player.x = nextX.x;
      const nextY = { ...player, y: clamp(player.y + dy, 22, GAME_HEIGHT - player.h - 22) };
      if (!collidesWithMaze(nextY)) player.y = nextY.y;
    };

    const updateMaze = (dt) => {
      const maze = state.maze;
      const player = maze.player;
      if (feedbackRef.current || lockedRef.current || optionState.hit || optionState.wrong) return;

      const vector = getControlVector(controls);
      let dx = vector.x * maze.speed * dt;
      let dy = vector.y * maze.speed * dt;
      if (Math.hypot(vector.x, vector.y) === 0 && player.target) {
        const targetMove = moveTowardTarget(player, player.target, maze.speed, dt);
        dx = targetMove.x;
        dy = targetMove.y;
        if (targetMove.reached) player.target = null;
      }
      moveMazePlayer(dx, dy);

      const exit = maze.exits.find((entry) => rectsOverlap(player, entry, 8));
      if (exit) finishWith(exit.option, exit.x + exit.w / 2, exit.y + exit.h / 2);
    };

    const drawMaze = (time) => {
      const maze = state.maze;
      ctx.save();
      const floor = ctx.createLinearGradient(0, 0, GAME_WIDTH, GAME_HEIGHT);
      floor.addColorStop(0, "rgba(240, 253, 250, .78)");
      floor.addColorStop(0.56, "rgba(236, 254, 255, .58)");
      floor.addColorStop(1, "rgba(255, 251, 235, .7)");
      ctx.fillStyle = floor;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      mazeWalls.forEach((wall, index) => {
        const shade = ctx.createLinearGradient(wall.x, wall.y, wall.x, wall.y + wall.h);
        shade.addColorStop(0, index % 2 ? "rgba(20, 184, 166, .82)" : "rgba(15, 118, 110, .82)");
        shade.addColorStop(1, "rgba(13, 148, 136, .62)");
        ctx.fillStyle = shade;
        ctx.shadowColor = "rgba(15, 23, 42, .2)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 8;
        roundedRect(ctx, wall.x, wall.y, wall.w, wall.h, 11);
        ctx.fill();
        ctx.shadowColor = "transparent";
      });

      maze.exits.forEach((exit) => {
        const visualState = optionState.hit === exit.option ? "hit" : optionState.wrong === exit.option ? "wrong" : "idle";
        drawCanvasCard(ctx, exit.x, exit.y, exit.w, exit.h, exit.option, theme, visualState);
      });

      const pulse = 1 + Math.sin(time / 220) * 0.04;
      ctx.save();
      ctx.translate(maze.player.x + maze.player.w / 2, maze.player.y + maze.player.h / 2);
      ctx.scale(pulse, pulse);
      drawFriend(ctx, friendImage, { x: -maze.player.w / 2, y: -maze.player.h / 2, w: maze.player.w, h: maze.player.h }, theme.accent);
      ctx.restore();

      ctx.fillStyle = "rgba(15,23,42,.72)";
      ctx.font = "800 18px Nunito, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("LABYRINTH: ZUM RICHTIGEN AUSGANG", 18, GAME_HEIGHT - 24);
      ctx.restore();
    };

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      drawBackdrop(now);
      if (mode === "parkour") {
        updateParkour(reduceMotion ? 0 : dt);
        drawParkour(now);
      }
      if (mode === "snowball") {
        updateSnowball(reduceMotion ? 0 : dt);
        drawSnowball(now);
      }
      if (mode === "ninja") {
        updateSnowball(reduceMotion ? 0 : dt);
        drawSnowball(now);
      }
      if (mode === "runner") {
        updateRunner(reduceMotion ? 0 : dt);
        drawRunner(now);
      }
      if (mode === "taxi") {
        updateTaxi(reduceMotion ? 0 : dt);
        drawTaxi(now);
      }
      if (mode === "maze") {
        updateMaze(reduceMotion ? 0 : dt);
        drawMaze(now);
      }
      drawParticles(dt);
      animationFrame = window.requestAnimationFrame(loop);
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animationFrame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeFriend.image, challenge, feedback, locked, mode, reduceMotion, roundSeed, theme]);

  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-[42px] border-4 border-white shadow-2xl">
      <SceneBackground theme={theme} reduceMotion={reduceMotion} winter={mode === "snowball"} />
      <div className="relative z-20 p-4 md:p-6">
        <PromptRibbon collection={collection} challenge={challenge} theme={theme} />
      </div>
      <canvas
        ref={canvasRef}
        className="relative z-20 block h-[420px] w-full touch-none"
        aria-label={`${MODE_META[mode].short}: ${challenge.prompt}`}
      />
      <FeedbackBurst feedback={feedback} challenge={challenge} color={theme.accent} />
    </div>
  );
}

export default function LearningArcade({ subject = "deutsch", onCorrect = () => {}, onWrong = () => {} }) {
  const reduceMotion = useReducedMotion();
  const theme = THEMES[subject] || FALLBACK_THEME;
  const [activeMode, setActiveMode] = useState("taxi");
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [challengeIndex, setChallengeIndex] = useState(() => Math.floor(Math.random() * 997));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hearts, setHearts] = useState(4);
  const [friendIndex, setFriendIndex] = useState(theme.friendIndex);
  const [roundSeed, setRoundSeed] = useState(1);
  const [fullscreenMode, setFullscreenMode] = useState(null);

  const sourceCollections = useMemo(() => getSourceCollections(subject), [subject]);
  const collections = useMemo(
    () =>
      sourceCollections
        .map((collection, index) => ({
          id: collection?.id || `arcade-collection-${index}`,
          label: collection?.label || collection?.title || `Welt ${index + 1}`,
          icon: collection?.icon || "✦",
          color: collection?.color || "bg-slate-700",
          items: Array.isArray(collection?.items) ? collection.items : [],
        }))
        .filter((collection) => collection.items.length > 0),
    [sourceCollections]
  );
  const activeSourceCollection = sourceCollections.find((collection) => collection.id === activeCollectionId) || sourceCollections[0];
  const activeCollection = useMemo(
    () => normalizeCollections(activeSourceCollection ? [activeSourceCollection] : [], subject)[0],
    [activeSourceCollection, subject]
  );
  const challenge = activeCollection?.items[challengeIndex % Math.max(1, activeCollection.items.length)];
  const activeFriend = ANIMAL_FRIENDS[friendIndex % ANIMAL_FRIENDS.length] || ANIMAL_FRIENDS[0];
  const totalItems = useMemo(() => collections.reduce((sum, collection) => sum + collection.items.length, 0), [collections]);
  const locked = hearts <= 0;

  useEffect(() => {
    if (!fullscreenMode) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreenMode]);

  const resetRound = () => {
    playJingle("start");
    setHearts(4);
    setCombo(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setChallengeIndex((index) => index + 1);
    setRoundSeed((seed) => seed + 1);
  };

  const startFullscreenGame = (mode) => {
    playJingle("start");
    setActiveMode(mode);
    setFullscreenMode(mode);
    setHearts(4);
    setCombo(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setRoundSeed((seed) => seed + 1);
  };

  const closeFullscreenGame = () => {
    playWhoosh();
    setFullscreenMode(null);
    setSelected(null);
    setFeedback(null);
    setRoundSeed((seed) => seed + 1);
  };

  const selectMode = (mode) => {
    playWhoosh();
    setActiveMode(mode);
    setSelected(null);
    setFeedback(null);
    setRoundSeed((seed) => seed + 1);
  };

  const selectCollection = (id) => {
    playWhoosh();
    setActiveCollectionId(id);
    setChallengeIndex(0);
    setSelected(null);
    setFeedback(null);
    setCombo(0);
    setRoundSeed((seed) => seed + 1);
  };

  const nextChallenge = () => {
    setChallengeIndex((index) => index + 1);
    setSelected(null);
    setFeedback(null);
    setRoundSeed((seed) => seed + 1);
  };

  const choose = (option) => {
    if (!challenge || feedback || locked) return;
    const correct = option === challenge.answer;
    setSelected(option);

    if (correct) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore((value) => value + 40 + Math.min(nextCombo, 8) * 8);
      setFeedback("richtig");
      if (activeMode === "snowball" || activeMode === "ninja") playMagicDust();
      else if (nextCombo % 5 === 0) playJingle("combo");
      else playCoin();
      onCorrect(3 + Math.min(nextCombo, 5));
      if (nextCombo % 5 === 0) confetti({ particleCount: 120, spread: 95, origin: { y: 0.65 } });
      setTimeout(nextChallenge, activeMode === "parkour" ? 980 : 760);
    } else {
      setHearts((value) => Math.max(0, value - 1));
      setCombo(0);
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 1050);
    }
  };

  if (!activeCollection || !challenge) return null;

  const renderCanvasGame = (mode) => (
    <CanvasArcadeStage
      mode={mode}
      challenge={challenge}
      collection={activeCollection}
      theme={theme}
      activeFriend={activeFriend}
      feedback={feedback}
      locked={locked}
      onPick={choose}
      roundSeed={roundSeed}
      reduceMotion={reduceMotion}
    />
  );

  const renderActiveGame = () => (activeMode === "vault" ? renderVault() : renderCanvasGame(activeMode));

  const renderLockedOverlay = () => (
    <AnimatePresence>
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 grid place-items-center rounded-[42px] bg-white/78 p-6 backdrop-blur"
        >
          <div className="max-w-md rounded-[34px] border-4 border-white bg-white p-7 text-center shadow-2xl">
            <p className="font-sans text-xs font-bold uppercase tracking-[.2em] text-slate-400">Runde</p>
            <h3 className="font-hand text-5xl font-bold text-slate-900">{score} Punkte</h3>
            <button
              type="button"
              onClick={resetRound}
              className="mt-5 rounded-full px-8 py-4 font-hand text-3xl font-bold text-white shadow-xl"
              style={{ backgroundColor: theme.accent }}
            >
              Neu starten
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderVault = () => {
    const crystals = Array.from({ length: 5 }, (_, index) => index < Math.min(combo, 5));

    return (
      <div className="relative min-h-[580px] overflow-hidden rounded-[42px] border-4 border-white shadow-2xl">
        <SceneBackground theme={theme} reduceMotion={reduceMotion} />
        <div className="relative z-20 p-4 md:p-6">
          <PromptRibbon collection={activeCollection} challenge={challenge} theme={theme} />
        </div>

        <div className="relative z-20 mx-auto mt-1 flex max-w-3xl flex-col items-center gap-5 px-4">
          <div className="flex gap-3 rounded-full border-2 border-white bg-white/76 px-5 py-3 shadow-xl">
            {crystals.map((active, index) => (
              <motion.div
                key={index}
                animate={{ scale: active ? [1, 1.12, 1] : 1, rotate: active ? [0, 10, -8, 0] : 0 }}
                transition={{ duration: 0.8 }}
                className={`grid h-12 w-12 place-items-center rounded-2xl border-2 border-white shadow-sm ${
                  active ? "bg-amber-300 text-white" : "bg-white/70 text-slate-300"
                }`}
              >
                <Star size={24} fill="currentColor" />
              </motion.div>
            ))}
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {challenge.options.map((option) => {
              const active = selected === option;
              const correct = option === challenge.answer;
              return (
                <MotionButton
                  key={`${roundSeed}-vault-${option}`}
                  type="button"
                  onClick={() => choose(option)}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className={`min-h-28 rounded-[28px] border-4 px-5 py-4 font-hand text-3xl font-bold leading-tight shadow-xl ${
                    active && feedback === "richtig" && correct
                      ? "border-emerald-200 bg-emerald-100 text-emerald-900"
                      : active && feedback === "falsch"
                        ? "border-rose-200 bg-rose-100 text-rose-900"
                        : "border-white bg-white/88 text-slate-800"
                  }`}
                >
                  {option}
                </MotionButton>
              );
            })}
          </div>
        </div>

        <motion.img
          src={activeFriend.image}
          alt=""
          className="absolute bottom-5 left-8 z-30 h-24 w-24 object-contain drop-shadow-2xl md:h-32 md:w-32"
          animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          draggable="false"
        />

        <FeedbackBurst feedback={feedback} challenge={challenge} color={theme.accent} />
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-4" data-testid={`learning-arcade-${subject}`}>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[.22em] text-slate-400">{theme.kicker}</p>
          <h2 className="mt-1 font-hand text-6xl font-bold leading-none text-slate-900">{theme.title}</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-[420px]">
          <StatPill label="Karten" value={totalItems} color={theme.accent} />
          <StatPill label="Combo" value={`${combo}x`} color="#f59e0b" />
          <StatPill label="Score" value={score} color="#10b981" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <FriendPicker friends={ANIMAL_FRIENDS} activeFriend={activeFriend} setFriendIndex={setFriendIndex} color={theme.accent} />
        <CollectionStrip collections={collections} activeCollection={activeCollection} onSelect={selectCollection} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[32px] border-2 border-white bg-white/55 p-3 shadow-inner backdrop-blur">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Spiele-Dock</p>
          <p className="font-hand text-3xl font-bold leading-none text-slate-800">{theme.modeLabels[activeMode]}</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/74 px-4 py-3 shadow-sm">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Herzen</span>
          <span className="font-hand text-3xl font-bold text-rose-500">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index} className={index < hearts ? "" : "opacity-20"}>
                ♥
              </span>
            ))}
          </span>
          <button
            type="button"
            onClick={resetRound}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white shadow-md"
            aria-label="Runde neu starten"
          >
            <RotateCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.keys(MODE_META).map((mode) => {
          const meta = MODE_META[mode];
          const Icon = meta.icon;
          const active = activeMode === mode;
          return (
            <MotionButton
              key={mode}
              type="button"
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => startFullscreenGame(mode)}
              className={`min-h-36 rounded-[32px] border-4 p-5 text-left shadow-lg transition-all ${
                active ? `${meta.color} border-white text-white ring-4 ring-white/80` : "border-white bg-white/78 text-slate-700 hover:bg-white"
              }`}
            >
              <span className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl border-2 border-white shadow-md ${active ? "bg-white/18" : `${meta.color} text-white`}`}>
                <Icon size={25} />
              </span>
              <span className="block font-hand text-4xl font-bold leading-none">{theme.modeLabels[mode]}</span>
              <span className={`mt-3 inline-flex rounded-full px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[.18em] ${active ? "bg-white/20 text-white" : "bg-slate-900 text-white"}`}>
                Vollbild
              </span>
              <span className="sr-only">{meta.description || meta.title}</span>
            </MotionButton>
          );
        })}
      </div>

      <AnimatePresence>
        {fullscreenMode && (
          <motion.div
            key="arcade-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/96 p-3 text-white md:p-5"
          >
            <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[30px] border border-white/16 bg-white/10 p-3 shadow-2xl backdrop-blur">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[.22em] text-white/45">{activeCollection.label}</p>
                  <h3 className="font-hand text-4xl font-bold leading-none text-white md:text-5xl">{theme.modeLabels[activeMode]}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl bg-white/12 px-4 py-2">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[.18em] text-white/45">Score</p>
                    <p className="font-hand text-3xl font-bold text-emerald-300">{score}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeFullscreenGame}
                    className="rounded-full bg-white px-6 py-3 font-hand text-2xl font-bold text-slate-900 shadow-xl"
                  >
                    Schließen
                  </button>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
                <FriendPicker friends={ANIMAL_FRIENDS} activeFriend={activeFriend} setFriendIndex={setFriendIndex} color={theme.accent} />
                <CollectionStrip collections={collections} activeCollection={activeCollection} onSelect={selectCollection} />
              </div>

              <div className="flex flex-wrap gap-2 rounded-[28px] border border-white/16 bg-white/10 p-2 shadow-inner backdrop-blur">
                {Object.keys(MODE_META).map((mode) => (
                  <ModeButton
                    key={mode}
                    mode={mode}
                    active={activeMode === mode}
                    label={theme.modeLabels[mode]}
                    onClick={() => selectMode(mode)}
                  />
                ))}
              </div>

              <div className="relative flex-1 pb-4">
                {renderActiveGame()}
                {renderLockedOverlay()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SceneBackground({ theme, reduceMotion, winter = false }) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,.18), rgba(15,23,42,.18)), url(${theme.background})`,
        }}
      />
      <div className={`absolute inset-0 ${winter ? "bg-sky-100/22" : "bg-white/5"}`} />
      <ArcadeSky theme={theme} reduceMotion={reduceMotion} />
      {winter && (
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/86 via-white/46 to-transparent" />
      )}
    </>
  );
}
