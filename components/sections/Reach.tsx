"use client";
import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";
import { Dither } from "@/components/motion/Dither";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Globe } from "@/components/reach/Globe";

const FACTS = [
  ["Who", "Undergrads and researchers"],
  ["Seats", `About ${config.capacity}, reviewed`],
  ["City", config.venueCity ?? "TBA"],
] as const;

/** ExeaLabs' open call: a dithered gradient band, the heading, then a globe you can spin. Ends on a glitch cut. */
export function Reach() {
  const ref = useRef<HTMLElement>(null);
  const r = config.reach;

  // the glitch fires once each time the line scrolls in
  useGSAP(
    () => {
      const el = ref.current!.querySelector<HTMLElement>(".glitch")!;
      const fire = () => {
        el.classList.remove("is-on");
        void el.offsetWidth;
        el.classList.add("is-on");
      };
      ScrollTrigger.create({ trigger: el, start: "top 80%", onEnter: fire, onEnterBack: fire });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="reach" aria-labelledby="reach-title" className="relative overflow-x-clip">
      <div className="relative flex min-h-[min(78svh,680px)] items-end px-5 pb-14 md:px-10 md:pb-20">
        <Dither className="absolute inset-0 h-full w-full opacity-60 [mask-image:linear-gradient(transparent,#000_25%,#000_70%,transparent)]" />
        {/* keep the heading on quiet ground */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_18%_78%,var(--felt-950)_10%,transparent_75%)] opacity-90" />
        <div className="relative mx-auto w-full max-w-[1440px]">
          <p className="label text-text-2">{r.label}</p>
          <SplitHeading id="reach-title" className="mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,5.8vw,5.5rem)] leading-[1] tracking-[-0.025em] text-ivory">
            {r.heading}
          </SplitHeading>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 pb-24 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pb-32">
        <div className="max-w-[30rem]">
          <p className="text-lg leading-relaxed text-text-2">{r.body}</p>
          <dl className="mt-10 border-t border-hair-soft">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-hair-soft py-3">
                <dt className="label text-text-3">{k}</dt>
                <dd className="font-mono text-[13px] text-ivory">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="relative mx-auto w-full max-w-[680px]">
          <Globe />
          <figcaption className="mt-3 text-center font-mono text-[11px] tracking-[0.18em] text-text-3 uppercase">Drag to spin</figcaption>
        </figure>
      </div>

      <div className="border-y border-hair-soft px-5 py-14 md:px-10 md:py-20">
        <p className="glitch mx-auto max-w-[1440px] font-display text-[clamp(2.2rem,6vw,5.5rem)] leading-[1.05] tracking-[-0.025em] text-ivory" data-text={r.glitch}>
          {r.glitch}
        </p>
      </div>
    </section>
  );
}
