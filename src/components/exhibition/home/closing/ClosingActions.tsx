"use client";

import { Button, ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/lib/motion";

type LenisLike = { scrollTo: (target: number, opts?: { immediate?: boolean }) => void };

function backToTop() {
  const reduced = prefersReducedMotion();
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) lenis.scrollTo(0, { immediate: reduced });
  else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  document.getElementById("main")?.focus({ preventScroll: true });
}

/** Three closing actions: return to the universe, browse all works, back to top. */
export function ClosingActions() {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
      <ButtonLink href="/#universe" variant="primary" magnetic>
        返回專案宇宙
        <ArrowIcon direction="up-right" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </ButtonLink>
      <ButtonLink href="/projects" variant="ghost" magnetic>
        瀏覽所有作品
        <ArrowIcon className="group-hover:translate-x-0.5" />
      </ButtonLink>
      <Button variant="quiet" onClick={backToTop}>
        回到頂端
        <ArrowIcon direction="up" />
      </Button>
    </div>
  );
}
