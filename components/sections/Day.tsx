import { config } from "@/lib/config";
import { Lead, Panel, i, type Prop } from "@/components/deck/Panel";
import { Chip } from "@/components/ui/Chip";

const PROPS: Prop[] = [
  { chip: "white", x: 6, y: 14, d: 20 },
  { card: "Yd", x: 5, y: 60, d: 10, rot: -10 },
  { card: "Ih", down: true, x: 85, y: 8, d: 22, rot: 15 },
  { chip: "black", x: 91, y: 68, d: 8 },
];

/** The day in six times, on one line. A chip slides along it once, doors to awards. */
export function Day() {
  const d = config.day;
  return (
    <Panel id="day" title="day-title" props={PROPS}>
      <Lead id="day-title" label="The day" heading={d.heading} body={d.body} />
      <div className="relative mt-16 w-full max-w-[68rem]">
        <span aria-hidden className="a-draw absolute top-[4px] right-[8.33%] left-[8.33%] hidden h-px bg-hair md:block" />
        <span aria-hidden className="a-run absolute -top-[13px] left-[91.67%] z-[1] hidden -translate-x-1/2 drop-shadow-[0_6px_5px_rgb(0_0_0/.8)] md:block">
          <Chip color="gold" className="block size-[34px]" />
        </span>
        <ol className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-6">
          {d.schedule.map(([time, what], k) => {
            const [clock, half] = time.split(" ");
            return (
              <li key={time} {...i(9 + k * 3)} className="a flex flex-col items-center">
                <span aria-hidden className="size-[9px] rotate-45 border border-gold bg-black" />
                <time className="mt-6 font-display text-[2rem] leading-none text-ivory">
                  {clock}
                  <span className="label ml-1.5 text-gold">{half}</span>
                </time>
                <span className="mt-2 max-w-[13ch] text-[1.05rem] leading-snug text-text-2 italic">{what}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Panel>
  );
}
