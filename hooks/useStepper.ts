import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** must match the pinned-mode media query in globals.css (.mf / .clk) */
export const PIN_Q = "(prefers-reduced-motion: no-preference) and (min-height: 560px)";
const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * Steps a section through `count` frames, three ways at once:
 * - scroll: where the screen is tall enough, the [data-stick] stage pins and scrolling advances one frame at a time;
 * - ← / → while the section holds the middle of the screen (or has focus);
 * - a sideways swipe, or the Stepper buttons.
 * When pinned, keys/swipes/buttons scroll the page to that frame, so scroll position and frame never disagree.
 * Swipes that start inside [data-noswipe] (the globe) are left alone.
 */
export function useStepper(ref: RefObject<HTMLElement | null>, count: number) {
  const [i, setI] = useState(0);
  const pinned = useRef(false);
  const cur = useRef(0);
  useEffect(() => {
    cur.current = i;
  }, [i]);
  const clamp = useCallback((n: number) => Math.max(0, Math.min(count - 1, n)), [count]);

  const go = useCallback(
    (n: number) => {
      n = clamp(n);
      const el = ref.current;
      const stick = el?.querySelector<HTMLElement>("[data-stick]");
      if (!el || !stick || !pinned.current) return setI(n);
      // scroll to the middle of that frame's stretch; the scroll handler then sets the frame
      const r = el.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stick).top) || 0;
      scrollTo({ top: scrollY + r.top - top + ((n + 0.5) / count) * (r.height - stick.offsetHeight), behavior: "smooth" });
    },
    [ref, count, clamp],
  );

  useEffect(() => {
    const el = ref.current!;
    const stick = el.querySelector<HTMLElement>("[data-stick]");
    const mq = matchMedia(PIN_Q);
    let raf = 0;
    const onScroll = () => {
      raf = 0;
      pinned.current = !!stick && mq.matches;
      if (!pinned.current) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (stick!.getBoundingClientRect().top - r.top) / Math.max(1, r.height - stick!.offsetHeight);
      setI(clamp(Math.floor(Math.max(0, p) * count)));
    };
    const queue = () => (raf ||= requestAnimationFrame(onScroll));
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
      go(cur.current + d);
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
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) go(cur.current + (dx < 0 ? 1 : -1));
    };
    onScroll();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    mq.addEventListener("change", queue);
    addEventListener("keydown", key);
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      mq.removeEventListener("change", queue);
      removeEventListener("keydown", key);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, [ref, count, clamp, go]);

  return { i, go };
}
