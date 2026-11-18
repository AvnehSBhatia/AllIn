"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Chip } from "./Chip";

const INTERACTIVE = "a,button,summary,label,[role=button],[data-cursor]";

/** A small chip that trails the pointer, grows and turns over interactive things. Fine pointers only. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.22, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.22, ease: "power3" });
    let hot: Element | null = null;
    let spot: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = e.target as Element;
      const typing = !!t.closest?.("input,textarea,select");
      const next = typing ? null : t.closest?.(INTERACTIVE) ?? null;
      gsap.to(el, { autoAlpha: typing ? 0 : 1, duration: 0.2, overwrite: "auto" });
      if (next !== hot) {
        hot = next;
        gsap.to(el.firstElementChild, { scale: hot ? 1.75 : 1, rotate: hot ? "+=180" : "+=0", duration: 0.45, ease: "expo.out" });
      }
      spot = t.closest?.(".spot") as HTMLElement | null;
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };
    const hide = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    const down = () => gsap.to(el.firstElementChild, { scale: 0.8, duration: 0.12 });
    const up = () => gsap.to(el.firstElementChild, { scale: hot ? 1.75 : 1, duration: 0.3, ease: "expo.out" });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none invisible fixed top-0 left-0 z-[100] -mt-[9px] -ml-[9px] opacity-0">
      <div className="h-[18px] w-[18px] drop-shadow-[0_2px_4px_rgb(0_0_0/0.6)]">
        <Chip color="black" mark={false} className="h-full w-full" />
      </div>
    </div>
  );
}
