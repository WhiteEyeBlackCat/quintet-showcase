"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/types/content";
import { cn } from "@/lib/utils/cn";
import { PlaceholderBadge } from "@/components/ui/primitives";

interface MediaFrameProps {
  media: ProjectMedia;
  className?: string;
  /** Tailwind aspect class; defaults to 16/10. */
  aspect?: string;
  /** Load eagerly (above the fold). */
  priority?: boolean;
  sizes?: string;
  /** Show the placeholder badge when media.placeholder is true. */
  showBadge?: boolean;
  /** Browser-like chrome bar on top of the media. */
  chrome?: boolean;
  /** Optional caption below. */
  showCaption?: boolean;
}

/**
 * Presents a screenshot or video inside a consistent frame.
 * - Images use next/image (SVG placeholders are served unoptimized automatically).
 * - Videos lazy-load when near the viewport, show a poster, and never autoplay with sound.
 * - Missing / broken assets fall back to a styled empty state instead of a broken icon.
 */
export function MediaFrame({
  media,
  className,
  aspect = "aspect-[16/10]",
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  showBadge = true,
  chrome = false,
  showCaption = false,
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-line-strong bg-panel shadow-[0_40px_120px_-40px_color-mix(in_oklab,var(--accent)_45%,transparent)]",
          aspect,
        )}
      >
        {chrome && (
          <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 flex h-7 items-center gap-1.5 border-b border-line bg-void/70 px-3">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
          </div>
        )}
        <div className={cn("absolute inset-0", chrome && "top-7")}>
          {failed ? (
            <MediaFallback alt={media.alt} />
          ) : media.type === "video" ? (
            <LazyVideo media={media} onError={() => setFailed(true)} />
          ) : (
            <FrameImage key={media.src} media={media} sizes={sizes} priority={priority} onError={() => setFailed(true)} />
          )}
        </div>
        {showBadge && media.placeholder && <PlaceholderBadge className="absolute bottom-3 left-3 z-10 bg-void/85" />}
      </div>
      {showCaption && media.caption && (
        <figcaption className="mt-3 text-sm text-ink-mute">{media.caption}</figcaption>
      )}
    </figure>
  );
}

/** Image with a loading skeleton, so a slow connection never shows an empty frame. */
function FrameImage({ media, sizes, priority, onError }: { media: ProjectMedia; sizes: string; priority: boolean; onError: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_70%)]" />
          <span className="relative flex items-center gap-3 font-display text-xs tracking-[0.28em] text-ink-mute">
            <span className="size-4 animate-spin rounded-full border border-line-strong border-t-accent" />
            LOADING
          </span>
        </div>
      )}
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        preload={priority}
        loading={priority ? "eager" : undefined}
        className={cn(
          "object-cover transition-opacity duration-500",
          media.position === "top" && "object-top",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={onError}
      />
    </>
  );
}

function LazyVideo({ media, onError }: { media: ProjectMedia; onError: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="size-full object-cover"
      poster={media.poster}
      controls
      muted
      playsInline
      preload="none"
      aria-label={media.alt}
      onError={onError}
    >
      {visible && <source src={media.src} onError={onError} />}
    </video>
  );
}

function MediaFallback({ alt }: { alt: string }) {
  return (
    <div
      role="img"
      aria-label={`${alt}（媒體尚未提供）`}
      className="flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)]"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m3 16 5-5 4 4 3-3 6 6" />
        <circle cx="16" cy="9" r="1.5" />
      </svg>
      <span className="eyebrow">Media coming soon</span>
    </div>
  );
}
