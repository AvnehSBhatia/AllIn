import { config } from "@/lib/config";

export function Footer() {
  return (
    <footer className="lacquer relative z-40 px-6 py-10 md:px-14">
      <div aria-hidden className="rule-gold absolute inset-x-0 top-0" />
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-10 gap-y-3">
        <span className="label text-gold">
          ©{" "}
          <a href={config.organizerUrl} className="link" rel="noopener" target="_blank">
            {config.organizer}
          </a>{" "}
          · {config.umbrella.split(" · ")[0]}
        </span>
        <span className="text-base text-text-3 italic">{config.safety}</span>
        {(config.contactEmail || config.socials.length > 0) && (
          <span className="label flex gap-6 text-text-2">
            {config.contactEmail && (
              <a href={`mailto:${config.contactEmail}`} className="link">
                {config.contactEmail}
              </a>
            )}
            {config.socials.map((s) => (
              <a key={s.href} href={s.href} className="link" rel="noopener" target="_blank">
                {s.label}
              </a>
            ))}
          </span>
        )}
      </div>
    </footer>
  );
}
