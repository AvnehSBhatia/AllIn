"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";
import { PlayingCard } from "@/components/ui/PlayingCard";

/** Criteria as a hand-rankings card: each row deals its five cards as it arrives. */
export function Judging() {
  const ref = useRef<HTMLElement>(null);
  const j = config.judging;
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(".jd-row", ref.current).forEach((row) => {
        gsap.from(row.querySelectorAll(".jd-card"), {
          x: -60,
          y: -30,
          rotate: -20,
          opacity: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: row, start: "top 78%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="judging" aria-labelledby="judging-title" className="relative px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <p className="label text-text-3">Judging</p>
            <h2 id="judging-title" className="h2 mt-5 max-w-[13ch]">
              The chips are one of four things we count.
            </h2>
          </div>
          <p className="lede">{j.intro}</p>
        </div>

        <ol className="mt-16 border-t border-hair">
          {j.criteria.map((c) => (
            <li key={c.title} className="jd-row grid gap-6 border-b border-hair-soft py-8 md:grid-cols-[auto_minmax(0,1fr)_7rem] md:items-center md:gap-12 md:py-10">
              <div className="flex [--w:clamp(42px,5vw,60px)]" aria-hidden>
                {c.cards.map((code, k) => (
                  <PlayingCard key={code} code={code} className="jd-card -ml-3 first:ml-0" style={{ rotate: `${(k - 2) * 3}deg`, translate: `0 ${Math.abs(k - 2) * 3}px` }} />
                ))}
              </div>
              <div className="max-w-[48ch]">
                <p className="label text-text-3">{c.hand}</p>
                <h3 className="h3 mt-2 text-ivory">{c.title}</h3>
                <p className="mt-3 text-text-2">{c.body}</p>
              </div>
              <div className="flex items-center gap-3 md:justify-end">
                <span aria-hidden className="cchip [--c:var(--chip-black)] [--d:34px] [--s:var(--hair-soft)]" />
                <span className="font-mono text-xs tracking-[0.14em] text-text-3">
                  <span className="sr-only">Weight </span>TBA
                </span>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 font-mono text-xs text-text-3">{j.note}</p>
      </div>
    </section>
  );
}
