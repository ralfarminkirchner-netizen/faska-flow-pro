import { lazy, Suspense, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../utils/sounds";
import { LumiSvg } from "../components/Mascot";
import RuheInsel from "../components/games/RuheInsel";
import GrenzenGarten from "../components/games/GrenzenGarten";
import VariantStudio from "../components/games/VariantStudio";
import ActionArena from "../components/games/ActionArena";
import GameWorld from "../components/games/GameWorld";
import QuestMixer from "../components/games/QuestMixer";
import { SUBJECT_VARIANT_CONTENT } from "../data/learningContent";

const SubjectPremiumAtelier = lazy(() => import("../components/games/SubjectPremiumAtelier"));
const SkyWonderland = lazy(() => import("../components/games/SkyWonderland"));
const DeepLearningQuest = lazy(() => import("../components/games/DeepLearningQuest"));
const LearningArcade = lazy(() => import("../components/games/LearningArcade"));

// ==========================================
// 1. REAKTIONS-BÜHNE (SOCIAL STAGE)
// ==========================================
const socialActions = [
  { id: "hug", name: "Trösten", emoji: "🫂", color: "#fca5a5" },
  { id: "laugh", name: "Auslachen", emoji: "😂", color: "#f87171" },
  { id: "listen", name: "Zuhören", emoji: "👂", color: "#60a5fa" },
  { id: "ignore", name: "Ignorieren", emoji: "😶", color: "#94a3b8" }
];

function ReactionStage() {
  const [avatarState, setAvatarState] = useState("sad"); // sad, happy, angry, lonely
  const [feedbackText, setFeedbackText] = useState("Dein Freund sitzt alleine in der Ecke und starrt auf den Boden.");
  
  const handleDrop = (action) => {
    playPop();
    switch (action.id) {
      case "hug":
        setAvatarState("happy");
        setFeedbackText("Du nimmst ihn in den Arm. Er lächelt wieder! Ein bisschen Wärme hilft fast immer.");
        playSparkle();
        confetti();
        break;
      case "laugh":
        setAvatarState("angry");
        setFeedbackText("Du lachst ihn aus. Er wird rot vor Wut und fühlt sich noch schlechter.");
        playError();
        break;
      case "listen":
        setAvatarState("happy");
        setFeedbackText("Du hörst ihm zu. Er erzählt dir, was los ist, und fühlt sich direkt besser.");
        playSparkle();
        break;
      case "ignore":
        setAvatarState("lonely");
        setFeedbackText("Du gehst einfach weg. Er bleibt ganz alleine mit seinem Problem.");
        break;
      default: break;
    }
  };

  const getAvatarStyles = () => {
    switch (avatarState) {
      case "sad": return { bg: "bg-blue-100", border: "border-blue-300", emoji: "😞", scale: 1, rotate: 0 };
      case "happy": return { bg: "bg-pink-100", border: "border-pink-300", emoji: "😊", scale: 1.1, rotate: [0, -5, 5, 0] };
      case "angry": return { bg: "bg-red-200", border: "border-red-500", emoji: "😠", scale: 1.2, rotate: [-10, 10, -10, 10, 0] };
      case "lonely": return { bg: "bg-slate-200", border: "border-slate-400", emoji: "🥶", scale: 0.9, rotate: 0 };
    }
  };

  const styles = getAvatarStyles();

  return (
    <div className="flex flex-col lg:flex-row gap-12 py-8 h-full">
      
      {/* THE STAGE */}
      <div className="w-full lg:w-2/3 flex flex-col items-center gap-8">
        <h3 className="font-hand text-3xl text-slate-700 font-bold">Die Bühne des Miteinanders</h3>
        
        <div 
          className="relative w-full aspect-video bg-white/50 rounded-[50px] border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden watercolor-effect"
          onDragOver={e => e.preventDefault()}
          onDrop={(e) => {
            const data = e.dataTransfer.getData("text/plain");
            const action = socialActions.find(a => a.id === data);
            if (action) handleDrop(action);
          }}
        >
          {/* Spotlight Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/10 pointer-events-none" />

          {/* Character */}
          <motion.div 
            animate={{ scale: styles.scale, rotate: styles.rotate }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`w-40 h-40 rounded-[40px] border-8 ${styles.bg} ${styles.border} flex items-center justify-center text-7xl shadow-xl transition-colors duration-500`}
          >
            {styles.emoji}
          </motion.div>
        </div>

        <div className="bg-slate-800 text-slate-100 p-6 rounded-3xl w-full text-center shadow-lg min-h-[100px] flex items-center justify-center">
          <p className="font-hand text-2xl tracking-wide">{feedbackText}</p>
        </div>
        
        {avatarState !== "sad" && (
          <button onClick={() => {setAvatarState("sad"); setFeedbackText("Dein Freund sitzt alleine in der Ecke und starrt auf den Boden.");}} className="font-hand text-xl text-slate-400 hover:text-slate-600">Szene neustarten</button>
        )}
      </div>

      {/* ORB INVENTORY */}
      <div className="w-full lg:w-1/3 bg-slate-100/50 p-8 rounded-[40px] border-4 border-white flex flex-col gap-6">
        <h3 className="font-hand text-2xl font-bold text-slate-600 border-b pb-2">Was tun? (Zieh mich)</h3>
        <div className="flex flex-col gap-4">
          {socialActions.map(action => (
            <motion.div
              key={action.id} draggable whileHover={{ scale: 1.05 }}
              onDragStart={(e) => e.dataTransfer.setData("text/plain", action.id)}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl cursor-grab active:cursor-grabbing shadow-md border-2 border-slate-100"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner" style={{ backgroundColor: action.color }}>
                {action.emoji}
              </div>
              <span className="font-hand text-2xl font-bold text-slate-700">{action.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}


// ==========================================
// 2. GEFÜHLS-ALCHEMIE (EMOTION MIXER)
// ==========================================
const basicEmotions = [
  { id: "angst", name: "Angst", emoji: "😨", color: "#d8b4fe" },
  { id: "ekel", name: "Ekel", emoji: "🤢", color: "#86efac" },
  { id: "freude", name: "Freude", emoji: "😄", color: "#fde047" },
  { id: "mudigkeit", name: "Müdigkeit", emoji: "🥱", color: "#cbd5e1" },
  { id: "neugier", name: "Neugier", emoji: "🧐", color: "#67e8f9" },
  { id: "trauer", name: "Trauer", emoji: "😢", color: "#93c5fd" },
  { id: "uberraschung", name: "Überraschung", emoji: "😯", color: "#f9a8d4" },
  { id: "wut", name: "Wut", emoji: "😡", color: "#fca5a5" },
];

const recipes = {
  "angst,wut": { name: "Panik", emoji: "😱", color: "#c084fc", text: "Große Angst gemischt mit der Wut, die Kontrolle verloren zu haben. Wenn das passiert, atme dreimal ganz tief durch deinen Bauch ein und aus. Du bist sicher." },
  "angst,freude": { name: "Nervosität", emoji: "😬", color: "#fca5a5", text: "Man freut sich auf etwas, hat aber gleichzeitig auch etwas Angst davor (wie vor einer Achterbahnfahrt!). Das ist okay, Nervosität bedeutet, dass dir etwas wichtig ist." },
  "trauer,wut": { name: "Frustration", emoji: "😫", color: "#fb923c", text: "Wenn man traurig ist, dass etwas nicht klappt, und wütend darüber wird. Frustration ist wie ein dicker Knoten. Hol dir Hilfe oder mach kurz eine kleine Pause, dann löst er sich oft von selbst!" },
  "freude,trauer": { name: "Nostalgie", emoji: "🥹", color: "#a7f3d0", text: "Schöne Erinnerungen an früher, die uns lächeln lassen, aber wir vermissen sie auch. Erinnerst du dich an einen wirklich schönen Moment?" },
  "ekel,wut": { name: "Abneigung", emoji: "😤", color: "#bef264", text: "Wenn du etwas ganz furchtbar findest und wütend bist, dass es da ist. Setze sanft, aber bestimmt eine Grenze: 'Nein danke, das mag ich nicht!'" },
  "freude,uberraschung": { name: "Begeisterung", emoji: "🤩", color: "#fde047", text: "Ein riesiges, plötzliches 'Wow!'. Begeisterung ist so hell wie die Sonne. Mit wem teilst du deine schönen Momente am liebsten?" },
  "mudigkeit,wut": { name: "Gerechtfertigter Griesgram", emoji: "😒", color: "#94a3b8", text: "Wenn der Körper Pause braucht, haben wir keine Energie für Geduld. Da wird man schnell wütend. Ein kleines Nickerchen bewirkt oft Wunder!" },
  "angst,ekel": { name: "Abscheu", emoji: "🤮", color: "#4ade80", text: "Man möchte etwas gar nicht berühren, aus Angst, dass es einem nicht guttut. Dein Bauchgefühl beschützt dich." },
  "angst,trauer": { name: "Verzweiflung", emoji: "😭", color: "#64748b", text: "Ein ganz schweres Gefühl, als gäbe es keinen Ausweg. Aber denk immer dran: Auf jeden Regen folgt irgendwann ein Regenbogen. Sprich mit jemandem darüber!" },
  "mudigkeit,trauer": { name: "Erschöpfung", emoji: "🤕", color: "#9ca3af", text: "Wenn alles zu viel war. Dein Kopf und dein Herz müssen rasten. Eine warme Decke und ein Kakao sind jetzt genau das Richtige." },
  "neugier,uberraschung": { name: "Faszination", emoji: "🤯", color: "#7dd3fc", text: "Wenn die Welt so spannend ist, dass wir große Augen machen. Bewahre dir diese staunenden Augen, die Welt ist voller Wunder!" },
  "freude,wut": { name: "Schadenfreude", emoji: "🤭", color: "#fcd34d", text: "Über jemanden lachen, dem etwas Dummes passiert ist. Kurz fühlt es sich lustig an, aber eigentlich ist es nicht nett. Trösten macht viel glücklicher!" },
  "trauer,uberraschung": { name: "Schock", emoji: "🫢", color: "#e2e8f0", text: "Wenn plötzlich etwas Trauriges passiert, auf das wir gar nicht vorbereitet waren. Nimm dir Zeit, es zu verstehen. Du musst nicht sofort wissen, was du fühlst." },
  "ekel,freude": { name: "Quatsch-Ekel", emoji: "🤪", color: "#d9f99d", text: "Wenn etwas eigentlich eklig ist, man aber trotzdem darüber lachen muss (wie Pups-Witze!). Manchmal ist Quatsch machen tut uns einfach gut." },
  "angst,neugier": { name: "Mut", emoji: "🦸", color: "#fbbf24", text: "Man hat zwar große Angst, aber die Neugier ist noch größer, also probiert man es trotzdem! Mutig sein heißt nicht, keine Angst zu haben. Sondern es zu tun, OBWOHL man Angst hat." },
  "freude,neugier": { name: "Entdeckergeist", emoji: "🧭", color: "#86efac", text: "Du hast richtig Lust, etwas Neues zu lernen! Die Welt ist wie ein riesiger Abenteuerspielplatz." },
  // Neu & Raffiniert
  "ekel,trauer": { name: "Melancholie", emoji: "🌫️", color: "#94a3b8", text: "Ein graues Gefühl, wenn man sich von der Welt etwas zurückziehen möchte. Das ist okay, auch Wolken gehören zum Himmel." },
  "neugier,trauer": { name: "Nachdenklichkeit", emoji: "🤔", color: "#818cf8", text: "Wenn du über etwas Trauriges nachdenkst, um es zu verstehen. Dein Verstand hilft deinem Herzen." },
  "freude,mudigkeit": { name: "Zufriedenheit", emoji: "😌", color: "#bef264", text: "Nach einem langen Tag voller Spiel und Spaß einfach nur ausruhen. Das ist ein warmes, weiches Gefühl." },
  "ekel,neugier": { name: "Argwohn", emoji: "🤨", color: "#a3e635", text: "Etwas sieht komisch aus, aber du willst trotzdem wissen, was es ist. Sei vorsichtig, aber bleib aufmerksam!" },
  "neugier,wut": { name: "Ehrgeiz", emoji: "⚡", color: "#f87171", text: "Wenn etwas nicht klappt und du wütend wirst, es aber UNBEDINGT schaffen willst. Nutze die Energie der Wut, um es nochmal zu probieren!" },
  "angst,uberraschung": { name: "Erschrecken", emoji: "🫨", color: "#e2e8f0", text: "Huch! Das kam unerwartet. Atme kurz durch, der Schreck verfliegt meistens schnell." },
  "mudigkeit,uberraschung": { name: "Verwirrung", emoji: "😵", color: "#cbd5e1", text: "Wenn man zu müde ist, um zu verstehen, was gerade passiert ist. Ruh dich erst mal aus." },
  "ekel,uberraschung": { name: "Abscheu", emoji: "🤮", color: "#4ade80", text: "Ih, das war eklig UND kam plötzlich! Schnell Hände waschen und an etwas Schönes denken." },
  "freude,ekel": { name: "Kichern", emoji: "🤭", color: "#fef08a", text: "Eigentlich eklig, aber irgendwie auch lustig. Ein bisschen Quatsch muss sein!" },
  "trauer,mudigkeit": { name: "Erschöpfung", emoji: "💤", color: "#94a3b8", text: "Dein Herz und dein Körper brauchen eine Pause. Morgen sieht die Welt schon wieder anders aus." },
  
  // Doppelte Emotionen (Spiegel-Kombinationen)
  "freude,freude": { name: "Euphorie", emoji: "🎊", color: "#fde047", text: "Pures Glück! Du möchtest die ganze Welt umarmen. Genieße diesen Moment!" },
  "wut,wut": { name: "Zorn", emoji: "🌋", color: "#ef4444", text: "Wie ein Vulkan! Die Wut ist riesig. Stampf fest auf den Boden oder schrei in ein Kissen, um den Druck abzulassen." },
  "trauer,trauer": { name: "Tiefer Kummer", emoji: "🌧️", color: "#60a5fa", text: "Ein sehr schweres Herz. Es ist okay zu weinen, Tränen waschen die Seele sauber." },
  "angst,angst": { name: "Panik", emoji: "😱", color: "#a855f7", text: "Wenn die Angst dich ganz fest im Griff hat. Such dir eine Hand zum Halten, du bist nicht allein." },
  "neugier,neugier": { name: "Wissensdurst", emoji: "📚", color: "#22d3ee", text: "Du willst alles wissen! Die Welt hat keine Geheimnisse vor dir. Frag Löcher in den Bauch!" },
  "mudigkeit,mudigkeit": { name: "Tiefschlaf", emoji: "😴", color: "#475569", text: "Dein Akku ist leer. Zeit für das Land der Träume. Gute Nacht!" },
  "ekel,ekel": { name: "Ekelpaket", emoji: "🤢", color: "#166534", text: "Das ist wirklich, wirklich bäh! Geh weg davon und such dir etwas Schönes zum Anschauen." },
  "uberraschung,uberraschung": { name: "Sprachlosigkeit", emoji: "😶", color: "#f472b6", text: "Da fehlen einem glatt die Worte! Manchmal ist Stille die beste Antwort auf ein Wunder." }
};

// ==========================================
// 2.5 LUMIS ECKCHEN (DAILY REFLECTION)
// ==========================================
const dailyWisdoms = [
  { text: "Heute ist ein guter Tag, um jemanden anzulächeln.", prompt: "Wem hast du heute schon ein Lächeln geschenkt?" },
  { text: "Kleine Taten der Höflichkeit machen die Welt heller.", prompt: "Hast du heute schon 'Bitte' oder 'Danke' gesagt?" },
  { text: "Jeder von uns ist ein Puzzleteil in einem großen Ganzen.", prompt: "Was macht dich heute besonders einzigartig?" },
  { text: "Zuhören ist wie das Öffnen eines Geschenks.", prompt: "Wem hast du heute ganz aufmerksam zugehört?" },
  { text: "Es ist okay, Pausen zu machen, wenn man müde ist.", prompt: "Was hat dir heute geholfen, zur Ruhe zu kommen?" }
];

function LumisCorner() {
  const [dayIndex] = useState(new Date().getDate() % dailyWisdoms.length);
  const wisdom = dailyWisdoms[dayIndex];

  return (
    <div className="flex flex-col items-center gap-10 py-12 text-center max-w-2xl mx-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative bg-amber-50 p-10 rounded-[60px] border-8 border-white shadow-2xl watercolor-effect"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-amber-200 overflow-hidden p-2">
           <LumiSvg mood="gentle" />
        </div>
        <h3 className="font-hand text-4xl text-amber-700 font-bold mb-6 mt-4">Lumis sanfte Weisheit</h3>
        <p className="font-hand text-3xl text-slate-700 leading-relaxed mb-8 italic">"{wisdom.text}"</p>
        <div className="h-px bg-amber-200 w-full mb-8" />
        <p className="font-hand text-2xl text-amber-600 font-bold mb-2">Deine heutige Entdeckung:</p>
        <p className="font-hand text-2xl text-slate-600">{wisdom.prompt}</p>
      </motion.div>

      <div className="flex gap-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-white text-amber-600 rounded-full font-hand text-xl font-bold shadow-md border-2 border-amber-100">Ich denke darüber nach...</motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-amber-500 text-white rounded-full font-hand text-xl font-bold shadow-md">Fertig!</motion.button>
      </div>
    </div>
  );
}

function EmotionAlchemy() {
  const [cauldron, setCauldron] = useState([]);
  const [result, setResult] = useState(null);

  const handleDrop = (emotion) => {
    if (cauldron.length >= 2) return; // full
    playPop();
    const newCauldron = [...cauldron, emotion];
    setCauldron(newCauldron);

    if (newCauldron.length === 2) {
      const ids = [newCauldron[0].id, newCauldron[1].id].sort().join(",");
      const combination = recipes[ids] || { name: "Gefühlschaos", emoji: "😵‍💫", color: "#cbd5e1", text: "Manche Gefühle sind schwer zu benennen, wenn sie sich mischen." };
      
      setTimeout(() => {
        setResult(combination);
        playSparkle();
      }, 800);
    }
  };

  const reset = () => {
    setCauldron([]);
    setResult(null);
  }

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <div className="text-center">
        <h3 className="font-hand text-3xl font-bold text-slate-800">Die Gefühls-Alchemie</h3>
        <p className="font-hand text-xl text-slate-500">Mische zwei einfache Gefühle, um komplexe zu verstehen!</p>
      </div>

      {/* INVENTORY */}
      <div className="flex flex-wrap justify-center gap-6 p-6 bg-white/60 rounded-[40px] shadow-lg border-2 border-white max-w-3xl">
        {basicEmotions.map(emo => (
          <motion.div
            key={emo.id} draggable whileHover={{ scale: 1.1 }}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", emo.id)}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-inner border-4 border-white"
            style={{ backgroundColor: emo.color }}
          >
            <span className="text-3xl md:text-4xl">{emo.emoji}</span>
          </motion.div>
        ))}
      </div>

      {/* CAULDRON */}
      <div 
        className="w-80 h-80 rounded-[50px] border-8 border-slate-300 relative shadow-inner overflow-hidden flex items-center justify-center watercolor-effect transition-colors duration-1000"
        style={{ backgroundColor: result ? result.color : "#f8fafc" }}
        onDragOver={e => e.preventDefault()}
        onDrop={(e) => {
          const data = e.dataTransfer.getData("text/plain");
          const emo = basicEmotions.find(e => e.id === data);
          if (emo) handleDrop(emo);
        }}
      >
        {!result && cauldron.length === 0 && (
          <p className="font-hand text-xl text-slate-400 opacity-60 text-center px-4">Zieh zwei Gefühle hier hinein!</p>
        )}
        
        {!result && cauldron.length > 0 && (
          <div className="flex gap-4">
            {cauldron.map((emo, i) => (
              <motion.div key={i} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl">{emo.emoji}</motion.div>
            ))}
          </div>
        )}

        {result && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2">
            <span className="text-8xl wiggler">{result.emoji}</span>
            <span className="font-hand text-3xl font-bold text-slate-800 bg-white/50 px-4 py-1 rounded-full">{result.name}</span>
          </motion.div>
        )}
      </div>

      {/* EXPLANATION */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[30px] border-2 border-slate-200 shadow-xl max-w-2xl text-center">
            <p className="font-hand text-2xl text-slate-600 mb-6">{result.text}</p>
            <button onClick={reset} className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold font-hand text-xl hover:bg-indigo-600">Nochmal mischen</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ==========================================
// 3. DILEMMA ENGINE (PROCEDURAL STORIES)
// ==========================================
const dilemmaScenarios = [
  {
    id: "turm",
    startNode: "start",
    nodes: {
      start: {
        text: "Du spielst mit den Bauklötzen. Plötzlich kommt Leo angerannt und stößt deinen riesigen Turm aus Versehen um.",
        choices: [
          { id: "c1", text: "Brüllen und ihn wegschubsen", next: "schubsen", color: "bg-red-400" },
          { id: "c2", text: "Tief durchatmen: 'Das ärgert mich!'", next: "reden", color: "bg-emerald-400" },
          { id: "c3", text: "Weinen und weglaufen", next: "weinen", color: "bg-blue-400" }
        ]
      },
      schubsen: {
        text: "Du schubst Leo. Er fällt hin und weint auch. Jetzt seid ihr beide traurig und der Turm ist immer noch kaputt.",
        isEnd: true, success: false, wisdom: "Wut vergeht, aber wie wir andere behandeln, bleibt in Erinnerung."
      },
      reden: {
        text: "Leo schaut dich erschrocken an. 'Oje, das wollte ich nicht! Kann ich dir helfen, ihn wieder aufzubauen?'",
        choices: [
          { id: "c6", text: "Ja, lass uns zusammen bauen!", next: "zusammen", color: "bg-amber-400" },
          { id: "c7", text: "Nein, ich will erst mal alleine sein.", next: "alleine", color: "bg-blue-300" }
        ]
      },
      weinen: {
        text: "Du weinst leise. Leo kommt zu dir und legt eine Hand auf deine Schulter. 'Tut mir leid, wirklich.'",
        choices: [
          { id: "c8", text: "Ihm verzeihen", next: "zusammen", color: "bg-emerald-400" }
        ]
      },
      zusammen: { 
        text: "Zu zweit geht es viel schneller! Der neue Turm ist sogar noch schöner als der alte. Gemeinsam macht alles mehr Spaß.", 
        isEnd: true, success: true, wisdom: "Zusammenarbeit verwandelt ein Missgeschick in ein gemeinsames Abenteuer." 
      },
      alleine: { 
        text: "Das ist okay. Manchmal braucht man Zeit für sich, um die Wut verrauchen zu lassen. Später fühlst du dich ruhiger.", 
        isEnd: true, success: true, wisdom: "Es ist mutig zu sagen, wenn man eine Pause von anderen braucht." 
      }
    }
  },
  {
    id: "apfel",
    startNode: "start",
    nodes: {
      start: {
        text: "Du hast einen wunderschönen, roten Apfel dabei. Dein Freund Elias hat sein Pausenbrot vergessen und sein Bauch knurrt ganz laut.",
        choices: [
          { id: "a1", text: "Den Apfel alleine essen", next: "alleine", color: "bg-red-400" },
          { id: "a2", text: "Den Apfel teilen", next: "teilen", color: "bg-emerald-400" }
        ]
      },
      teilen: {
        text: "Du brichst den Apfel in zwei Hälften. Elias Augen leuchten! 'Danke, du bist mein bester Freund!'",
        isEnd: true, success: true, wisdom: "Geteilte Freude ist doppelte Freude – und geteiltes Essen schmeckt doppelt so gut."
      },
      alleine: {
        text: "Du isst den Apfel, während Elias traurig zuschaut. Der Apfel schmeckt okay, aber irgendwie fühlt sich dein Bauch jetzt schwer an.",
        isEnd: true, success: false, wisdom: "Sich um andere zu kümmern, nährt auch das eigene Herz."
      }
    }
  },
  {
    id: "geheimnis",
    startNode: "start",
    nodes: {
      start: {
        text: "Sarah erzählt dir ein Geheimnis: Sie hat aus Versehen die schöne Vase der Lehrerin kaputt gemacht und sie unter dem Schrank versteckt.",
        choices: [
          { id: "g1", text: "Es für dich behalten", next: "behalten", color: "bg-slate-400" },
          { id: "g2", text: "Ihr raten, es ehrlich zu sagen", next: "ehrlich", color: "bg-emerald-400" },
          { id: "g3", text: "Es der Lehrerin petzen", next: "petzen", color: "bg-red-400" }
        ]
      },
      behalten: {
        text: "Du behältst das Geheimnis. Aber jedes Mal, wenn du die Lehrerin ansiehst, hast du ein mulmiges Gefühl.",
        isEnd: true, success: false, wisdom: "Geheimnisse können schwer wie Steine im Rucksack werden."
      },
      ehrlich: {
        text: "Sarah traut sich und sagt es der Lehrerin. Die Lehrerin ist zwar traurig wegen der Vase, aber froh über Sarahs Ehrlichkeit.",
        isEnd: true, success: true, wisdom: "Ehrlichkeit braucht Mut, aber sie macht das Herz frei."
      },
      petzen: {
        text: "Die Lehrerin schimpft mit Sarah. Sarah ist jetzt wütend auf dich, weil du ihr Vertrauen gebrochen hast.",
        isEnd: true, success: false, wisdom: "Vertrauen ist eine kostbare Blume. Man muss sie vorsichtig pflegen."
      }
    }
  },
  {
    id: "vogel",
    startNode: "start",
    nodes: {
      start: {
        text: "Im Garten findest du einen kleinen Vogel, der aus dem Nest gefallen ist. Er piepst ganz leise und zittert.",
        choices: [
          { id: "v1", text: "Ihn ignorieren", next: "ignorieren", color: "bg-slate-400" },
          { id: "v2", text: "Einen Erwachsenen rufen", next: "helfen", color: "bg-emerald-400" },
          { id: "v3", text: "Ihn alleine füttern", next: "mitnehmen", color: "bg-amber-400" }
        ]
      },
      ignorieren: {
        text: "Du spielst weiter, vergisst den Vogel aber nicht. Am Abend fragst du dich, wie es ihm wohl geht.",
        isEnd: true, success: false, wisdom: "Auch kleine Wesen brauchen unseren Schutz."
      },
      helfen: {
        text: "Die Erzieherin holt eine kleine Kiste und ruft beim Tierschutz an. Du hast dem Vogel das Leben gerettet!",
        isEnd: true, success: true, wisdom: "Helfen heißt, hinzuschauen, wenn andere in Not sind."
      },
      mitnehmen: {
        text: "Du gibst ihm Kekskrümel, aber er kann sie nicht essen. Ein Tierpfleger wäre besser gewesen.",
        isEnd: true, success: false, wisdom: "Gute Hilfe bedeutet auch, zu wissen, wann man Profis braucht."
      }
    }
  },
  {
    id: "team",
    startNode: "start",
    nodes: {
      start: {
        text: "Alle spielen fangen. Tom ist etwas langsamer als die anderen und wird immer als erster abgeschlagen. Einer ruft: 'Tom darf nicht mehr mitmachen!'",
        choices: [
          { id: "t1", text: "Nichts sagen und weiterspielen", next: "nichts", color: "bg-slate-400" },
          { id: "t2", text: "Sagen: 'Doch, jeder darf mitmachen!'", next: "alle", color: "bg-emerald-400" },
          { id: "t3", text: "Selbst rufen: 'Ja, Tom ist zu langsam!'", next: "gemein", color: "bg-red-400" }
        ]
      },
      alle: {
        text: "Die anderen überlegen kurz. 'Na gut, dann ändern wir die Regeln ein bisschen.' Tom freut sich riesig, dass du für ihn eingestanden bist.",
        isEnd: true, success: true, wisdom: "Echte Helden sind die, die andere nicht ausschließen."
      },
      nichts: {
        text: "Tom geht traurig an den Rand und schaut euch zu. Du hast zwar Spaß beim Spielen, aber ein komisches Gefühl im Bauch.",
        isEnd: true, success: false, wisdom: "Schweigen kann manchmal auch wehtun."
      },
      gemein: {
        text: "Tom fängt an zu weinen und rennt weg. Jetzt ist die Stimmung im Spiel irgendwie kaputt.",
        isEnd: true, success: false, wisdom: "Worte können wie kleine Pfeile sein. Sei vorsichtig mit ihnen."
      }
    }
  }
];

function DilemmaEngine({ onCorrect, onWrong }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [currentNodeId, setCurrentNodeId] = useState("start");

  const scenario = dilemmaScenarios[scenarioIndex];
  const node = scenario.nodes[currentNodeId];

  const traverse = (nextId) => { 
    playPop(); 
    setCurrentNodeId(nextId); 
  };

  const handleFinish = (success) => {
    if (success) {
      onCorrect?.();
      playSparkle();
      confetti();
    } else {
      onWrong?.();
      playError();
    }
  };

  const reset = () => { 
    playPop(); 
    setCurrentNodeId("start"); 
    setScenarioIndex((scenarioIndex + 1) % dilemmaScenarios.length);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-3xl mx-auto min-h-[450px]">
      <div className="text-center">
        <h3 className="font-hand text-3xl font-bold text-slate-800">Die Geschichten-Werkstatt</h3>
        <p className="font-hand text-xl text-slate-500">Jede Entscheidung verändert die Geschichte.</p>
      </div>

      <motion.div 
        key={`${scenarioIndex}-${currentNodeId}`} 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-xl watercolor-effect text-center"
      >
        <p className="font-hand text-2xl text-slate-700 leading-relaxed mb-8">{node.text}</p>
        
        {node.isEnd ? (
          <div className="flex flex-col items-center gap-6">
            <div className={`p-6 rounded-2xl ${node.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'} border-2 border-current items-center justify-center`}>
               <p className="font-hand text-2xl font-bold mb-2">Lumis sanfter Rat:</p>
               <p className="font-hand text-xl italic leading-relaxed">"{node.wisdom}"</p>
            </div>
            <button 
              onClick={() => { handleFinish(node.success); reset(); }} 
              className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold font-hand text-xl hover:bg-indigo-600 transition-colors shadow-lg"
            >
              Nächste Geschichte
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {node.choices.map(c => (
              <motion.button 
                key={c.id} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => traverse(c.next)}
                className={`flex-1 py-4 px-6 rounded-2xl ${c.color} text-white font-hand text-xl shadow-md border-b-4 border-black/20`}
              >
                {c.text}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ==========================================
// 4. EMPATHIE-RADAR
// ==========================================
const perspectives = [
  { id: "leo", name: "Leo", role: "Hat Turm umgestoßen", emoji: "🏃‍♂️", correctThought: "c1" },
  { id: "mia", name: "Mia", role: "Besitzerin des Turms", emoji: "👧", correctThought: "c2" },
  { id: "tom", name: "Tom", role: "Beobachter", emoji: "👀", correctThought: "c3" }
];
const thoughts = [
  { id: "c1", text: "Mist, ich habe gar nicht aufgepasst..." },
  { id: "c2", text: "Hey! Ich habe da so lange dran gebaut!" },
  { id: "c3", text: "Oh oh, gibt das jetzt wohl Streit?" }
];

function EmpathyRadar() {
  const [matches, setMatches] = useState({});

  const handleDrop = (charId, thoughtId) => {
    playPop();
    const newMatches = { ...matches, [charId]: thoughtId };
    setMatches(newMatches);
    
    if (perspectives.every(p => newMatches[p.id] === p.correctThought)) {
      setTimeout(() => { playSparkle(); confetti(); }, 500);
    }
  };

  const isWon = perspectives.every(p => matches[p.id] === p.correctThought);

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full">
      <div className="text-center">
        <h3 className="font-hand text-3xl font-bold text-slate-800">Das Empathie-Radar</h3>
        <p className="font-hand text-xl text-slate-500">Wer denkt was? Ordne die Gedankenblasen richtig zu.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center max-w-5xl">
        {perspectives.map(p => {
          const matchedThought = thoughts.find(t => t.id === matches[p.id]);
          return (
            <div 
              key={p.id}
              className={`flex-1 min-h-[250px] p-6 rounded-3xl border-4 flex flex-col items-center shadow-lg transition-colors
                ${matchedThought ? (matches[p.id] === p.correctThought ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300') : 'bg-white border-slate-200'}`}
              onDragOver={e => e.preventDefault()}
              onDrop={(e) => handleDrop(p.id, e.dataTransfer.getData("text/plain"))}
            >
              <div className="text-6xl mb-2">{p.emoji}</div>
              <div className="font-hand text-2xl font-bold text-slate-800">{p.name}</div>
              <div className="text-sm font-sans font-medium uppercase tracking-wider text-slate-400 mb-6">{p.role}</div>
              
              {matchedThought ? (
                 <div className="bg-white p-4 rounded-xl shadow-sm text-center font-hand text-lg border-2 border-slate-100">💭 "{matchedThought.text}"</div>
              ) : (
                 <div className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 font-hand">Gedanke hier ablegen</div>
              )}
            </div>
          )
        })}
      </div>

      {!isWon && (
        <div className="flex flex-wrap justify-center gap-4 mt-4 bg-white/60 p-6 rounded-[30px] border-2 border-white shadow-md">
          {thoughts.map(t => {
            if (perspectives.some(p => matches[p.id] === t.id && p.correctThought === t.id)) return null;
            return (
              <motion.div key={t.id} draggable whileHover={{ scale: 1.05 }} onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
                className="bg-white p-4 rounded-2xl cursor-grab shadow-md border-2 border-indigo-100 font-hand text-lg"
              >
                💭 "{t.text}"
              </motion.div>
            )
          })}
        </div>
      )}
      
      {isWon && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 font-hand text-2xl font-bold text-emerald-600 bg-emerald-100 px-8 py-4 rounded-full border-4 border-emerald-300">
          Fantastisch! Du hast dich wunderbar in alle hineinversetzt.
        </motion.div>
      )}
    </div>
  )
}

// ==========================================
// 5. SPIEGEL DER WAHRHEIT (REFLECTION)
// ==========================================
const reflectionCards = [
  { id: 1, question: "Wie war mein Tag heute?", options: ["Sonnig und hell", "Ein bisschen bewölkt", "Stürmisch"], color: "bg-amber-100" },
  { id: 2, question: "Habe ich heute jemanden zum Lächeln gebracht?", options: ["Ja, das war toll!", "Ich glaube schon", "Morgen probiere ich es!"], color: "bg-emerald-100" },
  { id: 3, question: "Gab es etwas, das mich traurig gemacht hat?", options: ["Ja, aber es ist okay", "Nein, alles gut", "Ich brauche noch einen Drücker"], color: "bg-sky-100" },
  { id: 4, question: "Was habe ich heute Neues gelernt?", options: ["Ganz viel!", "Ein kleines bisschen", "Ich habe nur gespielt (das ist auch lernen!)"], color: "bg-purple-100" }
];

function MirrorOfTruth() {
  const [currentCard, setCurrentCard] = useState(0);
  const [selections, setSelections] = useState({});

  const handleSelect = (option) => {
    playPop();
    setSelections({ ...selections, [currentCard]: option });
    if (currentCard < reflectionCards.length - 1) {
      setTimeout(() => setCurrentCard(currentCard + 1), 600);
    } else {
      setTimeout(() => { playSparkle(); confetti(); }, 500);
    }
  };

  const card = reflectionCards[currentCard];
  const isFinished = Object.keys(selections).length === reflectionCards.length;

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full">
      <div className="text-center">
        <h3 className="font-hand text-3xl font-bold text-slate-800">Der Spiegel der Wahrheit</h3>
        <p className="font-hand text-xl text-slate-500">Schau in dein Herz und entdecke deine Wahrheit.</p>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div 
            key={currentCard}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            className={`w-full max-w-xl p-10 rounded-[40px] border-8 border-white shadow-2xl ${card.color} watercolor-effect text-center`}
          >
            <h4 className="font-hand text-3xl text-slate-800 font-bold mb-10">{card.question}</h4>
            <div className="flex flex-col gap-4">
              {card.options.map(opt => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(opt)}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-left font-hand text-xl text-slate-700 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-white"
                >
                  ✨ {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white p-12 rounded-[50px] border-8 border-amber-100 shadow-2xl text-center watercolor-effect"
          >
            <div className="w-32 h-32 mx-auto mb-8">
               <LumiSvg mood="happy" />
            </div>
            <h4 className="font-hand text-4xl text-amber-700 font-bold mb-6">Dein Kristallklares Herz</h4>
            <p className="font-hand text-2xl text-slate-600 leading-relaxed mb-10">
              Du hast heute mutig in dich hineingeschaut. Jedes Gefühl ist ein Teil von dir, und das ist wunderbar!
            </p>
            <button 
              onClick={() => { setCurrentCard(0); setSelections({}); }}
              className="px-10 py-4 bg-amber-500 text-white rounded-2xl font-hand text-2xl shadow-lg hover:bg-amber-600 transition-transform hover:scale-105"
            >
              Nochmal hineinschauen
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 5. KONFLIKT-KNOTEN
// ==========================================
const tools = [
  { id: "brullen", name: "Brüllen", val: +3, color: "bg-red-400", emoji: "🗣️" },
  { id: "weglaufen", name: "Weglaufen", val: +1, color: "bg-orange-400", emoji: "🏃" },
  { id: "zuhoren", name: "Aktiv Zuhören", val: -3, color: "bg-sky-400", emoji: "👂" },
  { id: "ich-botschaft", name: "Ich-Botschaft senden", val: -2, color: "bg-emerald-400", emoji: "💌" }
];

function ConflictKnot() {
  const [tension, setTension] = useState(5); // 0 (gelöst) to 10 (krise)
  const [msg, setMsg] = useState("Zieh ein Werkzeug auf den Knoten!");

  const handleDrop = (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;
    
    let newT = Math.min(10, Math.max(0, tension + tool.val));
    setTension(newT);
    
    if (tool.val > 0) {
      playError();
      setMsg(`"${tool.name}" zieht den Knoten fester!`);
    } else {
      playPop();
      setMsg(`"${tool.name}" entspannt den Knoten.`);
      if (newT === 0) setTimeout(() => { playSparkle(); confetti(); setMsg("Frieden! Alle Knoten sind gelöst."); }, 300);
    }
  };

  const knotScale = 1 + (tension / 10);
  const knotColor = tension > 7 ? "#ef4444" : tension < 3 ? "#4ade80" : "#fbbf24";
  const knotRotate = tension > 7 ? [0, -5, 5, -5, 5, 0] : 0;
  
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 py-8 w-full max-w-5xl mx-auto">
      <div className="w-full lg:w-1/2 flex flex-col items-center">
        <h3 className="font-hand text-3xl font-bold text-slate-800 mb-2">Der Konflikt-Knoten</h3>
        <p className="font-hand text-xl text-slate-500 mb-8 h-8">{msg}</p>
        
        <div 
           className="w-80 h-80 bg-white/50 rounded-full border-8 border-white shadow-xl flex items-center justify-center relative overflow-hidden watercolor-effect"
           onDragOver={e => e.preventDefault()}
           onDrop={(e) => handleDrop(e.dataTransfer.getData("text/plain"))}
        >
           {tension === 0 ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl wiggler">🕊️</motion.div>
           ) : (
              <motion.div 
                animate={{ scale: knotScale, rotate: knotRotate }} transition={{ duration: 0.3 }}
                className="w-24 h-24 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-2xl flex items-center justify-center text-5xl"
                style={{ backgroundColor: knotColor, transition: "background-color 0.5s ease" }}
              >
                🧶
              </motion.div>
           )}
        </div>
        {tension === 0 && <button onClick={() => {setTension(5); setMsg("Ein neuer Konflikt!");}} className="mt-6 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-hand text-xl font-bold">Neuer Konflikt</button>}
      </div>

      <div className="w-full lg:w-1/2 bg-white/60 p-8 rounded-[40px] border-4 border-white shadow-lg">
        <h4 className="font-hand text-2xl font-bold mb-6 text-slate-700">Kommunikations-Werkzeuge</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {tools.map(t => (
              <motion.div key={t.id} draggable whileHover={{ scale: 1.05 }} onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
                 className={`flex items-center gap-4 p-4 rounded-2xl cursor-grab shadow-md text-white font-hand text-xl font-bold ${t.color}`}
              >
                 <span className="text-3xl bg-white/20 w-12 h-12 flex items-center justify-center rounded-full shadow-inner">{t.emoji}</span>
                 {t.name}
              </motion.div>
           ))}
        </div>
      </div>
    </div>
  )
}

// --- Game 6: Die Waage der Fairness ---
function WaageDerFairness() {
  const [leftApples, setLeftApples] = useState(5);
  const [rightApples, setRightApples] = useState(1);
  const [isWon, setIsWon] = useState(false);

  const totalApples = 6;
  const targetApples = totalApples / 2;
  
  // Angle: -15 (left heavy) to +15 (right heavy)
  // 5 vs 1 -> 4 difference -> let's say 4 * 4 = 16 deg
  const difference = rightApples - leftApples;
  const angle = difference * 4;

  const moveApple = (fromDir) => {
    if (isWon) return;
    playPop();
    if (fromDir === "left" && leftApples > 0) {
      setLeftApples(l => l - 1);
      setRightApples(r => r + 1);
    } else if (fromDir === "right" && rightApples > 0) {
      setRightApples(r => r - 1);
      setLeftApples(l => l + 1);
    }

    if ((fromDir === "left" && leftApples - 1 === targetApples) || (fromDir === "right" && rightApples - 1 === targetApples)) {
      setTimeout(() => { playSparkle(); setIsWon(true); confetti(); }, 500);
    }
  };

  const reset = () => { playPop(); setIsWon(false); setLeftApples(5); setRightApples(1); };

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h3 className="font-hand text-4xl font-bold text-slate-800">Waage der Gerechtigkeit</h3>
        <p className="font-hand text-xl text-slate-500">Klicke auf die Äpfel, um sie gerecht zu verteilen.</p>
      </div>

      <div className="relative w-full h-[400px] flex items-end justify-center pb-12 mt-10">
        
        {/* Support Pillar */}
        <div className="absolute bottom-12 w-8 h-40 bg-slate-300 rounded-t-full border-4 border-slate-400 z-10" />

        {/* The Scale Beam */}
        <motion.div 
           animate={{ rotate: angle }} 
           transition={{ type: "spring", stiffness: 50, damping: 10 }}
           className="absolute bottom-48 w-3/4 h-6 bg-amber-700 rounded-full z-20 origin-center flex justify-between px-4 items-center shadow-lg"
        >
           {/* Center pin */}
           <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rounded-full" />
           
           {/* Left Basket (Clickable) */}
           <div className="relative">
              <div className="absolute w-1 h-32 bg-slate-400 -top-0 -left-0 origin-top rotate-12" />
              <div className="absolute w-1 h-32 bg-slate-400 -top-0 -right-0 origin-top -rotate-12" />
              <button 
                 onClick={() => moveApple("left")}
                 className="absolute top-32 -left-16 w-32 h-16 bg-amber-100 rounded-[50px] border-4 border-amber-300 shadow-md flex justify-center items-end pb-2 cursor-pointer hover:bg-amber-200 transition-colors"
                 style={{ transform: `rotate(${-angle}deg)` }}
              >
                 <div className="flex flex-wrap justify-center w-24 gap-1">
                    {Array.from({ length: leftApples }).map((_, i) => <motion.span key={i} layout className="text-3xl drop-shadow-sm">🍎</motion.span>)}
                 </div>
              </button>
           </div>

           {/* Right Basket */}
           <div className="relative">
              <div className="absolute w-1 h-32 bg-slate-400 -top-0 -left-0 origin-top rotate-12" />
              <div className="absolute w-1 h-32 bg-slate-400 -top-0 -right-0 origin-top -rotate-12" />
              <button 
                 onClick={() => moveApple("right")}
                 className="absolute top-32 -left-16 w-32 h-16 bg-amber-100 rounded-[50px] border-4 border-amber-300 shadow-md flex justify-center items-end pb-2 cursor-pointer hover:bg-amber-200 transition-colors"
                 style={{ transform: `rotate(${-angle}deg)` }}
              >
                 <div className="flex flex-wrap justify-center w-24 gap-1">
                    {Array.from({ length: rightApples }).map((_, i) => <motion.span key={i} layout className="text-3xl drop-shadow-sm">🍎</motion.span>)}
                 </div>
              </button>
           </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isWon && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
             <div className="bg-emerald-100 text-emerald-700 px-8 py-4 rounded-3xl font-hand text-2xl font-bold border-4 border-emerald-300">
               Perfekt! Beide haben gleich viel. Das ist fair!
             </div>
             <button onClick={reset} className="px-6 py-2 bg-emerald-500 text-white rounded-full font-hand text-xl hover:bg-emerald-600">Nochmal spielen</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Game 7: Die Komplimente-Wolke ---
const KOMPLIMENTE = [
  { text: "Du bist nett!", isGood: true },
  { text: "Lass mich in Ruhe!", isGood: false },
  { text: "Du kannst das gut!", isGood: true },
  { text: "Das ist dumm.", isGood: false },
  { text: "Ich spiele gern mit dir.", isGood: true }
];

function KomplimenteWolke() {
  const [cloudLevel, setCloudLevel] = useState(0); // 0 = sad, 3 = happy rainbow
  const [words, setWords] = useState(KOMPLIMENTE.map((w, index) => ({ ...w, id: index })));

  const handleDrop = (id) => {
    const word = words.find(w => w.id === parseInt(id));
    if (!word) return;

    if (word.isGood) {
      playSparkle();
      setCloudLevel(Math.min(3, cloudLevel + 1));
      if (cloudLevel + 1 === 3) confetti();
    } else {
      playError();
      setCloudLevel(Math.max(0, cloudLevel - 1));
    }
    setWords(words.filter(w => w.id !== word.id));
  };

  const getCloudStyle = () => {
    switch(cloudLevel) {
      case 0: return { color: "bg-slate-400", emoji: "🌧️", scale: 1 };
      case 1: return { color: "bg-sky-300", emoji: "⛅", scale: 1.1 };
      case 2: return { color: "bg-yellow-200", emoji: "☀️", scale: 1.2 };
      case 3: return { color: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400", emoji: "🌈", scale: 1.3 };
      default: return { color: "bg-slate-400", emoji: "🌧️", scale: 1 };
    }
  };

  const style = getCloudStyle();

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="font-hand text-4xl font-bold text-slate-800">Die Komplimente-Wolke</h3>
        <p className="font-hand text-xl text-slate-500">Ziehe nette Worte auf die Wolke, um sie froh zu machen.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 w-full justify-center items-center">
        {/* The Cloud */}
        <motion.div 
           animate={{ scale: style.scale }} 
           className={`w-64 h-64 rounded-[50px] shadow-xl flex items-center justify-center text-8xl border-8 border-white ${style.color}`}
           onDragOver={e => e.preventDefault()}
           onDrop={e => handleDrop(e.dataTransfer.getData("text"))}
        >
           <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>{style.emoji}</motion.span>
        </motion.div>

        {/* Drops / Words */}
        <div className="flex flex-col gap-4">
           <AnimatePresence>
              {words.map(w => (
                <motion.div 
                  key={w.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0 }}
                  draggable onDragStart={(e) => e.dataTransfer.setData("text", w.id)}
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-full border-4 border-white shadow-md font-hand text-2xl font-bold text-slate-700 cursor-grab active:cursor-grabbing hover:scale-105"
                >
                  💧 "{w.text}"
                </motion.div>
              ))}
           </AnimatePresence>
           {words.length === 0 && cloudLevel < 3 && <p className="font-hand text-xl text-slate-400">Keine Worte mehr da.</p>}
        </div>
      </div>
      
      {cloudLevel === 3 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-8 bg-pink-100 text-pink-700 px-8 py-4 rounded-3xl font-hand text-2xl font-bold border-4 border-pink-300">
           Wundervoll! Nette Worte können einen ganzen Tag erhellen.
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// MAIN WRAPPER: Ethik Module
// ==========================================
export default function EthikModule({ onCorrect = () => {}, onWrong = () => {} }) {
  const [activeTab, setActiveTab] = useState("himmelwelt");

  const tabs = [
    { id: "himmelwelt", name: "Himmelswelt", icon: "🌤️", color: "bg-sky-500" },
    { id: "arcade", name: "Arcade-Welt", icon: "🎮", color: "bg-orange-500" },
    { id: "sinn", name: "Denk-Abenteuer", icon: "🧭", color: "bg-slate-900" },
    { id: "alchemy", name: "Gefühls-Mixer", icon: "🧪", color: "bg-fuchsia-400" },
    { id: "ruhe", name: "Ruhe-Insel", icon: "🏝️", color: "bg-teal-400" },
    { id: "grenzen", name: "Grenzen", icon: "✋", color: "bg-rose-400" },
    { id: "dilemma", name: "Geschichten", icon: "📖", color: "bg-amber-400" },
    { id: "radar", name: "Gedanken-Radar", icon: "🧠", color: "bg-emerald-400" },
    { id: "knot", name: "Konflikt-Knoten", icon: "🧶", color: "bg-rose-400" },
    { id: "mirror", name: "Spiegel", icon: "🪞", color: "bg-sky-400" },
    { id: "lumi", name: "Lumis Rat", icon: "🦊", color: "bg-orange-400" },
    { id: "waage", name: "Fairness-Waage", icon: "⚖️", color: "bg-indigo-400" },
    { id: "wolke", name: "Komplimente", icon: "⛅", color: "bg-pink-400" },
    { id: "spielwelt", name: "Spielwelt", icon: "🎲", color: "bg-fuchsia-500" },
    { id: "quest", name: "Quest-Mixer", icon: "🧭", color: "bg-emerald-500" },
    { id: "premium", name: "Premium-Atelier", icon: "✨", color: "bg-amber-500" },
    { id: "action", name: "Herz-Fangspiel", icon: "💫", color: "bg-orange-500" },
    { id: "varianten", name: "Mega-Auswahl", icon: "🧭", color: "bg-slate-800" }
  ];

  return (
    <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto pb-20 pt-4">
      
      <div className="text-center space-y-4">
        <h2 className="font-hand text-6xl font-bold text-slate-800 tracking-tight">Miteinander & Welt</h2>
        <p className="font-hand text-2xl text-slate-500 italic">Entdecke die Magie der Gefühle und der Freundschaft.</p>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-3 bg-white/40 p-3 rounded-[40px] shadow-inner backdrop-blur-sm border-2 border-white max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => { playPop(); setActiveTab(tab.id); }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-8 py-4 rounded-[30px] font-hand text-2xl font-bold transition-all shadow-md 
                ${isActive ? `${tab.color} text-white scale-105 ring-4 ring-white` : "bg-white text-slate-400 hover:text-slate-600"}`}
            >
              <span className="text-3xl">{tab.icon}</span>
              {tab.name}
            </motion.button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-[60px] p-10 border-8 border-white shadow-3xl relative overflow-hidden min-h-[600px] watercolor-effect">
         <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab} 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4, ease: "backOut" }}
             >
              {activeTab === "himmelwelt" && (
                <Suspense fallback={<div className="min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" />}>
                  <SkyWonderland title="Herz-Himmel" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "arcade" && (
                <Suspense fallback={<div className="min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <LearningArcade subject="ethik" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "sinn" && (
                <Suspense fallback={<div className="min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <DeepLearningQuest subject="ethik" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "lumi" && <LumisCorner />}
              {activeTab === "alchemy" && <EmotionAlchemy />}
              {activeTab === "ruhe" && <RuheInsel onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "grenzen" && <GrenzenGarten onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "dilemma" && <DilemmaEngine onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "radar" && <EmpathyRadar />}
              {activeTab === "knot" && <ConflictKnot />}
              {activeTab === "mirror" && <MirrorOfTruth />}
              {activeTab === "waage" && <WaageDerFairness />}
              {activeTab === "wolke" && <KomplimenteWolke />}
              {activeTab === "spielwelt" && (
                <GameWorld
                  title="Miteinander-Spielwelt"
                  intro="Acht Spielarten für Gefühle, Grenzen, Fairness, Trost, Konflikte und tiefe Fragen."
                  collections={SUBJECT_VARIANT_CONTENT.ethik}
                  accent="bg-fuchsia-500"
                  scene="heart"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "quest" && (
                <QuestMixer
                  title="Miteinander-Quest-Mixer"
                  intro="Expedition, Puzzle, Sternenlauf und Kartenwirbel für Gefühle, Grenzen, Trost und achtsame Tiefe."
                  collections={SUBJECT_VARIANT_CONTENT.ethik}
                  accent="bg-emerald-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
                            {activeTab === "premium" && (
                <Suspense fallback={<div className="min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <SubjectPremiumAtelier subject="ethik" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "action" && (
                <ActionArena
                  title="Herz-Fangspiel"
                  intro="Fang hilfreiche Antworten für Gefühle, Grenzen und Miteinander."
                  collections={SUBJECT_VARIANT_CONTENT.ethik}
                  accent="bg-fuchsia-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "varianten" && (
                <VariantStudio
                  title="Miteinander-Mega-Auswahl"
                  intro="Viele kurze Situationskarten für Gefühle, Grenzen, Fairness, Trost, Konflikte und tiefe Fragen."
                  collections={SUBJECT_VARIANT_CONTENT.ethik}
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
            </motion.div>
         </AnimatePresence>
      </div>
      
    </div>
  );
}
