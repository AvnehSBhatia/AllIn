import { label, score, shuffled } from "@/lib/poker";

/** Table geometry, in the table plane's own pixels. The plane is scaled to fit by the hero. */
export const TW = 1100;
export const TH = 620;
export const TILT_X = 28; // deg
export const TILT_Z = -7; // deg
const CX = TW / 2;
const CY = TH / 2;

/** Eight seats on the rail of a stadium-shaped table. */
const R = 287; // rail centerline radius at the rounded ends
// rounded so server and browser render identical style strings
const ends = (cx: number, deg: number) => ({ x: Math.round(cx + R * Math.cos((deg * Math.PI) / 180)), y: Math.round(CY + R * Math.sin((deg * Math.PI) / 180)) });
export const SEATS = [
  { x: 670, y: 597 },
  { x: 430, y: 597 },
  ends(310, 135),
  ends(310, 225),
  { x: 430, y: 23 },
  { x: 670, y: 23 },
  ends(790, 315),
  ends(790, 45),
].map((p, i) => ({ ...p, name: `BOT-${String(i + 1).padStart(2, "0")}` }));

/** Point `t` of the way from a seat toward the table center. */
export const toward = (i: number, t: number, side = 0) => {
  const s = SEATS[i];
  const dx = CX - s.x;
  const dy = CY - s.y;
  const len = Math.hypot(dx, dy);
  return { x: Math.round(s.x + dx * t + (-dy / len) * side), y: Math.round(s.y + dy * t + (dx / len) * side) };
};

export const BOARD = [-2, -1, 0, 1, 2].map((k) => ({ x: CX + k * 76, y: CY - 26 }));
export const POT = { x: CX, y: CY + 86 };
export const DEALER_SEAT = 3;

export type Hand = {
  id: number;
  holes: string[][];
  board: string[];
  /** seats still in at showdown */
  live: [number, number];
  winner: number;
  /** two seats that put in blinds/bets during the hand */
  bettors: number[];
};

export function newHand(id: number): Hand {
  const deck = shuffled();
  const holes = SEATS.map(() => [deck.pop()!, deck.pop()!]);
  const board = [deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!];
  const pick = shuffled().map((c) => c % 8);
  const a = pick[0];
  const b = pick.find((x) => x !== a)!;
  const sa = score([...holes[a], ...board]);
  const sb = score([...holes[b], ...board]);
  return {
    id,
    holes: holes.map((h) => h.map(label)),
    board: board.map(label),
    live: [a, b],
    winner: sa >= sb ? a : b,
    bettors: [a, b],
  };
}

export const DECISIONS = ["raises 240", "calls 120", "checks", "raises 480", "folds", "bets 160", "re-raises 720", "calls 240"];
export function fakeDecision(name: string) {
  const d = DECISIONS[(Math.random() * DECISIONS.length) | 0];
  const ev = (Math.random() * 0.8 - 0.25).toFixed(2);
  return `${name} ${d} · EV ${Number(ev) >= 0 ? "+" : ""}${ev}`;
}
