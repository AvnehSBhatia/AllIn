import { config } from "@/lib/config";
import { Lead, Panel, i } from "@/components/deck/Panel";
import { stain } from "@/lib/stain";

/** The organizers. Founders sit in the first row; every card is the same size. Dealt out from the middle, one at a time. */
export function Team() {
  const t = config.team;
  let n = 0;
  return (
    <Panel id="team" title="team-title">
      <Lead id="team-title" label="Team" heading={t.heading} body={t.body} />
      <div className="mt-11 flex w-full max-w-[74rem] flex-col gap-4 md:gap-5">
        {t.rows.map((row, r) => (
          <ul key={r} className="flex flex-wrap justify-center gap-4 md:gap-5">
            {row.map((m, c) => {
              const off = c - (row.length - 1) / 2;
              return (
                <li key={m.name} {...i(9 + n++, { "--from": `${off * -14}px 34px`, "--spin": `${off * 2}deg` })} className="a w-[calc(50%-0.5rem)] sm:w-[11.25rem]">
                  <article className="card lift flex h-full flex-col px-5 pt-5 pb-5 text-left" style={stain(r * 10 + c)}>
                    <p className="font-display text-[1.6rem] leading-none text-ink">{m.name}</p>
                    {m.founder && <p className="label mt-2 text-[0.58rem] text-oxblood">Co-founder</p>}
                    <p className="mt-2 text-[0.98rem] leading-[1.2] text-ink-2 italic">{m.title}</p>
                  </article>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </Panel>
  );
}
