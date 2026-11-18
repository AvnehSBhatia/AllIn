"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { config } from "@/lib/config";
import { onDealt } from "@/lib/dealt";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PlayingCard } from "@/components/ui/PlayingCard";
import { PushAllIn } from "@/components/ui/PushAllIn";
import { HiddenAce } from "@/components/ui/Aces";
import { HeroTable, type TableHandle } from "@/components/hero/HeroTable";
import { HeroChips } from "@/components/hero/HeroChips";
import { TH, TILT_X, TILT_Z, TW } from "@/components/hero/table";

/** A few cards resting at the edges of the frame, clear of the nav, the headline and both corner captions. */
const EDGE = [
  { code: "Ks", w: 92, cls: "right-[-34px] bottom-[30%] lg:bottom-auto lg:top-[16%] lg:right-[-18px]", r: -18, from: "x" },
  { code: "Qd", w: 84, cls: "right-[6%] bottom-[-44px] lg:right-auto lg:left-[48%]", r: 12, from: "y" },
  { code: "9s", w: 58, cls: "left-[-26px] bottom-[4%] lg:hidden", r: -14, from: "x" },
  { code: "Ac", down: true, w: 66, cls: "right-[-24px] bottom-[34%] hidden lg:block", r: 98, from: "x" },
] as const;

const FACTS = [
  ["When", config.date ? new Date(config.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : config.dateWindow],
  ["Length", config.durationLabel],
  ["Format", config.format],
  ["Seats", `~${config.capacity}`],
] as const;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const table = useRef<TableHandle>(null);
  const reduced = useReducedMotion();
  const [dealt, setDealt] = useState(false);
  const [visible, setVisible] = useState(true);
  const playing = dealt && visible;

  useEffect(() => onDealt(() => setDealt(true)), []);

  // pause everything when the hero is off screen or the tab is hidden
  useEffect(() => {
    const el = root.current!;
    let onScreen = true;
    const sync = () => setVisible(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => ((onScreen = e.isIntersecting), sync()));
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // scale the 1100×620 plane to its box
  useEffect(() => {
    const el = stage.current!;
    const ro = new ResizeObserver(([e]) => el.style.setProperty("--k", String(e.contentRect.width / TW)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // entrance (~1.6s) once the preloader is done, and cursor parallax
  useGSAP(
    () => {
      if (!dealt) return;
      const q = gsap.utils.selector(root);
      if (reduced) {
        gsap.set(q(".h-in"), { autoAlpha: 1 });
        return;
      }
      const word = q(".h-word")[0];
      const split = SplitText.create(word, { type: "chars", aria: "auto" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.set(q(".h-in"), { autoAlpha: 1 })
        .from(q(".h-rise"), { y: 140, rotationX: 22, autoAlpha: 0, duration: 1.2 }, 0)
        .from(split.chars, { yPercent: 105, duration: 0.9, stagger: 0.05 }, 0.15)
        .from(q(".h-fade"), { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.07 }, 0.45)
        .from(q(".h-edge"), { x: (_, el: HTMLElement) => (el.dataset.from === "x" ? (el.offsetLeft < innerWidth / 2 ? -160 : 160) : 0), y: (_, el: HTMLElement) => (el.dataset.from === "y" ? (el.offsetTop < 200 ? -160 : 160) : 0), rotate: "+=30", duration: 0.9, stagger: 0.06 }, 0.3)
        .from(q(".h-chips"), { autoAlpha: 0, duration: 0.8, ease: "power1.out" }, 0.5)
        // chars done: put the word back together, then sweep a glint across it once
        .add(() => {
          split.revert();
          word.classList.add("glint");
        }, 1.05)
        .fromTo(word, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 0.55, ease: "power2.inOut", immediateRender: false }, 1.05);

      // parallax: the table leans toward the cursor, at most 4 degrees
      const tilt = q(".h-tilt")[0];
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        rx(-(e.clientY / innerHeight - 0.5) * 8);
        ry((e.clientX / innerWidth - 0.5) * 8);
      };
      addEventListener("pointermove", move, { passive: true });
      return () => removeEventListener("pointermove", move);
    },
    { scope: root, dependencies: [dealt, reduced] },
  );

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative isolate flex flex-col overflow-clip bg-felt-950 pb-10 lg:block lg:min-h-[max(100svh,760px)] lg:pb-0">
      {/* spotlight from above the table, with dust in the beam */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_74%_30%,color-mix(in_oklab,var(--felt-600)_55%,transparent),transparent_70%),radial-gradient(40%_40%_at_74%_8%,rgb(242_217_138/.10),transparent_70%)] max-lg:bg-[radial-gradient(90%_50%_at_50%_70%,color-mix(in_oklab,var(--felt-600)_50%,transparent),transparent_70%)]" />
      <div aria-hidden className="dust pointer-events-none absolute inset-0" />

      <div className="h-chips h-in invisible">
        <HeroChips playing={playing} reduced={reduced} />
      </div>

      {/* table: right 55%, bleeding off the right edge. Below 1024 it sits under the text. */}
      <div
        className="relative z-[2] order-2 mx-auto mt-6 aspect-[1100/640] w-[128%] -translate-x-[11%] [perspective:1800px] max-lg:max-w-[980px] lg:absolute lg:top-1/2 lg:right-[-14%] lg:mt-0 lg:w-[68%] lg:translate-x-0 lg:-translate-y-[46%] lg:[perspective:2200px]"
        onClick={() => table.current?.allIn()}
        role="presentation"
      >
        <div className="h-rise h-in invisible absolute inset-0 [transform-style:preserve-3d]">
          <div ref={stage} className="h-tilt absolute inset-0 [transform-style:preserve-3d]">
            <div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]" style={{ transform: `translate(-50%,-50%) scale(var(--k,.6)) rotateX(${TILT_X}deg) rotateZ(${TILT_Z}deg)`, width: TW, height: TH }}>
              <HeroTable ref={table} playing={playing} reduced={reduced} />
            </div>
          </div>
        </div>
      </div>

      {/* edge cards */}
      {EDGE.map((c) => (
        <div key={c.code} aria-hidden data-from={c.from} className={`h-edge h-in invisible pointer-events-none absolute z-[1] ${c.cls}`} style={{ rotate: `${c.r}deg` }}>
          <PlayingCard code={c.code} w={c.w} down={"down" in c} className="drop-shadow-[0_12px_20px_rgb(0_0_0/.35)]" />
        </div>
      ))}

      {/* text zone: left 45% */}
      <div className="relative z-[4] order-1 mx-auto flex w-full max-w-[1440px] flex-col px-5 pt-28 md:px-10 lg:min-h-[max(100svh,760px)] lg:justify-center lg:pt-24 lg:pb-16">
        <div className="lg:max-w-[45%] xl:max-w-[42%]">
          <p className="h-fade h-in invisible flex items-center gap-3">
            <span className="text-[1.05rem] font-semibold tracking-[-0.01em] text-ivory">{config.organizer}</span>
            <span aria-hidden className="h-4 w-px bg-hair" />
            <span className="label text-text-2">The Research Hackathon</span>
          </p>
          <h1 id="hero-title" className="h-title mt-5 font-display text-[clamp(4.4rem,16vw,6.75rem)] leading-[0.88] tracking-[-0.03em] lg:text-[clamp(6rem,9vw,9rem)]">
            <span className="h-word h-in invisible block pb-[0.06em]">
              ALL <em className="not-italic lg:italic">IN</em>
            </span>
          </h1>
          <p className="h-fade h-in invisible mt-6 max-w-[30ch] font-display text-[clamp(1.35rem,2vw,1.8rem)] leading-[1.2] text-ivory">{config.tagline}</p>
          <p className="h-fade h-in invisible mt-4 max-w-[40ch] text-text-2">An AI poker-bot competition on a variant we wrote. The rules stay sealed until kickoff.</p>

          <dl className="h-fade h-in invisible mt-8 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-3 border-t border-hair pt-5 sm:grid-cols-4">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="label text-text-3">{k}</dt>
                <dd className="mt-1 font-mono text-[13px] text-ivory">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="h-fade h-in invisible mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <PushAllIn>Apply for a seat</PushAllIn>
            <a href="#game" className="link font-mono text-[12px] tracking-[0.14em] text-text-2 uppercase hover:text-ivory">
              Read the game
            </a>
          </div>
        </div>
      </div>

      {/* corner marks */}
      <div aria-hidden className="h-fade h-in invisible pointer-events-none absolute inset-x-5 bottom-5 z-[4] hidden items-end justify-between font-mono text-[10px] tracking-[0.2em] text-text-3 uppercase md:inset-x-10 lg:flex">
        <span className="border-l border-b border-hair pb-1 pl-2">Table 01 · 8-max · virtual chips</span>
        <span className="border-r border-b border-hair pr-2 pb-1">Click the felt</span>
      </div>
      <HiddenAce suit="spades" rotate={-14} className="absolute right-4 bottom-4 z-[5] lg:right-[3%] lg:bottom-[12%]" />
    </section>
  );
}
