import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Technology / category tag. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line-strong bg-white/[0.03] px-2.5 py-1 font-display text-xs tracking-wide text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Marks fictional sample content so it is never mistaken for real results. */
export function PlaceholderBadge({ className, label = "PLACEHOLDER · 範例內容" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed border-[color-mix(in_oklab,var(--magenta)_55%,transparent)] px-2.5 py-0.5 font-display text-[0.6875rem] tracking-[0.14em] text-[color-mix(in_oklab,var(--magenta)_75%,white)]",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-magenta" />
      {label}
    </span>
  );
}

interface SectionHeaderProps {
  /** e.g. "04" */
  index?: string;
  /** English label, e.g. "PROJECT UNIVERSE" */
  eyebrow: string;
  /** Main heading (Traditional Chinese or English). */
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Heading level; sections on the homepage use h2. */
  as?: "h1" | "h2" | "h3";
  id?: string;
}

/** Consistent section header: numbered eyebrow + display heading + lead. */
export function SectionHeader({ index, eyebrow, title, description, align = "left", className, as: H = "h2", id }: SectionHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      <p className="eyebrow flex items-center gap-3">
        {index && <span className="text-accent">{index}</span>}
        {index && <span aria-hidden="true" className="h-px w-8 bg-line-strong" />}
        <span>{eyebrow}</span>
      </p>
      <H id={id} className="font-display text-3xl font-medium leading-[1.15] text-ink sm:text-4xl lg:text-5xl">
        {title}
      </H>
      {description && (
        <p className={cn("max-w-2xl text-balance text-base leading-relaxed text-ink-soft sm:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </header>
  );
}

/** Thin luminous divider. */
export function Hairline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent", className)}
    />
  );
}
