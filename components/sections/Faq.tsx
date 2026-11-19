import { Plus } from "lucide-react";
import { config } from "@/lib/config";

/** Native <details>: keyboard, find-in-page and no-JS all work for free. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="h2 mt-5 max-w-[9ch]">
            Asked at the rail.
          </h2>
          <p className="mt-8 max-w-[30ch] border-l-2 border-chip-red pl-4 text-sm text-text-2">{config.safety}</p>
        </div>
        <div className="border-t border-hair">
          {config.faq.map((f) => (
            <details key={f.q} name="faq" className="group border-b border-hair-soft">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg text-ivory marker:hidden md:text-xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus size={18} strokeWidth={1.5} className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45" aria-hidden />
              </summary>
              <p className="max-w-[60ch] pb-6 text-text-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
