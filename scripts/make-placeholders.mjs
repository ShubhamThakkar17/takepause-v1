/**
 * Generates the stand-in imagery in public/images.
 *
 * These are soft watercolour washes in the brand palette, not photographs —
 * they hold the layout and the mood until Rutvi's real photography arrives.
 * Drop a real .jpg in over the top and update the path in src/content/site.ts.
 *
 *   node scripts/make-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public", "images");
mkdirSync(OUT, { recursive: true });

const CREAM = "#fbf6ea";
const BLOOMS = ["#e5a091", "#f2cfc5", "#a2b393", "#c9d5bb", "#f4ecdc", "#e8c7a8"];

// Small deterministic PRNG so re-running the script yields identical files.
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

function wash({ w, h, seed, label }) {
  const r = rng(seed);
  const blobs = [];
  const count = 4 + Math.floor(r() * 3);

  for (let i = 0; i < count; i++) {
    const color = BLOOMS[Math.floor(r() * BLOOMS.length)];
    const cx = Math.round(r() * w);
    const cy = Math.round(r() * h);
    const rad = Math.round((0.28 + r() * 0.42) * Math.max(w, h));
    const opacity = (0.45 + r() * 0.45).toFixed(2);
    blobs.push(
      `<radialGradient id="g${i}" cx="${cx}" cy="${cy}" r="${rad}" gradientUnits="userSpaceOnUse">` +
        `<stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/>` +
        `<stop offset="1" stop-color="${color}" stop-opacity="0"/>` +
        `</radialGradient>`,
    );
  }

  const rects = blobs.map((_, i) => `<rect width="${w}" height="${h}" fill="url(#g${i})"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    ${blobs.join("\n    ")}
    <filter id="paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="${seed}" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="34" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="${CREAM}"/>
  <g filter="url(#paper)">${rects.join("")}</g>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.09" style="mix-blend-mode:multiply"/>
</svg>`;
}

const files = [
  ["story.svg", 1000, 1250],
  ...Array.from({ length: 7 }, (_, i) => [`menu-0${i + 1}.svg`, 900, 1100]),
  ...Array.from({ length: 9 }, (_, i) => [`gallery-0${i + 1}.svg`, 900, i % 3 === 1 ? 1200 : 1080]),
];

files.forEach(([name, w, h], i) => {
  writeFileSync(join(OUT, name), wash({ w, h, seed: (i + 3) * 977, label: "Photography placeholder" }));
});

console.log(`wrote ${files.length} placeholders to public/images`);
