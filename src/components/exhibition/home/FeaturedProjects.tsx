import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/ui/primitives";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { FeaturedPanel } from "@/components/projects/gallery/FeaturedPanel";

/** Homepage gallery: five alternating editorial panels. */
export function FeaturedProjects() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative overflow-hidden bg-night py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="container-x">
        <Reveal>
          <SectionHeader
            id="gallery-title"
            index="03"
            eyebrow="Selected Works"
            title="五件作品，五種探索"
            description="每件作品都由一位成員獨立完成，以 Claude Code 協助開發。"
          />
        </Reveal>

        <div className="mt-20 flex flex-col gap-28 md:mt-28 md:gap-40">
          {projects.map((p, i) => (
            <FeaturedPanel key={p.slug} project={p} flip={i % 2 === 1} priority={false} />
          ))}
        </div>

        <Reveal className="mt-24 flex justify-center md:mt-32">
          <ButtonLink href="/projects" variant="ghost" magnetic>
            瀏覽全部作品 / View All
            <ArrowIcon className="group-hover:translate-x-0.5" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
