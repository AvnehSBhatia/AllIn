// Screenshots at the five breakpoints. Usage: node scripts/shots.mjs [outDir] [url] [widths] [full]
import { chromium } from "playwright";
const out = process.argv[2] ?? "screenshots";
await import("node:fs").then((fs) => fs.mkdirSync(out, { recursive: true }));
const url = process.argv[3] ?? "http://localhost:3100";
const widths = (process.argv[4] ?? "375,768,1024,1440,1920").split(",").map(Number);
const full = process.argv[5] === "full";
// Uses installed Chrome if Playwright's own browser isn't downloaded.
const b = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
for (const w of widths) {
  const h = w < 768 ? 812 : w < 1440 ? 1024 : w === 1440 ? 900 : 1080;
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.addInitScript(() => sessionStorage.setItem("allin-dealt", "1"));
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(3500);
  if (full) {
    // Wheel through the page so every scroll-triggered entrance has played, then return to the top.
    for (let y = 0; y < (await p.evaluate(() => document.body.scrollHeight)); y += 500) {
      await p.mouse.wheel(0, 500);
      await p.waitForTimeout(120);
    }
    await p.waitForTimeout(1500);
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(800);
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await p.screenshot({ path: `${out}/w${w}.png`, fullPage: full });
  console.log(w, "overflowX:", ov, errs.length ? "ERR " + errs.join(" | ").slice(0, 600) : "");
  await p.close();
}
await b.close();
