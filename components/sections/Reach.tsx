import { config } from "@/lib/config";
import { Dither } from "@/components/motion/Dither";

const FACTS = [
  ["Who", "Undergrads and researchers"],
  ["Seats", `About ${config.capacity}, reviewed`],
  ["City", config.venueCity ?? "TBA"],
] as const;

/** ExeaLabs' open call: the dithered band with the heading on it, then the body and facts. */
export function Reach() {
  const r = config.reach;
  return (
    <section id="reach" aria-labelledby="reach-title" className="relative overflow-x-clip">
      <div className="relative flex min-h-[min(78svh,680px)] items-end px-5 pb-14 md:px-10 md:pb-20">
        <Dither seed={1} className="absolute inset-0 h-full w-full opacity-70 [mask-image:linear-gradient(transparent,#000_20%,#000_75%,transparent)]" />
        {/* keep the heading on quiet ground */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_18%_78%,var(--felt-950)_10%,transparent_75%)] opacity-90" />
        <div className="relative mx-auto w-full max-w-[1440px]">
          <p className="label text-text-2">{r.label}</p>
          <h2 id="reach-title" className="mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,5.8vw,5.5rem)] leading-[1] tracking-[-0.025em] text-ivory">
            {r.heading}
          </h2>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 pb-24 md:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20 lg:pb-32">
        <p className="max-w-[36rem] text-lg leading-relaxed text-text-2 lg:text-xl">{r.body}</p>
        <dl className="border-t border-hair-soft">
          {FACTS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-b border-hair-soft py-3">
              <dt className="label text-text-3">{k}</dt>
              <dd className="font-mono text-[13px] text-ivory">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
