"use client";
import { useEffect, useRef } from "react";
import { CHIP_HEX, chipSprites, drawChip, type ChipSprites } from "@/lib/chips";
import { clink } from "@/lib/sound";

type P = { x: number; y: number; vx: number; vy: number; r: number; tilt: number; vt: number; spin: number; vs: number; s: ChipSprites; rest: boolean };

/** Easter egg: chip rain with simple gravity + bounce. Fired by the `allin:rain` event. */
export function ChipRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let raf = 0;
    const start = () => {
      const cv = ref.current;
      if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cancelAnimationFrame(raf);
      const dpr = Math.min(2, devicePixelRatio);
      const W = innerWidth;
      const H = innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.opacity = "1";
      const ctx = cv.getContext("2d")!;
      ctx.scale(dpr, dpr);
      const sprites = CHIP_HEX.map((c) => chipSprites(c.base, c.stripe, 96));
      const n = W < 700 ? 40 : 90;
      const ps: P[] = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: -40 - Math.random() * H * 0.9,
        vx: (Math.random() - 0.5) * 120,
        vy: Math.random() * 120,
        r: 12 + Math.random() * 14,
        tilt: Math.random() * Math.PI,
        vt: (Math.random() - 0.5) * 8,
        spin: Math.random() * 6,
        vs: (Math.random() - 0.5) * 6,
        s: sprites[(Math.random() * sprites.length) | 0],
        rest: false,
      }));
      let last = performance.now();
      const t0 = last;
      const frame = (now: number) => {
        const dt = Math.min(0.033, (now - last) / 1000);
        last = now;
        ctx.clearRect(0, 0, W, H);
        for (const p of ps) {
          if (!p.rest) {
            p.vy += 1500 * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.tilt += p.vt * dt;
            p.spin += p.vs * dt;
            const floor = H - p.r * 0.4;
            if (p.y > floor) {
              p.y = floor;
              if (p.vy > 220 && Math.random() < 0.08) clink();
              p.vy *= -0.38;
              p.vx *= 0.7;
              p.vt *= 0.6;
              if (Math.abs(p.vy) < 60) {
                p.rest = true;
                p.tilt = Math.PI / 2.4;
              }
            }
          }
          drawChip(ctx, p.s, p.x, p.y, p.r, p.tilt, 0, p.spin);
        }
        const age = now - t0;
        if (age > 3800) cv.style.opacity = "0";
        if (age < 4600) raf = requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, W, H);
      };
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener("allin:rain", start);
    return () => {
      window.removeEventListener("allin:rain", start);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[96] h-full w-full opacity-0 transition-opacity duration-700" />;
}
