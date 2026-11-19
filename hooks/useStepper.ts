import { useCallback, useEffect, useState, type RefObject } from "react";

const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * Sideways stepping instead of scroll-jacking: ← / → while the section holds the middle of the screen
 * (or has focus), and a horizontal swipe on touch screens. Vertical scrolling stays native.
 * Swipes that start inside [data-noswipe] (the globe) are left alone.
 */
export function useStepper(ref: RefObject<HTMLElement | null>, count: number) {
  const [i, setI] = useState(0);
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(count - 1, n))), [count]);
  const step = useCallback((d: number) => setI((x) => Math.max(0, Math.min(count - 1, x + d))), [count]);

  useEffect(() => {
    const el = ref.current!;
    const inPlay = () => {
      if (el.contains(document.activeElement)) return true;
      const r = el.getBoundingClientRect();
      return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
    };
    const key = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || typing(e.target)) return;
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d || !inPlay()) return;
      e.preventDefault();
      step(d);
    };
    let x0 = 0, y0 = 0, on = false;
    const start = (e: TouchEvent) => {
      on = e.touches.length === 1 && !(e.target as Element).closest?.("[data-noswipe]");
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      if (!on) return;
      on = false;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
    };
    addEventListener("keydown", key);
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => (removeEventListener("keydown", key), el.removeEventListener("touchstart", start), el.removeEventListener("touchend", end));
  }, [ref, step]);

  return { i, go, step };
}
