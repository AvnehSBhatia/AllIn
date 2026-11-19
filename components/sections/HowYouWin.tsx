import type { CSSProperties, ReactNode } from "react";
import { config } from "@/lib/config";
import { Lead, Panel, i, type Prop } from "@/components/deck/Panel";
import { Chip } from "@/components/ui/Chip";

const PROPS: Prop[] = [
  { card: "Cs", down: true, x: 5, y: 56, d: 22, rot: 13 },
  { chip: "blue", x: 12, y: 18, d: 8 },
  { card: "Sh", down: true, x: 87, y: 8, d: 10, rot: -12 },
  { chip: "red", x: 89, y: 70, d: 20 },
];

/** A small table seen from above. The two seats that advance are gold. */
function MiniTable({ n }: { n: number }) {
  return (
    <span className="a grid h-7 w-14 grid-cols-3 place-items-center rounded-full border border-gold/70 bg-black/50 px-2" style={{ "--i": 18 + n * 2, "--from": "0 0", "--spin": "0deg" } as CSSProperties}>
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`size-1.5 rounded-full ${s === (n % 3) || s === 3 + ((n + 1) % 3) ? "seat-on bg-gold-bright" : "bg-ivory/30"}`} style={{ "--n": n * 2 + (s > 2 ? 1 : 0) } as CSSProperties} />
      ))}
    </span>
  );
}

const ART: ReactNode[] = [
  // your bot against ours
  <span key="a" className="flex items-center">
    <Chip color="white" mark={false} className="size-11" />
    <span className="label mx-2.5 text-text-3">vs</span>
    <Chip color="black" className="size-11" />
  </span>,
  // the leaderboard: bars that grow
  <span key="b" className="flex w-24 flex-col gap-[7px]">
    {[100, 82, 61, 44].map((w, k) => (
      <span key={w} className={`a-grow h-[5px] ${k < 2 ? "bg-gold-bright" : "bg-ivory/30"}`} style={{ width: `${w}%`, "--i": 14 + k * 2 } as CSSProperties} />
    ))}
  </span>,
  // tables, top two advance
  <span key="c" className="grid grid-cols-2 gap-1.5">
    {[0, 1, 2, 3].map((n) => (
      <MiniTable key={n} n={n} />
    ))}
  </span>,
  // one left
  <span key="d" className="[perspective:600px]">
    <Chip color="gold" className="a-spin block size-14 drop-shadow-[0_10px_8px_rgb(0_0_0/.7)]" />
  </span>,
];

/** How the winner is decided, as four steps along one line. */
export function HowYouWin() {
  const w = config.win;
  return (
    <Panel id="win" title="win-title" props={PROPS}>
      <Lead id="win-title" label="Format" heading={w.heading} body={w.body} />
      <div className="relative mt-14 w-full max-w-[62rem]">
        <span aria-hidden className="a-draw absolute top-[5.5rem] right-[12.5%] left-[12.5%] hidden h-px bg-hair md:block" />
        <ol className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
          {w.steps.map((s, k) => (
            <li key={s.title} {...i(9 + k * 3)} className="a flex flex-col items-center">
              <span aria-hidden className="grid h-16 place-items-center">
                {ART[k]}
              </span>
              <span aria-hidden className="relative mt-4 grid size-6 rotate-45 place-items-center border border-gold bg-black">
                <span className="-rotate-45 font-display text-[12px] leading-none text-gold-bright italic">{k + 1}</span>
              </span>
              <h3 className="mt-5 font-display text-[1.7rem] leading-none text-ivory">{s.title}</h3>
              <p className="mt-2 max-w-[16ch] text-[1.05rem] leading-snug text-text-2 italic">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}
