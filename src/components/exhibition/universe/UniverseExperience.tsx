"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { gsap, motion, isLowPowerDevice, prefersReducedMotion, useCoarsePointer } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";
import { depthOf, depthStyle, hexToRgb, slotAngle, type UniverseProject } from "./geometry";
import type { SceneNode, UniverseRenderer } from "./universeRenderer";
import { UniverseNode } from "./UniverseNode";
import { UniversePreview } from "./UniversePreview";

const WIDE_QUERY = "(min-width: 1200px)";
const CROSSFADE = "transition-[opacity,filter,translate] duration-[600ms] ease-out-expo";
const noopSubscribe = () => () => {};

function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Live attention state read by the animation loop (mutated outside render). */
interface LiveState {
  hover: number;
  focus: number;
  selected: number;
  redraw: () => void;
}

interface UniverseExperienceProps {
  projects: UniverseProject[];
  headingId: string;
}

export function UniverseExperience({ projects, headingId }: UniverseExperienceProps) {
  const uid = useId();
  const panelId = `${uid}-panel`;
  const panelTitleId = `${uid}-panel-title`;

  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const wide = useMedia(WIDE_QUERY);
  const coarse = useCoarsePointer();

  const [selected, setSelected] = useState<number | null>(null);
  const [lastShown, setLastShown] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [focusVis, setFocusVis] = useState<number | null>(null);
  const [failed, setFailed] = useState<Record<string, true>>({});
  const [announcement, setAnnouncement] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const live = useRef<LiveState>({ hover: -1, focus: -1, selected: -1, redraw: () => {} });

  const count = projects.length;
  const preview = coarse ? focusVis : (hover ?? focusVis);
  const attention = preview ?? selected;
  const shown = projects[selected ?? lastShown] ?? projects[0];

  // ── Keep the loop's view of attention in sync ─────────────────────
  useEffect(() => {
    const L = live.current;
    L.hover = coarse ? -1 : (hover ?? -1);
    L.focus = focusVis ?? -1;
    L.selected = selected ?? -1;
    L.redraw();
  }, [hover, focusVis, selected, coarse]);

  // ── Animation loop: node drift/depth + canvas scene ───────────────
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const anchors = Array.from(stage.querySelectorAll<HTMLElement>("[data-node-anchor]"));
    const reduced = prefersReducedMotion();
    const lowPower = isLowPowerDevice();
    const colors = projects.map((p) => [hexToRgb(p.accent), hexToRgb(p.accent2)] as const);
    const L = live.current;

    let renderer: UniverseRenderer | null = null;
    let disposed = false;
    let raf = 0;
    let running = false;
    let inView = false;
    let pageVisible = !document.hidden;
    let W = 0;
    let H = 0;
    let rxF = 0.37;
    let ryF = 0.355;
    let nodeR = 56;
    let cyF = 0.5;
    let compact = false;
    let last = 0;
    let t = 0;
    let drift = 0;
    let driftSpeed = 1;
    let hotStrength = 0;
    let lastHot = 0;
    const tint: [number, number, number] = [...colors[0][0]];
    const nodes: SceneNode[] = projects.map((_, i) => ({ x: 0, y: 0, r: 0, rgb: colors[i][0], rgb2: colors[i][1], depth: 0 }));

    const measure = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      const cs = getComputedStyle(stage);
      rxF = (parseFloat(cs.getPropertyValue("--orx")) || 37) / 100;
      ryF = (parseFloat(cs.getPropertyValue("--ory")) || 35.5) / 100;
      nodeR = parseFloat(cs.getPropertyValue("--node-r")) * (cs.getPropertyValue("--node-r").includes("rem") ? 16 : 1) || 56;
      cyF = (parseFloat(cs.getPropertyValue("--ocy")) || 50) / 100;
      compact = W < 768;
      renderer?.resize(W, H, window.devicePixelRatio || 1);
    };

    const step = (dt: number) => {
      const interacting = L.hover >= 0 || L.focus >= 0 || L.selected >= 0;
      const hot = L.hover >= 0 ? L.hover : L.focus >= 0 ? L.focus : L.selected;
      if (reduced) {
        hotStrength = hot >= 0 ? 1 : 0;
      } else {
        t += dt;
        // Drift eases to a standstill while anything is hovered/focused/selected.
        driftSpeed += ((interacting ? 0 : 1) - driftSpeed) * Math.min(1, dt * 2.5);
        drift += dt * driftSpeed;
        hotStrength += ((hot >= 0 ? 1 : 0) - hotStrength) * Math.min(1, dt * 4);
      }
      if (hot >= 0) lastHot = hot;
      const target = colors[lastHot][0];
      const k = reduced ? 1 : Math.min(1, dt * 3);
      for (let c = 0; c < 3; c++) tint[c] += (target[c] - tint[c]) * k;

      const cx = W / 2;
      const cy = H * cyF;
      const rx = W * rxF;
      const ry = H * ryF;
      const sway = reduced ? 0 : 0.075 * Math.sin((drift * Math.PI * 2) / 52);
      for (let i = 0; i < anchors.length && i < count; i++) {
        const base = slotAngle(i, count);
        const a = base + sway;
        const bob = reduced ? 0 : Math.sin(drift * 0.5 + i * 1.7) * (compact ? 2 : 4);
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry + bob;
        const depth = depthOf(a);
        const ds = depthStyle(depth, compact);
        const el = anchors[i];
        el.style.transform = `translate3d(${(x - (cx + Math.cos(base) * rx)).toFixed(2)}px,${(y - (cy + Math.sin(base) * ry)).toFixed(2)}px,0) scale(${ds.scale.toFixed(4)})`;
        el.style.opacity = ds.opacity.toFixed(3);
        const z = String(10 + Math.round(depth * 10) + (i === hot ? 20 : 0));
        if (el.style.zIndex !== z) el.style.zIndex = z;
        const n = nodes[i];
        n.x = x;
        n.y = y;
        n.r = nodeR * ds.scale * (i === hot ? 1.12 : 1);
        n.depth = depth;
      }
      renderer?.draw({ t, cx, cy, rx, ry, nodes, hot, hotStrength, tint });
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      step(dt);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const should = !reduced && inView && pageVisible && !disposed;
      if (should && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      canvas.dataset.loop = running ? "running" : "paused";
    };

    // Static redraw for reduced motion / paused states when attention changes.
    let pending = 0;
    L.redraw = () => {
      if (running || disposed || pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        step(0);
      });
    };

    measure();
    step(0);
    sync();

    const ro = new ResizeObserver(() => {
      measure();
      if (!running) step(0);
    });
    ro.observe(stage);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(stage);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Heavy canvas layer loads on the client only, after first paint.
    import("./universeRenderer")
      .then(({ createUniverseRenderer }) => {
        if (disposed) return;
        const area = W * H;
        let particles = Math.min(2600, Math.max(420, area / 520));
        if (compact) particles *= 0.7;
        if (lowPower) particles *= 0.5;
        renderer = createUniverseRenderer(canvas, { particleCount: particles, lowPower });
        if (!renderer) {
          canvas.dataset.fallback = "no-canvas";
          return;
        }
        renderer.resize(W, H, window.devicePixelRatio || 1);
        step(0);
        canvas.dataset.ready = "true";
      })
      .catch(() => {
        canvas.dataset.fallback = "load-failed";
      });

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      L.redraw = () => {};
      renderer?.destroy();
      renderer = null;
      for (const el of anchors) {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.zIndex = "";
      }
    };
  }, [projects, count]);

  // ── Wide screens: make room for the preview by easing the orbit aside ──
  useEffect(() => {
    const inner = innerRef.current;
    const stage = stageRef.current;
    if (!inner || !stage) return;
    const reduced = prefersReducedMotion();
    const apply = (instant: boolean) => {
      let x = 0;
      let scale = 1;
      if (wide && selected !== null) {
        const W = stage.clientWidth;
        const cs = getComputedStyle(stage);
        const rxF = (parseFloat(cs.getPropertyValue("--orx")) || 37) / 100;
        const nodeHalf = ((parseFloat(cs.getPropertyValue("--node-w")) || 11) * 16 * 1.1) / 2;
        const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter")) || 48;
        const panelW = panelRef.current?.offsetWidth ?? 400;
        const left = gutter;
        const right = W - gutter - panelW - 24;
        const half = W * rxF + nodeHalf;
        scale = Math.min(1, (right - left) / (2 * half));
        x = (left + right) / 2 - W / 2;
      }
      gsap.to(inner, {
        x,
        scale,
        duration: instant || reduced ? 0 : 1.1,
        ease: motion.ease.out,
        overwrite: "auto",
      });
    };
    apply(false);
    const onResize = () => apply(true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(inner);
    };
  }, [wide, selected]);

  // ── Compact screens: bring the inline preview card into view ─────
  useEffect(() => {
    if (wide || selected === null) return;
    const id = requestAnimationFrame(() => {
      const el = panelRef.current;
      if (!el) return;
      // Reveal the top of the card (title + action context) without
      // pushing the whole orbit off-screen.
      const r = el.getBoundingClientRect();
      const header = 88;
      const want = window.innerWidth < 640 ? Math.min(r.height, 280) : Math.min(r.height, window.innerHeight - 160);
      const delta = Math.min(r.top + want - window.innerHeight + 16, r.top - header);
      if (delta <= 0) return;
      const lenis = (window as Window & { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
      if (lenis) lenis.scrollTo(window.scrollY + delta);
      else window.scrollBy({ top: delta, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [wide, selected]);

  // ── Interaction ───────────────────────────────────────────────────
  const focusNode = useCallback((i: number) => {
    rootRef.current?.querySelector<HTMLElement>(`[data-node-button][data-index="${i}"]`)?.focus();
  }, []);

  const select = useCallback(
    (i: number | null) => {
      setSelected(i);
      if (i !== null) {
        setLastShown(i);
        const p = projects[i];
        setAnnouncement(`已選取 ${p.number} ${p.title}，作品預覽已開啟。`);
      } else {
        setAnnouncement("作品預覽已關閉。");
      }
    },
    [projects],
  );

  const onSelectNode = (i: number) => select(selected === i ? null : i);

  const step = (dir: 1 | -1) => {
    const from = selected ?? (dir === 1 ? -1 : 0);
    select((from + dir + count) % count);
  };

  const close = useCallback(() => {
    const prev = selected;
    select(null);
    if (prev !== null) focusNode(prev);
  }, [selected, select, focusNode]);

  const onKeyNav = (i: number, e: KeyboardEvent<HTMLElement>) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % count;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next === null) return;
    e.preventDefault();
    focusNode(next);
  };

  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && selected !== null) {
      e.stopPropagation();
      close();
    }
  };

  const onFocusNode = (i: number | null, visible: boolean) => {
    setFocusVis(i !== null && visible ? i : null);
    live.current.focus = i ?? -1;
    live.current.redraw();
  };

  const onThumbError = useCallback((slug: string) => setFailed((f) => (f[slug] ? f : { ...f, [slug]: true })), []);

  const previewProject = preview !== null ? projects[preview] : null;
  const counter = selected !== null ? projects[selected].number : "—";

  const panel = (
    <UniversePreview
      project={shown}
      open={selected !== null}
      variant={wide ? "overlay" : "inline"}
      id={panelId}
      titleId={panelTitleId}
      thumbFailed={!!failed[shown.slug]}
      onThumbError={onThumbError}
      onClose={close}
      onSwipe={step}
      panelRef={panelRef}
    />
  );

  return (
    <div ref={rootRef} onKeyDown={onRootKeyDown} className="relative">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      {/* ── Stage ─────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        data-universe-stage=""
        className={cn(
          "relative mx-auto w-full max-w-[110rem]",
          "h-[29rem] [--node-r:2rem] [--node-w:4.5rem] [--ocy:50%] [--orx:40%] [--ory:36%]",
          "md:h-[38rem] md:[--node-r:2.75rem] md:[--node-w:9rem] md:[--orx:37%] md:[--ory:36%]",
          "lg:h-[clamp(32rem,calc(100svh-14.5rem),54rem)] lg:[--node-r:3rem] lg:[--node-w:11rem] lg:[--ocy:47%] lg:[--ory:35%]",
          "xl:[--node-r:3.5rem]",
        )}
      >
        <div ref={innerRef} className="absolute inset-0 will-change-transform">
          {/* Static nebula: visible before the canvas loads and if it can't. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_30%_at_50%_50%,rgba(109,92,255,0.22),transparent_70%),radial-gradient(ellipse_30%_22%_at_36%_44%,rgba(139,124,255,0.12),transparent_70%),radial-gradient(ellipse_28%_20%_at_66%_58%,rgba(77,141,255,0.12),transparent_70%)]"
          />
          {/* Static orbit hint for the no-canvas state. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-(--ocy) h-[calc(var(--ory)*2)] w-[calc(var(--orx)*2)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[rgba(139,124,255,0.18)]"
          />
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(closest-side,#000_70%,transparent_100%)] md:[mask-image:radial-gradient(closest-side,#000_62%,transparent_100%)]" />

          {/* Core identity */}
          <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--ocy)-50%)] z-[5] flex h-full items-center justify-center">
            <div className="relative flex flex-col items-center text-center">
              <div
                className={cn(CROSSFADE, previewProject && "opacity-[0.07]", "flex flex-col items-center")}
              >
                <h2
                  id={headingId}
                  className="text-display-gradient font-display text-[1.625rem] font-medium uppercase leading-[0.98] tracking-[-0.02em] md:text-[2.875rem] lg:text-6xl xl:text-7xl"
                >
                  <span className="block">Explore</span>
                  <span className="block">Our Projects</span>
                </h2>
                <p
                  lang="zh-Hant"
                  className="mt-5 hidden max-w-[24rem] text-[0.9375rem] leading-relaxed text-ink-soft md:block lg:max-w-[30rem] lg:text-base"
                >
                  五個不同領域的創意作品，共同構成這次計畫的作品宇宙
                </p>
              </div>

              {/* Hover / focus preview — a visual echo; screen readers get the button description. */}
              <div
                aria-hidden="true"
                className={cn(
                  CROSSFADE,
                  "absolute left-1/2 top-1/2 flex w-[min(26rem,70vw)] -translate-x-1/2 -translate-y-1/2 flex-col items-center",
                  previewProject ? "opacity-100" : "opacity-0",
                )}
                style={previewProject ? ({ "--accent": previewProject.accent } as CSSProperties) : undefined}
              >
                {previewProject && (
                  <>
                    <p className="flex items-center gap-3 font-display text-[0.6875rem] uppercase tracking-[0.28em] text-ink-mute">
                      <span className="text-accent">{previewProject.number}</span>
                      <span className="h-px w-6 bg-line-strong" />
                      <span>{previewProject.categoryEn ?? previewProject.category}</span>
                    </p>
                    <p className="mt-3 font-display text-2xl font-medium text-ink md:text-3xl lg:text-4xl">{previewProject.title}</p>
                    {previewProject.subtitle && (
                      <p className="mt-1 font-display text-sm tracking-wide text-ink-mute">{previewProject.subtitle}</p>
                    )}
                    <p lang="zh-Hant" className="mt-4 line-clamp-3 hidden text-[0.9375rem] leading-relaxed text-ink-soft md:block">
                      {previewProject.summary}
                    </p>
                    <p className="mt-4 hidden font-display text-[0.6875rem] uppercase tracking-[0.24em] text-accent md:block">
                      {selected === preview ? "Selected · 已選取" : "Click or Enter · 開啟預覽"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Planets */}
          <div className="absolute inset-0 z-10" role="group" aria-label="作品星球（使用方向鍵切換，Enter 開啟預覽）">
            {projects.map((p, i) => {
              const a = slotAngle(i, count);
              return (
                <UniverseNode
                  key={p.slug}
                  project={p}
                  index={i}
                  cos={Math.cos(a)}
                  sin={Math.sin(a)}
                  depth={depthOf(a)}
                  interactive={hydrated}
                  selected={selected === i}
                  active={attention === i}
                  dimmed={attention !== null && attention !== i}
                  panelId={panelId}
                  descId={`${uid}-desc-${i}`}
                  thumbFailed={!!failed[p.slug]}
                  onThumbError={onThumbError}
                  onSelect={onSelectNode}
                  onHover={setHover}
                  onFocusNode={onFocusNode}
                  onKeyNav={onKeyNav}
                />
              );
            })}
          </div>
        </div>

        {wide && panel}
      </div>

      {/* ── Controls ──────────────────────────────────────────── */}
      <div className="container-x relative z-20 mt-0 grid grid-cols-1 items-center gap-5 md:mt-2 md:grid-cols-[1fr_auto_1fr]">
        <p className="order-4 flex items-center justify-center gap-3 text-sm text-ink-mute md:order-1 md:justify-start">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-violet/50" />
            <span className="relative size-2 rounded-full bg-violet" />
          </span>
          {coarse ? (
            <span lang="zh-Hant">點選星球探索</span>
          ) : (
            <span>
              <span lang="zh-Hant">滑鼠移入或點選探索</span>
              <span className="hidden xl:inline">
                <span aria-hidden="true" className="mx-2 text-line-strong">/</span>
                <span className="font-display text-xs uppercase tracking-[0.2em]">Hover or click to explore</span>
              </span>
            </span>
          )}
        </p>

        <div className="order-3 flex justify-center md:order-2">
          <ButtonLink href="/projects" variant="ghost" magnetic className="px-7 font-display text-xs uppercase tracking-[0.24em]">
            View all projects
            <ArrowIcon className="group-hover:translate-x-1" />
          </ButtonLink>
        </div>

        <div className="order-1 flex items-center justify-center gap-3 md:order-3 md:justify-end">
          {hydrated && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="上一個作品"
                aria-controls={panelId}
                className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-white/[0.02] text-ink transition-colors duration-300 hover:border-violet hover:bg-white/[0.06]"
              >
                <ArrowIcon direction="left" />
              </button>
              <p className="min-w-[4.5rem] text-center font-display text-sm tabular-nums tracking-[0.2em] text-ink-soft" aria-hidden="true">
                <span className="text-ink">{counter}</span>
                <span className="text-ink-mute"> / {String(count).padStart(2, "0")}</span>
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="下一個作品"
                aria-controls={panelId}
                className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-white/[0.02] text-ink transition-colors duration-300 hover:border-violet hover:bg-white/[0.06]"
              >
                <ArrowIcon />
              </button>
            </>
          )}
        </div>

        {!wide && <div className="order-2 col-span-full md:order-4">{panel}</div>}
      </div>
    </div>
  );
}
