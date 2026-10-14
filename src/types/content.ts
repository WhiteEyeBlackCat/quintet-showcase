/**
 * Content schema for the exhibition.
 * All five projects share the `Project` interface. Optional fields render
 * their section only when data exists — leave them out instead of filling
 * them with fake values.
 */

export type MediaType = "image" | "video";

export interface ProjectMedia {
  type: MediaType;
  /** Path under /public, e.g. "/projects/project-01/screenshot-01.webp" */
  src: string;
  /** Poster image for videos (required for good lazy-loading UX). */
  poster?: string;
  alt: string;
  caption?: string;
  /** Intrinsic size, used to reserve space and avoid layout shift. */
  width?: number;
  height?: number;
  /** True while the asset is an illustrative placeholder, not a real screenshot. */
  placeholder?: boolean;
  /** Crop anchor when the frame's aspect differs from the asset. "top" suits UI screenshots. */
  position?: "center" | "top";
}

export interface ProjectFeature {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  highlights?: string[];
  media?: ProjectMedia;
}

export type DevelopmentStageKey =
  | "idea"
  | "prototype"
  | "build"
  | "debug"
  | "final";

export interface DevelopmentStage {
  key: DevelopmentStageKey;
  /** English label, e.g. "PROTOTYPE" */
  label: string;
  /** Traditional Chinese title */
  title: string;
  description: string;
  /** How Claude Code assisted in this stage. */
  claudeAssist?: string;
  media?: ProjectMedia;
}

export interface ProjectChallenge {
  title: string;
  problem: string;
  approach: string;
  lesson?: string;
}

export interface ProjectResult {
  /** Short label, e.g. "核心功能" */
  label: string;
  /** Optional value. Only use verified numbers — never invent metrics. */
  value?: string;
  description: string;
}

export interface TechGroup {
  /** e.g. "語言", "框架", "AI 模型", "開發工具", "函式庫" */
  group: string;
  groupEn?: string;
  items: string[];
}

export interface ArchitectureLayer {
  name: string;
  description: string;
  items?: string[];
}

export interface ProjectArchitecture {
  summary: string;
  layers: ArchitectureLayer[];
  diagram?: ProjectMedia;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  documentation?: string;
  video?: string;
}

export interface Project {
  id: string;
  slug: string;
  number: number;

  title: string;
  /** English title, used as subtitle / visual hierarchy. */
  subtitle?: string;

  category: string;
  categoryEn?: string;

  developer: string;
  /** Matches TeamMember.id */
  developerId?: string;

  /** One-sentence summary. */
  summary: string;
  /** Why it was created. */
  motivation?: string;
  /** Who it is for. */
  audience?: string;
  /** What problem it addresses. */
  problem?: string;
  /** What the project does. */
  description: string;

  thumbnail: string;
  heroImage: string;
  /** Crop anchor for thumbnail / heroImage (see ProjectMedia.position). */
  mediaPosition?: "center" | "top";
  heroVideo?: ProjectMedia;

  /** Primary accent, any CSS color. */
  accentColor?: string;
  /** Secondary accent for gradients. */
  accentColorSecondary?: string;

  technologies: string[];
  techStack?: TechGroup[];
  architecture?: ProjectArchitecture;

  features: ProjectFeature[];
  developmentStages?: DevelopmentStage[];
  challenges?: ProjectChallenge[];
  results?: ProjectResult[];
  gallery?: ProjectMedia[];

  links?: ProjectLinks;

  /** True while this entry is fictional sample content. */
  isPlaceholder: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  /** Matches Project.slug */
  projectSlug: string;
  avatar?: string;
  bio: string;
  github?: string;
  isPlaceholder: boolean;
}

export interface ProgramStat {
  value: string;
  label: string;
  labelEn?: string;
}

export interface ProgramStage {
  number: string;
  label: string;
  title: string;
  description: string;
}

export interface ProgramPillar {
  title: string;
  titleEn: string;
  description: string;
}

export interface ProgramInfo {
  name: string;
  title: [string, string];
  tagline: string;
  description: string[];
  stats: ProgramStat[];
  mission: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    chapters: { label: string; title: string; description: string }[];
  };
  journey: ProgramStage[];
  facts: ProgramStat[];
  pillars: ProgramPillar[];
  closing: {
    heading: [string, string];
    paragraphs: string[];
  };
}
