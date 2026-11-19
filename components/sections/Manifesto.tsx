"use client";
import { useRef, type CSSProperties } from "react";
import { config } from "@/lib/config";
import { Dither } from "@/components/motion/Dither";
import { Globe } from "@/components/reach/Globe";
import { Stepper } from "@/components/ui/Stepper";
import { useStepper } from "@/hooks/useStepper";

const FACTS = [
  ["Who", "High schoolers and researchers"],
  ["Seats", `About ${config.capacity}, reviewed`],
  ["City", config.venueCity ?? "TBA"],
] as const;
const SLIDES = ["The open call", "The cut", "Why poker", "So we changed the game"];

/** a frame inside a slide; --f staggers its stop-motion entrance */
const f = (n: number) => ({ style: { "--f": n } as CSSProperties });

/**
 * One stop-motion reel straight after the hero: ExeaLabs + globe, a glitch cut, then why poker.
 * Sideways, not scroll-jacked: ← / → (or swipe, or the buttons) moves one slide; the page scrolls normally.
 * All slides share one grid cell, so the reel is as tall as its tallest slide and nothing jumps. CSS: globals.css (.mf).
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { i, go } = useStepper(ref, SLIDES.length);
  const r = config.reach;
  const m = config.manifesto;
  const [l1, l2] = m.lead.split(/(?<=\.)\s+/);
  const state = (n: number) => (n < i ? "past" : n === i ? "on" : "next");
  const slide = (n: number) => ({ "data-state": state(n), "aria-hidden": n !== i, inert: n !== i, "aria-roledescription": "slide", "aria-label": `${n + 1} of ${SLIDES.length}: ${SLIDES[n]}` });

  return (
    <section ref={ref} id="reach" aria-roledescription="carousel" aria-label="ExeaLabs, and why poker" className="mf relative overflow-hidden">
      <Dither seed={1} className="absolute inset-0 h-full w-full opacity-50 [mask-image:radial-gradient(70%_60%_at_80%_50%,#000,transparent)]" />

      <div className="mf-track relative px-5 pt-16 md:px-10 lg:pt-24">
        {/* 1: the open call */}
        <div className="mf-slide" {...slide(0)}>
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-6 md:gap-10 lg:grid-cols-2 lg:gap-16 land:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] land:gap-8">
            <figure {...f(1)} className="mf-frame mf-pop relative order-last mx-auto w-full max-w-[min(300px,100%)] sm:max-w-[min(420px,100%)] lg:max-w-[min(540px,62svh)] land:order-first land:max-w-[min(300px,62svh)]" data-noswipe>
              <p className="mb-3 flex items-center justify-center gap-3 font-display text-[clamp(1.4rem,2.4vw,2.2rem)] leading-none text-ivory land:hidden">
                <span aria-hidden className="relative grid size-8 place-items-center">
                  <span className="absolute bottom-0.5 size-3 rounded-full bg-gold-bright/50 motion-safe:animate-ping" />
                  <svg viewBox="0 0 24 24" className="relative size-7 fill-gold-bright drop-shadow-[0_0_8px_var(--gold-bright)]">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                </span>
                ExeaLabs coverage
              </p>
              <Globe />
              <figcaption className="mt-2 text-center font-mono text-[12px] text-text-3">
                <span className="text-gold">$</span> drag to spin
              </figcaption>
            </figure>
            <div className="max-w-[36rem]">
              <p {...f(0)} className="mf-frame eyebrow">{r.label}</p>
              <h2 {...f(1)} className="mf-frame mt-4 max-w-[14ch] font-display text-[clamp(2.4rem,5vw,4.8rem)] leading-[1] tracking-[-0.025em] text-ivory land:text-[2.4rem]">
                {r.heading}
              </h2>
              <p {...f(2)} className="mf-frame mt-5 text-lg leading-relaxed text-text-2 land:mt-3 land:text-base">{r.body}</p>
              <dl {...f(3)} className="mf-frame mt-6 hidden border-t border-hair-soft lg:block">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 border-b border-hair-soft py-2.5">
                    <dt className="label text-text-3">{k}</dt>
                    <dd className="font-mono text-[13px] text-ivory">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* 2: the cut */}
        <div className="mf-slide mf-mid" {...slide(1)}>
          <p className="mf-frame glitch mx-auto w-full max-w-[1440px] font-display text-[clamp(3rem,9vw,8rem)] leading-[1.02] tracking-[-0.025em] text-ivory" data-text={r.glitch}>
            {r.glitch}
          </p>
        </div>

        {/* 3: why poker */}
        <div className="mf-slide" {...slide(2)}>
          <div className="mx-auto w-full max-w-[1440px]">
            <p {...f(0)} className="mf-frame eyebrow mb-6">Why poker</p>
            <p className="max-w-[20ch] font-display text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.06] tracking-[-0.02em] text-ivory land:text-[2.2rem]">
              <span {...f(1)} className="mf-frame block">{l1}</span>
              <span {...f(3)} className="mf-frame block text-gold-bright">{l2}</span>
            </p>
            <p {...f(5)} className="mf-frame mt-6 max-w-[32rem] text-lg text-text-2">{m.body[0]}</p>
          </div>
        </div>

        {/* 4: the turn */}
        <div className="mf-slide" {...slide(3)}>
          <div className="mx-auto w-full max-w-[1440px]">
            <p {...f(0)} className="mf-frame max-w-[32rem] text-lg text-text-2">{m.body[1]}</p>
            <p {...f(2)} className="mf-frame mf-turn mt-5 font-display text-[clamp(2.6rem,6vw,5.6rem)] leading-[1] tracking-[-0.02em] text-gold-bright italic">
              {m.turn}
            </p>
            <p {...f(4)} className="mf-frame mt-6 max-w-[30rem] text-lg text-ivory">{m.close}</p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 pt-8 pb-12 md:px-10 lg:pb-16 land:pt-4 land:pb-6">
        <Stepper i={i} count={SLIDES.length} go={go} label={(n) => `Slide ${n + 1}: ${SLIDES[n]}`} className="border-t border-hair-soft pt-4" />
      </div>
    </section>
  );
}
