"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, motion, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface RevealHeadingProps {
  /** Each entry is one masked line. Keep headlines short — never use for body copy. */
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Start immediately on mount (hero) instead of on scroll. */
  immediate?: boolean;
  delay?: number;
  id?: string;
}

/** Masked line-by-line headline reveal. Text is real and selectable. */
export function RevealHeading({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  immediate = false,
  delay = 0,
  id,
}: RevealHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelectorAll<HTMLElement>("[data-line]");
      gsap.set(el, { opacity: 1 });
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        inner,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: motion.ease.out,
          stagger: 0.12,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-reveal="" className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span data-line="" className={cn("block will-change-transform", lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
