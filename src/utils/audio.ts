// Web Audio API helper for ambient cosmic sounds and UI clicks

let audioCtx: AudioContext | null = null;
let isAmbientPlaying = false;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientOsc3: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function notifyAudioStateChange(isPlaying: boolean) {
  try {
    window.dispatchEvent(
      new CustomEvent('portfolio-ambient-audio-changed', {
        detail: { isPlaying },
      })
    );
  } catch (e) {
    // Ignore in non-browser environments
  }
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playClickSound(freq = 600, duration = 0.05) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

export function startAmbientSpaceAudio(): boolean {
  try {
    if (isAmbientPlaying) return true;
    const ctx = getAudioContext();
    if (!ctx) return false;

    ambientOsc1 = ctx.createOscillator();
    ambientOsc2 = ctx.createOscillator();
    ambientOsc3 = ctx.createOscillator();
    ambientGain = ctx.createGain();

    // Deep harmonic drone (Space ambient A note)
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 Fundamental

    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 Fifth harmonic

    ambientOsc3.type = 'sine';
    ambientOsc3.frequency.setValueAtTime(220, ctx.currentTime); // A3 Octave shimmer

    // Low pass filter for warm, gentle cosmic presence
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, ctx.currentTime);

    // Gentle, balanced ambient volume level (~0.065)
    ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 1.8);

    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    ambientOsc3.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
    ambientOsc3.start();

    isAmbientPlaying = true;
    notifyAudioStateChange(true);
    return true;
  } catch (e) {
    return false;
  }
}

export function stopAmbientSpaceAudio(): boolean {
  try {
    if (!isAmbientPlaying) return false;
    const ctx = getAudioContext();
    if (ambientGain && ctx) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      setTimeout(() => {
        ambientOsc1?.stop();
        ambientOsc2?.stop();
        ambientOsc3?.stop();
        ambientOsc1 = null;
        ambientOsc2 = null;
        ambientOsc3 = null;
        ambientGain = null;
      }, 1300);
    }
    isAmbientPlaying = false;
    notifyAudioStateChange(false);
    return false;
  } catch (e) {
    return false;
  }
}

export function toggleAmbientSpaceAudio(): boolean {
  if (isAmbientPlaying) {
    return stopAmbientSpaceAudio();
  } else {
    return startAmbientSpaceAudio();
  }
}

export function isAudioPlaying() {
  return isAmbientPlaying;
}

export function playVortexSound(duration = 1.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Pitch sweep oscillator descending/ascending into singularity
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc2.type = 'sine';

    // Filter creates a deep resonant swirling whoosh
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4, ctx.currentTime);
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

    // Osc frequency vortex spin acceleration
    osc.frequency.setValueAtTime(240, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + duration);

    osc2.frequency.setValueAtTime(480, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

export function playEmergenceSound(duration = 1.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Pitch sweep ascending from singularity into expanded cosmic realm
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc2.type = 'sine';

    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, ctx.currentTime);
    filter.frequency.setValueAtTime(90, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + duration);

    osc.frequency.setValueAtTime(50, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + duration);

    osc2.frequency.setValueAtTime(70, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}
