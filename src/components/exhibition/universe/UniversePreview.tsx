"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type PointerEvent, type Ref } from "react";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { PlaceholderBadge, Tag } from "@/components/ui/primitives";
import { cn } from "@/lib/utils/cn";
import { hexToRgb, type UniverseProject } from "./geometry";

interface UniversePreviewProps {
  project: UniverseProject;
  open: boolean;
  /** "overlay" floats beside the orbit (wide screens); "inline" sits below it. */
  variant: "overlay" | "inline";
  id: string;
  titleId: string;
  thumbFailed: boolean;
  onThumbError: (slug: string) => void;
  onClose: () => void;
  onSwipe: (dir: 1 | -1) => void;
  panelRef?: Ref<HTMLDivElement>;
}

/** Light accents (cyan, mint) need dark text on the primary action. */
function isLight(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150;
}

export function UniversePreview({
  project: p,
  open,
  variant,
  id,
  titleId,
  thumbFailed,
  onThumbError,
  onClose,
  onSwipe,
  panelRef,
}: UniversePreviewProps) {
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) onSwipe(dx < 0 ? 1 : -1);
  };

  const style = { "--accent": p.accent, "--accent-2": p.accent2 } as CSSProperties;

  return (
    <div
      ref={panelRef}
      id={id}
      role="region"
      aria-labelledby={titleId}
      aria-hidden={!open}
      inert={!open}
      style={style}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipe.current = null;
      }}
      className={cn(
        "touch-pan-y",
        variant === "overlay"
          ? cn(
              "absolute right-(--gutter) top-1/2 z-40 w-[min(25rem,calc(100%-2*var(--gutter)))] -translate-y-1/2 transition-[opacity,translate] duration-700 ease-out-expo",
              open ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-10 opacity-0",
            )
          : cn(
              "transition-[opacity,translate] duration-700 ease-out-expo starting:translate-y-4 starting:opacity-0",
              !open && "hidden",
            ),
      )}
    >
      <div>
        <article
          className={cn(
            "relative overflow-hidden rounded-xl border border-line-strong bg-[linear-gradient(160deg,color-mix(in_oklab,var(--accent)_14%,var(--panel))_0%,color-mix(in_oklab,var(--panel)_92%,transparent)_45%,rgba(7,9,20,0.92)_100%)] shadow-[0_40px_120px_-40px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
            variant === "inline" && "mx-auto max-w-xl sm:grid sm:max-w-4xl sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉作品預覽"
            className="absolute right-3 top-3 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-void/70 text-ink transition-colors hover:border-(--accent) hover:bg-void/90"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
          </button>

          {/* accent edge light */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),var(--accent-2),transparent)]"
          />

          <div className={cn("relative overflow-hidden border-b border-line bg-night", variant === "inline" ? "aspect-[2/1] sm:aspect-auto sm:h-full sm:min-h-64 sm:border-b-0 sm:border-r" : "aspect-[16/9]")}>
            {thumbFailed ? (
              <div
                role="img"
                aria-label={`${p.title} 作品縮圖（媒體尚未提供）`}
                className="flex size-full items-center justify-center bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_70%)]"
              >
                <span className="eyebrow">Media coming soon</span>
              </div>
            ) : (
              <Image
                key={p.slug}
                src={p.thumbnail}
                alt={`${p.title} 作品縮圖`}
                fill
                sizes="(min-width: 1200px) 400px, (min-width: 640px) 576px, 100vw"
                className="object-cover"
                onError={() => onThumbError(p.slug)}
              />
            )}
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,9,20,0.75))]" />
            {p.isPlaceholder && <PlaceholderBadge className="absolute left-3 top-3 bg-void/85" />}
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-7">
            <p className="flex items-center gap-3 pr-12 font-display text-xs uppercase tracking-[0.24em] text-ink-mute">
              <span className="text-accent">{p.number}</span>
              <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
              <span>
                {p.category}
                {p.categoryEn && <span className="ml-2 text-ink-mute">{p.categoryEn}</span>}
              </span>
            </p>
            <div>
              <h3 id={titleId} className="font-display text-2xl font-medium leading-tight text-ink sm:text-[1.75rem]">
                {p.title}
              </h3>
              {p.subtitle && <p className="mt-1 font-display text-sm tracking-wide text-ink-soft">{p.subtitle}</p>}
            </div>
            <p className="text-sm text-ink-mute">
              <span className="eyebrow mr-2 text-[0.625rem]">Developer</span>
              <span className="text-ink-soft">{p.developer}</span>
            </p>
            <p lang="zh-Hant" className="text-base leading-relaxed text-ink-soft">
              {p.summary}
            </p>
            {p.technologies.length > 0 && (
              <ul aria-label="使用技術" className="flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-1">
              <ButtonLink
                href={`/projects/${p.slug}`}
                className={cn("w-full sm:w-auto", isLight(p.accent) && "text-void! hover:text-void!")}
              >
                查看作品詳情
                <ArrowIcon className="group-hover:translate-x-1" />
              </ButtonLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
