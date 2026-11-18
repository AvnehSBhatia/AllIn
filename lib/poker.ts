/** Tiny 7-card evaluator + equity. Cards are 0..51: rank = c >> 2 (0 = deuce, 12 = ace), suit = c & 3. */

export const RANKS = "23456789TJQKA";
export const SUIT_CHARS = "shdc"; // spades, hearts, diamonds, clubs
export type SuitKey = "s" | "h" | "d" | "c";

export const rankOf = (c: number) => c >> 2;
export const suitOf = (c: number) => SUIT_CHARS[c & 3] as SuitKey;
export const label = (c: number) => RANKS[rankOf(c)] + suitOf(c);

/** "As", "Td" -> card int */
export const parse = (s: string) => RANKS.indexOf(s[0]) * 4 + SUIT_CHARS.indexOf(s[1]);

const B = 13;
const enc = (cat: number, ks: number[]) => ks.reduce((acc, k, i) => acc + k * B ** (4 - i), cat * B ** 5);

function straightHigh(mask: number): number {
  for (let h = 12; h >= 4; h--) if (((mask >> (h - 4)) & 31) === 31) return h;
  return (mask & 0b1000000001111) === 0b1000000001111 ? 3 : -1; // wheel
}

/** Higher is better. Works for 5 to 7 cards. */
export function score(cards: number[]): number {
  const rc = new Array(13).fill(0);
  const suits: number[][] = [[], [], [], []];
  let mask = 0;
  for (const c of cards) {
    rc[c >> 2]++;
    suits[c & 3].push(c >> 2);
    mask |= 1 << (c >> 2);
  }
  const flush = suits.find((s) => s.length >= 5);
  if (flush) {
    const sf = straightHigh(flush.reduce((m, r) => m | (1 << r), 0));
    if (sf >= 0) return enc(8, [sf]);
  }
  const desc = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  const withCount = (n: number) => desc.filter((r) => rc[r] >= n);
  const kick = (skip: number[], n: number) => desc.filter((r) => rc[r] > 0 && !skip.includes(r)).slice(0, n);

  const quads = withCount(4);
  if (quads.length) return enc(7, [quads[0], ...kick([quads[0]], 1)]);
  const trips = withCount(3);
  if (trips.length) {
    const pair = withCount(2).find((r) => r !== trips[0]);
    if (pair !== undefined) return enc(6, [trips[0], pair]);
  }
  if (flush) return enc(5, [...flush].sort((a, b) => b - a).slice(0, 5));
  const st = straightHigh(mask);
  if (st >= 0) return enc(4, [st]);
  if (trips.length) return enc(3, [trips[0], ...kick([trips[0]], 2)]);
  const pairs = withCount(2);
  if (pairs.length >= 2) return enc(2, [pairs[0], pairs[1], ...kick(pairs.slice(0, 2), 1)]);
  if (pairs.length === 1) return enc(1, [pairs[0], ...kick([pairs[0]], 3)]);
  return enc(0, kick([], 5));
}

export const HAND_NAMES = ["High card", "Pair", "Two pair", "Trips", "Straight", "Flush", "Full house", "Quads", "Straight flush"];
export const handName = (s: number) => HAND_NAMES[Math.floor(s / B ** 5)];

export function shuffled(): number[] {
  const d = Array.from({ length: 52 }, (_, i) => i);
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

/**
 * Heads-up equity for hand A (ties count half).
 * Exact enumeration with 0-2 board cards to come; Monte Carlo pre-flop.
 * ponytail: MC pre-flop at `samples` draws (~±2%), enumerate if exact numbers ever matter.
 * The sampler is seeded from the cards, so a given hand always gives the same number (server and browser agree).
 */
export function equity(a: number[], b: number[], board: number[], samples = 600): number {
  const used = new Set([...a, ...b, ...board]);
  const rest = Array.from({ length: 52 }, (_, i) => i).filter((c) => !used.has(c));
  const need = 5 - board.length;
  let win = 0;
  let n = 0;
  const run = (extra: number[]) => {
    const full = [...board, ...extra];
    const sa = score([...a, ...full]);
    const sb = score([...b, ...full]);
    win += sa > sb ? 1 : sa === sb ? 0.5 : 0;
    n++;
  };
  if (need === 0) run([]);
  else if (need === 1) rest.forEach((c) => run([c]));
  else if (need === 2) {
    for (let i = 0; i < rest.length; i++) for (let j = i + 1; j < rest.length; j++) run([rest[i], rest[j]]);
  } else {
    let seed = [...a, ...b, ...board].reduce((h, c) => Math.imul(h ^ c, 0x9e3779b1), 7) >>> 0;
    const rnd = () => {
      seed = (seed + 0x6d2b79f5) >>> 0; // mulberry32
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let k = 0; k < samples; k++) {
      const pick: number[] = [];
      while (pick.length < need) {
        const c = rest[Math.floor(rnd() * rest.length)];
        if (!pick.includes(c)) pick.push(c);
      }
      run(pick);
    }
  }
  return win / n;
}
