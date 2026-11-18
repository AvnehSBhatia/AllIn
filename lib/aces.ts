/** Hidden-aces puzzle state, persisted in localStorage. */
export const SUITS = ["spades", "hearts", "diamonds", "clubs"] as const;
export type Suit = (typeof SUITS)[number];

const KEY = "allin-aces";
const subs = new Set<() => void>();
let found: Suit[] = [];
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(v)) found = v.filter((s): s is Suit => SUITS.includes(s));
  } catch {}
}

const EMPTY: Suit[] = [];
export const aces = {
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => void subs.delete(fn);
  },
  get() {
    load();
    return found;
  },
  server: () => EMPTY,
  find(s: Suit) {
    load();
    if (found.includes(s)) return;
    found = [...found, s];
    try {
      localStorage.setItem(KEY, JSON.stringify(found));
    } catch {}
    subs.forEach((f) => f());
  },
  reset() {
    found = [];
    try {
      localStorage.removeItem(KEY);
    } catch {}
    subs.forEach((f) => f());
  },
};
