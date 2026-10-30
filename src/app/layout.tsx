import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { introGuardScript } from "@/components/exhibition/intro/guard";
import { counts, tagline, zh } from "@/data/program";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


// Absolute base for Open Graph URLs. Set NEXT_PUBLIC_SITE_URL in production; Vercel's URL is used automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Shared by link only: keep the exhibition out of search engines.
  robots: { index: false, follow: false },
  title: {
    default: `QUINTET — ${zh(counts.members)}位創作者 × AI 的實作展`,
    template: "%s · QUINTET",
  },
  description: `QUINTET 五重奏：${zh(counts.members)}位成員，${zh(counts.projects)}個獨立創意專案。透過 Claude Code 與 AI 輔助開發，將創意構想轉化為實際作品。${tagline} ONE AI-POWERED JOURNEY.`,
};

export const viewport: Viewport = {
  themeColor: "#04050b",
  colorScheme: "dark",
};

// Marks the document as JS + motion capable before paint, so reveal
// elements start hidden only when they will actually be animated in.
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript + introGuardScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-ink px-4 py-2 text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          跳至主要內容
        </a>
        <SmoothScroll />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
