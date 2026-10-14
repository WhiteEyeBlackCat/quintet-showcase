"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";

const HeroParticles = dynamic(() => import("./HeroParticles"), { ssr: false });

/**
 * Cinematic backdrop: an arched exhibition portal opening onto a misty
 * mountain landscape, volumetric light, drifting mist and dust.
 * Pure decoration (aria-hidden). Pointer parallax is desktop-only.
 */
export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = prefersReducedMotion();
      const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      // Entrance: portal opens out of the dark.
      if (!reduced) {
        gsap.from("[data-portal]", { opacity: 0, scale: 0.94, y: 24, duration: 1.8, ease: "expo.out", delay: 0.15 });
        gsap.from("[data-glow]", { opacity: 0, duration: 2.4, ease: "power2.out" });
        // Ambient: mist drift + light breathing.
        gsap.utils.toArray<HTMLElement>("[data-mist]").forEach((m, i) => {
          gsap.to(m, {
            xPercent: i % 2 ? -9 : 9,
            duration: 14 + i * 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
        gsap.to("[data-rays]", { rotation: 4, opacity: 0.85, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to("[data-breathe]", { opacity: 0.7, scale: 1.04, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      if (reduced || !hover) return;

      // Pointer parallax (desktop only).
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((node) => {
        const d = Number(node.dataset.depth);
        return {
          d,
          x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3.out" }),
        };
      });
      const host = el.parentElement ?? el;
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        for (const l of layers) {
          l.x(-nx * l.d);
          l.y(-ny * l.d * 0.6);
        }
      };
      const onLeave = () => layers.forEach((l) => (l.x(0), l.y(0)));
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      return () => {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Ambient wash */}
      <div
        data-glow=""
        className="absolute inset-0 bg-[radial-gradient(60%_70%_at_78%_45%,rgba(109,92,255,0.34),transparent_70%),radial-gradient(45%_50%_at_95%_100%,rgba(77,141,255,0.22),transparent_70%),radial-gradient(40%_40%_at_10%_0%,rgba(232,121,208,0.10),transparent_70%)]"
      />

      {/* Portal composition */}
      <div className="absolute inset-x-0 top-[calc(var(--header-h)+0.5rem)] flex h-[42svh] justify-center [mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)] lg:[mask-image:none] lg:inset-x-auto lg:right-[5vw] lg:top-[calc(var(--header-h)+1.5rem)] lg:bottom-[5vh] lg:h-auto lg:w-[min(36vw,34rem)] lg:justify-end xl:right-[7vw]">
        <div data-depth="10" className="relative h-full aspect-[5/7] lg:aspect-auto lg:w-full">
          <div data-portal="" className="relative size-full">
            {/* Halo behind the arch */}
            <div
              data-breathe=""
              className="absolute -inset-[24%] bg-[radial-gradient(closest-side,rgba(139,124,255,0.55),rgba(77,141,255,0.18)_55%,transparent)]"
            />
            {/* Volumetric rays */}
            <div
              data-rays=""
              className="absolute -inset-[40%] opacity-35 [mask-image:radial-gradient(closest-side,#000_30%,transparent_95%)] [background:repeating-conic-gradient(from_0deg_at_50%_52%,rgba(190,180,255,0.0)_0deg,rgba(190,180,255,0.22)_3deg,rgba(190,180,255,0)_7deg,rgba(190,180,255,0)_16deg)]"
            />
            <PortalSvg />
            {/* Floor light spill */}
            <div className="absolute -bottom-[3%] left-1/2 h-[10%] w-[150%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(160,150,255,0.65),rgba(94,227,240,0.12)_60%,transparent)]" />
          </div>
        </div>
      </div>

      {/* Layered mist across the lower third */}
      <div data-depth="26" className="absolute inset-x-[-10%] bottom-0 h-[38%]">
        <div
          data-mist=""
          className="absolute inset-x-0 bottom-[8%] h-3/5 bg-[radial-gradient(ellipse_at_center,rgba(150,140,255,0.28),transparent_65%)]"
        />
        <div
          data-mist=""
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_30%_100%,rgba(94,227,240,0.16),transparent_60%),radial-gradient(ellipse_at_80%_100%,rgba(139,124,255,0.26),transparent_60%)]"
        />
      </div>

      {/* Dust */}
      <div className="absolute inset-0">
        <HeroParticles />
      </div>
    </div>
  );
}

function PortalSvg() {
  return (
    <svg viewBox="0 0 400 560" className="absolute inset-0 size-full overflow-visible" preserveAspectRatio="xMidYMax meet" fill="none">
      <defs>
        <clipPath id="hp-open">
          <path d="M32 560V198A168 168 0 0 1 368 198V560Z" />
        </clipPath>
        <linearGradient id="hp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#100c3d" />
          <stop offset="0.38" stopColor="#3b2aa8" />
          <stop offset="0.66" stopColor="#8a4fd0" />
          <stop offset="0.84" stopColor="#e58ad2" />
          <stop offset="1" stopColor="#ffc3b0" />
        </linearGradient>
        <radialGradient id="hp-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#ffd6ef" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ff9be0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hp-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a5fe0" />
          <stop offset="1" stopColor="#4a2fa8" />
        </linearGradient>
        <linearGradient id="hp-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3aaa" />
          <stop offset="1" stopColor="#1e1570" />
        </linearGradient>
        <linearGradient id="hp-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1458" />
          <stop offset="1" stopColor="#080720" />
        </linearGradient>
        <linearGradient id="hp-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd7f2" stopOpacity="0" />
          <stop offset="0.55" stopColor="#f2d6ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c9b8ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hp-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9d4ff" />
          <stop offset="0.5" stopColor="#8b7cff" />
          <stop offset="1" stopColor="#5ee3f0" />
        </linearGradient>
        <linearGradient id="hp-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1a4a" />
          <stop offset="1" stopColor="#05061a" />
        </linearGradient>
        <filter id="hp-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="hp-soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Outer echo arches for depth */}
      <path d="M-14 560V196A214 214 0 0 1 414 196V560" stroke="#8b7cff" strokeOpacity="0.18" strokeWidth="1" />
      <path d="M-34 560V196A234 234 0 0 1 434 196V560" stroke="#5ee3f0" strokeOpacity="0.08" strokeWidth="1" />

      {/* Wall thickness */}
      <path d="M12 560V198A188 188 0 0 1 388 198V560Z" fill="url(#hp-wall)" />
      <path d="M12 560V198A188 188 0 0 1 388 198V560" stroke="url(#hp-edge)" strokeWidth="5" filter="url(#hp-glow)" opacity="0.9" />
      <path d="M12 560V198A188 188 0 0 1 388 198V560" stroke="url(#hp-edge)" strokeWidth="1.6" />

      {/* The opening */}
      <g clipPath="url(#hp-open)">
        <rect x="0" y="0" width="400" height="560" fill="url(#hp-sky)" />
        {/* stars */}
        <g fill="#fff">
          <circle cx="92" cy="96" r="1" opacity="0.8" />
          <circle cx="150" cy="58" r="0.8" opacity="0.6" />
          <circle cx="248" cy="74" r="1.1" opacity="0.8" />
          <circle cx="302" cy="128" r="0.8" opacity="0.6" />
          <circle cx="206" cy="132" r="0.7" opacity="0.5" />
          <circle cx="120" cy="170" r="0.7" opacity="0.5" />
          <circle cx="330" cy="210" r="0.9" opacity="0.6" />
        </g>
        <circle cx="200" cy="356" r="150" fill="url(#hp-sun)" />
        <path d="M0 392 L48 340 L88 372 L148 296 L208 360 L262 318 L322 366 L362 336 L400 376 V560 H0Z" fill="url(#hp-far)" opacity="0.9" />
        <rect x="0" y="360" width="400" height="60" fill="url(#hp-mist)" />
        <path d="M0 444 L66 390 L126 428 L196 352 L268 430 L330 400 L400 446 V560 H0Z" fill="url(#hp-mid)" />
        <rect x="0" y="410" width="400" height="70" fill="url(#hp-mist)" opacity="0.8" />
        <path d="M0 500 L76 462 L158 494 L236 446 L318 490 L400 462 V560 H0Z" fill="url(#hp-near)" />
        <rect x="0" y="470" width="400" height="60" fill="url(#hp-mist)" opacity="0.7" />
        {/* Lone figure on the ridge */}
        <g fill="#04030f">
          <circle cx="236" cy="428" r="2.6" />
          <path d="M232.4 431.4h7.2l2.2 12.6h-11.6z" />
          <path d="M233.4 444h2.2l-.4 4.4h-1.6zm3.4 0h2.2l.4 4.4h-1.6z" />
        </g>
        {/* inner vignette */}
        <path d="M32 560V198A168 168 0 0 1 368 198V560" stroke="#05061a" strokeWidth="26" opacity="0.55" filter="url(#hp-soft)" />
        {/* floor reflection */}
        <ellipse cx="200" cy="556" rx="150" ry="22" fill="#c9b8ff" opacity="0.5" filter="url(#hp-soft)" />
      </g>
      <path d="M32 560V198A168 168 0 0 1 368 198V560" stroke="#f0eaff" strokeOpacity="0.55" strokeWidth="1" />
    </svg>
  );
}
