import { getAudioContext } from "./sounds.js";

const safeTime = (time) => Math.max(time, 0.001);
const MIN_GAIN = 0.0001;

const envelope = (gainParam, start, attack, hold, release, peak, sustain = peak * 0.35) => {
  gainParam.cancelScheduledValues(start);
  gainParam.setValueAtTime(MIN_GAIN, start);
  gainParam.linearRampToValueAtTime(Math.max(peak, MIN_GAIN), start + safeTime(attack));
  gainParam.exponentialRampToValueAtTime(Math.max(sustain, MIN_GAIN), start + safeTime(attack + hold));
  gainParam.exponentialRampToValueAtTime(MIN_GAIN, start + safeTime(attack + hold + release));
};

const createOutput = ({ volume = 1, pan = 0 } = {}) => {
  const ctx = getAudioContext();
  if (!ctx) return null;

  const input = ctx.createGain();
  input.gain.value = volume;

  let output = input;
  if (ctx.createStereoPanner) {
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    input.connect(panner);
    output = panner;
  }
  
  output.connect(ctx.destination);
  return { ctx, input };
};

export const voice = ({
  freq,
  type = "sine",
  start = 0,
  attack = 0.01,
  hold = 0.08,
  release = 0.35,
  gain = 0.32,
  sustain,
  detune = 0,
  destination,
  filter,
  bendTo,
  bendTime = 0.2,
}) => {
  const ctx = getAudioContext();
  if (!ctx || !destination || !freq || freq <= 0) return null;

  const now = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filterNode = filter ? ctx.createBiquadFilter() : null;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.detune.setValueAtTime(detune, now);

  if (bendTo) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(bendTo, 1), now + safeTime(bendTime));
  }

  if (filterNode) {
    filterNode.type = filter.type || "lowpass";
    filterNode.frequency.setValueAtTime(filter.frequency || 2200, now);
    filterNode.Q.value = filter.q || 0.8;
    if (filter.to) {
      filterNode.frequency.linearRampToValueAtTime(filter.to, now + safeTime(filter.time || 0.35));
    }
    osc.connect(filterNode);
    filterNode.connect(gainNode);
  } else {
    osc.connect(gainNode);
  }

  envelope(gainNode.gain, now, attack, hold, release, gain, sustain);
  gainNode.connect(destination);
  osc.start(now);
  osc.stop(now + attack + hold + release + 0.06);
  return osc;
};

export const noiseBurst = ({
  start = 0,
  duration = 0.16,
  attack = 0.004,
  release = 0.12,
  gain = 0.22,
  filterType = "bandpass",
  frequency = 1800,
  q = 1,
  output,
} = {}) => {
  const ctx = getAudioContext();
  if (!ctx || !output) return;

  const now = ctx.currentTime + start;
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i += 1) {
    const fade = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * fade;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, now);
  filter.Q.value = q;

  const gainNode = ctx.createGain();
  envelope(gainNode.gain, now, attack, Math.max(duration - release, 0.01), release, gain, gain * 0.4);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(output);
  source.start(now);
  source.stop(now + duration + release + 0.04);
};

export const BASS_INSTRUMENTS = [
  {
    id: "808_deep",
    name: "Deep 808",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sine", start, attack: 0.02, hold: 0.4, release: 1.2, gain: 0.9, destination: out.input, bendTo: freq * 0.95, bendTime: 0.6 });
      voice({ freq: freq * 2, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.4, gain: 0.15, destination: out.input, filter: { type: "lowpass", frequency: 300 } });
    }
  },
  {
    id: "808_punch",
    name: "Punchy 808",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq: freq * 2, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.6, gain: 0.8, destination: out.input, bendTo: freq, bendTime: 0.05 });
      voice({ freq, type: "square", start, attack: 0.01, hold: 0.1, release: 0.5, gain: 0.1, destination: out.input, filter: { type: "lowpass", frequency: 400 } });
    }
  },
  {
    id: "808_distorted",
    name: "Distorted 808",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sine", start, attack: 0.02, hold: 0.3, release: 0.8, gain: 0.9, destination: out.input });
      voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.2, release: 0.6, gain: 0.3, destination: out.input, filter: { type: "lowpass", frequency: 800, to: 300, time: 0.4 } });
    }
  },
  {
    id: "808_glide",
    name: "Glide 808",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq: freq * 1.5, type: "sine", start, attack: 0.05, hold: 0.4, release: 1.0, gain: 0.9, destination: out.input, bendTo: freq, bendTime: 0.2 });
    }
  },
  {
    id: "sub_basic",
    name: "Basic Sub",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sine", start, attack: 0.05, hold: 0.3, release: 0.5, gain: 1.0, destination: out.input });
    }
  },
  {
    id: "sub_warm",
    name: "Warm Sub",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sine", start, attack: 0.04, hold: 0.3, release: 0.5, gain: 0.8, destination: out.input });
      voice({ freq, type: "triangle", start, attack: 0.04, hold: 0.3, release: 0.5, gain: 0.3, destination: out.input, filter: { type: "lowpass", frequency: 200 } });
    }
  },
  {
    id: "sub_thick",
    name: "Thick Sub",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sine", start, attack: 0.05, hold: 0.3, release: 0.5, gain: 0.8, destination: out.input });
      voice({ freq: freq * 0.5, type: "square", start, attack: 0.05, hold: 0.3, release: 0.5, gain: 0.15, destination: out.input, filter: { type: "lowpass", frequency: 150 } });
    }
  },
  {
    id: "reese_classic",
    name: "Classic Reese",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: -10, destination: out.input, filter: { type: "lowpass", frequency: 1200 } });
      voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: 10, destination: out.input, filter: { type: "lowpass", frequency: 1200 } });
    }
  },
  {
    id: "reese_wide",
    name: "Wide Reese",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.08, hold: 0.4, release: 0.6, gain: 0.3, detune: -15, destination: out.input, filter: { type: "lowpass", frequency: 1500 } });
      voice({ freq, type: "sawtooth", start, attack: 0.08, hold: 0.4, release: 0.6, gain: 0.3, detune: 15, destination: out.input, filter: { type: "lowpass", frequency: 1500 } });
      voice({ freq: freq * 0.5, type: "square", start, attack: 0.08, hold: 0.4, release: 0.6, gain: 0.2, destination: out.input, filter: { type: "lowpass", frequency: 400 } });
    }
  },
  {
    id: "reese_filtered",
    name: "Filtered Reese",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: -8, destination: out.input, filter: { type: "lowpass", frequency: 2000, to: 400, time: 0.4 } });
      voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: 8, destination: out.input, filter: { type: "lowpass", frequency: 2000, to: 400, time: 0.4 } });
    }
  },
  {
    id: "fm_wobble_slow",
    name: "Slow Wobble",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.5, release: 0.4, gain: 0.5, destination: out.input, filter: { type: "lowpass", frequency: 300, to: 1200, time: 0.3, q: 2 } });
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.02, hold: 0.5, release: 0.4, gain: 0.6, destination: out.input });
    }
  },
  {
    id: "fm_wobble_fast",
    name: "Fast Wobble",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "square", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.4, destination: out.input, filter: { type: "lowpass", frequency: 200, to: 1800, time: 0.1, q: 3 } });
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.6, destination: out.input });
    }
  },
  {
    id: "fm_bass_pluck",
    name: "FM Pluck Bass",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sine", start, attack: 0.01, hold: 0.15, release: 0.4, gain: 0.8, destination: out.input });
      voice({ freq: freq * 2, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.2, gain: 0.4, destination: out.input, bendTo: freq, bendTime: 0.1 });
    }
  },
  {
    id: "slap_bass_acoustic",
    name: "Acoustic Slap",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.5, gain: 0.7, destination: out.input });
      noiseBurst({ start, duration: 0.04, attack: 0.002, release: 0.03, gain: 0.15, frequency: 1200, filterType: "bandpass", q: 1, output: out.input });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.01, hold: 0.05, release: 0.2, gain: 0.2, destination: out.input });
    }
  },
  {
    id: "slap_bass_synth",
    name: "Synth Slap",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.4, gain: 0.5, destination: out.input, filter: { type: "lowpass", frequency: 3000, to: 400, time: 0.1 } });
      voice({ freq: freq * 0.5, type: "square", start, attack: 0.01, hold: 0.1, release: 0.4, gain: 0.3, destination: out.input, filter: { type: "lowpass", frequency: 800, to: 200, time: 0.1 } });
    }
  },
  {
    id: "acid_303_classic",
    name: "Classic Acid",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.6, destination: out.input, filter: { type: "lowpass", frequency: 4000, to: 300, time: 0.15, q: 4 } });
    }
  },
  {
    id: "acid_303_squelch",
    name: "Squelch Acid",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "square", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.5, destination: out.input, filter: { type: "lowpass", frequency: 5000, to: 400, time: 0.2, q: 8 } });
    }
  },
  {
    id: "acid_square",
    name: "Square Acid",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "square", start, attack: 0.01, hold: 0.15, release: 0.3, gain: 0.5, destination: out.input, filter: { type: "lowpass", frequency: 2500, to: 500, time: 0.1, q: 3 } });
    }
  },
  {
    id: "moog_model_d",
    name: "Model D Style",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.4, destination: out.input, filter: { type: "lowpass", frequency: 1800, to: 400, time: 0.2, q: 2 } });
      voice({ freq: freq * 0.5, type: "square", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.3, destination: out.input, filter: { type: "lowpass", frequency: 1800, to: 400, time: 0.2, q: 2 } });
    }
  },
  {
    id: "moog_taurus",
    name: "Taurus Bass",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.8, gain: 0.35, detune: -6, destination: out.input, filter: { type: "lowpass", frequency: 1200, to: 300, time: 0.5 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.8, gain: 0.35, detune: 6, destination: out.input, filter: { type: "lowpass", frequency: 1200, to: 300, time: 0.5 } });
    }
  },
  {
    id: "moog_subphatty",
    name: "Sub Phatty",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.2, release: 0.4, gain: 0.4, destination: out.input, filter: { type: "lowpass", frequency: 2000, to: 500, time: 0.15 } });
      voice({ freq: freq * 0.5, type: "triangle", start, attack: 0.01, hold: 0.2, release: 0.4, gain: 0.5, destination: out.input });
    }
  },
  {
    id: "pluck_bass_simple",
    name: "Simple Pluck",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "square", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.5, destination: out.input, filter: { type: "lowpass", frequency: 3000, to: 300, time: 0.1 } });
    }
  },
  {
    id: "pluck_bass_fm",
    name: "FM Pluck",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sine", start, attack: 0.005, hold: 0.1, release: 0.3, gain: 0.7, destination: out.input });
      voice({ freq: freq * 3, type: "triangle", start, attack: 0.005, hold: 0.05, release: 0.1, gain: 0.3, destination: out.input, filter: { type: "highpass", frequency: 800 } });
    }
  },
  {
    id: "pluck_bass_hollow",
    name: "Hollow Pluck",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "triangle", start, attack: 0.005, hold: 0.1, release: 0.3, gain: 0.6, destination: out.input });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.3, destination: out.input });
    }
  },
  {
    id: "tech_house_bass",
    name: "Tech House Bass",
    play: (freq, opts = {}) => {
      const out = createOutput(opts);
      if (!out) return;
      const { start = 0 } = opts;
      voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.2, gain: 0.4, destination: out.input, filter: { type: "lowpass", frequency: 1500, to: 200, time: 0.1 } });
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.01, hold: 0.1, release: 0.25, gain: 0.6, destination: out.input });
    }
  }
];

export const playBassInstrument = (id, freq, opts = {}) => {
  const bass = BASS_INSTRUMENTS.find(b => b.id === id);
  if (bass) {
    bass.play(freq, opts);
  }
};

/*
// ============================================================================
// Melodic Synths (cases for playInstrumentTone)
// Dump these directly into the switch(instrumentId) statement in sounds.js
// if you wish to integrate them directly into the main module.
// ============================================================================

case "808_deep":
  voice({ freq, type: "sine", start, attack: 0.02, hold: 0.4, release: 1.2, gain: 0.9, destination: input, bendTo: freq * 0.95, bendTime: 0.6 });
  voice({ freq: freq * 2, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.4, gain: 0.15, destination: input, filter: { type: "lowpass", frequency: 300 } });
  break;
case "808_punch":
  voice({ freq: freq * 2, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.6, gain: 0.8, destination: input, bendTo: freq, bendTime: 0.05 });
  voice({ freq, type: "square", start, attack: 0.01, hold: 0.1, release: 0.5, gain: 0.1, destination: input, filter: { type: "lowpass", frequency: 400 } });
  break;
case "808_distorted":
  voice({ freq, type: "sine", start, attack: 0.02, hold: 0.3, release: 0.8, gain: 0.9, destination: input });
  voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.2, release: 0.6, gain: 0.3, destination: input, filter: { type: "lowpass", frequency: 800, to: 300, time: 0.4 } });
  break;
case "808_glide":
  voice({ freq: freq * 1.5, type: "sine", start, attack: 0.05, hold: 0.4, release: 1.0, gain: 0.9, destination: input, bendTo: freq, bendTime: 0.2 });
  break;
case "sub_basic":
  voice({ freq, type: "sine", start, attack: 0.05, hold: 0.3, release: 0.5, gain: 1.0, destination: input });
  break;
case "sub_warm":
  voice({ freq, type: "sine", start, attack: 0.04, hold: 0.3, release: 0.5, gain: 0.8, destination: input });
  voice({ freq, type: "triangle", start, attack: 0.04, hold: 0.3, release: 0.5, gain: 0.3, destination: input, filter: { type: "lowpass", frequency: 200 } });
  break;
case "sub_thick":
  voice({ freq, type: "sine", start, attack: 0.05, hold: 0.3, release: 0.5, gain: 0.8, destination: input });
  voice({ freq: freq * 0.5, type: "square", start, attack: 0.05, hold: 0.3, release: 0.5, gain: 0.15, destination: input, filter: { type: "lowpass", frequency: 150 } });
  break;
case "reese_classic":
  voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: -10, destination: input, filter: { type: "lowpass", frequency: 1200 } });
  voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: 10, destination: input, filter: { type: "lowpass", frequency: 1200 } });
  break;
case "reese_wide":
  voice({ freq, type: "sawtooth", start, attack: 0.08, hold: 0.4, release: 0.6, gain: 0.3, detune: -15, destination: input, filter: { type: "lowpass", frequency: 1500 } });
  voice({ freq, type: "sawtooth", start, attack: 0.08, hold: 0.4, release: 0.6, gain: 0.3, detune: 15, destination: input, filter: { type: "lowpass", frequency: 1500 } });
  voice({ freq: freq * 0.5, type: "square", start, attack: 0.08, hold: 0.4, release: 0.6, gain: 0.2, destination: input, filter: { type: "lowpass", frequency: 400 } });
  break;
case "reese_filtered":
  voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: -8, destination: input, filter: { type: "lowpass", frequency: 2000, to: 400, time: 0.4 } });
  voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.6, gain: 0.4, detune: 8, destination: input, filter: { type: "lowpass", frequency: 2000, to: 400, time: 0.4 } });
  break;
case "fm_wobble_slow":
  voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.5, release: 0.4, gain: 0.5, destination: input, filter: { type: "lowpass", frequency: 300, to: 1200, time: 0.3, q: 2 } });
  voice({ freq: freq * 0.5, type: "sine", start, attack: 0.02, hold: 0.5, release: 0.4, gain: 0.6, destination: input });
  break;
case "fm_wobble_fast":
  voice({ freq, type: "square", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.4, destination: input, filter: { type: "lowpass", frequency: 200, to: 1800, time: 0.1, q: 3 } });
  voice({ freq: freq * 0.5, type: "sine", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.6, destination: input });
  break;
case "fm_bass_pluck":
  voice({ freq, type: "sine", start, attack: 0.01, hold: 0.15, release: 0.4, gain: 0.8, destination: input });
  voice({ freq: freq * 2, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.2, gain: 0.4, destination: input, bendTo: freq, bendTime: 0.1 });
  break;
case "slap_bass_acoustic":
  voice({ freq, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.5, gain: 0.7, destination: input });
  noiseBurst({ start, duration: 0.04, attack: 0.002, release: 0.03, gain: 0.15, frequency: 1200, filterType: "bandpass", q: 1, output: input });
  voice({ freq: freq * 2, type: "sine", start, attack: 0.01, hold: 0.05, release: 0.2, gain: 0.2, destination: input });
  break;
case "slap_bass_synth":
  voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.4, gain: 0.5, destination: input, filter: { type: "lowpass", frequency: 3000, to: 400, time: 0.1 } });
  voice({ freq: freq * 0.5, type: "square", start, attack: 0.01, hold: 0.1, release: 0.4, gain: 0.3, destination: input, filter: { type: "lowpass", frequency: 800, to: 200, time: 0.1 } });
  break;
case "acid_303_classic":
  voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.6, destination: input, filter: { type: "lowpass", frequency: 4000, to: 300, time: 0.15, q: 4 } });
  break;
case "acid_303_squelch":
  voice({ freq, type: "square", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.5, destination: input, filter: { type: "lowpass", frequency: 5000, to: 400, time: 0.2, q: 8 } });
  break;
case "acid_square":
  voice({ freq, type: "square", start, attack: 0.01, hold: 0.15, release: 0.3, gain: 0.5, destination: input, filter: { type: "lowpass", frequency: 2500, to: 500, time: 0.1, q: 3 } });
  break;
case "moog_model_d":
  voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.4, destination: input, filter: { type: "lowpass", frequency: 1800, to: 400, time: 0.2, q: 2 } });
  voice({ freq: freq * 0.5, type: "square", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.3, destination: input, filter: { type: "lowpass", frequency: 1800, to: 400, time: 0.2, q: 2 } });
  break;
case "moog_taurus":
  voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.8, gain: 0.35, detune: -6, destination: input, filter: { type: "lowpass", frequency: 1200, to: 300, time: 0.5 } });
  voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.05, hold: 0.4, release: 0.8, gain: 0.35, detune: 6, destination: input, filter: { type: "lowpass", frequency: 1200, to: 300, time: 0.5 } });
  break;
case "moog_subphatty":
  voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.2, release: 0.4, gain: 0.4, destination: input, filter: { type: "lowpass", frequency: 2000, to: 500, time: 0.15 } });
  voice({ freq: freq * 0.5, type: "triangle", start, attack: 0.01, hold: 0.2, release: 0.4, gain: 0.5, destination: input });
  break;
case "pluck_bass_simple":
  voice({ freq, type: "square", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.5, destination: input, filter: { type: "lowpass", frequency: 3000, to: 300, time: 0.1 } });
  break;
case "pluck_bass_fm":
  voice({ freq, type: "sine", start, attack: 0.005, hold: 0.1, release: 0.3, gain: 0.7, destination: input });
  voice({ freq: freq * 3, type: "triangle", start, attack: 0.005, hold: 0.05, release: 0.1, gain: 0.3, destination: input, filter: { type: "highpass", frequency: 800 } });
  break;
case "pluck_bass_hollow":
  voice({ freq, type: "triangle", start, attack: 0.005, hold: 0.1, release: 0.3, gain: 0.6, destination: input });
  voice({ freq: freq * 2, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.3, destination: input });
  break;
case "tech_house_bass":
  voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.2, gain: 0.4, destination: input, filter: { type: "lowpass", frequency: 1500, to: 200, time: 0.1 } });
  voice({ freq: freq * 0.5, type: "sine", start, attack: 0.01, hold: 0.1, release: 0.25, gain: 0.6, destination: input });
  break;
*/
