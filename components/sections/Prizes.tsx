"use client";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";
import { CHIP_COLORS, Chip } from "@/components/ui/Chip";
import { HiddenAce } from "@/components/ui/Aces";

// Stack heights are ranking, not value. The pool itself is TBA.
const HEIGHT = [15, 9, 7, 5];

/** Four prizes as four stacks of chips that drop onto the felt with some weight. */
export function Prizes() {
  const ref = useRef<HTMLElement>(null);
  const p = config.prizes;
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(".pz-stack", ref.current).forEach((stack, si) => {
        const chips = Array.from(stack.children).reverse(); // bottom chip lands first
        gsap.from(chips, {
          y: -260,
          opacity: 0,
          duration: 0.42,
          ease: "bounce.out",
          stagger: 0.035,
          delay: si * 0.12,
          scrollTrigger: { trigger: ".pz-row", start: "top 75%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="prizes" aria-labelledby="prizes-title" className="relative px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <p className="label text-text-3">Prizes</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2 id="prizes-title" className="h2 max-w-[12ch]">
            Four pots on the table.
          </h2>
          <p className="font-mono text-sm tracking-[0.14em] text-gold-bright uppercase">{p.note}</p>
        </div>

        <div className="felt relative mt-14 rounded-2xl px-5 pt-14 pb-8 md:px-12 md:pt-20 md:pb-12">
          <HiddenAce suit="diamonds" rotate={21} className="absolute top-4 right-4 md:top-6 md:right-8" />
          <ul className="pz-row grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
            {p.items.map((it, i) => (
              <li key={it.title} className={`flex flex-col ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
                <div className={`flex items-end md:h-[260px] ${i === 0 ? "h-[210px]" : "h-[130px]"}`} aria-hidden>
                  <Stack color={it.chip} n={HEIGHT[i]} wide={i === 0} />
                </div>
                <div className="mt-6 border-t border-hair-soft pt-4">
                  <p className="label text-text-3">{i === 0 ? "First place" : "Award"}</p>
                  <h3 className={`mt-2 font-display leading-[1.02] text-ivory ${i === 0 ? "text-[clamp(2rem,3.4vw,3rem)]" : "text-[1.6rem]"}`}>{it.title}</h3>
                  <p className="mt-2 text-sm text-text-2">{it.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Side-on stack: edge bands with the white inlay marks, the face of the top chip seen at an angle. */
function Stack({ color, n, wide }: { color: keyof typeof CHIP_COLORS; n: number; wide?: boolean }) {
  const { base, stripe } = CHIP_COLORS[color];
  const w = wide ? 132 : 96;
  return (
    <div className="pz-stack relative flex flex-col items-center" style={{ width: w } as CSSProperties}>
      <div className="relative z-10 -mb-[7px] w-full" style={{ height: Math.round(w * 0.4) }}>
        <Chip color={color} className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2 scale-y-[0.4]" />
      </div>
      {Array.from({ length: n }, (_, k) => (
        <span
          key={k}
          className="relative block h-3 w-full rounded-[50%/40%] shadow-[0_2px_0_rgb(0_0_0/.35)]"
          style={{
            background: `repeating-linear-gradient(90deg, ${base} 0 11%, ${stripe} 11% 16%)`,
            marginTop: k ? -3 : 0,
            translate: `${((k * 37) % 7) - 3}px 0`,
          }}
        />
      ))}
    </div>
  );
}
