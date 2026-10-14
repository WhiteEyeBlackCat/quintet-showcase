"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ButtonLink } from "@/components/ui/Button";
import { BrandMark } from "./BrandMark";
import { NAV_ITEMS } from "./nav";


export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and lock body scroll while open.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled || open ? "border-b border-line bg-void/90" : "border-b border-transparent",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="QUINTET 首頁">
          <BrandMark className="size-7" />
          <span className="font-display text-[0.95rem] font-medium tracking-[0.18em] text-ink">QUINTET</span>
        </Link>

        <nav aria-label="主要導覽" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative whitespace-nowrap rounded-md px-3.5 py-2 font-display text-sm tracking-wide transition-colors duration-300",
                    isActive(item.href) ? "text-ink" : "text-ink-mute hover:text-ink",
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span aria-hidden="true" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/#universe" variant="primary" magnetic className="hidden px-5 py-2.5 text-xs sm:inline-flex">
            Let&apos;s Explore
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "關閉選單" : "開啟選單"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span className={cn("absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300", open && "translate-y-1.5 rotate-45")} />
              <span className={cn("absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-300", open && "-translate-y-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-nav"
        data-lenis-prevent=""
        aria-label="行動版導覽"
        hidden={!open}
        className="h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-line bg-void/95 lg:hidden"
      >
        <ul className="container-x flex flex-col py-8">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-baseline justify-between py-5"
              >
                <span className="font-display text-3xl font-medium text-ink">{item.label}</span>
                <span className="text-sm text-ink-mute">
                  <span className="mr-3 font-display text-accent">0{i + 1}</span>
                  {item.zh}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
