import type { Metadata } from "next";
import { pageSeo, siteConfig, type PageSeoInput } from "@/config/site";

export function createPageMetadata(page: PageSeoInput): Metadata {
  const title = page.title?.trim() || siteConfig.siteTitle;
  const description = page.description?.trim() || siteConfig.description;
  const image = page.image || pageSeo.home.image;
  const imageAlt = page.imageAlt?.trim() || pageSeo.home.imageAlt;
  const socialTitle = page.path === "/" ? title : `${title} | ${siteConfig.name}`;

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
      siteName: siteConfig.siteTitle,
      title: socialTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
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
