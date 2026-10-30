import Link from "next/link";
import { projects, formatProjectNumber } from "@/data/projects";
import { BrandMark } from "./BrandMark";
import { NAV_ITEMS } from "./nav";
import { counts, tagline, zh } from "@/data/program";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-void">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-7" />
            <span className="font-display font-medium tracking-[0.18em]">QUINTET</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-mute">
            {zh(counts.members)}位成員、{zh(counts.projects)}個作品，一段與 AI 共同創作的開發旅程。標示 PLACEHOLDER 的內容為虛構範例，待實際專案資料提供後替換。
          </p>
        </div>
        <nav aria-label="頁尾導覽">
          <p className="eyebrow mb-4">Navigate</p>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft transition-colors hover:text-ink">
                  {item.label} <span className="text-ink-mute">· {item.zh}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="作品列表">
          <p className="eyebrow mb-4">Projects</p>
          <ul className="flex flex-col gap-2 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="text-ink-soft transition-colors hover:text-ink">
                  <span className="mr-2 font-display text-ink-mute">{formatProjectNumber(p.number)}</span>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-line py-6 text-xs text-ink-mute sm:flex-row">
        <p>© QUINTET · {zh(counts.members)}位創作者 × AI 的實作展 · Built with Claude Code</p>
        <p className="font-display tracking-[0.2em]">{tagline}</p>
      </div>
    </footer>
  );
}
