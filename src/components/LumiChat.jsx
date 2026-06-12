import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop, playSparkle } from "../utils/sounds";
import { LumiSvg } from "./Mascot";

const START_MESSAGE = "Hallo! Ich bin Lumi. Du kannst mir kleine und große Fragen stellen.";

const QUICK_PROMPTS = [
  "Ich habe Angst",
  "Warum sterben Menschen?",
  "Bin ich normal?",
  "Was ist Mut?",
  "Ich habe Streit",
  "Hilf mir beim Lernen",
];

const GENTLE_WISDOMS = [
  "In jedem kleinen Kern steckt ein ganzer Wald.",
  "Fehler sind wie kleine Treppenstufen, auf denen wir wachsen.",
  "Geduld ist das Gießen einer Blume, die Zeit zum Blühen braucht.",
  "Du bist genau richtig, so wie du bist.",
  "Jeder Tag ist eine neue Chance, zu staunen.",
  "Ein freundliches Wort ist wie ein Sonnenstrahl im Regen.",
  "Mutig sein heißt nicht, keine Angst zu haben, sondern es trotzdem zu versuchen."
];

function ThinkingDots() {
  return (
    <div className="flex gap-1 py-2 px-1">
      {[0, 1, 2].map(i => (
        <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} className="w-2 h-2 bg-slate-300 rounded-full" />
      ))}
    </div>
  );
}

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const normalizeText = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss");

const hasAny = (text, words) => words.some((word) => text.includes(normalizeText(word)));

const includesQuestionAbout = (text, words) =>
  hasAny(text, words) || (text.includes("warum") && hasAny(text, words));

function getLumiResponse(input) {
  const text = normalizeText(input);
  const trimmed = input.trim();
  const shortQuestion = trimmed.endsWith("?") || hasAny(text, ["warum", "wie", "was ist", "was passiert", "wozu"]);
  
  if (hasAny(text, ["ich will sterben", "nicht mehr leben", "umbringen", "suizid", "ritzen", "mir weh tun", "mich verletzen", "tot sein"])) {
    return {
      text: "Das ist jetzt sehr wichtig. Bitte geh sofort zu einem Erwachsenen, dem du vertraust, und sag: \"Ich brauche jetzt Hilfe.\" Wenn niemand da ist oder du in Gefahr bist, ruf 112. Bleib bitte nicht allein. Ich bin hier im Spiel, aber jetzt braucht es einen echten Menschen bei dir.",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["schlaegt", "geschlagen", "angefasst", "fasst mich an", "tut mir weh", "darf es nicht sagen", "geheimnis behalten", "bedroht", "angst vor zuhause", "nicht sicher"])) {
    return {
      text: "Das darfst du ernst nehmen. Dein Körper und dein Herz gehören dir. Ein Geheimnis, das sich schwer oder komisch anfühlt, darfst du immer erzählen. Bitte sag es einem Erwachsenen, dem du vertraust. Du bekommst keinen Ärger, weil du Hilfe holst.",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["nackt", "foto von mir", "bilder schicken", "komische bilder", "privatstelle", "private stelle", "kuss obwohl", "anfassen obwohl"])) {
    return {
      text: "Bei deinem Körper darfst du Stopp sagen. Niemand darf dich zu Bildern, Küssen oder Anfassen drängen. Wenn etwas heimlich bleiben soll oder sich komisch anfühlt, erzähl es bitte einem sicheren Erwachsenen. Du musst das nicht allein lösen.",
      mood: "gentle",
    };
  }

  if (includesQuestionAbout(text, ["tod", "tot", "sterben", "gestorben", "friedhof"])) {
    return {
      text: "Sterben bedeutet: Der Körper hört auf zu leben. Das ist sehr traurig, und viele Kinder und Erwachsene weinen dann. Liebe und Erinnerungen können trotzdem bei uns bleiben. Du darfst alles fragen. Am besten sprichst du darüber auch mit einem Erwachsenen, der dich halten und trösten kann.",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["wo war ich bevor", "vor der geburt", "bevor ich geboren", "woher komme ich"])) {
    return {
      text: "Das ist eine große Staune-Frage. Vor deiner Geburt warst du noch nicht so da wie jetzt. Manche Menschen sagen: Du warst ein Wunsch, ein Gedanke, ein kleines Wunder im Werden. Was sicher ist: Jetzt bist du hier, und dein Leben zählt.",
      mood: "thinking",
    };
  }

  if (hasAny(text, ["wo kommen babys her", "baby im bauch", "kinder bekommen", "geburt", "schwanger"])) {
    return {
      text: "Babys wachsen am Anfang ganz geschützt im Bauch einer erwachsenen Person, meistens in der Gebärmutter. Dort werden sie größer, bis sie geboren werden. Wenn du mehr wissen willst, frag am besten einen Erwachsenen, der dir ruhig und passend für dein Alter antwortet.",
      mood: "thinking",
    };
  }

  if (includesQuestionAbout(text, ["sinn", "warum gibt es mich", "wozu bin ich", "leben", "welt"])) {
    return {
      text: "Das ist eine richtig große Frage. Niemand hat darauf nur eine einzige Antwort. Manche Menschen finden Sinn im Lieben, Lernen, Helfen, Staunen oder Beten. Vielleicht ist deine Aufgabe heute erst einmal ganz klein: gut zu dir sein und einen nächsten freundlichen Schritt finden.",
      mood: "thinking",
    };
  }

  if (hasAny(text, ["gibt es gott", "wer ist gott", "gott", "glauben", "religion", "beten", "himmel", "seele"])) {
    return {
      text: "Menschen glauben darüber Verschiedenes. Manche sprechen mit Gott, manche glauben anders, manche wissen es nicht. Du darfst fragen und prüfen. Gute Fragen müssen nicht sofort fertig beantwortet sein.",
      mood: "thinking",
    };
  }

  if (hasAny(text, ["krieg", "bombe", "klima", "welt geht unter", "nachrichten", "katastrophe", "erdbeben", "ueberschwemmung"])) {
    return {
      text: "Nachrichten können sehr groß und schwer wirken. Du musst die ganze Welt nicht alleine tragen. Frag einen Erwachsenen, was gerade wirklich wichtig ist. Danach darf dein Kopf Pause machen: trinken, atmen, etwas Warmes anschauen, eine kleine Aufgabe machen.",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["boese menschen", "böse menschen", "warum sind menschen gemein", "warum tun menschen weh", "ungerechtigkeit"])) {
    return {
      text: "Manche Menschen tun weh, weil sie selbst verwirrt, wütend, machtgierig oder sehr verletzt sind. Das macht es nicht richtig. Wichtig ist: Du musst Gemeinheit nicht allein tragen. Gute Menschen können schützen, trösten und Dinge besser machen.",
      mood: "thinking",
    };
  }

  if (hasAny(text, ["rassismus", "hautfarbe", "aussehen", "behindert", "komisch", "anders", "normal", "zu dick", "zu duenn", "hässlich", "haesslich"])) {
    return {
      text: "Du musst nicht genau wie andere sein, um richtig zu sein. Menschen haben verschiedene Körper, Farben, Sprachen, Familien und Arten zu denken. Wenn dich jemand deswegen klein macht, ist das nicht okay. Du darfst Hilfe holen und Menschen suchen, die dich respektieren.",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["eltern trennen", "scheidung", "mama und papa streiten", "zuhause streit", "familie kaputt"])) {
    return {
      text: "Wenn Erwachsene streiten oder sich trennen, fühlt sich das oft wackelig an. Wichtig: Das ist nicht deine Schuld. Kinder müssen das nicht reparieren. Du darfst sagen: \"Ich brauche Ruhe\" oder \"Bitte erklärt mir, was passiert.\"",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["mobbt", "mobbing", "ausgelacht", "keiner mag mich", "alle hassen mich", "ausgeschlossen", "gemein zu mir"])) {
    return {
      text: "Das tut weh. Gemeine Worte sagen nichts über deinen Wert. Du darfst dir Hilfe holen: Lehrerin, Erzieher, Eltern oder ein anderer sicherer Mensch. Ein guter Satz ist: \"Bitte hilf mir, ich werde immer wieder geärgert.\"",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["schuld", "meine schuld", "ich bin schuld", "schame", "peinlich", "ich bin schlecht", "ich hasse mich"])) {
    return {
      text: "Du bist nicht schlecht. Du bist ein Mensch, und Menschen machen Fehler oder fühlen sich manchmal schwer. Wenn du etwas falsch gemacht hast, kannst du es Schritt für Schritt besser machen: ehrlich sagen, was passiert ist, dich entschuldigen, und Hilfe holen.",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["angst", "panik", "alptraum", "nachts", "fuerchte", "sorge", "sorgen"])) {
    return {
      text: "Angst ist wie ein Warnlicht im Körper. Manchmal ist es hilfreich, manchmal leuchtet es zu stark. Schau dich um und nenne leise: drei Dinge, die du siehst, zwei Geräusche, die du hörst, eine Stelle im Körper, die sich sicher anfühlt. Dann sag einem Erwachsenen: \"Ich habe Angst.\"",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["traurig", "weinen", "vermiss", "einsam", "allein", "schlecht", "herz tut weh"])) {
    return {
      text: "Das klingt schwer. Traurig sein ist kein Fehler. Du darfst weinen, leise sein oder Nähe suchen. Manchmal hilft ein Satz: \"Kannst du kurz bei mir bleiben?\" Magst du mir sagen, was dein Herz gerade am meisten drückt?",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["wuetend", "wut", "boese", "nervt", "ausrasten", "hauen", "schreien"])) {
    return {
      text: "Wut hat viel Kraft. Erst stoppen: Füße fest auf den Boden. Dann langsam ausatmen, als würdest du eine Kerze bewegen, nicht auspusten. Danach kannst du sagen: \"Ich bin wütend und brauche kurz Platz.\"",
      mood: "gentle",
    };
  }

  if (hasAny(text, ["streit", "entschuldigen", "freund", "freundin", "teilen", "unfair", "gemein"])) {
    return {
      text: "Bei Streit hilft oft ein kleiner, klarer Satz: \"Ich war verletzt, weil ...\" Dann hörst du auch die andere Seite an. Wenn es zu laut wird, ist eine Pause klug. Fair sein heißt nicht immer nachgeben, sondern ehrlich und freundlich bleiben.",
      mood: "thinking",
    };
  }

  if (hasAny(text, ["luegen", "lügen", "wahrheit", "ehrlich", "verraten", "petzen"])) {
    return {
      text: "Wahrheit kann manchmal schwer sein. Eine gute Regel: Wenn jemand geschützt werden muss, ist Hilfe holen kein Petzen. Wenn du einen Fehler verstecken willst, ist Ehrlichkeit meistens der erste Schritt, damit es wieder leichter wird.",
      mood: "thinking",
    };
  }

  if (hasAny(text, ["mut", "mutig", "tapfer", "trauen", "ich traue mich nicht"])) {
    return {
      text: "Mut heißt nicht: keine Angst haben. Mut heißt: Ich merke die Angst und mache einen passenden kleinen Schritt. Manchmal ist der mutige Schritt auch: Hilfe holen, Nein sagen oder eine Pause machen.",
      mood: "proud",
    };
  }

  if (hasAny(text, ["hilfe", "nicht weiter", "kapier", "verstehe nicht", "lernen", "aufgabe", "mathe", "zahlen", "rechnen", "deutsch", "lesen", "schreiben"])) {
    return {
      text: "Ich helfe dir gern. Nimm nur den nächsten kleinen Schritt: Was ist gegeben? Was wird gesucht? Wenn du mir die Aufgabe in einem Satz erzählst, zerlegen wir sie zusammen in kleine Teile.",
      mood: "thinking",
    };
  }

  if (hasAny(text, ["weisheit", "spruch", "erzaehl", "erzähl"])) {
    return { text: pick(GENTLE_WISDOMS), mood: "gentle" };
  }

  if (hasAny(text, ["gut", "super", "freue", "gluecklich", "glücklich", "stolz", "geschafft", "fertig"])) {
    return {
      text: "Das klingt warm und schön. Halte kurz inne und merk dir dieses Gefühl. Was hat dir geholfen, dass es heute so gut geklappt hat?",
      mood: "proud",
    };
  }

  if (hasAny(text, ["hallo", "hi", "hey", "guten tag"])) {
    return {
      text: "Hallo du. Ich bin da. Möchtest du über eine Aufgabe sprechen, über ein Gefühl, oder über eine große Frage?",
      mood: "idle",
    };
  }

  if (hasAny(text, ["liebe", "lieb haben", "verliebt"])) {
    return {
      text: "Liebe bedeutet oft: Jemand ist uns wichtig, und wir wollen gut mit ihm umgehen. Liebe darf warm sein, aber sie darf niemals Druck machen. Ein gutes Herz sagt auch Nein, wenn etwas nicht gut tut.",
      mood: "gentle",
    };
  }

  if (shortQuestion) {
    return {
      text: "Das ist eine gute Frage. Ich würde sie so anschauen: Was weißt du schon? Was fühlt sich daran komisch oder wichtig an? Wenn eine Frage sehr groß ist, darf die Antwort auch langsam wachsen.",
      mood: "thinking",
    };
  }

  return pick([
    { text: "Ich höre dir zu. Magst du mir noch ein bisschen genauer sagen, was du meinst?", mood: "gentle" },
    { text: "Das klingt nach einem Gedanken, den man langsam anschauen kann. Was ist daran für dich am wichtigsten?", mood: "thinking" },
    { text: "Manchmal ist der erste Satz nur der Anfang. Erzähl mir gern weiter.", mood: "idle" },
  ]);
}

export default function LumiChat({ open = false, onClose = () => {}, setMood = () => {} }) {
  const [messages, setMessages] = useState([{ text: START_MESSAGE, sender: "lumi" }]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { text: inputVal, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    playPop();
    setIsTyping(true);
    setMood("thinking");

    // Simulate typing delay
    setTimeout(() => {
      const lumiReply = getLumiResponse(userMsg.text);
      setMessages(prev => [...prev, { text: lumiReply.text, sender: "lumi" }]);
      setIsTyping(false);
      setMood(lumiReply.mood);
      playSparkle();
      setTimeout(() => setMood("idle"), 4000);
    }, 1500);
  };

  const usePrompt = (prompt) => {
    playPop();
    setInputVal(prompt);
  };

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      
      {/* THE CHAT WINDOW */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="w-80 md:w-96 h-[500px] max-h-[70vh] bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl mb-4 border-4 border-white/60 flex flex-col overflow-hidden watercolor-effect"
          >
            {/* Header */}
            <div className="bg-amber-100 p-4 border-b-2 border-amber-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden relative border-2 border-amber-200">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.6]">
                    <LumiSvg mood={messages[messages.length-1]?.sender === 'lumi' ? 'idle' : 'thinking'} />
                  </div>
                </div>
                <div>
                  <h3 className="font-hand font-bold text-slate-700 text-xl leading-none">Lumi</h3>
                  <span className="text-xs text-amber-600 font-bold tracking-wide uppercase">Dein Begleiter</span>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/50 hover:bg-white text-slate-500 flex items-center justify-center transition-colors">✕</button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, idx) => {
                const isLumi = msg.sender === "lumi";
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isLumi ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm md:text-base font-hand tracking-wide ${isLumi ? "bg-white text-slate-700 rounded-tl-sm border-2 border-slate-100" : "bg-emerald-500 text-white rounded-tr-sm"}`}>
                      {msg.text}
                    </div>
                  </motion.div>
                )
              })}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-slate-100">
                     <ThinkingDots />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 bg-white/50 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => usePrompt(prompt)}
                    className="px-3 py-1.5 rounded-full bg-white/80 border-2 border-amber-100 text-amber-700 font-hand text-lg hover:border-amber-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSend} className="p-4 bg-white/50 border-t-2 border-white flex gap-2">
              <input 
                type="text" 
                placeholder="Frag Lumi etwas Kleines oder Großes..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                className="flex-1 bg-white border-2 border-slate-200 rounded-full px-4 py-2 font-hand text-slate-700 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button 
                type="submit"
                disabled={!inputVal.trim()}
                className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-md"
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
