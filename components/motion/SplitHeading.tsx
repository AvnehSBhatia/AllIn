"use client";
import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { dur, ease, stagger } from "@/lib/motion";

type Props = {
  as?: ElementType;
  children: string;
  className?: string;
  /** lines rise out of a mask; chars rise individually; words fade/slide. */
  by?: "lines" | "chars" | "words";
  id?: string;
};

/** Masked split-text reveal on scroll. SplitText keeps an aria-label so screen readers read it whole. */
export function SplitHeading({ as: Tag = "h2", children, className, by = "lines", id }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
      SplitText.create(ref.current, {
        type: by === "lines" ? "lines" : `lines,${by}`,
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self[by], {
            yPercent: 110,
            rotate: by === "chars" ? 6 : 0,
            duration: dur.lg,
            ease: ease.out,
            stagger: stagger[by === "lines" ? "line" : by === "chars" ? "char" : "word"],
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          }),
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
