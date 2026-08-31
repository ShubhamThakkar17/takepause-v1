import { writeFileSync } from 'node:fs';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const url = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Kaushan+Script&display=swap';
const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();

// Keep latin + latin-ext only; the rest is dead weight for this site.
const blocks = css.split('/*').filter(b => /latin(-ext)?\s*\*\//.test(b));
let out = '';
const seen = new Map();

for (const block of blocks) {
  const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
  const weight = block.match(/font-weight:\s*(\d+)/)?.[1] ?? '400';
  const style = block.match(/font-style:\s*(\w+)/)?.[1] ?? 'normal';
  const src = block.match(/src:\s*url\(([^)]+)\)/)?.[1];
  const unicode = block.match(/unicode-range:\s*([^;]+);/)?.[1];
  const subset = block.match(/^\s*(latin(?:-ext)?)\s*\*\//)?.[1];
  if (!family || !src) continue;

  const slug = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}${style === 'italic' ? 'i' : ''}-${subset}`;
  if (seen.has(slug)) continue;
  seen.set(slug, true);

  const bytes = Buffer.from(await (await fetch(src)).arrayBuffer());
  writeFileSync(`public/fonts/${slug}.woff2`, bytes);

  out += `@font-face {\n  font-family: "${family}";\n  font-style: ${style};\n  font-weight: ${weight};\n  font-display: swap;\n  src: url("/fonts/${slug}.woff2") format("woff2");\n  unicode-range: ${unicode};\n}\n\n`;
}
writeFileSync('src/fonts.css', `/* Self-hosted so the site owns its typography: no third-party request,\n   no layout shift from a slow CDN. Regenerate with: node scripts/fetch-fonts.mjs */\n\n${out}`);
console.log(`${seen.size} font files`);
