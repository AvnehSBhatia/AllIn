import type Lenis from "lenis";

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Smooth-scroll to a "#id" or element. Falls back to native when Lenis is off (reduced motion). */
export function scrollToTarget(target: string | HTMLElement, opts: { immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.2, immediate: opts.immediate });
  else el.scrollIntoView({ behavior: opts.immediate ? "auto" : "smooth" });
}
