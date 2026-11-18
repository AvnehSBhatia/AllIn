"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";
import { Dither } from "@/components/motion/Dither";

/**
 * The frame holds still while you scroll; each line arrives in a few hard steps, like stop-motion.
 * .mf-stick is CSS-sticky inside a tall .mf section, only on large screens with motion allowed.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const m = config.manifesto;
  const [l1, l2] = m.lead.split(/(?<=\.)\s+/);

  useGSAP(
    () => {
      const frames = gsap.utils.toArray<HTMLElement>(".mf-frame", ref.current);
      const counter = ref.current!.querySelector<HTMLElement>(".mf-count")!;
      const mm = gsap.matchMedia();
      const show = (el: HTMLElement) => ({ autoAlpha: 0, y: el.classList.contains("mf-turn") ? 0 : 36, clipPath: el.classList.contains("mf-turn") ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)" });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 640px)", () => {
        // CSS sticky holds the frame (globals.css); scroll only decides how many frames are up.
        // Each frame plays its own short stepped tween, so a mis-measured trigger can never leave the screen blank.
        const tweens = frames.map((el) => gsap.from(el, { ...show(el), ease: "steps(5)", duration: 0.45, paused: true }));
        let shown = -1;
        const set = (p: number) => {
          const n = Math.min(frames.length, 1 + Math.floor(p * frames.length * 1.15)); // first frame is up on arrival
          if (n === shown) return;
          shown = n;
          tweens.forEach((t, i) => (i < n ? t.play() : t.reverse()));
          counter.textContent = String(n).padStart(2, "0");
        };
        ScrollTrigger.create({ trigger: ref.current, start: "top 60%", end: "bottom bottom", onUpdate: (s) => set(s.progress), onRefresh: (s) => set(s.progress) });
      });
      mm.add("(prefers-reduced-motion: no-preference) and ((max-width: 1023px) or (max-height: 639px))", () => {
        counter.textContent = String(frames.length).padStart(2, "0");
        frames.forEach((el) => gsap.from(el, { ...show(el), ease: "steps(4)", duration: 0.5, scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="Why poker" className="mf relative">
      <div className="mf-stick relative flex items-center overflow-hidden px-5 py-28 md:px-10 lg:py-16">
        {/* the stopped background: one frozen frame of the dither from the section above */}
        <Dither still className="pointer-events-none absolute inset-0 h-full w-full opacity-25 [mask-image:radial-gradient(70%_60%_at_80%_50%,#000,transparent)]" />

        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <p className="label mb-8 text-text-3">Why poker, and why not plain Hold&apos;em</p>
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

        <p aria-hidden className="absolute right-5 bottom-6 font-mono text-[11px] tracking-[0.18em] text-text-3 uppercase md:right-10">
          Frame <span className="mf-count">06</span> / 06
        </p>
      </div>
    </section>
  );
}
