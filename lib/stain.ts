import type { CSSProperties } from "react";

/** mulberry32: tiny seeded generator, so a card's stains are the same on the server and in the browser */
function rng(seed: number) {
  let a = (seed + 1) * 0x9e3779b1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Inline variables for .card: two soft, uneven blotches wherever they fall and a tilt to the light. No rings. */
export function stain(seed: number): CSSProperties {
  const r = rng(seed);
  const pct = (lo: number, hi: number) => `${Math.round(lo + r() * (hi - lo))}%`;
  return {
    "--s1x": pct(0, 100),
    "--s1y": pct(0, 100),
    "--s1w": pct(30, 85),
    "--s1h": pct(14, 40),
    "--s1a": (0.14 + r() * 0.24).toFixed(2),
    "--s2x": pct(0, 100),
    "--s2y": pct(0, 100),
    "--s2w": pct(12, 30),
    "--s2h": pct(30, 80),
    "--s2a": (0.08 + r() * 0.2).toFixed(2),
    "--sdeg": `${Math.round(120 + r() * 110)}deg`,
  } as CSSProperties;
}
