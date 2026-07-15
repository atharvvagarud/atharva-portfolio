import type { MetadataRoute } from "next";
import { pageSeo, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [pageSeo.home, pageSeo.projects, pageSeo.photography, pageSeo.about];

  return pages.map((page) => ({
    url: new URL(page.path, siteConfig.siteUrl).toString(),
    changeFrequency: page.path === "/" ? "monthly" : "yearly",
    priority: page.path === "/" ? 1 : 0.8,
  }));
}
