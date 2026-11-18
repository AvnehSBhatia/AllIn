/** The preloader sets html[data-dealt] when it finishes (or is skipped). Hero intros wait for it. */
export function onDealt(cb: () => void): () => void {
  if (document.documentElement.dataset.dealt) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("allin:dealt", h, { once: true });
  return () => window.removeEventListener("allin:dealt", h);
}

export function markDealt() {
  document.documentElement.dataset.dealt = "1";
  try {
    sessionStorage.setItem("allin-dealt", "1");
  } catch {}
  window.dispatchEvent(new Event("allin:dealt"));
}
