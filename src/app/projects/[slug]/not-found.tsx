import { ButtonLink, ArrowIcon } from "@/components/ui/Button";

export default function ProjectNotFound() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden pt-[var(--header-h)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--violet) 35%, transparent), transparent)" }}
      />
      <div className="container-x relative flex flex-col items-start gap-8 py-24">
        <p className="eyebrow">404 · PROJECT NOT FOUND</p>
        <h1 className="text-display-gradient font-display text-5xl font-medium leading-[1.1] sm:text-7xl">找不到這個專案</h1>
        <p className="max-w-lg text-base leading-[1.8] text-ink-soft sm:text-lg">
          這個展間似乎不存在，或是網址有誤。回到作品列表，繼續探索其他專案。
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/projects">
            <ArrowIcon direction="left" />
            返回作品列表
          </ButtonLink>
          <ButtonLink href="/" variant="ghost">
            回到首頁
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
