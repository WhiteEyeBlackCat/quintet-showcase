"use client";

import Image from "next/image";
import type { CSSProperties, FocusEvent, KeyboardEvent, PointerEvent } from "react";
import { cn } from "@/lib/utils/cn";
import type { UniverseProject } from "./geometry";

interface UniverseNodeProps {
  project: UniverseProject;
  index: number;
  /** cos/sin of the slot angle — used for the server-rendered base position. */
  cos: number;
  sin: number;
  depth: number;
  interactive: boolean;
  selected: boolean;
  /** Another node is currently in focus/hover → this one recedes. */
  dimmed: boolean;
  active: boolean;
  panelId: string;
  descId: string;
  thumbFailed: boolean;
  onThumbError: (slug: string) => void;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
  onFocusNode: (index: number | null, visible: boolean) => void;
  onKeyNav: (index: number, e: KeyboardEvent<HTMLElement>) => void;
}

/**
 * One "planet": a project thumbnail held inside a luminous ring, with its
 * number, title and category beneath. The anchor sits exactly on the orbit
 * point; the rAF loop adds drift and depth via the anchor's transform.
 *
 * Before hydration (or without JS) the node is a plain link to the project
 * page, so the universe is never a dead end.
 */
export function UniverseNode({
  project: p,
  index,
  cos,
  sin,
  depth,
  interactive,
  selected,
  dimmed,
  active,
  panelId,
  descId,
  thumbFailed,
  onThumbError,
  onSelect,
  onHover,
  onFocusNode,
  onKeyNav,
}: UniverseNodeProps) {
  const anchorStyle = {
    left: `calc(50% + ${cos.toFixed(4)} * var(--orx))`,
    top: `calc(var(--ocy) + ${sin.toFixed(4)} * var(--ory))`,
    zIndex: Math.round(depth * 10) + 10,
    "--node-accent": p.accent,
    "--node-accent-2": p.accent2,
    // Each planet's ring gap faces a different direction — a quiet signature.
    "--ring-start": `${(index * 137) % 360}deg`,
    "--moon-dur": `${18 + index * 5}s`,
  } as CSSProperties;

  const className = cn(
    "uv-node group absolute left-0 top-0 flex w-(--node-w) cursor-pointer flex-col items-center rounded-full text-center",
    "transition-[opacity,filter] duration-500 ease-out-expo",
    dimmed && "opacity-55 saturate-[0.6]",
  );
  const nodeStyle: CSSProperties = { transform: "translate(-50%, calc(var(--node-r) * -1))" };

  const label = `${p.number} ${p.title}${p.subtitle ? `（${p.subtitle}）` : ""}・${p.category}`;

  const body = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "uv-planet relative block size-[calc(var(--node-r)*2)] rounded-full transition-transform duration-700 ease-out-expo",
          (active || selected) && "scale-[1.12]",
        )}
      >
        {/* outer halo */}
        <span
          className={cn(
            "absolute -inset-[30%] rounded-full opacity-40 transition-opacity duration-700",
            "bg-[radial-gradient(circle,color-mix(in_oklab,var(--node-accent)_55%,transparent)_0%,transparent_70%)]",
            (active || selected) && "opacity-100",
          )}
        />
        {/* signature conic ring */}
        <span
          className="absolute -inset-[9%] animate-spin rounded-full"
          style={{
            animationDuration: "calc(var(--moon-dur) * 3)",
            animationDirection: "reverse",
            background:
              "conic-gradient(from var(--ring-start), transparent 0deg, var(--node-accent) 70deg, var(--node-accent-2) 200deg, transparent 300deg, transparent 360deg)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          }}
        />
        {/* faint full ring */}
        <span
          className={cn(
            "absolute -inset-[9%] rounded-full border transition-colors duration-500",
            "border-[color-mix(in_oklab,var(--node-accent)_22%,transparent)]",
            (active || selected) && "border-[color-mix(in_oklab,var(--node-accent)_70%,transparent)]",
          )}
        />
        {/* orbiting moon */}
        <span className="absolute -inset-[9%] animate-spin rounded-full" style={{ animationDuration: "var(--moon-dur)" }}>
          <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--node-accent) shadow-[0_0_10px_2px_var(--node-accent)]" />
        </span>
        {/* thumbnail disc */}
        <span className="absolute inset-0 overflow-hidden rounded-full bg-panel shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          {thumbFailed ? (
            <span className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklab,var(--node-accent)_60%,#fff)_0%,var(--node-accent)_22%,color-mix(in_oklab,var(--node-accent-2)_70%,#000)_62%,#05060f_100%)] font-display text-lg font-medium text-white/90">
              {p.number}
            </span>
          ) : (
            <Image
              src={p.thumbnail}
              alt=""
              fill
              sizes="128px"
              className="scale-[1.2] object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.32]"
              onError={() => onThumbError(p.slug)}
            />
          )}
          {/* sphere shading so the flat thumbnail reads as a planet */}
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.22)_0%,transparent_38%),radial-gradient(circle_at_72%_80%,rgba(4,5,11,0.55)_0%,transparent_55%)]" />
          <span className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--node-accent)_10%,transparent)]" />
        </span>
      </span>

      <span className="uv-label mt-[calc(var(--node-r)*0.32)] flex flex-col items-center gap-0.5">
        <span
          className={cn(
            "font-display text-xs font-medium tracking-[0.24em] text-(--node-accent) transition-colors",
            "max-md:rounded-full max-md:bg-void/70 max-md:px-2 max-md:py-0.5",
          )}
        >
          {p.number}
        </span>
        <span
          className={cn(
            "hidden font-display text-base font-medium leading-snug text-ink-soft transition-colors duration-300 md:block",
            (active || selected) && "text-ink",
          )}
        >
          {p.title}
        </span>
        <span className="hidden font-display text-[0.6875rem] uppercase leading-snug tracking-[0.18em] text-ink-mute lg:block">
          {p.categoryEn ?? p.category}
        </span>
      </span>
    </>
  );

  return (
    <div data-node-anchor="" data-index={index} className="absolute size-0 will-change-transform" style={anchorStyle}>
      {interactive ? (
        <button
          type="button"
          data-node-button=""
          data-index={index}
          className={className}
          style={nodeStyle}
          aria-expanded={selected}
          aria-controls={panelId}
          aria-describedby={descId}
          aria-label={label}
          onClick={() => onSelect(index)}
          onPointerEnter={(e: PointerEvent) => e.pointerType === "mouse" && onHover(index)}
          onPointerLeave={(e: PointerEvent) => e.pointerType === "mouse" && onHover(null)}
          onFocus={(e: FocusEvent<HTMLElement>) => onFocusNode(index, e.currentTarget.matches(":focus-visible"))}
          onBlur={() => onFocusNode(null, false)}
          onKeyDown={(e) => onKeyNav(index, e)}
        >
          {body}
        </button>
      ) : (
        <a href={`/projects/${p.slug}`} className={className} style={nodeStyle} aria-label={label}>
          {body}
        </a>
      )}
      <span id={descId} className="sr-only">
        {p.summary}
      </span>
    </div>
  );
}
