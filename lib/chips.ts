import { SUIT_PATHS } from "@/components/ui/Suit";

/** Canvas can't read CSS vars, so chip colors live here too (mirror of globals.css). */
export const CHIP_HEX = [
  { base: "#c4122f", stripe: "#ecebe6" },
  { base: "#1d4ed8", stripe: "#ecebe6" },
  { base: "#101312", stripe: "#d6b25e" },
  { base: "#ecebe6", stripe: "#c4122f" },
  { base: "#14503f", stripe: "#f3ecda" },
];
const GOLD = "#d6b25e";

export type ChipSprites = { face: HTMLCanvasElement; edge: HTMLCanvasElement };

/** Pre-render a chip face (and a darker copy used to build the edge). */
export function chipSprites(base: string, stripe: string, px = 128): ChipSprites {
  const face = document.createElement("canvas");
  face.width = face.height = px;
  const g = face.getContext("2d")!;
  const r = px / 2;
  g.translate(r, r);
  const disc = (rad: number) => {
    g.beginPath();
    g.arc(0, 0, rad, 0, Math.PI * 2);
  };
  disc(r - 1);
  g.fillStyle = base;
  g.fill();
  g.fillStyle = stripe;
  for (let i = 0; i < 8; i++) {
    g.save();
    g.rotate((i * Math.PI) / 4);
    g.fillRect(-r * 0.1, -r + 1, r * 0.2, r * 0.3);
    g.restore();
  }
  g.setLineDash([r * 0.07, r * 0.07]);
  g.strokeStyle = stripe;
  g.globalAlpha = 0.7;
  g.lineWidth = r * 0.025;
  disc(r * 0.66);
  g.stroke();
  g.setLineDash([]);
  g.globalAlpha = 1;
  disc(r * 0.58);
  g.fillStyle = base;
  g.fill();
  g.strokeStyle = GOLD;
  g.lineWidth = r * 0.03;
  g.stroke();
  disc(r - 1.5);
  g.globalAlpha = 0.6;
  g.stroke();
  g.globalAlpha = 0.9;
  g.save();
  g.scale(r * 0.026, r * 0.026);
  g.translate(-12, -12);
  g.fillStyle = stripe;
  g.fill(new Path2D(SUIT_PATHS.s));
  g.restore();
  // soft top-left light
  g.globalAlpha = 1;
  const lg = g.createLinearGradient(-r, -r, r, r);
  lg.addColorStop(0, "rgba(255,255,255,0.22)");
  lg.addColorStop(0.5, "rgba(255,255,255,0)");
  lg.addColorStop(1, "rgba(0,0,0,0.25)");
  disc(r - 1);
  g.fillStyle = lg;
  g.fill();

  const edge = document.createElement("canvas");
  edge.width = edge.height = px;
  const e = edge.getContext("2d")!;
  e.drawImage(face, 0, 0);
  e.globalCompositeOperation = "source-atop";
  e.fillStyle = "rgba(0,0,0,0.5)";
  e.fillRect(0, 0, px, px);
  return { face, edge };
}

/**
 * Draw a chip in 3D with a 2D context: orthographic disc, tilted by `tilt` around an axis at angle `roll`,
 * spun by `spin`, with thickness built from stacked edge copies (their rim stripes read as edge stripes).
 */
export function drawChip(ctx: CanvasRenderingContext2D, s: ChipSprites, x: number, y: number, r: number, tilt: number, roll: number, spin: number, thick = r * 0.16) {
  const c = Math.cos(tilt);
  const off = thick * Math.sin(tilt);
  const layers = Math.min(8, Math.max(2, Math.ceil(Math.abs(off) / 1.5)));
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(roll);
  for (let i = 0; i <= layers; i++) {
    const last = i === layers;
    ctx.save();
    ctx.translate(0, off * (1 - i / layers));
    ctx.scale(1, c);
    ctx.rotate(spin);
    ctx.drawImage(last ? s.face : s.edge, -r, -r, r * 2, r * 2);
    ctx.restore();
  }
  ctx.restore();
}
