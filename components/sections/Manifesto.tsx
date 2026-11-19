import { config } from "@/lib/config";
import { Dither } from "@/components/motion/Dither";

/** Why poker: the lead on the left, the argument on the right, over a quiet swaying dither. */
export function Manifesto() {
  const m = config.manifesto;
  const [l1, l2] = m.lead.split(/(?<=\.)\s+/);
  return (
    <section aria-label="Why poker" className="relative overflow-hidden px-5 py-28 md:px-10 lg:py-40">
      <Dither seed={2} className="absolute inset-0 h-full w-full opacity-40 [mask-image:radial-gradient(70%_60%_at_80%_50%,#000,transparent)]" />
      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <div>
          <p className="eyebrow mb-8">Why poker, and why not plain Hold&apos;em</p>
          <p className="max-w-[18ch] font-display text-[clamp(2.1rem,4vw,3.8rem)] leading-[1.08] tracking-[-0.02em] text-ivory">
            <span className="block">{l1}</span>
            <span className="block">{l2}</span>
          </p>
        </div>
        <div className="flex max-w-[34rem] flex-col gap-5 text-lg leading-relaxed text-text-2 lg:self-end">
          {m.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="mt-4 font-display text-[clamp(1.75rem,2.5vw,2.3rem)] leading-tight text-gold-bright italic">{m.turn}</p>
          <p className="text-ivory">{m.close}</p>
        </div>
      </div>
    </section>
  );
}
