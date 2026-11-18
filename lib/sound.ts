/** Procedural WebAudio. Off by default, never autoplays; the context is created on the toggle click. */
let ctx: AudioContext | null = null;
let enabled = false;
const subs = new Set<() => void>();

export const sound = {
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => void subs.delete(fn);
  },
  get: () => enabled,
  set(on: boolean) {
    enabled = on;
    if (on && !ctx) ctx = new AudioContext();
    if (on) void ctx?.resume();
    subs.forEach((f) => f());
  },
};

function noise(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

/** Ceramic chip clink: two inharmonic partials with a fast decay. */
export function clink(delay = 0) {
  if (!enabled || !ctx) return;
  const c = ctx;
  const t = c.currentTime + delay;
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.18, t + 0.004);
  out.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  out.connect(c.destination);
  const base = 2600 + Math.random() * 900;
  for (const ratio of [1, 1.47, 2.09]) {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = base * ratio;
    o.connect(out);
    o.start(t);
    o.stop(t + 0.25);
  }
}

/** Card flip / deal: a short band-passed noise swish. */
export function flip(delay = 0) {
  if (!enabled || !ctx) return;
  const c = ctx;
  const t = c.currentTime + delay;
  const src = noise(c, 0.12);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(1800, t);
  bp.frequency.exponentialRampToValueAtTime(5200, t + 0.1);
  bp.Q.value = 0.9;
  const g = c.createGain();
  g.gain.value = 0.35;
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);
}
