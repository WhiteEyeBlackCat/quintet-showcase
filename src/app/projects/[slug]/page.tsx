import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProjectBySlug } from "@/data/projects";
import { ProjectDetail } from "@/components/projects/detail/ProjectDetail";
import { DetailSkeleton } from "@/components/projects/detail/DetailSkeleton";

// Next 16.4: `params` must be read inside <Suspense>, even with generateStaticParams.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "找不到專案" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: `${project.title}${project.subtitle ? ` · ${project.subtitle}` : ""}`, description: project.summary, images: [project.thumbnail] },
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
