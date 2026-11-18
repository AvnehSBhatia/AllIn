"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";
import { SplitHeading } from "@/components/motion/SplitHeading";

const RULES: [string, string, string?][] = [
  ["Length", config.durationLabel, "Kickoff to awards, same day"],
  ["Format", config.format, "Hybrid not decided"],
  ["Seats", `About ${config.capacity}`, "Selective. Applications are read"],
  ["Who", "Undergrads and researchers"],
  ["When", config.date ? new Date(config.date).toLocaleDateString("en-US", { month: "long", day: "numeric" }) : config.dateWindow, config.date ? undefined : "Date TBA"],
  ["Where", config.venue ?? "TBA", config.venueCity ?? undefined],
  ["Team size", "TBA"],
  ["Languages", "TBA", "Announced with the engine API"],
  ["Cost", "TBA"],
  ["Food", config.food],
  ["Talks", "Workshops and research talks through the day"],
  ["Chips", "Virtual. Always"],
];

/** House rules, written like the card taped to the side of a cash table. */
export function Format() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".hr-row", { x: -14, opacity: 0, duration: 0.45, ease: "power2.out", stagger: 0.04, scrollTrigger: { trigger: ".hr-list", start: "top 80%", once: true } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="format" aria-labelledby="format-title" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="label text-text-3">House rules</p>
          <SplitHeading id="format-title" className="h2 mt-5 max-w-[10ch]">
            What we can tell you now.
          </SplitHeading>
          <p className="lede mt-6">Anything marked TBA is undecided, not hidden. We fill it in the moment it is.</p>
        </div>

        <dl className="hr-list border-t border-hair">
          {RULES.map(([k, v, note]) => {
            const tba = v === "TBA";
            return (
              <div key={k} className="hr-row grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b border-hair-soft py-4 md:grid-cols-[10rem_1fr_auto] md:py-5">
                <dt className="label text-text-3">{k}</dt>
                <dd className={tba ? "font-mono text-sm tracking-[0.14em] text-text-3" : "text-[1.05rem] text-ivory md:text-lg"}>{v}</dd>
                {note && <dd className="col-start-2 -mt-2 text-sm text-text-3 md:col-start-auto md:mt-0 md:text-right">{note}</dd>}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/** How many community cards are out on each street. */
const OUT = [0, 3, 4, 5, 5];

/** The day as a hand of poker. A gold rule draws down the timeline as you scroll. */
export function Streets() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".st-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".st-list", start: "top 70%", end: "bottom 70%", scrub: 0.4 } });
      gsap.utils.toArray<HTMLElement>(".st-row", ref.current).forEach((row) => {
        gsap.from(row.querySelectorAll(".st-card[data-out]"), { rotationY: -180, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: row, start: "top 72%", once: true } });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="schedule" aria-labelledby="schedule-title" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p className="label text-text-3">The streets</p>
        <h2 id="schedule-title" className="h2 mt-5 max-w-[14ch]">
          The day plays out like a hand.
        </h2>
        <p className="mt-6 font-mono text-xs tracking-[0.14em] text-text-3 uppercase">Times TBA</p>

        <ol className="st-list relative mt-16 md:ml-[18%]">
          <span aria-hidden className="st-line absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gold" />
          <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-hair-soft" />
          {config.streets.map((s, i) => (
            <li key={s.street} className="st-row relative grid gap-4 pb-14 pl-10 last:pb-0 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:gap-10">
              <span aria-hidden className="absolute top-2.5 left-0 h-[15px] w-[15px] rounded-full border border-gold bg-felt-950" />
              <div>
                <p className="font-display text-[2rem] leading-none text-ivory italic">{s.street}</p>
                <p className="mt-2 font-mono text-xs text-text-3">{s.time}</p>
              </div>
              <div className="max-w-[42ch]">
                <h3 className="text-lg text-ivory">{s.title}</h3>
                <p className="mt-2 text-text-2">{s.body}</p>
              </div>
              <div role="img" aria-label={`${OUT[i]} community cards out`} className="flex gap-1 [perspective:400px] md:pt-1">
                {Array.from({ length: 5 }, (_, k) => (
                  <span
                    key={k}
                    data-out={k < OUT[i] || undefined}
                    className={`st-card h-7 w-5 rounded-[3px] ${k < OUT[i] ? (i === 4 ? "bg-ivory" : "bg-chip-red/90 shadow-[inset_0_0_0_2px_var(--chip-white)]") : "border border-dashed border-hair-soft"}`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
