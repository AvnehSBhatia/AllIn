"use client";
import { useState } from "react";
import { config } from "@/lib/config";

/** The rules dossier. The toggle lets you peek under the redaction bars. */
export function Classified() {
  const [peek, setPeek] = useState(false);
  const c = config.classified;

  return (
    <section id="game" aria-labelledby="game-title" className="relative overflow-x-clip px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div className="lg:pt-16">
          <p className="label text-text-3">The game</p>
          <h2 id="game-title" className="h2 mt-5 max-w-[12ch]">
            {c.heading}
          </h2>
          {c.body.map((p) => (
            <p key={p.slice(0, 12)} className="lede mt-6">
              {p}
            </p>
          ))}
        </div>

        <div className="stock relative self-start rounded-[3px] px-6 pt-8 pb-10 md:px-12 md:pt-12 md:pb-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/25 pb-4 font-mono text-[11px] tracking-[0.12em] text-ink/70 uppercase">
            <span>File AI-01 · Rules of play</span>
            <span>Copy 1 of 1</span>
          </div>
          <p className="mt-8 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-ink">Variant specification</p>
          <p className="mt-2 max-w-[44ch] text-[15px] text-ink/75">Distributed to all seated teams at kickoff. Until then this page stays as you see it.</p>

          <ul className="mt-8 space-y-4 font-mono text-[13px] text-ink md:text-sm" aria-label="Rules, sealed until kickoff">
            {c.redacted.map((line) => {
              const [k, v] = line.split(/\s\.+\s/);
              return (
                <li key={line} className="flex items-center gap-3">
                  <span className="w-[7.5rem] shrink-0 text-ink/70 md:w-[11rem]">{k}</span>
                  <span className="relative min-w-0 flex-1">
                    <span className={`transition-opacity duration-300 ${peek ? "opacity-100" : "opacity-0"}`}>{v}</span>
                    <span aria-hidden className={`absolute inset-y-[-3px] left-0 w-full origin-left bg-ink transition-opacity duration-300 ${peek ? "opacity-15" : "opacity-100"}`} />
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <button type="button" aria-pressed={peek} onClick={() => setPeek(!peek)} className="btn min-h-11 border border-ink/30 px-4 text-ink hover:border-ink">
              {peek ? "Put the bars back" : "Peek under the bars"}
            </button>
            {peek && <p className="font-mono text-xs text-ink/70">Worth a try. Nothing under there yet.</p>}
          </div>

          <span aria-hidden className="pointer-events-none absolute right-6 bottom-24 rotate-[-12deg] rounded-sm border-[3px] border-chip-red px-3 py-1 font-mono text-lg font-bold tracking-[0.2em] text-chip-red opacity-80 mix-blend-multiply md:right-12 md:text-2xl">
            SEALED
          </span>
        </div>
      </div>
    </section>
  );
}
