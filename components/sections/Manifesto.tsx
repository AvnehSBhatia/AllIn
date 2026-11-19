"use client";
import { useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { Dither } from "@/components/motion/Dither";
import { Globe } from "@/components/reach/Globe";

const FACTS = [
  ["Who", "High schoolers and researchers"],
  ["Seats", `About ${config.capacity}, reviewed`],
  ["City", config.venueCity ?? "TBA"],
] as const;

/**
 * One stop-motion reel straight after the hero: ExeaLabs + globe, a glitch cut, then why poker.
 * Large screens: the stage sticks and scroll advances one frame at a time; scenes swap when their first frame lands.
 * Small screens: scenes stack and each frame steps in as it reaches the screen. CSS (globals.css, .mf) does the stepping; this only flips attributes.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const r = config.reach;
  const m = config.manifesto;
  const [l1, l2] = m.lead.split(/(?<=\.)\s+/);

  useEffect(() => {
    const sec = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scenes = [...sec.querySelectorAll<HTMLElement>(".mf-scene")];
    const frames = [...sec.querySelectorAll<HTMLElement>(".mf-frame")];
    const owner = frames.map((f) => scenes.indexOf(f.closest(".mf-scene")!));
    const glitch = sec.querySelector<HTMLElement>(".glitch")!;
    const count = sec.querySelector<HTMLElement>(".mf-count")!;
    const beats = frames.flatMap((_, i) => (owner[i + 1] === owner[i] ? [i] : [i, i])); // last frame of a scene holds one extra beat
    const sticky = matchMedia("(min-width: 1024px) and (min-height: 700px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      const b = sec.getBoundingClientRect();
      let n: number;
      if (sticky.matches) {
        const p = Math.max(0, (vh * 0.5 - b.top) / (b.height - vh * 0.5));
        n = 1 + beats[Math.min(beats.length - 1, Math.floor(p * beats.length * 1.05))];
      } else n = frames.filter((f) => f.getBoundingClientRect().top < vh * 0.88).length;
      const live = owner[Math.max(0, n - 1)];
      scenes.forEach((s, i) => (s.dataset.state = i < live ? "past" : i === live ? "on" : "off"));
      frames.forEach((f, i) => (f.dataset.on = String(i < n)));
      const g = glitch.dataset.on === "true";
      if (g && !glitch.classList.contains("is-on")) glitch.classList.add("is-on");
      if (!g) glitch.classList.remove("is-on"); // re-arms, so it cuts again every pass
      count.textContent = String(n).padStart(2, "0");
    };
    const queue = () => (raf ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => (removeEventListener("scroll", queue), removeEventListener("resize", queue), cancelAnimationFrame(raf));
  }, []);

  const total = 4 + 1 + 4 + m.body.length;
  return (
    <section ref={ref} id="reach" aria-label="ExeaLabs, and why poker" className="mf relative">
      <div className="mf-stick relative overflow-hidden">
        <Dither seed={1} className="absolute inset-0 h-full w-full opacity-50 [mask-image:radial-gradient(70%_60%_at_80%_50%,#000,transparent)]" />

        {/* scene 1: the open call */}
        <div className="mf-scene px-5 pt-20 pb-16 md:px-10 lg:pt-24" data-state="on">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
            <figure className="mf-frame mf-pop relative order-last mx-auto w-full max-w-[min(560px,100%)] lg:max-w-[min(560px,68svh)]">
              <p className="mb-4 flex items-center justify-center gap-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none text-ivory">
                <span aria-hidden className="relative grid size-8 place-items-center">
                  <span className="absolute bottom-0.5 size-3 rounded-full bg-gold-bright/50 motion-safe:animate-ping" />
                  <svg viewBox="0 0 24 24" className="relative size-7 fill-gold-bright drop-shadow-[0_0_8px_var(--gold-bright)]">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                </span>
                ExeaLabs coverage
              </p>
              <Globe />
              <figcaption className="mt-3 text-center font-mono text-[12px] text-text-3">
                <span className="text-gold">$</span> drag to spin
              </figcaption>
            </figure>
            <div className="max-w-[36rem]">
              <div className="mf-frame">
                <p className="eyebrow">{r.label}</p>
                <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-[1] tracking-[-0.025em] text-ivory">{r.heading}</h2>
              </div>
              <p className="mf-frame mt-6 text-lg leading-relaxed text-text-2">{r.body}</p>
              <dl className="mf-frame mt-8 border-t border-hair-soft">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 border-b border-hair-soft py-3">
                    <dt className="label text-text-3">{k}</dt>
                    <dd className="font-mono text-[13px] text-ivory">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* scene 2: the cut */}
        <div className="mf-scene border-y border-hair-soft px-5 py-12 md:px-10 lg:border-0" data-state="off">
          <p
            className="mf-frame glitch mx-auto max-w-[1440px] font-display text-[clamp(2.4rem,7vw,7rem)] leading-[1.02] tracking-[-0.025em] text-ivory"
            data-text={r.glitch}
          >
            {r.glitch}
          </p>
        </div>

        {/* scene 3: why poker */}
        <div className="mf-scene px-5 py-20 md:px-10 lg:py-16" data-state="off">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
            <div>
              <p className="eyebrow mb-8">Why poker, and why not plain Hold&apos;em</p>
              <p className="max-w-[18ch] font-display text-[clamp(2.1rem,4vw,3.8rem)] leading-[1.08] tracking-[-0.02em] text-ivory">
                <span className="mf-frame block">{l1}</span>
                <span className="mf-frame block">{l2}</span>
              </p>
            </div>
            <div className="flex max-w-[34rem] flex-col gap-5 text-lg leading-relaxed text-text-2 lg:self-end">
              {m.body.map((p) => (
                <p key={p} className="mf-frame">
                  {p}
                </p>
              ))}
              <p className="mf-frame mf-turn mt-4 font-display text-[clamp(1.75rem,2.5vw,2.3rem)] leading-tight text-gold-bright italic">{m.turn}</p>
              <p className="mf-frame text-ivory">{m.close}</p>
            </div>
          </div>
        </div>

        <p aria-hidden className="absolute right-5 bottom-6 hidden font-mono text-[12px] text-text-3 lg:block md:right-10">
          frame <span className="mf-count text-gold">{String(total).padStart(2, "0")}</span>/{String(total).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
