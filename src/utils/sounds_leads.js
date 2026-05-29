let audioCtx = null;
let masterGain = null;
let compressor = null;
let dryBus = null;
let fxBus = null;
let delayNode = null;
let delayFeedback = null;
let delayFilter = null;

const MIN_GAIN = 0.0001;

const safeTime = (time) => Math.max(time, 0.001);

const silent = (error) => {
  void error;
};

const initAudio = () => {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 22;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.22;

    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.78;

    dryBus = audioCtx.createGain();
    dryBus.gain.value = 1;

    fxBus = audioCtx.createGain();
    fxBus.gain.value = 0.72;

    delayNode = audioCtx.createDelay(1.4);
    delayNode.delayTime.value = 0.18;

    delayFeedback = audioCtx.createGain();
    delayFeedback.gain.value = 0.28;

    delayFilter = audioCtx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 3200;

    dryBus.connect(masterGain);
    fxBus.connect(delayNode);
    delayNode.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayFilter.connect(masterGain);
    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(silent);
  }

  return audioCtx;
};

const createOutput = ({ volume = 1, send = 0.16, pan = 0 } = {}) => {
  const ctx = initAudio();
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

  output.connect(dryBus);

  if (send > 0) {
    const sendGain = ctx.createGain();
    sendGain.gain.value = send;
    output.connect(sendGain);
    sendGain.connect(fxBus);
  }

  return { ctx, input };
};

const envelope = (gainParam, start, attack, hold, release, peak, sustain = peak * 0.35) => {
  gainParam.cancelScheduledValues(start);
  gainParam.setValueAtTime(MIN_GAIN, start);
  gainParam.linearRampToValueAtTime(Math.max(peak, MIN_GAIN), start + safeTime(attack));
  gainParam.exponentialRampToValueAtTime(Math.max(sustain, MIN_GAIN), start + safeTime(attack + hold));
  gainParam.exponentialRampToValueAtTime(MIN_GAIN, start + safeTime(attack + hold + release));
};

const voice = ({
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
  const ctx = initAudio();
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

const noiseBurst = ({
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
  const ctx = initAudio();
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

const withSound = (fn) => {
  try {
    fn();
  } catch (error) {
    silent(error);
  }
};

const makeSynth = (name, synthFn) => {
  return {
    id: name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_'),
    name: name,
    play: (freq, options = {}) => withSound(() => {
      const out = createOutput({ volume: Math.min(Math.max(options.velocity || 1, 0.1), 1.4), send: options.send ?? 0.18, pan: options.pan ?? 0 });
      if (!out) return;
      const { ctx, input } = out;
      const start = options.start || 0;
      synthFn(freq, input, start, ctx, options);
    })
  };
};

export const LEAD_INSTRUMENTS = [
  makeSynth("Super Saw Lead", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.25, sustain: 0.2, detune: 0, destination: input, filter: { type: "lowpass", frequency: 4500, to: 2000, time: 0.3 } });
    voice({ freq, type: "sawtooth", start, attack: 0.025, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.18, detune: 15, destination: input, filter: { type: "lowpass", frequency: 4500, to: 2000, time: 0.3 } });
    voice({ freq, type: "sawtooth", start, attack: 0.025, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.18, detune: -15, destination: input, filter: { type: "lowpass", frequency: 4500, to: 2000, time: 0.3 } });
    voice({ freq: freq * 2, type: "square", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.1, sustain: 0.05, destination: input });
  }),
  makeSynth("Square Sync Lead", (freq, input, start) => {
    voice({ freq, type: "square", start, attack: 0.01, hold: 0.15, release: 0.3, gain: 0.3, sustain: 0.15, destination: input, filter: { type: "lowpass", frequency: 3000 } });
    voice({ freq: freq * 2, type: "square", start, attack: 0.02, hold: 0.1, release: 0.3, gain: 0.15, sustain: 0.05, detune: 5, destination: input, filter: { type: "lowpass", frequency: 4000 } });
  }),
  makeSynth("Classic Glide Sine", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.05, hold: 0.2, release: 0.5, gain: 0.4, sustain: 0.3, destination: input });
    voice({ freq: freq * 2, type: "sine", start: start + 0.02, attack: 0.05, hold: 0.1, release: 0.4, gain: 0.1, sustain: 0.05, destination: input });
  }),
  makeSynth("Dirty Pulse Lead", (freq, input, start) => {
    voice({ freq, type: "square", start, attack: 0.01, hold: 0.2, release: 0.3, gain: 0.3, sustain: 0.2, detune: -4, destination: input, filter: { type: "lowpass", frequency: 2500, to: 1500, time: 0.2 } });
    voice({ freq, type: "square", start, attack: 0.01, hold: 0.2, release: 0.3, gain: 0.3, sustain: 0.2, detune: 4, destination: input, filter: { type: "lowpass", frequency: 2500, to: 1500, time: 0.2 } });
    noiseBurst({ start, duration: 0.1, gain: 0.05, frequency: 3000, filterType: "highpass", output: input });
  }),
  makeSynth("Sci Fi Theremin", (freq, input, start, ctx) => {
    const osc = voice({ freq, type: "sine", start, attack: 0.1, hold: 0.4, release: 0.6, gain: 0.4, sustain: 0.4, destination: input });
    if (osc && ctx) {
      const now = ctx.currentTime + start;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6, now);
      lfoGain.gain.setValueAtTime(10, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now + 0.1);
      lfo.stop(now + 1.1);
    }
  }),
  makeSynth("Hard Sync Lead", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.15, release: 0.3, gain: 0.3, sustain: 0.15, destination: input, filter: { type: "bandpass", frequency: 1000, to: 3000, time: 0.15, q: 2 } });
    voice({ freq: freq * 1.5, type: "square", start, attack: 0.02, hold: 0.1, release: 0.2, gain: 0.15, sustain: 0.05, destination: input, filter: { type: "lowpass", frequency: 2000 } });
  }),
  makeSynth("8 Bit Lead", (freq, input, start) => {
    voice({ freq, type: "square", start, attack: 0.005, hold: 0.1, release: 0.1, gain: 0.25, sustain: 0.1, destination: input });
    voice({ freq: freq * 0.5, type: "square", start, attack: 0.005, hold: 0.1, release: 0.1, gain: 0.15, sustain: 0.05, destination: input });
  }),
  makeSynth("Laser Pitch Lead", (freq, input, start) => {
    voice({ freq: freq * 2, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.2, gain: 0.3, sustain: 0.1, destination: input, bendTo: freq, bendTime: 0.1, filter: { type: "lowpass", frequency: 4000, to: 1000, time: 0.1 } });
    voice({ freq, type: "square", start: start + 0.02, attack: 0.01, hold: 0.15, release: 0.25, gain: 0.2, sustain: 0.1, destination: input });
  }),
  makeSynth("Warm Analog Pad", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.5, hold: 1.0, release: 1.5, gain: 0.3, sustain: 0.25, destination: input, filter: { type: "lowpass", frequency: 800, to: 1200, time: 1.0 } });
    voice({ freq: freq * 1.006, type: "triangle", start, attack: 0.6, hold: 0.9, release: 1.4, gain: 0.2, sustain: 0.15, detune: 8, destination: input });
    voice({ freq: freq * 0.994, type: "sawtooth", start, attack: 0.7, hold: 0.8, release: 1.3, gain: 0.15, sustain: 0.1, detune: -8, destination: input, filter: { type: "lowpass", frequency: 600, to: 1000, time: 0.8 } });
  }),
  makeSynth("Angelic Choir Pad", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.3, hold: 0.8, release: 1.2, gain: 0.25, sustain: 0.2, detune: -4, destination: input, filter: { type: "bandpass", frequency: 1200, q: 1.5 } });
    voice({ freq: freq * 1.01, type: "sine", start, attack: 0.35, hold: 0.8, release: 1.2, gain: 0.25, sustain: 0.2, detune: 4, destination: input, filter: { type: "bandpass", frequency: 1800, q: 1.5 } });
    voice({ freq: freq * 2, type: "triangle", start: start + 0.1, attack: 0.4, hold: 0.6, release: 1.0, gain: 0.1, sustain: 0.08, destination: input });
  }),
  makeSynth("Dark Space Pad", (freq, input, start) => {
    voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.8, hold: 1.5, release: 2.0, gain: 0.25, sustain: 0.2, detune: -6, destination: input, filter: { type: "lowpass", frequency: 1500, to: 400, time: 1.5 } });
    voice({ freq: freq * 0.502, type: "sawtooth", start, attack: 0.8, hold: 1.5, release: 2.0, gain: 0.25, sustain: 0.2, detune: 6, destination: input, filter: { type: "lowpass", frequency: 1500, to: 400, time: 1.5 } });
    voice({ freq, type: "sine", start: start + 0.2, attack: 1.0, hold: 1.0, release: 1.5, gain: 0.3, sustain: 0.2, destination: input });
  }),
  makeSynth("Glassy Pad", (freq, input, start) => {
    voice({ freq: freq * 2, type: "triangle", start, attack: 0.4, hold: 1.0, release: 1.5, gain: 0.15, sustain: 0.1, destination: input });
    voice({ freq: freq * 3.01, type: "sine", start, attack: 0.5, hold: 0.8, release: 1.2, gain: 0.1, sustain: 0.05, destination: input });
    voice({ freq: freq * 4.02, type: "sine", start, attack: 0.6, hold: 0.6, release: 1.0, gain: 0.05, sustain: 0.02, destination: input });
    voice({ freq, type: "sine", start, attack: 0.2, hold: 1.2, release: 1.8, gain: 0.25, sustain: 0.2, destination: input });
  }),
  makeSynth("Filter Sweep Pad", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.1, hold: 1.0, release: 1.2, gain: 0.2, sustain: 0.15, detune: -5, destination: input, filter: { type: "lowpass", frequency: 200, to: 2500, time: 1.0, q: 2 } });
    voice({ freq, type: "sawtooth", start, attack: 0.1, hold: 1.0, release: 1.2, gain: 0.2, sustain: 0.15, detune: 5, destination: input, filter: { type: "lowpass", frequency: 200, to: 2500, time: 1.0, q: 2 } });
    voice({ freq: freq * 0.5, type: "square", start, attack: 0.2, hold: 0.8, release: 1.0, gain: 0.15, sustain: 0.1, destination: input, filter: { type: "lowpass", frequency: 100, to: 1500, time: 1.2 } });
  }),
  makeSynth("Frozen Time Pad", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 1.0, hold: 2.0, release: 2.5, gain: 0.3, sustain: 0.25, detune: -2, destination: input });
    voice({ freq, type: "sine", start, attack: 1.0, hold: 2.0, release: 2.5, gain: 0.3, sustain: 0.25, detune: 2, destination: input });
    voice({ freq: freq * 2, type: "triangle", start: start + 0.5, attack: 1.5, hold: 1.5, release: 2.0, gain: 0.1, sustain: 0.08, destination: input });
  }),
  makeSynth("Lush Strings Pad", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.4, hold: 0.8, release: 1.2, gain: 0.18, sustain: 0.15, detune: -7, destination: input, filter: { type: "lowpass", frequency: 1800 } });
    voice({ freq, type: "sawtooth", start, attack: 0.4, hold: 0.8, release: 1.2, gain: 0.18, sustain: 0.15, detune: 7, destination: input, filter: { type: "lowpass", frequency: 1800 } });
    voice({ freq: freq * 1.002, type: "sawtooth", start, attack: 0.45, hold: 0.75, release: 1.1, gain: 0.15, sustain: 0.12, detune: -12, destination: input, filter: { type: "lowpass", frequency: 2000 } });
    voice({ freq: freq * 0.998, type: "sawtooth", start, attack: 0.45, hold: 0.75, release: 1.1, gain: 0.15, sustain: 0.12, detune: 12, destination: input, filter: { type: "lowpass", frequency: 2000 } });
  }),
  makeSynth("Analog Pluck", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.005, hold: 0.05, release: 0.25, gain: 0.35, sustain: 0.05, destination: input, filter: { type: "lowpass", frequency: 4000, to: 400, time: 0.15, q: 1.5 } });
    voice({ freq: freq * 0.5, type: "square", start, attack: 0.005, hold: 0.05, release: 0.25, gain: 0.2, sustain: 0.05, destination: input, filter: { type: "lowpass", frequency: 3000, to: 300, time: 0.15 } });
  }),
  makeSynth("FM Digital Pluck", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.3, gain: 0.4, sustain: 0.05, destination: input });
    voice({ freq: freq * 2, type: "triangle", start, attack: 0.005, hold: 0.02, release: 0.15, gain: 0.2, sustain: 0.02, destination: input, bendTo: freq * 1.9, bendTime: 0.05 });
    voice({ freq: freq * 4.05, type: "sine", start, attack: 0.005, hold: 0.01, release: 0.1, gain: 0.15, sustain: 0.01, destination: input });
  }),
  makeSynth("Crystal Harp Pluck", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.005, hold: 0.1, release: 0.8, gain: 0.35, sustain: 0.1, destination: input });
    voice({ freq: freq * 2.02, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.5, gain: 0.15, sustain: 0.05, destination: input });
    voice({ freq: freq * 3.03, type: "triangle", start, attack: 0.005, hold: 0.02, release: 0.3, gain: 0.08, sustain: 0.02, destination: input });
  }),
  makeSynth("Koto Pluck", (freq, input, start) => {
    noiseBurst({ start, duration: 0.02, gain: 0.08, frequency: 4000, filterType: "highpass", output: input });
    voice({ freq, type: "triangle", start, attack: 0.005, hold: 0.1, release: 0.6, gain: 0.4, sustain: 0.1, destination: input, filter: { type: "lowpass", frequency: 2500, to: 800, time: 0.3 } });
    voice({ freq: freq * 1.5, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.4, gain: 0.1, sustain: 0.02, destination: input });
  }),
  makeSynth("Muted Guitar Pluck", (freq, input, start) => {
    noiseBurst({ start, duration: 0.03, gain: 0.05, frequency: 3000, filterType: "bandpass", q: 2, output: input });
    voice({ freq, type: "triangle", start, attack: 0.005, hold: 0.05, release: 0.15, gain: 0.4, sustain: 0.05, destination: input, filter: { type: "lowpass", frequency: 1200, to: 400, time: 0.1 } });
    voice({ freq: freq * 2, type: "sine", start, attack: 0.005, hold: 0.02, release: 0.1, gain: 0.15, sustain: 0.02, destination: input });
  }),
  makeSynth("Wood Marimba Pluck", (freq, input, start) => {
    noiseBurst({ start, duration: 0.02, gain: 0.06, frequency: 1500, filterType: "bandpass", q: 3, output: input });
    voice({ freq, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.3, gain: 0.45, sustain: 0.1, destination: input });
    voice({ freq: freq * 4.2, type: "sine", start, attack: 0.005, hold: 0.02, release: 0.1, gain: 0.1, sustain: 0.02, destination: input });
  }),
  makeSynth("Vintage EPiano", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.01, hold: 0.1, release: 0.8, gain: 0.35, sustain: 0.15, destination: input });
    voice({ freq, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.6, gain: 0.2, sustain: 0.1, destination: input });
    voice({ freq: freq * 2, type: "sine", start, attack: 0.01, hold: 0.05, release: 0.4, gain: 0.1, sustain: 0.05, destination: input });
    noiseBurst({ start, duration: 0.02, gain: 0.03, frequency: 2000, filterType: "lowpass", output: input });
  }),
  makeSynth("Wurli Keys", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.5, gain: 0.2, sustain: 0.1, destination: input, filter: { type: "lowpass", frequency: 1200, to: 400, time: 0.4 } });
    voice({ freq, type: "square", start, attack: 0.01, hold: 0.1, release: 0.5, gain: 0.15, sustain: 0.08, destination: input, filter: { type: "lowpass", frequency: 1000, to: 300, time: 0.4 } });
    voice({ freq: freq * 2, type: "sine", start, attack: 0.01, hold: 0.05, release: 0.3, gain: 0.1, sustain: 0.05, destination: input });
  }),
  makeSynth("FM Bell Keys", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.005, hold: 0.15, release: 1.2, gain: 0.35, sustain: 0.15, destination: input });
    voice({ freq: freq * 2.01, type: "triangle", start, attack: 0.005, hold: 0.1, release: 0.8, gain: 0.15, sustain: 0.05, destination: input });
    voice({ freq: freq * 3.5, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.5, gain: 0.1, sustain: 0.02, destination: input });
  }),
  makeSynth("Toy Piano Keys", (freq, input, start) => {
    noiseBurst({ start, duration: 0.02, gain: 0.04, frequency: 4000, filterType: "bandpass", output: input });
    voice({ freq, type: "sine", start, attack: 0.01, hold: 0.05, release: 0.4, gain: 0.3, sustain: 0.05, destination: input });
    voice({ freq: freq * 2.05, type: "sine", start, attack: 0.01, hold: 0.02, release: 0.2, gain: 0.1, sustain: 0.02, destination: input });
  }),
  makeSynth("Funky Clav", (freq, input, start) => {
    voice({ freq, type: "square", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.2, sustain: 0.05, destination: input, filter: { type: "bandpass", frequency: 2000, to: 800, time: 0.15, q: 2 } });
    voice({ freq, type: "sawtooth", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.2, sustain: 0.05, destination: input, filter: { type: "lowpass", frequency: 3000, to: 1000, time: 0.1 } });
    voice({ freq: freq * 2, type: "square", start, attack: 0.005, hold: 0.02, release: 0.1, gain: 0.1, sustain: 0.02, destination: input });
  }),
  makeSynth("Rock Organ", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.02, hold: 0.4, release: 0.2, gain: 0.3, sustain: 0.25, destination: input });
    voice({ freq: freq * 2, type: "sine", start, attack: 0.02, hold: 0.4, release: 0.2, gain: 0.2, sustain: 0.15, destination: input });
    voice({ freq: freq * 3, type: "triangle", start, attack: 0.02, hold: 0.4, release: 0.2, gain: 0.15, sustain: 0.1, destination: input });
    voice({ freq: freq * 4, type: "sine", start, attack: 0.02, hold: 0.4, release: 0.2, gain: 0.1, sustain: 0.05, destination: input });
  }),
  makeSynth("Majestic Brass", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.1, hold: 0.3, release: 0.4, gain: 0.25, sustain: 0.2, detune: -4, destination: input, filter: { type: "lowpass", frequency: 800, to: 2500, time: 0.15 } });
    voice({ freq, type: "sawtooth", start, attack: 0.12, hold: 0.3, release: 0.4, gain: 0.25, sustain: 0.2, detune: 4, destination: input, filter: { type: "lowpass", frequency: 800, to: 2500, time: 0.15 } });
    voice({ freq: freq * 0.5, type: "square", start, attack: 0.08, hold: 0.35, release: 0.45, gain: 0.15, sustain: 0.1, destination: input, filter: { type: "lowpass", frequency: 600, to: 1800, time: 0.2 } });
  }),
  makeSynth("Epic Synth Brass", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.2, release: 0.3, gain: 0.2, sustain: 0.15, detune: -10, destination: input, filter: { type: "lowpass", frequency: 1000, to: 4000, time: 0.1 } });
    voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.2, release: 0.3, gain: 0.2, sustain: 0.15, detune: 10, destination: input, filter: { type: "lowpass", frequency: 1000, to: 4000, time: 0.1 } });
    voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.2, release: 0.3, gain: 0.2, sustain: 0.15, detune: 0, destination: input, filter: { type: "lowpass", frequency: 1000, to: 4000, time: 0.1 } });
  }),
  makeSynth("Soft Horns", (freq, input, start) => {
    voice({ freq, type: "triangle", start, attack: 0.15, hold: 0.4, release: 0.5, gain: 0.3, sustain: 0.25, destination: input, filter: { type: "lowpass", frequency: 800, to: 1200, time: 0.2 } });
    voice({ freq: freq * 1.01, type: "sine", start, attack: 0.18, hold: 0.35, release: 0.5, gain: 0.2, sustain: 0.15, destination: input });
  }),
  makeSynth("Pizzicato Strings", (freq, input, start) => {
    voice({ freq, type: "triangle", start, attack: 0.005, hold: 0.02, release: 0.1, gain: 0.3, sustain: 0.02, destination: input });
    voice({ freq, type: "sawtooth", start, attack: 0.005, hold: 0.02, release: 0.08, gain: 0.15, sustain: 0.01, destination: input, filter: { type: "lowpass", frequency: 3000, to: 800, time: 0.05 } });
  }),
  makeSynth("Marcato Strings", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.2, release: 0.3, gain: 0.2, sustain: 0.15, detune: -5, destination: input, filter: { type: "lowpass", frequency: 2000, to: 1000, time: 0.2 } });
    voice({ freq, type: "sawtooth", start, attack: 0.06, hold: 0.2, release: 0.3, gain: 0.2, sustain: 0.15, detune: 5, destination: input, filter: { type: "lowpass", frequency: 2000, to: 1000, time: 0.2 } });
    voice({ freq: freq * 0.5, type: "triangle", start, attack: 0.04, hold: 0.25, release: 0.35, gain: 0.2, sustain: 0.15, destination: input });
  }),
  makeSynth("Cello Section", (freq, input, start) => {
    voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.15, hold: 0.4, release: 0.6, gain: 0.3, sustain: 0.25, detune: -3, destination: input, filter: { type: "lowpass", frequency: 800, to: 1500, time: 0.3 } });
    voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.18, hold: 0.4, release: 0.6, gain: 0.3, sustain: 0.25, detune: 3, destination: input, filter: { type: "lowpass", frequency: 800, to: 1500, time: 0.3 } });
    voice({ freq: freq * 0.25, type: "sine", start, attack: 0.1, hold: 0.5, release: 0.7, gain: 0.2, sustain: 0.15, destination: input });
  }),
  makeSynth("Acid Arp", (freq, input, start) => {
    voice({ freq, type: "sawtooth", start, attack: 0.005, hold: 0.05, release: 0.15, gain: 0.3, sustain: 0.05, destination: input, filter: { type: "lowpass", frequency: 4000, to: 300, time: 0.1, q: 3 } });
    voice({ freq, type: "square", start, attack: 0.005, hold: 0.05, release: 0.15, gain: 0.15, sustain: 0.02, destination: input, filter: { type: "lowpass", frequency: 4000, to: 300, time: 0.1, q: 2 } });
  }),
  makeSynth("Ping Arp", (freq, input, start) => {
    voice({ freq, type: "sine", start, attack: 0.002, hold: 0.02, release: 0.2, gain: 0.4, sustain: 0.05, destination: input });
    voice({ freq: freq * 2, type: "sine", start, attack: 0.002, hold: 0.01, release: 0.1, gain: 0.15, sustain: 0.02, destination: input });
  }),
  makeSynth("Chiptune Arp", (freq, input, start) => {
    voice({ freq, type: "square", start, attack: 0.002, hold: 0.05, release: 0.05, gain: 0.25, sustain: 0.1, destination: input });
    voice({ freq: freq * 1.5, type: "square", start: start + 0.02, attack: 0.002, hold: 0.03, release: 0.05, gain: 0.1, sustain: 0.05, destination: input });
  }),
  makeSynth("Glitch Arp", (freq, input, start) => {
    noiseBurst({ start, duration: 0.05, gain: 0.05, frequency: 5000, filterType: "highpass", output: input });
    voice({ freq, type: "sawtooth", start, attack: 0.002, hold: 0.02, release: 0.05, gain: 0.2, sustain: 0.05, destination: input, bendTo: freq * 2, bendTime: 0.05 });
    voice({ freq: freq * 0.5, type: "square", start: start + 0.05, attack: 0.002, hold: 0.02, release: 0.05, gain: 0.2, sustain: 0.05, destination: input });
  })
];

export const playMelodicSynth = (id, freq, options = {}) => {
  const synth = LEAD_INSTRUMENTS.find(s => s.id === id);
  if (synth) {
    synth.play(freq, options);
  } else {
    console.warn(`Synth with id ${id} not found.`);
  }
};
