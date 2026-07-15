import type { Metadata } from "next";
import { pageSeo, siteOwnerName, type PageSeoInput } from "@/config/site";
import { siteSettingsFallback } from "@/config/site-fallback";
import type { SiteSettings } from "@/types/site-settings";

export function createPageMetadata(
  page: PageSeoInput,
  settings: SiteSettings = siteSettingsFallback,
): Metadata {
  const title = page.title?.trim() || settings.defaultSeoTitle;
  const description =
    page.description?.trim() || settings.defaultSeoDescription;
  const image = page.image || settings.defaultOpenGraphImage.url;
  const imageAlt = page.imageAlt?.trim() || pageSeo.home.imageAlt;
  const socialTitle = page.path === "/" ? title : `${title} | ${siteOwnerName}`;

  return {
    title: page.path === "/" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: page.path,
      siteName: settings.siteTitle,
      title: socialTitle,
      description,
      images: [
        {
          url: image,
          width:
            image === settings.defaultOpenGraphImage.url
              ? settings.defaultOpenGraphImage.width
              : 1200,
          height:
            image === settings.defaultOpenGraphImage.url
              ? settings.defaultOpenGraphImage.height
              : 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
