"use client";
import { useEffect, useRef } from "react";

// 8×8 Bayer matrix, the classic ordered-dither pattern.
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21].map((v) => (v + 0.5) / 64);
// transparent, two felt greens, then gold for the hottest pixels only
const LEVELS = [null, [20, 80, 63, 255], [34, 112, 86, 255], [214, 178, 94, 255]] as const;
const CELL = 6; // CSS px per dither pixel

/**
 * A gradient drawn as ordered dither on a tiny canvas, scaled up with hard pixels.
 * The light sways slowly on its own. Draws at 20fps, only while on screen; one still frame under reduced motion.
 * `seed` shifts the phase so two sections never sway in step.
 */
export function Dither({ seed = 0, className = "" }: { seed?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let img: ImageData;
    let raf = 0;
    let visible = false;

    const draw = (t: number) => {
      const d = img.data;
      const s = t * 0.16 + seed * 1.7; // one full sway ≈ 40s
      const p = 0.5 + 0.32 * Math.sin(s); // hot spot A drifts left↔right
      const q = 0.5 + 0.18 * Math.sin(s * 0.7 + 1.3); // B drifts on its own beat
      for (let y = 0; y < h; y++) {
        const v = y / h;
        for (let x = 0; x < w; x++) {
          const u = x / w;
          const horizon = Math.exp(-((v - 0.6 - 0.05 * Math.sin(s * 0.8)) ** 2) * 16) * (0.55 + 0.45 * Math.sin(u * 3.2 + s * 1.4));
          const a = Math.exp(-((u - 0.1 - 0.7 * p) ** 2 * 7 + (v - 0.55) ** 2 * 9));
          const b = Math.exp(-((u - 0.95 + 0.5 * q) ** 2 * 12 + (v - 0.32 - 0.1 * q) ** 2 * 10));
          // soft-saturate so the peak tops out around 10% gold dots, never a solid patch
          const f = 0.7 * (1 - Math.exp(-1.3 * (0.75 * horizon + 0.7 * a + 0.5 * b)));
          const k = f * 3;
          const c = LEVELS[Math.floor(k) + (k % 1 > BAYER[(y & 7) * 8 + (x & 7)] ? 1 : 0)];
          const i = (y * w + x) * 4;
          if (c) {
            d[i] = c[0];
            d[i + 1] = c[1];
            d[i + 2] = c[2];
            d[i + 3] = c[3];
          } else d[i + 3] = 0;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const size = () => {
      w = Math.max(1, Math.ceil(cv.clientWidth / CELL));
      h = Math.max(1, Math.ceil(cv.clientHeight / CELL));
      cv.width = w;
      cv.height = h;
      img = ctx.createImageData(w, h);
      draw(performance.now() / 1000);
    };

    let last = 0;
    const loop = (now: number) => {
      // ponytail: 20fps; the hard pixels hide it and it costs a third of 60
      if (now - last > 48) {
        last = now;
        draw(now / 1000);
      }
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    if (reduced) return () => ro.disconnect();

    const io = new IntersectionObserver(([e]) => ((visible = e.isIntersecting), kick()));
    io.observe(cv);
    document.addEventListener("visibilitychange", kick);
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", kick);
    };
  }, [seed]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none [image-rendering:pixelated] ${className}`} />;
}
