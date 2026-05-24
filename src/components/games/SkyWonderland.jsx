import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronLeft, ChevronRight, Cloud, Moon, RotateCcw, Sparkles, Star, Telescope, Volume2, Wand2 } from "lucide-react";
import { playCoin, playError, playInstrumentTone, playJingle, playMagicDust, playPop, playWhoosh } from "../../utils/sounds";
import { ANIMAL_FRIENDS } from "../../data/animalFriends";
import { SKY_BUCKETS, SKY_SPRITES, SKY_WONDERLAND_MODES, SKY_WONDERLAND_ROUNDS } from "./skyWonderlandData";

const ICONS = { Cloud, Moon, Sparkles, Star };
const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 987.77];
const MotionButton = motion.button;

const skyBits = Array.from({ length: 34 }, (_, index) => ({
  id: `bit-${index}`,
  x: (index * 29) % 96,
  y: (index * 47) % 88,
  delay: (index % 7) * 0.16,
  size: 2 + (index % 4),
}));

const driftSprites = [
  { src: SKY_SPRITES.cloudA, x: -4, y: 8, w: 240, duration: 18 },
  { src: SKY_SPRITES.cloudB, x: 68, y: 13, w: 190, duration: 21 },
  { src: SKY_SPRITES.cloudPeach, x: 28, y: 23, w: 210, duration: 24 },
  { src: SKY_SPRITES.sun, x: 78, y: 3, w: 138, duration: 16 },
  { src: SKY_SPRITES.rainbow, x: 55, y: 47, w: 220, duration: 20 },
  { src: SKY_SPRITES.star, x: 8, y: 42, w: 96, duration: 15 },
];

function MoonFace({ phase, large = false }) {
  const clip =
    phase === "half"
      ? "inset(0 0 0 48%)"
      : phase === "crescent"
        ? "circle(42% at 70% 50%)"
        : phase === "new"
          ? "circle(0% at 50% 50%)"
          : "circle(80% at 50% 50%)";

  return (
    <div className={`${large ? "h-40 w-40" : "h-20 w-20"} relative rounded-full bg-slate-700 shadow-inner shadow-slate-950/50`}>
      <div className="absolute inset-0 rounded-full bg-[#fff5c7] shadow-[0_0_42px_rgba(255,245,199,0.75)]" style={{ clipPath: clip }} />
      <div className="absolute left-[28%] top-[32%] h-2 w-2 rounded-full bg-amber-200/60" />
      <div className="absolute left-[52%] top-[55%] h-3 w-3 rounded-full bg-amber-200/50" />
    </div>
  );
}

function SkyStage({ round, friend, friendX, friendDirection, friendHop, children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative min-h-[620px] overflow-hidden rounded-[34px] border border-white/30 bg-gradient-to-br ${round.sky} shadow-2xl`}
      style={{
        backgroundImage: round.background ? `linear-gradient(180deg, rgba(255,255,255,.02), rgba(20,31,68,.14)), url(${round.background})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.26),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0),rgba(15,23,42,.18))]" />
      <motion.div
        className="absolute -left-24 top-10 h-56 w-[calc(100%+12rem)] rounded-full blur-3xl"
        style={{ backgroundColor: round.glow, opacity: 0.38 }}
        animate={shouldReduceMotion ? undefined : { x: [-16, 18, -16], scaleY: [1, 1.18, 1] }}
        transition={{ duration: 9, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
      />
      {driftSprites.map((sprite, index) => (
        <motion.img
          key={`${round.id}-${sprite.src}-${index}`}
          src={sprite.src}
          alt=""
          draggable="false"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute select-none drop-shadow-2xl"
          style={{ left: `${sprite.x}%`, top: `${sprite.y}%`, width: sprite.w }}
          animate={shouldReduceMotion ? undefined : { x: [0, index % 2 ? -18 : 20, 0], y: [0, index % 2 ? 8 : -10, 0], rotate: [0, index % 2 ? -2 : 2, 0] }}
          transition={{ duration: sprite.duration, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        />
      ))}
      {skyBits.map((bit) => (
        <motion.span
          key={bit.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${bit.x}%`, top: `${bit.y}%`, width: bit.size, height: bit.size }}
          animate={shouldReduceMotion ? undefined : { opacity: [0.25, 0.9, 0.25], scale: [1, 1.8, 1] }}
          transition={{ duration: 2.6, repeat: shouldReduceMotion ? 0 : Infinity, delay: bit.delay }}
        />
      ))}
      {round.foreground ? (
        <img
          src={round.foreground}
          alt=""
          draggable="false"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute bottom-0 right-0 max-h-[230px] w-auto max-w-[54%] select-none object-contain opacity-90 drop-shadow-2xl"
        />
      ) : null}
      {friend ? (
        <motion.div
          className="pointer-events-none absolute bottom-5 z-20 -translate-x-1/2"
          initial={{ opacity: 0, left: `${friendX}%` }}
          animate={{ opacity: 1, left: `${friendX}%` }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
        >
          <motion.div
            className="relative"
            animate={
              shouldReduceMotion
                ? { y: 0, rotate: 0, scale: 1 }
                : {
                    y: friendHop ? [0, -30, 0, -10, 0] : [0, -8, 0],
                    rotate: friendHop ? [0, friendDirection * 5, 0] : [friendDirection * 1.5, friendDirection * -1, friendDirection * 1.5],
                    scale: friendHop ? [1, 1.06, 1] : 1,
                  }
            }
            transition={{ duration: friendHop ? 0.62 : 4.5, repeat: friendHop || shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          >
            <div className="absolute bottom-1 left-1/2 h-8 w-28 -translate-x-1/2 rounded-full bg-slate-950/22 blur-md md:w-36" />
            <img
              src={friend.image}
              alt={friend.name}
              draggable="false"
              decoding="async"
              className="relative h-44 w-44 object-contain md:h-56 md:w-56"
              style={{ filter: "drop-shadow(0 18px 20px rgba(15, 23, 42, 0.22)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />
      <div className="relative z-10 h-full min-h-[620px]">{children}</div>
    </div>
  );
}

function ModeIcon({ name, className = "h-6 w-6" }) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon className={className} strokeWidth={2.4} />;
}

export default function SkyWonderland({
  title = "Himmelswunderland",
  rounds = SKY_WONDERLAND_ROUNDS,
  onCorrect = () => {},
  onWrong = () => {},
}) {
  const [mode, setMode] = useState("constellation");
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pickedStars, setPickedStars] = useState([]);
  const [sortedClouds, setSortedClouds] = useState({});
  const [activeCloudId, setActiveCloudId] = useState(null);
  const [moonPick, setMoonPick] = useState(null);
  const [cometStep, setCometStep] = useState(0);
  const [rainbowStep, setRainbowStep] = useState(0);
  const [foundTreasures, setFoundTreasures] = useState([]);
  const [friendId, setFriendId] = useState(ANIMAL_FRIENDS[0].id);
  const [friendX, setFriendX] = useState(24);
  const [friendDirection, setFriendDirection] = useState(1);
  const [friendHop, setFriendHop] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const round = rounds[roundIndex % rounds.length] || SKY_WONDERLAND_ROUNDS[0];
  const activeFriend = ANIMAL_FRIENDS.find((friend) => friend.id === friendId) || ANIMAL_FRIENDS[0];
  const sortedCount = Object.keys(sortedClouds).length;
  const currentCloud = round.clouds.find((cloud) => cloud.id === activeCloudId) || round.clouds.find((cloud) => !sortedClouds[cloud.id]);
  const cometPath = useMemo(() => round.comets.slice(0, cometStep + 1), [cometStep, round.comets]);

  const award = (points = 1) => {
    setScore((value) => value + points);
    onCorrect(points);
  };

  const resetBoard = (nextRound = roundIndex) => {
    playWhoosh();
    setRoundIndex(nextRound);
    setPickedStars([]);
    setSortedClouds({});
    setActiveCloudId(null);
    setMoonPick(null);
    setCometStep(0);
    setRainbowStep(0);
    setFoundTreasures([]);
    setFeedback(null);
  };

  const switchMode = (nextMode) => {
    playPop();
    setMode(nextMode);
    resetBoard(roundIndex);
  };

  const nextSky = () => {
    resetBoard((roundIndex + 1) % rounds.length);
  };

  const celebrate = (message) => {
    setFeedback(message);
    playJingle("levelUp");
    confetti({ particleCount: 120, spread: 96, origin: { y: 0.68 } });
  };

  const chooseStar = (star) => {
    if (pickedStars.includes(star.id)) return;
    const expected = round.constellation.order[pickedStars.length];

    if (star.id !== expected) {
      playError();
      setFeedback("Noch ein Funkeln suchen");
      onWrong();
      setTimeout(() => setFeedback(null), 900);
      return;
    }

    const nextPicked = [...pickedStars, star.id];
    setPickedStars(nextPicked);
    playInstrumentTone("glockenspiel", NOTES[nextPicked.length - 1] || 1046.5, { velocity: 0.72, send: 0.32 });
    award(1);

    if (nextPicked.length === round.constellation.order.length) {
      setTimeout(() => celebrate(round.constellation.title), 280);
    }
  };

  const sortCloud = (bucketId) => {
    if (!currentCloud) return;

    if (currentCloud.bucket !== bucketId) {
      playError();
      setFeedback("Andere Schale");
      onWrong();
      setTimeout(() => setFeedback(null), 850);
      return;
    }

    const nextSorted = { ...sortedClouds, [currentCloud.id]: bucketId };
    setSortedClouds(nextSorted);
    setActiveCloudId(null);
    playCoin();
    award(2);

    if (Object.keys(nextSorted).length === round.clouds.length) {
      setTimeout(() => celebrate("Wolken klar"), 240);
    }
  };

  const chooseMoon = (choice) => {
    setMoonPick(choice.label);

    if (choice.label !== round.moon.answer) {
      playError();
      setFeedback("Mond dreht sich");
      onWrong();
      setTimeout(() => {
        setMoonPick(null);
        setFeedback(null);
      }, 900);
      return;
    }

    playMagicDust();
    award(3);
    setTimeout(() => celebrate(choice.label), 260);
  };

  const touchComet = (point, index) => {
    if (index !== cometStep) {
      playError();
      setFeedback("Der nächste Schweifpunkt");
      onWrong();
      setTimeout(() => setFeedback(null), 850);
      return;
    }

    playInstrumentTone("traum", NOTES[index] || 1046.5, { velocity: 0.62, send: 0.48 });
    const nextStep = cometStep + 1;
    setCometStep(nextStep);
    award(1);

    if (nextStep >= round.comets.length) {
      setTimeout(() => celebrate("Kometenflug"), 260);
    }
  };

  const chooseRainbow = (label, index) => {
    if (index !== rainbowStep) {
      playError();
      setFeedback("Farbe später");
      onWrong();
      setTimeout(() => setFeedback(null), 800);
      return;
    }

    playInstrumentTone("glockenspiel", NOTES[index] || 1046.5, { velocity: 0.7, send: 0.34 });
    setRainbowStep(index + 1);
    award(1);
    if (index + 1 >= round.rainbow.length) {
      setTimeout(() => celebrate(label), 220);
    }
  };

  const pickTreasure = (item) => {
    if (foundTreasures.includes(item.id)) return;

    if (!item.answer) {
      playError();
      setFeedback("Bleibt liegen");
      onWrong();
      setTimeout(() => setFeedback(null), 850);
      return;
    }

    playMagicDust();
    const next = [...foundTreasures, item.id];
    setFoundTreasures(next);
    award(2);
    if (next.length >= round.treasures.filter((treasure) => treasure.answer).length) {
      setTimeout(() => celebrate("Schatz hell"), 260);
    }
  };

  const chooseFriend = (friend) => {
    setFriendId(friend.id);
    playPop();
  };

  const moveFriend = (direction) => {
    setFriendDirection(direction);
    setFriendX((value) => Math.max(24, Math.min(76, value + direction * 8)));
    playWhoosh();
  };

  const hopFriend = () => {
    setFriendHop(true);
    setTimeout(() => setFriendHop(false), 700);
    playPop();
  };

  const renderConstellation = () => (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="sky-line" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#fff4a3" />
            <stop offset="100%" stopColor={round.accent} />
          </linearGradient>
        </defs>
        {pickedStars.slice(1).map((id, index) => {
          const from = round.constellation.stars.find((star) => star.id === pickedStars[index]);
          const to = round.constellation.stars.find((star) => star.id === id);
          if (!from || !to) return null;
          return <line key={`${from.id}-${to.id}`} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`} stroke="url(#sky-line)" strokeWidth="4" strokeLinecap="round" opacity="0.88" />;
        })}
      </svg>
      {round.constellation.stars.map((star) => {
        const active = pickedStars.includes(star.id);
        const next = star.id === round.constellation.order[pickedStars.length];
        return (
          <MotionButton
            key={star.id}
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => chooseStar(star)}
            className={`absolute grid place-items-center rounded-full ${active ? "bg-amber-200 text-amber-700" : next ? "bg-white text-amber-500" : "bg-white/60 text-white"} shadow-[0_0_24px_rgba(255,255,255,0.72)]`}
            style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size * 2.2, height: star.size * 2.2 }}
            aria-label="Stern"
          >
            <Star className="h-5 w-5 fill-current" />
          </MotionButton>
        );
      })}
      <div className="absolute left-5 top-5 rounded-3xl bg-white/18 px-5 py-4 text-white backdrop-blur-md">
        <p className="font-hand text-4xl font-bold leading-none">{round.constellation.title}</p>
        <p className="font-sans text-xs font-bold uppercase tracking-[0.26em] text-white/70">{pickedStars.length}/{round.constellation.order.length}</p>
      </div>
    </div>
  );

  const renderClouds = () => (
    <div className="absolute inset-0 p-5">
      {round.clouds.map((cloud) => {
        const done = sortedClouds[cloud.id];
        if (done) return null;
        const active = currentCloud?.id === cloud.id;
        return (
          <MotionButton
            key={cloud.id}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.08 }}
            whileHover={{ y: -5 }}
            onClick={() => {
              setActiveCloudId(cloud.id);
              playPop();
            }}
            className={`absolute grid h-32 w-44 place-items-center rounded-[42px] border border-white/60 bg-white/78 shadow-xl backdrop-blur-md transition ${active ? "ring-4 ring-amber-200" : ""}`}
            style={{ left: `${cloud.x}%`, top: `${cloud.y}%` }}
          >
            <img src={cloud.bucket === "Regen" ? SKY_SPRITES.rain : cloud.bucket === "Sonne" ? SKY_SPRITES.sun : cloud.bucket === "Schnee" ? SKY_SPRITES.cloudB : SKY_SPRITES.rainbow} alt="" className="h-20 w-20 object-contain" />
            <span className="-mt-4 text-4xl">{cloud.icon}</span>
          </MotionButton>
        );
      })}

      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {SKY_BUCKETS.map((bucket) => (
          <MotionButton
            key={bucket.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => sortCloud(bucket.id)}
            className={`min-h-24 rounded-[26px] border-2 px-4 py-3 text-left shadow-lg ${bucket.color}`}
          >
            <span className="block text-4xl">{bucket.icon}</span>
            <span className="font-hand text-3xl font-bold">{bucket.id}</span>
          </MotionButton>
        ))}
      </div>
      <div className="absolute left-5 top-5 rounded-3xl bg-white/18 px-5 py-4 text-white backdrop-blur-md">
        <p className="font-hand text-4xl font-bold leading-none">{sortedCount}/{round.clouds.length}</p>
      </div>
    </div>
  );

  const renderMoon = () => (
    <div className="absolute inset-0 grid place-items-center p-6">
      <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="grid place-items-center rounded-full bg-white/14 p-8 backdrop-blur-sm">
        <img src={SKY_SPRITES.moon} alt="" className="absolute h-48 w-48 object-contain opacity-55 blur-[1px]" />
        <MoonFace large phase={round.moon.choices.find((choice) => choice.label === round.moon.answer)?.phase} />
      </motion.div>
      <div className="absolute bottom-8 left-5 right-5 grid grid-cols-3 gap-3">
        {round.moon.choices.map((choice) => {
          const active = moonPick === choice.label;
          return (
            <MotionButton
              key={choice.label}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => chooseMoon(choice)}
              className={`grid min-h-32 place-items-center rounded-[28px] border border-white/70 bg-white/78 p-3 shadow-xl backdrop-blur-md ${active ? "ring-4 ring-amber-200" : ""}`}
            >
              <MoonFace phase={choice.phase} />
              <span className="font-hand text-2xl font-bold text-slate-700">{choice.label}</span>
            </MotionButton>
          );
        })}
      </div>
    </div>
  );

  const renderComets = () => (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={cometPath.map((point) => `${point.x},${point.y}`).join(" ")} vectorEffect="non-scaling-stroke" fill="none" stroke="#fff4a3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.78" />
      </svg>
      {round.comets.map((point, index) => {
        const done = index < cometStep;
        const next = index === cometStep;
        return (
          <MotionButton
            key={point.id}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => touchComet(point, index)}
            className={`absolute grid h-16 w-16 place-items-center rounded-full shadow-[0_0_28px_rgba(255,255,255,0.72)] ${done ? "bg-amber-200 text-amber-700" : next ? "bg-white text-cyan-500" : "bg-white/35 text-white/70"}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label="Kometenpunkt"
          >
            {done ? <Sparkles className="h-7 w-7 fill-current" /> : <span className="h-3 w-3 rounded-full bg-current" />}
          </MotionButton>
        );
      })}
      {cometStep > 0 && (
        <motion.div
          className="absolute h-12 w-28 rounded-full bg-gradient-to-r from-transparent via-white/80 to-amber-200 blur-sm"
          style={{ left: `${round.comets[Math.min(cometStep - 1, round.comets.length - 1)].x - 7}%`, top: `${round.comets[Math.min(cometStep - 1, round.comets.length - 1)].y + 1}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.9, scale: 1 }}
        />
      )}
      <div className="absolute left-5 top-5 rounded-3xl bg-white/18 px-5 py-4 text-white backdrop-blur-md">
        <p className="font-hand text-4xl font-bold leading-none">{cometStep}/{round.comets.length}</p>
      </div>
    </div>
  );

  const renderRainbow = () => (
    <div className="absolute inset-0 p-5">
      <img src={SKY_SPRITES.rainbow} alt="" className="pointer-events-none absolute left-1/2 top-10 w-[min(760px,78%)] -translate-x-1/2 object-contain drop-shadow-2xl" />
      <div className="absolute inset-x-5 bottom-7 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {round.rainbow.map((label, index) => {
          const done = index < rainbowStep;
          const next = index === rainbowStep;
          const colors = ["bg-pink-300", "bg-orange-300", "bg-yellow-300", "bg-emerald-300", "bg-sky-300", "bg-violet-300"];
          return (
            <MotionButton
              key={`${label}-${index}`}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => chooseRainbow(label, index)}
              className={`min-h-28 rounded-[30px] border-4 border-white px-4 py-4 shadow-xl ${colors[index % colors.length]} ${next ? "ring-4 ring-white" : ""} ${done ? "opacity-70" : ""}`}
            >
              <span className="font-hand text-4xl font-bold leading-none text-white drop-shadow-sm">{label}</span>
            </MotionButton>
          );
        })}
      </div>
      <div className="absolute left-5 top-5 rounded-3xl bg-white/20 px-5 py-4 text-white backdrop-blur-md">
        <p className="font-hand text-4xl font-bold leading-none">{rainbowStep}/{round.rainbow.length}</p>
      </div>
    </div>
  );

  const renderTreasure = () => (
    <div className="absolute inset-0 p-5">
      <img src={SKY_SPRITES.treasure} alt="" className="pointer-events-none absolute inset-x-0 top-2 mx-auto h-[270px] w-auto max-w-[88%] rounded-[36px] object-cover opacity-90 shadow-2xl" />
      <div className="absolute inset-x-5 bottom-7 grid grid-cols-2 gap-4 md:grid-cols-4">
        {round.treasures.map((item) => {
          const found = foundTreasures.includes(item.id);
          return (
            <MotionButton
              key={item.id}
              whileHover={{ y: -5, scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => pickTreasure(item)}
              className={`min-h-40 rounded-[34px] border-4 border-white bg-white/78 p-4 shadow-xl backdrop-blur-md ${found ? "ring-4 ring-emerald-200" : ""}`}
            >
              <img src={item.sprite} alt="" className="mx-auto h-24 w-24 object-contain drop-shadow-xl" />
              <span className="mt-2 block font-hand text-3xl font-bold text-slate-700">{item.label}</span>
            </MotionButton>
          );
        })}
      </div>
      <div className="absolute left-5 top-5 rounded-3xl bg-white/20 px-5 py-4 text-white backdrop-blur-md">
        <p className="font-hand text-4xl font-bold leading-none">{foundTreasures.length}/{round.treasures.filter((item) => item.answer).length}</p>
      </div>
    </div>
  );

  const gameView = {
    constellation: renderConstellation,
    clouds: renderClouds,
    moon: renderMoon,
    comets: renderComets,
    rainbow: renderRainbow,
    treasure: renderTreasure,
  }[mode];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Telescope className="h-5 w-5" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.28em]">{round.name}</span>
          </div>
          <h2 className="font-hand text-5xl font-bold leading-none text-slate-800 md:text-7xl">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => playJingle("calm")} className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md" aria-label="Klang">
            <Volume2 className="h-5 w-5" />
          </button>
          <button onClick={() => resetBoard(roundIndex)} className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md" aria-label="Neu starten">
            <RotateCcw className="h-5 w-5" />
          </button>
          <button onClick={nextSky} className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-md" aria-label="Nächster Himmel">
            <Wand2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {SKY_WONDERLAND_MODES.map((item) => {
          const active = item.id === mode;
          return (
            <MotionButton
              key={item.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => switchMode(item.id)}
              className={`flex min-h-20 items-center gap-3 rounded-[24px] border px-4 py-3 text-left shadow-lg transition ${active ? "border-slate-900 bg-slate-900 text-white" : "border-white bg-white/75 text-slate-600 hover:bg-white"}`}
            >
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${active ? "bg-white/18" : "bg-slate-100"}`}>
                <ModeIcon name={item.icon} />
              </span>
              <span className="font-hand text-3xl font-bold leading-none">{item.label}</span>
            </MotionButton>
          );
        })}
      </div>

      <div className="flex snap-x gap-5 overflow-x-auto rounded-[32px] border border-white/45 bg-white/25 px-4 py-4 shadow-inner backdrop-blur-sm">
        {ANIMAL_FRIENDS.map((friend) => {
          const active = friend.id === friendId;
          return (
            <button
              key={friend.id}
              type="button"
              onClick={() => chooseFriend(friend)}
              aria-label={friend.name}
              className={`snap-start min-w-[76px] rounded-[24px] border border-transparent px-1 py-1 transition hover:-translate-y-1 hover:scale-[1.03] active:scale-95 ${active ? "text-slate-900" : "text-slate-600"}`}
            >
              <span className="relative grid h-24 w-24 place-items-center">
                {active ? <span className="absolute bottom-2 h-7 w-16 rounded-full bg-sky-200/55 blur-md" /> : null}
                <img
                  src={friend.image}
                  alt=""
                  className={`relative h-24 w-24 object-contain transition ${active ? "scale-110" : ""}`}
                  style={{ filter: "drop-shadow(0 7px 8px rgba(15, 23, 42, 0.18))" }}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className={`block text-center font-hand text-2xl font-bold ${active ? "text-sky-700" : "text-slate-700"}`}>{friend.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => moveFriend(-1)} className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md" aria-label="Nach links" title="Nach links">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={hopFriend} className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-md" aria-label="Hüpfen" title="Hüpfen">
          <Sparkles className="h-5 w-5" />
        </button>
        <button onClick={() => moveFriend(1)} className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md" aria-label="Nach rechts" title="Nach rechts">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <SkyStage round={round} friend={activeFriend} friendX={friendX} friendDirection={friendDirection} friendHop={friendHop}>
        {gameView?.()}
      </SkyStage>

      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="h-3 overflow-hidden rounded-full bg-white shadow-inner">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-rose-300" animate={{ width: `${Math.min(100, score * 7)}%` }} />
        </div>
        <div className="rounded-full bg-white px-5 py-2 font-hand text-3xl font-bold text-slate-800 shadow-md">{score}</div>
      </div>

      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto rounded-full bg-white px-7 py-3 text-center font-hand text-3xl font-bold text-slate-700 shadow-lg"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
