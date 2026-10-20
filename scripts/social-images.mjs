/**
 * Renders the social share card (public/brand/og.png, 1200×630) and the
 * home-screen icon (public/brand/apple-touch-icon.png, 180×180) with the
 * site's own fonts and hero illustration. Needs Playwright with Chromium.
 *
 *   node scripts/social-images.mjs
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(
    "Playwright isn't installed. Run: npx -y playwright@1 install chromium, then retry.",
  );
  process.exit(1);
}

// Inlined, because a page built with setContent can't load file:// fonts.
const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(require.resolve(`${pkg}/files/${file}`)).toString("base64")}`;
const hero = `data:image/svg+xml;base64,${readFileSync("public/images/scenes/hero.svg").toString("base64")}`;

const css = `
  @font-face { font-family: Fraunces; src: url(${font("@fontsource-variable/fraunces", "fraunces-latin-soft-normal.woff2")}); font-weight: 100 900; }
  @font-face { font-family: Fraunces; font-style: italic; src: url(${font("@fontsource-variable/fraunces", "fraunces-latin-soft-italic.woff2")}); font-weight: 100 900; }
  @font-face { font-family: DM Sans; src: url(${font("@fontsource-variable/dm-sans", "dm-sans-latin-wght-normal.woff2")}); font-weight: 100 1000; }
  * { margin: 0; box-sizing: border-box; }
  body { background: #FFF1E6; color: #38231E; font-family: "DM Sans"; }
  h1, .mark { font-family: Fraunces; font-variation-settings: "SOFT" 100; }
  .bars { display: inline-flex; gap: .07em; height: .42em; margin-left: .14em; }
  .bars i { width: .085em; background: #8E2938; border-radius: 99px; }
`;

const og = `
  <div style="width:1200px;height:630px;display:grid;grid-template-columns:1fr 470px;overflow:hidden;position:relative">
    <div style="padding:70px 0 60px 80px;display:flex;flex-direction:column">
      <div class="mark" style="font-size:44px;font-weight:600;letter-spacing:-.04em;display:flex;align-items:baseline">take pause<span class="bars"><i></i><i></i></span></div>
      <h1 style="font-size:84px;line-height:.98;letter-spacing:-.03em;font-weight:500;margin-top:56px">A little pause.<br><em style="color:#8E2938">A little sweetness.</em></h1>
      <p style="margin-top:auto;font-size:26px;color:#5E433B">Eggless home bakes · Vadodara · takepause.in</p>
    </div>
    <div style="background:#FFCAD4;border-radius:240px 240px 0 0;margin-top:40px;overflow:hidden;border:2px solid rgba(56,35,30,.15)">
      <img src="${hero}" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block">
    </div>
    <div style="position:absolute;inset:auto 0 0 0;height:20px;background:repeating-conic-gradient(#1F5B3A 0 25%,transparent 0 50%) 0 0/20px 20px"></div>
  </div>`;

const icon = `
  <div style="width:180px;height:180px;background:#8E2938;display:flex;align-items:center;justify-content:center;gap:22px">
    <i style="width:24px;height:84px;background:#FFF1E6;border-radius:12px"></i>
    <i style="width:24px;height:84px;background:#FFF1E6;border-radius:12px"></i>
  </div>`;

const browser = await chromium.launch();
for (const [html, path, width, height] of [
  [og, "public/brand/og.png", 1200, 630],
  [icon, "public/brand/apple-touch-icon.png", 180, 180],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(`<style>${css}</style>${html}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path });
  await page.close();
  console.log(`Wrote ${path}`);
}
await browser.close();
