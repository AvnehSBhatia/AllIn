"use client";
import { useEffect, useRef, useState } from "react";
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

/** A hand-piled stack of chips, one per level. Clock's scroll driver drops them in (data-on) and turns the pile (--a). CSS: globals.css (.stk). */
function ChipStack() {
  return (
    <div aria-hidden className="hidden flex-1 items-center justify-center py-4 [perspective:1000px] lg:flex">
      <div className="stk relative size-44">
        {LEVELS.map((_, i) => {
          const c = COLORS[i % COLORS.length];
          // ponytail: fixed jitter so the stack looks hand-piled; same on server and client
          const x = Math.round(Math.sin(i * 2.3) * 5), y = Math.round(Math.cos(i * 1.7) * 5);
          return (
            <div key={i} className="stk-chip absolute inset-0" style={{ "--x": `${x}px`, "--y": `${y}px`, "--z": `${i * 12}px` } as React.CSSProperties}>
              {[0, 2, 4, 6, 8].map((z) => (
                <div key={z} className="absolute inset-0 rounded-full" style={{ transform: `translateZ(${z}px)`, background: `color-mix(in oklab, ${CHIP_COLORS[c].base} 55%, black)` }} />
              ))}
              <div className="absolute inset-0" style={{ transform: "translateZ(10px)" }}>
                <Chip color={c} className="h-full w-full" mark={i === LEVELS.length - 1} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ROW = "grid grid-cols-[2.5rem_5.5rem_1fr_auto] items-center gap-x-3 px-4 md:grid-cols-[3rem_7rem_1fr_auto] md:gap-x-4 md:px-7";

/**
 * Run of show as a tournament clock: a countdown to doors, then the blind-structure sheet.
 * Large screens: the clock sticks and scrolling steps through the levels one at a time (stop-motion);
 * the sheet slides to keep the level in view, and a chip lands on the stack for each one.
 */
export function Clock() {
  const [now, setNow] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stick = el.querySelector<HTMLElement>(".clk-stick")!;
    const win = el.querySelector<HTMLElement>(".clk-win")!;
    const list = el.querySelector<HTMLElement>(".clk-list")!;
    const rows = [...list.children] as HTMLElement[];
    const chips = [...el.querySelectorAll<HTMLElement>(".stk-chip")];
    const stk = el.querySelector<HTMLElement>(".stk")!;
    const focus = el.querySelector<HTMLElement>(".clk-focus")!;
    const sticky = matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const L = LEVELS.length;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const pin = sticky.matches;
      const raw = pin ? (stick.getBoundingClientRect().top - r.top) / (r.height - stick.offsetHeight) : (innerHeight - r.top) / (innerHeight + r.height);
      const p = Math.min(1, Math.max(0, pin ? raw : raw * 1.6));
      const k = Math.min(L - 1, Math.floor(p * L));
      chips.forEach((c, i) => (c.dataset.on = String(i <= k)));
      stk.style.setProperty("--a", `${Math.round((p * 540) / 22.5) * 22.5}deg`); // 22.5° a frame: stop-motion, not a smooth spin
      focus.innerHTML = `lvl <span class="text-gold">${pad(k + 1)}</span> · ${LEVELS[k].t} · <span class="text-ivory">${LEVELS[k].what}</span>`;
      if (pin) {
        rows.forEach((row, i) => (row.dataset.s = i < k ? "past" : i === k ? "at" : "next"));
        const max = Math.max(0, list.scrollHeight - win.clientHeight);
        list.style.setProperty("--shift", `${-Math.min(max, Math.max(0, rows[k].offsetTop - win.clientHeight * 0.3))}px`);
      } else {
        rows.forEach((row) => delete row.dataset.s);
        list.style.removeProperty("--shift");
      }
    };
    const queue = () => (raf ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => (removeEventListener("scroll", queue), removeEventListener("resize", queue), cancelAnimationFrame(raf));
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

  return (
    <div ref={ref} className="clk mt-20 md:ml-[18%]">
      <div className="clk-stick">
        <div className="felt flex h-full flex-col overflow-hidden rounded-lg">
          <div className="term-bar">
            <span>
              <span className="text-gold">~/allin</span> $ ./clock --structure
            </span>
            <span className="hidden sm:inline">sat jan 30 · pleasanton, ca</span>
          </div>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* the clock */}
            <div className="flex flex-col justify-between gap-6 border-hair-soft p-6 md:p-10 lg:border-r">
              <div>
                <p className="font-mono text-[12px] text-text-3">
                  level <span className="text-gold">{pad(live >= 0 ? live + 1 : before ? 1 : LEVELS.length)}</span>/{pad(LEVELS.length)}
                </p>
                <p className="mt-4 font-mono text-[clamp(2.2rem,4.2vw,3.3rem)] whitespace-nowrap leading-none font-medium tracking-[-0.03em] text-ivory tabular-nums" aria-live="off">
                  {big}
                </p>
                <p className="mt-3 font-mono text-[12px] text-text-2">{caption}</p>
              </div>
              <ChipStack />
              <p aria-hidden className="clk-focus hidden text-center font-mono text-[13px] text-text-3 lg:block">
                {LEVELS.length} levels · {first.t} to {last.t}
              </p>
              {next && (
                <div className="flex items-center gap-3 border-t border-hair-soft pt-5">
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
              <div className="clk-win min-h-0 flex-1 overflow-hidden">
                <ol className="clk-list">
                  {LEVELS.map((l, i) => {
                    const on = i === live;
                    const c = COLORS[i % COLORS.length];
                    return (
                      <li
                        key={l.t}
                        aria-current={on ? "time" : undefined}
                        className={`clk-row ${ROW} border-b border-hair-soft py-4 last:border-0 md:py-6 ${on ? "bg-gold/10" : ""} ${now != null && DAY && now >= l.end && l.end > l.start ? "opacity-45" : ""}`}
                      >
                        <span className="clk-chip relative grid size-9 place-items-center md:size-11">
                          <Chip color={c} mark={false} className="absolute inset-0 h-full w-full" />
                          <span className={`relative text-[11px] font-semibold md:text-[13px] ${c === "white" ? "text-ink" : "text-ivory"}`}>{i + 1}</span>
                        </span>
                        <span className={`text-[14px] md:text-[17px] ${on ? "text-gold-bright" : "text-gold"}`}>{l.t}</span>
                        <span className={`clk-what min-w-0 font-sans text-[16px] md:text-[21px] ${on ? "text-gold-bright" : "text-ivory"}`}>
                          {on && <span className="mr-1.5 font-mono text-gold">&gt;</span>}
                          {l.what}
                          {l.brk && <span className="ml-2 rounded-[3px] border border-dashed border-hair px-1.5 py-px align-middle font-mono text-[11px] text-text-3 uppercase">break</span>}
                        </span>
                        <span className="text-[13px] text-text-3 md:text-[15px]">{l.mins > 0 ? dur(l.mins) : "—"}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
