import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  Copy,
  Download,
  Eraser,
  FolderOpen,
  Keyboard,
  Mic2,
  Music2,
  Plus,
  Save,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Volume2,
} from "lucide-react";
import {
  playClap,
  playCrash,
  playHiHat,
  playInstrumentTone,
  playKick,
  playMicSample,
  playRim,
  playShaker,
  playSnare,
  playTom,
} from "../../utils/sounds";
import MicSampler from "./MicSampler";

const DEFAULT_STEPS = 16;
const MAX_TRACKS = 12;
const CURRENT_STORAGE_KEY = "faskar-flow-beat-current-v2";
const PROJECT_STORAGE_KEY = "faskar-flow-beat-projects-v2";

const DRUM_SOUNDS = [
  { id: "kick_deep", name: "Kick tief", short: "Kick", hue: "#6366f1", play: (track) => playKick(track) },
  { id: "kick_soft", name: "Kick weich", short: "Soft", hue: "#818cf8", play: (track) => playKick({ ...track, volume: track.volume * 0.76, send: 0.12 }) },
  { id: "snare_snap", name: "Snare knackig", short: "Snare", hue: "#ec4899", play: (track) => playSnare(track) },
  { id: "snare_room", name: "Snare Raum", short: "Room", hue: "#f472b6", play: (track) => playSnare({ ...track, volume: track.volume * 0.82, send: 0.22 }) },
  { id: "clap", name: "Clap", short: "Clap", hue: "#fb7185", play: (track) => playClap(track) },
  { id: "rim", name: "Rimshot", short: "Rim", hue: "#f97316", play: (track) => playRim(track) },
  { id: "hat_closed", name: "Hi-Hat zu", short: "Hat", hue: "#facc15", play: (track) => playHiHat(track) },
  { id: "hat_open", name: "Hi-Hat offen", short: "Open", hue: "#fde047", play: (track) => playHiHat({ ...track, open: true }) },
  { id: "shaker", name: "Shaker", short: "Shake", hue: "#a3e635", play: (track) => playShaker(track) },
  { id: "tom_low", name: "Tom tief", short: "Tom L", hue: "#14b8a6", play: (track) => playTom({ ...track, freq: 122 }) },
  { id: "tom_mid", name: "Tom mittel", short: "Tom M", hue: "#2dd4bf", play: (track) => playTom({ ...track, freq: 172 }) },
  { id: "tom_high", name: "Tom hoch", short: "Tom H", hue: "#38bdf8", play: (track) => playTom({ ...track, freq: 238 }) },
  { id: "crash", name: "Crash", short: "Crash", hue: "#0ea5e9", play: (track) => playCrash(track) },
  { id: "perc_wood", name: "Holz-Perc", short: "Wood", hue: "#d97706", play: (track) => playInstrumentTone("xylophon", 740, { velocity: track.volume * 0.85, pan: track.pan, send: track.send }) },
  { id: "perc_bell", name: "Glöckchen", short: "Bell", hue: "#c084fc", play: (track) => playInstrumentTone("glockenspiel", 988, { velocity: track.volume * 0.7, pan: track.pan, send: 0.28 }) },
  { id: "perc_bass", name: "808 Ton", short: "808", hue: "#22c55e", play: (track) => playInstrumentTone("bass", 196, { velocity: track.volume, pan: track.pan, send: 0.04 }) },
];

const MELODIC_INSTRUMENTS = [
  { id: "piano", name: "Piano" },
  { id: "glockenspiel", name: "Glocken" },
  { id: "kalimba", name: "Kalimba" },
  { id: "xylophon", name: "Xylo" },
  { id: "gitarre", name: "Gitarre" },
  { id: "bass", name: "Bass" },
  { id: "floete", name: "Flöte" },
  { id: "trompete", name: "Trompete" },
  { id: "chor", name: "Chor" },
  { id: "traum", name: "Dream Pad" },
];

const KEYBOARD_NOTES = [
  { note: "C4", freq: 261.63, type: "white", key: "A" },
  { note: "C#4", freq: 277.18, type: "black", key: "W" },
  { note: "D4", freq: 293.66, type: "white", key: "S" },
  { note: "D#4", freq: 311.13, type: "black", key: "E" },
  { note: "E4", freq: 329.63, type: "white", key: "D" },
  { note: "F4", freq: 349.23, type: "white", key: "F" },
  { note: "F#4", freq: 369.99, type: "black", key: "T" },
  { note: "G4", freq: 392, type: "white", key: "G" },
  { note: "G#4", freq: 415.3, type: "black", key: "Y" },
  { note: "A4", freq: 440, type: "white", key: "H" },
  { note: "A#4", freq: 466.16, type: "black", key: "U" },
  { note: "B4", freq: 493.88, type: "white", key: "J" },
  { note: "C5", freq: 523.25, type: "white", key: "K" },
  { note: "D5", freq: 587.33, type: "white", key: "L" },
  { note: "E5", freq: 659.25, type: "white", key: "Ö" },
  { note: "G5", freq: 783.99, type: "white", key: "Ä" },
];

const COMPUTER_KEYS = new Map(KEYBOARD_NOTES.map((note) => [note.key.toLowerCase(), note]));

const PATTERN_TEMPLATES = [
  {
    id: "pop",
    name: "Pop Groove",
    bpm: 112,
    steps: 16,
    patterns: {
      kick_deep: [0, 8],
      snare_snap: [4, 12],
      hat_closed: [0, 2, 4, 6, 8, 10, 12, 14],
      clap: [12],
    },
    melody: [
      ["C4", 0],
      ["E4", 4],
      ["G4", 8],
      ["C5", 12],
    ],
  },
  {
    id: "trap",
    name: "Trap Steps",
    bpm: 142,
    steps: 16,
    patterns: {
      kick_deep: [0, 3, 8, 10],
      snare_room: [4, 12],
      hat_closed: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15],
      perc_bass: [0, 7, 10],
    },
    melody: [
      ["C4", 0],
      ["D#4", 3],
      ["G4", 8],
      ["F4", 11],
    ],
  },
  {
    id: "garage",
    name: "Garage Beat",
    bpm: 126,
    steps: 16,
    patterns: {
      kick_soft: [0, 7, 10],
      snare_snap: [4, 12],
      hat_closed: [0, 2, 4, 5, 8, 10, 12, 13],
      shaker: [1, 3, 5, 7, 9, 11, 13, 15],
      perc_bell: [6, 14],
    },
    melody: [
      ["C4", 0],
      ["G4", 4],
      ["A4", 8],
      ["G4", 12],
    ],
  },
  {
    id: "cinema",
    name: "Filmisch",
    bpm: 84,
    steps: 16,
    patterns: {
      kick_soft: [0, 8],
      clap: [12],
      crash: [0],
      tom_low: [6],
      tom_mid: [10],
      tom_high: [14],
    },
    melody: [
      ["C4", 0],
      ["E4", 4],
      ["G4", 8],
      ["E5", 12],
    ],
  },
];

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const emptyPattern = (steps = DEFAULT_STEPS) => Array.from({ length: steps }, () => false);
const emptyNotes = (steps = DEFAULT_STEPS) => Array.from({ length: steps }, () => null);

const fitArray = (array, steps, fillValue) => {
  const source = Array.isArray(array) ? array : [];
  return Array.from({ length: steps }, (_, index) => source[index] ?? fillValue);
};

const findNote = (noteName) => KEYBOARD_NOTES.find((note) => note.note === noteName) || KEYBOARD_NOTES[0];
const drumById = (id) => DRUM_SOUNDS.find((sound) => sound.id === id) || DRUM_SOUNDS[0];

const createTrack = ({ kind = "drum", instId = "kick_deep", instrument = "piano", name, steps = DEFAULT_STEPS }) => ({
  id: `track_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  kind,
  instId,
  instrument,
  name: name || (kind === "melody" ? "Melodie" : drumById(instId).name),
  volume: kind === "melody" ? 0.82 : 0.9,
  pan: 0,
  send: kind === "melody" ? 0.22 : 0.1,
  muted: false,
  solo: false,
  pattern: emptyPattern(steps),
  notes: emptyNotes(steps),
});

const createDefaultTracks = (steps = DEFAULT_STEPS) => {
  const kick = createTrack({ instId: "kick_deep", name: "Kick", steps });
  const snare = createTrack({ instId: "snare_snap", name: "Snare", steps });
  const hats = createTrack({ instId: "hat_closed", name: "Hi-Hat", steps });
  const clap = createTrack({ instId: "clap", name: "Clap", steps });
  const melody = createTrack({ kind: "melody", instrument: "piano", name: "Piano", steps });

  kick.pattern = kick.pattern.map((_, index) => [0, 8].includes(index));
  snare.pattern = snare.pattern.map((_, index) => [4, 12].includes(index));
  hats.pattern = hats.pattern.map((_, index) => index % 2 === 0);
  clap.pattern = clap.pattern.map((_, index) => index === 12);
  melody.notes = melody.notes.map((_, index) => {
    const entry = [
      ["C4", 0],
      ["E4", 4],
      ["G4", 8],
      ["C5", 12],
    ].find(([, step]) => step === index);
    if (!entry) return null;
    const note = findNote(entry[0]);
    return { note: note.note, freq: note.freq, velocity: 0.88 };
  });

  return [kick, snare, hats, clap, melody];
};

const sanitizeTrack = (track, steps) => ({
  id: track.id || `track_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  kind: track.kind === "melody" || track.kind === "sample" ? track.kind : "drum",
  instId: track.instId || "kick_deep",
  instrument: track.instrument || "piano",
  name: track.name || "Spur",
  volume: Number.isFinite(track.volume) ? track.volume : 0.9,
  pan: Number.isFinite(track.pan) ? track.pan : 0,
  send: Number.isFinite(track.send) ? track.send : 0.12,
  muted: Boolean(track.muted),
  solo: Boolean(track.solo),
  pattern: fitArray(track.pattern, steps, false).map(Boolean),
  notes: fitArray(track.notes, steps, null),
});

const loadInitialProject = () => {
  if (typeof window === "undefined") {
    return { name: "Mein Beat", bpm: 118, steps: DEFAULT_STEPS, swing: 0.08, tracks: createDefaultTracks(DEFAULT_STEPS) };
  }
  const saved = safeParse(window.localStorage.getItem(CURRENT_STORAGE_KEY), null);
  if (!saved || !Array.isArray(saved.tracks)) {
    return { name: "Mein Beat", bpm: 118, steps: DEFAULT_STEPS, swing: 0.08, tracks: createDefaultTracks(DEFAULT_STEPS) };
  }
  const steps = saved.steps === 32 ? 32 : DEFAULT_STEPS;
  return {
    name: saved.name || "Mein Beat",
    bpm: Number.isFinite(saved.bpm) ? saved.bpm : 118,
    steps,
    swing: Number.isFinite(saved.swing) ? saved.swing : 0.08,
    tracks: saved.tracks.map((track) => sanitizeTrack(track, steps)).slice(0, MAX_TRACKS),
  };
};

const createTemplateTracks = (template) => {
  const tracks = createDefaultTracks(template.steps).map((track) => ({
    ...track,
    pattern: emptyPattern(template.steps),
    notes: emptyNotes(template.steps),
  }));

  Object.entries(template.patterns).forEach(([instId, activeSteps], index) => {
    const target = tracks.find((track) => track.instId === instId) || tracks[index] || createTrack({ instId, steps: template.steps });
    target.kind = "drum";
    target.instId = instId;
    target.name = drumById(instId).name;
    target.pattern = emptyPattern(template.steps).map((_, step) => activeSteps.includes(step));
    if (!tracks.includes(target)) tracks.push(target);
  });

  const melody = tracks.find((track) => track.kind === "melody") || createTrack({ kind: "melody", instrument: "piano", steps: template.steps });
  melody.instrument = template.id === "cinema" ? "traum" : template.id === "garage" ? "kalimba" : "piano";
  melody.name = MELODIC_INSTRUMENTS.find((instrument) => instrument.id === melody.instrument)?.name || "Melodie";
  melody.notes = emptyNotes(template.steps);
  template.melody.forEach(([noteName, step]) => {
    const note = findNote(noteName);
    melody.notes[step] = { note: note.note, freq: note.freq, velocity: 0.9 };
  });

  return tracks.slice(0, MAX_TRACKS);
};

export default function BeatMaker() {
  const [initialProject] = useState(loadInitialProject);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initialProject.bpm);
  const [steps, setSteps] = useState(initialProject.steps);
  const [swing, setSwing] = useState(initialProject.swing);
  const [currentStep, setCurrentStep] = useState(0);
  const [tracks, setTracks] = useState(initialProject.tracks);
  const [selectedTrackId, setSelectedTrackId] = useState(initialProject.tracks[0]?.id || "");
  const [selectedPadId, setSelectedPadId] = useState("kick_deep");
  const [selectedInstrument, setSelectedInstrument] = useState("piano");
  const [recordPads, setRecordPads] = useState(true);
  const [recordKeys, setRecordKeys] = useState(true);
  const [projectName, setProjectName] = useState(initialProject.name);
  const [savedProjects, setSavedProjects] = useState(() => {
    if (typeof window === "undefined") return [];
    return safeParse(window.localStorage.getItem(PROJECT_STORAGE_KEY), []);
  });
  const [customSamples, setCustomSamples] = useState([]);
  const [lastNote, setLastNote] = useState(KEYBOARD_NOTES[0]);

  const tracksRef = useRef(tracks);
  const bpmRef = useRef(bpm);
  const stepsRef = useRef(steps);
  const swingRef = useRef(swing);
  const currentStepRef = useRef(currentStep);
  const customSamplesRef = useRef(customSamples);

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) || tracks[0];
  const soloActive = tracks.some((track) => track.solo);

  const customSamplePads = customSamples.map((sample) => ({
    id: sample.id,
    name: sample.name,
    short: sample.name.slice(0, 5),
    hue: "#06b6d4",
    sample,
    play: (track) => playMicSample(sample.buffer, sample.trimStart, sample.trimEnd - sample.trimStart, track),
  }));

  const padBank = [...DRUM_SOUNDS, ...customSamplePads].slice(0, 24);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    swingRef.current = swing;
  }, [swing]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    customSamplesRef.current = customSamples;
  }, [customSamples]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = {
      name: projectName,
      bpm,
      steps,
      swing,
      tracks: tracks.map(({ id, kind, instId, instrument, name, volume, pan, send, muted, solo, pattern, notes }) => ({
        id,
        kind,
        instId,
        instrument,
        name,
        volume,
        pan,
        send,
        muted,
        solo,
        pattern,
        notes,
      })),
    };
    window.localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(payload));
  }, [bpm, projectName, steps, swing, tracks]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(savedProjects));
  }, [savedProjects]);

  const triggerPadSound = useCallback((padId, trackOptions = {}) => {
    const custom = customSamplesRef.current.find((sample) => sample.id === padId);
    if (custom) {
      playMicSample(custom.buffer, custom.trimStart, custom.trimEnd - custom.trimStart, trackOptions);
      return;
    }
    const pad = drumById(padId);
    pad.play(trackOptions);
  }, []);

  const playTrackStep = useCallback((track, stepIndex) => {
    if (soloActive && !track.solo) return;
    if (track.muted) return;

    const output = {
      volume: track.volume,
      pan: track.pan,
      send: track.send,
    };

    if (track.kind === "melody") {
      const note = track.notes[stepIndex];
      if (note) {
        playInstrumentTone(track.instrument || "piano", note.freq, {
          velocity: (note.velocity || 0.85) * track.volume,
          pan: track.pan,
          send: track.send,
        });
      }
      return;
    }

    if (track.pattern[stepIndex]) {
      triggerPadSound(track.instId, output);
    }
  }, [soloActive, triggerPadSound]);

  const triggerStep = useCallback((stepIndex) => {
    tracksRef.current.forEach((track) => {
      const shouldSwing = stepIndex % 2 === 1 && swingRef.current > 0;
      if (shouldSwing) {
        window.setTimeout(() => playTrackStep(track, stepIndex), Math.round((60000 / bpmRef.current / 4) * swingRef.current));
      } else {
        playTrackStep(track, stepIndex);
      }
    });
  }, [playTrackStep]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    let cancelled = false;
    let timerId = 0;

    const tick = () => {
      if (cancelled) return;
      const stepIndex = currentStepRef.current;
      triggerStep(stepIndex);
      const nextStep = (stepIndex + 1) % stepsRef.current;
      setCurrentStep(nextStep);
      currentStepRef.current = nextStep;
      timerId = window.setTimeout(tick, 60000 / bpmRef.current / 4);
    };

    tick();

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [isPlaying, triggerStep]);

  const updateTrack = (trackId, updater) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? updater(track) : track)));
  };

  const selectOrCreateTrack = (kind) => {
    const current = tracks.find((track) => track.id === selectedTrackId && track.kind === kind);
    if (current) return current.id;
    const existing = tracks.find((track) => track.kind === kind);
    if (existing) {
      setSelectedTrackId(existing.id);
      return existing.id;
    }
    if (tracks.length >= MAX_TRACKS) return tracks[0]?.id;
    const newTrack = createTrack({ kind, instId: selectedPadId, instrument: selectedInstrument, steps });
    setTracks((prev) => [...prev, newTrack]);
    setSelectedTrackId(newTrack.id);
    return newTrack.id;
  };

  const toggleStep = (trackId, stepIndex) => {
    updateTrack(trackId, (track) => {
      if (track.kind === "melody") {
        const nextNotes = [...track.notes];
        nextNotes[stepIndex] = nextNotes[stepIndex] ? null : { note: lastNote.note, freq: lastNote.freq, velocity: 0.86 };
        return { ...track, notes: nextNotes };
      }

      const nextPattern = [...track.pattern];
      nextPattern[stepIndex] = !nextPattern[stepIndex];
      return { ...track, pattern: nextPattern };
    });
  };

  const playPad = (pad) => {
    const options = selectedTrack?.kind === "drum" ? selectedTrack : { volume: 0.9, pan: 0, send: 0.12 };
    setSelectedPadId(pad.id);
    triggerPadSound(pad.id, options);
    if (!recordPads) return;
    const trackId = selectOrCreateTrack("drum");
    updateTrack(trackId, (track) => {
      const nextPattern = [...track.pattern];
      nextPattern[currentStepRef.current] = true;
      return {
        ...track,
        instId: pad.id,
        name: pad.name,
        pattern: nextPattern,
        kind: "drum",
      };
    });
  };

  function playKeyboardNote(note) {
    setLastNote(note);
    playInstrumentTone(selectedInstrument, note.freq, { velocity: 0.88, send: 0.22 });
    if (!recordKeys) return;
    const trackId = selectOrCreateTrack("melody");
    updateTrack(trackId, (track) => {
      const nextNotes = [...track.notes];
      nextNotes[currentStepRef.current] = { note: note.note, freq: note.freq, velocity: 0.9 };
      return {
        ...track,
        kind: "melody",
        instrument: selectedInstrument,
        name: MELODIC_INSTRUMENTS.find((instrument) => instrument.id === selectedInstrument)?.name || "Melodie",
        notes: nextNotes,
      };
    });
    setCurrentStep((value) => {
      const next = (value + 1) % stepsRef.current;
      currentStepRef.current = next;
      return next;
    });
  }

  const toggleTransport = () => {
    if (isPlaying) {
      setIsPlaying(false);
      currentStepRef.current = 0;
      setCurrentStep(0);
      return;
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.repeat) return;
      const target = event.target;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const note = COMPUTER_KEYS.get(event.key.toLowerCase());
      if (note) {
        event.preventDefault();
        playKeyboardNote(note);
      }
      if (event.code === "Space") {
        event.preventDefault();
        toggleTransport();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const addTrack = (kind) => {
    if (tracks.length >= MAX_TRACKS) return;
    const next = createTrack({
      kind,
      instId: selectedPadId,
      instrument: selectedInstrument,
      name: kind === "melody" ? MELODIC_INSTRUMENTS.find((instrument) => instrument.id === selectedInstrument)?.name : drumById(selectedPadId).name,
      steps,
    });
    setTracks((prev) => [...prev, next]);
    setSelectedTrackId(next.id);
  };

  const duplicateTrack = () => {
    if (!selectedTrack || tracks.length >= MAX_TRACKS) return;
    const copy = {
      ...selectedTrack,
      id: `${selectedTrack.id}_copy_${tracks.length + 1}`,
      name: `${selectedTrack.name} 2`,
      pattern: [...selectedTrack.pattern],
      notes: [...selectedTrack.notes],
    };
    setTracks((prev) => [...prev, copy]);
    setSelectedTrackId(copy.id);
  };

  const removeTrack = (trackId) => {
    setTracks((prev) => {
      const next = prev.filter((track) => track.id !== trackId);
      if (!next.some((track) => track.id === selectedTrackId)) {
        setSelectedTrackId(next[0]?.id || "");
      }
      return next.length ? next : createDefaultTracks(steps);
    });
  };

  const clearSelectedTrack = () => {
    if (!selectedTrack) return;
    updateTrack(selectedTrack.id, (track) => ({
      ...track,
      pattern: emptyPattern(steps),
      notes: emptyNotes(steps),
    }));
  };

  const randomizeSelectedTrack = () => {
    if (!selectedTrack) return;
    updateTrack(selectedTrack.id, (track) => {
      if (track.kind === "melody") {
        return {
          ...track,
          notes: emptyNotes(steps).map((_, index) => {
            if (Math.random() > (index % 4 === 0 ? 0.52 : 0.82)) return null;
            const note = KEYBOARD_NOTES[Math.floor(Math.random() * KEYBOARD_NOTES.length)];
            return { note: note.note, freq: note.freq, velocity: 0.72 + Math.random() * 0.24 };
          }),
        };
      }
      return {
        ...track,
        pattern: emptyPattern(steps).map((_, index) => Math.random() > (index % 4 === 0 ? 0.42 : 0.76)),
      };
    });
  };

  const changeSteps = (nextSteps) => {
    setSteps(nextSteps);
    setCurrentStep((step) => Math.min(step, nextSteps - 1));
    setTracks((prev) => prev.map((track) => ({
      ...track,
      pattern: fitArray(track.pattern, nextSteps, false).map(Boolean),
      notes: fitArray(track.notes, nextSteps, null),
    })));
  };

  const applyTemplate = (template) => {
    setBpm(template.bpm);
    setSteps(template.steps);
    setSwing(template.id === "garage" ? 0.16 : template.id === "trap" ? 0.04 : 0.08);
    const nextTracks = createTemplateTracks(template);
    setTracks(nextTracks);
    setSelectedTrackId(nextTracks[0]?.id || "");
    setProjectName(template.name);
    setCurrentStep(0);
  };

  const saveProject = () => {
    const payload = {
      id: `project_${Date.now()}`,
      name: projectName.trim() || "Beat",
      savedAt: new Date().toISOString(),
      bpm,
      steps,
      swing,
      tracks,
    };
    setSavedProjects((prev) => [payload, ...prev.filter((project) => project.name !== payload.name)].slice(0, 12));
  };

  const loadProject = (project) => {
    const nextSteps = project.steps === 32 ? 32 : DEFAULT_STEPS;
    setProjectName(project.name);
    setBpm(project.bpm || 118);
    setSteps(nextSteps);
    setSwing(project.swing || 0);
    const nextTracks = (project.tracks || []).map((track) => sanitizeTrack(track, nextSteps)).slice(0, MAX_TRACKS);
    setTracks(nextTracks.length ? nextTracks : createDefaultTracks(nextSteps));
    setSelectedTrackId(nextTracks[0]?.id || "");
    setCurrentStep(0);
  };

  const deleteProject = (projectId) => {
    setSavedProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  const exportProject = () => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ name: projectName, bpm, steps, swing, tracks }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName.trim() || "beat"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full overflow-hidden rounded-[34px] border border-slate-700 bg-slate-950 text-white shadow-2xl">
      <div className="relative overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,#312e81_0%,#0f172a_34%,#020617_100%)] px-5 py-6 md:px-8">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30">
                <Music2 size={25} />
              </div>
              <div>
                <input
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  className="w-full max-w-[28rem] bg-transparent font-hand text-4xl font-bold leading-tight text-white outline-none md:text-5xl"
                  aria-label="Projektname"
                />
                <div className="mt-1 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  <span>{tracks.length}/{MAX_TRACKS} Spuren</span>
                  <span>{steps} Steps</span>
                  <span>{bpm} BPM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleTransport}
              className={`flex h-16 min-w-16 items-center justify-center rounded-2xl px-6 shadow-xl transition ${isPlaying ? "bg-rose-500 shadow-rose-500/30" : "bg-emerald-400 text-slate-950 shadow-emerald-400/30"}`}
              aria-label={isPlaying ? "Stop" : "Play"}
            >
              {isPlaying ? <Square size={25} fill="currentColor" /> : <span className="ml-1 h-0 w-0 border-y-[12px] border-l-[18px] border-y-transparent border-l-current" />}
            </button>

            <div className="grid min-w-[18rem] grid-cols-2 gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
              <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Tempo
                <input className="mt-2 w-full accent-amber-400" type="range" min="60" max="190" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
              </label>
              <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Swing
                <input className="mt-2 w-full accent-fuchsia-400" type="range" min="0" max="0.28" step="0.01" value={swing} onChange={(event) => setSwing(Number(event.target.value))} />
              </label>
              <div className="col-span-2 flex items-center justify-between gap-2">
                {[16, 32].map((size) => (
                  <button
                    key={size}
                    onClick={() => changeSteps(size)}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm font-black uppercase tracking-widest ${steps === size ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                  >
                    {size} Steps
                  </button>
                ))}
              </div>
            </div>

            <MicSampler onSamplesUpdate={setCustomSamples} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:p-8 xl:grid-cols-[minmax(16rem,18rem)_1fr]">
        <section className="space-y-5">
          <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-amber-300">MPC Pads</p>
                <h3 className="font-hand text-3xl font-bold text-white">Drum Machine</h3>
              </div>
              <button
                onClick={() => setRecordPads((value) => !value)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${recordPads ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"}`}
              >
                Rec
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {padBank.slice(0, 16).map((pad) => (
                <Motion.button
                  key={pad.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => playPad(pad)}
                  className={`aspect-square rounded-2xl border border-white/10 p-2 text-left shadow-lg transition ${selectedPadId === pad.id ? "ring-2 ring-white" : "hover:border-white/30"}`}
                  style={{
                    background: `linear-gradient(145deg, ${pad.hue}, #0f172a 82%)`,
                    boxShadow: selectedPadId === pad.id ? `0 0 22px ${pad.hue}66` : undefined,
                  }}
                >
                  <span className="block text-[0.64rem] font-black uppercase tracking-widest text-white/70">{pad.short}</span>
                  <span className="mt-2 block truncate font-hand text-xl font-bold leading-none text-white">{pad.name}</span>
                </Motion.button>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <Keyboard className="text-sky-300" size={22} />
              <div>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-sky-300">Klaviatur</p>
                <h3 className="font-hand text-3xl font-bold text-white">Melodie einspielen</h3>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {MELODIC_INSTRUMENTS.map((instrument) => (
                <button
                  key={instrument.id}
                  onClick={() => setSelectedInstrument(instrument.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${selectedInstrument === instrument.id ? "bg-sky-400 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  {instrument.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setRecordKeys((value) => !value)}
              className={`mb-3 w-full rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest ${recordKeys ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"}`}
            >
              Melodie aufnehmen
            </button>

            <div className="flex h-36 items-stretch gap-1 overflow-x-auto rounded-2xl bg-slate-950 p-2">
              {KEYBOARD_NOTES.map((note) => (
                <Motion.button
                  key={note.note}
                  whileTap={{ y: 4 }}
                  onClick={() => playKeyboardNote(note)}
                  className={`relative flex min-w-12 flex-col items-center justify-end rounded-xl border px-2 pb-2 text-xs font-black ${
                    note.type === "black"
                      ? "h-24 bg-slate-900 text-white border-slate-600"
                      : "h-32 bg-white text-slate-900 border-slate-200"
                  }`}
                >
                  <span className="font-hand text-lg">{note.note}</span>
                  <span className={note.type === "black" ? "text-slate-500" : "text-slate-400"}>{note.key}</span>
                </Motion.button>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={19} className="text-fuchsia-300" />
              <h3 className="font-hand text-3xl font-bold text-white">Grooves</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PATTERN_TEMPLATES.map((template) => (
                <button key={template.id} onClick={() => applyTemplate(template)} className="rounded-2xl bg-slate-800 px-3 py-3 text-left font-bold text-slate-200 hover:bg-slate-700">
                  <span className="block font-hand text-2xl leading-none">{template.name}</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500">{template.bpm} BPM</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="min-w-0 space-y-5">
          <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="text-amber-300" size={22} />
                <div>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-amber-300">Sequencer</p>
                  <h3 className="font-hand text-3xl font-bold text-white">Pattern & Mixer</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => addTrack("drum")} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700">
                  <Plus size={16} /> Drum
                </button>
                <button onClick={() => addTrack("melody")} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700">
                  <Plus size={16} /> Melodie
                </button>
                <button onClick={duplicateTrack} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700">
                  <Copy size={16} /> Kopie
                </button>
                <button onClick={randomizeSelectedTrack} className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-black text-white hover:bg-fuchsia-400">
                  <Sparkles size={16} /> Würfeln
                </button>
              </div>
            </div>

            <div className="max-w-full overflow-x-auto pb-2">
              <div className="space-y-3" style={{ minWidth: steps === 32 ? "62rem" : "38rem" }}>
                <div className="grid items-center gap-1 pl-[13.25rem]" style={{ gridTemplateColumns: `repeat(${steps}, minmax(${steps === 32 ? "1.05rem" : "1.25rem"}, 1fr))` }}>
                  {Array.from({ length: steps }, (_, index) => (
                    <div key={index} className={`text-center text-[0.64rem] font-black ${currentStep === index ? "text-amber-300" : index % 4 === 0 ? "text-slate-300" : "text-slate-600"}`}>
                      {index + 1}
                    </div>
                  ))}
                </div>

                <AnimatePresence initial={false}>
                  {tracks.map((track) => {
                    const isSelected = selectedTrackId === track.id;
                    const color = track.kind === "melody" ? "#38bdf8" : drumById(track.instId).hue;

                    return (
                      <Motion.div
                        key={track.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className={`grid items-center gap-1 rounded-2xl border p-2 transition ${isSelected ? "border-amber-300 bg-slate-800" : "border-slate-800 bg-slate-950/70"}`}
                        style={{ gridTemplateColumns: `12.75rem repeat(${steps}, minmax(${steps === 32 ? "1.05rem" : "1.25rem"}, 1fr))` }}
                        onClick={() => setSelectedTrackId(track.id)}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="h-10 w-2 rounded-full" style={{ backgroundColor: color }} />
                          <div className="min-w-0 flex-1">
                            <input
                              value={track.name}
                              onChange={(event) => updateTrack(track.id, (prev) => ({ ...prev, name: event.target.value }))}
                              className="w-full bg-transparent font-hand text-xl font-bold leading-none text-white outline-none"
                              aria-label="Spurname"
                            />
                            <div className="mt-1 flex flex-wrap items-center gap-1">
                              {track.kind === "melody" ? (
                                <select
                                  value={track.instrument}
                                  onChange={(event) => updateTrack(track.id, (prev) => ({ ...prev, instrument: event.target.value, name: MELODIC_INSTRUMENTS.find((instrument) => instrument.id === event.target.value)?.name || prev.name }))}
                                  className="max-w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[0.65rem] font-bold text-slate-300 outline-none"
                                >
                                  {MELODIC_INSTRUMENTS.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name}</option>)}
                                </select>
                              ) : (
                                <select
                                  value={track.instId}
                                  onChange={(event) => updateTrack(track.id, (prev) => ({ ...prev, instId: event.target.value, name: padBank.find((pad) => pad.id === event.target.value)?.name || prev.name }))}
                                  className="max-w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[0.65rem] font-bold text-slate-300 outline-none"
                                >
                                  {padBank.map((pad) => <option key={pad.id} value={pad.id}>{pad.name}</option>)}
                                </select>
                              )}
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateTrack(track.id, (prev) => ({ ...prev, muted: !prev.muted }));
                                }}
                                className={`rounded-lg px-2 py-1 text-[0.62rem] font-black ${track.muted ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"}`}
                              >
                                M
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateTrack(track.id, (prev) => ({ ...prev, solo: !prev.solo }));
                                }}
                                className={`rounded-lg px-2 py-1 text-[0.62rem] font-black ${track.solo ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-400"}`}
                              >
                                S
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeTrack(track.id);
                                }}
                                className="rounded-lg bg-slate-800 p-1 text-slate-500 hover:text-rose-300"
                                aria-label="Spur löschen"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              <label className="text-[0.58rem] font-black uppercase tracking-widest text-slate-500">
                                <Volume2 size={11} className="mb-0.5 inline" /> Vol
                                <input type="range" min="0" max="1.2" step="0.01" value={track.volume} onChange={(event) => updateTrack(track.id, (prev) => ({ ...prev, volume: Number(event.target.value) }))} className="block w-full accent-amber-400" />
                              </label>
                              <label className="text-[0.58rem] font-black uppercase tracking-widest text-slate-500">
                                Pan
                                <input type="range" min="-1" max="1" step="0.01" value={track.pan} onChange={(event) => updateTrack(track.id, (prev) => ({ ...prev, pan: Number(event.target.value) }))} className="block w-full accent-sky-400" />
                              </label>
                              <label className="text-[0.58rem] font-black uppercase tracking-widest text-slate-500">
                                FX
                                <input type="range" min="0" max="0.55" step="0.01" value={track.send} onChange={(event) => updateTrack(track.id, (prev) => ({ ...prev, send: Number(event.target.value) }))} className="block w-full accent-fuchsia-400" />
                              </label>
                            </div>
                          </div>
                        </div>

                        {Array.from({ length: steps }, (_, index) => {
                          const active = track.kind === "melody" ? Boolean(track.notes[index]) : Boolean(track.pattern[index]);
                          const isBeat = index % 4 === 0;
                          const isNow = isPlaying && currentStep === index;
                          return (
                            <Motion.button
                              key={index}
                              whileTap={{ scale: 0.9 }}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleStep(track.id, index);
                              }}
                              className={`relative h-10 rounded-lg border text-[0.6rem] font-black transition ${
                                active ? "border-white/50 text-white shadow-lg" : isBeat ? "border-slate-700 bg-slate-800 text-slate-500" : "border-slate-800 bg-slate-900 text-slate-600"
                              } ${isNow ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-950" : ""}`}
                              style={active ? { backgroundColor: color, boxShadow: `0 0 18px ${color}55` } : undefined}
                            >
                              {track.kind === "melody" && track.notes[index]?.note ? track.notes[index].note.replace("#", "♯") : active ? "●" : ""}
                            </Motion.button>
                          );
                        })}
                      </Motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-slate-800 pt-4">
              <button onClick={clearSelectedTrack} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-200 hover:bg-slate-700">
                <Eraser size={16} /> Spur leeren
              </button>
              <button
                onClick={() => {
                  setTracks(createDefaultTracks(steps));
                  setCurrentStep(0);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-200 hover:bg-slate-700"
              >
                <Trash2 size={16} /> Alles neu
              </button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <Save className="text-emerald-300" size={20} />
                <h3 className="font-hand text-3xl font-bold text-white">Projekte</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={saveProject} className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-emerald-300">
                  <Save size={16} /> Speichern
                </button>
                <button onClick={exportProject} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700">
                  <Download size={16} /> Export
                </button>
              </div>
              <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
                {savedProjects.length === 0 && <p className="font-hand text-2xl text-slate-500">Noch kein gespeicherter Beat.</p>}
                {savedProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950 px-3 py-2">
                    <button onClick={() => loadProject(project)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate font-hand text-2xl font-bold text-white">{project.name}</span>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">{project.bpm} BPM · {project.steps} Steps</span>
                    </button>
                    <button onClick={() => loadProject(project)} className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700" aria-label="Projekt laden">
                      <FolderOpen size={16} />
                    </button>
                    <button onClick={() => deleteProject(project.id)} className="rounded-full bg-slate-800 p-2 text-slate-500 hover:text-rose-300" aria-label="Projekt löschen">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <Mic2 className="text-cyan-300" size={20} />
                <h3 className="font-hand text-3xl font-bold text-white">Sound-Auswahl</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {padBank.map((pad) => (
                  <button
                    key={pad.id}
                    onClick={() => {
                      setSelectedPadId(pad.id);
                      triggerPadSound(pad.id, selectedTrack || { volume: 0.9, pan: 0, send: 0.12 });
                    }}
                    className={`rounded-2xl border px-3 py-2 text-left ${selectedPadId === pad.id ? "border-white bg-slate-800" : "border-slate-800 bg-slate-950 hover:bg-slate-800"}`}
                  >
                    <span className="block h-2 w-10 rounded-full" style={{ backgroundColor: pad.hue }} />
                    <span className="mt-2 block truncate font-hand text-xl font-bold text-white">{pad.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
