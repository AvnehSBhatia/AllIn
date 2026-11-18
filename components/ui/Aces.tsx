"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { aces, SUITS, type Suit as SuitName } from "@/lib/aces";
import { config } from "@/lib/config";
import { flip } from "@/lib/sound";
import { gsap } from "@/lib/gsap";
import { PlayingCard } from "./PlayingCard";

const CODE: Record<SuitName, string> = { spades: "As", hearts: "Ah", diamonds: "Ad", clubs: "Ac" };

export const useAces = () => useSyncExternalStore(aces.subscribe, aces.get, aces.server);

/** One of the four hidden aces. Small, tucked in, a real button. */
export function HiddenAce({ suit, className = "", rotate = -8 }: { suit: SuitName; className?: string; rotate?: number }) {
  const found = useAces().includes(suit);
  const ref = useRef<HTMLButtonElement>(null);
  const take = () => {
    if (found) return;
    flip();
    gsap.fromTo(ref.current, { rotationY: 180 }, { rotationY: 0, duration: 0.6, ease: "expo.out" });
    aces.find(suit);
  };
  return (
    <button
      ref={ref}
      type="button"
      onClick={take}
      aria-label={found ? `Ace of ${suit}, found` : "A card, face down"}
      className={`group inline-grid h-11 w-11 place-items-center transition-[opacity,transform] duration-300 ${found ? "opacity-100" : "opacity-55 hover:-translate-y-1 hover:opacity-100"} ${className}`}
      style={{ rotate: `${rotate}deg` }}
    >
      <PlayingCard code={CODE[suit]} down={!found} w={22} className={found ? "drop-shadow-[0_0_6px_var(--gold)]" : ""} />
    </button>
  );
}

/** "You've got the nuts" when the fourth ace turns up. Native <dialog> handles focus and Escape. */
export function AcesOverlay() {
  const found = useAces();
  const dlg = useRef<HTMLDialogElement>(null);
  const prev = useRef<number | null>(null);
  useEffect(() => {
    if (prev.current !== null && prev.current < 4 && found.length === 4) {
      dlg.current?.showModal();
      gsap.from(".nuts-card", { y: 60, rotate: 0, opacity: 0, duration: 0.7, ease: "back.out(1.6)", stagger: 0.08 });
    }
    prev.current = found.length;
  }, [found.length]);
  return (
    <dialog
      ref={dlg}
      className="m-auto w-[min(92vw,34rem)] bg-transparent p-0 text-ivory backdrop:bg-felt-950/80 backdrop:backdrop-blur-sm"
      aria-labelledby="nuts-title"
    >
      <div className="felt px-6 pt-10 pb-8 text-center md:px-10">
        <div className="mb-8 flex justify-center">
          {SUITS.map((s, i) => (
            <div key={s} className="nuts-card -mx-2" style={{ rotate: `${(i - 1.5) * 9}deg`, translate: `0 ${Math.abs(i - 1.5) * 6}px` }}>
              <PlayingCard code={CODE[s]} w={78} />
            </div>
          ))}
        </div>
        <h2 id="nuts-title" className="h3 text-[clamp(2.2rem,5vw,3rem)]">
          {config.puzzle.title}
        </h2>
        <p className="lede mx-auto mt-3">{config.puzzle.message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn btn-gold" onClick={() => dlg.current?.close()} autoFocus>
            Back to the table
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              aces.reset();
              dlg.current?.close();
            }}
          >
            Hide them again
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function AcesCount() {
  const n = useAces().length;
  return <span className="tabular-nums">{n}/4</span>;
}
