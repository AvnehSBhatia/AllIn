"use client";
import { useRef } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%";

/** Text that scrambles then resolves on hover. Screen readers get the plain text. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const run = () => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const total = 380;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      el.textContent = [...text]
        .map((ch, i) => (ch === " " || i / text.length < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join("");
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  return (
    <span className={className} onPointerEnter={run} onFocus={run}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden>
        {text}
      </span>
    </span>
  );
}
