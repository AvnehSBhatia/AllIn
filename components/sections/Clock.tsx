"use client";
import { useEffect, useRef, useState } from "react";
import { useStepper } from "@/hooks/useStepper";
import { Stepper } from "@/components/ui/Stepper";
import { config } from "@/lib/config";
import { Chip, CHIP_COLORS, type ChipColor } from "@/components/ui/Chip";

const COLORS: ChipColor[] = ["white", "red", "blue", "black", "gold"];
const DAY = config.date?.slice(0, 10); // "2027-01-30"
const TZ = config.date?.slice(19) || "-08:00"; // the offset config.date was written in

// "1:30 PM" on the event day → epoch ms
const at = (t: string) => {
  const [, h, m, ap] = t.match(/(\d+):(\d+)\s*(AM|PM)/)!;
  const hh = (+h % 12) + (ap === "PM" ? 12 : 0);
  return Date.parse(`${DAY}T${String(hh).padStart(2, "0")}:${m}:00${TZ}`);
};
const LEVELS = config.schedule.map(([t, what], i, all) => {
  const start = DAY ? at(t) : 0;
  const end = DAY && all[i + 1] ? at(all[i + 1][0]) : start;
  return { t, what, start, end, mins: (end - start) / 60000, brk: /lunch|dinner/i.test(what) };
});
const pad = (n: number) => String(n).padStart(2, "0");
const dur = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m}m`);

/** A hand-piled stack of chips, one per level: chips up to the current level are dropped in, and the pile turns. CSS: globals.css (.stk). */
function ChipStack({ k }: { k: number }) {
  const a = Math.round(((k + 1) / LEVELS.length) * 540 / 22.5) * 22.5; // 22.5° a frame: stop-motion, not a smooth spin
  return (
    <div aria-hidden className="flex shrink-0 items-center justify-center [perspective:1000px] lg:flex-1 lg:py-4">
      <div className="stk relative size-24 sm:size-32 lg:size-44 land:size-16" style={{ "--a": `${a}deg` } as React.CSSProperties}>
        {LEVELS.map((_, i) => {
          const c = COLORS[i % COLORS.length];
          // ponytail: fixed jitter so the stack looks hand-piled; same on server and client
          const x = Math.round(Math.sin(i * 2.3) * 5), y = Math.round(Math.cos(i * 1.7) * 5);
          return (
            <div key={i} data-on={i <= k} className="stk-chip absolute inset-0" style={{ "--x": `${x}px`, "--y": `${y}px`, "--n": i } as React.CSSProperties}>
              {[0, 2, 4, 6, 8].map((z) => (
                <div key={z} className="absolute inset-0 rounded-full" style={{ transform: `translateZ(${z * 0.7}px)`, background: `color-mix(in oklab, ${CHIP_COLORS[c].base} 55%, black)` }} />
              ))}
              <div className="absolute inset-0" style={{ transform: "translateZ(7px)" }}>
                <Chip color={c} className="h-full w-full" mark={i === LEVELS.length - 1} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ROW = "grid grid-cols-[2.25rem_4.75rem_1fr_auto] items-center gap-x-3 px-4 md:grid-cols-[3rem_7rem_1fr_auto] md:gap-x-4 md:px-7";

/**
 * Run of show as a tournament clock: a countdown to doors, then the blind-structure sheet.
 * ← / → (or swipe, the buttons, or a tap on a row) steps through the levels one at a time, stop-motion:
 * the sheet slides to keep the level in view and a chip lands on the stack for each one. The page scrolls normally.
 */
export function Clock() {
  const [now, setNow] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { i: k, go } = useStepper(ref, LEVELS.length);
  const [shifts, setShifts] = useState<number[]>([]);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // where the sheet sits for each level: measured on resize (and rotation), not every step
  useEffect(() => {
    const el = ref.current!;
    const win = el.querySelector<HTMLElement>(".clk-win")!;
    const list = el.querySelector<HTMLElement>(".clk-list")!;
    const measure = () => {
      const max = Math.max(0, list.scrollHeight - win.clientHeight);
      setShifts([...list.children].map((row) => -Math.min(max, Math.max(0, (row as HTMLElement).offsetTop - win.clientHeight * 0.3))));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(win);
    return () => ro.disconnect();
  }, []);

  const first = LEVELS[0];
  const last = LEVELS[LEVELS.length - 1];
  const live = now != null && DAY ? LEVELS.findIndex((l) => now >= l.start && now < l.end) : -1;
  const before = now != null && DAY && now < first.start;
  const over = now != null && DAY && now >= last.start;

  let big = "--d --:--:--";
  let caption = "until doors open";
  if (before) {
    const s = Math.floor((first.start - now) / 1000);
    big = `${Math.floor(s / 86400)}d ${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
  } else if (live >= 0) {
    const s = Math.floor((LEVELS[live].end - now!) / 1000);
    big = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
    caption = `left in level ${pad(live + 1)}`;
  } else if (over) {
    big = "GG";
    caption = "that's the tournament";
  }
  const next = before ? first : live >= 0 ? LEVELS[live + 1] : null;

  const L = LEVELS[k];
  return (
    <div ref={ref} className="clk mt-10 md:mt-12 lg:ml-[18%]">
      <div className="felt flex flex-col overflow-hidden rounded-lg lg:h-[min(760px,calc(100svh-140px))] land:h-[calc(100svh-72px)]">
        <div className="term-bar">
          <span>
            <span className="text-gold">~/allin</span> $ ./clock --structure
          </span>
          <span className="hidden sm:inline">sat jan 30 · pleasanton, ca</span>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] land:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* the clock */}
          <div className="flex flex-col justify-between gap-5 border-b border-hair-soft p-5 md:p-10 lg:border-r lg:border-b-0 land:gap-3 land:border-r land:border-b-0 land:p-4">
            <div className="flex items-center justify-between gap-4 lg:flex-1 lg:flex-col lg:items-stretch">
              <div className="min-w-0">
                <p className="font-mono text-[12px] text-text-3">
                  level <span className="text-gold">{pad(live >= 0 ? live + 1 : before ? 1 : LEVELS.length)}</span>/{pad(LEVELS.length)}
                </p>
                <div className="mt-3 font-mono text-[clamp(1.75rem,7.4vw,3.3rem)] whitespace-nowrap leading-none font-medium tracking-[-0.03em] text-ivory tabular-nums lg:text-[clamp(2.2rem,4.2vw,3.3rem)] land:text-[1.6rem]" aria-live="off">
                  {big}
                </div>
                <p className="mt-2 font-mono text-[12px] text-text-2">{caption}</p>
              </div>
              <ChipStack k={k} />
            </div>
            <p className="clk-focus border-t border-hair-soft pt-4 font-mono text-[13px] text-text-3 lg:border-0 lg:pt-0 lg:text-center" aria-live="polite">
              lvl <span className="text-gold">{pad(k + 1)}</span> · {L.t} · <span className="text-ivory">{L.what}</span>
            </p>
            {next && (
              <div className="hidden items-center gap-3 border-t border-hair-soft pt-5 lg:flex">
                <Chip color={COLORS[LEVELS.indexOf(next) % COLORS.length]} className="h-9 w-9 shrink-0" />
                <p className="text-sm text-text-2">
                  <span className="font-mono text-[12px] text-text-3">next · {next.t}</span>
                  <br />
                  <span className="text-ivory">{next.what}</span>
                </p>
              </div>
            )}
          </div>

          {/* the structure sheet */}
          <div className="flex min-h-0 flex-col font-mono">
            <p aria-hidden className={`${ROW} border-b border-hair-soft bg-black/15 py-3 text-[12px] text-text-3`}>
              <span>lvl</span>
              <span>time</span>
              <span>event</span>
              <span>runs</span>
            </p>
            <div className="clk-win h-[19rem] overflow-hidden sm:h-[23rem] lg:h-auto lg:min-h-0 lg:flex-1 land:h-auto land:min-h-0 land:flex-1">
              <ol className="clk-list" style={{ "--shift": `${shifts[k] ?? 0}px` } as React.CSSProperties}>
                {LEVELS.map((l, i) => {
                  const on = i === live;
                  const c = COLORS[i % COLORS.length];
                  return (
                    <li
                      key={l.t}
                      aria-current={on ? "time" : undefined}
                      data-s={i < k ? "past" : i === k ? "at" : "next"}
                      onClick={() => go(i)}
                      className={`clk-row ${ROW} cursor-pointer border-b border-hair-soft py-3.5 last:border-0 md:py-5 land:py-2.5 ${on ? "bg-gold/10" : ""} ${now != null && DAY && now >= l.end && l.end > l.start ? "opacity-45" : ""}`}
                    >
                      <span className="clk-chip relative grid size-8 place-items-center md:size-11">
                        <Chip color={c} mark={false} className="absolute inset-0 h-full w-full" />
                        <span className={`relative text-[11px] font-semibold md:text-[13px] ${c === "white" ? "text-ink" : "text-ivory"}`}>{i + 1}</span>
                      </span>
                      <span className={`text-[13px] md:text-[17px] ${on ? "text-gold-bright" : "text-gold"}`}>{l.t}</span>
                      <span className={`clk-what min-w-0 font-sans text-[15px] leading-snug md:text-[21px] ${on ? "text-gold-bright" : "text-ivory"}`}>
                        {on && <span className="mr-1.5 font-mono text-gold">&gt;</span>}
                        {l.what}
                        {l.brk && <span className="ml-2 hidden rounded-[3px] border border-dashed border-hair px-1.5 py-px align-middle font-mono text-[11px] text-text-3 uppercase sm:inline">break</span>}
                      </span>
                      <span className="text-[12px] text-text-3 md:text-[15px]">{l.mins > 0 ? dur(l.mins) : "—"}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <Stepper i={k} count={LEVELS.length} go={go} word="lvl" label={(n) => `Level ${n + 1}: ${LEVELS[n].t}, ${LEVELS[n].what}`} className="border-t border-hair-soft bg-black/15 px-3 py-1 md:px-5 land:py-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
