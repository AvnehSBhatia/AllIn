"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { CHIP_HEX, chipSprites, drawChip, type ChipSprites } from "@/lib/chips";

/**
 * Flying chips in three depth layers. Depth of field is a CSS blur on the near and far canvases,
 * which the compositor handles; the middle layer stays sharp and is the only one the cursor pushes.
 */
type Chip = { hx: number; hy: number; r: number; tilt: number; roll: number; spin: number; vs: number; ph: number; sp: number; ox: number; oy: number; vx: number; vy: number; s: ChipSprites };
type Layer = { el: HTMLCanvasElement; ctx: CanvasRenderingContext2D; chips: Chip[]; depth: number; repel: boolean };

// Home positions as fractions of the hero box, kept clear of the headline zone (left 45%, middle band),
// the nav strip (top ~8%) and the caption row (bottom-left / bottom-right corners).
const DESK = {
  far: [[0.52, 0.14], [0.93, 0.2], [0.62, 0.86], [0.98, 0.62], [0.8, 0.95]],
  mid: [[0.57, 0.26], [0.9, 0.36], [0.72, 0.86], [0.97, 0.84]],
  near: [[0.99, 0.32], [0.56, 1.0]],
};
const MOBILE = {
  far: [[0.1, 0.62], [0.9, 0.66], [0.55, 0.98]],
  mid: [[0.82, 0.74], [0.2, 0.86], [0.96, 0.95]],
  near: [[0.04, 0.99]],
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export function HeroChips({ playing, reduced }: { playing: boolean; reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const play = useRef(playing);
  useEffect(() => {
    play.current = playing;
  }, [playing]);

  useEffect(() => {
    const host = wrap.current!;
    const sprites = CHIP_HEX.map((c) => chipSprites(c.base, c.stripe));
    const canvases = Array.from(host.querySelectorAll("canvas"));
    let w = 0;
    let h = 0;
    let layers: Layer[] = [];
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const box = host.getBoundingClientRect();
      w = box.width;
      h = box.height;
      const dpr = Math.min(2, devicePixelRatio || 1);
      const set = w < 768 ? MOBILE : DESK;
      const unit = Math.min(w, 1400) / 1400;
      const spec = [
        { pts: set.far, r: [10, 16], depth: 0.35, repel: false },
        { pts: set.mid, r: [20, 30], depth: 0.7, repel: true },
        { pts: set.near, r: [44, 62], depth: 1.25, repel: false },
      ];
      layers = spec.map((sp, li) => {
        const el = canvases[li];
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
        const ctx = el.getContext("2d")!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return {
          el,
          ctx,
          depth: sp.depth,
          repel: sp.repel,
          chips: sp.pts.map(([fx, fy], i) => ({
            hx: fx * w,
            hy: fy * h,
            r: rnd(sp.r[0], sp.r[1]) * Math.max(0.6, unit),
            tilt: rnd(0.5, 1.2),
            roll: rnd(0, Math.PI * 2),
            spin: rnd(0, Math.PI * 2),
            vs: rnd(-0.5, 0.5),
            ph: rnd(0, Math.PI * 2),
            sp: rnd(0.25, 0.5),
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
            s: sprites[(i + li * 2) % sprites.length],
          })),
        };
      });
    };

    let t = 0;
    const frame = (dt: number) => {
      t += dt;
      const scatter = Math.min(1, Math.max(0, scrollY / Math.max(1, h * 0.9)));
      const cx = w / 2;
      const cy = h / 2;
      for (const L of layers) {
        L.ctx.clearRect(0, 0, w, h);
        for (const c of L.chips) {
          // drift: slow bob and wobble, nothing faster than a breath
          const bx = Math.sin(t * c.sp + c.ph) * 10 * L.depth;
          const by = Math.cos(t * c.sp * 0.8 + c.ph) * 14 * L.depth;
          // cursor repel on the sharp layer, springing back home
          if (L.repel) {
            const dx = c.hx + c.ox - mouse.x;
            const dy = c.hy + c.oy - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < 160 && d > 0.1) {
              const f = ((160 - d) / 160) * 2600 * dt;
              c.vx += (dx / d) * f;
              c.vy += (dy / d) * f;
            }
          }
          c.vx += -c.ox * 60 * dt - c.vx * 10 * dt;
          c.vy += -c.oy * 60 * dt - c.vy * 10 * dt;
          c.ox += c.vx * dt;
          c.oy += c.vy * dt;
          // scroll scatter: fly outward and up as the hero leaves
          const sx = (c.hx - cx) * scatter * 0.9 * L.depth;
          const sy = (c.hy - cy) * scatter * 0.6 * L.depth - scatter * 220 * L.depth;
          const spin = c.spin + t * c.vs + scatter * 3 * Math.sign(c.vs || 1);
          drawChip(L.ctx, c.s, c.hx + bx + c.ox + sx, c.hy + by + c.oy + sy, c.r, c.tilt + scatter * 0.6, c.roll, spin);
        }
      }
    };

    build();
    frame(0);
    if (reduced) {
      const ro = new ResizeObserver(() => (build(), frame(0)));
      ro.observe(host);
      return () => ro.disconnect();
    }

    const tick = (_: number, dms: number) => {
      if (play.current) frame(Math.min(0.05, dms / 1000));
    };
    gsap.ticker.add(tick);
    const ro = new ResizeObserver(build);
    ro.observe(host);
    const move = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    const leave = () => (mouse.x = mouse.y = -9999);
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0" aria-hidden>
      <canvas className="absolute inset-0 h-full w-full opacity-70 blur-[2px]" />
      <canvas className="absolute inset-0 z-[3] h-full w-full" />
      <canvas className="absolute inset-0 z-[6] h-full w-full blur-[6px]" />
    </div>
  );
}
