import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${settings.productionSiteUrl}/sitemap.xml`,
    host: settings.productionSiteUrl,
  };
}
