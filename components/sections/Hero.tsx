"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { config } from "@/lib/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroTable, type TableHandle } from "@/components/hero/HeroTable";
import { Dither } from "@/components/motion/Dither";
import { TH, TILT_X, TILT_Z, TW } from "@/components/hero/table";

const FACTS = [
  ["When", config.date ? new Date(config.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }) : config.dateWindow],
  ["Where", config.venueCity ?? "TBA"],
  ["Teams", `Up to ${config.teamSize}`],
  ["Seats", `~${config.capacity}`],
] as const;

/** Staggered CSS fade-up (see .rise in globals.css). */
const rise = (i: number) => ({ style: { "--i": i } as CSSProperties });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const table = useRef<TableHandle>(null);
  const log = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);

  // pause the table when the hero is off screen or the tab is hidden
  useEffect(() => {
    let onScreen = true;
    const sync = () => setPlaying(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => ((onScreen = e.isIntersecting), sync()));
    io.observe(root.current!);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // scale the 1100×620 plane to its box
  useEffect(() => {
    const el = stage.current!;
    const ro = new ResizeObserver(([e]) => el.style.setProperty("--k", String(e.contentRect.width / TW)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative isolate flex flex-col overflow-clip bg-felt-950 pb-12 lg:block lg:min-h-[max(100svh,760px)] lg:pb-0">
      {/* the dithered light, swaying slowly; quieter behind the headline */}
      <Dither className="absolute inset-0 h-full w-full opacity-80 [mask-image:linear-gradient(90deg,rgb(0_0_0/.35),#000_55%),linear-gradient(transparent,#000_15%,#000_80%,transparent)] [mask-composite:intersect]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_74%_46%,color-mix(in_oklab,var(--felt-600)_35%,transparent),transparent_70%)]" />

      {/* table: right side, bleeding off the edge. Below 1024 it sits under the text. */}
      <div
        className="relative z-[2] order-2 mx-auto mt-6 aspect-[1100/640] w-[128%] -translate-x-[11%] [perspective:1800px] max-lg:max-w-[980px] lg:absolute lg:top-1/2 lg:right-[-14%] lg:mt-0 lg:w-[68%] lg:translate-x-0 lg:-translate-y-[46%] lg:[perspective:2200px]"
        onClick={() => table.current?.allIn()}
        role="presentation"
      >
        <div {...rise(3)} className="rise absolute inset-0 [transform-style:preserve-3d]">
          <div ref={stage} className="absolute inset-0 [transform-style:preserve-3d]">
            <div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]" style={{ transform: `translate(-50%,-50%) scale(var(--k,.6)) rotateX(${TILT_X}deg) rotateZ(${TILT_Z}deg)`, width: TW, height: TH }}>
              <HeroTable ref={table} playing={playing} reduced={reduced} onLog={(l) => log.current && (log.current.textContent = l)} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[4] order-1 mx-auto flex w-full max-w-[1440px] flex-col px-5 pt-28 md:px-10 lg:min-h-[max(100svh,760px)] lg:justify-center lg:pt-24 lg:pb-16">
        <div className="lg:max-w-[45%] xl:max-w-[42%]">
          <p {...rise(0)} className="rise font-mono text-[13px] text-text-2">
            <span className="text-gold">{config.organizer.toLowerCase()}@allin</span>
            <span className="text-text-3">:~$</span> ./<span className="hidden sm:inline">the-algorithmic-</span>tournament
            <span aria-hidden className="caret ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-gold/80" />
          </p>
          <h1 id="hero-title" {...rise(1)} className="rise mt-5 font-display text-[clamp(4.4rem,16vw,6.75rem)] leading-[0.88] tracking-[-0.03em] text-ivory lg:text-[clamp(6rem,9vw,9rem)]">
            ALL <em className="not-italic lg:italic">IN</em>
          </h1>
          <p {...rise(2)} className="rise mt-6 max-w-[30ch] font-display text-[clamp(1.35rem,2vw,1.8rem)] leading-[1.2] text-ivory">
            {config.tagline}
          </p>
          <p {...rise(2)} className="rise mt-4 max-w-[40ch] text-text-2">
            An AI poker-bot competition on a variant we wrote. The rules stay sealed until kickoff.
          </p>

          <dl {...rise(3)} className="rise mt-8 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-3 border-t border-hair pt-5 sm:grid-cols-4">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="label text-text-3">{k}</dt>
                <dd className="mt-1 font-mono text-[13px] text-ivory">{v}</dd>
              </div>
            ))}
          </dl>

          <div {...rise(4)} className="rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={config.applyUrl || "#apply"} className="btn btn-gold">
              Apply for a seat
            </a>
            <a href="#game" className="link inline-flex min-h-11 items-center font-mono text-[12px] tracking-[0.14em] text-text-2 uppercase hover:text-ivory">
              Read the game
            </a>
          </div>

          <p {...rise(5)} className="rise mt-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-text-3 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
            <span ref={log} aria-live="off">Dealing hand 0001</span>
          </p>
        </div>
      </div>
    </section>
  );
}
