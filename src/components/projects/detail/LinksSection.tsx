import { Reveal } from "@/components/animations/Reveal";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/primitives";
import type { LinkItem } from "./sections";

/** External project links. Renders nothing when there are none. */
export function LinksSection({ links }: { links: LinkItem[] }) {
  if (links.length === 0) return null;
  return (
    <section id="links" aria-labelledby="links-title" className="scroll-mt-10 py-20 md:py-28">
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <SectionHeader id="links-title" eyebrow="LINKS" title="相關連結" />
        <Reveal className="flex flex-wrap gap-3">
          {links.map((l, i) => (
            <ButtonLink key={l.key} href={l.href} external variant={i === 0 ? "primary" : "ghost"}>
              {l.label}
              <ArrowIcon direction="up-right" />
            </ButtonLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
