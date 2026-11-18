import { ImageResponse } from "next/og";
import { config } from "@/lib/config";

export const alt = `${config.name}: ${config.umbrella}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Pull just the glyphs we need from Google Fonts at build time. */
async function font(family: string, text: string, ital = false) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}${ital ? ":ital@1" : ""}&text=${encodeURIComponent(text)}`)).text();
  const url = css.match(/src: url\((.+?)\) format/)?.[1];
  if (!url) throw new Error(`font ${family} not found`);
  return (await fetch(url)).arrayBuffer();
}

export default async function Image() {
  const mono = `${config.umbrella.toUpperCase()}${config.dateWindow.toUpperCase()} · ~${config.capacity} SEATS · ONE DAY VIRTUAL CHIPS ONLY`;
  const [serif, serifItalic, jet] = await Promise.all([font("Instrument+Serif", "ALL "), font("Instrument+Serif", "IN", true), font("JetBrains+Mono", mono)]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, color: "#f3ecda", background: "radial-gradient(90% 120% at 78% 40%, #14503f 0%, #0b2e24 40%, #04110d 85%)" }}>
        <div style={{ fontFamily: "Jet", fontSize: 22, letterSpacing: 4, color: "rgba(243,236,218,.7)" }}>{config.umbrella.toUpperCase()}</div>
        <div style={{ display: "flex", alignItems: "flex-end", fontSize: 300, lineHeight: 0.8, letterSpacing: -10 }}>
          <span style={{ fontFamily: "Serif" }}>ALL </span>
          <span style={{ fontFamily: "SerifItalic", color: "#f2d98a" }}>IN</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Jet", fontSize: 22, letterSpacing: 3, color: "rgba(243,236,218,.7)", borderTop: "1px solid rgba(214,178,94,.4)", paddingTop: 24 }}>
          <span>{`${config.dateWindow.toUpperCase()} · ~${config.capacity} SEATS · ONE DAY`}</span>
          <span style={{ color: "#d6b25e" }}>VIRTUAL CHIPS ONLY</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, style: "normal" },
        { name: "SerifItalic", data: serifItalic, style: "italic" },
        { name: "Jet", data: jet, style: "normal" },
      ],
    },
  );
}
