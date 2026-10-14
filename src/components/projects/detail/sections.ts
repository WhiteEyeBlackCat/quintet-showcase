import type { Project } from "@/types/content";

export interface DetailSection {
  id: string;
  label: string;
  labelZh: string;
}

/** Sections available for a project, in page order (drives the rail). */
export function getDetailSections(p: Project): DetailSection[] {
  const list: DetailSection[] = [{ id: "overview", label: "Overview", labelZh: "專案概覽" }];
  if (p.features.length > 0) list.push({ id: "features", label: "Features", labelZh: "核心功能" });
  if ((p.techStack && p.techStack.length > 0) || p.architecture) list.push({ id: "tech", label: "Tech", labelZh: "技術架構" });
  if (p.developmentStages && p.developmentStages.length > 0) list.push({ id: "journey", label: "Journey", labelZh: "開發歷程" });
  if (p.challenges && p.challenges.length > 0) list.push({ id: "challenges", label: "Challenges", labelZh: "挑戰與解法" });
  if ((p.results && p.results.length > 0) || (p.gallery && p.gallery.length > 0)) list.push({ id: "results", label: "Results", labelZh: "成果" });
  return list;
}

export interface LinkItem {
  key: "github" | "demo" | "documentation" | "video";
  label: string;
  href: string;
}

/** Only links that actually have a URL. */
export function getProjectLinks(p: Project): LinkItem[] {
  const l = p.links ?? {};
  const out: LinkItem[] = [];
  if (l.video) out.push({ key: "video", label: "觀看影片", href: l.video });
  if (l.demo) out.push({ key: "demo", label: "線上展示", href: l.demo });
  if (l.github) out.push({ key: "github", label: "GitHub", href: l.github });
  if (l.documentation) out.push({ key: "documentation", label: "技術文件", href: l.documentation });
  return out;
}
