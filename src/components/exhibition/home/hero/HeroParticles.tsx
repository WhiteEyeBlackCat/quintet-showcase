"use client";

import { useEffect, useRef } from "react";
import { isLowPowerDevice, prefersReducedMotion } from "@/lib/motion";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  phase: number;
  color: string;
}

const COLORS = ["200,196,255", "139,124,255", "94,227,240", "255,255,255", "232,121,208"];

/**
 * Lightweight 2D canvas dust: slow drifting motes, biased toward the portal
 * side. Pauses when offscreen or the tab is hidden. DPR capped at 2.
 */
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const small = window.innerWidth < 768;
    const count = small || isLowPowerDevice() ? 36 : 90;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;

    const spawn = (initial: boolean): Particle => {
      const nearPortal = Math.random() < 0.45;
      return {
        x: nearPortal ? w * (0.55 + Math.random() * 0.4) : Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        r: 0.4 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 6,
        vy: -(4 + Math.random() * 14),
        a: 0.15 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    let particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () => spawn(true));
      if (reduced) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const tw = 0.55 + 0.45 * Math.sin(t * 0.0012 + p.phase);
        const edge = Math.min(1, p.y / (h * 0.25), (h - p.y) / (h * 0.15) + 0.2);
        ctx.globalAlpha = Math.max(0, p.a * tw * edge);
        ctx.fillStyle = `rgb(${p.color})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += (p.vx + Math.sin(now * 0.0004 + p.phase) * 5) * dt;
        p.y += p.vy * dt;
        if (p.y < -10 || p.x < -20 || p.x > w + 20) particles[i] = spawn(false);
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />;
}
