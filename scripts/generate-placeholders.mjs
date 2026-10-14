#!/usr/bin/env node
// Generates deterministic, dependency-free placeholder SVGs for the exhibition.
// Usage: node scripts/generate-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const FONT = "Space Grotesk, Inter, Arial, sans-serif";
const MONO = "ui-monospace, Menlo, Consolas, monospace";

const PROJECTS = [
  { n: "01", a: "#8B7CFF", b: "#4D8DFF", title: "AI LEARNING ASSISTANT" },
  { n: "02", a: "#E879D0", b: "#FFB86B", title: "IMAGE GENERATOR" },
  { n: "03", a: "#5EE3F0", b: "#4D8DFF", title: "DATA ANALYTICS" },
  { n: "04", a: "#6EA8FF", b: "#A78BFA", title: "DESKTOP PRODUCTIVITY APP" },
  { n: "05", a: "#7CF0B4", b: "#5EE3F0", title: "AI MODEL RESEARCH" },
];

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (v) => Math.round(v * 10) / 10;

function svg(w, h, title, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">
<title>${title}</title>
<defs>${defs}</defs>
${body}
</svg>
`;
}
function write(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  if (content.length > 40000) console.warn("WARN >40KB:", rel, content.length);
  console.log("wrote", rel, content.length);
}
const text = (x, y, s, size, fill, extra = "") =>
  `<text x="${x}" y="${y}" ${extra.includes("font-family") ? "" : `font-family="${FONT}"`} font-size="${size}" fill="${fill}" ${extra}>${String(s).replace(/&/g, "&amp;")}</text>`;

/* ------------------------------------------------------------ covers */
function coverFrame(p, id, defs, art) {
  const base = `
<linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070914"/><stop offset="1" stop-color="#0b1026"/></linearGradient>
<linearGradient id="${id}fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#05060d" stop-opacity="0"/><stop offset="1" stop-color="#05060d" stop-opacity="0.85"/></linearGradient>
<radialGradient id="${id}vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>`;
  const ui = `
<rect width="1600" height="1000" fill="url(#${id}fade)"/>
<rect width="1600" height="1000" fill="url(#${id}vig)"/>
<rect x="40.5" y="40.5" width="1519" height="919" rx="6" fill="none" stroke="#fff" stroke-opacity="0.10"/>
${text(80, 930, p.n, 120, "#fff", 'font-weight="300" letter-spacing="-4" fill-opacity="0.95"')}
<rect x="80" y="816" width="56" height="4" fill="${p.a}"/>
${text(260, 902, p.title, 26, "#fff", 'font-weight="600" letter-spacing="6" fill-opacity="0.9"')}
${text(260, 934, "PROJECT " + p.n + " / 05", 18, "#fff", 'letter-spacing="5" fill-opacity="0.5"')}
<rect x="1264" y="72" width="264" height="40" rx="3" fill="#05060d" fill-opacity="0.6" stroke="${p.a}" stroke-opacity="0.7"/>
${text(1396, 98, "PLACEHOLDER VISUAL", 16, "#fff", 'text-anchor="middle" letter-spacing="3.5" fill-opacity="0.85"')}`;
  return svg(1600, 1000, `Project ${p.n} cover placeholder - ${p.title}`, base + defs,
    `<rect width="1600" height="1000" fill="url(#${id}bg)"/>${art}${ui}`);
}

function cover01(p) {
  const id = "c1", R = rng(11);
  const cx = 1010, cy = 440;
  let rings = "", nodes = "";
  for (let i = 1; i <= 7; i++) {
    const r = i * 62;
    rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${i % 2 ? p.a : p.b}" stroke-opacity="${f(0.55 - i * 0.05)}" stroke-width="${i === 3 ? 2.5 : 1.2}" ${i % 3 === 0 ? 'stroke-dasharray="3 9"' : ""}/>`;
    const k = 2 + (i % 3);
    for (let j = 0; j < k; j++) {
      const ang = R() * Math.PI * 2;
      const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
      nodes += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(4 + R() * 6)}" fill="${j % 2 ? p.b : "#fff"}" fill-opacity="0.9"/><circle cx="${f(x)}" cy="${f(y)}" r="16" fill="url(#${id}g)" opacity="0.5"/>`;
    }
  }
  const bubble = (x, y, w, h, c, o, tail) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="${c}" fill-opacity="${o}" stroke="${c}" stroke-opacity="0.8"/><path d="M${tail > 0 ? x + w - 40 : x + 40} ${y + h - 1} l${tail * 18} 30 l${tail * -44} -30z" fill="${c}" fill-opacity="${o}"/><rect x="${x + 28}" y="${y + h / 2 - 14}" width="${w * 0.55}" height="8" rx="4" fill="#fff" fill-opacity="0.6"/><rect x="${x + 28}" y="${y + h / 2 + 6}" width="${w * 0.35}" height="8" rx="4" fill="#fff" fill-opacity="0.35"/></g>`;
  const defs = `
<radialGradient id="${id}g"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}core" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.25" stop-color="${p.a}" stop-opacity="0.8"/><stop offset="1" stop-color="${p.b}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${p.a}" stop-opacity="0.45"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>`;
  const art = `<circle cx="${cx}" cy="${cy}" r="520" fill="url(#${id}halo)"/>${rings}${nodes}
<circle cx="${cx}" cy="${cy}" r="90" fill="url(#${id}core)"/><circle cx="${cx}" cy="${cy}" r="14" fill="#fff"/>
${bubble(150, 150, 400, 130, p.a, 0.16, 1)}${bubble(260, 340, 360, 110, p.b, 0.18, -1)}${bubble(120, 520, 300, 96, p.a, 0.12, 1)}`;
  return coverFrame(p, id, defs, art);
}

function cover02(p) {
  const id = "c2", R = rng(22);
  const ridge = (base, amp, step, seed, fill, op) => {
    const r = rng(seed);
    let d = `M0 1000 L0 ${base}`;
    let y = base;
    for (let x = step; x <= 1600 + step; x += step) {
      y = base - r() * amp + (r() - 0.5) * amp * 0.4;
      d += ` L${x} ${f(y)}`;
    }
    return `<path d="${d} L1600 1000Z" fill="${fill}" fill-opacity="${op}"/>`;
  };
  let stars = "";
  for (let i = 0; i < 70; i++) stars += `<circle cx="${f(R() * 1600)}" cy="${f(R() * 420)}" r="${f(0.8 + R() * 1.6)}" fill="#fff" fill-opacity="${f(0.3 + R() * 0.6)}"/>`;
  const defs = `
<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0720"/><stop offset="0.5" stop-color="#3a1550"/><stop offset="0.78" stop-color="${p.a}" stop-opacity="0.75"/><stop offset="1" stop-color="${p.b}"/></linearGradient>
<radialGradient id="${id}sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6e0"/><stop offset="0.35" stop-color="${p.b}"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b2a78"/><stop offset="1" stop-color="#1a0b30"/></linearGradient>
<linearGradient id="${id}m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1050"/><stop offset="1" stop-color="#090516"/></linearGradient>
<linearGradient id="${id}ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.b}"/><stop offset="1" stop-color="${p.a}"/></linearGradient>`;
  const art = `<rect width="1600" height="1000" fill="url(#${id}sky)"/>${stars}
<circle cx="800" cy="470" r="420" fill="url(#${id}sun)" opacity="0.8"/>
<circle cx="800" cy="450" r="210" fill="none" stroke="url(#${id}ring)" stroke-width="4"/>
<circle cx="800" cy="450" r="170" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="1.5"/>
<circle cx="800" cy="450" r="130" fill="#fff6e0" fill-opacity="0.92"/>
${ridge(640, 190, 80, 5, `url(#${id}m1)`, 0.95)}${ridge(740, 170, 60, 9, `url(#${id}m2)`, 1)}${ridge(850, 110, 50, 14, "#05030d", 1)}
<rect y="860" width="1600" height="140" fill="#05030d" fill-opacity="0.6"/>
<path d="M0 900 H1600" stroke="${p.b}" stroke-opacity="0.35"/>`;
  return coverFrame(p, id, defs, art);
}

function cover03(p) {
  const id = "c3", R = rng(33);
  let bars = "";
  const n = 46, bw = 24, gap = 10;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const x = 70 + i * (bw + gap);
    const wave = 0.5 + 0.35 * Math.sin(i * 0.28) + 0.12 * Math.sin(i * 0.9 + 1);
    const h = 90 + wave * 420 * (0.7 + R() * 0.4);
    const y = 780 - h;
    bars += `<rect x="${x}" y="${f(y)}" width="${bw}" height="${f(h)}" rx="3" fill="url(#${id}bar)" fill-opacity="${f(0.35 + (i / n) * 0.6)}"/>`;
    pts.push([x + bw / 2, y - 40 - 90 * Math.sin(i * 0.2 + 2)]);
  }
  let d = `M${pts[0][0]} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += ` C${mx} ${f(y0)} ${mx} ${f(y1)} ${x1} ${f(y1)}`;
  }
  let grid = "";
  for (let i = 0; i < 6; i++) grid += `<line x1="60" x2="1540" y1="${180 + i * 120}" y2="${180 + i * 120}" stroke="#fff" stroke-opacity="0.05"/>`;
  const dots = pts.filter((_, i) => i % 6 === 3).map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="#05060d" stroke="#fff" stroke-width="2.5"/><circle cx="${f(x)}" cy="${f(y)}" r="26" fill="url(#${id}g)" opacity="0.6"/>`).join("");
  const defs = `
<linearGradient id="${id}bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}" stop-opacity="0.08"/></linearGradient>
<linearGradient id="${id}ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.b}"/><stop offset="0.6" stop-color="${p.a}"/><stop offset="1" stop-color="#fff"/></linearGradient>
<radialGradient id="${id}g"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}glow" cx="0.7" cy="0.4" r="0.6"><stop offset="0" stop-color="${p.a}" stop-opacity="0.28"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>`;
  const art = `<rect width="1600" height="1000" fill="url(#${id}glow)"/>${grid}${bars}
<path d="${d}" fill="none" stroke="${p.a}" stroke-opacity="0.35" stroke-width="14"/>
<path d="${d}" fill="none" stroke="url(#${id}ln)" stroke-width="3.5" stroke-linecap="round"/>${dots}
<line x1="60" x2="1540" y1="780" y2="780" stroke="#fff" stroke-opacity="0.25"/>`;
  return coverFrame(p, id, defs, art);
}

function cover04(p) {
  const id = "c4";
  const win = (x, y, w, h, rot, c, op, content) =>
    `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#0d1226" fill-opacity="${op}" stroke="${c}" stroke-opacity="0.7" stroke-width="1.5"/><path d="M${x} ${y + 52} H${x + w}" stroke="#fff" stroke-opacity="0.12"/><path d="M${x} ${y + 18}a18 18 0 0 1 18 -18H${x + w - 18}a18 18 0 0 1 18 18V${y + 52}H${x}z" fill="${c}" fill-opacity="0.14"/><circle cx="${x + 30}" cy="${y + 27}" r="6" fill="${c}"/><circle cx="${x + 52}" cy="${y + 27}" r="6" fill="#fff" fill-opacity="0.35"/><circle cx="${x + 74}" cy="${y + 27}" r="6" fill="#fff" fill-opacity="0.2"/>${content}</g>`;
  const rows = (x, y, w, c) => [0, 1, 2, 3].map((i) => `<rect x="${x}" y="${y + i * 46}" width="22" height="22" rx="6" fill="none" stroke="${c}" stroke-width="2"/>${i < 2 ? `<path d="M${x + 5} ${y + i * 46 + 11} l5 5 l8 -10" stroke="${c}" stroke-width="2.5" fill="none"/>` : ""}<rect x="${x + 40}" y="${y + 4 + i * 46}" width="${w * (0.8 - i * 0.14)}" height="12" rx="6" fill="#fff" fill-opacity="${i < 2 ? 0.25 : 0.5}"/>`).join("");
  const defs = `
<radialGradient id="${id}glow" cx="0.55" cy="0.45" r="0.55"><stop offset="0" stop-color="${p.b}" stop-opacity="0.35"/><stop offset="1" stop-color="${p.b}" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/></linearGradient>
<linearGradient id="${id}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}" stop-opacity="0.18"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></linearGradient>`;
  const art = `<rect width="1600" height="1000" fill="url(#${id}glow)"/>
<path d="M200 760 L1400 760 L1600 1000 L0 1000Z" fill="url(#${id}floor)"/>
${win(760, 120, 640, 420, 4, p.b, 0.55, rows(800, 210, 440, p.b))}
${win(430, 220, 640, 430, -3, p.a, 0.78, rows(470, 320, 420, p.a))}
${win(640, 360, 600, 380, 2, "#ffffff", 0.9, `<circle cx="940" cy="570" r="105" fill="none" stroke="#fff" stroke-opacity="0.1" stroke-width="16"/><circle cx="940" cy="570" r="105" fill="none" stroke="url(#${id}ring)" stroke-width="16" stroke-linecap="round" stroke-dasharray="470 700" transform="rotate(-90 940 570)"/><rect x="900" y="560" width="80" height="16" rx="8" fill="#fff" fill-opacity="0.8"/>`)}`;
  return coverFrame(p, id, defs, art);
}

function cover05(p) {
  const id = "c5", R = rng(55);
  const layers = [4, 7, 8, 7, 4];
  const lx = (i) => 720 + i * 150;
  const ly = (i, j) => 470 + (j - (layers[i] - 1) / 2) * 72;
  let lines = "", nodes = "";
  for (let i = 0; i < layers.length - 1; i++)
    for (let j = 0; j < layers[i]; j++)
      for (let k = 0; k < layers[i + 1]; k++) {
        const o = R();
        if (o > 0.55) continue;
        lines += `<line x1="${lx(i)}" y1="${ly(i, j)}" x2="${lx(i + 1)}" y2="${ly(i + 1, k)}" stroke="${o < 0.15 ? p.a : p.b}" stroke-opacity="${f(0.12 + o * 0.6)}" stroke-width="1.2"/>`;
      }
  layers.forEach((c, i) => { for (let j = 0; j < c; j++) { const hot = R() > 0.7; nodes += `<circle cx="${lx(i)}" cy="${f(ly(i, j))}" r="${hot ? 11 : 8}" fill="${hot ? "#fff" : "#0b1026"}" stroke="${hot ? p.a : p.b}" stroke-width="2.5"/>${hot ? `<circle cx="${lx(i)}" cy="${f(ly(i, j))}" r="30" fill="url(#${id}g)" opacity="0.55"/>` : ""}`; } });
  let curve = "M90 330";
  for (let x = 90; x <= 570; x += 12) { const t = (x - 90) / 480; curve += ` L${x} ${f(330 + 250 * (1 - Math.exp(-4 * t)) - 20 * Math.sin(t * 40) * (1 - t))}`; }
  const defs = `
<radialGradient id="${id}g"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}glow" cx="0.55" cy="0.5" r="0.5"><stop offset="0" stop-color="${p.a}" stop-opacity="0.22"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/></linearGradient>`;
  let grid = "";
  for (let i = 0; i < 5; i++) grid += `<line x1="90" x2="570" y1="${300 + i * 80}" y2="${300 + i * 80}" stroke="#fff" stroke-opacity="0.06"/>`;
  const art = `<rect width="1600" height="1000" fill="url(#${id}glow)"/>
${grid}<line x1="90" y1="300" x2="90" y2="620" stroke="#fff" stroke-opacity="0.3"/><line x1="90" y1="620" x2="570" y2="620" stroke="#fff" stroke-opacity="0.3"/>
<path d="${curve}" fill="none" stroke="${p.a}" stroke-opacity="0.3" stroke-width="10"/><path d="${curve}" fill="none" stroke="url(#${id}ln)" stroke-width="3" stroke-linecap="round"/>
${text(90, 280, "LOSS", 16, "#fff", 'letter-spacing="4" fill-opacity="0.55"')}${text(570, 652, "EPOCH", 16, "#fff", 'letter-spacing="4" text-anchor="end" fill-opacity="0.55"')}
${lines}${nodes}`;
  return coverFrame(p, id, defs, art);
}

/* ------------------------------------------------------------ screenshots */
const GREY = "#9AA3BC";
const bar = (x, y, w, o = 0.22, h = 10, c = GREY) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${c}" fill-opacity="${o}"/>`;
const panel = (x, y, w, h, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#12172b" stroke="#fff" stroke-opacity="0.07" ${extra}/>`;
const lines = (x, y, w, n, gap = 24, o = 0.2) => Array.from({ length: n }, (_, i) => bar(x, y + i * gap, w * (i === n - 1 ? 0.55 : 1 - (i % 3) * 0.08), o)).join("");
const chip = (x, y, w, c, label, o = 0.18) => `<rect x="${x}" y="${y}" width="${w}" height="32" rx="16" fill="${c}" fill-opacity="${o}" stroke="${c}" stroke-opacity="0.6"/>${text(x + w / 2, y + 21, label, 13, "#fff", 'text-anchor="middle" letter-spacing="1.5" fill-opacity="0.85"')}`;

function shell(p, id, appName, nav, active, bodyFn, extraDefs = "") {
  const defs = `
<linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#080b18"/><stop offset="1" stop-color="#0d1226"/></linearGradient>
<linearGradient id="${id}acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/></linearGradient>
<linearGradient id="${id}accv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}" stop-opacity="0.25"/></linearGradient>
<radialGradient id="${id}glow" cx="0.8" cy="0" r="0.8"><stop offset="0" stop-color="${p.a}" stop-opacity="0.2"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>${extraDefs}`;
  const side = nav.map((n, i) => {
    const y = 150 + i * 56, on = i === active;
    return `${on ? `<rect x="24" y="${y - 20}" width="232" height="44" rx="12" fill="${p.a}" fill-opacity="0.16" stroke="${p.a}" stroke-opacity="0.5"/>` : ""}<rect x="44" y="${y - 6}" width="16" height="16" rx="5" fill="${on ? p.a : GREY}" fill-opacity="${on ? 1 : 0.4}"/>${text(76, y + 7, n, 16, "#fff", `fill-opacity="${on ? 0.95 : 0.55}" letter-spacing="0.5"`)}`;
  }).join("");
  const body = `<rect width="1600" height="1000" fill="url(#${id}bg)"/><rect width="1600" height="1000" fill="url(#${id}glow)"/>
<rect x="0" y="0" width="1600" height="56" fill="#0a0e1d"/><line x1="0" x2="1600" y1="56" y2="56" stroke="#fff" stroke-opacity="0.08"/>
<circle cx="28" cy="28" r="6" fill="${p.a}"/><circle cx="50" cy="28" r="6" fill="#fff" fill-opacity="0.3"/><circle cx="72" cy="28" r="6" fill="#fff" fill-opacity="0.15"/>
<rect x="560" y="12" width="480" height="32" rx="16" fill="#fff" fill-opacity="0.05"/>${text(800, 33, "app.example / " + appName.toLowerCase().replace(/ /g, "-"), 13, "#fff", `text-anchor="middle" fill-opacity="0.4" font-family="${MONO}" letter-spacing="0.5"`)}
<rect x="1270" y="11" width="306" height="34" rx="4" fill="#05060d" fill-opacity="0.7" stroke="${p.a}" stroke-opacity="0.8"/>${text(1423, 33, "PLACEHOLDER — ILLUSTRATIVE UI", 13, "#fff", 'text-anchor="middle" letter-spacing="2" fill-opacity="0.9"')}
<rect x="0" y="57" width="280" height="943" fill="#0a0e1d" fill-opacity="0.8"/><line x1="280" x2="280" y1="57" y2="1000" stroke="#fff" stroke-opacity="0.07"/>
<rect x="28" y="84" width="34" height="34" rx="10" fill="url(#${id}acc)"/>${text(76, 108, appName, 19, "#fff", 'font-weight="600" fill-opacity="0.95"')}${side}
<rect x="24" y="900" width="232" height="64" rx="14" fill="#fff" fill-opacity="0.04"/><circle cx="56" cy="932" r="16" fill="url(#${id}acc)"/>${bar(84, 922, 110, 0.35)}${bar(84, 940, 70, 0.18, 8)}
${bodyFn()}`;
  return svg(1600, 1000, `${appName} placeholder screen`, defs, body);
}
const head = (title, sub, id) => `${text(330, 128, title, 34, "#fff", 'font-weight="600" fill-opacity="0.95" letter-spacing="-0.5"')}${text(330, 156, sub, 15, "#fff", 'fill-opacity="0.4" letter-spacing="2"')}`;

/* mini generated artwork, used in project 02 */
function art(id, x, y, w, h, hue, k) {
  const r = rng(k * 97 + 3), cps = `${id}clip${k}`;
  const cols = [["#2a0f4a", "#e879d0", "#ffb86b"], ["#071a3a", "#4d8dff", "#5ee3f0"], ["#2b0f2a", "#ff8a5c", "#ffd48a"], ["#0a2a2a", "#7cf0b4", "#5ee3f0"], ["#1c0f4a", "#8b7cff", "#e879d0"], ["#300f1a", "#ff6b8b", "#ffb86b"]][hue % 6];
  let d = `M${x} ${y + h}`;
  for (let i = 0; i <= 8; i++) d += ` L${f(x + (w * i) / 8)} ${f(y + h * (0.55 + r() * 0.3))}`;
  d += ` L${x + w} ${y + h}Z`;
  let d2 = `M${x} ${y + h}`;
  for (let i = 0; i <= 6; i++) d2 += ` L${f(x + (w * i) / 6)} ${f(y + h * (0.72 + r() * 0.2))}`;
  d2 += ` L${x + w} ${y + h}Z`;
  return `<linearGradient id="${id}ag${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cols[0]}"/><stop offset="0.8" stop-color="${cols[1]}"/><stop offset="1" stop-color="${cols[2]}"/></linearGradient><clipPath id="${cps}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/></clipPath><g clip-path="url(#${cps})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}ag${k})"/><circle cx="${f(x + w * (0.3 + r() * 0.4))}" cy="${f(y + h * 0.4)}" r="${f(h * 0.14)}" fill="#fff" fill-opacity="0.85"/><path d="${d}" fill="#12061f" fill-opacity="0.65"/><path d="${d2}" fill="#05030d" fill-opacity="0.9"/></g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="none" stroke="#fff" stroke-opacity="0.12"/>`;
}

const SCREENS = {
  "01": (p) => {
    const nav = ["Ask", "Notes", "My Path", "Import", "Settings"];
    const mk = (i, title, sub, fn) => shell(p, `s1${i}`, "Learning Assistant", nav, i, () => head(title, sub, `s1${i}`) + fn(`s1${i}`));
    return [
      mk(0, "Ask anything", "Q&A  ·  SAMPLE CONVERSATION", (id) => `
${panel(330, 190, 1240, 790)}
<rect x="370" y="230" width="520" height="120" rx="20" fill="#fff" fill-opacity="0.06"/>${lines(400, 262, 440, 3, 26, 0.25)}
<rect x="720" y="380" width="800" height="210" rx="20" fill="${p.a}" fill-opacity="0.16" stroke="${p.a}" stroke-opacity="0.5"/>${lines(752, 418, 700, 5, 30, 0.35)}
${chip(752, 548, 120, p.b, "SOURCE 1")}${chip(886, 548, 120, p.b, "SOURCE 2")}
<rect x="370" y="620" width="420" height="90" rx="20" fill="#fff" fill-opacity="0.06"/>${lines(400, 652, 340, 2, 26, 0.25)}
<rect x="720" y="740" width="800" height="100" rx="20" fill="${p.a}" fill-opacity="0.16" stroke="${p.a}" stroke-opacity="0.5"/>${lines(752, 774, 640, 2, 30, 0.35)}
<rect x="370" y="880" width="1130" height="64" rx="32" fill="#0a0e1d" stroke="#fff" stroke-opacity="0.12"/>${bar(410, 908, 300, 0.2)}<circle cx="1466" cy="912" r="22" fill="url(#${id}acc)"/>`),
      mk(1, "Smart notes", "NOTES  ·  AUTO-SUMMARY", (id) => `
${panel(330, 190, 380, 790)}${[0, 1, 2, 3, 4].map((i) => `<rect x="350" y="${210 + i * 110}" width="340" height="96" rx="12" fill="${i === 1 ? p.a : "#fff"}" fill-opacity="${i === 1 ? 0.16 : 0.04}" ${i === 1 ? `stroke="${p.a}" stroke-opacity="0.5"` : ""}/>${bar(372, 236 + i * 110, 180, 0.4, 12)}${bar(372, 262 + i * 110, 290, 0.18)}${bar(372, 282 + i * 110, 220, 0.18)}`).join("")}
${panel(730, 190, 840, 790)}${bar(780, 250, 380, 0.5, 20)}${chip(780, 292, 90, p.a, "TAG")}${chip(882, 292, 90, p.b, "TAG")}
${lines(780, 370, 740, 5, 30, 0.2)}<rect x="770" y="526" width="760" height="40" rx="8" fill="${p.a}" fill-opacity="0.18"/>${bar(780, 541, 520, 0.45)}
${lines(780, 610, 740, 4, 30, 0.2)}
<rect x="780" y="760" width="740" height="180" rx="14" fill="${p.b}" fill-opacity="0.1" stroke="${p.b}" stroke-opacity="0.45" stroke-dasharray="6 6"/>${text(806, 794, "AI SUMMARY", 14, p.b, 'letter-spacing="3"')}${lines(806, 818, 660, 3, 28, 0.3)}`),
      mk(2, "Personalised path", "LEARNING PATH  ·  SAMPLE", (id) => {
        const pts = [[470, 760], [700, 620], [930, 700], [1160, 500], [1390, 380]];
        let d = `M${pts[0]}`; for (let i = 1; i < pts.length; i++) d += ` C${(pts[i - 1][0] + pts[i][0]) / 2} ${pts[i - 1][1]} ${(pts[i - 1][0] + pts[i][0]) / 2} ${pts[i][1]} ${pts[i]}`;
        return `${panel(330, 190, 1240, 790)}<path d="${d}" fill="none" stroke="url(#${id}acc)" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 14"/>
${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i < 3 ? 30 : 24}" fill="${i < 3 ? p.a : "#0a0e1d"}" fill-opacity="${i < 3 ? 0.9 : 1}" stroke="${p.a}" stroke-width="3"/>${i < 2 ? `<path d="M${x - 10} ${y} l7 7 l13 -14" stroke="#fff" stroke-width="3.5" fill="none"/>` : ""}<rect x="${x - 90}" y="${y + 46}" width="180" height="62" rx="12" fill="#fff" fill-opacity="0.05"/>${bar(x - 70, y + 64, 120, 0.4)}${bar(x - 70, y + 82, 80, 0.18, 8)}`).join("")}
<rect x="370" y="230" width="360" height="120" rx="16" fill="${p.a}" fill-opacity="0.12" stroke="${p.a}" stroke-opacity="0.4"/>${text(396, 266, "CURRENT GOAL", 13, p.a, 'letter-spacing="3"')}${bar(396, 288, 240, 0.45, 12)}<rect x="396" y="318" width="300" height="8" rx="4" fill="#fff" fill-opacity="0.1"/><rect x="396" y="318" width="170" height="8" rx="4" fill="url(#${id}acc)"/>`;
      }),
      mk(3, "Import anything", "MULTI-FORMAT IMPORT  ·  SAMPLE", (id) => `
${panel(330, 190, 700, 790)}<rect x="370" y="240" width="620" height="300" rx="20" fill="${p.a}" fill-opacity="0.07" stroke="${p.a}" stroke-opacity="0.6" stroke-dasharray="10 10"/>
<path d="M680 330 v110 M640 380 l40 -50 l40 50" stroke="${p.a}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${bar(580, 470, 200, 0.4, 12)}${bar(610, 496, 140, 0.2)}
${["PDF", "DOC", "TXT", "URL"].map((t, i) => `<rect x="${370 + i * 160}" y="580" width="140" height="120" rx="14" fill="#fff" fill-opacity="0.05" stroke="#fff" stroke-opacity="0.1"/>${text(440 + i * 160, 648, t, 24, i === 0 ? p.a : "#fff", `text-anchor="middle" font-weight="600" fill-opacity="${i === 0 ? 1 : 0.7}" letter-spacing="2"`)}`).join("")}
${[0, 1, 2].map((i) => `<rect x="370" y="${740 + i * 74}" width="620" height="58" rx="12" fill="#fff" fill-opacity="0.04"/><rect x="390" y="${756 + i * 74}" width="26" height="26" rx="6" fill="${i ? p.b : p.a}" fill-opacity="0.6"/>${bar(430, 762 + i * 74, 200, 0.4)}<rect x="800" y="${766 + i * 74}" width="170" height="8" rx="4" fill="#fff" fill-opacity="0.1"/><rect x="800" y="${766 + i * 74}" width="${[170, 120, 60][i]}" height="8" rx="4" fill="url(#${id}acc)"/>`).join("")}
${panel(1060, 190, 510, 790)}${text(1090, 236, "EXTRACTED OUTLINE", 13, p.a, 'letter-spacing="3"')}${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${1100 + (i % 3 === 1 ? 24 : 0)}" cy="${290 + i * 62}" r="6" fill="${i % 3 === 0 ? p.a : GREY}" fill-opacity="${i % 3 === 0 ? 1 : 0.5}"/>${bar(1124 + (i % 3 === 1 ? 24 : 0), 285 + i * 62, 300 - (i % 3) * 40, i % 3 === 0 ? 0.5 : 0.22, 12)}`).join("")}`),
    ];
  },
  "02": (p) => {
    const nav = ["Create", "Gallery", "Styles", "History", "Settings"];
    const mk = (i, title, sub, fn) => shell(p, `s2${i}`, "Image Studio", nav, i, () => head(title, sub, `s2${i}`) + fn(`s2${i}`));
    const sliders = (id, x, y, n) => Array.from({ length: n }, (_, i) => `${bar(x, y + i * 62, 120, 0.4)}<rect x="${x}" y="${y + 24 + i * 62}" width="300" height="6" rx="3" fill="#fff" fill-opacity="0.1"/><rect x="${x}" y="${y + 24 + i * 62}" width="${100 + ((i * 70) % 160)}" height="6" rx="3" fill="url(#${id}acc)"/><circle cx="${x + 100 + ((i * 70) % 160)}" cy="${y + 27 + i * 62}" r="9" fill="#fff"/>`).join("");
    return [
      mk(0, "Create", "PROMPT  ·  SAMPLE PANEL", (id) => `
${panel(330, 190, 460, 790)}${text(360, 236, "PROMPT", 13, p.a, 'letter-spacing="3"')}<rect x="360" y="256" width="400" height="190" rx="14" fill="#0a0e1d" stroke="${p.a}" stroke-opacity="0.5"/>${lines(384, 288, 340, 4, 30, 0.35)}
${text(360, 490, "STYLE", 13, p.a, 'letter-spacing="3"')}${chip(360, 506, 90, p.a, "SURREAL", 0.25)}${chip(460, 506, 90, p.b, "CINEMA")}${chip(560, 506, 90, p.b, "PAINTED")}${chip(660, 506, 90, p.b, "NEON")}
${sliders(id, 360, 590, 3)}<rect x="360" y="850" width="400" height="60" rx="14" fill="url(#${id}acc)"/>${text(560, 888, "GENERATE", 18, "#0a0e1d", 'text-anchor="middle" font-weight="700" letter-spacing="4"')}
${panel(820, 190, 750, 790)}${art(id, 850, 220, 690, 620, 0, 1)}${[0, 1, 2, 3].map((i) => art(id, 850 + i * 177, 860, 159, 90, i + 1, 10 + i)).join("")}`),
      mk(1, "Gallery", "GENERATED SET  ·  SAMPLE", (id) => `${[0, 1, 2, 3, 4, 5].map((i) => { const x = 330 + (i % 3) * 420, y = 190 + Math.floor(i / 3) * 400; return art(id, x, y, 396, 340, i, 20 + i) + `${bar(x + 4, y + 360, 160, 0.4)}${bar(x + 4, y + 380, 100, 0.18, 8)}`; }).join("")}`),
      mk(2, "Styles", "STYLE & PARAMETERS  ·  SAMPLE", (id) => `${panel(330, 190, 560, 790)}${sliders(id, 370, 250, 6)}${chip(370, 680, 110, p.a, "SEED", 0.25)}${chip(490, 680, 110, p.b, "RATIO")}${chip(610, 680, 110, p.b, "STEPS")}
${[0, 1, 2, 3].map((i) => art(id, 920 + (i % 2) * 330, 190 + Math.floor(i / 2) * 400, 310, 380, i + 2, 30 + i)).join("")}`),
      mk(3, "History", "VARIATIONS  ·  SAMPLE", (id) => `${art(id, 330, 190, 740, 560, 4, 40)}${[0, 1, 2, 3, 4, 5].map((i) => art(id, 1100 + (i % 2) * 240, 190 + Math.floor(i / 2) * 190, 224, 172, i + 1, 41 + i)).join("")}
${[0, 1, 2, 3, 4].map((i) => art(id, 330 + i * 150, 780, 134, 100, i, 50 + i)).join("")}${lines(330, 920, 700, 2, 28, 0.2)}`),
    ];
  },
  "03": (p) => {
    const nav = ["Overview", "Explore", "Reports", "Sources", "Settings"];
    const mk = (i, title, sub, fn) => shell(p, `s3${i}`, "Data Console", nav, i, () => head(title, sub, `s3${i}`) + fn(`s3${i}`));
    const kpi = (id, x, w, label) => `${panel(x, 190, w, 140)}${text(x + 24, 232, label, 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')}${bar(x + 24, 262, 110, 0.55, 22)}<path d="M${x + w - 130} 300 l26 -14 l26 8 l26 -22 l26 4" stroke="${p.a}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const lineChart = (id, x, y, w, h, series = 2) => {
      let s = "";
      for (let k = 0; k < series; k++) {
        let d = "";
        for (let i = 0; i <= 24; i++) { const t = i / 24; d += `${i ? "L" : "M"}${f(x + t * w)} ${f(y + h * (0.55 - 0.3 * Math.sin(t * 6 + k * 1.6) - 0.1 * t * (k + 1) + 0.05 * Math.sin(t * 25)))} `; }
        s += `<path d="${d}" fill="none" stroke="${k ? p.b : p.a}" stroke-width="3.5" stroke-linejoin="round"/>`;
        if (!k) s += `<path d="${d} L${x + w} ${y + h} L${x} ${y + h}Z" fill="url(#${id}accv)" fill-opacity="0.25"/>`;
      }
      return Array.from({ length: 5 }, (_, i) => `<line x1="${x}" x2="${x + w}" y1="${y + (h * i) / 4}" y2="${y + (h * i) / 4}" stroke="#fff" stroke-opacity="0.06"/>`).join("") + s + `${text(x, y + h + 30, "Sample period", 13, "#fff", 'fill-opacity="0.4"')}${text(x - 14, y - 12, "Value", 13, "#fff", 'fill-opacity="0.4"')}`;
    };
    const bars = (id, x, y, w, h, n) => { const R = rng(n * 7); return Array.from({ length: n }, (_, i) => { const bh = h * (0.2 + R() * 0.8), bw = w / n - 12; return `<rect x="${f(x + i * (w / n))}" y="${f(y + h - bh)}" width="${f(bw)}" height="${f(bh)}" rx="5" fill="url(#${id}accv)"/>`; }).join(""); };
    return [
      mk(0, "Overview", "DASHBOARD  ·  SAMPLE DATA", (id) => `${kpi(id, 330, 290, "SAMPLE A")}${kpi(id, 640, 290, "SAMPLE B")}${kpi(id, 950, 290, "SAMPLE C")}${kpi(id, 1260, 310, "SAMPLE D")}
${panel(330, 360, 800, 620)}${text(360, 406, "TREND  ·  SAMPLE A / B", 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')}${lineChart(id, 380, 450, 710, 440)}
${panel(1160, 360, 410, 620)}${text(1190, 406, "BY CATEGORY", 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')}${bars(id, 1190, 450, 350, 440, 7)}${text(1190, 930, "Category 1 … 7", 13, "#fff", 'fill-opacity="0.4"')}`),
      mk(1, "Explore", "TABLE & FILTERS  ·  SAMPLE", (id) => `${[90, 100, 120, 100].map((w, i) => chip(330 + [0, 110, 230, 370][i], 190, w, i ? p.b : p.a, ["FILTER", "RANGE", "CATEGORY", "EXPORT"][i], i ? 0.12 : 0.28)).join("")}
${panel(330, 250, 1240, 730)}<rect x="330" y="250" width="1240" height="56" rx="16" fill="#fff" fill-opacity="0.05"/>${["Name", "Group", "Metric 1", "Metric 2", "Trend"].map((t, i) => text(366 + i * 230, 285, t, 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')).join("")}
${Array.from({ length: 9 }, (_, i) => `<line x1="350" x2="1550" y1="${330 + i * 72}" y2="${330 + i * 72}" stroke="#fff" stroke-opacity="0.06"/>${bar(366, 358 + i * 72, 100 + (i % 3) * 30, 0.4)}${bar(596, 358 + i * 72, 70, 0.22)}${bar(826, 358 + i * 72, 60, 0.22)}<rect x="1056" y="${352 + i * 72}" width="${60 + ((i * 37) % 120)}" height="14" rx="7" fill="url(#${id}acc)" fill-opacity="0.8"/><path d="M1286 ${372 + i * 72} l20 ${i % 2 ? -12 : 10} l20 ${i % 2 ? 6 : -8} l20 ${i % 2 ? -10 : 6}" stroke="${i % 2 ? p.a : p.b}" stroke-width="3" fill="none"/>`).join("")}`),
      mk(2, "Reports", "CHARTS  ·  SAMPLE DATA", (id) => {
        const R = rng(3); let heat = "";
        for (let r = 0; r < 7; r++) for (let c = 0; c < 14; c++) heat += `<rect x="${860 + c * 50}" y="${430 + r * 50}" width="42" height="42" rx="8" fill="${p.a}" fill-opacity="${f(0.06 + R() * 0.8)}"/>`;
        return `${panel(330, 190, 480, 380)}${text(360, 236, "SHARE  ·  SAMPLE", 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')}
<circle cx="570" cy="400" r="90" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="36"/><circle cx="570" cy="400" r="90" fill="none" stroke="${p.a}" stroke-width="36" stroke-dasharray="260 600" transform="rotate(-90 570 400)"/><circle cx="570" cy="400" r="90" fill="none" stroke="${p.b}" stroke-width="36" stroke-dasharray="130 600" stroke-dashoffset="-270" transform="rotate(-90 570 400)"/>
${panel(330, 600, 480, 380)}${text(360, 646, "DISTRIBUTION", 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')}${bars(id, 370, 680, 400, 240, 10)}
${panel(830, 190, 740, 790)}${text(860, 236, "ACTIVITY HEATMAP  ·  SAMPLE", 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')}${heat}${text(860, 830, "Sample day  →", 13, "#fff", 'fill-opacity="0.4"')}${lines(860, 870, 640, 3, 26, 0.2)}`;
      }),
      mk(3, "Sources", "IMPORT & CLEAN  ·  SAMPLE", (id) => `${panel(330, 190, 560, 790)}<rect x="370" y="240" width="480" height="220" rx="18" fill="${p.a}" fill-opacity="0.06" stroke="${p.a}" stroke-opacity="0.6" stroke-dasharray="10 10"/>${text(610, 360, "CSV  ·  XLSX  ·  JSON", 20, p.a, 'text-anchor="middle" letter-spacing="4"')}
${[0, 1, 2, 3].map((i) => `<rect x="370" y="${500 + i * 90}" width="480" height="70" rx="14" fill="#fff" fill-opacity="0.04"/><circle cx="410" cy="${535 + i * 90}" r="14" fill="${i === 3 ? "none" : p.a}" fill-opacity="0.7" stroke="${p.a}"/>${bar(444, 525 + i * 90, 200, 0.4)}${bar(444, 545 + i * 90, 130, 0.18, 8)}`).join("")}
${panel(920, 190, 650, 790)}${text(950, 236, "PIPELINE  ·  SAMPLE", 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')}${["Load", "Clean", "Transform", "Chart"].map((t, i) => `<rect x="${960 + i * 150}" y="${300}" width="130" height="70" rx="14" fill="${p.a}" fill-opacity="${0.12 + i * 0.05}" stroke="${p.a}" stroke-opacity="0.5"/>${text(1025 + i * 150, 342, t, 16, "#fff", 'text-anchor="middle" fill-opacity="0.85"')}`).join("")}
${lines(950, 440, 580, 10, 40, 0.14)}`),
    ];
  },
  "04": (p) => {
    const nav = ["Today", "Planner", "Focus", "Notes", "Settings"];
    const mk = (i, title, sub, fn) => shell(p, `s4${i}`, "Desk Focus", nav, i, () => head(title, sub, `s4${i}`) + fn(`s4${i}`));
    const task = (id, x, y, w, i, done) => `<rect x="${x}" y="${y}" width="${w}" height="76" rx="14" fill="#fff" fill-opacity="${i === 1 ? 0.08 : 0.04}" ${i === 1 ? `stroke="${p.a}" stroke-opacity="0.6"` : ""}/><rect x="${x + 22}" y="${y + 26}" width="24" height="24" rx="7" fill="${done ? p.a : "none"}" stroke="${p.a}" stroke-width="2"/>${done ? `<path d="M${x + 28} ${y + 38} l5 5 l8 -10" stroke="#0a0e1d" stroke-width="3" fill="none"/>` : ""}${bar(x + 66, y + 26, (w - 260) * (0.6 + (i % 3) * 0.15), done ? 0.2 : 0.5, 12)}${bar(x + 66, y + 48, 120, 0.15, 8)}${chip(x + w - 110, y + 22, 88, [p.a, p.b][i % 2], "TAG", 0.15)}`;
    const timer = (id, cx, cy, r, label) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="18"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#${id}acc)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${f(r * 2 * Math.PI * 0.64)} 9999" transform="rotate(-90 ${cx} ${cy})"/>${text(cx, cy + 20, label, r * 0.5, "#fff", 'text-anchor="middle" font-weight="300" fill-opacity="0.95"')}${text(cx, cy + r * 0.62, "FOCUS", 14, p.a, 'text-anchor="middle" letter-spacing="5"')}`;
    return [
      mk(0, "Today", "TASKS & FOCUS TIMER  ·  SAMPLE", (id) => `${panel(330, 190, 760, 790)}${[0, 1, 2, 3, 4, 5, 6].map((i) => task(id, 360, 220 + i * 100, 700, i, i === 0)).join("")}
${panel(1120, 190, 450, 790)}${timer(id, 1345, 470, 140, "25:00")}<rect x="1235" y="680" width="220" height="56" rx="28" fill="url(#${id}acc)"/>${text(1345, 715, "START", 17, "#0a0e1d", 'text-anchor="middle" font-weight="700" letter-spacing="4"')}${lines(1160, 800, 370, 4, 30, 0.18)}`),
      mk(1, "Planner", "WEEK VIEW  ·  SAMPLE", (id) => `${["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => `${panel(330 + i * 250, 190, 234, 790)}${text(354 + i * 250, 232, d, 14, "#fff", 'fill-opacity="0.55" letter-spacing="3"')}${[0, 1, 2].slice(0, 2 + (i % 2)).map((k) => `<rect x="${346 + i * 250}" y="${260 + k * 190 + (i % 2) * 20}" width="202" height="${150 - k * 20}" rx="12" fill="${(i + k) % 2 ? p.b : p.a}" fill-opacity="0.16" stroke="${(i + k) % 2 ? p.b : p.a}" stroke-opacity="0.55"/>${bar(364 + i * 250, 286 + k * 190 + (i % 2) * 20, 130, 0.45, 12)}${bar(364 + i * 250, 312 + k * 190 + (i % 2) * 20, 90, 0.2)}`).join("")}`).join("")}`),
      mk(2, "Focus mode", "FLOATING WIDGET  ·  SAMPLE", (id) => `${panel(330, 190, 1240, 790)}${bar(380, 250, 280, 0.2, 14)}${lines(380, 300, 700, 8, 34, 0.1)}
<g transform="translate(900 260)"><rect width="560" height="620" rx="26" fill="#0a0e1d" stroke="${p.a}" stroke-opacity="0.7" stroke-width="1.5"/><path d="M0 26a26 26 0 0 1 26 -26H534a26 26 0 0 1 26 26V64H0z" fill="${p.a}" fill-opacity="0.14"/><circle cx="30" cy="32" r="6" fill="${p.a}"/><circle cx="52" cy="32" r="6" fill="#fff" fill-opacity="0.3"/>${bar(300, 28, 200, 0.35, 10)}
${timer(id, 280, 300, 130, "25:00")}<rect x="180" y="490" width="200" height="54" rx="27" fill="url(#${id}acc)"/>${text(280, 524, "PAUSE", 16, "#0a0e1d", 'text-anchor="middle" font-weight="700" letter-spacing="4"')}${bar(120, 574, 320, 0.2)}</g>`),
      mk(3, "Settings", "PREFERENCES  ·  SAMPLE", (id) => `${panel(330, 190, 1240, 790)}${Array.from({ length: 6 }, (_, i) => `${bar(380, 262 + i * 110, 220 + (i % 3) * 40, 0.5, 14)}${bar(380, 290 + i * 110, 380, 0.16)}<rect x="1420" y="${252 + i * 110}" width="90" height="42" rx="21" fill="${i % 3 ? "#fff" : p.a}" fill-opacity="${i % 3 ? 0.1 : 0.9}"/><circle cx="${i % 3 ? 1441 : 1489}" cy="${273 + i * 110}" r="15" fill="#fff"/><line x1="380" x2="1520" y1="${322 + i * 110}" y2="${322 + i * 110}" stroke="#fff" stroke-opacity="0.06"/>`).join("")}`),
    ];
  },
  "05": (p) => {
    const nav = ["Notebook", "Training", "Experiments", "Compare", "Settings"];
    const mk = (i, title, sub, fn) => shell(p, `s5${i}`, "Model Lab", nav, i, () => head(title, sub, `s5${i}`) + fn(`s5${i}`));
    const curve = (id, x, y, w, h, k, col, dash = "") => { let d = ""; for (let i = 0; i <= 60; i++) { const t = i / 60; d += `${i ? "L" : "M"}${f(x + t * w)} ${f(y + h * (0.92 - 0.8 * Math.exp(-3.2 * t * k) + 0.025 * Math.sin(t * 70) * (1 - t)))} `; } return `<path d="${d}" fill="none" stroke="${col}" stroke-width="3.5" stroke-linejoin="round" ${dash}/>`; };
    const axes = (x, y, w, h, xl, yl) => Array.from({ length: 5 }, (_, i) => `<line x1="${x}" x2="${x + w}" y1="${y + (h * i) / 4}" y2="${y + (h * i) / 4}" stroke="#fff" stroke-opacity="0.06"/>`).join("") + `<line x1="${x}" x2="${x}" y1="${y}" y2="${y + h}" stroke="#fff" stroke-opacity="0.3"/><line x1="${x}" x2="${x + w}" y1="${y + h}" y2="${y + h}" stroke="#fff" stroke-opacity="0.3"/>${text(x + w, y + h + 34, xl, 14, "#fff", 'text-anchor="end" fill-opacity="0.5" letter-spacing="3"')}${text(x, y - 14, yl, 14, "#fff", 'fill-opacity="0.5" letter-spacing="3"')}`;
    const cell = (x, y, w, n, run) => `<rect x="${x}" y="${y}" width="${w}" height="${n * 26 + 40}" rx="12" fill="#0a0e1d" stroke="#fff" stroke-opacity="0.08"/><rect x="${x}" y="${y}" width="4" height="${n * 26 + 40}" rx="2" fill="${run ? p.a : GREY}" fill-opacity="${run ? 1 : 0.3}"/>${text(x + 20, y + 28, "[ ]", 13, "#fff", `fill-opacity="0.4" font-family="${MONO}"`)}${Array.from({ length: n }, (_, i) => bar(x + 64 + (i % 2) * 24, y + 22 + i * 26, w * (0.3 + ((i * 29) % 40) / 100), i % 3 === 0 ? 0.5 : 0.26, 10, i % 3 === 0 ? p.b : GREY)).join("")}`;
    return [
      mk(0, "Notebook", "RESEARCH NOTEBOOK  ·  SAMPLE", (id) => `${panel(330, 190, 1240, 790)}${cell(370, 220, 1160, 4, 1)}${cell(370, 380, 1160, 3, 1)}
<rect x="370" y="520" width="1160" height="200" rx="12" fill="#0a0e1d" stroke="${p.a}" stroke-opacity="0.4"/>${axes(430, 560, 520, 120, "STEP", "VALUE")}${curve(id, 430, 560, 520, 120, 1, p.a)}${bar(1000, 590, 400, 0.3)}${bar(1000, 620, 300, 0.18)}
${cell(370, 750, 1160, 5, 0)}`),
      mk(1, "Training", "TRAINING CURVE  ·  SAMPLE", (id) => `${panel(330, 190, 880, 790)}${text(360, 236, "TRAINING & VALIDATION", 14, "#fff", 'fill-opacity="0.55" letter-spacing="3"')}${axes(420, 290, 720, 540, "EPOCH", "LOSS")}${curve(id, 420, 290, 720, 540, 1, p.a)}${curve(id, 420, 290, 720, 540, 0.8, p.b, 'stroke-dasharray="10 8"')}
<rect x="780" y="310" width="340" height="80" rx="12" fill="#0a0e1d" stroke="#fff" stroke-opacity="0.1"/><line x1="800" x2="840" y1="336" y2="336" stroke="${p.a}" stroke-width="3.5"/>${bar(856, 331, 120, 0.4)}<line x1="800" x2="840" y1="364" y2="364" stroke="${p.b}" stroke-width="3.5" stroke-dasharray="8 6"/>${bar(856, 359, 150, 0.4)}
${panel(1240, 190, 330, 790)}${text(1264, 236, "RUN SETTINGS", 14, p.a, 'letter-spacing="3"')}${Array.from({ length: 7 }, (_, i) => `${bar(1264, 280 + i * 84, 100, 0.32)}<rect x="1264" y="${302 + i * 84}" width="282" height="36" rx="10" fill="#fff" fill-opacity="0.05"/>${bar(1280, 316 + i * 84, 80 + (i % 3) * 30, 0.3, 8)}`).join("")}`),
      mk(2, "Experiments", "EXPERIMENT TABLE  ·  SAMPLE", (id) => `${panel(330, 190, 1240, 790)}<rect x="330" y="190" width="1240" height="56" rx="16" fill="#fff" fill-opacity="0.05"/>${["Run", "Variant", "Metric 1", "Metric 2", "Status"].map((t, i) => text(366 + i * 230, 225, t, 14, "#fff", 'fill-opacity="0.55" letter-spacing="2"')).join("")}
${["Run A", "Run B", "Run C", "Run D", "Run E", "Run F", "Run G"].map((r, i) => `<line x1="350" x2="1550" y1="${270 + i * 90}" y2="${270 + i * 90}" stroke="#fff" stroke-opacity="0.06"/>${text(366, 322 + i * 90, r, 17, "#fff", 'fill-opacity="0.8"')}${chip(596, 298 + i * 90, 110, i % 3 ? p.b : p.a, "VARIANT", 0.14)}<rect x="826" y="${308 + i * 90}" width="${100 + ((i * 53) % 90)}" height="14" rx="7" fill="url(#${id}acc)" fill-opacity="0.8"/><rect x="1056" y="${308 + i * 90}" width="${70 + ((i * 41) % 110)}" height="14" rx="7" fill="${p.b}" fill-opacity="0.5"/><circle cx="1296" cy="${315 + i * 90}" r="8" fill="${i === 2 ? p.a : GREY}" fill-opacity="${i === 2 ? 1 : 0.4}"/>${bar(1316, 310 + i * 90, 80, 0.25)}`).join("")}`),
      mk(3, "Compare", "ARCHITECTURE & COMPARISON  ·  SAMPLE", (id) => {
        const L = [3, 5, 5, 3], lx = (i) => 430 + i * 170, ly = (i, j) => 440 + (j - (L[i] - 1) / 2) * 90; let ln = "", nd = "";
        for (let i = 0; i < 3; i++) for (let j = 0; j < L[i]; j++) for (let k = 0; k < L[i + 1]; k++) ln += `<line x1="${lx(i)}" y1="${ly(i, j)}" x2="${lx(i + 1)}" y2="${ly(i + 1, k)}" stroke="${p.b}" stroke-opacity="0.3"/>`;
        L.forEach((c, i) => { for (let j = 0; j < c; j++) nd += `<circle cx="${lx(i)}" cy="${ly(i, j)}" r="14" fill="#0a0e1d" stroke="${(i + j) % 3 ? p.b : p.a}" stroke-width="2.5"/>`; });
        return `${panel(330, 190, 720, 790)}${text(360, 236, "MODEL GRAPH", 14, "#fff", 'fill-opacity="0.55" letter-spacing="3"')}${ln}${nd}${chip(360, 900, 100, p.a, "INPUT", 0.2)}${chip(910, 900, 110, p.a, "OUTPUT", 0.2)}
${panel(1080, 190, 490, 790)}${text(1110, 236, "COMPARE  ·  SAMPLE", 14, "#fff", 'fill-opacity="0.55" letter-spacing="3"')}${["Model A", "Model B", "Model C", "Model D"].map((m, i) => `${text(1110, 316 + i * 130, m, 16, "#fff", 'fill-opacity="0.8"')}<rect x="1110" y="${332 + i * 130}" width="420" height="16" rx="8" fill="#fff" fill-opacity="0.07"/><rect x="1110" y="${332 + i * 130}" width="${[300, 220, 360, 170][i]}" height="16" rx="8" fill="url(#${id}acc)" fill-opacity="${i === 2 ? 1 : 0.5}"/>`).join("")}`;
      }),
    ];
  },
};

/* ------------------------------------------------------------ team + og */
function avatar(letter, p, i) {
  const id = `av${letter}`, R = rng(i * 13 + 1);
  let shapes = "";
  for (let k = 0; k < 5; k++) shapes += `<circle cx="${f(R() * 400)}" cy="${f(R() * 400)}" r="${f(40 + R() * 120)}" fill="${k % 2 ? p.a : p.b}" fill-opacity="${f(0.06 + R() * 0.1)}"/>`;
  return svg(400, 400, `Member ${letter} avatar placeholder`, `
<linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0e1d"/><stop offset="0.55" stop-color="${p.b}" stop-opacity="0.55"/><stop offset="1" stop-color="${p.a}"/></linearGradient>
<radialGradient id="${id}gl" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
    `<rect width="400" height="400" fill="url(#${id}bg)"/>${shapes}<circle cx="200" cy="200" r="190" fill="url(#${id}gl)"/>
<circle cx="200" cy="200" r="132" fill="#05060d" fill-opacity="0.35" stroke="#fff" stroke-opacity="0.7" stroke-width="2"/><circle cx="200" cy="200" r="150" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-dasharray="2 10"/>
${text(200, 260, letter, 170, "#fff", 'text-anchor="middle" font-weight="300"')}
${text(200, 372, "PLACEHOLDER", 12, "#fff", 'text-anchor="middle" letter-spacing="5" fill-opacity="0.7"')}`);
}

function og() {
  const id = "og", R = rng(8);
  let rings = "", dots = "";
  PROJECTS.forEach((p, i) => {
    const x = 760 + i * 80, y = 150 + Math.sin(i * 1.3) * 60;
    rings += `<circle cx="${x}" cy="${f(y)}" r="${70 + i * 8}" fill="none" stroke="${p.a}" stroke-opacity="0.55" stroke-width="1.5"/><circle cx="${x}" cy="${f(y)}" r="10" fill="${p.a}"/><circle cx="${x}" cy="${f(y)}" r="40" fill="url(#${id}g${i})" opacity="0.5"/>`;
  });
  for (let i = 0; i < 50; i++) dots += `<circle cx="${f(R() * 1200)}" cy="${f(R() * 630)}" r="${f(0.7 + R() * 1.3)}" fill="#fff" fill-opacity="${f(0.15 + R() * 0.4)}"/>`;
  const defs = `<linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#05060d"/><stop offset="1" stop-color="#0d1330"/></linearGradient>
<linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8B7CFF"/><stop offset="0.5" stop-color="#4D8DFF"/><stop offset="1" stop-color="#5EE3F0"/></linearGradient>` + PROJECTS.map((p, i) => `<radialGradient id="${id}g${i}"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>`).join("");
  return svg(1200, 630, "QUINTET Project Exhibition", defs, `<rect width="1200" height="630" fill="url(#${id}bg)"/>${dots}${rings}
<circle cx="900" cy="560" r="360" fill="none" stroke="#8B7CFF" stroke-opacity="0.18"/><circle cx="900" cy="560" r="260" fill="none" stroke="#4D8DFF" stroke-opacity="0.2"/>
<rect x="80" y="270" width="64" height="4" fill="url(#${id}t)"/>
${text(80, 340, "QUINTET", 76, "#fff", 'font-weight="600" letter-spacing="-1"')}
${text(80, 404, "·  PROJECT EXHIBITION", 40, "url(#" + id + "t)", 'font-weight="500" letter-spacing="8"')}
${text(80, 520, "FIVE MINDS. FIVE BUILDS. ONE AI-POWERED JOURNEY.", 22, "#fff", 'letter-spacing="4" fill-opacity="0.65"')}
${text(80, 576, "PLACEHOLDER SOCIAL IMAGE", 14, "#fff", 'letter-spacing="4" fill-opacity="0.35"')}`);
}

/* ------------------------------------------------------------ run */
const covers = [cover01, cover02, cover03, cover04, cover05];
// Projects that already have real media — never overwrite their files.
// 02 (Taiwan housing) and 03 (VizPilot) use real screenshots; member C keeps an unlabelled avatar.
const REAL = new Set(["02", "03"]);
PROJECTS.forEach((p, i) => {
  if (REAL.has(p.n)) return;
  const dir = `projects/project-${p.n}`;
  write(`${dir}/cover.svg`, covers[i](p));
  SCREENS[p.n](p).forEach((s, k) => write(`${dir}/screenshot-0${k + 1}.svg`, s));
  write(`team/member-${"abcde"[i]}.svg`, avatar("ABCDE"[i], p, i));
});
write("exhibition/og.svg", og());
