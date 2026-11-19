import { ChevronLeft, ChevronRight } from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Prev / film-strip dots / next, plus the hint: arrow keys on a laptop, swipe on a phone. */
export function Stepper({ i, count, go, word = "frame", label, className = "" }: { i: number; count: number; go: (n: number) => void; word?: string; label: (n: number) => string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[12px] text-text-3 ${className}`}>
      <button type="button" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous" className="step-btn">
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      <ol className="flex flex-1 items-center gap-1.5 sm:flex-none">
        {Array.from({ length: count }, (_, n) => (
          <li key={n} className="flex-1 sm:flex-none">
            <button type="button" onClick={() => go(n)} aria-label={label(n)} aria-current={n === i ? "step" : undefined} className="step-dot group">
              <span className="block h-1.5 w-full rounded-[1px] bg-ivory/15 transition-colors group-aria-[current]:bg-gold-bright sm:w-6" />
            </button>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => go(i + 1)} disabled={i === count - 1} aria-label="Next" className={`step-btn ${i === 0 ? "step-nudge" : ""}`}>
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
      <p className="ml-auto whitespace-nowrap" aria-live="polite">
        <span className="hidden sm:inline">{word} </span><span className="text-gold">{pad(i + 1)}</span>/{pad(count)}
        <span className="ml-3 hidden text-text-3/70 pointer-fine:inline">
          <kbd className="kbd">←</kbd> <kbd className="kbd">→</kbd>
        </span>
        <span className="ml-2 hidden text-text-3/70 pointer-coarse:inline"><span className="hidden sm:inline">swipe </span>⇆</span>
      </p>
    </div>
  );
}
