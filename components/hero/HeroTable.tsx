"use client";
import { createPortal } from "react-dom";
import { forwardRef, useSyncExternalStore, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PlayingCard } from "@/components/ui/PlayingCard";
import { SUIT_PATHS } from "@/components/ui/Suit";
import { clink, flip } from "@/lib/sound";
import { BOARD, DEALER_SEAT, POT, SEATS, TH, TW, fakeDecision, newHand, toward, type Hand } from "./table";

const CHIP = ["var(--chip-red)", "var(--chip-black)", "var(--chip-blue)", "var(--chip-white)"];
const BOARD_W = 58;
const HOLE_W = 38;
const POT_STACKS = 3;
const POT_PER = 9;

/** Same first hand on server and client; random after that. */
const FIRST: Hand = {
  id: 0,
  holes: [["Kd", "Qd"], ["9c", "9h"], ["Ah", "7s"], ["Jc", "Tc"], ["5d", "5s"], ["Kh", "2c"], ["As", "Ac"], ["8d", "6d"]],
  board: ["Ad", "Jd", "9s", "Td", "3c"],
  live: [0, 6],
  winner: 0,
  bettors: [0, 6],
};

const noop = () => () => {};

/** deterministic jitter so stacks look hand-placed */
const j = (i: number, k: number) => ((i * 7919 + k * 104729 + 13) % 1000) / 1000;

function Stack({ n, color, d = 26, className = "", dim = false }: { n: number; color: string; d?: number; className?: string; dim?: boolean }) {
  return (
    <div className={`absolute [transform-style:preserve-3d] ${className}`} style={{ width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2 }}>
      <div className="absolute -inset-1 rounded-full bg-[radial-gradient(closest-side,rgb(0_0_0/.55),transparent)]" style={{ transform: "translate(3px,4px)" }} />
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          className="cchip absolute inset-0"
          style={
            {
              "--c": i % 5 === 4 && !dim ? "var(--chip-white)" : color,
              "--d": `${d}px`,
              transform: `translate3d(${j(i, d) * 1.6}px, ${j(d, i) * 1.6}px, ${i * 3.4 + 1}px) rotate(${j(i, 3) * 90}deg)`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export type TableHandle = { allIn: () => void };

export const HeroTable = forwardRef<TableHandle, { playing: boolean; reduced: boolean }>(function HeroTable({ playing, reduced }, handle) {
  const root = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const [hand, setHand] = useState<Hand>(FIRST);
  const busy = useRef(false);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playRef = useRef(playing);

  // ---- the hand loop ----
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const boards = q(".t-board");
      const holes = q(".t-hole");
      const potChips = q(".t-pot .cchip");
      const pots = q(".t-pot");
      const showPot = (lvl: number) => potChips.forEach((c, i) => gsap.set(c, { autoAlpha: i % POT_PER < Math.ceil(lvl / POT_STACKS) ? 1 : 0 }));

      if (reduced) {
        gsap.set(boards.map((b) => b.firstElementChild), { rotationY: 0 });
        holes.forEach((h) => {
          const seat = Number(h.dataset.seat);
          gsap.set(h.firstElementChild, { rotationY: hand.live.includes(seat) ? 0 : 180 });
        });
        showPot(16);
        q(`.t-seat[data-seat="${hand.winner}"]`)[0]?.setAttribute("data-win", "");
        return;
      }

      const dealer = toward(DEALER_SEAT, 0.16);
      const fromDealer = (el: Element) => {
        const x = Number((el as HTMLElement).dataset.x);
        const y = Number((el as HTMLElement).dataset.y);
        return { x: dealer.x - x, y: dealer.y - y };
      };
      const think = (seat: number) => () => {
        q(".t-seat").forEach((s) => s.removeAttribute("data-think"));
        if (seat >= 0) q(`.t-seat[data-seat="${seat}"]`)[0]?.setAttribute("data-think", "");
      };
      const [a, b] = hand.live;
      const folders = SEATS.map((_, i) => i).filter((i) => !hand.live.includes(i));

      const tl = gsap.timeline({ paused: !playRef.current, onComplete: () => setHand(newHand(hand.id + 1)) });
      tl.add(() => {
        q(".t-seat").forEach((s) => s.removeAttribute("data-win"));
        showPot(0);
      });
      tl.set(pots, { x: 0, y: 0, autoAlpha: 1 });
      boards.forEach((el) => tl.set(el, { ...fromDealer(el), z: 0, rotation: 0, autoAlpha: 0 }, 0));
      holes.forEach((el) => tl.set(el, { ...fromDealer(el), z: 0, autoAlpha: 0 }, 0));
      tl.set([...boards, ...holes].map((e) => e.firstElementChild), { rotationY: 180 }, 0);

      // deal hole cards round the table, then the board face down
      holes.forEach((el, k) => {
        tl.to(el, { x: 0, y: 0, autoAlpha: 1, duration: 0.42, ease: "expo.out" }, 0.05 + k * 0.025);
        tl.to(el, { keyframes: { z: [0, 26, 0] }, duration: 0.42, ease: "none" }, 0.05 + k * 0.025);
      });
      tl.call(() => flip(), [], 0.05);
      boards.forEach((el, k) => {
        tl.to(el, { x: 0, y: 0, autoAlpha: 1, rotation: (j(k, hand.id) - 0.5) * 6, duration: 0.5, ease: "expo.out" }, 0.55 + k * 0.07);
        tl.to(el, { keyframes: { z: [0, 40, 0] }, duration: 0.5, ease: "none" }, 0.55 + k * 0.07);
      });

      const bet = (seat: number, at: number) => {
        const el = q(`.t-bet[data-seat="${seat}"]`)[0];
        const p = toward(seat, 0.44);
        const s = toward(seat, 0.2, 30);
        tl.set(el, { x: 0, y: 0, autoAlpha: 1 }, at);
        tl.to(el, { x: p.x - s.x, y: p.y - s.y, duration: 0.45, ease: "expo.out" }, at);
        tl.call(() => clink(), [], at + 0.3);
      };
      const collect = (seats: number[], at: number, lvl: number) => {
        seats.forEach((seat) => {
          const el = q(`.t-bet[data-seat="${seat}"]`)[0];
          const s = toward(seat, 0.2, 30);
          tl.to(el, { x: POT.x - s.x, y: POT.y - s.y, duration: 0.4, ease: "power3.in" }, at);
          tl.set(el, { autoAlpha: 0 }, at + 0.4);
        });
        tl.add(() => showPot(lvl), at + 0.4);
      };
      const flipCards = (els: Element[], at: number) => {
        tl.to(els.map((e) => e.firstElementChild), { rotationY: 0, duration: 0.55, ease: "expo.out", stagger: 0.11 }, at);
        tl.call(() => flip(), [], at);
      };

      tl.add(think(a), 0.9);
      bet(a, 1.0);
      bet(b, 1.15);
      flipCards(boards.slice(0, 3), 1.6);
      tl.add(think(b), 1.9);
      folders.forEach((seat, k) => {
        const hs = q(`.t-hole[data-seat="${seat}"]`);
        const c = toward(seat, 0.62);
        hs.forEach((h) => tl.to(h, { x: c.x - Number(h.dataset.x), y: c.y - Number(h.dataset.y), autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 2.0 + k * 0.12));
      });
      collect([a, b], 2.3, 8);
      flipCards(boards.slice(3, 4), 3.0);
      tl.add(think(a), 3.2);
      bet(a, 3.3);
      bet(b, 3.5);
      collect([a, b], 4.0, 18);
      flipCards(boards.slice(4, 5), 4.1);
      tl.add(think(-1), 4.6);
      flipCards(q(`.t-hole[data-seat="${a}"], .t-hole[data-seat="${b}"]`), 4.7);
      tl.add(() => q(`.t-seat[data-seat="${hand.winner}"]`)[0]?.setAttribute("data-win", ""), 5.3);
      const w = toward(hand.winner, 0.24);
      tl.to(pots, { x: w.x - POT.x, y: w.y - POT.y, duration: 0.6, ease: "expo.inOut", stagger: 0.04 }, 5.45);
      tl.call(() => clink(), [], 5.9);
      tl.to(pots, { autoAlpha: 0, duration: 0.3 }, 6.3);
      tl.to([...boards, ...holes], { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 6.5);
      tl.to({}, { duration: 0.1 }, 6.85);
      tlRef.current = tl;
    },
    { scope: root, dependencies: [hand, reduced], revertOnUpdate: true },
  );

  // play / pause from the parent (offscreen, hidden tab, not yet dealt)
  useEffect(() => {
    playRef.current = playing;
    tlRef.current?.paused(!playing);
  }, [playing]);

  // click the felt: a random seat shoves its stack in, gold shockwave from the pot
  useImperativeHandle(handle, () => ({
    allIn() {
    if (busy.current || reduced) return;
    busy.current = true;
    const seat = (Math.random() * SEATS.length) | 0;
    const q = gsap.utils.selector(root);
    const stack = q(`.t-stack[data-seat="${seat}"]`)[0];
    const plate = q(`.t-seat[data-seat="${seat}"]`)[0];
    const ring = q(".t-ring")[0];
    const s = toward(seat, 0.2, -30);
    plate?.setAttribute("data-allin", "");
    clink();
    clink(0.06);
    gsap
      .timeline({ onComplete: () => void ((busy.current = false), plate?.removeAttribute("data-allin")) })
      .to(stack, { x: POT.x - s.x, y: POT.y - s.y + 34, duration: 0.45, ease: "power3.in" })
      .fromTo(ring, { scale: 0.2, autoAlpha: 1 }, { scale: 7, autoAlpha: 0, duration: 0.7, ease: "expo.out" }, 0.42)
      .to(stack, { autoAlpha: 0, duration: 0.2 }, 0.9)
      .set(stack, { x: 0, y: 0 })
      .to(stack, { autoAlpha: 1, duration: 0.4 }, 1.4);
    },
  }), [reduced]);

  const onSeat = (i: number) => (e: PointerEvent<HTMLDivElement>) => {
    const t = tip.current;
    if (!t) return;
    t.textContent = fakeDecision(SEATS[i].name);
    t.style.left = `${e.clientX}px`;
    t.style.top = `${e.clientY}px`;
    t.dataset.on = "";
  };
  const offSeat = () => tip.current?.removeAttribute("data-on");

  return (
    <div ref={root} className="t-plane absolute [transform-style:preserve-3d]" style={{ width: TW, height: TH }}>
      {/* floor shadow and table body (thickness) */}
      <div className="absolute -inset-[6%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/.75),transparent)]" style={{ transform: "translateZ(-90px)" }} />
      <div className="absolute inset-0 rounded-[310px] bg-[linear-gradient(#000,#0b0d0c)]" style={{ transform: "translateZ(-30px)" }} />
      <div className="absolute inset-0 rounded-[310px] bg-[#050706]" style={{ transform: "translateZ(-15px)" }} />

      {/* padded rail */}
      <div className="t-rail absolute inset-0 rounded-[310px]">
        <div className="absolute inset-[11px] rounded-[300px] border border-dashed border-gold/35" />
      </div>
      {/* gold inlay + felt */}
      <div className="absolute inset-[42px] rounded-[268px] bg-[linear-gradient(140deg,var(--gold-bright),#8a6a2a_40%,var(--gold)_70%,#6b5020)]" />
      <div className="t-felt absolute inset-[46px] rounded-[264px]" />

      {/* felt markings */}
      <svg className="absolute inset-0" width={TW} height={TH} viewBox={`0 0 ${TW} ${TH}`} aria-hidden>
        <defs>
          <path id="t-arc" d="M300 214 Q550 128 800 214" />
        </defs>
        <rect x="120" y="120" width="860" height="380" rx="190" fill="none" stroke="var(--gold)" strokeOpacity=".45" strokeWidth="1.5" />
        <rect x="130" y="130" width="840" height="360" rx="180" fill="none" stroke="var(--gold)" strokeOpacity=".18" strokeWidth="1" />
        <text fill="var(--gold)" fillOpacity=".6" style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.32em" }}>
          <textPath href="#t-arc" startOffset="50%" textAnchor="middle">
            EXEALABS · RESEARCH HACKATHON
          </textPath>
        </text>
        <g transform="translate(250 312)" fill="var(--gold)" fillOpacity=".55">
          <path d={SUIT_PATHS.s} transform="translate(-14 -58) scale(1.15)" />
          <text y="22" textAnchor="middle" style={{ fontFamily: "var(--font-display)", fontSize: 44, letterSpacing: "-0.02em" }}>
            ALL <tspan fontStyle="italic">IN</tspan>
          </text>
        </g>
        {BOARD.map((p, i) => (
          <rect key={i} x={p.x - 31} y={p.y - 42} width="62" height="84" rx="6" fill="none" stroke="var(--gold)" strokeOpacity=".16" />
        ))}
      </svg>

      {/* seats */}
      {SEATS.map((s, i) => (
        <div
          key={s.name}
          className="t-seat absolute -mt-[14px] -ml-[52px] flex h-7 w-[104px] items-center justify-center gap-2 rounded-full border border-gold/40 bg-[#0b0d0c]/95 font-mono text-[11px] tracking-[0.12em] text-ivory/85 shadow-[0_4px_10px_rgb(0_0_0/.5)]"
          style={{ left: s.x, top: s.y, transform: "translateZ(4px)" }}
          data-seat={i}
          onPointerEnter={onSeat(i)}
          onPointerMove={onSeat(i)}
          onPointerLeave={offSeat}
        >
          <span className="t-dot h-1.5 w-1.5 rounded-full bg-ivory/30" />
          <span className="t-name">{s.name}</span>
        </div>
      ))}
      {/* dealer button */}
      {(() => {
        const p = toward(DEALER_SEAT, 0.14, -34);
        return (
          <div className="absolute -mt-3 -ml-3 grid h-6 w-6 place-items-center rounded-full bg-ivory font-display text-sm text-ink shadow-[0_3px_6px_rgb(0_0_0/.6),inset_0_-2px_0_rgb(0_0_0/.15)]" style={{ left: p.x, top: p.y, transform: "translateZ(3px)" }}>
            D
          </div>
        );
      })()}

      {/* seat stacks + bets */}
      {SEATS.map((_, i) => {
        const p = toward(i, 0.2, -30);
        const b = toward(i, 0.2, 30);
        return (
          <div key={i}>
            <div className="t-stack absolute [transform-style:preserve-3d]" data-seat={i} style={{ left: p.x, top: p.y }}>
              <Stack n={4 + (i % 4)} color={CHIP[i % 4]} />
              <Stack n={2 + ((i * 3) % 4)} color={CHIP[(i + 1) % 4]} className="translate-x-[22px] translate-y-[6px]" />
            </div>
            <div className="t-bet invisible absolute [transform-style:preserve-3d]" data-seat={i} style={{ left: b.x, top: b.y }}>
              <Stack n={3} color={CHIP[(i + 2) % 4]} d={22} />
            </div>
          </div>
        );
      })}

      {/* hole cards */}
      {SEATS.map((_, i) =>
        [0, 1].map((k) => {
          const p = toward(i, 0.3, k ? 12 : -12);
          return (
            <div key={`${i}-${k}`} className="t-hole absolute [transform-style:preserve-3d]" data-seat={i} data-x={p.x} data-y={p.y} style={{ left: p.x - HOLE_W / 2, top: p.y - (HOLE_W * 1.4) / 2, rotate: `${(k ? 7 : -5) + j(i, k) * 4}deg` }}>
              <PlayingCard code={hand.holes[i][k]} w={HOLE_W} down />
            </div>
          );
        }),
      )}

      {/* board */}
      {BOARD.map((p, i) => (
        <div key={i} className="t-board absolute [transform-style:preserve-3d]" data-x={p.x} data-y={p.y} style={{ left: p.x - BOARD_W / 2, top: p.y - (BOARD_W * 1.4) / 2 }}>
          <PlayingCard code={hand.board[i]} w={BOARD_W} down />
        </div>
      ))}

      {/* pot */}
      {Array.from({ length: POT_STACKS }, (_, k) => (
        <div key={k} className="t-pot absolute [transform-style:preserve-3d]" style={{ left: POT.x + (k - 1) * 30, top: POT.y + (k === 1 ? -8 : 4) }}>
          <Stack n={POT_PER} color={CHIP[k]} d={28} />
        </div>
      ))}
      <div className="t-ring invisible absolute -mt-10 -ml-10 h-20 w-20 rounded-full border-2 border-gold-bright shadow-[0_0_30px_var(--gold)]" style={{ left: POT.x, top: POT.y, transform: "translateZ(6px)" }} />

      {mounted && createPortal(<div ref={tip} role="presentation" className="t-tip pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-full border border-gold/40 bg-felt-950/95 px-3 py-1.5 font-mono text-[11px] whitespace-nowrap text-ivory opacity-0 transition-opacity duration-200" />, document.body)}
    </div>
  );
});
