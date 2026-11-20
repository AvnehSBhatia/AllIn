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
                    <p className="mt-2 text-[0.98rem] leading-[1.2] text-ink-2 italic">{m.title}</p>
                  </article>
                </li>
              );
            })}
          </ul>
        ))}
      </div>

      {/* The houses behind the night, on plates of the same stock as the cards above. */}
      <div className="mt-16 flex w-full max-w-[74rem] flex-col items-center">
        <p {...i(9 + n++)} className="a eyebrow both">
          {t.partnersLabel}
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-4 md:gap-5">
          {t.partners.map((p, k) => (
            <li key={p.name} {...i(9 + n++, { "--from": `${(k - 1) * -16}px 34px`, "--spin": `${(k - 1) * 2}deg` })} className="a w-[calc(50%-0.5rem)] sm:w-[14.5rem]">
              <a
                href={p.href}
                target="_blank"
                rel="noopener"
                aria-label={p.name}
                className="card lift flex h-[7.5rem] items-center justify-center px-5 text-center"
                style={stain(60 + k)}
              >
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo} alt="" width={320} height={320} loading="lazy" decoding="async" className="max-h-[5.6rem] w-full object-contain" />
                ) : (
                  <span className="flex flex-col items-center gap-2.5">
                    {p.mark && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.mark} alt="" width={310} height={360} loading="lazy" decoding="async" className="h-[3rem] w-auto" />
                    )}
                    <span className="label text-[0.82rem] leading-[1.6] text-ink">{p.name}</span>
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
