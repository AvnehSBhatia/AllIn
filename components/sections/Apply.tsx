"use client";
import { useState, type CSSProperties, type FormEvent } from "react";
import { z } from "zod";
import { ArrowUpRight, Plus } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { config } from "@/lib/config";
import { MAX_LINKS, applySchema } from "@/lib/apply";
import { Lead, Panel, i } from "@/components/deck/Panel";

type Errors = Partial<Record<string, string[]>>;
const ROLES = [
  ["highschool", "High schooler"],
  ["researcher", "Researcher"],
  ["other", "Other"],
] as const;

/** Panel eight: the application, then the questions people ask. Posts to /api/apply, or links out when NEXT_PUBLIC_APPLY_URL is set. */
export function Apply() {
  const a = config.apply;
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [links, setLinks] = useState(1);
  const [openQ, setOpenQ] = useState<Set<number>>(new Set());
  const toggle = (k: number) => setOpenQ((s) => (s.has(k) ? new Set([...s].filter((x) => x !== k)) : new Set(s).add(k)));

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = { ...Object.fromEntries(fd), links: fd.getAll("links").map(String).map((l) => l.trim()).filter(Boolean) };
    const parsed = applySchema.safeParse(data);
    if (!parsed.success) {
      const errs = z.flattenError(parsed.error).fieldErrors;
      setErrors(errs);
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const res = await fetch("/api/apply", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      setState("failed");
    }
  }

  const err = (k: string) =>
    errors[k] && (
      <p id={`${k}-err`} className="mt-1.5 text-base text-oxblood italic">
        {errors[k]![0]}
      </p>
    );
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });
  const label = "label text-ink-2";

  return (
    <Panel id="apply" title="apply-title">
      <Lead id="apply-title" label={`Apply${a.deadline ? ` · by ${a.deadline}` : ""}`} heading={a.heading} body={a.body} />

      <div {...i(9, { "--from": "0px 40px", "--spin": "-1.5deg" })} className="a mt-12 w-full max-w-[44rem] text-left">
        {config.applyUrl ? (
          <div className="card flex flex-col items-center gap-5 p-9 text-center md:p-12">
            <p className="text-ink-2">Applications run through our form.</p>
            <a href={config.applyUrl} className="btn btn-brass" target="_blank" rel="noopener">
              Open the application <ArrowUpRight size={16} strokeWidth={1.75} />
            </a>
          </div>
        ) : state === "done" ? (
          <div className="card p-9 text-center md:p-12" role="status">
            <Chip color="gold" className="mx-auto mb-5 block size-12" />
            <p className="label text-oxblood">Received</p>
            <p className="mt-3 font-display text-[2.2rem] leading-tight text-ink">Your chips are on the table.</p>
            <p className="mx-auto mt-3 max-w-[40ch] text-ink-2">A person reads every application. You&apos;ll hear back by email once decisions go out.</p>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="card grid gap-x-9 gap-y-8 p-7 md:grid-cols-2 md:p-12">
            <label className="block">
              <span className={label}>Name</span>
              <input name="name" autoComplete="name" className="field" style={{ "--f": 0 } as CSSProperties} {...aria("name")} />
              {err("name")}
            </label>
            <label className="block">
              <span className={label}>Email</span>
              <input name="email" type="email" autoComplete="email" className="field" style={{ "--f": 1 } as CSSProperties} {...aria("email")} />
              {err("email")}
            </label>
            <fieldset {...aria("role")}>
              <legend className={label}>You are</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {ROLES.map(([v, l]) => (
                  <label key={v} className="cursor-pointer border border-ink/45 px-3.5 py-1.5 text-[1.05rem] text-ink transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ivory has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-oxblood">
                    <input type="radio" name="role" value={v} className="sr-only" />
                    {l}
                  </label>
                ))}
              </div>
              {err("role")}
            </fieldset>
            <label className="block">
              <span className={label}>School, lab or company</span>
              <input name="affiliation" autoComplete="organization" className="field" style={{ "--f": 2 } as CSSProperties} {...aria("affiliation")} />
              {err("affiliation")}
            </label>
            <label className="block md:col-span-2">
              <span className={label}>What makes you different from the hundreds of other applicants?</span>
              <textarea name="different" rows={3} className="field resize-y" {...aria("different")} />
              {err("different")}
            </label>
            <label className="block md:col-span-2">
              <span className={label}>Why do you deserve a shot?</span>
              <textarea name="deserve" rows={3} className="field resize-y" {...aria("deserve")} />
              {err("deserve")}
            </label>
            <fieldset className="md:col-span-2" {...aria("links")}>
              <legend className={label}>
                Links <span className="tracking-[0.12em] normal-case">· optional, up to {MAX_LINKS}</span>
              </legend>
              <div className="grid gap-2">
                {Array.from({ length: links }, (_, k) => (
                  <input key={k} name="links" type="url" inputMode="url" placeholder="https://" aria-label={`Link ${k + 1}`} className="field" style={{ "--f": 3 } as CSSProperties} />
                ))}
              </div>
              {links < MAX_LINKS && (
                <button type="button" onClick={() => setLinks(links + 1)} className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-[1.08rem] text-oxblood italic hover:underline">
                  <Plus size={14} strokeWidth={2} /> Add another link
                </button>
              )}
              {err("links")}
            </fieldset>
            <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0" />
            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <button type="submit" disabled={state === "sending"} className="btn btn-brass">
                {state === "sending" ? "Sending" : "Request a seat"}
              </button>
              <p className="text-base text-ink-2 italic" aria-live="polite">
                {state === "failed" ? "That didn't go through. Try again in a minute." : "Read by a person, not a filter."}
              </p>
            </div>
          </form>
        )}
      </div>

      <div id="faq" className="mt-24 w-full max-w-[44rem] text-left">
        <h3 className="eyebrow">Asked at the rail</h3>
        <div className="mt-5 border-t border-hair">
          {config.faq.map((f, k) => (
            <div key={f.q} className="border-b border-hair-soft">
              <button type="button" aria-expanded={openQ.has(k)} aria-controls={`faq-${k}`} onClick={() => toggle(k)} className="group flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left font-display text-[1.45rem] leading-tight text-ivory transition-colors hover:text-gold-bright">
                {f.q}
                <Plus size={18} strokeWidth={1.25} className="shrink-0 text-gold transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-aria-expanded:rotate-[135deg]" aria-hidden />
              </button>
              <div id={`faq-${k}`} className="faq-a" inert={!openQ.has(k)}>
                <div>
                  <p className="max-w-[56ch] pb-6 text-text-2">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
