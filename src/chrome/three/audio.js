/* Web Audio — synthesized, no audio files. Ported from the owner's
   utils/audio.js (metallic click) + the 3d version's Rain toggle.
   Autoplay-policy safe: the AudioContext is created / resumed ONLY on a
   user gesture (sound toggle, click, rain toggle). Everything is guarded
   with try/catch — if Web Audio is unavailable nothing crashes. */

const STORE_KEY = "ct-sound";

let ctx = null;
let enabled = false;
let rainNodes = null;
let engineNodes = null;

try {
  enabled = window.localStorage?.getItem(STORE_KEY) === "1";
} catch (e) {
  enabled = false;
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(next) {
  enabled = !!next;
  try {
    window.localStorage?.setItem(STORE_KEY, enabled ? "1" : "0");
  } catch (e) {
    // Storage unavailable — sound state just does not persist.
  }
  if (!enabled) {
    stopEngine();
    stopRain();
  }
  return enabled;
}

/** Create (or resume) the context. Call only from a user gesture. */
export function ensureAudioContext() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch (e) {
    return null;
  }
}

/**
 * Metallic click — exactly the owner's utils/audio.js recipe:
 * sine 800 -> 1200 Hz over 0.05s, bandpass 1000 Hz Q5,
 * gain 0 -> 0.3 -> 0.001 over 0.1s.
 */
export function playMetallicClick() {
  if (!enabled) return;
  const ac = ensureAudioContext();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.05);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, ac.currentTime);
    filter.Q.value = 5;

    gainNode.gain.setValueAtTime(0, ac.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ac.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ac.destination);

    osc.start();
    osc.stop(ac.currentTime + 0.1);
  } catch (e) {
    // A failed click must never break the UI.
  }
}

/**
 * Engine rev — low sawtooth through a lowpass, pitch rising with speed.
 * Call every frame from the Speed canvas: on = sound on + section in view,
 * p = scroll progress 0..1. Idempotent start/stop.
 */
export function engineUpdate(on, p = 0) {
  if (!enabled || !on) {
    stopEngine();
    return;
  }
  const ac = ensureAudioContext();
  if (!ac) return;
  try {
    if (!engineNodes) {
      const osc = ac.createOscillator();
      const sub = ac.createOscillator();
      const filter = ac.createBiquadFilter();
      const gain = ac.createGain();
      osc.type = "sawtooth";
      sub.type = "square";
      filter.type = "lowpass";
      filter.frequency.value = 320;
      gain.gain.value = 0.0;
      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      sub.start();
      engineNodes = { osc, sub, filter, gain };
      gain.gain.linearRampToValueAtTime(0.045, ac.currentTime + 0.4);
    }
    const t = Math.min(1, Math.max(0, p));
    engineNodes.osc.frequency.setTargetAtTime(52 + t * 190, ac.currentTime, 0.08);
    engineNodes.sub.frequency.setTargetAtTime(26 + t * 95, ac.currentTime, 0.08);
    engineNodes.filter.frequency.setTargetAtTime(320 + t * 1400, ac.currentTime, 0.1);
  } catch (e) {
    stopEngine();
  }
}

export function stopEngine() {
  if (!engineNodes) return;
  try {
    const { osc, sub, gain } = engineNodes;
    if (ctx) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    window.setTimeout(() => {
      try {
        osc.stop();
        sub.stop();
      } catch (e) {
        // Already stopped.
      }
    }, 300);
  } catch (e) {
    // Ignore.
  }
  engineNodes = null;
}

/** White-noise rain (3d version's Rain button, sound half of it). */
export function rainUpdate(on) {
  if (!enabled || !on) {
    stopRain();
    return;
  }
  const ac = ensureAudioContext();
  if (!ac || rainNodes) return;
  try {
    const len = ac.sampleRate * 2;
    const buffer = ac.createBuffer(1, len, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    const gain = ac.createGain();
    gain.gain.value = 0.0;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    src.start();
    gain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 0.6);
    rainNodes = { src, gain };
  } catch (e) {
    stopRain();
  }
}

export function stopRain() {
  if (!rainNodes) return;
  try {
    rainNodes.src.stop();
  } catch (e) {
    // Already stopped.
  }
  rainNodes = null;
}

export function getAudioState() {
  return {
    enabled,
    ctxState: ctx ? ctx.state : "none",
    engine: !!engineNodes,
    rain: !!rainNodes,
  };
}

/* Test / debug hook — lets the Playwright checks read AudioContext state
   without touching the DOM. Harmless in production. */
try {
  window.__ctAudio = { getAudioState, playMetallicClick, isSoundEnabled };
} catch (e) {
  // Non-browser environment.
}
