/** Scroll to a "#id" or element. html's scroll-padding-top keeps it clear of the nav. */
export function scrollToTarget(target: string | HTMLElement, opts: { immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: opts.immediate ? "auto" : "smooth" });
}
