import type { MetadataRoute } from "next";
import { pageSeo } from "@/config/site";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const pages = [pageSeo.home, pageSeo.projects, pageSeo.photography, pageSeo.about];

  return pages.map((page) => ({
    url: new URL(page.path, settings.productionSiteUrl).toString(),
    changeFrequency: page.path === "/" ? "monthly" : "yearly",
    priority: page.path === "/" ? 1 : 0.8,
  }));
}
