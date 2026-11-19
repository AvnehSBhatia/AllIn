"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { config } from "@/lib/config";
import { Suit } from "./Suit";

const DATE = config.date ? new Date(config.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }).toLowerCase() : null;

/** Terminal-style top bar: prompt brand, section tabs with scroll-spy, apply. A gold line under it tracks scroll. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuBtn = useRef<HTMLButtonElement>(null);

  // scroll-spy: the tab for whichever section crosses the upper third of the screen
  useEffect(() => {
    const els = config.nav.map((l) => document.querySelector(l.href)).filter((e): e is Element => !!e);
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const id = `#${e.target.id}`;
          setActive((a) => (e.isIntersecting ? id : a === id ? "" : a));
        }),
      { rootMargin: "-30% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), menuBtn.current?.focus());
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hair-soft bg-felt-950/92">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-5 font-mono md:px-10">
        <a href="#top" className="flex h-10 items-center gap-2.5 text-[13px]" aria-label="ALL IN, back to top">
          <span className="grid h-7 w-7 place-items-center rounded-[5px] border border-gold/50 bg-gold/10">
            <Suit s="s" className="h-3.5 w-3.5 text-gold" />
          </span>
          <span className="font-semibold text-ivory">allin</span>
          <span className="hidden text-text-3 sm:inline">@{config.organizer.toLowerCase()}</span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {config.nav.map((l) => {
            const on = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={on ? "location" : undefined}
                  className={`flex h-8 items-center gap-1.5 rounded-[5px] px-2.5 text-[12.5px] transition-colors ${on ? "bg-gold/10 text-gold-bright" : "text-text-2 hover:bg-ivory/5 hover:text-ivory"}`}
                >
                  <span aria-hidden className={on ? "text-gold" : "text-text-3/60"}>
                    {on ? ">" : "/"}
                  </span>
                  {l.label.toLowerCase()}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          {DATE && (
            <span className="hidden items-center gap-2 text-[11.5px] text-text-3 xl:flex">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
              {DATE}
            </span>
          )}
          <a href={config.applyUrl || "#apply"} className="btn btn-gold min-h-10 px-3.5 text-[12.5px]">
            <span aria-hidden className="opacity-60">$</span> apply
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[5px] border border-hair-soft text-ivory lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>
      <span aria-hidden className="nav-progress absolute inset-x-0 -bottom-px h-px origin-left bg-gold" />

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-14 bottom-0 overflow-y-auto border-t border-hair-soft bg-felt-950 px-5 pt-4 pb-10 font-mono lg:hidden">
          <p className="py-3 text-[12px] text-text-3">~/allin $ ls sections</p>
          <ul>
            {config.nav.map((l, i) => (
              <li key={l.href} className="border-b border-hair-soft">
                <a href={l.href} className="flex min-h-14 items-center gap-4 text-xl text-ivory" onClick={() => setOpen(false)}>
                  <span className="text-[12px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {l.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[12px] leading-relaxed text-text-3">{config.safety}</p>
        </div>
      )}
    </header>
  );
}
