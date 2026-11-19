/** The filmed way in, cut into stills by scripts/intro-frames.sh. Update FRAMES if you re-cut it. */
export const FRAMES = 149;
export const frameSrc = (k: number) => `/intro/f-${String(k + 1).padStart(3, "0")}.webp`;
