import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import { sanityImageBuilder } from "@/sanity/image";
import type { SanitySeoQueryResult } from "@/sanity/queries/seo";
import { emptyPageSeo, type PageSeoContent } from "@/types/page-seo";

function trimmedString(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function validHttpUrl(value: string | null | undefined): string | null {
  const candidate = trimmedString(value);
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function normalizePageSeo(
  value: SanitySeoQueryResult | null | undefined,
): PageSeoContent {
  if (!value) return emptyPageSeo;

  const image = value.openGraphImage;
  const assetUrl = validHttpUrl(image?.asset?.url);
  let imageUrl: string | null = null;

  if (image?.asset?._id && assetUrl) {
    imageUrl = assetUrl;

    if (sanityImageBuilder) {
      try {
        imageUrl = sanityImageBuilder
          .image(image as SanityImageSource)
          .width(1200)
          .height(630)
          .fit("crop")
          .auto("format")
          .url();
      } catch {
        imageUrl = assetUrl;
      }
    }
  }

  return {
    title: trimmedString(value.title),
    description: trimmedString(value.description),
    openGraphImage: imageUrl
      ? { url: imageUrl, width: 1200, height: 630 }
      : null,
  };
}
