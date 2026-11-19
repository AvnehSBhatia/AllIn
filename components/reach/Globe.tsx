"use client";
import { useEffect, useRef } from "react";
import { isLand } from "@/lib/land";

const AUTO = 0.12; // rad/s idle spin
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
// pins, spread over every continent (decoration, not a list of where people applied); first one is the room in Pleasanton
const PINS: [number, number][] = [
  [37.66, -121.87], [47.6, -122.3], [30.3, -97.7], [40.7, -74], [43.7, -79.4], [19.4, -99.1], [21.3, -157.8],
  [4.7, -74.1], [-23.5, -46.6], [-34.6, -58.4], [-33.4, -70.6],
  [51.5, -0.1], [48.9, 2.35], [52.5, 13.4], [59.3, 18.1], [40.4, -3.7], [41, 29], [55.8, 37.6],
  [6.5, 3.4], [-1.3, 36.8], [30, 31.2], [-26.2, 28], [25.2, 55.3],
  [19.1, 72.9], [12.97, 77.6], [1.35, 103.8], [-6.2, 106.8], [39.9, 116.4], [31.2, 121.5], [37.6, 127], [35.7, 139.7],
  [-33.9, 151.2], [-36.8, 174.8],
];
const vec = ([la, lo]: [number, number]) => {
  const a = (la * Math.PI) / 180, o = (lo * Math.PI) / 180;
  return [Math.cos(a) * Math.sin(o), Math.sin(a), Math.cos(a) * Math.cos(o)];
};

// Land dots: an even Fibonacci spread over the sphere, kept where the mask says land. Antarctica left off.
function landDots() {
  const N = 9000;
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const lon = ((((i * GOLDEN * 180) / Math.PI) % 360) + 360) % 360 - 180;
    const lat = (Math.asin(y) * 180) / Math.PI;
    if (lat > -58 && isLand(lat, lon)) out.push(lat, lon);
  }
  const dots = new Float32Array((out.length / 2) * 3);
  for (let k = 0; k < out.length / 2; k++) {
    const la = (out[k * 2] * Math.PI) / 180;
    const lo = (out[k * 2 + 1] * Math.PI) / 180;
    dots[k * 3] = Math.cos(la) * Math.sin(lo);
    dots[k * 3 + 1] = Math.sin(la);
    dots[k * 3 + 2] = Math.cos(la) * Math.cos(lo);
  }
  return dots;
}

/**
 * Dot-matrix globe on a 2D canvas: orthographic projection, depth-faded far side.
 * Drag to spin; it keeps the throw and eases back to an idle spin. Gold pings are decoration, not data.
 */
export function Globe({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = landDots();
    const n = dots.length / 3;
    const pings = PINS.map((ll, i) => ({ v: vec(ll), ph: (i * 0.37) % 1, home: i === 0 }));

    let yaw = -2.5; // start just east of home (Pleasanton) so the beeping pin spins into view
    let pitch = 0.38;
    let vel = reduced ? 0 : AUTO;
    let dpr = 1;
    let S = 0;
    let drag: { x: number; y: number; t: number; v: number } | null = null;
    let raf = 0;
    let last = 0;
    let visible = false;

    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      S = cv.clientWidth * dpr;
      cv.width = cv.height = S;
      frame(performance.now());
    };

    function frame(now: number) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      if (!drag) {
        yaw += vel * dt;
        // a thrown globe slows back down to the idle spin
        const target = reduced ? 0 : AUTO;
        vel += (target - vel) * (1 - Math.exp(-dt * 1.6));
      }
      const R = S * 0.46;
      const c = S / 2;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      ctx.clearRect(0, 0, S, S);

      // body: a faint lit disc so the dots read as sitting on a sphere
      const g = ctx.createRadialGradient(c - R * 0.35, c - R * 0.45, R * 0.1, c, c, R);
      g.addColorStop(0, "rgba(20,80,63,.55)");
      g.addColorStop(1, "rgba(4,17,13,.2)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(214,178,94,.28)";
      ctx.lineWidth = dpr;
      ctx.stroke();

      const s0 = 1.1 * dpr;
      for (let k = 0; k < n; k++) {
        const x0 = dots[k * 3], y0 = dots[k * 3 + 1], z0 = dots[k * 3 + 2];
        const x = x0 * cy - z0 * sy;
        const z1 = z0 * cy + x0 * sy;
        const y = y0 * cp - z1 * sp;
        const z = y0 * sp + z1 * cp;
        const s = z > 0 ? s0 + 1.5 * dpr * z : s0;
        ctx.globalAlpha = z > 0 ? 0.18 + 0.52 * z : 0.05;
        ctx.fillStyle = "#f3ecda";
        ctx.fillRect(c + x * R - s / 2, c - y * R - s / 2, s, s);
      }

      // pings on the near side
      const t = now / 1000;
      ctx.strokeStyle = "#f2d98a";
      ctx.fillStyle = "#f2d98a";
      for (const pg of pings) {
        const [x0, y0, z0] = pg.v;
        const x = x0 * cy - z0 * sy;
        const z1 = z0 * cy + x0 * sy;
        const y = y0 * cp - z1 * sp;
        const z = y0 * sp + z1 * cp;
        if (z < 0.1) continue;
        const px = c + x * R, py = c - y * R;
        if (pg.home) {
          // ExeaLabs home: a round beacon that beeps twice a second-and-a-bit, louder than the rest
          const beep = reduced ? 0.3 : (t / 1.3) % 1;
          ctx.globalAlpha = z;
          ctx.fillStyle = "#fff6d8";
          ctx.beginPath();
          ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#f2d98a";
          ctx.lineWidth = 2 * dpr;
          for (const off of [0, 0.25]) {
            const l = (beep + 1 - off) % 1;
            ctx.globalAlpha = z * (1 - l);
            ctx.beginPath();
            ctx.arc(px, py, (6 + l * 30) * dpr, 0, Math.PI * 2);
            ctx.stroke();
          }
          continue;
        }
        const life = reduced ? 0.3 : (t / 2.6 + pg.ph) % 1;
        ctx.globalAlpha = z;
        ctx.fillRect(px - 2 * dpr, py - 2 * dpr, 4 * dpr, 4 * dpr);
        ctx.globalAlpha = z * (1 - life) * 0.9;
        ctx.lineWidth = dpr;
        ctx.beginPath();
        ctx.arc(px, py, (3 + life * 14) * dpr, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = visible && !document.hidden && !reduced ? requestAnimationFrame(tick) : 0;
    }
    // ponytail: idle spin redraws at ~30fps (half the cost); drags and throws get every frame
    const tick = (now: number) => (drag || Math.abs(vel - AUTO) > 0.05 || now - last > 30 ? frame(now) : (raf = requestAnimationFrame(tick)));

    const kick = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    // direct manipulation: the surface follows the pointer, release keeps the velocity
    const down = (e: PointerEvent) => {
      cv.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, t: performance.now(), v: 0 };
      cv.dataset.drag = "";
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const R = (S / dpr) * 0.46;
      const now = performance.now();
      const dx = e.clientX - drag.x;
      const dyaw = -dx / R;
      yaw += dyaw;
      if (e.pointerType === "mouse") pitch = Math.max(-0.3, Math.min(0.9, pitch + (e.clientY - drag.y) / R));
      const dt = Math.max(1, now - drag.t) / 1000;
      drag = { x: e.clientX, y: e.clientY, t: now, v: drag.v * 0.6 + (dyaw / dt) * 0.4 };
      if (reduced) frame(now);
    };
    const up = () => {
      if (!drag) return;
      vel = Math.max(-6, Math.min(6, drag.v));
      drag = null;
      delete cv.dataset.drag;
      kick();
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(cv);
    document.addEventListener("visibilitychange", kick);
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", kick);
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="A dotted globe that turns slowly. Drag to spin it."
      className={`aspect-square w-full cursor-grab touch-pan-y select-none data-[drag]:cursor-grabbing ${className}`}
    />
  );
}
