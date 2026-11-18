"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";

// The last two sentences carry the point; they get the one gold accent in this section.
const TURN = "So we changed the game.";

/** One paragraph, pinned on desktop, lit word by word as you scroll. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const [before, after] = config.manifesto.split(TURN);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const words = gsap.utils.toArray<HTMLElement>(".mw", ref.current);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(words, { opacity: 0.4 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top top", end: "+=140%", scrub: 0.6, pin: true } });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(words, { opacity: 0.4 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 45%", scrub: 0.6 } });
      });
    },
    { scope: ref },
  );

  const words = (text: string, cls = "") =>
    text
      .trim()
      .split(/\s+/)
      .map((w, i) => (
        <span key={i} className={`mw ${cls}`}>
          {w}{" "}
        </span>
      ));

  return (
    <section ref={ref} aria-label="Why poker" className="relative flex min-h-[100svh] items-center px-5 py-28 md:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <p className="label mb-10 text-text-3">Why poker, and why not plain Hold&apos;em</p>
        <p className="max-w-[24ch] font-display text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.02] tracking-[-0.02em] text-ivory md:max-w-[26ch]">
          {words(before)}
          {words(TURN, "italic text-gold-bright")}
          {words(after)}
        </p>
      </div>
    </section>
  );
}
