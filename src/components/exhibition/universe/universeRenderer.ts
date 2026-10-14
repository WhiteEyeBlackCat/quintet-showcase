/**
 * Canvas renderer for the Project Universe backdrop: nebula, galaxy disc
 * particles, layered orbit rings, travelling light and the thin
 * connections from the core to each project node.
 *
 * Loaded with a dynamic import (client only). It owns no loop — the
 * experience component drives `draw()` from its single rAF loop so DOM
 * nodes and canvas lines always agree.
 */

export interface SceneNode {
  x: number;
  y: number;
  /** Visual radius of the node ring, px (already depth-scaled). */
  r: number;
  rgb: [number, number, number];
  rgb2: [number, number, number];
  depth: number;
}

export interface SceneFrame {
  /** Animated time in seconds (frozen under reduced motion). */
  t: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  nodes: SceneNode[];
  /** Index of the node receiving attention (hover / focus / selected), -1 none. */
  hot: number;
  /** 0..1 eased attention strength. */
  hotStrength: number;
  /** Current eased nebula tint. */
  tint: [number, number, number];
}

export interface UniverseRenderer {
  resize(width: number, height: number, dpr: number): void;
  draw(frame: SceneFrame): void;
  destroy(): void;
}

interface Options {
  particleCount: number;
  /** Simplify extras (sprites, comets) on low-power devices. */
  lowPower: boolean;
}

type RGB = [number, number, number];

const PALETTE: RGB[] = [
  [139, 124, 255], // violet
  [77, 141, 255], // blue
  [94, 227, 240], // cyan
  [226, 230, 255], // starlight
  [232, 121, 208], // magenta (rare)
];
const PALETTE_WEIGHTS = [0.38, 0.27, 0.1, 0.21, 0.04];

/** Small deterministic PRNG so the universe looks the same on every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickColor(rand: () => number): number {
  let v = rand();
  for (let i = 0; i < PALETTE_WEIGHTS.length; i++) {
    v -= PALETTE_WEIGHTS[i];
    if (v <= 0) return i;
  }
  return 0;
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function makeSprite(c: RGB, size: number): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = s.height = size;
  const g = s.getContext("2d");
  if (!g) return s;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, rgba(c, 0.9));
  grad.addColorStop(0.5, rgba(c, 0.18));
  grad.addColorStop(1, rgba(c, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return s;
}

export function createUniverseRenderer(canvas: HTMLCanvasElement, opts: Options): UniverseRenderer | null {
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext("2d", { alpha: true });
  } catch {
    ctx = null;
  }
  if (!ctx) return null;
  const c = ctx;

  // ── Particle data (structure of arrays, generated once) ──────────
  const rand = mulberry32(20260414);
  const N = Math.max(80, Math.floor(opts.particleCount));
  const pr = new Float32Array(N); // normalised radius (1 = node orbit)
  const pa = new Float32Array(N); // base angle
  const pw = new Float32Array(N); // angular speed rad/s
  const ps = new Float32Array(N); // size px (css)
  const pal = new Float32Array(N); // alpha
  const pz = new Float32Array(N); // vertical thickness jitter
  const ptw = new Float32Array(N); // twinkle phase
  const pc = new Uint8Array(N); // colour index
  const ARMS = 3;
  for (let i = 0; i < N; i++) {
    const kind = rand();
    let r: number;
    let a: number;
    if (kind < 0.55) {
      // spiral arms
      r = 0.08 + Math.pow(rand(), 0.85) * 1.22;
      const arm = Math.floor(rand() * ARMS);
      a = (arm / ARMS) * Math.PI * 2 + 2.1 * Math.log(r + 0.12) + (rand() - 0.5) * (0.55 + r * 0.5);
    } else if (kind < 0.8) {
      // diffuse disc
      r = 0.12 + Math.sqrt(rand()) * 1.35;
      a = rand() * Math.PI * 2;
    } else {
      // glittering debris belts along the node orbit and the inner ring
      const belt = rand() < 0.65 ? 1 : 0.8;
      r = belt + (rand() + rand() - 1) * 0.06;
      a = rand() * Math.PI * 2;
    }
    pr[i] = r;
    pa[i] = a;
    pw[i] = 0.018 + 0.012 * (1 - Math.min(r, 1.3) / 1.3);
    const big = rand() < 0.035;
    ps[i] = big ? 1.6 + rand() * 1.4 : 0.5 + rand() * rand() * 1.4;
    // dimmer near the core so the centre typography stays legible
    const coreFade = Math.min(1, Math.max(0.15, (r - 0.1) / 0.4));
    pal[i] = (0.35 + rand() * 0.65) * coreFade;
    pz[i] = (rand() - 0.5) * 0.09;
    ptw[i] = rand() * Math.PI * 2;
    pc[i] = pickColor(rand);
  }
  // Sort by colour so fillStyle switches are minimal.
  const order = Array.from({ length: N }, (_, i) => i).sort((x, y) => pc[x] - pc[y]);

  const sprites = PALETTE.map((col) => makeSprite(col, 32));

  // Twinkling field stars (screen space, normalised).
  const STARS = opts.lowPower ? 60 : 140;
  const sx = new Float32Array(STARS);
  const sy = new Float32Array(STARS);
  const ss = new Float32Array(STARS);
  const sp = new Float32Array(STARS);
  for (let i = 0; i < STARS; i++) {
    sx[i] = rand();
    sy[i] = rand();
    ss[i] = 0.4 + rand() * 1.1;
    sp[i] = rand() * Math.PI * 2;
  }

  // Ring definitions (relative to node orbit): radius, tilt (rad), base alpha.
  const RINGS = [
    { k: 0.36, tilt: -0.05, a: 0.22 },
    { k: 0.58, tilt: 0.035, a: 0.2 },
    { k: 0.8, tilt: -0.02, a: 0.26 },
    { k: 1.0, tilt: 0, a: 0.62 },
    { k: 1.2, tilt: 0.045, a: 0.18 },
    { k: 1.42, tilt: -0.03, a: 0.1 },
  ];
  const COMETS = opts.lowPower
    ? [{ ring: 3, speed: 0.07, phase: 0 }]
    : [
        { ring: 3, speed: 0.06, phase: 0 },
        { ring: 3, speed: 0.06, phase: Math.PI },
        { ring: 2, speed: -0.085, phase: 1.3 },
        { ring: 4, speed: 0.045, phase: 4.1 },
        { ring: 1, speed: 0.11, phase: 2.4 },
      ];

  let W = 0;
  let H = 0;
  let DPR = 1;
  let nebula: HTMLCanvasElement | null = null;
  let rings: HTMLCanvasElement | null = null;
  let ringsKey = "";

  function buildNebula() {
    const scale = 0.5; // nebula is soft — half resolution is plenty
    const n = document.createElement("canvas");
    n.width = Math.max(1, Math.round(W * scale));
    n.height = Math.max(1, Math.round(H * scale));
    const g = n.getContext("2d");
    if (!g) return null;
    const w = n.width;
    const h = n.height;
    const blob = (x: number, y: number, r: number, col: RGB, a: number, sy = 0.62) => {
      g.save();
      g.translate(x * w, y * h);
      g.scale(1, sy);
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, r * w);
      grad.addColorStop(0, rgba(col, a));
      grad.addColorStop(0.45, rgba(col, a * 0.35));
      grad.addColorStop(1, rgba(col, 0));
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, r * w, 0, Math.PI * 2);
      g.fill();
      g.restore();
    };
    g.globalCompositeOperation = "lighter";
    blob(0.5, 0.5, 0.42, [70, 60, 190], 0.34, 0.5);
    blob(0.36, 0.44, 0.3, [139, 124, 255], 0.2);
    blob(0.66, 0.58, 0.28, [77, 141, 255], 0.17);
    blob(0.52, 0.5, 0.14, [180, 170, 255], 0.2, 0.55);
    blob(0.2, 0.7, 0.2, [232, 121, 208], 0.06);
    blob(0.84, 0.3, 0.18, [94, 227, 240], 0.05);
    // static dust stars
    const r2 = mulberry32(7);
    for (let i = 0; i < 420; i++) {
      const a = 0.08 + r2() * 0.4;
      g.fillStyle = `rgba(220,225,255,${a})`;
      const s = r2() < 0.92 ? 0.5 : 1;
      g.fillRect(r2() * w, r2() * h, s, s);
    }
    return n;
  }

  function buildRings(cx: number, cy: number, rx: number, ry: number) {
    const key = `${W}x${H}@${DPR}|${cx.toFixed(1)},${cy.toFixed(1)},${rx.toFixed(1)},${ry.toFixed(1)}`;
    if (key === ringsKey && rings) return;
    ringsKey = key;
    const r = rings ?? document.createElement("canvas");
    r.width = Math.max(1, Math.round(W * DPR));
    r.height = Math.max(1, Math.round(H * DPR));
    const g = r.getContext("2d");
    if (!g) {
      rings = null;
      return;
    }
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.clearRect(0, 0, W, H);
    g.globalCompositeOperation = "lighter";
    const SEG = 180;
    for (const ring of RINGS) {
      const isMain = ring.k === 1;
      const passes = isMain ? [{ w: 6, a: 0.07 }, { w: 2.2, a: 0.18 }, { w: 0.9, a: 1 }] : [{ w: 0.75, a: 1 }];
      for (const pass of passes) {
        g.lineWidth = pass.w;
        for (let s = 0; s < SEG; s++) {
          const t0 = (s / SEG) * Math.PI * 2;
          const t1 = ((s + 1.15) / SEG) * Math.PI * 2;
          const mid = (t0 + t1) / 2;
          const depth = (Math.sin(mid) + 1) / 2;
          // brighter on the near side, with a soft highlight at lower-left
          const hl = Math.max(0, Math.cos(mid - 2.3)) * 0.35;
          const alpha = ring.a * pass.a * (0.28 + 0.72 * depth + hl);
          const mix = (Math.cos(mid) + 1) / 2; // violet on the left → blue on the right
          const col: RGB = [
            Math.round(139 + (77 - 139) * mix),
            Math.round(124 + (141 - 124) * mix),
            255,
          ];
          g.strokeStyle = rgba(col, Math.min(1, alpha));
          g.beginPath();
          const cosT = Math.cos(ring.tilt);
          const sinT = Math.sin(ring.tilt);
          for (let k = 0; k <= 2; k++) {
            const tt = t0 + ((t1 - t0) * k) / 2;
            const ex = Math.cos(tt) * rx * ring.k;
            const ey = Math.sin(tt) * ry * ring.k;
            const x = cx + ex * cosT - ey * sinT;
            const y = cy + ex * sinT + ey * cosT;
            if (k === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
          }
          g.stroke();
        }
      }
    }
    rings = r;
  }

  function resize(width: number, height: number, dpr: number) {
    W = Math.max(1, Math.round(width));
    H = Math.max(1, Math.round(height));
    DPR = Math.min(2, Math.max(1, dpr));
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    nebula = buildNebula();
    ringsKey = "";
  }

  function draw(f: SceneFrame) {
    if (!W || !H) return;
    const { t, cx, cy, rx, ry } = f;
    buildRings(cx, cy, rx, ry);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.globalCompositeOperation = "source-over";
    c.globalAlpha = 1;
    c.clearRect(0, 0, W, H);

    // 1 · Nebula, breathing very slowly.
    if (nebula) {
      const breathe = 1 + Math.sin(t * 0.12) * 0.015;
      const nw = W * breathe;
      const nh = H * breathe;
      c.globalAlpha = 1;
      c.drawImage(nebula, cx - nw / 2 + (W / 2 - cx), cy - nh / 2 + (H / 2 - cy), nw, nh);
    }

    c.globalCompositeOperation = "lighter";

    // 2 · Lighting response: tint toward the hot project's accent.
    if (f.hotStrength > 0.01) {
      const hotNode = f.hot >= 0 ? f.nodes[f.hot] : undefined;
      const tx = hotNode ? cx + (hotNode.x - cx) * 0.45 : cx;
      const ty = hotNode ? cy + (hotNode.y - cy) * 0.45 : cy;
      const rad = Math.max(rx, ry) * 1.25;
      c.save();
      c.translate(tx, ty);
      c.scale(1, ry / rx + 0.15);
      const grad = c.createRadialGradient(0, 0, 0, 0, 0, rad);
      grad.addColorStop(0, rgba(f.tint, 0.2 * f.hotStrength));
      grad.addColorStop(0.5, rgba(f.tint, 0.07 * f.hotStrength));
      grad.addColorStop(1, rgba(f.tint, 0));
      c.fillStyle = grad;
      c.fillRect(-rad, -rad, rad * 2, rad * 2);
      c.restore();
    }

    // 3 · Field stars twinkle.
    for (let i = 0; i < STARS; i++) {
      const a = 0.15 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.8 + sp[i]));
      c.fillStyle = `rgba(230,233,255,${a.toFixed(3)})`;
      c.fillRect(sx[i] * W, sy[i] * H, ss[i], ss[i]);
    }

    // 4 · Orbit rings (pre-rendered).
    if (rings) {
      c.globalAlpha = 1;
      c.drawImage(rings, 0, 0, W, H);
    }

    // 5 · Galaxy disc particles.
    let lastColor = -1;
    const useSprites = !opts.lowPower;
    for (let n = 0; n < N; n++) {
      const i = order[n];
      const a = pa[i] + t * pw[i];
      const r = pr[i];
      const sa = Math.sin(a);
      const x = cx + Math.cos(a) * r * rx;
      const y = cy + sa * r * ry + pz[i] * ry;
      if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
      const depth = (sa + 1) / 2;
      const tw = 0.75 + 0.25 * Math.sin(t * 1.3 + ptw[i]);
      const alpha = pal[i] * (0.45 + 0.55 * depth) * tw;
      const s = ps[i] * (0.8 + 0.35 * depth);
      if (useSprites && s > 1.7) {
        c.globalAlpha = Math.min(1, alpha);
        const d = s * 5;
        c.drawImage(sprites[pc[i]], x - d / 2, y - d / 2, d, d);
        continue;
      }
      if (pc[i] !== lastColor) {
        lastColor = pc[i];
        c.fillStyle = rgba(PALETTE[lastColor], 1);
      }
      c.globalAlpha = Math.min(1, alpha);
      c.fillRect(x - s / 2, y - s / 2, s, s);
    }
    c.globalAlpha = 1;

    // 6 · Travelling light on the rings.
    for (const comet of COMETS) {
      const ring = RINGS[comet.ring];
      const cosT = Math.cos(ring.tilt);
      const sinT = Math.sin(ring.tilt);
      const head = comet.phase + t * comet.speed;
      const dir = Math.sign(comet.speed) || 1;
      for (let k = 0; k < 18; k++) {
        const tt = head - dir * k * 0.018;
        const ex = Math.cos(tt) * rx * ring.k;
        const ey = Math.sin(tt) * ry * ring.k;
        const x = cx + ex * cosT - ey * sinT;
        const y = cy + ex * sinT + ey * cosT;
        const depth = (Math.sin(tt) + 1) / 2;
        const a = (1 - k / 18) * (0.25 + 0.75 * depth) * 0.8;
        if (k === 0) {
          c.globalAlpha = a;
          c.drawImage(sprites[3], x - 7, y - 7, 14, 14);
        } else {
          c.globalAlpha = a * 0.6;
          c.fillStyle = "rgb(200,205,255)";
          c.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
        }
      }
    }
    c.globalAlpha = 1;

    // 7 · Connections: core → node, starting outside the centre typography.
    for (let i = 0; i < f.nodes.length; i++) {
      const nd = f.nodes[i];
      const hot = i === f.hot ? f.hotStrength : 0;
      const dx = nd.x - cx;
      const dy = nd.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const startK = 0.42;
      const x0 = cx + dx * startK;
      const y0 = cy + dy * startK;
      const x1 = nd.x - ux * (nd.r + 6);
      const y1 = nd.y - uy * (nd.r + 6);
      const base = 0.1 + 0.08 * nd.depth;
      const grad = c.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, rgba(nd.rgb, 0));
      grad.addColorStop(0.6, rgba(nd.rgb, base + 0.45 * hot));
      grad.addColorStop(1, rgba(nd.rgb2, base + 0.7 * hot));
      c.strokeStyle = grad;
      c.lineWidth = 0.8 + 0.8 * hot;
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(x1, y1);
      c.stroke();
      // A small pulse travels inward along the hot connection.
      if (hot > 0.05) {
        const p = 1 - ((t * 0.5) % 1);
        const px = x0 + (x1 - x0) * p;
        const py = y0 + (y1 - y0) * p;
        c.globalAlpha = hot * Math.sin(p * Math.PI);
        c.drawImage(sprites[3], px - 6, py - 6, 12, 12);
        c.globalAlpha = 1;
      }
    }

    // 8 · Node halos (light the space around each planet).
    for (let i = 0; i < f.nodes.length; i++) {
      const nd = f.nodes[i];
      const hot = i === f.hot ? f.hotStrength : 0;
      // Others recede while one project holds attention.
      const recede = f.hot >= 0 && i !== f.hot ? 1 - 0.65 * f.hotStrength : 1;
      const rad = nd.r * (1.9 + 1.1 * hot);
      const grad = c.createRadialGradient(nd.x, nd.y, nd.r * 0.7, nd.x, nd.y, rad);
      grad.addColorStop(0, rgba(nd.rgb, (0.08 + 0.06 * nd.depth) * recede + 0.26 * hot));
      grad.addColorStop(1, rgba(nd.rgb, 0));
      c.fillStyle = grad;
      c.fillRect(nd.x - rad, nd.y - rad, rad * 2, rad * 2);
    }

    c.globalCompositeOperation = "source-over";
  }

  function destroy() {
    nebula = null;
    rings = null;
    canvas.width = canvas.height = 0;
  }

  return { resize, draw, destroy };
}
