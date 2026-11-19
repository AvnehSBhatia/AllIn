"use client";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { ArrowUpRight } from "lucide-react";
import { config } from "@/lib/config";
import { applySchema } from "@/lib/apply";
import { Dither } from "@/components/motion/Dither";

type Errors = Partial<Record<string, string[]>>;
const field = "mt-2 w-full rounded-lg border border-hair-soft bg-ink/40 px-4 py-3 text-ivory placeholder:text-text-3 transition-colors focus:border-gold focus:outline-none aria-[invalid=true]:border-chip-red";

/** The application. A plain form that posts to /api/apply, or a link out when NEXT_PUBLIC_APPLY_URL is set. */
export function Apply() {
  const a = config.apply;
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = applySchema.safeParse(data);
    if (!parsed.success) {
      const errs = z.flattenError(parsed.error).fieldErrors;
      setErrors(errs);
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
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
      <p id={`${k}-err`} className="mt-2 text-sm text-[#ff8a9a]">
        {errors[k]![0]}
      </p>
    );
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <section id="apply" aria-labelledby="apply-title" className="relative overflow-clip px-5 py-24 md:px-10 md:py-36">
      <Dither seed={3} className="absolute inset-0 h-full w-full opacity-45 [mask-image:radial-gradient(60%_70%_at_20%_60%,#000,transparent)]" />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
        <div className="relative">
          <p className="eyebrow">Apply</p>
          <h2 id="apply-title" className="h2 mt-5 text-[clamp(2.8rem,6vw,5.25rem)]">
            {a.heading}
          </h2>
          <p className="lede mt-6">{a.body}</p>
          <p className="mt-8 font-mono text-xs tracking-[0.14em] text-text-3 uppercase">Deadline · {a.deadline ?? "TBA"}</p>
        </div>

        {config.applyUrl ? (
          <div className="felt flex flex-col items-start justify-center gap-6 rounded-lg p-8 md:p-12">
            <p className="text-text-2">Applications run through our form.</p>
            <a href={config.applyUrl} className="btn btn-gold" target="_blank" rel="noopener">
              Open the application <ArrowUpRight size={16} strokeWidth={1.5} />
            </a>
          </div>
        ) : state === "done" ? (
          <div className="felt flex flex-col justify-center rounded-lg p-8 md:p-12" role="status">
            <p className="label text-gold-bright">Received</p>
            <p className="h3 mt-4 text-ivory">Your chips are on the table.</p>
            <p className="mt-3 max-w-[40ch] text-text-2">A person reads every application. You&apos;ll hear back by email once decisions go out.</p>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="felt grid gap-6 rounded-lg p-6 md:grid-cols-2 md:p-10">
            <div className="term-bar -mx-6 -mt-6 rounded-t-lg md:col-span-2 md:-mx-10 md:-mt-10">
              <span><span className="text-gold">~/allin</span> $ ./apply</span>
              <span>read by a person</span>
            </div>
            <label className="block">
              <span className="label text-text-2">Name</span>
              <input name="name" autoComplete="name" className={field} {...aria("name")} />
              {err("name")}
            </label>
            <label className="block">
              <span className="label text-text-2">Email</span>
              <input name="email" type="email" autoComplete="email" className={field} {...aria("email")} />
              {err("email")}
            </label>
            <label className="block">
              <span className="label text-text-2">School, lab or company</span>
              <input name="affiliation" autoComplete="organization" className={field} {...aria("affiliation")} />
              {err("affiliation")}
            </label>
            <fieldset {...aria("role")}>
              <legend className="label text-text-2">You are</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  ["undergrad", "Undergrad"],
                  ["researcher", "Researcher"],
                  ["other", "Other"],
                ].map(([v, l]) => (
                  <label key={v} className="cursor-pointer rounded-full border border-hair-soft px-4 py-2.5 text-sm text-text-2 transition-colors has-[:checked]:border-gold has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold">
                    <input type="radio" name="role" value={v} className="sr-only" />
                    {l}
                  </label>
                ))}
              </div>
              {err("role")}
            </fieldset>
            <label className="block md:col-span-2">
              <span className="label text-text-2">What have you built, and why this?</span>
              <textarea name="built" rows={5} className={`${field} resize-y`} {...aria("built")} />
              {err("built")}
            </label>
            <label className="block md:col-span-2">
              <span className="label text-text-2">
                A link <span className="text-text-3 normal-case">(GitHub, paper, site. Optional)</span>
              </span>
              <input name="link" type="url" inputMode="url" placeholder="https://" className={field} {...aria("link")} />
              {err("link")}
            </label>
            <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0" />
            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <button type="submit" disabled={state === "sending"} className="btn btn-gold">
                {state === "sending" ? "Sending" : "Request a seat"}
              </button>
              <p className="text-sm text-text-3" aria-live="polite">
                {state === "failed" ? "That didn't go through. Try again in a minute." : config.safety}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
