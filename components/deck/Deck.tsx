"use client";
import { useEffect } from "react";
import { animate, utils } from "animejs";

/** anime.js takes (target, index) => value anywhere a value goes; its types are narrower than that */
const per = <T,>(f: (k: number) => T) => ((_: unknown, k: number) => f(k)) as unknown as T;

/** "12vw -16vh" -> ["12vw", "-16vh"]; "" -> a short rise */
const vec = (v: string) => {
  const [x, y] = v.trim().split(/\s+/);
  return x ? [x, y ?? "0px"] : ["0px", "18px"];
};

/**
 * Page behaviour that isn't scrolling (the page scrolls natively; only the hero's way in holds it, see Hero.tsx):
 *  - a section's entrance plays once when it arrives, in order: label, headline, line, then the rest (anime.js)
 *  - left / right arrow keys step one section back or forward
 *  - things lying on the table drift, and shift a little with the pointer
 */
export function Deck({ ids }: { ids: string[] }) {
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let at = 0;

    const enter = (sec: HTMLElement) => {
      const cs = (el: Element, v: string) => getComputedStyle(el).getPropertyValue(v);
      const step = (el: Element) => (parseFloat(cs(el, "--i")) || 0) * 55;
      // every .a comes in along its own vector, in its own turn
      const items = [...sec.querySelectorAll<HTMLElement>(".a")];
      const from = items.map((el) => ({ v: vec(cs(el, "--from")), spin: cs(el, "--spin").trim() || "0deg", d: step(el) }));
      const words = [...sec.querySelectorAll<HTMLElement>(".h2 .w > span")];
      utils.set(items, { opacity: 0, translateX: per((k) => from[k].v[0]), translateY: per((k) => from[k].v[1]), rotate: per((k) => from[k].spin) });
      utils.set(words, { translateY: "115%" });
      sec.setAttribute("data-in", "");
      animate(items, { translateX: 0, translateY: 0, rotate: 0, duration: 900, ease: "outCubic", delay: per((k) => from[k].d) });
      animate(items, { opacity: 1, duration: 450, ease: "outQuad", delay: per((k) => from[k].d) });
      // headline: word by word out of the mask
      animate(words, { translateY: "0%", duration: 850, ease: "outCubic", delay: per((k) => 80 + k * 70) });
      // figures count up
      sec.querySelectorAll<HTMLElement>("[data-count]").forEach((el, k) => {
        const to = Number(el.dataset.count);
        const n = { v: 0 };
        animate(n, { v: to, duration: 1300, delay: 1150 + k * 160, ease: "outExpo", onUpdate: () => (el.textContent = "$" + Math.round(n.v).toLocaleString("en-US")) });
      });
      // once they have landed, the props drift a little, each on its own clock
      sec.querySelectorAll<HTMLElement>(".prop").forEach((el, k) => {
        animate(el.firstElementChild!, { translateY: [0, k % 2 ? 6 : -6], duration: 4200 + k * 700, delay: 1800 + k * 150, ease: "inOutSine", loop: true, alternate: true });
      });
    };

    let stopArrive = () => {};
    if (!reduced) {
      document.documentElement.classList.add("deck-ready");
      // arrive: the section's top has come a quarter of the way up the screen
      const arrive = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            arrive.unobserve(e.target);
            enter(e.target as HTMLElement);
          }),
        { rootMargin: "0px 0px -25% 0px" },
      );
      els.forEach((el) => arrive.observe(el));
      stopArrive = () => arrive.disconnect();
    }
    // current: whichever section covers the middle of the screen
    const current = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (at = els.indexOf(e.target as HTMLElement))), { rootMargin: "-50% 0px -50% 0px" });
    els.forEach((el) => current.observe(el));

    const key = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if ((e.target as Element).closest?.("input, textarea, select, [contenteditable]")) return;
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      const next = els[at + dir];
      if (!dir || !next) return;
      e.preventDefault();
      next.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    };
    addEventListener("keydown", key);

    // pointer parallax, fine pointers only
    let raf = 0;
    let mx = 0;
    let my = 0;
    const paint = () => {
      raf = 0;
      const props = els[at]?.querySelector<HTMLElement>(".props");
      props?.style.setProperty("--mx", mx.toFixed(3));
      props?.style.setProperty("--my", my.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
      raf ||= requestAnimationFrame(paint);
    };
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced;
    if (fine) addEventListener("pointermove", move, { passive: true });

    return () => {
      stopArrive();
      current.disconnect();
      removeEventListener("keydown", key);
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      els.forEach((el) => utils.remove(el.querySelectorAll(".a, .h2 .w > span")));
    };
  }, [ids]);
  return null;
}
