"use client";
import { Fragment, useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { FRAMES, POSTER_SMALL, frameSrc } from "@/lib/intro";

const FACTS = [
  ["When", config.date ? new Date(config.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }) : config.dateWindow],
  ["Where", config.venueCity ?? "TBA"],
  ["Seats", `About ${config.capacity}`],
] as const;

/** Large screens with motion allowed get the film. Everyone else gets its first frame, then the pitch under it. */
const FILM = "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 640px)";
/** the camera move uses this share of the pinned scroll; the rest holds on the landing while the pitch arrives */
const MOVE = 0.78;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * The way in. A filmed camera move (public/intro, cut into stills) from above the table down onto the felt.
 * With the film on, the first screen is pinned and scrolling scrubs the stills on a canvas: the name sits over the
 * opening frame, the pitch over the landing. The frame shown eases toward the scroll position, so a wheel notch
 * never jumps. Scroll back up and it plays in reverse.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d", { alpha: false })!;
    const copy = el.querySelector<HTMLElement>(".hero-copy")!;
    const land = el.querySelector<HTMLElement>(".hero-land")!;
    const shade = el.querySelector<HTMLElement>(".hero-shade")!;
    const dim = el.querySelector<HTMLElement>(".hero-dim")!;
    const mq = matchMedia(FILM);
    let teardown = () => {};

    const setup = () => {
      teardown();
      if (!mq.matches) return el.removeAttribute("data-film");
      el.setAttribute("data-film", "");

      // stills load in order, a few at a time; until one arrives the nearest earlier one is shown
      const imgs: (HTMLImageElement | undefined)[] = new Array(FRAMES);
      let next = 0;
      let alive = true;
      const pump = () => {
        if (!alive || next >= FRAMES) return;
        const k = next++;
        const im = new Image();
        im.decoding = "async";
        im.src = frameSrc(k);
        // decode off the main thread first, so drawing a still never stalls a frame
        im.decode().then(
          () => {
            imgs[k] = im;
            if (shown > k || shown === -1 || k - shown < 3) shown = -1; // a better still may now exist for this position
            pump();
          },
          () => pump(),
        );
      };
      // the film waits for the page: fonts and the opening frame come first, then stills four at a time
      const start = () => {
        for (let k = 0; k < 4; k++) pump();
      };
      if (document.readyState === "complete") start();
      else addEventListener("load", start, { once: true });

      // canvas backing store follows the screen, capped so a 5K display doesn't fill 14M pixels a frame
      let cw = 0;
      let ch = 0;
      const size = () => {
        const dpr = Math.min(devicePixelRatio || 1, 1.5);
        cw = cv.width = Math.round(cv.clientWidth * dpr);
        ch = cv.height = Math.round(cv.clientHeight * dpr);
        shown = -1;
      };
      let shown = -1;
      const draw = (k: number) => {
        let im: HTMLImageElement | undefined;
        for (let j = k; j >= 0 && !im; j--) im = imgs[j];
        if (!im) return;
        // cover
        const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
        const w = im.naturalWidth * s;
        const h = im.naturalHeight * s;
        ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
        shown = k;
      };

      let cur = 0; // eased position, 0..1 through the pinned scroll
      let raf = 0;
      let near = true;
      const tick = () => {
        raf = 0;
        const span = el.offsetHeight - innerHeight;
        const target = clamp(scrollY / span);
        cur += (target - cur) * 0.14;
        if (Math.abs(target - cur) < 0.0004) cur = target;
        const k = Math.round(ease(clamp(cur / MOVE)) * (FRAMES - 1));
        if (k !== shown) draw(k);
        // the name leaves early; the pitch arrives once the camera has landed
        const out = clamp(cur / 0.16);
        const inn = clamp((cur - MOVE + 0.06) / 0.14);
        copy.style.opacity = String(1 - out);
        copy.style.transform = `translate3d(${(-60 * out).toFixed(1)}px,0,0)`;
        shade.style.opacity = String(1 - out);
        dim.style.opacity = String(inn * 0.8);
        land.style.opacity = String(inn);
        land.style.transform = `translate3d(0,${(26 * (1 - inn)).toFixed(1)}px,0)`;
        copy.inert = out > 0.6;
        land.inert = inn < 0.5;
        if (near && (cur !== target || shown === -1)) raf = requestAnimationFrame(tick);
      };
      const kick = () => near && (raf ||= requestAnimationFrame(tick));
      const io = new IntersectionObserver(([e]) => ((near = e.isIntersecting), kick()));
      io.observe(el);
      const ro = new ResizeObserver(() => (size(), kick()));
      ro.observe(cv);
      size();
      // stills keep arriving after the scroll has settled: repaint when one could improve the picture
      const poll = setInterval(() => shown === -1 && kick(), 120);
      addEventListener("scroll", kick, { passive: true });
      kick();

      teardown = () => {
        alive = false;
        removeEventListener("load", start);
        clearInterval(poll);
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        removeEventListener("scroll", kick);
        for (const n of [copy, land, shade, dim]) n.removeAttribute("style");
        copy.inert = land.inert = false;
        teardown = () => {};
      };
    };
    setup();
    mq.addEventListener("change", setup);
    return () => {
      teardown();
      mq.removeEventListener("change", setup);
    };
  }, []);

  const o = config.open;
  const head = o.heading.split("*");
  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="hero relative">
      <div className="hero-stick">
        {/* the opening frame is a plain image, so it is there before any script runs; the canvas paints over it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={frameSrc(0)} srcSet={`${POSTER_SMALL} 800w, ${frameSrc(0)} 1440w`} sizes="100vw" alt="" fetchPriority="high" decoding="async" className="hero-poster" />
        <canvas ref={canvas} aria-hidden className="hero-canvas" />
        <div aria-hidden className="hero-shade" />
        <div aria-hidden className="hero-dim" />
        <div aria-hidden className="hero-foot" />

        <div className="hero-copy relative z-[35] mx-auto flex w-full max-w-[1440px] flex-col px-6 pt-36 md:px-14 lg:h-full lg:justify-center lg:pt-16">
          <div className="lg:max-w-[40%]">
            <p className="eyebrow">{config.umbrella}</p>
            <h1 id="hero-title" className="mt-8 font-display text-[clamp(4.2rem,17vw,6.5rem)] leading-[0.86] tracking-[-0.01em] text-ivory lg:text-[clamp(6rem,9.6vw,9.75rem)]">
              ALL <em className="gilt">IN</em>
            </h1>
            <p className="mt-9 max-w-[24ch] text-[clamp(1.5rem,2.1vw,1.95rem)] leading-[1.2] text-ivory italic">{config.tagline}</p>

            <dl className="mt-11 flex max-w-[34rem] flex-wrap gap-x-12 gap-y-4 border-t border-hair pt-7">
              {FACTS.map(([k, v]) => (
                <div key={k}>
                  <dt className="label text-gold">{k}</dt>
                  <dd className="mt-1.5 text-[1.15rem] text-ivory">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-4">
              <a href={config.applyUrl || "#apply"} className="btn btn-brass">
                Apply for a seat
              </a>
              <a href="#win" className="link inline-flex min-h-11 items-center text-[1.18rem] text-text-2 italic hover:text-gold-bright">
                How it works
              </a>
            </div>
          </div>
        </div>

        {/* the pitch, on the felt */}
        <div id="open" className="hero-land">
          <p className="eyebrow both">Open call</p>
          <h2 className="h2 mt-7 max-w-[15ch]">{head.map((t, k) => (k % 2 ? <em key={k}>{t}</em> : t))}</h2>
          <p className="lede mt-6">{o.body}</p>
          <p className="label mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-text-2">
            {o.facts.map((f, k) => (
              <Fragment key={f}>
                {k > 0 && <span aria-hidden className="size-1 rotate-45 bg-gold" />}
                <span>{f}</span>
              </Fragment>
            ))}
          </p>
          <a href={config.applyUrl || "#apply"} className="btn btn-brass mt-12">
            Start the application
          </a>
        </div>
      </div>
    </section>
  );
}
