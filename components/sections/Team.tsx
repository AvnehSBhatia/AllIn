import { config } from "@/lib/config";
import { Chip, type ChipColor } from "@/components/ui/Chip";

const COLORS: ChipColor[] = ["gold", "red", "blue", "black", "white"];

/** The organizers, seated like a table: a chip with their initial, a very serious title, and what they actually do. */
export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="relative px-5 py-16 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p className="eyebrow">Meet the team</p>
        <h2 id="team-title" className="h3 mt-5 max-w-[22ch] text-[clamp(2rem,3.6vw,3.2rem)]">
          The house, and their very official titles.
        </h2>
        <p className="mt-5 max-w-[46ch] text-text-2">Run by ExeaLabs with YRI.</p>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {config.team.map((m, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <li key={m.name} className={`tm-card grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 rounded-xl border p-5 md:p-6 ${m.founder ? "border-gold/50 bg-gold/[0.06]" : "border-hair-soft bg-ink/30"}`}>
                <span aria-hidden className="tm-chip relative row-span-3 grid size-14 place-items-center self-start">
                  <Chip color={c} mark={false} className="absolute inset-0 h-full w-full" />
                  <span className={`relative font-display text-xl ${c === "white" ? "text-ink" : "text-ivory"}`}>{m.name[0]}</span>
                </span>
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl leading-tight text-ivory">{m.name}</span>
                  <span className={`font-mono text-[11px] ${m.founder ? "text-gold" : "text-text-3"}`}>{m.founder ? "founder" : "seat"} {String(i + 1).padStart(2, "0")}</span>
                </p>
                <p className="text-[15px] leading-snug text-gold-bright italic">{m.title}</p>
                <p className="mt-2 font-mono text-[12.5px] leading-relaxed text-text-2">
                  <span className="text-gold">$</span> {m.job}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
