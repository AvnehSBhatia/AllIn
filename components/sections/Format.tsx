import { config } from "@/lib/config";

const RULES: [string, string, string?][] = [
  ["Length", config.durationLabel, "Kickoff to awards, same day"],
  ["Format", config.format, "One day, no overnight"],
  ["Seats", `About ${config.capacity}`, "Selective. Applications are read"],
  ["Who", "Undergrads and researchers"],
  ["When", config.date ? new Date(config.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/Los_Angeles" }) : config.dateWindow, config.date ? "8:30 AM to 8:30 PM" : "Date TBA"],
  ["Where", config.venue ?? "TBA", config.venueCity ?? undefined],
  ["Team size", `Up to ${config.teamSize}`, "About 50 teams"],
  ["Hosts", [config.organizer, ...config.coHosts].join(" × ")],
  ["Languages", "TBA", "Announced with the engine API"],
  ["Cost", "TBA"],
  ["Food", config.food],
  ["Talks", "Two workshops in the afternoon"],
  ["Winner", "Live leaderboard, then a playoff bracket"],
  ["Chips", "Virtual. Always"],
];

/** House rules, written like the card taped to the side of a cash table. */
export function Format() {
  return (
    <section id="format" aria-labelledby="format-title" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">House rules</p>
          <h2 id="format-title" className="h2 mt-5 max-w-[10ch]">
            What we can tell you now.
          </h2>
          <p className="lede mt-6">Anything marked TBA is undecided, not hidden. We fill it in the moment it is.</p>
        </div>

        <dl className="border-t border-hair">
          {RULES.map(([k, v, note]) => {
            const tba = v === "TBA";
            return (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b border-hair-soft py-4 md:grid-cols-[10rem_1fr_auto] md:py-5">
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

/** The day as a hand of poker.  */
export function Streets() {
  return (
    <section id="schedule" aria-labelledby="schedule-title" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p className="eyebrow">The streets</p>
        <h2 id="schedule-title" className="h2 mt-5 max-w-[14ch]">
          The day plays out like a hand.
        </h2>
        <p className="mt-6 font-mono text-xs tracking-[0.14em] text-text-3 uppercase">Saturday, January 30 · Pleasanton, CA</p>

        <ol className="relative mt-16 md:ml-[18%]">
          <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-[linear-gradient(var(--gold),var(--hair-soft))]" />
          {config.streets.map((s, i) => (
            <li key={s.street} className="relative grid gap-4 pb-14 pl-10 last:pb-0 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:gap-10">
              <span aria-hidden className="absolute top-2.5 left-0 h-[15px] w-[15px] rounded-full border border-gold bg-felt-950" />
              <div>
                <p className="font-display text-[2rem] leading-none text-ivory italic">{s.street}</p>
                <p className="mt-2 font-mono text-xs text-text-3">{s.time}</p>
              </div>
              <div className="max-w-[42ch]">
                <h3 className="text-lg text-ivory">{s.title}</h3>
                <p className="mt-2 text-text-2">{s.body}</p>
              </div>
              <div role="img" aria-label={`${OUT[i]} community cards out`} className="flex gap-1 md:pt-1">
                {Array.from({ length: 5 }, (_, k) => (
                  <span
                    key={k}
                    className={`h-7 w-5 rounded-[3px] ${k < OUT[i] ? (i === 4 ? "bg-ivory" : "bg-chip-red/90 shadow-[inset_0_0_0_2px_var(--chip-white)]") : "border border-dashed border-hair-soft"}`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 md:ml-[18%]">
          <h3 className="label text-text-3">Run of show</h3>
          <dl className="mt-4 grid border-t border-hair-soft sm:grid-cols-2 sm:gap-x-12">
            {config.schedule.map(([t, what]) => (
              <div key={t + what} className="grid grid-cols-[6.5rem_1fr] items-baseline border-b border-hair-soft py-3">
                <dt className="font-mono text-[13px] text-gold-bright">{t}</dt>
                <dd className="text-ivory">{what}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
