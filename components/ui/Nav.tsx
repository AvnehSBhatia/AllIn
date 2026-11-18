"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { config } from "@/lib/config";
import { sound } from "@/lib/sound";
import { Scramble } from "@/components/motion/Scramble";
import { Suit } from "./Suit";
import { scrollToTarget } from "@/lib/scroll";

function SoundToggle() {
  const on = useSyncExternalStore(sound.subscribe, sound.get, () => false);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Sound on. Turn off" : "Sound off. Turn on"}
      onClick={() => sound.set(!on)}
      className="label flex h-11 items-center gap-2 px-2 text-text-2 transition-colors hover:text-ivory"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0.5, 1, 0.7, 0.35].map((h, i) => (
          <span
            key={i}
            className={`w-[2px] bg-current transition-transform duration-500 ${on ? "animate-[eq_0.9s_ease-in-out_infinite_alternate]" : ""}`}
            style={{ height: "100%", transform: `scaleY(${on ? h : 0.2})`, transformOrigin: "bottom", animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">Sound</span>
    </button>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 40);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), menuBtn.current?.focus());
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`nav-glass transition-[background-color,backdrop-filter] duration-500 ${scrolled || open ? "bg-felt-950/88 backdrop-blur-md" : ""}`}
        style={{ maskImage: scrolled && !open ? "linear-gradient(#000 80%, transparent)" : undefined }}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1680px] items-center gap-4 px-4 md:px-8">
          <a
            href="#top"
            className="group flex h-11 items-center gap-2 font-display text-2xl leading-none tracking-[-0.02em]"
            onClick={(e) => {
              if (e.detail === 3) window.dispatchEvent(new Event("allin:rain"));
            }}
            aria-label="ALL IN, back to top"
          >
            <Suit s="s" className="h-4 w-4 text-gold transition-transform duration-500 group-hover:rotate-[360deg]" />
            ALL <em className="-ml-1">IN</em>
            <span className="ml-2 hidden border-l border-hair pl-3 font-sans text-[13px] font-semibold tracking-normal text-text-2 sm:inline">{config.organizer}</span>
          </a>
          <ul className="ml-auto hidden items-center gap-1 lg:flex">
            {config.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="label flex h-11 items-center px-3 text-text-2 transition-colors hover:text-ivory">
                  <Scramble text={l.label} />
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <SoundToggle />
            <a href={config.applyUrl || "#apply"} className="btn btn-gold min-h-10 px-4 text-[0.7rem]">
              Apply
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="grid h-11 w-11 place-items-center text-ivory lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </div>
      {open && (
        <div id="mobile-menu" className="felt fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-x-0 px-6 pt-6 pb-10 lg:hidden">
          <ul>
            {config.nav.map((l, i) => (
              <li key={l.href} className="border-b border-hair-soft">
                <a
                  href={l.href}
                  className="flex min-h-14 items-baseline gap-4 py-3 font-display text-4xl tracking-[-0.02em]"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    scrollToTarget(l.href);
                  }}
                >
                  <span className="label text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="label mt-8 text-text-3">{config.safety}</p>
        </div>
      )}
    </header>
  );
}
