"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";

const FLAP = "0123456789";

/** Tote board. Each tile rattles through digits like a split-flap, then lands. */
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tiles = gsap.utils.toArray<HTMLElement>(".tote-tile", ref.current);
      tiles.forEach((tile, i) => {
        const real = tile.dataset.v ?? "";
        const state = { n: 0 };
        gsap.to(state, {
          n: 12 + i * 3,
          duration: 0.7 + i * 0.05,
          ease: "power2.out",
          snap: "n",
          scrollTrigger: { trigger: tile, start: "top 88%", once: true },
          onUpdate: () => {
            tile.textContent = /\d/.test(real) ? FLAP[Math.floor(state.n * 7 + i) % 10] : real;
          },
          onComplete: () => {
            tile.textContent = real;
          },
        });
      });
      // A tween killed mid-rattle (remount, HMR) must not leave a wrong digit behind.
      return () => tiles.forEach((t) => (t.textContent = t.dataset.v ?? ""));
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="The numbers" className="relative px-5 py-20 md:px-10">
      <dl className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-12 md:flex md:items-end md:justify-between">
        {config.stats.map((s) => {
          const v = s.value === Infinity ? "∞" : String(s.value);
          return (
            <div key={s.label} className="flex flex-col gap-3">
              <dt className="order-2 label text-text-3">{s.label}</dt>
              <dd className="order-1 flex items-center gap-1 font-mono text-[clamp(2.4rem,6vw,4.6rem)] leading-none text-ivory">
                {s.prefix && <span className="mr-1 text-text-3">{s.prefix}</span>}
                {v.split("").map((d, i) => (
                  <span key={i} data-v={d} className="tote-tile relative inline-grid min-w-[1.1ch] place-items-center rounded-[4px] bg-ink px-[0.12em] py-[0.1em] tabular-nums shadow-[inset_0_-1px_0_rgb(255_255_255/.06)] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-felt-950">
                    {d}
                  </span>
                ))}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
