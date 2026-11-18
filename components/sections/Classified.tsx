"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { HiddenAce } from "@/components/ui/Aces";
import { Tilt } from "@/components/motion/Tilt";

/** The rules dossier. Redaction bars draw across on scroll; the toggle lets you peek under them. */
export function Classified() {
  const ref = useRef<HTMLElement>(null);
  const [peek, setPeek] = useState(false);
  const c = config.classified;

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".dossier", { y: 80, rotate: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".dossier", start: "top 85%", once: true } });
      gsap.from(".bar", { scaleX: 0, duration: 0.5, ease: "power3.inOut", stagger: 0.12, scrollTrigger: { trigger: ".bars", start: "top 80%", once: true } });
      gsap.from(".stamp", { scale: 2.4, opacity: 0, duration: 0.35, ease: "power4.in", scrollTrigger: { trigger: ".bars", start: "top 70%", once: true } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="game" aria-labelledby="game-title" className="relative overflow-x-clip px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div className="lg:pt-16">
          <p className="label text-text-3">The game</p>
          <SplitHeading id="game-title" className="h2 mt-5 max-w-[12ch]">
            {c.heading}
          </SplitHeading>
          {c.body.map((p) => (
            <p key={p.slice(0, 12)} className="lede mt-6">
              {p}
            </p>
          ))}
        </div>

        <Tilt max={4} className="self-start">
        <div className="dossier stock relative rotate-[1.2deg] rounded-[3px] px-6 pt-8 pb-10 md:px-12 md:pt-12 md:pb-14">
          <HiddenAce suit="hearts" rotate={9} className="absolute -top-5 right-8" />
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/25 pb-4 font-mono text-[11px] tracking-[0.12em] text-ink/70 uppercase">
            <span>File AI-01 · Rules of play</span>
            <span>Copy 1 of 1</span>
          </div>
          <p className="mt-8 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-ink">Variant specification</p>
          <p className="mt-2 max-w-[44ch] text-[15px] text-ink/75">Distributed to all seated teams at kickoff. Until then this page stays as you see it.</p>

          <ul className="bars mt-8 space-y-4 font-mono text-[13px] text-ink md:text-sm" aria-label="Rules, sealed until kickoff">
            {c.redacted.map((line) => {
              const [k, v] = line.split(/\s\.+\s/);
              return (
                <li key={line} className="flex items-center gap-3">
                  <span className="w-[7.5rem] shrink-0 text-ink/70 md:w-[11rem]">{k}</span>
                  <span className="relative min-w-0 flex-1">
                    <span className={`transition-opacity duration-300 ${peek ? "opacity-100" : "opacity-0"}`}>{v}</span>
                    <span aria-hidden className={`bar absolute inset-y-[-3px] left-0 w-full origin-left bg-ink transition-opacity duration-300 ${peek ? "opacity-15" : "opacity-100"}`} />
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <button type="button" aria-pressed={peek} onClick={() => setPeek(!peek)} className="btn min-h-11 border border-ink/30 px-4 text-ink hover:border-ink">
              {peek ? "Put the bars back" : "Peek under the bars"}
            </button>
            {peek && <p className="font-mono text-xs text-ink/70">Worth a try. Nothing under there yet.</p>}
          </div>

          <span aria-hidden className="stamp pointer-events-none absolute right-6 bottom-24 rotate-[-12deg] rounded-sm border-[3px] border-chip-red px-3 py-1 font-mono text-lg font-bold tracking-[0.2em] text-chip-red opacity-80 mix-blend-multiply md:right-12 md:text-2xl">
            SEALED
          </span>
        </div>
        </Tilt>
      </div>
    </section>
  );
}
