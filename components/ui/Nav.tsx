"use client";
import { useEffect, useRef, useState } from "react";
import { config } from "@/lib/config";
import { Suit } from "./Suit";

const LEFT = [
  { label: "Format", href: "#win" },
  { label: "The day", href: "#day" },
  { label: "Prizes", href: "#prizes" },
];
const RIGHT = [
  { label: "Team", href: "#team" },
  { label: "Questions", href: "#faq" },
];
// links are set in the text face, ordinary case; only the wordmark and labels are engraved capitals
const link = "link text-[1.12rem] leading-none text-text-2 hover:text-gold-bright";

/** The bar: black, the name in the middle on a gold lozenge rule, three links either side. Like the top of a menu card. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), menuBtn.current?.focus());
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="lacquer fixed inset-x-0 top-0 z-50">
      <nav aria-label="Main" className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-6 md:px-14">
        <ul className="hidden items-center gap-11 lg:flex">
          {LEFT.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={link}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#top" className="col-start-1 flex items-center gap-3.5 justify-self-start lg:col-start-2 lg:justify-self-center" aria-label="ALL IN, back to top">
          <span aria-hidden className="hidden h-px w-9 bg-linear-to-r from-transparent to-hair lg:block" />
          <Suit s="s" className="size-3 text-gold" />
          <span className="gilt font-display text-[1.6rem] leading-none tracking-[0.22em]">
            ALL <em>IN</em>
          </span>
          <Suit s="s" className="hidden size-3 text-gold lg:block" />
          <span aria-hidden className="hidden h-px w-9 bg-linear-to-l from-transparent to-hair lg:block" />
        </a>

        <div className="col-start-3 flex items-center justify-end gap-11">
          <ul className="hidden items-center gap-11 lg:flex">
            {RIGHT.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={config.applyUrl || "#apply"} className="btn btn-ghost hidden min-h-10 px-6 text-[1.08rem] sm:inline-flex">
            Apply
          </a>
          <button ref={menuBtn} type="button" className={`${link} min-h-11 lg:hidden`} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {/* a bevelled gold rail under the lacquer */}
      <div aria-hidden className="rule-gold" />

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-[75px] bottom-0 overflow-y-auto bg-black px-5 pt-6 pb-10 lg:hidden">
          <ul>
            {[...LEFT, ...RIGHT, { label: "Apply", href: "#apply" }].map((l) => (
              <li key={l.href} className="border-b border-hair-soft">
                <a href={l.href} className="flex min-h-16 items-center font-display text-3xl text-ivory" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base text-text-3 italic">{config.safety}</p>
        </div>
      )}
    </header>
  );
}
