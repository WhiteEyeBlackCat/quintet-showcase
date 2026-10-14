import type { CSSProperties } from "react";
import type { Project, ProjectMedia } from "@/types/content";

/** Cover image of a project as a ProjectMedia (for MediaFrame). */
export function coverMedia(p: Project): ProjectMedia {
  return {
    type: "image",
    src: p.thumbnail,
    alt: `${p.title}${p.subtitle ? `（${p.subtitle}）` : ""}作品封面`,
    width: 1600,
    height: 1000,
    placeholder: p.isPlaceholder,
    position: p.mediaPosition,
  };
}

/** Per-project accent colours as CSS variables. */
export function accentStyle(p: Project): CSSProperties {
  return {
    ...(p.accentColor ? { "--accent": p.accentColor } : {}),
    ...(p.accentColorSecondary ? { "--accent-2": p.accentColorSecondary } : {}),
  } as CSSProperties;
}
