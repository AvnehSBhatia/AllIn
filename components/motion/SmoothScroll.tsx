"use client";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { onDealt } from "@/lib/dealt";

/** Native scroll (a JS smooth-scroller made the page heavy). Holds the page still while the preloader deals. */
export function SmoothScroll() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const html = document.documentElement;
    if (!html.dataset.dealt) html.style.overflow = "hidden";
    // re-measure once the deal is done: triggers built under the preloader come out misplaced
    return onDealt(() => {
      html.style.overflow = "";
      requestAnimationFrame(refresh);
    });
  }, []);
  return null;
}
