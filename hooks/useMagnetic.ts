import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { dur, ease } from "@/lib/motion";

/** Pulls an element toward the pointer while it's near. Fine pointers only, off for reduced motion. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.3, reach = 24) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: dur.md, ease: ease.out });
    const y = gsap.quickTo(el, "y", { duration: dur.md, ease: ease.out });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const near = Math.abs(e.clientX - cx) < r.width / 2 + reach && Math.abs(e.clientY - cy) < r.height / 2 + reach;
      x(near ? (e.clientX - cx) * strength : 0);
      y(near ? (e.clientY - cy) * strength : 0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength, reach]);
}
