import type { SuitKey } from "@/lib/poker";

/** Hand-drawn suit marks (24×24). Also used as Path2D on canvas. */
export const SUIT_PATHS: Record<SuitKey, string> = {
  s: "M12 1.6c2.7 4.4 10.4 8 10.4 13 0 3-2.3 5-4.8 5-1.8 0-3.4-.9-4.4-2.3.3 2.2 1.2 3.7 2.8 5.1H8c1.6-1.4 2.5-2.9 2.8-5.1-1 1.4-2.6 2.3-4.4 2.3-2.5 0-4.8-2-4.8-5 0-5 7.7-8.6 10.4-13z",
  h: "M12 21.8C5 16.4 1.6 12.7 1.6 8.4c0-3.2 2.5-5.6 5.4-5.6 2.1 0 3.9 1.2 5 3 1.1-1.8 2.9-3 5-3 2.9 0 5.4 2.4 5.4 5.6 0 4.3-3.4 8-10.4 13.4z",
  d: "M12 1.4c2.3 4 5.2 7.4 8.6 10.6-3.4 3.2-6.3 6.6-8.6 10.6-2.3-4-5.2-7.4-8.6-10.6C6.8 8.8 9.7 5.4 12 1.4z",
  c: "M12 1.9a4.7 4.7 0 0 1 3.9 7.3 4.7 4.7 0 1 1-2.6 7.4c.3 2.5 1.3 4.3 3.1 5.8H7.6c1.8-1.5 2.8-3.3 3.1-5.8a4.7 4.7 0 1 1-2.6-7.4A4.7 4.7 0 0 1 12 1.9z",
};

export const isRed = (s: SuitKey) => s === "h" || s === "d";
export const SUIT_NAME: Record<SuitKey, string> = { s: "spades", h: "hearts", d: "diamonds", c: "clubs" };

/** Map the glyphs used in config (♠♥♦♣) to keys, so text never renders as emoji. */
export const GLYPH: Record<string, SuitKey> = { "♠": "s", "♥": "h", "♦": "d", "♣": "c" };

export function Suit({ s, className, title }: { s: SuitKey; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title && <title>{title}</title>}
      <path d={SUIT_PATHS[s]} />
    </svg>
  );
}
