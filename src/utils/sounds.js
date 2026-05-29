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

export const playInstrumentTone = (instrumentId = "piano", freq = 261.63, options = {}) => withSound(() => {
  const {
    start = 0,
    velocity = 1,
    pan = 0,
    send = 0.18,
  } = options;
  const out = createOutput({ volume: Math.min(Math.max(velocity, 0.1), 1.4), send, pan });
  if (!out) return;
  const { ctx, input } = out;
  const now = ctx.currentTime + start;

  switch (instrumentId) {
    case "glockenspiel":
      voice({ freq: freq * 2, type: "sine", start, attack: 0.006, hold: 0.16, release: 1.25, gain: 0.42, sustain: 0.16, destination: input });
      voice({ freq: freq * 3.01, type: "sine", start: start + 0.006, attack: 0.004, hold: 0.08, release: 0.8, gain: 0.18, sustain: 0.05, destination: input });
      voice({ freq: freq * 4.02, type: "sine", start: start + 0.012, attack: 0.004, hold: 0.04, release: 0.5, gain: 0.08, sustain: 0.02, destination: input });
      break;
    case "floete": {
      const osc = voice({ freq, type: "sine", start, attack: 0.12, hold: 0.42, release: 0.45, gain: 0.32, sustain: 0.28, destination: input, filter: { type: "lowpass", frequency: 2600, q: 0.7 } });
      if (osc) {
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(5.4, now);
        vibratoGain.gain.setValueAtTime(6, now);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(now + 0.08);
        vibrato.stop(now + 1.08);
      }
      break;
    }
    case "geige":
      voice({ freq, type: "sawtooth", start, attack: 0.09, hold: 0.46, release: 0.6, gain: 0.18, sustain: 0.16, detune: -5, destination: input, filter: { type: "lowpass", frequency: 1800, to: 2300, time: 0.25 } });
      voice({ freq: freq * 2, type: "triangle", start: start + 0.01, attack: 0.08, hold: 0.35, release: 0.5, gain: 0.12, sustain: 0.08, detune: 6, destination: input });
      break;
    case "gitarre":
      noiseBurst({ start, duration: 0.04, gain: 0.04, frequency: 3600, filterType: "highpass", output: input });
      voice({ freq, type: "triangle", start: start + 0.004, attack: 0.008, hold: 0.12, release: 0.8, gain: 0.34, sustain: 0.12, destination: input, filter: { type: "lowpass", frequency: 1500 } });
      voice({ freq: freq * 2.01, type: "sine", start: start + 0.01, attack: 0.006, hold: 0.06, release: 0.35, gain: 0.1, sustain: 0.02, destination: input });
      break;
    case "bass":
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.015, hold: 0.18, release: 0.65, gain: 0.5, sustain: 0.18, destination: input, filter: { type: "lowpass", frequency: 700 } });
      voice({ freq: freq * 0.5, type: "square", start: start + 0.002, attack: 0.01, hold: 0.08, release: 0.35, gain: 0.07, sustain: 0.02, destination: input, filter: { type: "lowpass", frequency: 500 } });
      break;
    case "orgel":
      voice({ freq, type: "sine", start, attack: 0.035, hold: 0.65, release: 0.25, gain: 0.23, sustain: 0.21, destination: input });
      voice({ freq: freq * 1.5, type: "sine", start, attack: 0.04, hold: 0.62, release: 0.25, gain: 0.16, sustain: 0.14, destination: input });
      voice({ freq: freq * 2, type: "triangle", start, attack: 0.04, hold: 0.55, release: 0.22, gain: 0.08, sustain: 0.07, destination: input });
      break;
    case "xylophon":
      noiseBurst({ start, duration: 0.03, gain: 0.05, frequency: 4200, filterType: "bandpass", q: 4, output: input });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.004, hold: 0.08, release: 0.42, gain: 0.42, sustain: 0.08, destination: input });
      voice({ freq: freq * 3.03, type: "triangle", start: start + 0.008, attack: 0.004, hold: 0.04, release: 0.25, gain: 0.12, sustain: 0.02, destination: input });
      break;
    case "kalimba":
      voice({ freq: freq * 1.5, type: "triangle", start, attack: 0.005, hold: 0.08, release: 0.7, gain: 0.34, sustain: 0.1, destination: input });
      voice({ freq: freq * 2.49, type: "sine", start: start + 0.01, attack: 0.006, hold: 0.04, release: 0.45, gain: 0.12, sustain: 0.03, destination: input });
      break;
    case "trompete":
      voice({ freq, type: "sawtooth", start, attack: 0.055, hold: 0.28, release: 0.28, gain: 0.26, sustain: 0.2, destination: input, filter: { type: "bandpass", frequency: 1150, q: 2.1, to: 1700, time: 0.12 } });
      voice({ freq: freq * 2, type: "square", start: start + 0.01, attack: 0.04, hold: 0.14, release: 0.2, gain: 0.06, sustain: 0.04, destination: input, filter: { type: "bandpass", frequency: 1800, q: 1.5 } });
      break;
    case "chor":
      voice({ freq, type: "sine", start, attack: 0.2, hold: 0.55, release: 0.65, gain: 0.2, sustain: 0.18, detune: -11, destination: input, filter: { type: "lowpass", frequency: 2200 } });
      voice({ freq: freq * 1.01, type: "sine", start, attack: 0.24, hold: 0.52, release: 0.65, gain: 0.2, sustain: 0.18, detune: 10, destination: input, filter: { type: "lowpass", frequency: 2200 } });
      voice({ freq: freq * 1.5, type: "triangle", start: start + 0.03, attack: 0.22, hold: 0.42, release: 0.55, gain: 0.08, sustain: 0.06, destination: input });
      break;
    case "traum":
      voice({ freq, type: "triangle", start, attack: 0.12, hold: 0.42, release: 1.1, gain: 0.22, sustain: 0.17, detune: -7, destination: input, filter: { type: "lowpass", frequency: 900, to: 3000, time: 0.6 } });
      voice({ freq: freq * 1.5, type: "sine", start: start + 0.035, attack: 0.1, hold: 0.34, release: 0.95, gain: 0.14, sustain: 0.09, detune: 7, destination: input });
      voice({ freq: freq * 2.01, type: "sine", start: start + 0.13, attack: 0.06, hold: 0.18, release: 0.8, gain: 0.08, sustain: 0.04, destination: input });
      break;
    case "synth_bass":
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.28, sustain: 0.2, destination: input, filter: { type: "lowpass", frequency: 800, to: 300, time: 0.3 } });
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.4, sustain: 0.3, destination: input });
      break;
    case "lofi_keys":
      noiseBurst({ start, duration: 0.05, gain: 0.02, frequency: 3000, filterType: "lowpass", output: input });
      voice({ freq, type: "sine", start, attack: 0.05, hold: 0.3, release: 0.6, gain: 0.3, sustain: 0.15, detune: Math.sin(now * 5) * 10, destination: input, filter: { type: "lowpass", frequency: 1200 } });
      voice({ freq: freq * 2, type: "triangle", start, attack: 0.06, hold: 0.2, release: 0.5, gain: 0.1, sustain: 0.05, detune: Math.cos(now * 4) * 8, destination: input });
      break;
    case "brass_pad":
      voice({ freq, type: "sawtooth", start, attack: 0.15, hold: 0.4, release: 0.6, gain: 0.2, sustain: 0.15, detune: -4, destination: input, filter: { type: "lowpass", frequency: 600, to: 2000, time: 0.2 } });
      voice({ freq: freq * 1.01, type: "sawtooth", start, attack: 0.18, hold: 0.38, release: 0.6, gain: 0.2, sustain: 0.15, detune: 5, destination: input, filter: { type: "lowpass", frequency: 600, to: 2000, time: 0.2 } });
      break;
    
    case "strings_orchestral":
      voice({ freq, type: "sawtooth", start, attack: 0.25, hold: 0.5, release: 0.8, gain: 0.15, sustain: 0.12, detune: -6, destination: input, filter: { type: "lowpass", frequency: 1500, to: 2500, time: 0.4 } });
      voice({ freq: freq * 1.005, type: "sawtooth", start, attack: 0.3, hold: 0.45, release: 0.85, gain: 0.15, sustain: 0.12, detune: 5, destination: input, filter: { type: "lowpass", frequency: 1600, to: 2400, time: 0.4 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.2, hold: 0.5, release: 0.9, gain: 0.08, sustain: 0.06, detune: -2, destination: input, filter: { type: "lowpass", frequency: 800 } });
      break;
    case "flute_wooden": {
      noiseBurst({ start, duration: 0.6, attack: 0.1, release: 0.3, gain: 0.03, frequency: 3000, filterType: "bandpass", q: 2, output: input });
      const fluteOsc = voice({ freq, type: "sine", start, attack: 0.15, hold: 0.4, release: 0.35, gain: 0.35, sustain: 0.25, destination: input });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.15, hold: 0.35, release: 0.3, gain: 0.05, sustain: 0.03, destination: input });
      if (fluteOsc && ctx) {
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(5.5, now);
        vibratoGain.gain.setValueAtTime(4, now);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(fluteOsc.frequency);
        vibrato.start(now + 0.2); 
        vibrato.stop(now + 1.2);
      }
      break;
    }
    case "piano_grand":
      voice({ freq, type: "triangle", start, attack: 0.005, hold: 0.15, release: 1.5, gain: 0.35, sustain: 0.15, destination: input, filter: { type: "lowpass", frequency: 2500 } });
      voice({ freq: freq * 1.002, type: "triangle", start, attack: 0.005, hold: 0.15, release: 1.4, gain: 0.25, sustain: 0.1, detune: 3, destination: input });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.005, hold: 0.1, release: 0.8, gain: 0.1, sustain: 0.05, destination: input });
      voice({ freq: freq * 3.01, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.5, gain: 0.05, sustain: 0.02, destination: input });
      noiseBurst({ start, duration: 0.03, gain: 0.02, frequency: 500, filterType: "lowpass", output: input });
      break;
    case "upright_bass":
      voice({ freq: freq * 0.5, type: "triangle", start, attack: 0.01, hold: 0.2, release: 0.8, gain: 0.45, sustain: 0.15, destination: input, filter: { type: "lowpass", frequency: 800, to: 300, time: 0.4 } });
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.015, hold: 0.25, release: 1.0, gain: 0.55, sustain: 0.2, destination: input, bendTo: freq * 0.495, bendTime: 0.5 }); 
      voice({ freq, type: "sine", start, attack: 0.005, hold: 0.1, release: 0.4, gain: 0.1, sustain: 0.05, destination: input });
      noiseBurst({ start, duration: 0.04, attack: 0.002, release: 0.03, gain: 0.04, frequency: 1200, filterType: "bandpass", q: 1, output: input });
      break;

    case "lead_saw":
      voice({ freq, type: "sawtooth", start, attack: 0.015, hold: 0.2, release: 0.4, gain: 0.22, sustain: 0.18, detune: 0, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.16, detune: 14, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.16, detune: -14, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq: freq * 2, type: "square", start, attack: 0.01, hold: 0.15, release: 0.3, gain: 0.08, sustain: 0.06, destination: input });
      break;
    case "pad_warm":
      voice({ freq, type: "sine", start, attack: 0.4, hold: 1.0, release: 1.5, gain: 0.28, sustain: 0.22, destination: input, filter: { type: "lowpass", frequency: 800, to: 1200, time: 1.0 } });
      voice({ freq: freq * 1.006, type: "triangle", start, attack: 0.5, hold: 0.9, release: 1.4, gain: 0.18, sustain: 0.14, detune: 8, destination: input });
      voice({ freq: freq * 0.994, type: "sawtooth", start, attack: 0.6, hold: 0.8, release: 1.3, gain: 0.12, sustain: 0.08, detune: -8, destination: input, filter: { type: "lowpass", frequency: 600, to: 1000, time: 0.8 } });
      break;
    case "arp_pluck":
      voice({ freq, type: "square", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.2, sustain: 0.04, destination: input, filter: { type: "lowpass", frequency: 3500, to: 400, time: 0.12 } });
      voice({ freq, type: "sawtooth", start, attack: 0.005, hold: 0.05, release: 0.15, gain: 0.18, sustain: 0.04, detune: 5, destination: input, filter: { type: "lowpass", frequency: 4000, to: 500, time: 0.1 } });
      noiseBurst({ start, duration: 0.02, gain: 0.04, frequency: 3000, filterType: "highpass", output: input });
      break;
    case "bass_fm":
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.01, hold: 0.15, release: 0.4, gain: 0.4, sustain: 0.25, destination: input });
      voice({ freq: freq, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.25, sustain: 0.1, detune: 0, destination: input, bendTo: freq * 0.98, bendTime: 0.15 });
      voice({ freq: freq * 2, type: "square", start, attack: 0.01, hold: 0.05, release: 0.2, gain: 0.1, sustain: 0.04, destination: input, filter: { type: "bandpass", frequency: freq * 4, q: 2, to: freq * 2, time: 0.1 } });
      break;
    case "wobble_bass":
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.3, sustain: 0.2, detune: -9, destination: input, filter: { type: "lowpass", frequency: 200, to: 2200, time: 0.15 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.3, sustain: 0.2, detune: 9, destination: input, filter: { type: "lowpass", frequency: 200, to: 2200, time: 0.15 } });
      voice({ freq: freq * 0.25, type: "square", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.25, sustain: 0.2, destination: input, filter: { type: "lowpass", frequency: 1000, to: 300, time: 0.25 } });
      break;

    case "piano":
    default:
      noiseBurst({ start, duration: 0.035, gain: 0.025, frequency: 2800, filterType: "highpass", output: input });
      voice({ freq, type: "triangle", start, attack: 0.007, hold: 0.12, release: 0.72, gain: 0.34, sustain: 0.12, destination: input, filter: { type: "lowpass", frequency: 1900 } });
      voice({ freq: freq * 2.01, type: "sine", start: start + 0.006, attack: 0.005, hold: 0.05, release: 0.35, gain: 0.08, sustain: 0.02, destination: input });
      break;
  }
});

const playArp = (notes, instrument = "glockenspiel", { interval = 0.075, start = 0, velocity = 0.8, send = 0.24 } = {}) => {
  notes.forEach((freq, index) => {
    playInstrumentTone(instrument, freq, { start: start + index * interval, velocity, send });
  });
};

export const playBubble = () => withSound(() => {
  const out = createOutput({ volume: 0.7, send: 0.1 });
  if (!out) return;
  voice({ freq: 320, type: "sine", attack: 0.004, hold: 0.035, release: 0.12, gain: 0.22, destination: out.input, bendTo: 620, bendTime: 0.08 });
  voice({ freq: 720, type: "triangle", start: 0.015, attack: 0.003, hold: 0.025, release: 0.08, gain: 0.08, destination: out.input });
});

export const playCoin = () => withSound(() => {
  playArp([988, 1319, 1760], "glockenspiel", { interval: 0.045, velocity: 0.82, send: 0.28 });
});

export const playWhoosh = () => withSound(() => {
  const out = createOutput({ volume: 0.7, send: 0.2 });
  if (!out) return;
  const ctx = out.ctx;
  const now = ctx.currentTime;
  const length = Math.floor(ctx.sampleRate * 0.34);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i += 1) {
    const progress = i / length;
    data[i] = (Math.random() * 2 - 1) * Math.sin(progress * Math.PI);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(520, now);
  filter.frequency.exponentialRampToValueAtTime(4300, now + 0.28);
  filter.Q.value = 1.2;
  const gain = ctx.createGain();
  envelope(gain.gain, now, 0.015, 0.16, 0.16, 0.2, 0.12);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(out.input);
  source.start(now);
  source.stop(now + 0.36);
});

export const playMagicDust = () => withSound(() => {
  playArp([659, 784, 988, 1175, 1568], "traum", { interval: 0.055, velocity: 0.55, send: 0.42 });
});

export const playJingle = (type = "success") => withSound(() => {
  switch (type) {
    case "start":
      playWhoosh();
      playArp([392, 523, 659], "kalimba", { interval: 0.07, start: 0.08, velocity: 0.7, send: 0.24 });
      break;
    case "levelUp":
      playArp([523, 659, 784, 1047, 1319], "glockenspiel", { interval: 0.07, velocity: 0.8, send: 0.34 });
      setTimeout(() => playInstrumentTone("chor", 523, { velocity: 0.65, send: 0.4 }), 220);
      break;
    case "badge":
      playMagicDust();
      setTimeout(() => playInstrumentTone("chor", 659, { velocity: 0.55, send: 0.48 }), 180);
      break;
    case "combo":
      playCoin();
      setTimeout(() => playArp([784, 988, 1175], "xylophon", { interval: 0.04, velocity: 0.65, send: 0.18 }), 80);
      break;
    case "try":
      playArp([330, 294, 262], "kalimba", { interval: 0.07, velocity: 0.45, send: 0.16 });
      break;
    case "calm":
      playArp([392, 523, 659, 523], "chor", { interval: 0.13, velocity: 0.38, send: 0.45 });
      break;
    case "success":
    default:
      playArp([523, 659, 784, 1047], "glockenspiel", { interval: 0.055, velocity: 0.72, send: 0.28 });
      break;
  }
});

export const playPop = () => {
  playBubble();
};

export const playSparkle = () => {
  playJingle("success");
};

export const playError = () => withSound(() => {
  const out = createOutput({ volume: 0.72, send: 0.16 });
  if (!out) return;
  voice({ freq: 220, type: "triangle", attack: 0.012, hold: 0.08, release: 0.25, gain: 0.18, destination: out.input, bendTo: 174, bendTime: 0.18, filter: { type: "lowpass", frequency: 900 } });
  voice({ freq: 294, type: "sine", start: 0.04, attack: 0.01, hold: 0.05, release: 0.2, gain: 0.06, destination: out.input });
});

// --- Beat Maker Synthesizers ---

export const playKick = ({ volume = 1, pan = 0, send = 0.03 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 150, type: "sine", attack: 0.002, hold: 0.04, release: 0.44, gain: 0.72, destination: out.input, bendTo: 42, bendTime: 0.2 });
  noiseBurst({ duration: 0.025, gain: 0.08, frequency: 2200, filterType: "highpass", output: out.input });
});

export const playSnare = ({ volume = 0.9, pan = 0, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 178, type: "triangle", attack: 0.003, hold: 0.045, release: 0.18, gain: 0.18, destination: out.input, bendTo: 132, bendTime: 0.1 });
  noiseBurst({ duration: 0.18, attack: 0.004, release: 0.14, gain: 0.34, frequency: 1700, filterType: "bandpass", q: 1.2, output: out.input });
});

export const playHiHat = ({ volume = 0.65, pan = 0, send = 0.04, open = false } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
  ratios.forEach((ratio, index) => {
    voice({ freq: 40 * ratio, type: "square", start: index * 0.001, attack: 0.001, hold: open ? 0.055 : 0.018, release: open ? 0.28 : 0.07, gain: 0.028, destination: out.input, filter: { type: "highpass", frequency: 6500 } });
  });
  noiseBurst({ duration: open ? 0.34 : 0.08, attack: 0.001, release: open ? 0.26 : 0.07, gain: open ? 0.2 : 0.14, frequency: 9000, filterType: "highpass", output: out.input });
});

export const playClap = ({ volume = 0.78, pan = 0, send = 0.16 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  [0, 0.018, 0.04].forEach((start, index) => {
    noiseBurst({ start, duration: 0.08 + index * 0.025, attack: 0.002, release: 0.12, gain: 0.2 - index * 0.03, frequency: 1800 + index * 520, filterType: "bandpass", q: 1.3, output: out.input });
  });
});

export const playRim = ({ volume = 0.7, pan = 0, send = 0.07 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 740, type: "square", attack: 0.001, hold: 0.025, release: 0.08, gain: 0.18, destination: out.input, filter: { type: "bandpass", frequency: 1600, q: 5 } });
  noiseBurst({ duration: 0.035, attack: 0.001, release: 0.04, gain: 0.08, frequency: 3200, filterType: "bandpass", q: 4, output: out.input });
});

export const playTom = ({ volume = 0.86, pan = 0, send = 0.08, freq = 160 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq, type: "sine", attack: 0.004, hold: 0.07, release: 0.34, gain: 0.42, destination: out.input, bendTo: freq * 0.62, bendTime: 0.18 });
  noiseBurst({ duration: 0.045, gain: 0.04, frequency: 1200, filterType: "bandpass", output: out.input });
});

export const playCrash = ({ volume = 0.55, pan = 0, send = 0.24 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [2.1, 2.7, 3.6, 4.4, 5.1, 6.3, 7.2];
  ratios.forEach((ratio, index) => {
    voice({ freq: 112 * ratio, type: "square", start: index * 0.002, attack: 0.002, hold: 0.08, release: 0.7, gain: 0.025, destination: out.input, filter: { type: "highpass", frequency: 5200 } });
  });
  noiseBurst({ duration: 0.75, attack: 0.002, release: 0.62, gain: 0.18, frequency: 7800, filterType: "highpass", output: out.input });
});

export const playShaker = ({ volume = 0.5, pan = 0, send = 0.05 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.075, attack: 0.001, release: 0.06, gain: 0.12, frequency: 7200, filterType: "bandpass", q: 1.8, output: out.input });
});

export const play808 = ({ volume = 1, pan = 0, send = 0.05, freq = 55 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq, type: "sine", attack: 0.02, hold: 0.4, release: 0.9, gain: 0.85, destination: out.input, bendTo: freq * 0.98, bendTime: 0.8 });
  voice({ freq: freq * 2, type: "square", attack: 0.01, hold: 0.1, release: 0.3, gain: 0.08, destination: out.input, filter: { type: "lowpass", frequency: 400 } });
});

export const playKickHiphop = ({ volume = 1, pan = 0, send = 0.03 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 110, type: "sine", attack: 0.001, hold: 0.03, release: 0.3, gain: 0.8, destination: out.input, bendTo: 30, bendTime: 0.15 });
  voice({ freq: 110, type: "square", attack: 0.001, hold: 0.02, release: 0.1, gain: 0.1, destination: out.input, filter: { type: "lowpass", frequency: 300 } });
});

export const playSnareHiphop = ({ volume = 0.9, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 220, type: "triangle", attack: 0.002, hold: 0.03, release: 0.2, gain: 0.25, destination: out.input, bendTo: 140, bendTime: 0.08 });
  voice({ freq: 160, type: "sine", attack: 0.002, hold: 0.05, release: 0.25, gain: 0.15, destination: out.input });
  noiseBurst({ duration: 0.22, attack: 0.002, release: 0.18, gain: 0.38, frequency: 2200, filterType: "bandpass", q: 0.8, output: out.input });
});

export const playHatTrap = ({ volume = 0.7, pan = 0, send = 0.06 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 8000, type: "square", attack: 0.001, hold: 0.01, release: 0.04, gain: 0.04, destination: out.input, filter: { type: "highpass", frequency: 7000 } });
  noiseBurst({ duration: 0.04, attack: 0.001, release: 0.03, gain: 0.18, frequency: 10000, filterType: "highpass", output: out.input });
});

export const playVinyl = ({ volume = 0.3, pan = 0, send = 0.0 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.1, attack: 0.01, release: 0.05, gain: 0.05, frequency: 600, filterType: "lowpass", q: 0.5, output: out.input });
  noiseBurst({ duration: 0.02, attack: 0.001, release: 0.01, gain: 0.15, frequency: 4000, filterType: "highpass", output: out.input });
});

export const playSnap = ({ volume = 0.7, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.03, attack: 0.001, release: 0.02, gain: 0.3, frequency: 3500, filterType: "bandpass", q: 3, output: out.input });
  voice({ freq: 2800, type: "sine", attack: 0.001, hold: 0.01, release: 0.02, gain: 0.1, destination: out.input });
});

export const playSynth = (freq, options = {}) => {
  playInstrumentTone(options.instrument || "glockenspiel", freq, { velocity: options.velocity ?? 0.9, send: options.send ?? 0.24, pan: options.pan ?? 0 });
};

export const playMicSample = (audioBuffer, offset = 0, duration = null, options = {}) => {
  if (!audioBuffer) return;
  withSound(() => {
    const ctx = initAudio();
    if (!ctx) return;
    const source = ctx.createBufferSource();
    const out = createOutput({
      volume: options.volume ?? 0.95,
      send: options.send ?? 0.08,
      pan: options.pan ?? 0,
    });
    if (!out) return;
    source.buffer = audioBuffer;
    source.connect(out.input);
    if (duration !== null) {
      source.start(ctx.currentTime, offset, duration);
    } else {
      source.start(ctx.currentTime, offset);
    }
  });
};

export const generateWaveform = (audioBuffer, points = 40) => {
  if (!audioBuffer) return [];
  const rawData = audioBuffer.getChannelData(0);
  const samples = rawData.length;
  const blockSize = Math.max(1, Math.floor(samples / points));
  const waveform = [];

  for (let i = 0; i < points; i += 1) {
    const blockStart = blockSize * i;
    let sum = 0;
    let count = 0;

    for (let j = 0; j < blockSize && blockStart + j < samples; j += 1) {
      sum += Math.abs(rawData[blockStart + j]);
      count += 1;
    }

    waveform.push(count > 0 ? sum / count : 0);
  }

  const max = Math.max(...waveform);
  return max > 0 ? waveform.map((n) => n / max) : waveform;
};

export const timeStretchBuffer = async (ctx, originalBuffer, targetDurationSec) => {
  const originalDuration = originalBuffer.duration;
  const ratio = originalDuration / targetDurationSec;
  const sampleRate = ctx.sampleRate;
  
  const targetSamples = Math.floor(targetDurationSec * sampleRate);
  const newBuffer = ctx.createBuffer(originalBuffer.numberOfChannels, targetSamples, sampleRate);
  
  const windowSize = Math.floor(sampleRate * 0.05); // 50ms grain
  const hopSize = Math.floor(windowSize / 2); // 50% overlap
  
  // Hann window calculation
  const hann = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    hann[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (windowSize - 1)));
  }

  for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
    const input = originalBuffer.getChannelData(channel);
    const output = newBuffer.getChannelData(channel);
    
    let outOffset = 0;
    while (outOffset < targetSamples) {
      const inOffset = Math.floor(outOffset * ratio);
      
      for (let i = 0; i < windowSize; i++) {
        if (inOffset + i < input.length && outOffset + i < targetSamples) {
          output[outOffset + i] += input[inOffset + i] * hann[i];
        }
      }
      outOffset += hopSize;
    }
    
    // Normalize to prevent clipping from overlap-add
    let maxAmp = 0;
    for (let i = 0; i < targetSamples; i++) {
      if (Math.abs(output[i]) > maxAmp) maxAmp = Math.abs(output[i]);
    }
    if (maxAmp > 1.0) {
      for (let i = 0; i < targetSamples; i++) output[i] /= maxAmp;
    }
  }
  
  return newBuffer;
};

export const getAudioContext = () => initAudio();


// --- Acoustic Drums ---
export const playKickAcoustic = ({ volume = 1, pan = 0, send = 0.05 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 110, type: "sine", attack: 0.002, hold: 0.03, release: 0.35, gain: 0.6, destination: out.input, bendTo: 45, bendTime: 0.1 });
  voice({ freq: 140, type: "triangle", attack: 0.002, hold: 0.02, release: 0.15, gain: 0.2, destination: out.input, bendTo: 60, bendTime: 0.05 });
  noiseBurst({ duration: 0.02, attack: 0.001, release: 0.015, gain: 0.1, frequency: 3000, filterType: "bandpass", q: 1, output: out.input });
});

export const playSnareAcoustic = ({ volume = 0.9, pan = 0, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 190, type: "sine", attack: 0.002, hold: 0.04, release: 0.15, gain: 0.3, destination: out.input, bendTo: 160, bendTime: 0.05 });
  voice({ freq: 320, type: "triangle", attack: 0.002, hold: 0.02, release: 0.25, gain: 0.1, destination: out.input });
  noiseBurst({ duration: 0.25, attack: 0.005, release: 0.2, gain: 0.35, frequency: 2400, filterType: "bandpass", q: 0.8, output: out.input });
});

export const playTomLowAcoustic = ({ volume = 0.85, pan = -0.2, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 90, type: "sine", attack: 0.005, hold: 0.08, release: 0.45, gain: 0.5, destination: out.input, bendTo: 60, bendTime: 0.15 });
  voice({ freq: 140, type: "triangle", attack: 0.003, hold: 0.04, release: 0.2, gain: 0.15, destination: out.input, bendTo: 80, bendTime: 0.1 });
  noiseBurst({ duration: 0.05, gain: 0.05, frequency: 1500, filterType: "bandpass", q: 1, output: out.input });
});

export const playTomHighAcoustic = ({ volume = 0.85, pan = 0.2, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 150, type: "sine", attack: 0.004, hold: 0.06, release: 0.35, gain: 0.45, destination: out.input, bendTo: 100, bendTime: 0.1 });
  voice({ freq: 220, type: "triangle", attack: 0.003, hold: 0.03, release: 0.15, gain: 0.15, destination: out.input, bendTo: 130, bendTime: 0.08 });
  noiseBurst({ duration: 0.04, gain: 0.05, frequency: 2000, filterType: "bandpass", q: 1, output: out.input });
});

export const playCrashAcoustic = ({ volume = 0.6, pan = 0.3, send = 0.25 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [1.8, 2.4, 3.1, 4.0, 5.2, 6.5, 7.8, 9.1];
  ratios.forEach((ratio, index) => {
    voice({ freq: 130 * ratio, type: "square", start: index * 0.001, attack: 0.005, hold: 0.1, release: 1.2 + (index * 0.1), gain: 0.015, destination: out.input, filter: { type: "highpass", frequency: 4000 } });
  });
  noiseBurst({ duration: 1.5, attack: 0.005, release: 1.2, gain: 0.2, frequency: 8000, filterType: "highpass", output: out.input });
  noiseBurst({ duration: 1.0, attack: 0.01, release: 0.8, gain: 0.1, frequency: 4000, filterType: "bandpass", q: 0.5, output: out.input });
});

export const playRideAcoustic = ({ volume = 0.65, pan = -0.3, send = 0.15 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [2.2, 3.5, 4.8, 6.1, 7.5];
  ratios.forEach((ratio) => {
    voice({ freq: 280 * ratio, type: "square", start: 0, attack: 0.002, hold: 0.05, release: 1.5, gain: 0.01, destination: out.input, filter: { type: "highpass", frequency: 5000 } });
  });
  
  voice({ freq: 3200, type: "sine", attack: 0.001, hold: 0.01, release: 0.3, gain: 0.05, destination: out.input });
  noiseBurst({ duration: 1.5, attack: 0.005, release: 1.2, gain: 0.08, frequency: 7000, filterType: "highpass", output: out.input });
});

export const playHiHatClosedAcoustic = ({ volume = 0.7, pan = 0.1, send = 0.05 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [2.5, 3.8, 4.9, 6.2];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", start: 0, attack: 0.001, hold: 0.01, release: 0.06, gain: 0.02, destination: out.input, filter: { type: "highpass", frequency: 6000 } });
  });
  noiseBurst({ duration: 0.06, attack: 0.001, release: 0.05, gain: 0.15, frequency: 9500, filterType: "highpass", output: out.input });
});

export const playHiHatOpenAcoustic = ({ volume = 0.7, pan = 0.1, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [2.5, 3.8, 4.9, 6.2, 7.5];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", start: 0, attack: 0.005, hold: 0.1, release: 0.35, gain: 0.015, destination: out.input, filter: { type: "highpass", frequency: 5000 } });
  });
  noiseBurst({ duration: 0.45, attack: 0.005, release: 0.35, gain: 0.18, frequency: 8000, filterType: "highpass", output: out.input });
});

// ============================================================================
// Melodic Synths (cases for playInstrumentTone)
// Dump these directly into the switch(instrumentId) statement in sounds.js
// ============================================================================

// --- Electronic Drums ---
// ==========================================
// ELECTRONIC & EDM DRUMS
// ==========================================

export const playKickEDM = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Punchy, clicky kick
  voice({ freq: 280, type: "sine", attack: 0.001, hold: 0.02, release: 0.35, gain: 0.8, destination: out.input, bendTo: 45, bendTime: 0.1 });
  voice({ freq: 150, type: "triangle", attack: 0.001, hold: 0.01, release: 0.2, gain: 0.3, destination: out.input, bendTo: 30, bendTime: 0.08 });
  noiseBurst({ duration: 0.03, gain: 0.15, frequency: 4000, filterType: "highpass", output: out.input });
});

export const playKickDeep = ({ volume = 1, pan = 0, send = 0.05 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Massive sub kick
  voice({ freq: 120, type: "sine", attack: 0.01, hold: 0.05, release: 0.8, gain: 0.9, destination: out.input, bendTo: 35, bendTime: 0.25 });
  voice({ freq: 80, type: "triangle", attack: 0.01, hold: 0.05, release: 0.7, gain: 0.4, destination: out.input, bendTo: 35, bendTime: 0.2 });
});

export const playSnareClap = ({ volume = 0.85, pan = 0, send = 0.15 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Body of snare
  voice({ freq: 220, type: "triangle", attack: 0.002, hold: 0.04, release: 0.2, gain: 0.25, destination: out.input, bendTo: 160, bendTime: 0.1 });
  // Clap noise burst layered
  [0, 0.015, 0.03].forEach((startDelay, index) => {
    noiseBurst({ start: startDelay, duration: 0.15 + index * 0.03, attack: 0.002, release: 0.15, gain: 0.25 - index * 0.04, frequency: 2200 + index * 400, filterType: "bandpass", q: 1.5, output: out.input });
  });
  // High noise tail
  noiseBurst({ start: 0.01, duration: 0.25, attack: 0.005, release: 0.2, gain: 0.3, frequency: 3500, filterType: "highpass", output: out.input });
});

export const playHatEDM = ({ volume = 0.7, pan = 0, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Metallic oscillators
  const ratios = [2.5, 3.8, 4.9, 6.1];
  ratios.forEach((ratio, index) => {
    voice({ freq: 300 * ratio, type: "square", start: index * 0.002, attack: 0.001, hold: 0.02, release: 0.08, gain: 0.03, destination: out.input, filter: { type: "highpass", frequency: 8000 } });
  });
  // Sharp noise
  noiseBurst({ duration: 0.06, attack: 0.001, release: 0.05, gain: 0.25, frequency: 10000, filterType: "highpass", output: out.input });
});

export const playCymbalReverse = ({ volume = 0.6, pan = 0, send = 0.3 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Reverse envelope simulated with a long attack and instant release
  const attackTime = 0.6;
  const ratios = [2.2, 3.5, 4.8, 5.9];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", start: 0, attack: attackTime, hold: 0.02, release: 0.05, gain: 0.04, destination: out.input, filter: { type: "highpass", frequency: 4000 } });
  });
  noiseBurst({ start: 0, duration: attackTime + 0.05, attack: attackTime, release: 0.05, gain: 0.2, frequency: 6000, filterType: "highpass", output: out.input });
});

export const playPercFM = ({ volume = 0.8, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // A metallic FM-like percussion hit
  voice({ freq: 440, type: "sine", attack: 0.002, hold: 0.03, release: 0.15, gain: 0.4, destination: out.input, bendTo: 110, bendTime: 0.1 });
  voice({ freq: 880, type: "square", attack: 0.002, hold: 0.02, release: 0.1, gain: 0.15, destination: out.input, filter: { type: "bandpass", frequency: 1200, q: 3 } });
  voice({ freq: 1760, type: "triangle", attack: 0.005, hold: 0.05, release: 0.2, gain: 0.1, destination: out.input });
});


// ==========================================
// MELODIC SYNTHS
// ==========================================

// To avoid syntax errors in this isolated file, the melodic synths are wrapped in a dummy switch block.
// Copy and paste the case blocks below into the `switch (instrumentId)` block 
// of the `playInstrumentTone` function in your sounds.js file.