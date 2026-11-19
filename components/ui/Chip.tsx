import type { CSSProperties } from "react";
import { SUIT_PATHS } from "./Suit";

export const CHIP_COLORS = {
  red: { base: "var(--chip-red)", stripe: "var(--chip-white)" },
  blue: { base: "var(--chip-blue)", stripe: "var(--chip-white)" },
  black: { base: "var(--chip-black)", stripe: "var(--gold)" },
  white: { base: "var(--chip-white)", stripe: "var(--chip-red)" },
  gold: { base: "#a8802f", stripe: "var(--ivory)" },
} as const;
export type ChipColor = keyof typeof CHIP_COLORS;

/** Top-down chip face. */
export function Chip({ color = "black", className, mark = true, style }: { color?: ChipColor; className?: string; mark?: boolean; style?: CSSProperties }) {
  const { base, stripe } = CHIP_COLORS[color];
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <circle cx="50" cy="50" r="49" fill={base} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x="45" y="1.5" width="10" height="15" rx="1.5" fill={stripe} transform={`rotate(${i * 45} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="33" fill="none" stroke={stripe} strokeOpacity=".7" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="29" fill={base} stroke="var(--gold)" strokeOpacity=".75" strokeWidth="1" />
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="var(--gold)" strokeOpacity=".6" strokeWidth="1" />
      {mark && (
        <path d={SUIT_PATHS.s} transform="translate(38 37)" fill={stripe} opacity=".9" />
      )}
    </svg>
  );
}
