import type { CSSProperties } from "react";
import { GLYPH, Suit, isRed } from "./Suit";
import type { SuitKey } from "@/lib/poker";

const RANK_LABEL: Record<string, string> = { T: "10" };

/** code like "As", "Td" or "A♠". Width via `w` (px) or the --w CSS var. */
export function PlayingCard({
  code,
  down = false,
  w,
  className = "",
  style,
}: {
  code?: string;
  down?: boolean;
  w?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const rank = code?.[0] ?? "A";
  const s = ((code && (GLYPH[code[1]] ?? code[1])) || "s") as SuitKey;
  const r = RANK_LABEL[rank] ?? rank;
  const face = "JQK".includes(rank) ? rank : null;
  return (
    <div className={`pc ${className}`} data-down={down || undefined} style={{ ...(w ? { "--w": `${w}px` } : {}), ...style } as CSSProperties} aria-hidden>
      <div className="pc-face pc-front" data-red={isRed(s) || undefined}>
        <span className="pc-idx tl">
          {r}
          <Suit s={s} />
        </span>
        <span className="pc-pip">{face ? <span className="face">{face}</span> : <Suit s={s} />}</span>
        <span className="pc-idx br">
          {r}
          <Suit s={s} />
        </span>
      </div>
      <div className="pc-face pc-back" />
    </div>
  );
}
