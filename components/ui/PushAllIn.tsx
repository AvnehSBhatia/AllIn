"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useMagnetic } from "@/hooks/useMagnetic";
import { scrollToTarget } from "@/lib/scroll";
import { config } from "@/lib/config";
import { clink } from "@/lib/sound";

const COLORS = ["var(--chip-red)", "var(--chip-black)", "var(--chip-blue)", "var(--chip-white)"];

function chip(layer: HTMLElement, x: number, y: number, d: number, c: string) {
  const el = document.createElement("div");
  el.className = "cchip absolute";
  el.style.cssText = `--c:${c};--d:${d}px;left:${x - d / 2}px;top:${y - d / 2}px`;
  layer.appendChild(el);
  return el;
}

/** Push the stack into the pot: chips slide, a gold shockwave, a spray of chips, then scroll to Apply. <1.2s, never blocks. */
function push(from: HTMLElement) {
  const r = from.getBoundingClientRect();
  const ox = r.left + r.width / 2;
  const oy = r.top + r.height / 2;
  const px = innerWidth * 0.5;
  const py = innerHeight * 0.48;
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.className = "pointer-events-none fixed inset-0 z-[97]";
  document.body.appendChild(layer);

  const tl = gsap.timeline({ onComplete: () => layer.remove() });
  const stack = Array.from({ length: 7 }, (_, i) => chip(layer, ox, oy - i * 4, 34, COLORS[i % 4]));
  stack.forEach((el, i) => {
    tl.to(el, { x: px - ox, duration: 0.42, ease: "power3.in" }, i * 0.025);
    tl.to(el, { keyframes: { y: [0, -70 - i * 4, py - oy - i * 3] }, duration: 0.42, ease: "none" }, i * 0.025);
  });
  tl.call(() => clink(), [], 0.42).call(() => clink(0.05), [], 0.44);

  const ring = document.createElement("div");
  ring.className = "absolute rounded-full border-2 border-[var(--gold-bright)]";
  ring.style.cssText = `left:${px - 40}px;top:${py - 40}px;width:80px;height:80px;box-shadow:0 0 40px var(--gold)`;
  layer.appendChild(ring);
  tl.fromTo(ring, { scale: 0.2, opacity: 1 }, { scale: 9, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.45);
  tl.to(stack, { opacity: 0, scale: 0.6, duration: 0.25 }, 0.5);

  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
    const v = 140 + Math.random() * 220;
    const el = chip(layer, px, py, 12 + Math.random() * 12, COLORS[i % 4]);
    tl.fromTo(
      el,
      { scale: 0.3, opacity: 1 },
      { x: Math.cos(a) * v, keyframes: { y: [0, Math.sin(a) * v - 60, Math.sin(a) * v + 140] }, rotate: Math.random() * 360, scale: 1, opacity: 0, duration: 0.7, ease: "power2.out" },
      0.45,
    );
  }
}

export function PushAllIn({ children = "Push all-in", className = "" }: { children?: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, 0.35);
  const external = !!config.applyUrl;
  return (
    <a
      ref={ref}
      href={external ? config.applyUrl : "#apply"}
      data-lenis-prevent-anchor
      className={`btn btn-gold group ${className}`}
      onClick={(e) => {
        if (external) return;
        e.preventDefault();
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return scrollToTarget("#apply", { immediate: true });
        push(e.currentTarget);
        setTimeout(() => scrollToTarget("#apply"), 380);
      }}
    >
      <span className="cchip -ml-2 transition-transform duration-500 group-hover:rotate-180" style={{ "--d": "20px", "--c": "var(--chip-black)" } as CSSProperties} aria-hidden />
      {children}
    </a>
  );
}
