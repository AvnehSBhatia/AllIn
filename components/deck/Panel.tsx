import type { CSSProperties, ReactNode } from "react";
import { Chip, type ChipColor } from "@/components/ui/Chip";
import { PlayingCard } from "@/components/ui/PlayingCard";

/** Something lying on the table at the edge of a section. x/y are percentages of the section; d is depth (0 far, 30 near). */
export type Prop = { x: number; y: number; d: number; rot?: number; from?: string } & ({ card: string; down?: boolean; w?: number } | { chip: ChipColor; size?: number });

/** Stagger helper for .a entrances. */
export const i = (n: number, extra?: Record<string, string | number>) => ({ style: { "--i": n, ...extra } as CSSProperties });

/**
 * One section of the tabletop. Layers, back to front: props lying on the felt (they may hang over the section's edge),
 * then the content in one centred column. It opens with a gold rule that draws from the middle.
 */
export function Panel({ id, title, props = [], children, className = "" }: { id: string; title: string; props?: Prop[]; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={title} className={`panel ${className}`}>
      <div aria-hidden className="orn absolute inset-x-0 top-0">
        <i />
        <b />
        <i />
      </div>
      {props.length > 0 && (
        <div aria-hidden className="props hidden md:block">
          {props.map((p, k) => (
            <div key={k} className="prop" style={{ left: `${p.x}%`, top: `${p.y}%`, "--d": p.d } as CSSProperties}>
              <div className="a" style={{ "--i": 10 + k * 2, "--from": p.from ?? (p.x < 50 ? "-70px -50px" : "70px -50px"), "--spin": `${(k % 2 ? -1 : 1) * 14}deg`, "--rot": `${p.rot ?? 0}deg` } as CSSProperties}>
                {"card" in p ? <PlayingCard code={p.card} down={p.down} w={p.w ?? 84 + p.d * 2} /> : <Chip color={p.chip} className="block" style={{ width: p.size ?? 44 + p.d * 1.6 }} />}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

/** The centred block every section leads with: label, headline, at most one short line. Wrap words in *stars* to set them in gold. */
export function Lead({ id, label, heading, body }: { id: string; label: string; heading: string; body?: string }) {
  // word by word, so each can rise out of its own mask; odd segments between stars are gold
  const words = heading.split("*").flatMap((seg, n) => seg.split(/\s+/).filter(Boolean).map((t) => ({ t, gold: n % 2 === 1 })));
  return (
    <>
      <p {...i(0)} className="a eyebrow both">
        {label}
      </p>
      <h2 id={id} aria-label={heading.replaceAll("*", "")} className="h2 mt-7 max-w-[15ch]">
        {words.map((w, k) => (
          <span key={k} aria-hidden className="w">
            <span>{w.gold ? <em>{w.t}</em> : w.t}</span>
            {k < words.length - 1 && "\u00a0"}
          </span>
        ))}
      </h2>
      {body && (
        <p {...i(7)} className="a lede mt-6">
          {body}
        </p>
      )}
    </>
  );
}
