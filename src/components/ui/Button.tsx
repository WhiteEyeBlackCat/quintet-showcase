"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost" | "quiet";

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-[background-color,border-color,color,box-shadow] duration-300 ease-out-expo cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent font-semibold text-void shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_10px_40px_-10px_var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_85%,white)]",
  ghost:
    "border border-line-strong bg-white/[0.02] text-ink hover:border-[color-mix(in_oklab,var(--accent)_60%,transparent)] hover:bg-white/[0.06]",
  quiet: "px-2 text-ink-soft hover:text-ink",
};

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  /** Subtle pointer attraction. Automatically off on touch / reduced motion. */
  magnetic?: boolean;
  className?: string;
  "aria-label"?: string;
}

type ButtonLinkProps = CommonProps & { href: string; external?: boolean; onClick?: () => void };
type ButtonProps = CommonProps & { onClick?: () => void; type?: "button" | "submit"; disabled?: boolean };

function useMagnetic(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);

  // Kill any running tween on unmount.
  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) gsap.killTweensOf(el);
    };
  }, []);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (!enabled || prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: dx * 0.22, y: dy * 0.3, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };
  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
  };

  return { ref, onMouseMove, onMouseLeave };
}

export function ButtonLink({ href, external, children, variant = "primary", magnetic, className, onClick, ...aria }: ButtonLinkProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(!!magnetic);
  const cls = cn(base, variants[variant], className);
  if (external) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        {...aria}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      className={cls}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      {...aria}
    >
      {children}
    </Link>
  );
}

export function Button({ children, variant = "primary", magnetic, className, onClick, type = "button", disabled, ...aria }: ButtonProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(!!magnetic);
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant], className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      {...aria}
    >
      {children}
    </button>
  );
}

/** Small arrow glyph used inside buttons. Decorative. */
export function ArrowIcon({ className, direction = "right" }: { className?: string; direction?: "right" | "left" | "up" | "down" | "up-right" }) {
  const rot = { right: 0, down: 90, left: 180, up: -90, "up-right": -45 }[direction];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className={cn("shrink-0 transition-transform duration-300 ease-out-expo", className)}
      style={{ transform: `rotate(${rot}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
