"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/types/content";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader, PlaceholderBadge } from "@/components/ui/primitives";
import { MediaFrame } from "@/components/media/MediaFrame";
import { cn } from "@/lib/utils/cn";

type LenisLike = { stop: () => void; start: () => void };
const getLenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export function ResultsSection({ project }: { project: Project }) {
  const results = project.results ?? [];
  const gallery = project.gallery ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => dialog.current?.close(), []);

  // Native <dialog>: modal focus trap, Esc to close, focus restored to the opener.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open === null) return;
    if (!d.open) d.showModal();
    getLenis()?.stop();
    return () => getLenis()?.start();
  }, [open]);

  const step = (dir: 1 | -1) => setOpen((o) => (o === null ? o : (o + dir + gallery.length) % gallery.length));
  const current = open !== null ? gallery[open] : null;

  return (
    <section id="results" aria-labelledby="results-title" className="scroll-mt-10 bg-midnight/60 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader id="results-title" index="06" eyebrow="RESULTS" title="成果" />
        {project.isPlaceholder && <PlaceholderBadge className="mt-6" />}

        {results.length > 0 && (
          <Reveal as="ul" stagger y={22} className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2 lg:mt-20">
            {results.map((r) => (
              <li key={r.label} className="flex flex-col gap-4 bg-night p-8 md:p-10">
                {r.value && <p className="text-display-gradient font-display text-5xl font-medium leading-none">{r.value}</p>}
                <h3 className={cn("font-display text-ink", r.value ? "text-lg" : "text-2xl")}>{r.label}</h3>
                <p className="text-base leading-[1.8] text-ink-soft">{r.description}</p>
              </li>
            ))}
          </Reveal>
        )}

        {gallery.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-2xl text-ink">畫面集 <span className="eyebrow ml-2">Gallery</span></h3>
              {project.isPlaceholder && <PlaceholderBadge />}
            </div>
            <Reveal as="ul" stagger y={22} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((m, i) => (
                <li key={m.src}>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-label={`放大檢視：${m.alt}`}
                    className="group relative block w-full cursor-zoom-in rounded-xl text-left"
                  >
                    <div className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                      <MediaFrame media={m} aspect="aspect-[16/10]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                    </div>
                  </button>
                </li>
              ))}
            </Reveal>
          </div>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-label="畫面檢視"
        onClose={() => {
          setOpen(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-[92dvh] w-[min(94vw,76rem)] max-w-none overflow-visible bg-transparent p-0 text-ink backdrop:bg-void/90 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div className="flex flex-col gap-4">
            <MediaFrame media={current} chrome priority sizes="94vw" showCaption />
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-sm tracking-[0.2em] text-ink-soft" aria-live="polite">
                <span className="text-accent">{String((open ?? 0) + 1).padStart(2, "0")}</span> / {String(gallery.length).padStart(2, "0")}
              </p>
              <div className="flex items-center gap-2">
                {gallery.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="上一張" className="min-h-11 min-w-11 cursor-pointer rounded-full border border-line-strong bg-void/70 px-4 text-sm hover:border-accent">
                      ←
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label="下一張" className="min-h-11 min-w-11 cursor-pointer rounded-full border border-line-strong bg-void/70 px-4 text-sm hover:border-accent">
                      →
                    </button>
                  </>
                )}
                <button type="button" onClick={close} autoFocus className="min-h-11 cursor-pointer rounded-full border border-line-strong bg-void/70 px-5 text-sm hover:border-accent">
                  關閉
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
