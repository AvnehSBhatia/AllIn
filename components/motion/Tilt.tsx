"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { dur, ease } from "@/lib/motion";

/** Subtle 3D tilt with a moving glare. Fine pointers only. */
export function Tilt({ children, className = "", max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: dur.md, ease: ease.out });
    const ry = gsap.quickTo(el, "rotationY", { duration: dur.md, ease: ease.out });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * max);
      ry((px - 0.5) * max);
      glare.current?.style.setProperty("--gx", `${px * 100}%`);
      glare.current?.style.setProperty("--gy", `${py * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
  return (
    <div ref={ref} className={`group relative will-change-transform ${className}`}>
      {children}
      <span
        ref={glare}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgb(255 255 255 / .35), transparent 60%)" }}
      />
    </div>
  );
}
