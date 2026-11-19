import type { CSSProperties } from "react";
import { config } from "@/lib/config";
import { Lead, Panel, i, type Prop } from "@/components/deck/Panel";
import { Suit, isRed } from "@/components/ui/Suit";
import { stain } from "@/lib/stain";

const PROPS: Prop[] = [
  { chip: "gold", x: 6, y: 20, d: 22 },
  { chip: "red", x: 11, y: 66, d: 8 },
  { chip: "black", x: 88, y: 14, d: 10 },
  { chip: "white", x: 86, y: 62, d: 24 },
];

/** Three prizes on three identical cards, so none reads as the lesser one. They are dealt face down, then turned. */
export function Prizes() {
  const p = config.prizes;
  return (
    <Panel id="prizes" title="prizes-title" props={PROPS}>
      <Lead id="prizes-title" label="Prizes" heading={p.heading} />
      <ul className="mt-12 grid w-full max-w-[56rem] grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-8">
        {p.items.map((it, k) => {
          const ink = isRed(it.suit) ? "text-oxblood" : "text-ink";
          return (
            <li key={it.title} {...i(9 + k * 2, { "--from": "0px -70px", "--spin": `${(k - 1) * 6}deg`, "--rot": `${(k - 1) * 1.5}deg` })} className="a [perspective:1400px]">
              <div className="flip lift" style={{ "--i": 16 + k * 4 } as CSSProperties}>
                <article className="card flex h-full flex-col items-center px-6 pt-9 pb-10 text-center" style={stain(40 + k)}>
                  <Suit s={it.suit} className={`absolute top-5 left-5 size-4 ${ink}`} />
                  <Suit s={it.suit} className={`absolute right-5 bottom-5 size-4 rotate-180 ${ink}`} />
                  <p className="label text-ink-2">{it.how}</p>
                  <p data-count={it.amount.replace(/\D/g, "")} className="mt-5 font-display text-[clamp(3.2rem,5vw,4.3rem)] leading-none tracking-[-0.03em] text-ink tabular-nums">
                    {it.amount}
                  </p>
                  <span aria-hidden className="mt-5 h-px w-10 bg-ink/40" />
                  <h3 className="mt-4 font-display text-[1.6rem] leading-tight text-oxblood italic">{it.title}</h3>
                  <p className="mt-1.5 text-[1.05rem] text-ink-2">{it.extra}</p>
                </article>
                <div aria-hidden className="pc-back [--w:230px] !rounded-[12px]" />
              </div>
            </li>
          );
        })}
      </ul>
      <p {...i(34)} className="a mt-10 text-[1.2rem] text-text-2 italic">
        {p.raffle}
      </p>
    </Panel>
  );
}
