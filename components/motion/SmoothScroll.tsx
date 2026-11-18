"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import { onDealt } from "@/lib/dealt";

/** Lenis driven by GSAP's ticker so ScrollTrigger and scroll never drift. Off under reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -72 }, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Hold the page still while the preloader deals.
    if (!document.documentElement.dataset.dealt) lenis.stop();
    // re-measure once the deal is done: triggers built under the preloader come out misplaced
    const off = onDealt(() => {
      lenis.start();
      requestAnimationFrame(refresh);
    });

    return () => {
      off();
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
