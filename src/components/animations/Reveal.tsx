"use client";

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap, useGSAP, motion, prefersReducedMotion } from "@/lib/motion";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: boolean;
  /** Vertical offset in px. */
  y?: number;
  delay?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * Scroll-triggered fade-up reveal. Content is fully visible without JS and
 * under prefers-reduced-motion (the hidden state is only applied when
 * `html.js-motion` is set, see layout.tsx).
 */
export function Reveal<T extends ElementType = "div">({
  as,
  children,
  stagger = false,
  y = 28,
  delay = 0,
  className,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? Array.from(el.children) : [el];
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        if (stagger) gsap.set(el, { opacity: 1 });
        return;
      }
      if (stagger) gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: motion.duration.reveal,
          ease: motion.ease.out,
          delay,
          stagger: stagger ? motion.stagger : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal="" className={className} {...rest}>
      {children}
    </Tag>
  );
}
