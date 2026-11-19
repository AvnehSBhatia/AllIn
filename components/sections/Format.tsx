import { config } from "@/lib/config";
import { Clock } from "./Clock";

const RULES: [string, string, string?][] = [
  ["Length", config.durationLabel],
  ["Format", config.format],
  ["Seats", `About ${config.capacity}`],
  ["When", config.date ? new Date(config.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/Los_Angeles" }) : config.dateWindow, config.date ? "8:30 AM to 8:30 PM" : "Date TBA"],
  ["Where", config.venue ?? "TBA", config.venueCity ?? undefined],
  ["Team size", `Up to ${config.teamSize}`],
  ["Hosts", [config.organizer, ...config.coHosts].join(" × ")],
  ["Cost", "TBA"],
  ["Food", config.food],
];

/** House rules, written like the card taped to the side of a cash table. */
export function Format() {
  return (
    <section id="format" aria-labelledby="format-title" className="relative px-5 py-16 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">House rules</p>
          <h2 id="format-title" className="h2 mt-5 max-w-[10ch]">
            What we can tell you now.
          </h2>
          <p className="lede mt-6">TBA means undecided, not hidden.</p>
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


/** The day as a hand of poker.  */
export function Streets() {
  return (
    <section id="schedule" aria-labelledby="schedule-title" className="relative px-5 py-16 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p className="eyebrow">Schedule</p>
        <h2 id="schedule-title" className="h2 mt-5 max-w-[14ch]">
          The day plays out like a hand.
        </h2>
        <p className="mt-6 font-mono text-xs tracking-[0.14em] text-text-3 uppercase">Saturday, January 30 · Pleasanton, CA</p>

        <Clock />
      </div>
    </section>
  );
}
