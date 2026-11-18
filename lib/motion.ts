/**
 * One motion language for the whole site.
 * Default curve is a critically damped feel (expo.out): fast response, no overshoot.
 * Overshoot (`snap`) is reserved for things that were thrown: chips, dealt cards.
 */
export const ease = {
  out: "expo.out",
  inOut: "expo.inOut",
  in: "expo.in",
  snap: "back.out(1.6)",
  linear: "none",
  css: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.87, 0, 0.13, 1)",
  },
} as const;

/** seconds */
export const dur = {
  xs: 0.15, // press feedback
  sm: 0.3, // hovers, small state changes
  md: 0.6, // reveals
  lg: 0.9, // headline reveals, card flips
  xl: 1.4, // big set pieces
} as const;

/** seconds between siblings */
export const stagger = {
  char: 0.02,
  word: 0.045,
  line: 0.09,
  item: 0.08,
} as const;
