"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Suit } from "@/components/ui/Suit";
import type { SuitKey } from "@/lib/poker";

const SUITS: SuitKey[] = ["s", "h", "d", "c"];

/** Infinite ticker that speeds up with scroll velocity and follows scroll direction. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const loop = gsap.to(".mq-track", { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
      let dir = 1;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
        onUpdate: (self) => {
          dir = self.direction;
          const boost = Math.min(7, 1 + Math.abs(self.getVelocity()) / 260);
          gsap.timeline({ overwrite: true })
            .to(loop, { timeScale: dir * boost, duration: 0.15 })
            .to(loop, { timeScale: dir, duration: 1.1, ease: "expo.out" });
        },
      });
    },
    { scope: ref },
  );
  const row = items.map((t, i) => (
    <span key={i} className="flex items-center gap-8 pr-8">
      <span>{t}</span>
      <Suit s={SUITS[i % 4]} className="h-3.5 w-3.5 text-gold/80" />
    </span>
  ));
  return (
    <div ref={ref} className={`overflow-clip border-y border-hair py-4 ${className}`} aria-label={items.join(", ")} role="marquee">
      <div className="mq-track label flex w-max whitespace-nowrap text-text-2" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
