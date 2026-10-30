import type { Project } from "@/types/content";
import { project01 } from "./project-01";
import { project02 } from "./project-02";
import { project03 } from "./project-03";
import { project04 } from "./project-04";
import { project05 } from "./project-05";
import { project06 } from "./project-06";

/** All projects, ordered by `number`. */
export const projects: Project[] = [project01, project02, project03, project04, project05, project06].sort(
  (a, b) => a.number - b.number,
);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Next project, wrapping around to the first. */
export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export function getPrevProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i - 1 + projects.length) % projects.length];
}

export function formatProjectNumber(n: number): string {
  return String(n).padStart(2, "0");
}
