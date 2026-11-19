import { config, type Tier } from "@/lib/config";

const TIERS: Tier[] = ["title", "gold", "silver", "community"];
const NAME: Record<Tier, string> = { title: "Title", gold: "Gold", silver: "Silver", community: "Community" };

// One list of every chair, filled names first. Angles go clockwise from the head of the table.
const seats = TIERS.flatMap((t) => {
  const named = config.sponsors[t];
  const n = Math.max(named.length, config.sponsors.slots[t]);
  return Array.from({ length: n }, (_, i) => ({ tier: t, s: named[i] }));
});
const pos = seats.map((_, i) => {
  const a = -Math.PI / 2 + (i / seats.length) * Math.PI * 2;
  return { x: Math.round(50 + Math.cos(a) * 43), y: Math.round(50 + Math.sin(a) * 44) };
});

/** Sponsors as a top-down seating chart. Empty chairs say so. */
export function House() {
  const email = config.sponsorEmail;

  const plaque = (x: (typeof seats)[number], i: number) => {
    const body = (
      <>
        <span className="label text-[0.62rem] text-text-3">{NAME[x.tier]}</span>
        <span className={`mt-1 block font-display text-lg leading-tight ${x.s ? "text-ivory" : "text-text-2 italic"}`}>{x.s?.name ?? "Seat open"}</span>
      </>
    );
    const cls = `hs-seat block rounded-lg border px-3 py-2 text-center ${x.tier === "title" ? "border-gold/60 bg-ink/70" : "border-hair-soft bg-ink/50"}`;
    return x.s?.href ? (
      <a key={i} href={x.s.href} className={`${cls} hover:border-gold`} rel="noopener" target="_blank">
        {body}
      </a>
    ) : (
      <div key={i} className={cls}>
        {body}
      </div>
    );
  };

  return (
    <section id="sponsors" aria-labelledby="sponsors-title" className="relative overflow-x-clip px-5 py-16 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="eyebrow">The house</p>
            <h2 id="sponsors-title" className="h2 mt-5 max-w-[14ch]">
              Every chair is open. For now.
            </h2>
          </div>
          <div className="max-w-[26rem]">
            <p className="text-text-2">
              Sponsors and co-hosts are being confirmed. We put a name on a seat when it&apos;s signed, and not before.
            </p>
            {email ? (
              <a href={`mailto:${email}?subject=ALL%20IN%20sponsorship`} className="btn btn-ghost mt-6">
                Take a seat at the house
              </a>
            ) : (
              <p className="mt-6 font-mono text-xs tracking-[0.14em] text-text-3 uppercase">Sponsor enquiries open soon</p>
            )}
          </div>
        </div>

        {/* chart for wide screens */}
        <div className="hs-table relative mx-auto mt-20 hidden aspect-[2.1/1] max-w-[1100px] md:block">
          <div aria-hidden className="felt absolute inset-[16%_14%] grid place-items-center rounded-[50%] border-[10px] border-[#2a1a10]">
            <p className="font-display text-[clamp(2rem,4vw,3.4rem)] text-ivory/80 italic">The House</p>
          </div>
          <ul>
            {seats.map((x, i) => (
              <li key={i} className="absolute w-[9.5rem] -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}>
                {plaque(x, i)}
              </li>
            ))}
          </ul>
        </div>
        {/* list for phones */}
        <ul className="hs-table mt-12 grid grid-cols-2 gap-3 md:hidden">
          {seats.map((x, i) => (
            <li key={i} className={x.tier === "title" ? "col-span-2" : ""}>
              {plaque(x, i)}
            </li>
          ))}
        </ul>

        <p className="mt-12 font-mono text-xs text-text-3">Co-hosts: {config.coHosts.length ? config.coHosts.join(", ") : "announcing soon"}</p>
      </div>
    </section>
  );
}
