"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Suit } from "@/components/ui/Suit";
import type { SuitKey } from "@/lib/poker";

/** A felt panel wipes across between sections, a suit riding in the middle. Scrubbed by scroll. */
export function SuitWipe({ s, flip = false }: { s: SuitKey; flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const from = flip ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
      const to = flip ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } })
        .fromTo(".wipe-panel", { clipPath: from }, { clipPath: "inset(0 0% 0 0%)", ease: "none" })
        .fromTo(".wipe-suit", { scale: 0.4, rotate: flip ? 40 : -40 }, { scale: 1, rotate: 0, ease: "none" }, 0)
        .to(".wipe-panel", { clipPath: to, ease: "none" })
        .to(".wipe-suit", { scale: 0.4, rotate: flip ? -40 : 40, ease: "none" }, "<");
    },
    { scope: ref },
  );
  return (
    <div ref={ref} aria-hidden className="relative h-[22vh] min-h-32 md:h-[34vh]">
      <div className="wipe-panel felt absolute inset-x-0 inset-y-[18%] grid place-items-center border-x-0 [clip-path:inset(0_0_0_0)]">
        <Suit s={s} className="wipe-suit h-10 w-10 text-gold md:h-14 md:w-14" />
      </div>
    </div>
  );
}
