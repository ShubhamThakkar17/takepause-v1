/**
 * Draws the temporary bakery illustrations in public/images.
 *
 * These stand in until real photographs of Take Pause bakes exist. They are
 * deliberately illustrations — not stock photos — so nothing on the site
 * pretends to be a product it isn't. Replace them by pointing the config at
 * real photos (see README → "Photos"); this script is only needed to tweak
 * the stand-ins.
 *
 *   node scripts/illustrations.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";

const C = {
  ink: "#38231E",
  cream: "#FFF1E6",
  paper: "#FFF8F1",
  rose: "#FFCAD4",
  roseMid: "#F7A8B8",
  roseDeep: "#E9879C",
  cherry: "#8E2938",
  berry: "#C7364B",
  butter: "#F4DEA4",
  butterDeep: "#E9C774",
  pistachio: "#1F5B3A",
  leaf: "#4F8A52",
  biscuit: "#C98D52",
  biscuitDark: "#A66C38",
  cookie: "#D9A066",
  cookieEdge: "#B97B43",
  choc: "#4E2A1E",
  chocMid: "#6E3D2B",
  chocLight: "#94593F",
  coffee: "#9A6A45",
  white: "#FFFFFF",
};

const stroke = (w = 3) =>
  `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
/**
 * Small looping animations, carried inside each SVG so they also play when
 * the file is used as a plain <img>. They switch off for anyone who prefers
 * reduced motion.
 */
const ANIMATION = [
  ".tw,.bob,.flag,.drift,.flame,.grow,.whisk,.sway{transform-box:fill-box}",
  ".tw{transform-origin:center;animation:tw 2.8s ease-in-out infinite}",
  "@keyframes tw{0%,100%{transform:scale(1) rotate(0);opacity:1}50%{transform:scale(.55) rotate(45deg);opacity:.55}}",
  ".bob{transform-origin:50% 0;animation:bob 2.6s ease-in-out infinite}",
  "@keyframes bob{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(6deg)}}",
  ".flag{transform-origin:0 50%;animation:flag 1.6s ease-in-out infinite}",
  "@keyframes flag{0%,100%{transform:skewY(0) scaleX(1)}50%{transform:skewY(-7deg) scaleX(.9)}}",
  ".drift{transform-origin:center;animation:drift 6s ease-in-out infinite}",
  "@keyframes drift{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(8px,-16px) rotate(50deg)}}",
  ".steam{animation:steam 2.8s ease-in-out infinite}",
  "@keyframes steam{0%{transform:translateY(5px);opacity:0}40%{opacity:.75}100%{transform:translateY(-9px);opacity:0}}",
  ".flame{transform-origin:50% 100%;animation:flame .8s ease-in-out infinite alternate}",
  "@keyframes flame{from{transform:scale(1,1) rotate(-4deg)}to{transform:scale(.82,1.14) rotate(4deg)}}",
  ".squeeze{animation:squeeze 2.4s ease-in-out infinite}",
  "@keyframes squeeze{0%,100%{transform:translate(0,0)}50%{transform:translate(-6px,16px)}}",
  ".grow{transform-origin:50% 100%;animation:grow 2.4s ease-in-out infinite}",
  "@keyframes grow{0%,100%{transform:scale(.86)}50%{transform:scale(1.06)}}",
  ".whisk{transform-origin:50% 0;animation:bob 1.3s ease-in-out infinite}",
  ".sway{transform-origin:50% 100%;animation:sway 4s ease-in-out infinite}",
  "@keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}",
  "@media (prefers-reduced-motion:reduce){*{animation:none!important}}",
].join("");

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><style>${ANIMATION}</style>${body}</svg>\n`;

/** Spreads looping animations out so neighbours never move in step. */
const delay = (seed) => `animation-delay:-${f(((seed * 7.3) % 30) / 10)}s`;
const f = (n) => Math.round(n * 10) / 10;

/** Deterministic randomness so re-running the script gives the same art. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A soft cast shadow under an object. */
const shadow = (cx, cy, rx, ry, o = 0.12) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.ink}" opacity="${o}"/>`;

/** An irregular, hand-drawn-looking closed shape around a centre. */
function blob(cx, cy, rx, ry, wobble, seed, points = 14) {
  const r = rng(seed);
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * wobble;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  let d = "";
  pts.forEach((p, i) => {
    const n = pts[(i + 1) % pts.length];
    const mid = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2];
    d += i === 0 ? `M${f(mid[0])} ${f(mid[1])}` : "";
    const nn = pts[(i + 2) % pts.length];
    const mid2 = [(n[0] + nn[0]) / 2, (n[1] + nn[1]) / 2];
    d += ` Q${f(n[0])} ${f(n[1])} ${f(mid2[0])} ${f(mid2[1])}`;
  });
  return d + " Z";
}

/** A small rough chunk (chocolate, nut, crumb). */
function chunk(cx, cy, s, seed, fill) {
  return `<path d="${blob(cx, cy, s, s * 0.8, 0.7, seed, 5)}" fill="${fill}" ${stroke(2)}/>`;
}

function crumbs(list, fill = C.biscuit) {
  return list
    .map(
      ([x, y, s], i) =>
        `<path d="${blob(x, y, s, s * 0.8, 0.6, 50 + i, 5)}" fill="${fill}" ${stroke(1.6)}/>`,
    )
    .join("");
}

/** A piped rosette of buttercream. */
function rosette(cx, cy, r, fill, lobes = 8) {
  let d = "";
  for (let i = 0; i <= lobes; i++) {
    const a = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    const am = ((i - 0.5) / lobes) * Math.PI * 2 - Math.PI / 2;
    const p = [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8];
    const c = [cx + Math.cos(am) * r * 1.25, cy + Math.sin(am) * r * 1.0];
    d +=
      i === 0
        ? `M${f(p[0])} ${f(p[1])}`
        : ` Q${f(c[0])} ${f(c[1])} ${f(p[0])} ${f(p[1])}`;
  }
  return (
    `<path d="${d} Z" fill="${fill}" ${stroke(2.4)}/>` +
    `<path d="M${f(cx - r * 0.45)} ${f(cy)} q${f(r * 0.45)} ${f(-r * 0.55)} ${f(r * 0.6)} ${f(-r * 0.05)} q${f(r * 0.1)} ${f(r * 0.35)} ${f(-r * 0.3)} ${f(r * 0.3)}" fill="none" ${stroke(2)}/>`
  );
}

function cherry(cx, cy, r, stemTo = [10, -32]) {
  return (
    `<g class="bob" style="${delay(cx + cy)}">` +
    `<path d="M${cx} ${cy - r * 0.8} q${f(stemTo[0] * 0.2)} ${f(stemTo[1] * 0.6)} ${stemTo[0]} ${stemTo[1]}" fill="none" ${stroke(2.6)}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.cherry}" ${stroke(2.6)}/>` +
    `<path d="M${f(cx - r * 0.5)} ${f(cy - r * 0.2)} q${f(r * 0.1)} ${f(-r * 0.4)} ${f(r * 0.45)} ${f(-r * 0.45)}" fill="none" stroke="${C.white}" stroke-width="${f(r * 0.22)}" stroke-linecap="round" opacity="0.7"/>` +
    `</g>`
  );
}

function strawberry(cx, cy, s, rot = 0) {
  const seeds = [
    [-0.3, 0.05],
    [0.25, 0.0],
    [0, 0.3],
    [-0.15, 0.55],
    [0.2, 0.5],
    [0.0, -0.05],
  ]
    .map(
      ([x, y]) =>
        `<ellipse cx="${f(x * s)}" cy="${f(y * s)}" rx="${f(s * 0.045)}" ry="${f(s * 0.07)}" fill="${C.butter}"/>`,
    )
    .join("");
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
    <path d="M0 ${f(-s * 0.3)} C${f(s * 0.65)} ${f(-s * 0.55)} ${f(s * 0.75)} ${f(s * 0.25)} 0 ${f(s * 0.85)} C${f(-s * 0.75)} ${f(s * 0.25)} ${f(-s * 0.65)} ${f(-s * 0.55)} 0 ${f(-s * 0.3)} Z" fill="${C.berry}" ${stroke(2.4)}/>
    ${seeds}
    <path d="M0 ${f(-s * 0.28)} l${f(-s * 0.32)} ${f(-s * 0.12)} l${f(s * 0.18)} ${f(-s * 0.1)} l${f(s * 0.14)} ${f(-s * 0.16)} l${f(s * 0.14)} ${f(s * 0.16)} l${f(s * 0.18)} ${f(s * 0.1)} Z" fill="${C.leaf}" ${stroke(2.2)}/>
  </g>`;
}

/** A box seen from slightly above: top, front and right faces. */
function box(x, y, w, d, h, fills, extra = {}) {
  const dx = d * 0.62;
  const dy = d * 0.42;
  const top = `M${x} ${y} L${x + w} ${y} L${x + w + dx} ${y - dy} L${x + dx} ${y - dy} Z`;
  const front = `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;
  const right = `M${x + w} ${y} L${x + w + dx} ${y - dy} L${x + w + dx} ${y - dy + h} L${x + w} ${y + h} Z`;
  return (
    `<path d="${right}" fill="${fills.right}" ${stroke()}/>` +
    `<path d="${front}" fill="${fills.front}" ${stroke()}/>` +
    (extra.front ?? "") +
    `<path d="${top}" fill="${fills.top}" ${stroke()}/>` +
    (extra.top ?? "")
  );
}

/** Front half of an ellipse as a list of points — for piped borders. */
function frontArc(cx, cy, rx, ry, count) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / (count - 1)) * Math.PI;
    return [cx + Math.cos(Math.PI - a) * rx, cy + Math.sin(a) * ry];
  });
}

function pipedBorder(cx, cy, rx, ry, count, r, fill) {
  return frontArc(cx, cy, rx, ry, count)
    .map(
      ([x, y]) =>
        `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" ${stroke(2.2)}/>`,
    )
    .join("");
}

/** A cylinder (cake tier, tub, cup) with a visible top. */
function cylinder(cx, top, rx, ry, h, fill, topFill = fill) {
  return (
    `<path d="M${cx - rx} ${top} L${cx - rx} ${top + h} A${rx} ${ry} 0 0 0 ${cx + rx} ${top + h} L${cx + rx} ${top} Z" fill="${fill}" ${stroke()}/>` +
    `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${topFill}" ${stroke()}/>`
  );
}

function sparkle(x, y, s, fill = C.cherry) {
  return `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z" fill="${fill}" class="tw" style="${delay(x + y)}"/>`;
}

function plate(cx, cy, rx, ry, fill = C.paper) {
  return (
    shadow(cx + 6, cy + 10, rx, ry) +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${stroke()}/>` +
    `<ellipse cx="${cx}" cy="${cy - 2}" rx="${rx * 0.78}" ry="${ry * 0.7}" fill="none" stroke="${C.ink}" stroke-width="1.6" opacity="0.35"/>`
  );
}

/* ────────────────────────── bakes (400 × 300) ────────────────────────── */

function cheesecakeSlice(ox = 0, oy = 0, scale = 1) {
  // Wedge: tip at front-left, crust at back-right.
  const T = [70, 150];
  const B1 = [250, 98];
  const B2 = [318, 136];
  const H = 82;
  const top = `M${T[0]} ${T[1]} L${B1[0]} ${B1[1]} Q${300} ${100} ${B2[0]} ${B2[1]} Z`;
  const face = (y0, y1) =>
    `M${T[0]} ${T[1] + y0} L${B2[0]} ${B2[1] + y0} L${B2[0]} ${B2[1] + y1} L${T[0]} ${T[1] + y1} Z`;
  const drip = `M${T[0]} ${T[1]} L${B2[0]} ${B2[1]} L${B2[0]} ${B2[1] + 14} q-10 0 -12 8 q-3 10 -8 0 q-4 -9 -18 -7 L210 ${f(T[1] - 2 + 14 - 4)} q-6 2 -6 16 q-1 9 -8 0 q-3 -12 -14 -12 L120 ${f(T[1] + 12)} q-8 0 -10 9 q-3 8 -8 0 q-2 -8 -12 -6 L${T[0]} ${T[1] + 14} Z`;
  const crumbsDots = Array.from({ length: 16 }, (_, i) => {
    const r = rng(300 + i);
    const t = r();
    const x = T[0] + (B2[0] - T[0]) * t;
    const y = T[1] + (B2[1] - T[1]) * t + 64 + r() * 14;
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.5 + r() * 1.5)}" fill="${C.biscuitDark}"/>`;
  }).join("");
  return `<g transform="translate(${ox} ${oy}) scale(${scale})">
    <path d="${face(0, H)}" fill="${C.paper}" ${stroke()}/>
    <path d="${face(60, H)}" fill="${C.biscuit}" ${stroke()}/>
    ${crumbsDots}
    <path d="${drip}" fill="${C.berry}" ${stroke(2.6)}/>
    <path d="${top}" fill="${C.berry}" ${stroke()}/>
    <path d="M110 140 Q170 120 230 112" fill="none" stroke="${C.white}" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
    ${strawberry(150, 112, 34, -18)}
    ${strawberry(222, 98, 30, 22)}
    <path d="M190 120 q8 -16 22 -12 q-4 14 -22 12 Z" fill="${C.leaf}" ${stroke(2)}/>
  </g>`;
}

const bakes = {
  cheesecake: svg(
    400,
    300,
    plate(200, 238, 165, 34) +
      cheesecakeSlice(6, 4) +
      crumbs([
        [80, 252, 4],
        [312, 250, 3.5],
        [330, 236, 3],
      ]),
  ),

  cookies: (() => {
    const cookieStackOne = (cx, cy, seed) => {
      const r = rng(seed);
      const top = blob(cx, cy, 92, 30, 0.12, seed, 16);
      const side = `M${cx - 92} ${cy} L${cx - 90} ${cy + 18} A92 30 0 0 0 ${cx + 90} ${cy + 18} L${cx + 92} ${cy} Z`;
      const chunks = Array.from({ length: 6 }, (_, i) =>
        chunk(
          cx - 60 + r() * 120,
          cy - 14 + r() * 26,
          7 + r() * 4,
          seed + i * 3,
          C.choc,
        ),
      ).join("");
      return `<path d="${side}" fill="${C.cookieEdge}" ${stroke()}/><path d="${top}" fill="${C.cookie}" ${stroke()}/>${chunks}`;
    };
    // A standing cookie with a bite taken out.
    const bite = `<g>
      <defs><mask id="bite"><rect width="400" height="300" fill="white"/><circle cx="352" cy="96" r="26" fill="black"/><circle cx="364" cy="128" r="20" fill="black"/></mask></defs>
      <g mask="url(#bite)">
        <path d="${blob(300, 150, 74, 74, 0.1, 9, 16)}" fill="${C.cookie}" ${stroke()}/>
        ${chunk(278, 120, 10, 31, C.choc)}${chunk(320, 172, 11, 33, C.choc)}${chunk(270, 182, 9, 35, C.choc)}${chunk(318, 128, 8, 37, C.choc)}${chunk(296, 150, 7, 39, C.choc)}
      </g>
      <path d="M335 76 a26 26 0 0 0 4 42 a20 20 0 0 0 9 40" fill="none" ${stroke(2.4)} stroke-dasharray="3 6" opacity="0.5"/>
    </g>`;
    return svg(
      400,
      300,
      shadow(170, 252, 120, 18) +
        shadow(306, 236, 64, 10) +
        cookieStackOne(160, 222, 11) +
        cookieStackOne(166, 186, 21) +
        cookieStackOne(158, 150, 41) +
        bite +
        crumbs(
          [
            [64, 262, 4],
            [262, 258, 5],
            [360, 248, 3.5],
            [244, 270, 3],
          ],
          C.cookie,
        ),
    );
  })(),

  brownies: (() => {
    const fills = { top: C.chocMid, front: C.choc, right: "#3F2118" };
    const crackle = (x, y, w, d, seed) => {
      const r = rng(seed);
      const dx = d * 0.62;
      const dy = d * 0.42;
      let lines = "";
      for (let i = 0; i < 4; i++) {
        const sx = x + 14 + r() * (w - 20) + r() * dx * 0.6;
        const sy = y - 6 - r() * (dy - 10);
        lines += `<path d="M${f(sx)} ${f(sy)} l${f(10 + r() * 14)} ${f(-4 + r() * 8)} l${f(6 + r() * 10)} ${f(-6 + r() * 6)}" fill="none" stroke="${C.chocLight}" stroke-width="2.4" stroke-linecap="round"/>`;
      }
      return lines;
    };
    const walnut = (x, y, seed) =>
      `<path d="${blob(x, y, 11, 8, 0.5, seed, 7)}" fill="${C.biscuit}" ${stroke(2)}/><path d="M${x - 6} ${y} q6 -4 12 0" fill="none" ${stroke(1.6)}/>`;
    const parchment = `<path d="M40 238 L300 214 L370 248 L100 276 Z" fill="${C.paper}" ${stroke(2.4)}/><path d="M300 214 L310 230 L370 248" fill="none" ${stroke(1.8)} opacity="0.4"/>`;
    return svg(
      400,
      300,
      parchment +
        shadow(190, 246, 120, 12, 0.14) +
        box(96, 196, 130, 74, 44, fills, {
          top: crackle(96, 196, 130, 74, 3),
        }) +
        box(112, 146, 124, 70, 44, fills, {
          top:
            crackle(112, 146, 124, 70, 7) +
            walnut(160, 128, 4) +
            walnut(196, 122, 8),
        }) +
        box(250, 218, 92, 56, 36, fills, {
          top: crackle(250, 218, 92, 56, 11) + walnut(290, 204, 12),
        }) +
        crumbs(
          [
            [70, 252, 4],
            [356, 256, 3.5],
            [236, 262, 3],
          ],
          C.chocMid,
        ),
    );
  })(),

  cake: (() => {
    const cx = 200;
    const stand =
      shadow(cx + 4, 266, 120, 12) +
      `<path d="M${cx - 34} 266 Q${cx} 240 ${cx + 34} 266 Z" fill="${C.paper}" ${stroke()}/>` +
      `<rect x="${cx - 12}" y="226" width="24" height="30" fill="${C.paper}" ${stroke()}/>` +
      `<ellipse cx="${cx}" cy="226" rx="150" ry="22" fill="${C.paper}" ${stroke()}/>`;
    const swags = Array.from({ length: 5 }, (_, i) => {
      const x0 = cx - 100 + i * 40;
      return `<path d="M${x0} ${148 + Math.sin((i / 4) * Math.PI) * 12} q20 22 40 ${f(Math.sin(((i + 1) / 4) * Math.PI) * 12 - Math.sin((i / 4) * Math.PI) * 12)}" fill="none" stroke="${C.cream}" stroke-width="5" stroke-linecap="round"/>`;
    }).join("");
    const dots = frontArc(cx, 176, 100, 24, 6)
      .map(
        ([x, y]) =>
          `<circle cx="${f(x)}" cy="${f(y - 20)}" r="3" fill="${C.cherry}"/>`,
      )
      .slice(1, -1)
      .join("");
    return svg(
      400,
      300,
      stand +
        cylinder(cx, 116, 110, 26, 96, C.rose, C.rose) +
        swags +
        dots +
        pipedBorder(cx, 212, 110, 22, 13, 8, C.cream) +
        pipedBorder(cx, 116, 110, 26, 13, 7, C.cream) +
        rosette(cx - 56, 108, 13, C.cream) +
        rosette(cx + 56, 108, 13, C.cream) +
        rosette(cx, 124, 13, C.cream) +
        rosette(cx, 96, 11, C.cream) +
        cherry(cx - 4, 90, 13, [16, -34]) +
        sparkle(76, 70, 10) +
        sparkle(330, 90, 8, C.pistachio) +
        sparkle(318, 48, 5),
    );
  })(),

  cupcakes: (() => {
    const cupcake = (cx, base, s, frost, liner, withCherry) => {
      const w = 62 * s;
      const h = 64 * s;
      const linerPath = `M${cx - w} ${base - h} L${cx - w * 0.74} ${base} L${cx + w * 0.74} ${base} L${cx + w} ${base - h} Z`;
      const pleats = Array.from({ length: 5 }, (_, i) => {
        const t = (i + 1) / 6;
        const xt = cx - w + 2 * w * t;
        const xb = cx - w * 0.74 + 2 * w * 0.74 * t;
        return `<path d="M${f(xt)} ${base - h + 4} L${f(xb)} ${base - 2}" ${stroke(2)}/>`;
      }).join("");
      const swirl = [
        [0, -h - 2, w * 1.1, 22 * s],
        [0, -h - 32 * s, w * 0.86, 20 * s],
        [0, -h - 58 * s, w * 0.6, 18 * s],
      ]
        .map(
          ([dx, dy, rx, ry]) =>
            `<ellipse cx="${cx + dx}" cy="${f(base + dy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${frost}" ${stroke()}/>`,
        )
        .join("");
      const tip = `<path d="M${f(cx - w * 0.36)} ${f(base - h - 66 * s)} Q${cx} ${f(base - h - 112 * s)} ${f(cx + w * 0.22)} ${f(base - h - 70 * s)} Z" fill="${frost}" ${stroke()}/>`;
      const sprinkles = [
        [-0.6, -0.2, C.pistachio, 20],
        [0.5, -0.1, C.cherry, -30],
        [-0.2, -0.75, C.butterDeep, 60],
        [0.3, -0.62, C.pistachio, -10],
        [0.75, -0.3, C.butterDeep, 45],
      ]
        .map(
          ([x, y, c, r]) =>
            `<rect x="${f(cx + x * w - 5)}" y="${f(base - h - 20 * s + y * 60 * s)}" width="10" height="3.4" rx="1.7" fill="${c}" transform="rotate(${r} ${f(cx + x * w)} ${f(base - h - 20 * s + y * 60 * s)})"/>`,
        )
        .join("");
      return (
        shadow(cx + 4, base + 4, w * 0.9, 9) +
        `<path d="${linerPath}" fill="${liner}" ${stroke()}/>` +
        pleats +
        swirl +
        tip +
        sprinkles +
        (withCherry ? cherry(cx + 6, base - h - 104 * s, 11, [12, -26]) : "")
      );
    };
    return svg(
      400,
      300,
      cupcake(138, 262, 1, C.rose, C.cherry, true) +
        cupcake(276, 268, 0.88, C.cream, C.butter, false) +
        sparkle(352, 70, 9) +
        sparkle(54, 92, 7, C.pistachio),
    );
  })(),

  tub: (() => {
    const cx = 170;
    const topY = 96;
    const botY = 246;
    const cup = `M${cx - 74} ${topY} L${cx - 60} ${botY} Q${cx} ${botY + 16} ${cx + 60} ${botY} L${cx + 74} ${topY} Z`;
    const layers = `<clipPath id="cup"><path d="${cup}"/></clipPath>
      <g clip-path="url(#cup)">
        <rect x="0" y="0" width="400" height="300" fill="${C.paper}"/>
        <path d="M0 210 Q${cx} 222 400 206 L400 300 L0 300 Z" fill="${C.biscuit}"/>
        <path d="M0 130 Q${cx - 30} 146 ${cx} 134 T400 128 L400 0 L0 0 Z" fill="${C.berry}"/>
        <path d="M0 210 Q${cx} 222 400 206" fill="none" ${stroke(2)}/>
        <path d="M0 130 Q${cx - 30} 146 ${cx} 134 T400 128" fill="none" ${stroke(2)}/>
        ${Array.from({ length: 10 }, (_, i) => `<circle cx="${cx - 54 + i * 12}" cy="${226 + (i % 3) * 6}" r="2.2" fill="${C.biscuitDark}"/>`).join("")}
      </g>`;
    const rim = `<ellipse cx="${cx}" cy="${topY}" rx="74" ry="16" fill="${C.berry}" ${stroke()}/>`;
    const gloss = `<path d="M${cx - 56} ${topY + 30} L${cx - 48} ${botY - 20}" stroke="${C.white}" stroke-width="7" stroke-linecap="round" opacity="0.55"/>`;
    const spoon = `<g transform="rotate(28 ${cx + 40} 80)">
      <rect x="${cx + 34}" y="10" width="12" height="96" rx="6" fill="${C.butter}" ${stroke()}/>
      <ellipse cx="${cx + 40}" cy="${topY + 8}" rx="18" ry="24" fill="${C.butter}" ${stroke()}/>
    </g>`;
    const lid =
      shadow(316, 254, 62, 10) +
      `<ellipse cx="312" cy="240" rx="62" ry="17" fill="${C.cherry}" ${stroke()}/>` +
      `<path d="M250 240 L250 230 A62 17 0 0 1 374 230 L374 240" fill="${C.cherry}" ${stroke()}/>` +
      `<ellipse cx="312" cy="230" rx="62" ry="17" fill="${C.cherry}" ${stroke()}/>` +
      `<text x="312" y="236" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="20" fill="${C.cream}">pause</text>`;
    return svg(
      400,
      300,
      shadow(cx + 4, botY + 10, 70, 10) +
        lid +
        spoon +
        layers +
        `<path d="${cup}" fill="none" ${stroke()}/>` +
        rim +
        strawberry(cx - 10, topY - 4, 26, -10) +
        gloss,
    );
  })(),

  box: (() => {
    const lid = `<path d="M62 30 L338 30 L338 170 L62 170 Z" fill="${C.cream}" ${stroke()}/>
      <rect x="62" y="30" width="276" height="28" fill="url(#chk)"/>
      <path d="M62 30 L338 30 L338 170 L62 170 Z" fill="none" ${stroke()}/>
      <path d="M62 58 L338 58" ${stroke(2)}/>
      <text x="200" y="106" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="600" font-size="34" fill="${C.cherry}">take pause</text>`;
    const defs = `<defs><pattern id="chk" x="62" y="30" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${C.pistachio}"/><rect x="14" y="14" width="14" height="14" fill="${C.pistachio}"/></pattern></defs>`;
    const tray = `<path d="M40 176 L360 176 L360 264 L40 264 Z" fill="${C.cherry}" ${stroke()}/><path d="M40 176 L360 176" ${stroke()}/>`;
    const treat = (x, kind, seed) =>
      kind === "cookie"
        ? `<path d="${blob(x, 176, 40, 40, 0.1, seed, 14)}" fill="${C.cookie}" ${stroke()}/>${chunk(x - 14, 160, 7, seed + 1, C.choc)}${chunk(x + 12, 172, 8, seed + 2, C.choc)}${chunk(x - 4, 188, 6, seed + 3, C.choc)}`
        : `<rect x="${x - 38}" y="140" width="76" height="70" rx="6" fill="${C.chocMid}" ${stroke()}/><path d="M${x - 24} 158 l14 4 l10 -6 M${x - 6} 182 l16 -2 l8 6" fill="none" stroke="${C.chocLight}" stroke-width="2.4" stroke-linecap="round"/>`;
    const treats =
      treat(96, "cookie", 3) +
      treat(176, "brownie", 0) +
      treat(256, "cookie", 13) +
      treat(326, "brownie", 0);
    return svg(
      400,
      300,
      defs +
        shadow(204, 270, 170, 12) +
        lid +
        treats +
        tray +
        `<rect x="168" y="208" width="64" height="26" rx="4" fill="${C.cream}" ${stroke(2)}/><text x="200" y="227" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="${C.cherry}">× 6</text>`,
    );
  })(),

  tiramisu: (() => {
    const x = 110;
    const y = 132;
    const w = 150;
    const d = 96;
    const h = 104;
    const layers = [
      [0, 10, "#5A3524"],
      [10, 34, C.paper],
      [34, 54, C.coffee],
      [54, 78, C.paper],
      [78, h, C.coffee],
    ]
      .map(
        ([a, b, fill]) =>
          `<rect x="${x}" y="${y + a}" width="${w}" height="${b - a}" fill="${fill}"/>`,
      )
      .join("");
    const dust = Array.from({ length: 40 }, (_, i) => {
      const r = rng(700 + i);
      const u = r();
      const v = r();
      return `<circle cx="${f(x + u * w + v * d * 0.62)}" cy="${f(y - v * d * 0.42)}" r="${f(1 + r() * 1.6)}" fill="${C.choc}"/>`;
    }).join("");
    const bean = (bx, by, rot) =>
      `<g transform="rotate(${rot} ${bx} ${by})"><ellipse cx="${bx}" cy="${by}" rx="11" ry="7" fill="${C.choc}" ${stroke(2)}/><path d="M${bx - 8} ${by} q8 -4 16 0" fill="none" stroke="${C.coffee}" stroke-width="2"/></g>`;
    return svg(
      400,
      300,
      plate(208, 248, 158, 30) +
        box(
          x,
          y,
          w,
          d,
          h,
          { top: "#7A4A33", front: C.paper, right: "#E8D7C3" },
          {
            front:
              layers +
              `<path d="M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z" fill="none" ${stroke()}/>`,
          },
        ) +
        dust +
        bean(180, 104, 20) +
        bean(214, 96, -15) +
        `<path d="M300 120 q24 -10 34 6 q-18 14 -34 -6 Z" fill="${C.leaf}" ${stroke(2)}/>` +
        sparkle(330, 70, 8),
    );
  })(),
};

/* ────────────────────────── scenes ────────────────────────── */

function heroScene() {
  const W = 800;
  const H = 960;
  const cx = 400;
  // Floor and stand.
  let s = `<rect x="0" y="770" width="${W}" height="${H - 770}" fill="${C.cream}"/>`;
  s += `<path d="M0 770 L${W} 770" ${stroke(3)}/>`;
  s += `<rect x="0" y="770" width="${W}" height="16" fill="url(#gingham)" opacity="0.9"/>`;
  s += shadow(cx + 10, 830, 230, 22, 0.14);
  s += `<path d="M${cx - 92} 828 Q${cx} 760 ${cx + 92} 828 Z" fill="${C.paper}" ${stroke(3.5)}/>`;
  s += `<rect x="${cx - 26}" y="700" width="52" height="96" fill="${C.paper}" ${stroke(3.5)}/>`;
  s += `<ellipse cx="${cx}" cy="700" rx="290" ry="44" fill="${C.paper}" ${stroke(3.5)}/>`;
  s += pipedBorder(cx, 700, 290, 44, 26, 7, C.rose);

  // Bottom tier with swags.
  s += cylinder(cx, 470, 230, 50, 214, C.rose);
  const swagCount = 6;
  for (let i = 0; i < swagCount; i++) {
    const a0 = Math.PI - (i / swagCount) * Math.PI;
    const a1 = Math.PI - ((i + 1) / swagCount) * Math.PI;
    const p0 = [cx + Math.cos(a0) * 230, 540 + Math.sin(Math.PI - a0) * 50];
    const p1 = [cx + Math.cos(a1) * 230, 540 + Math.sin(Math.PI - a1) * 50];
    const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 + 56];
    s += `<path d="M${f(p0[0])} ${f(p0[1])} Q${f(mid[0])} ${f(mid[1])} ${f(p1[0])} ${f(p1[1])}" fill="none" stroke="${C.cream}" stroke-width="10" stroke-linecap="round"/>`;
    s += `<path d="M${f(p0[0])} ${f(p0[1])} Q${f(mid[0])} ${f(mid[1])} ${f(p1[0])} ${f(p1[1])}" fill="none" ${stroke(2.4)} opacity="0.5"/>`;
    if (i > 0) s += cherry(f(p0[0]), f(p0[1]) + 2, 12, [10, -22]);
  }
  s += pipedBorder(cx, 684, 230, 50, 21, 12, C.cream);
  s += pipedBorder(cx, 470, 230, 50, 21, 10, C.cream);

  // Top tier with ganache drip.
  s += cylinder(cx, 290, 160, 36, 184, C.paper);
  let drip = `M${cx - 160} 290 L${cx - 160} 320`;
  const drips = 11;
  for (let i = 0; i < drips; i++) {
    const a = Math.PI - ((i + 0.5) / drips) * Math.PI;
    const x = cx + Math.cos(a) * 160;
    const yBase = 300 + Math.sin(Math.PI - a) * 36;
    const len = [34, 58, 26, 70, 40, 52, 30, 66, 38, 48, 28][i];
    drip += ` L${f(x - 10)} ${f(yBase + 14)} Q${f(x - 10)} ${f(yBase + len)} ${f(x)} ${f(yBase + len)} Q${f(x + 10)} ${f(yBase + len)} ${f(x + 10)} ${f(yBase + 14)}`;
  }
  drip += ` L${cx + 160} 320 L${cx + 160} 290 Z`;
  s += `<path d="${drip}" fill="${C.cherry}" ${stroke(3)}/>`;
  s += `<ellipse cx="${cx}" cy="290" rx="160" ry="36" fill="${C.cherry}" ${stroke(3)}/>`;
  s += `<path d="M${cx - 120} 300 Q${cx - 60} 318 ${cx - 10} 318" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity="0.35"/>`;
  s += pipedBorder(cx, 470, 160, 36, 15, 9, C.rose);

  // Crown of rosettes and cherries.
  const crown = [
    [-110, 292],
    [-60, 312],
    [0, 320],
    [60, 312],
    [110, 292],
    [-70, 272],
    [70, 272],
  ];
  crown.forEach(([dx, y]) => (s += rosette(cx + dx, y, 20, C.rose)));
  s += cherry(cx - 34, 262, 18, [-6, -44]);
  s += cherry(cx + 22, 268, 18, [14, -40]);
  s += rosette(cx - 4, 292, 22, C.cream);

  // Topper flag with the pause mark.
  s += `<path d="M${cx + 70} 268 L${cx + 70} 150" ${stroke(3.5)}/>`;
  s += `<g class="flag"><path d="M${cx + 70} 152 L${cx + 160} 168 L${cx + 70} 194 Z" fill="${C.butter}" ${stroke(3)}/>`;
  s += `<rect x="${cx + 92}" y="162" width="7" height="22" rx="3.5" fill="${C.cherry}"/><rect x="${cx + 106}" y="164" width="7" height="20" rx="3.5" fill="${C.cherry}"/></g>`;

  // Small plate with a slice in front.
  s += `<g transform="translate(470 744) scale(0.8)">${plate(140, 124, 132, 28)}${cheesecakeSlice(-20, -24, 0.9)}</g>`;

  // Sprinkles in the air.
  s +=
    sparkle(130, 170, 22) +
    sparkle(680, 250, 16, C.pistachio) +
    sparkle(640, 120, 10) +
    sparkle(160, 400, 9, C.pistachio) +
    sparkle(700, 520, 12);
  const confetti = [
    [210, 120, C.cherry, 30],
    [560, 180, C.butterDeep, -20],
    [100, 560, C.cherry, 70],
    [720, 380, C.pistachio, 10],
    [260, 230, C.pistachio, -45],
  ]
    .map(
      ([x, y, c, r]) =>
        `<g class="drift" style="${delay(x)}"><rect x="${x}" y="${y}" width="22" height="7" rx="3.5" fill="${c}" transform="rotate(${r} ${x} ${y})"/></g>`,
    )
    .join("");
  const defs = `<defs><pattern id="gingham" width="32" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${C.cherry}"/></pattern></defs>`;
  return svg(W, H, defs + confetti + s);
}

function pipingScene() {
  const W = 720;
  const H = 880;
  let s = `<rect width="${W}" height="${H}" fill="${C.cream}"/>`;
  // Cake top filling the lower part of the frame.
  s += `<ellipse cx="360" cy="760" rx="520" ry="230" fill="${C.rose}" ${stroke(3.5)}/>`;
  s += `<path d="M-160 760 L-160 ${H} L880 ${H} L880 760" fill="${C.rose}"/>`;
  // Rows of finished rosettes, in perspective.
  const rows = [
    { y: 640, r: 34, xs: [120, 220, 320, 420, 520, 620] },
    { y: 720, r: 42, xs: [60, 180, 300, 420, 540, 660] },
    { y: 820, r: 52, xs: [0, 140, 280, 420, 560, 700] },
  ];
  rows.forEach((row, ri) =>
    row.xs.forEach((x, i) => {
      if (ri === 0 && i >= 4) return; // space for the one being piped
      s += rosette(
        x,
        row.y,
        row.r,
        (i + ri) % 3 === 0 ? C.paper : C.roseMid,
        9,
      );
    }),
  );
  // The rosette being piped.
  s += `<g class="grow">${rosette(602, 606, 36, C.paper, 9)}</g>`;
  // Piping bag coming in from the top right.
  s += `<g class="squeeze"><g transform="rotate(-24 560 470)">
    <path d="M470 120 Q560 90 650 120 L585 520 L535 520 Z" fill="${C.paper}" ${stroke(3.5)}/>
    <path d="M500 130 L548 500" stroke="${C.ink}" stroke-width="2" opacity="0.25"/>
    <path d="M470 120 Q560 150 650 120" fill="none" ${stroke(3)}/>
    <path d="M520 470 L600 470 L585 520 L535 520 Z" fill="${C.roseMid}" ${stroke(3)}/>
    <path d="M538 520 L582 520 L572 566 L548 566 Z" fill="#CFC3B8" ${stroke(3)}/>
    <path d="M550 566 l4 12 l6 -10 l6 10 l4 -12" fill="none" ${stroke(2.4)}/>
    <path d="M560 90 Q560 40 600 30" fill="none" ${stroke(3)}/>
  </g></g>`;
  // Hand-lettered note.
  s += `<text x="60" y="140" font-family="Georgia, serif" font-style="italic" font-size="44" fill="${C.cherry}">one swirl</text>`;
  s += `<text x="100" y="196" font-family="Georgia, serif" font-style="italic" font-size="44" fill="${C.cherry}">at a time</text>`;
  s += `<path d="M300 210 q60 30 140 120" fill="none" ${stroke(2.6)} stroke-dasharray="2 10"/>`;
  s += `<path d="M430 318 l12 14 l4 -18" fill="none" ${stroke(2.6)}/>`;
  s +=
    sparkle(620, 80, 14) +
    sparkle(90, 420, 12, C.pistachio) +
    sparkle(250, 380, 8);
  return svg(W, H, s);
}

function kitchenScene() {
  const W = 960;
  const H = 1200;
  let s = `<rect width="${W}" height="${H}" fill="${C.rose}"/>`;
  // Checker tile backsplash.
  s += `<defs><pattern id="tiles" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="${C.cream}"/><rect width="40" height="40" fill="${C.pistachio}"/><rect x="40" y="40" width="40" height="40" fill="${C.pistachio}"/></pattern></defs>`;
  s += `<rect x="0" y="520" width="${W}" height="240" fill="url(#tiles)" opacity="0.9"/>`;
  s += `<path d="M0 520 L${W} 520" ${stroke(3.5)}/>`;
  // Shelf with jars.
  s += `<rect x="90" y="300" width="780" height="22" fill="${C.butter}" ${stroke(3.5)}/>`;
  const jar = (x, w, h, fill, label) =>
    `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}" rx="18" fill="${C.paper}" ${stroke(3.5)}/>` +
    `<rect x="${x + 8}" y="${300 - h * 0.62}" width="${w - 16}" height="${h * 0.62 - 10}" rx="10" fill="${fill}"/>` +
    `<rect x="${x + 6}" y="${300 - h - 18}" width="${w - 12}" height="22" rx="6" fill="${C.cherry}" ${stroke(3)}/>` +
    `<rect x="${x + w / 2 - 34}" y="${300 - h * 0.5}" width="68" height="34" rx="6" fill="${C.cream}" ${stroke(2.4)}/>` +
    `<text x="${x + w / 2}" y="${300 - h * 0.5 + 23}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="19" fill="${C.cherry}">${label}</text>`;
  s += jar(130, 120, 170, C.paper, "flour");
  s += jar(280, 110, 140, C.butter, "sugar");
  s += jar(420, 100, 120, C.chocMid, "cocoa");
  // Little plant.
  s += `<path d="M700 300 L712 230 L788 230 L800 300 Z" fill="${C.cherry}" ${stroke(3.5)}/>`;
  s += `<g class="sway"><path d="M750 230 q-60 -60 -30 -130 q50 40 30 130 Z" fill="${C.leaf}" ${stroke(3)}/><path d="M750 230 q50 -80 110 -70 q-20 70 -110 70 Z" fill="${C.leaf}" ${stroke(3)}/><path d="M750 230 q-10 -80 30 -160" fill="none" ${stroke(3)}/></g>`;
  s += sparkle(620, 160, 18) + sparkle(560, 230, 9, C.pistachio);

  // Counter.
  s += `<rect x="0" y="760" width="${W}" height="${H - 760}" fill="${C.butter}"/>`;
  s += `<rect x="0" y="760" width="${W}" height="34" fill="${C.butterDeep}" ${stroke(3.5)}/>`;
  // Mixing bowl with whisk.
  s += shadow(330, 990, 240, 26, 0.14);
  s += `<path d="M110 820 Q120 990 330 1000 Q540 990 550 820 Z" fill="${C.paper}" ${stroke(4)}/>`;
  s += `<ellipse cx="330" cy="820" rx="220" ry="44" fill="${C.paper}" ${stroke(4)}/>`;
  s += `<ellipse cx="330" cy="828" rx="196" ry="32" fill="${C.cream}" ${stroke(2.6)}/>`;
  s += `<path d="M180 830 q50 -20 100 0 t100 0 t90 -4" fill="none" stroke="${C.butterDeep}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M150 900 q180 50 360 0" fill="none" stroke="${C.cherry}" stroke-width="10" opacity="0.8"/>`;
  s += `<g class="whisk"><g transform="rotate(32 420 760)">
    <rect x="410" y="560" width="22" height="150" rx="10" fill="${C.cherry}" ${stroke(3.5)}/>
    <path d="M421 710 C360 760 370 860 421 880 C472 860 482 760 421 710 Z" fill="none" ${stroke(3)}/>
    <path d="M421 710 C390 770 395 850 421 880 C447 850 452 770 421 710 Z" fill="none" ${stroke(3)}/>
    <path d="M421 710 L421 880" ${stroke(3)}/>
  </g></g>`;
  // Rolling pin.
  s += `<g transform="rotate(-8 760 1080)">
    <rect x="610" y="1062" width="300" height="46" rx="23" fill="${C.biscuit}" ${stroke(3.5)}/>
    <rect x="560" y="1074" width="56" height="22" rx="11" fill="${C.biscuitDark}" ${stroke(3)}/>
    <rect x="904" y="1074" width="56" height="22" rx="11" fill="${C.biscuitDark}" ${stroke(3)}/>
  </g>`;
  // Cooling cookies.
  s += `<rect x="620" y="840" width="280" height="150" rx="10" fill="none" ${stroke(3)}/>`;
  for (let i = 1; i < 7; i++)
    s += `<path d="M${620 + i * 40} 840 L${620 + i * 40} 990" ${stroke(2)} opacity="0.5"/>`;
  [
    [680, 880],
    [770, 880],
    [850, 900],
    [700, 950],
    [800, 955],
  ].forEach(([x, y], i) => {
    s += `<path d="${blob(x, y, 38, 30, 0.12, 60 + i, 14)}" fill="${C.cookie}" ${stroke(3)}/>`;
    s +=
      chunk(x - 10, y - 6, 7, 80 + i, C.choc) +
      chunk(x + 12, y + 6, 6, 90 + i, C.choc);
  });
  // Recipe card.
  s += `<g transform="rotate(-6 200 1110)"><rect x="80" y="1050" width="230" height="130" rx="8" fill="${C.paper}" ${stroke(3)}/>
    <text x="104" y="1092" font-family="Georgia, serif" font-style="italic" font-size="26" fill="${C.cherry}">for later</text>
    <path d="M104 1116 L280 1116 M104 1140 L250 1140 M104 1164 L220 1164" ${stroke(2)} opacity="0.4"/></g>`;
  s += crumbs(
    [
      [560, 1040, 6],
      [600, 1010, 4],
      [470, 1100, 5],
    ],
    C.cookie,
  );
  return svg(W, H, s);
}

function smallScene(kind) {
  const W = 160;
  const H = 120;
  if (kind === "chai") {
    return svg(
      W,
      H,
      shadow(70, 106, 50, 6) +
        `<ellipse cx="66" cy="102" rx="50" ry="10" fill="${C.paper}" ${stroke(2.6)}/>` +
        `<path d="M30 54 L36 96 Q66 106 96 96 L102 54 Z" fill="${C.paper}" ${stroke(2.6)}/>` +
        `<ellipse cx="66" cy="54" rx="36" ry="9" fill="${C.coffee}" ${stroke(2.6)}/>` +
        `<path d="M100 62 q20 0 18 16 q-2 14 -20 12" fill="none" ${stroke(2.6)}/>` +
        `<path d="M40 70 q26 8 52 0" fill="none" stroke="${C.cherry}" stroke-width="4"/>` +
        `<path class="steam" d="M56 38 q-8 -10 0 -18 q8 -8 0 -16 M76 38 q-8 -10 0 -18 q8 -8 0 -16" fill="none" ${stroke(2.2)} opacity="0.6"/>` +
        `<path d="${blob(128, 100, 24, 10, 0.1, 5, 12)}" fill="${C.cookie}" ${stroke(2.4)}/>` +
        chunk(120, 98, 4, 7, C.choc) +
        chunk(134, 102, 4, 9, C.choc),
    );
  }
  if (kind === "gift") {
    return svg(
      W,
      H,
      shadow(84, 108, 54, 6) +
        `<rect x="34" y="52" width="100" height="54" rx="4" fill="${C.cherry}" ${stroke(2.6)}/>` +
        `<rect x="28" y="40" width="112" height="18" rx="4" fill="${C.cherry}" ${stroke(2.6)}/>` +
        `<rect x="76" y="40" width="16" height="66" fill="${C.butter}" ${stroke(2.4)}/>` +
        `<path d="M84 40 C60 10 40 26 58 38 Z M84 40 C108 10 128 26 110 38 Z" fill="${C.butter}" ${stroke(2.4)}/>` +
        `<path d="M84 40 l-10 18 M84 40 l10 18" ${stroke(2.4)}/>` +
        sparkle(138, 22, 8, C.pistachio) +
        sparkle(24, 24, 6),
    );
  }
  // candle
  return svg(
    W,
    H,
    shadow(80, 108, 56, 6) +
      `<ellipse cx="78" cy="104" rx="56" ry="10" fill="${C.paper}" ${stroke(2.6)}/>` +
      `<path d="M30 78 L110 66 L130 78 L130 98 L30 100 Z" fill="${C.paper}" ${stroke(2.6)}/>` +
      `<path d="M30 78 L130 78 L130 98 L30 100 Z" fill="${C.rose}" ${stroke(2.6)}/>` +
      `<path d="M30 88 L130 88" stroke="${C.cherry}" stroke-width="4"/>` +
      `<path d="M30 78 L110 66 L130 78 Z" fill="${C.rose}" ${stroke(2.6)}/>` +
      `<rect x="82" y="34" width="8" height="38" rx="2" fill="${C.butter}" ${stroke(2.2)}/>` +
      `<path class="flame" d="M86 30 q-8 -10 0 -22 q8 12 0 22 Z" fill="${C.butterDeep}" ${stroke(2.2)}/>` +
      sparkle(116, 26, 7) +
      sparkle(48, 40, 5, C.pistachio),
  );
}

mkdirSync("public/images/bakes", { recursive: true });
mkdirSync("public/images/scenes", { recursive: true });
for (const [name, content] of Object.entries(bakes))
  writeFileSync(`public/images/bakes/${name}.svg`, content);
writeFileSync("public/images/scenes/hero.svg", heroScene());
writeFileSync("public/images/scenes/texture.svg", pipingScene());
writeFileSync("public/images/scenes/kitchen.svg", kitchenScene());
for (const kind of ["chai", "gift", "candle"])
  writeFileSync(`public/images/scenes/${kind}.svg`, smallScene(kind));
console.log("Illustrations written to public/images");
