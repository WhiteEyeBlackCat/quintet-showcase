import type { Metadata } from "next";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";

export const metadata: Metadata = { title: "找不到頁面" };

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-dvh items-center overflow-hidden bg-void">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--violet)_22%,transparent),transparent_65%)]"
      />
      <div className="container-x relative z-10 flex flex-col items-center gap-6 py-40 text-center">
        <p className="eyebrow">Error 404 · Lost in space</p>
        <h1 className="font-display text-6xl font-medium text-display-gradient sm:text-8xl">404</h1>
        <p className="max-w-md text-ink-soft">這個展間不存在，或許它還在建造中。回到作品宇宙，繼續探索五件作品。</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/#universe" magnetic>
            返回專案宇宙 <ArrowIcon />
          </ButtonLink>
          <ButtonLink href="/projects" variant="ghost">
            瀏覽所有作品
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
