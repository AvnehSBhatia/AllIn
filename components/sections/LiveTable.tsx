"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { equity, handName, label, parse, score, shuffled } from "@/lib/poker";
import { PlayingCard } from "@/components/ui/PlayingCard";

const STREETS = ["Pre-flop", "Flop", "Turn", "River"] as const;
const SHOWN = [0, 3, 4, 5];

type Deal = { a: number[]; b: number[]; board: number[] };
// Fixed first hand so the server and browser agree; new hands are random.
const FIRST: Deal = { a: ["Ah", "Kh"].map(parse), b: ["8s", "8c"].map(parse), board: ["Qh", "8d", "2h", "Js", "5c"].map(parse) };

function deal(): Deal {
  const d = shuffled();
  return { a: d.slice(0, 2), b: d.slice(2, 4), board: d.slice(4, 9) };
}

/** What a sane bot does with this much equity. Not a strategy, just a readable log. */
function act(e: number) {
  if (e > 0.8) return "bets 3/4 pot";
  if (e > 0.6) return "bets 1/2 pot";
  if (e > 0.42) return "checks";
  if (e > 0.25) return "calls, priced in";
  return "calls, on a draw";
}

/** The lab bench: one heads-up hand, equity at every street, the log the bots would write. */
export function LiveTable() {
  const ref = useRef<HTMLElement>(null);
  const [hand, setHand] = useState<Deal>(FIRST);
  const [street, setStreet] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);

  const eq = useMemo(() => SHOWN.map((n) => equity(hand.a, hand.b, hand.board.slice(0, n), 800)), [hand]);
  const done = street === 3;

  const next = () => {
    if (done) {
      setHand(deal());
      setStreet(0);
    } else setStreet(street + 1);
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(next, done ? 3400 : 1900);
    return () => clearTimeout(id);
  });

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(`.lt-board > :nth-child(-n+${SHOWN[street]}):not([data-seen])`, { y: -24, rotationY: 120, opacity: 0 }, { y: 0, rotationY: 0, opacity: 1, duration: 0.5, ease: "expo.out", stagger: 0.08 });
      gsap.utils.toArray<HTMLElement>(".lt-board > *").forEach((el, i) => (i < SHOWN[street] ? el.setAttribute("data-seen", "") : el.removeAttribute("data-seen")));
    },
    { scope: ref, dependencies: [street, hand] },
  );

  const now = eq[street];
  const sa = done ? score([...hand.a, ...hand.board]) : 0;
  const sb = done ? score([...hand.b, ...hand.board]) : 0;
  const result = sa === sb ? "Split pot" : sa > sb ? `BOT-A wins with ${handName(sa).toLowerCase()}` : `BOT-B wins with ${handName(sb).toLowerCase()}`;

  // chart geometry
  const W = 320;
  const H = 120;
  const x = (i: number) => 16 + (i * (W - 32)) / 3;
  const y = (v: number) => 10 + (1 - v) * (H - 20);
  const pts = eq.slice(0, street + 1).map((v, i) => `${x(i)},${y(v)}`);

  return (
    <section ref={ref} id="lab" aria-labelledby="lab-title" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="label text-text-3">The bench</p>
            <h2 id="lab-title" className="h2 mt-5 max-w-[16ch]">
              Two bots, one hand, and the numbers in between.
            </h2>
          </div>
          <p className="lede lg:max-w-[30rem]">
            This is plain Hold&apos;em, the solved game, shown so you can see what a bot actually sees. Equity is computed in your browser on every street. Your variant will break half of these assumptions.
          </p>
        </div>

        <div className="felt mt-14 grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* table side */}
          <div className="relative flex flex-col gap-8 border-hair-soft p-5 md:p-10 lg:border-r">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-5">
              <Seat name="BOT-A" cards={hand.a} eq={now} up />
              <Seat name="BOT-B" cards={hand.b} eq={1 - now} />
            </div>

            <div role="img" className="lt-board flex justify-center gap-2 py-4 [perspective:900px] md:gap-3" aria-label={`Board: ${hand.board.slice(0, SHOWN[street]).map(label).join(" ") || "no cards yet"}`}>
              {hand.board.map((c, i) =>
                i < SHOWN[street] ? (
                  <PlayingCard key={`${label(c)}-${i}`} code={label(c)} className="[--w:clamp(48px,11vw,76px)]" />
                ) : (
                  <div key={i} className="aspect-[5/7] w-[clamp(48px,11vw,76px)] rounded-md border border-dashed border-hair-soft" />
                ),
              )}
            </div>

            {/* equity bar */}
            <div>
              <div className="flex justify-between font-mono text-xs text-text-2">
                <span>A {(now * 100).toFixed(1)}%</span>
                <span className="text-text-3">{STREETS[street]}</span>
                <span>B {((1 - now) * 100).toFixed(1)}%</span>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-ink/60" role="img" aria-label={`BOT-A equity ${(now * 100).toFixed(0)} percent`}>
                <div className="bg-ivory transition-[width] duration-700 ease-[var(--ease-out)]" style={{ width: `${now * 100}%` }} />
                <div className="flex-1 bg-chip-red/80" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={next} className="btn btn-ghost min-h-11">
                {done ? <RotateCcw size={15} strokeWidth={1.5} /> : <StepForward size={15} strokeWidth={1.5} />}
                {done ? "New hand" : `Deal the ${STREETS[street + 1].toLowerCase()}`}
              </button>
              <button type="button" onClick={() => setAuto(!auto)} aria-pressed={auto} className="btn min-h-11 px-3 text-text-2 hover:text-ivory">
                {auto ? <Pause size={15} strokeWidth={1.5} /> : <Play size={15} strokeWidth={1.5} />}
                {auto ? "Pause" : "Autoplay"}
              </button>
              <p className="font-mono text-xs text-gold-bright" aria-live="polite">
                {done ? result : ""}
              </p>
            </div>
          </div>

          {/* instrument side */}
          <div className="flex flex-col gap-8 border-t border-hair-soft bg-ink/25 p-5 md:p-10 lg:border-t-0">
            <figure>
              <figcaption className="label text-text-3">BOT-A equity by street</figcaption>
              <svg viewBox={`0 0 ${W} ${H + 18}`} className="mt-4 w-full" role="img" aria-label={eq.slice(0, street + 1).map((v, i) => `${STREETS[i]} ${(v * 100).toFixed(0)}%`).join(", ")}>
                {[0, 0.5, 1].map((v) => (
                  <g key={v}>
                    <line x1="16" x2={W - 16} y1={y(v)} y2={y(v)} stroke="var(--ivory)" strokeOpacity={v === 0.5 ? 0.25 : 0.08} strokeDasharray={v === 0.5 ? "3 4" : undefined} />
                    <text x="0" y={y(v) + 3} fill="var(--ivory)" fillOpacity=".45" fontSize="8" fontFamily="var(--font-mono)">
                      {v * 100}
                    </text>
                  </g>
                ))}
                {STREETS.map((s, i) => (
                  <text key={s} x={x(i)} y={H + 14} textAnchor={i === 0 ? "start" : i === STREETS.length - 1 ? "end" : "middle"} fill="var(--ivory)" fillOpacity={i <= street ? 0.7 : 0.25} fontSize="8" fontFamily="var(--font-mono)">
                    {s.toUpperCase()}
                  </text>
                ))}
                <polyline points={pts.join(" ")} fill="none" stroke="var(--gold-bright)" strokeWidth="1.5" />
                {eq.slice(0, street + 1).map((v, i) => (
                  <circle key={i} cx={x(i)} cy={y(v)} r={i === street ? 3.5 : 2.5} fill={i === street ? "var(--gold-bright)" : "var(--felt-900)"} stroke="var(--gold-bright)" />
                ))}
              </svg>
            </figure>

            <div>
              <p className="label text-text-3">Decision log</p>
              <ol className="mt-4 space-y-2 font-mono text-[12px] leading-relaxed text-text-2">
                {eq.slice(0, street + 1).map((e, i) => (
                  <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-2">
                    <span className="text-text-3">{STREETS[i].toLowerCase()}</span>
                    <span>
                      A {act(e)} <span className="text-text-3">· eq {e.toFixed(2)}</span>
                      <br />B {act(1 - e)} <span className="text-text-3">· eq {(1 - e).toFixed(2)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Seat({ name, cards, eq, up }: { name: string; cards: number[]; eq: number; up?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${up ? "" : "flex-row-reverse text-right"}`}>
      <div className="flex -space-x-3">
        {cards.map((c, i) => (
          <PlayingCard key={i} code={label(c)} className={`[--w:clamp(40px,8vw,58px)] ${i ? "rotate-6" : "-rotate-3"}`} />
        ))}
      </div>
      <div>
        <p className="font-mono text-xs tracking-[0.12em] text-ivory">{name}</p>
        <p className="font-mono text-[11px] text-text-3">{cards.map(label).join(" ")}</p>
        <p className="mt-1 font-mono text-sm tabular-nums text-ivory">{(eq * 100).toFixed(0)}%</p>
      </div>
    </div>
  );
}
