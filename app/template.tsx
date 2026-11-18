"use client";
import { useEffect, useRef, type ReactNode } from "react";

let seen = false;

/** Card-flip between routes. Skipped on the first load (the preloader owns that moment) and under reduced motion. */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (seen && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current?.animate(
        [
          { transform: "perspective(1600px) rotateY(-90deg)", opacity: 0 },
          { transform: "perspective(1600px) rotateY(0deg)", opacity: 1 },
        ],
        { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" },
      );
    }
    seen = true;
  }, []);
  return (
    <div ref={ref} className="origin-left">
      {children}
    </div>
  );
}
