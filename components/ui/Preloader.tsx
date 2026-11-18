"use client";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markDealt } from "@/lib/dealt";
import { ease } from "@/lib/motion";
import { PlayingCard } from "./PlayingCard";
import { clink, flip } from "@/lib/sound";

const STACK = ["var(--chip-red)", "var(--chip-blue)", "var(--chip-black)", "var(--chip-white)", "var(--chip-red)"];

/**
 * Card is dealt, flips to A♠, chips stack, counter runs to 100, curtain splits.
 * ~2.1s, once per session, skippable. Hidden before hydration for returning visitors (see layout head script).
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (document.documentElement.dataset.dealt) return;
      const n = { v: 0 };
      const counter = ref.current!.querySelector<HTMLElement>(".pl-count")!;
      const tl = gsap.timeline({ defaults: { ease: ease.out } });
      tl.fromTo(".pl-card", { y: 160, rotate: -24, opacity: 0 }, { y: 0, rotate: -5, opacity: 1, duration: 0.55, onStart: () => flip() })
        .fromTo(".pl-card .pc", { rotationY: 180 }, { rotationY: 0, duration: 0.55, onStart: () => flip() }, 0.42)
        .from(".pl-chip", { y: -90, opacity: 0, duration: 0.42, ease: ease.snap, stagger: { each: 0.1, onStart: () => clink() } }, 0.3)
        .to(n, { v: 100, duration: 1.45, ease: "power2.inOut", onUpdate: () => (counter.textContent = String(Math.round(n.v)).padStart(3, "0")) }, 0)
        .to(".pl-stage", { scale: 0.92, opacity: 0, duration: 0.35, ease: ease.in }, 1.5)
        .to(".pl-top", { yPercent: -100, duration: 0.6, ease: ease.inOut }, 1.55)
        .to(".pl-bot", { yPercent: 100, duration: 0.6, ease: ease.inOut }, 1.55)
        .call(markDealt, [], 1.7)
        .set(ref.current, { display: "none" });

      const skip = () => {
        if (tl.time() < 1.5) tl.seek(1.5);
      };
      window.addEventListener("keydown", skip);
      ref.current!.addEventListener("pointerdown", skip);
      return () => window.removeEventListener("keydown", skip);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="preloader fixed inset-0 z-[95] select-none" role="status" aria-label="Loading ALL IN. Press any key to skip.">
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 bg-felt-950" />
      <div className="pl-bot absolute inset-x-0 bottom-0 h-1/2 border-t border-hair bg-felt-950" />
      <div className="pl-stage absolute inset-0 flex items-center justify-center gap-10">
        <div className="pl-card [perspective:900px]">
          <PlayingCard code="As" down w={124} />
        </div>
        <div className="flex flex-col-reverse" aria-hidden>
          {STACK.map((c, i) => (
            <div key={i} className="pl-chip -mt-[46px] h-[54px] w-[54px] first:mt-0" style={{ transform: "rotateX(62deg)" }}>
              <div className="cchip h-full w-full" style={{ "--c": c, "--d": "54px" } as CSSProperties} />
            </div>
          ))}
        </div>
      </div>
      <p className="label absolute bottom-6 left-5 text-text-3 md:left-8">Shuffle up and deal</p>
      <p className="absolute right-5 bottom-5 font-mono text-4xl tabular-nums text-ivory md:right-8 md:text-6xl">
        <span className="pl-count">000</span>
      </p>
      <p className="label absolute top-6 right-5 text-text-3 md:right-8">Any key to skip</p>
    </div>
  );
}
