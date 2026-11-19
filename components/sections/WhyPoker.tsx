import type { CSSProperties } from "react";
import { config } from "@/lib/config";
import { Lead, Panel, i } from "@/components/deck/Panel";
import { PlayingCard } from "@/components/ui/PlayingCard";

/** Why poker. Four cards of a royal flush turn over; the fifth stays face down. */
export function WhyPoker() {
  const g = config.game;
  const cards = [...g.hand, null];
  return (
    <Panel id="game" title="game-title">
      <Lead id="game-title" label="Why poker" heading={g.heading} body={g.body} />
      <div aria-hidden className="fan a-flip mt-14 flex justify-center pb-4">
        {cards.map((code, k) => {
          const t = k - (cards.length - 1) / 2;
          return (
            <div key={k} className="a -ml-[clamp(9px,1.4vw,18px)] first:ml-0" style={{ "--i": 9 + k * 2, "--from": "0px 46px", "--spin": `${t * -7}deg`, "--rot": `${t * 7}deg`, "--at": `0px ${Math.round(Math.abs(t) ** 1.6 * 10)}px` } as CSSProperties}>
              <PlayingCard code={code ?? "Ts"} down={!code} className="[--w:clamp(64px,10vw,132px)]" style={{ "--i": 14 + k * 3 } as CSSProperties} />
            </div>
          );
        })}
      </div>
      <p {...i(26)} className="a label mt-12 text-gold">
        {g.note}
      </p>
    </Panel>
  );
}
