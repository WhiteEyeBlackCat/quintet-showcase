import type { MetadataRoute } from "next";

// The exhibition is shared by link only — ask crawlers not to index it.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
