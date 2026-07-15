import type { Metadata } from "next";
import { siteConfig, type PageSeo } from "@/config/site";

export function createPageMetadata(page: PageSeo): Metadata {
  const socialTitle = page.path === "/" ? page.title : `${page.title} | ${siteConfig.name}`;

  return {
    title: page.path === "/" ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: page.path,
      siteName: siteConfig.siteTitle,
      title: socialTitle,
      description: page.description,
      images: [
        {
          url: page.image,
          width: 1200,
          height: 630,
          alt: page.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: page.description,
      images: [page.image],
    },
  };
}
