import { program } from "@/data/program";
import { Reveal } from "@/components/animations/Reveal";
import { RevealHeading } from "@/components/animations/RevealHeading";
import { ClosingActions } from "./closing/ClosingActions";
import { ClosingOrbits } from "./closing/ClosingOrbits";

/** Final chapter of the exhibition. */
export function ClosingSection() {
  const { heading, paragraphs } = program.closing;
  return (
    <section
      id="closing"
      aria-label={heading.join(" ")}
      className="relative isolate flex min-h-[90svh] items-center overflow-hidden py-28 md:py-40"
    >
      <ClosingOrbits />
      <div className="container-x relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal as="p" className="eyebrow mb-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            <span>LOOKING FORWARD</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          </Reveal>
          <RevealHeading
            as="h2"
            lines={heading}
            lineClassName="text-display-gradient"
            className="font-display text-[1.65rem] font-medium leading-[1.15] tracking-tight min-[26rem]:text-3xl sm:text-5xl lg:text-6xl"
          />
          <Reveal stagger className="mt-10 flex max-w-[34rem] flex-col gap-4 text-base leading-[1.85] text-ink-soft sm:text-lg">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <Reveal className="mt-12">
            <ClosingActions />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
