"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";

/** Talks and workshops. Until speakers are confirmed every chair reads "Seat open". */
export function Workshops() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".ws-plaque", { rotationX: -90, transformOrigin: "50% 0%", duration: 0.6, ease: "back.out(1.4)", stagger: 0.09, scrollTrigger: { trigger: ".ws-list", start: "top 80%", once: true } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="talks" aria-labelledby="talks-title" className="relative px-5 py-24 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <p className="label text-text-3">Talks and workshops</p>
          <h2 id="talks-title" className="h3 mt-5 max-w-[20ch] text-[clamp(2rem,3.6vw,3.2rem)]">
            Between hands, people who do this for a living talk shop.
          </h2>
          <p className="mt-5 max-w-[40ch] text-text-2">Two workshops run in the afternoon while the leaderboard keeps going. Speakers are being confirmed. We list names only once they say yes.</p>
        </div>

        <ul className="ws-list grid gap-3 [perspective:900px]">
          {config.workshops.map((w, i) => (
            <li key={i} className="ws-plaque grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 rounded-xl border border-hair-soft bg-ink/30 px-5 py-5 md:grid-cols-[9rem_1fr_auto] md:px-7">
              <p className="label text-text-3">{w.kind}</p>
              <p className="row-start-2 font-display text-2xl text-ivory italic md:row-start-auto">{w.speaker ? w.title : "Seat open"}</p>
              <p className="row-span-2 font-mono text-xs text-text-3 md:row-span-1">{w.speaker ?? "Speaker TBA"} · {w.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
