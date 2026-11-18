import { useSyncExternalStore } from "react";

const q = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(q);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** true when the user asked for less motion. false on the server. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(q).matches, () => false);
}

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia(q).matches;
