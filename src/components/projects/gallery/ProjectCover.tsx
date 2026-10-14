"use client";

import { ViewTransition, useEffect, useRef } from "react";
import type { Project } from "@/types/content";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { MediaFrame } from "@/components/media/MediaFrame";
import { cn } from "@/lib/utils/cn";
import { coverMedia } from "./utils";

interface ProjectCoverProps {
  project: Project;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  showBadge?: boolean;
  /** Subtle 3D tilt + accent glare on hover (fine pointers only). */
  tilt?: boolean;
  /** Wrap in the shared-element ViewTransition. Disable for non-primary duplicates. */
  transition?: boolean;
  className?: string;
}

/** Project cover with restrained pointer tilt and an accent light that follows the cursor. */
export function ProjectCover({
  project,
  aspect = "aspect-[16/10]",
  sizes,
  priority,
  showBadge = true,
  tilt = true,
  transition = true,
  className,
}: ProjectCoverProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !tilt) return;
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(el, { transformPerspective: 1100 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      ry(nx * 7);
      rx(-ny * 6);
      if (glare.current) {
        glare.current.style.setProperty("--gx", `${(nx + 0.5) * 100}%`);
        glare.current.style.setProperty("--gy", `${(ny + 0.5) * 100}%`);
        glare.current.style.opacity = "1";
      }
    };
    const onLeave = () => {
      rx(0);
      ry(0);
      if (glare.current) glare.current.style.opacity = "0";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [tilt]);

  const frame = <MediaFrame media={coverMedia(project)} aspect={aspect} sizes={sizes} priority={priority} showBadge={showBadge} />;

  return (
    <div ref={wrap} className={cn("relative will-change-transform [transform-style:preserve-3d]", className)}>
      {transition ? <ViewTransition name={`project-media-${project.slug}`}>{frame}</ViewTransition> : frame}
      <div
        ref={glare}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 [background:radial-gradient(40%_50%_at_var(--gx,50%)_var(--gy,50%),color-mix(in_oklab,var(--accent)_38%,transparent),transparent)]"
      />
    </div>
  );
}
