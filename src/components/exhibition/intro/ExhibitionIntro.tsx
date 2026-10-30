"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, motion, prefersReducedMotion, isLowPowerDevice } from "@/lib/motion";

import { SEEN_KEY } from "./guard";
import { tagline } from "@/data/program";

/**
 * Runs while the document is parsed (before first paint) so returning visitors
 * and reduced-motion users never see the overlay. First-time visitors see it
 * from the very first paint, so the page never flashes before the intro.
 */

/**
 * Failsafe: if JS never takes over (disabled / crashed), the overlay hides
 * itself via a pure-CSS animation, and instantly under <noscript>.
 */
const css = `
.avc-intro{animation:avc-failsafe 1ms linear 6s forwards}
.avc-intro[data-live]{animation:none}
html[data-avc-intro="skip"] .avc-intro{display:none}
@keyframes avc-failsafe{to{visibility:hidden;pointer-events:none}}
.avc-intro .avc-skip:focus-visible{outline:1px solid rgba(255,255,255,.7);outline-offset:2px}
`;

const COLORS: [number, number, number][] = [
  [139, 124, 255],
  [232, 121, 208],
  [94, 227, 240],
  [110, 168, 255],
  [124, 240, 180],
];

type Sim = { fade: number; show: number; conv: number; flash: number };

function makeSprite(rgb: [number, number, number]) {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    const [r, gg, b] = rgb;
    grad.addColorStop(0, `rgba(255,255,255,1)`);
    grad.addColorStop(0.12, `rgba(${r},${gg},${b},0.9)`);
    grad.addColorStop(0.4, `rgba(${r},${gg},${b},0.22)`);
    grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  }
  return c;
}


export function ExhibitionIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const decision = useRef<"play" | "skip" | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    // Decide once per mount (ref survives React strict-mode re-runs).
    if (decision.current === null) {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
        if (!seen) sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable: play once per mount */
      }
      decision.current = seen || prefersReducedMotion() ? "skip" : "play";
    }
    if (decision.current === "skip") {
      root.style.display = "none";
      return;
    }

    root.setAttribute("data-live", "");
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis?.stop();
    skipRef.current?.focus({ preventScroll: true });

    const small = window.innerWidth < 768;
    const lite = small || isLowPowerDevice();
    const ctx = canvas.getContext("2d");
    const sprites = COLORS.map(makeSprite);

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle field (random data is generated in the effect, never during render).
    const count = lite ? 70 : 170;
    const parts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.2 + Math.random() * 0.8,
      p: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.004,
    }));

    const sim: Sim = { fade: 0, show: 0, conv: 0, flash: 0 };
    let raf = 0;
    let t0 = performance.now();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!ctx) return;
      const t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const p of parts) {
        const x = (((p.x + p.vx * t) % 1) + 1) % 1;
        const y = (((p.y + p.vy * t) % 1) + 1) % 1;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + p.p);
        ctx.globalAlpha = sim.fade * p.z * (0.25 + 0.55 * tw);
        ctx.fillStyle = "#cfd3ff";
        const s = p.z * (lite ? 1.4 : 1.2);
        ctx.fillRect(x * w, y * h, s, s);
      }

      const cx = w / 2;
      const cy = h * (small ? 0.4 : 0.42);
      const R0 = Math.min(w * (small ? 0.4 : 0.3), h * 0.3);
      const e = sim.conv * sim.conv * (3 - 2 * sim.conv);
      const R = R0 * (1 - e * 0.97) + 3;
      const pts = COLORS.map((_, i) => {
        const a = (i / COLORS.length) * Math.PI * 2 - Math.PI / 2 + t * (0.55 + e * 2.2);
        return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * 0.5 };
      });

      // thin connecting lines: pentagon ring + spokes towards the centre
      ctx.lineWidth = 1;
      const lineA = sim.show * (1 - sim.flash * 0.6);
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const c2 = pts[(i + 2) % pts.length];
        ctx.globalAlpha = lineA * 0.32;
        ctx.strokeStyle = "rgb(170,160,255)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.globalAlpha = lineA * 0.13;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.stroke();
        ctx.globalAlpha = lineA * 0.22 * e;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }

      pts.forEach((p, i) => {
        const size = (small ? 46 : 64) * (0.8 + 0.2 * Math.sin(t * 2 + i));
        ctx.globalAlpha = sim.show;
        ctx.drawImage(sprites[i], p.x - size / 2, p.y - size / 2, size, size);
      });

      // convergence core
      const core = (small ? 120 : 180) * (0.4 + e * 0.6) + sim.flash * (small ? 260 : 460);
      ctx.globalAlpha = Math.min(1, sim.show * e * 0.9 + sim.flash);
      ctx.drawImage(sprites[0], cx - core / 2, cy - core / 2, core, core);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame((n) => {
      t0 = n;
      draw(n);
    });

    // --- orchestration ---------------------------------------------------
    const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const orb = q(".avc-orb");
    const bar = q(".avc-bar");
    const barWrap = q(".avc-barwrap");
    const t1 = q(".avc-t1");
    const t2 = q(".avc-t2");
    const cap = q(".avc-cap");
    const pct = q(".avc-pct");
    const live = q(".avc-live");
    const prog = { v: 0 };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey, true);
      root.removeEventListener("click", skip);
      html.style.overflow = prevOverflow;
      (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis?.start();
      root.style.display = "none";
      canvas.width = canvas.height = 0;
      document.getElementById("main")?.focus({ preventScroll: true });
    };

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    gsap.set([t1, t2, cap, barWrap], { opacity: 0 });
    gsap.set(t2, { y: 10 });
    tl.to(sim, { fade: 1, duration: 0.7, ease: "none" }, 0.1)
      .fromTo(orb, { opacity: 0, yPercent: 10 }, { opacity: 1, yPercent: 0, duration: 1.6, ease: motion.ease.out }, 0.2)
      .to(sim, { show: 1, duration: 0.8, ease: "power2.inOut" }, 0.5)
      .to(sim, { conv: 1, duration: 1.8, ease: "power2.inOut" }, 0.6)
      .to(barWrap, { opacity: 1, duration: 0.5 }, 0.9)
      .fromTo(t1, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
      .to(
        prog,
        {
          v: 1,
          duration: 1.8,
          ease: "power1.inOut",
          onUpdate: () => {
            if (bar) gsap.set(bar, { scaleX: prog.v });
            if (pct) pct.textContent = `${String(Math.round(prog.v * 100)).padStart(3, "0")}`;
          },
        },
        0.6,
      )
      .to(sim, { flash: 1, duration: 0.25, ease: "power2.in" }, 2.3)
      .to(sim, { flash: 0, duration: 0.5, ease: "power2.out" }, 2.55)
      .to(t1, { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" }, 2.3)
      .to(barWrap, { opacity: 0, duration: 0.3 }, 2.3)
      .to(t2, { opacity: 1, y: 0, duration: 0.6 }, 2.5)
      .to(cap, { opacity: 1, duration: 0.6 }, 0.6)
      .add(() => {
        if (live) live.textContent = "展覽即將開始";
      }, 2.5)
      .to(
        root,
        { opacity: 0, scale: 1.06, filter: "blur(10px)", duration: 0.6, ease: "power2.in" },
        2.95,
      )
      .add(finish, 3.55);

    function skip() {
      if (finished) return;
      tl.kill();
      gsap.to(root, {
        opacity: 0,
        scale: 1.03,
        filter: "blur(6px)",
        duration: 0.35,
        ease: "power2.out",
        onComplete: finish,
        overwrite: true,
      });
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        skip();
      } else if (e.key === "Tab") {
        e.preventDefault(); // dialog holds a single focusable control
        skipRef.current?.focus({ preventScroll: true });
      }
    }
    window.addEventListener("keydown", onKey, true);
    root.addEventListener("click", skip);

    return () => {
      tl.kill();
      gsap.killTweensOf(root);
      if (!finished) {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("keydown", onKey, true);
        root.removeEventListener("click", skip);
        html.style.overflow = prevOverflow;
        (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis?.start();
        gsap.set(root, { clearProps: "opacity,scale,filter" });
        root.removeAttribute("data-live");
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <noscript>
        <style>{`.avc-intro{display:none!important}`}</style>
      </noscript>
      <div
        ref={rootRef}
        className="avc-intro fixed inset-0 z-[300] flex cursor-pointer select-none flex-col items-center overflow-hidden bg-void text-ink will-change-[opacity,transform,filter]"
        role="dialog"
        aria-modal="true"
        aria-label="展覽開場動畫"
      >
        <p className="avc-live sr-only" aria-live="polite">
          展覽開場動畫播放中，可按 Esc 或點擊畫面略過。
        </p>

        {/* orb horizon */}
        <div
          aria-hidden
          className="avc-orb pointer-events-none absolute left-1/2 top-[84%] aspect-square w-[170vw] -translate-x-1/2 rounded-full opacity-0 md:top-[88%] md:w-[120vw]"
          style={{
            background: "radial-gradient(circle at 50% 0%, #0b0d24 0%, #04050b 60%)",
            boxShadow:
              "0 -1px 0 0 rgba(205,195,255,0.8), 0 -10px 60px 0 rgba(139,124,255,0.6), 0 -40px 160px 20px rgba(77,141,255,0.22), inset 0 14px 60px -10px rgba(139,124,255,0.35)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[78%] h-[22%] bg-gradient-to-t from-void to-transparent md:top-[82%]"
        />
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

        <button
          ref={skipRef}
          type="button"
          className="avc-skip font-display absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-4 text-[11px] font-medium tracking-[0.3em] text-ink-soft transition-colors hover:text-ink md:right-8 md:top-7"
          aria-label="略過開場動畫"
        >
          SKIP <span aria-hidden>→</span>
        </button>

        <div className="font-display relative mt-[56dvh] flex w-full flex-col items-center px-6 text-center md:mt-[60dvh]">
          <div className="relative h-6 w-full">
            <p className="avc-t1 absolute inset-x-0 text-[11px] font-medium tracking-[0.34em] text-ink md:text-sm md:tracking-[0.5em]">
              INITIALIZING EXHIBITION...
            </p>
            <p className="avc-t2 absolute inset-x-0 text-[11px] font-medium tracking-[0.34em] text-ink md:text-sm md:tracking-[0.5em]">
              {tagline}
            </p>
          </div>
          <div className="avc-barwrap mt-5 flex w-[min(62vw,16rem)] items-center gap-3">
            <div className="h-px flex-1 bg-white/15">
              <div
                className="avc-bar h-px origin-left bg-gradient-to-r from-violet to-blue shadow-[0_0_10px_2px_rgba(139,124,255,0.7)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span className="avc-pct w-7 text-[10px] tabular-nums tracking-[0.1em] text-ink-mute">000</span>
          </div>
        </div>

        <p className="avc-cap font-display absolute inset-x-0 bottom-8 px-6 text-center text-[9px] tracking-[0.3em] text-ink-mute md:bottom-10 md:text-[10px] md:tracking-[0.4em]">
          {tagline} ONE AI-POWERED CREATIVE JOURNEY.
        </p>
      </div>
    </>
  );
}
