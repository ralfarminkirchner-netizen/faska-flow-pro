// sounds_drums.js
// Custom Drum Set and Synthesizer Expansion for Faskar Flow
// Generated per requirements

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

// ============================================================================
// TRAP DRUMS
// ============================================================================

export const playKickTrap1 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 150, type: "sine", attack: 0.005, hold: 0.05, release: 0.8, gain: 0.9, destination: out.input, bendTo: 45, bendTime: 0.3 });
  voice({ freq: 150, type: "triangle", attack: 0.001, hold: 0.02, release: 0.1, gain: 0.3, destination: out.input, bendTo: 50, bendTime: 0.1 });
});

export const playKickTrap2 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 200, type: "sine", attack: 0.001, hold: 0.02, release: 0.25, gain: 0.8, destination: out.input, bendTo: 55, bendTime: 0.1 });
  noiseBurst({ duration: 0.02, attack: 0.001, release: 0.01, gain: 0.2, frequency: 3000, filterType: "highpass", output: out.input });
});

export const playSnareTrap1 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 220, type: "triangle", attack: 0.001, hold: 0.02, release: 0.15, gain: 0.4, destination: out.input, bendTo: 180, bendTime: 0.05 });
  noiseBurst({ duration: 0.15, attack: 0.001, release: 0.1, gain: 0.4, frequency: 2800, filterType: "bandpass", q: 1.2, output: out.input });
});

export const playSnareTrap2 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 300, type: "sine", attack: 0.001, hold: 0.03, release: 0.2, gain: 0.3, destination: out.input, bendTo: 220, bendTime: 0.05 });
  noiseBurst({ duration: 0.2, attack: 0.001, release: 0.15, gain: 0.5, frequency: 3500, filterType: "highpass", output: out.input });
});

export const playHatTrapClosed = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 8000, type: "square", attack: 0.001, hold: 0.01, release: 0.04, gain: 0.05, destination: out.input, filter: { type: "highpass", frequency: 7000 } });
  noiseBurst({ duration: 0.05, attack: 0.001, release: 0.04, gain: 0.25, frequency: 9000, filterType: "highpass", output: out.input });
});

export const playHatTrapOpen = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 8000, type: "square", attack: 0.005, hold: 0.05, release: 0.3, gain: 0.05, destination: out.input, filter: { type: "highpass", frequency: 7000 } });
  noiseBurst({ duration: 0.35, attack: 0.002, release: 0.3, gain: 0.2, frequency: 9000, filterType: "highpass", output: out.input });
});

export const playClapTrap = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  [0, 0.015, 0.03].forEach((startDelay, index) => {
    noiseBurst({ start: startDelay, duration: 0.1 + index * 0.02, attack: 0.001, release: 0.1, gain: 0.3 - index * 0.05, frequency: 2500, filterType: "bandpass", q: 1.5, output: out.input });
  });
});

export const playPercTrapRim = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 650, type: "square", attack: 0.001, hold: 0.01, release: 0.05, gain: 0.3, destination: out.input, filter: { type: "bandpass", frequency: 1800, q: 3 } });
  voice({ freq: 800, type: "triangle", attack: 0.001, hold: 0.02, release: 0.06, gain: 0.2, destination: out.input });
});

// ============================================================================
// LO-FI DRUMS
// ============================================================================

export const playKickLofi = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 110, type: "sine", attack: 0.01, hold: 0.05, release: 0.3, gain: 0.7, destination: out.input, bendTo: 50, bendTime: 0.1, filter: { type: "lowpass", frequency: 400 } });
  noiseBurst({ duration: 0.05, attack: 0.01, release: 0.04, gain: 0.05, frequency: 1000, filterType: "lowpass", output: out.input });
});

export const playSnareLofi = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 180, type: "triangle", attack: 0.005, hold: 0.05, release: 0.2, gain: 0.2, destination: out.input, bendTo: 140, bendTime: 0.1, filter: { type: "lowpass", frequency: 1200 } });
  noiseBurst({ duration: 0.2, attack: 0.01, release: 0.15, gain: 0.25, frequency: 1800, filterType: "bandpass", q: 0.8, output: out.input });
});

export const playHatLofi = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.08, attack: 0.005, release: 0.06, gain: 0.15, frequency: 4000, filterType: "bandpass", q: 1.5, output: out.input });
});

export const playClapLofi = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  [0, 0.02].forEach((startDelay) => {
    noiseBurst({ start: startDelay, duration: 0.15, attack: 0.01, release: 0.1, gain: 0.2, frequency: 1500, filterType: "bandpass", q: 1, output: out.input });
  });
});

export const playPercLofiSnap = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.05, attack: 0.002, release: 0.04, gain: 0.3, frequency: 2500, filterType: "bandpass", q: 2, output: out.input });
  voice({ freq: 2000, type: "sine", attack: 0.002, hold: 0.01, release: 0.03, gain: 0.1, destination: out.input });
});

export const playPercLofiClick = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.015, attack: 0.001, release: 0.01, gain: 0.15, frequency: 5000, filterType: "highpass", output: out.input });
  voice({ freq: 1200, type: "square", attack: 0.001, hold: 0.005, release: 0.01, gain: 0.05, destination: out.input });
});

export const playTomLofi = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 120, type: "sine", attack: 0.01, hold: 0.1, release: 0.4, gain: 0.6, destination: out.input, bendTo: 80, bendTime: 0.15, filter: { type: "lowpass", frequency: 600 } });
});

export const playSfxLofiVinyl = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.4, attack: 0.05, release: 0.2, gain: 0.08, frequency: 1500, filterType: "highpass", output: out.input });
  noiseBurst({ duration: 0.3, attack: 0.1, release: 0.1, gain: 0.05, frequency: 800, filterType: "lowpass", output: out.input });
});

// ============================================================================
// TECHNO DRUMS
// ============================================================================

export const playKickTechno1 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 160, type: "sine", attack: 0.001, hold: 0.03, release: 0.25, gain: 0.8, destination: out.input, bendTo: 40, bendTime: 0.1 });
  voice({ freq: 160, type: "square", attack: 0.001, hold: 0.02, release: 0.1, gain: 0.15, destination: out.input, filter: { type: "lowpass", frequency: 400 } });
});

export const playKickTechno2 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 90, type: "sine", attack: 0.01, hold: 0.2, release: 0.5, gain: 0.7, destination: out.input, bendTo: 45, bendTime: 0.2 });
  noiseBurst({ duration: 0.4, attack: 0.05, release: 0.3, gain: 0.05, frequency: 200, filterType: "lowpass", output: out.input });
});

export const playSnareTechno = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 200, type: "triangle", attack: 0.001, hold: 0.03, release: 0.15, gain: 0.25, destination: out.input, bendTo: 150, bendTime: 0.05 });
  noiseBurst({ duration: 0.2, attack: 0.001, release: 0.15, gain: 0.4, frequency: 2500, filterType: "highpass", output: out.input });
});

export const playHatTechnoClosed = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [2.1, 3.2, 4.3];
  ratios.forEach((ratio) => {
    voice({ freq: 200 * ratio, type: "square", attack: 0.001, hold: 0.01, release: 0.05, gain: 0.03, destination: out.input, filter: { type: "highpass", frequency: 6000 } });
  });
  noiseBurst({ duration: 0.06, attack: 0.001, release: 0.05, gain: 0.2, frequency: 8000, filterType: "highpass", output: out.input });
});

export const playHatTechnoOpen = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [2.1, 3.2, 4.3];
  ratios.forEach((ratio) => {
    voice({ freq: 200 * ratio, type: "square", attack: 0.002, hold: 0.05, release: 0.25, gain: 0.02, destination: out.input, filter: { type: "highpass", frequency: 6000 } });
  });
  noiseBurst({ duration: 0.3, attack: 0.002, release: 0.25, gain: 0.15, frequency: 8000, filterType: "highpass", output: out.input });
});

export const playClapTechno = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  [0, 0.01, 0.025].forEach((startDelay, index) => {
    noiseBurst({ start: startDelay, duration: 0.15, attack: 0.001, release: 0.12, gain: 0.3 - index * 0.05, frequency: 2200, filterType: "highpass", output: out.input });
  });
});

export const playTomTechno = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 130, type: "sine", attack: 0.002, hold: 0.05, release: 0.3, gain: 0.6, destination: out.input, bendTo: 70, bendTime: 0.1 });
  voice({ freq: 130, type: "square", attack: 0.002, hold: 0.02, release: 0.15, gain: 0.1, destination: out.input, filter: { type: "lowpass", frequency: 500 } });
});

export const playCymbalTechno = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [1.5, 2.3, 3.1, 4.5, 5.7];
  ratios.forEach((ratio) => {
    voice({ freq: 180 * ratio, type: "square", attack: 0.005, hold: 0.1, release: 0.6, gain: 0.02, destination: out.input, filter: { type: "highpass", frequency: 5000 } });
  });
  noiseBurst({ duration: 0.7, attack: 0.005, release: 0.6, gain: 0.15, frequency: 7000, filterType: "highpass", output: out.input });
});

// ============================================================================
// ACOUSTIC DRUMS
// ============================================================================

export const playKickAcoustic1 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 120, type: "sine", attack: 0.002, hold: 0.03, release: 0.35, gain: 0.6, destination: out.input, bendTo: 45, bendTime: 0.1 });
  voice({ freq: 150, type: "triangle", attack: 0.002, hold: 0.02, release: 0.15, gain: 0.2, destination: out.input, bendTo: 60, bendTime: 0.05 });
  noiseBurst({ duration: 0.02, attack: 0.001, release: 0.015, gain: 0.1, frequency: 3000, filterType: "bandpass", q: 1, output: out.input });
});

export const playSnareAcoustic1 = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 190, type: "sine", attack: 0.002, hold: 0.04, release: 0.15, gain: 0.3, destination: out.input, bendTo: 160, bendTime: 0.05 });
  voice({ freq: 320, type: "triangle", attack: 0.002, hold: 0.02, release: 0.25, gain: 0.1, destination: out.input });
  noiseBurst({ duration: 0.25, attack: 0.005, release: 0.2, gain: 0.35, frequency: 2400, filterType: "bandpass", q: 0.8, output: out.input });
});

export const playHatAcousticClosed = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [2.5, 3.8, 4.9, 6.2];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", attack: 0.001, hold: 0.01, release: 0.06, gain: 0.02, destination: out.input, filter: { type: "highpass", frequency: 6000 } });
  });
  noiseBurst({ duration: 0.06, attack: 0.001, release: 0.05, gain: 0.15, frequency: 9500, filterType: "highpass", output: out.input });
});

export const playHatAcousticOpen = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [2.5, 3.8, 4.9, 6.2, 7.5];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", attack: 0.005, hold: 0.1, release: 0.35, gain: 0.015, destination: out.input, filter: { type: "highpass", frequency: 5000 } });
  });
  noiseBurst({ duration: 0.45, attack: 0.005, release: 0.35, gain: 0.18, frequency: 8000, filterType: "highpass", output: out.input });
});

export const playTomAcousticHigh = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 150, type: "sine", attack: 0.004, hold: 0.06, release: 0.35, gain: 0.45, destination: out.input, bendTo: 100, bendTime: 0.1 });
  voice({ freq: 220, type: "triangle", attack: 0.003, hold: 0.03, release: 0.15, gain: 0.15, destination: out.input, bendTo: 130, bendTime: 0.08 });
  noiseBurst({ duration: 0.04, gain: 0.05, frequency: 2000, filterType: "bandpass", q: 1, output: out.input });
});

export const playTomAcousticLow = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 90, type: "sine", attack: 0.005, hold: 0.08, release: 0.45, gain: 0.5, destination: out.input, bendTo: 60, bendTime: 0.15 });
  voice({ freq: 140, type: "triangle", attack: 0.003, hold: 0.04, release: 0.2, gain: 0.15, destination: out.input, bendTo: 80, bendTime: 0.1 });
  noiseBurst({ duration: 0.05, gain: 0.05, frequency: 1500, filterType: "bandpass", q: 1, output: out.input });
});

export const playCymbalAcousticRide = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [2.2, 3.5, 4.8, 6.1, 7.5];
  ratios.forEach((ratio) => {
    voice({ freq: 280 * ratio, type: "square", attack: 0.002, hold: 0.05, release: 1.5, gain: 0.01, destination: out.input, filter: { type: "highpass", frequency: 5000 } });
  });
  voice({ freq: 3200, type: "sine", attack: 0.001, hold: 0.01, release: 0.3, gain: 0.05, destination: out.input });
  noiseBurst({ duration: 1.5, attack: 0.005, release: 1.2, gain: 0.08, frequency: 7000, filterType: "highpass", output: out.input });
});

export const playCymbalAcousticCrash = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  const ratios = [1.8, 2.4, 3.1, 4.0, 5.2, 6.5, 7.8, 9.1];
  ratios.forEach((ratio, index) => {
    voice({ freq: 130 * ratio, type: "square", start: index * 0.001, attack: 0.005, hold: 0.1, release: 1.2 + (index * 0.1), gain: 0.015, destination: out.input, filter: { type: "highpass", frequency: 4000 } });
  });
  noiseBurst({ duration: 1.5, attack: 0.005, release: 1.2, gain: 0.2, frequency: 8000, filterType: "highpass", output: out.input });
  noiseBurst({ duration: 1.0, attack: 0.01, release: 0.8, gain: 0.1, frequency: 4000, filterType: "bandpass", q: 0.5, output: out.input });
});

// ============================================================================
// GLITCH DRUMS
// ============================================================================

export const playKickGlitch = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 200, type: "square", attack: 0.001, hold: 0.01, release: 0.1, gain: 0.8, destination: out.input, bendTo: 20, bendTime: 0.05, filter: { type: "lowpass", frequency: 800 } });
  noiseBurst({ duration: 0.02, attack: 0.001, release: 0.01, gain: 0.4, frequency: 1000, filterType: "bandpass", q: 5, output: out.input });
});

export const playSnareGlitch = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 600, type: "sine", attack: 0.001, hold: 0.01, release: 0.1, gain: 0.4, destination: out.input, bendTo: 100, bendTime: 0.05 });
  noiseBurst({ duration: 0.1, attack: 0.001, release: 0.05, gain: 0.5, frequency: 4000, filterType: "bandpass", q: 0.5, output: out.input });
  voice({ freq: 1200, type: "sawtooth", attack: 0.001, hold: 0.01, release: 0.05, gain: 0.2, destination: out.input, bendTo: 200, bendTime: 0.02 });
});

export const playHatGlitch = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 5000, type: "triangle", attack: 0.001, hold: 0.01, release: 0.05, gain: 0.1, destination: out.input, bendTo: 8000, bendTime: 0.02 });
  noiseBurst({ duration: 0.04, attack: 0.001, release: 0.02, gain: 0.3, frequency: 6000, filterType: "bandpass", q: 5, output: out.input });
});

export const playClapGlitch = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  [0, 0.005, 0.01, 0.015, 0.02].forEach((startDelay, index) => {
    noiseBurst({ start: startDelay, duration: 0.03, attack: 0.001, release: 0.02, gain: 0.4 - index * 0.05, frequency: 3000 + index * 500, filterType: "highpass", output: out.input });
  });
});

export const playPercGlitchZap = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 2000, type: "sawtooth", attack: 0.001, hold: 0.02, release: 0.1, gain: 0.3, destination: out.input, bendTo: 100, bendTime: 0.05, filter: { type: "lowpass", frequency: 4000, to: 500, time: 0.05 } });
});

export const playPercGlitchBloop = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 400, type: "sine", attack: 0.001, hold: 0.05, release: 0.1, gain: 0.5, destination: out.input, bendTo: 800, bendTime: 0.05 });
  voice({ freq: 400, type: "square", attack: 0.001, hold: 0.02, release: 0.05, gain: 0.1, destination: out.input, filter: { type: "lowpass", frequency: 1200 } });
});

export const playSfxGlitchError = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  voice({ freq: 150, type: "sawtooth", attack: 0.01, hold: 0.1, release: 0.1, gain: 0.3, destination: out.input, detune: 50 });
  voice({ freq: 155, type: "square", attack: 0.01, hold: 0.1, release: 0.1, gain: 0.3, destination: out.input, detune: -50 });
  noiseBurst({ duration: 0.15, attack: 0.01, release: 0.1, gain: 0.2, frequency: 2000, filterType: "bandpass", q: 10, output: out.input });
});

export const playSfxGlitchReverse = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  noiseBurst({ duration: 0.25, attack: 0.2, release: 0.01, gain: 0.3, frequency: 5000, filterType: "lowpass", output: out.input });
  voice({ freq: 100, type: "sine", attack: 0.2, hold: 0.01, release: 0.01, gain: 0.4, destination: out.input, bendTo: 1000, bendTime: 0.2 });
});

// ============================================================================
// EXPORT NEW_DRUMS ARRAY
// ============================================================================

export const NEW_DRUMS = [
  { id: "kick_trap1", short: "KCKT", name: "Trap Kick 1", hue: "#ef4444", play: playKickTrap1 },
  { id: "kick_trap2", short: "KCK2", name: "Trap Kick 2", hue: "#dc2626", play: playKickTrap2 },
  { id: "snare_trap1", short: "SNRT", name: "Trap Snare 1", hue: "#f97316", play: playSnareTrap1 },
  { id: "snare_trap2", short: "SNR2", name: "Trap Snare 2", hue: "#ea580c", play: playSnareTrap2 },
  { id: "hat_trap_closed", short: "HHTC", name: "Trap Hat Closed", hue: "#eab308", play: playHatTrapClosed },
  { id: "hat_trap_open", short: "HHTO", name: "Trap Hat Open", hue: "#ca8a04", play: playHatTrapOpen },
  { id: "clap_trap", short: "CLPT", name: "Trap Clap", hue: "#84cc16", play: playClapTrap },
  { id: "perc_trap_rim", short: "PRCT", name: "Trap Rim", hue: "#65a30d", play: playPercTrapRim },

  { id: "kick_lofi", short: "KCKL", name: "Lo-Fi Kick", hue: "#10b981", play: playKickLofi },
  { id: "snare_lofi", short: "SNRL", name: "Lo-Fi Snare", hue: "#059669", play: playSnareLofi },
  { id: "hat_lofi", short: "HHTL", name: "Lo-Fi Hat", hue: "#06b6d4", play: playHatLofi },
  { id: "clap_lofi", short: "CLPL", name: "Lo-Fi Clap", hue: "#0891b2", play: playClapLofi },
  { id: "perc_lofi_snap", short: "SNPL", name: "Lo-Fi Snap", hue: "#3b82f6", play: playPercLofiSnap },
  { id: "perc_lofi_click", short: "CLCK", name: "Lo-Fi Click", hue: "#2563eb", play: playPercLofiClick },
  { id: "tom_lofi", short: "TOML", name: "Lo-Fi Tom", hue: "#6366f1", play: playTomLofi },
  { id: "sfx_lofi_vinyl", short: "VNYL", name: "Lo-Fi Vinyl", hue: "#4f46e5", play: playSfxLofiVinyl },

  { id: "kick_techno1", short: "KCKC", name: "Techno Kick 1", hue: "#8b5cf6", play: playKickTechno1 },
  { id: "kick_techno2", short: "KCKD", name: "Techno Kick Deep", hue: "#7c3aed", play: playKickTechno2 },
  { id: "snare_techno", short: "SNRC", name: "Techno Snare", hue: "#d946ef", play: playSnareTechno },
  { id: "hat_techno_closed", short: "HHCC", name: "Techno Hat Closed", hue: "#c026d3", play: playHatTechnoClosed },
  { id: "hat_techno_open", short: "HHCO", name: "Techno Hat Open", hue: "#ec4899", play: playHatTechnoOpen },
  { id: "clap_techno", short: "CLPC", name: "Techno Clap", hue: "#db2777", play: playClapTechno },
  { id: "tom_techno", short: "TOMC", name: "Techno Tom", hue: "#f43f5e", play: playTomTechno },
  { id: "cymbal_techno", short: "CYMC", name: "Techno Cymbal", hue: "#e11d48", play: playCymbalTechno },

  { id: "kick_acoustic1", short: "KCKA", name: "Acoustic Kick", hue: "#fda4af", play: playKickAcoustic1 },
  { id: "snare_acoustic1", short: "SNRA", name: "Acoustic Snare", hue: "#f87171", play: playSnareAcoustic1 },
  { id: "hat_acoustic_closed", short: "HHAC", name: "Acoustic Hat Closed", hue: "#fbbf24", play: playHatAcousticClosed },
  { id: "hat_acoustic_open", short: "HHAO", name: "Acoustic Hat Open", hue: "#f59e0b", play: playHatAcousticOpen },
  { id: "tom_acoustic_high", short: "TOMA", name: "Acoustic Tom High", hue: "#34d399", play: playTomAcousticHigh },
  { id: "tom_acoustic_low", short: "TOMB", name: "Acoustic Tom Low", hue: "#10b981", play: playTomAcousticLow },
  { id: "cymbal_acoustic_ride", short: "RIDE", name: "Acoustic Ride", hue: "#60a5fa", play: playCymbalAcousticRide },
  { id: "cymbal_acoustic_crash", short: "CRSH", name: "Acoustic Crash", hue: "#3b82f6", play: playCymbalAcousticCrash },

  { id: "kick_glitch", short: "KCKG", name: "Glitch Kick", hue: "#94a3b8", play: playKickGlitch },
  { id: "snare_glitch", short: "SNRG", name: "Glitch Snare", hue: "#64748b", play: playSnareGlitch },
  { id: "hat_glitch", short: "HHTG", name: "Glitch Hat", hue: "#cbd5e1", play: playHatGlitch },
  { id: "clap_glitch", short: "CLPG", name: "Glitch Clap", hue: "#475569", play: playClapGlitch },
  { id: "perc_glitch_zap", short: "ZAPG", name: "Glitch Zap", hue: "#fcd34d", play: playPercGlitchZap },
  { id: "perc_glitch_bloop", short: "BLOP", name: "Glitch Bloop", hue: "#6ee7b7", play: playPercGlitchBloop },
  { id: "sfx_glitch_error", short: "ERRG", name: "Glitch Error", hue: "#fca5a5", play: playSfxGlitchError },
  { id: "sfx_glitch_reverse", short: "REVG", name: "Glitch Reverse", hue: "#93c5fd", play: playSfxGlitchReverse }
];

/*
=============================================================================
MELODIC SYNTHS
=============================================================================
Copy these cases into the switch(instrumentId) block of playInstrumentTone in sounds.js:

    case "synth_retro_wave":
      voice({ freq, type: "sawtooth", start, attack: 0.05, hold: 0.3, release: 0.6, gain: 0.25, sustain: 0.2, destination: input, filter: { type: "lowpass", frequency: 1200, to: 3000, time: 0.4 } });
      voice({ freq: freq * 1.005, type: "square", start, attack: 0.06, hold: 0.25, release: 0.5, gain: 0.15, sustain: 0.1, detune: 6, destination: input, filter: { type: "lowpass", frequency: 1500, to: 2500, time: 0.3 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.05, hold: 0.3, release: 0.6, gain: 0.1, sustain: 0.08, destination: input });
      break;

    case "synth_glass_pad":
      voice({ freq, type: "sine", start, attack: 0.4, hold: 0.8, release: 1.5, gain: 0.3, sustain: 0.25, destination: input, filter: { type: "lowpass", frequency: 2000 } });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.5, hold: 0.7, release: 1.2, gain: 0.1, sustain: 0.05, destination: input });
      voice({ freq: freq * 3.01, type: "triangle", start, attack: 0.6, hold: 0.6, release: 1.0, gain: 0.05, sustain: 0.02, destination: input });
      noiseBurst({ start, duration: 1.5, attack: 0.5, release: 1.0, gain: 0.02, frequency: 4000, filterType: "bandpass", q: 2, output: input });
      break;

    case "synth_dark_bass":
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.01, hold: 0.2, release: 0.4, gain: 0.4, sustain: 0.3, destination: input, filter: { type: "lowpass", frequency: 400, to: 100, time: 0.3 } });
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.015, hold: 0.25, release: 0.45, gain: 0.6, sustain: 0.5, destination: input });
      voice({ freq, type: "square", start, attack: 0.01, hold: 0.1, release: 0.2, gain: 0.1, sustain: 0.05, destination: input, filter: { type: "bandpass", frequency: 800, q: 1.5 } });
      break;

    case "synth_acid_lead":
      voice({ freq, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.3, sustain: 0.15, destination: input, filter: { type: "lowpass", frequency: 4000, to: 300, time: 0.15, q: 8 } });
      voice({ freq: freq * 1.01, type: "sawtooth", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.2, sustain: 0.1, detune: 5, destination: input, filter: { type: "lowpass", frequency: 4000, to: 300, time: 0.15, q: 8 } });
      break;

    case "synth_pluck_fm":
      voice({ freq, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.4, gain: 0.4, sustain: 0.1, destination: input });
      voice({ freq: freq * 2, type: "triangle", start, attack: 0.005, hold: 0.02, release: 0.2, gain: 0.2, sustain: 0.05, destination: input, bendTo: freq * 1.5, bendTime: 0.1 });
      voice({ freq: freq * 4, type: "square", start, attack: 0.005, hold: 0.01, release: 0.1, gain: 0.05, sustain: 0.01, destination: input, filter: { type: "bandpass", frequency: freq * 8, q: 2 } });
      break;
*/
