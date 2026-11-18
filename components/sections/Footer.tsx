import { config } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative overflow-clip border-t border-hair px-5 pt-20 pb-8 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="label text-text-3">{config.umbrella}</p>
            <p className="mt-6 max-w-[34ch] text-lg text-ivory">{config.safety}</p>
            {config.contactEmail && (
              <a href={`mailto:${config.contactEmail}`} className="link mt-6 inline-block font-mono text-sm text-text-2 hover:text-ivory">
                {config.contactEmail}
              </a>
            )}
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 font-mono text-xs tracking-[0.14em] uppercase">
              {[...config.nav, { label: "Apply", href: "#apply" }].map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link text-text-2 hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
              {config.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="link text-text-2 hover:text-ivory" rel="noopener" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-hair-soft pt-6 font-mono text-[11px] tracking-[0.12em] text-text-3 uppercase">
          <span>© {config.organizer}</span>
          <span>Virtual chips only</span>
        </div>
      </div>
    </footer>
  );
}
