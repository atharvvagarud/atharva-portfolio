import "server-only";

import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { cache } from "react";
import { aboutFallback } from "@/data/about";
import { sanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityImageBuilder } from "@/sanity/image";
import { normalizePageSeo } from "@/sanity/lib/normalize-page-seo";
import {
  aboutQuery,
  type AboutQueryResult,
} from "@/sanity/queries/about";
import type {
  AboutContent,
  AboutCurrentFocusEntry,
  AboutEducationEntry,
  AboutPortrait,
} from "@/types/about";

export const ABOUT_REVALIDATE_SECONDS = 3600;
export const ABOUT_CACHE_TAG = "sanity:aboutPage";

type NormalizedAbout = {
  readonly content: AboutContent;
  readonly fallbackReasons: readonly string[];
};

function valueOrNull(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function validHttpUrl(value: string | null | undefined): string | null {
  const candidate = valueOrNull(value);
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

function normalizeBiography(
  blocks: AboutQueryResult["biography"],
): readonly PortableTextBlock[] {
  return (blocks || []).flatMap((block, blockIndex) => {
    if (!block || block._type !== "block") return [];

    const children = (block.children || []).flatMap((child, childIndex) => {
      if (!child || child._type !== "span" || typeof child.text !== "string") {
        return [];
      }

      return [
        {
          _key: valueOrNull(child._key) || `about-span-${blockIndex}-${childIndex}`,
          _type: "span" as const,
          text: child.text,
          marks: [],
        },
      ];
    });

    if (!children.some((child) => child.text.trim())) return [];

    return [
      {
        _key: valueOrNull(block._key) || `about-block-${blockIndex}`,
        _type: "block" as const,
        style: "normal",
        markDefs: [],
        children,
      },
    ];
  });
}

function croppedImageDimensions(
  image: AboutQueryResult["portraitImage"],
): { width: number; height: number } | null {
  const dimensions = image?.asset?.metadata?.dimensions;
  const sourceWidth = dimensions?.width;
  const sourceHeight = dimensions?.height;

  if (
    typeof sourceWidth !== "number" ||
    sourceWidth <= 0 ||
    typeof sourceHeight !== "number" ||
    sourceHeight <= 0
  ) {
    return null;
  }

  const visibleWidth =
    sourceWidth * (1 - (image?.crop?.left || 0) - (image?.crop?.right || 0));
  const visibleHeight =
    sourceHeight * (1 - (image?.crop?.top || 0) - (image?.crop?.bottom || 0));

  if (visibleWidth <= 0 || visibleHeight <= 0) return null;

  const width = Math.min(1200, Math.round(visibleWidth));
  return {
    width,
    height: Math.max(1, Math.round(width / (visibleWidth / visibleHeight))),
  };
}

function normalizePortrait(value: AboutQueryResult): AboutPortrait | null {
  const image = value.portraitImage;
  const assetUrl = validHttpUrl(image?.asset?.url);
  const dimensions = croppedImageDimensions(image);

  if (!image?.asset?._id || !assetUrl || !dimensions) return null;

  let url = assetUrl;

  if (sanityImageBuilder) {
    try {
      url = sanityImageBuilder
        .image(image as SanityImageSource)
        .width(dimensions.width)
        .auto("format")
        .url();
    } catch {
      url = assetUrl;
    }
  }

  return {
    url,
    width: dimensions.width,
    height: dimensions.height,
    alt: valueOrNull(value.portraitAltText) || aboutFallback.portrait.alt,
  };
}

function normalizeEducation(
  entries: AboutQueryResult["educationEntries"],
): readonly AboutEducationEntry[] {
  return (entries || []).flatMap((entry) => {
    const qualification = valueOrNull(entry?.qualification);
    const institution = valueOrNull(entry?.institution);
    const year = entry?.year;

    if (
      !qualification ||
      !institution ||
      typeof year !== "number" ||
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100
    ) {
      return [];
    }

    return [
      {
        qualification,
        institution,
        result: valueOrNull(entry?.result) || "",
        year: String(year),
      },
    ];
  });
}

function normalizeStringList(
  values: Array<string | null> | null | undefined,
): readonly string[] {
  const seen = new Set<string>();

  return (values || []).flatMap((value) => {
    const normalized = valueOrNull(value);
    const key = normalized?.toLocaleLowerCase("en-GB");
    if (!normalized || !key || seen.has(key)) return [];
    seen.add(key);
    return [normalized];
  });
}

function normalizeCurrentFocus(
  entries: AboutQueryResult["currentFocusEntries"],
): readonly AboutCurrentFocusEntry[] {
  return (entries || []).flatMap((entry) => {
    const title = valueOrNull(entry?.title);
    if (!title) return [];

    return [
      {
        title,
        description: valueOrNull(entry?.description),
      },
    ];
  });
}

function hasRequiredHeadings(value: AboutQueryResult): boolean {
  return Boolean(valueOrNull(value.sectionLabel) && valueOrNull(value.mainHeading));
}

function normalizeAbout(value: AboutQueryResult): NormalizedAbout {
  const fallbackReasons: string[] = [];
  const biography = normalizeBiography(value.biography);
  const portrait = normalizePortrait(value);
  const education = normalizeEducation(value.educationEntries);
  const areasIBuild = normalizeStringList(value.areasIBuild);
  const capabilities = normalizeStringList(value.capabilities);
  const currentFocus = normalizeCurrentFocus(value.currentFocusEntries);

  if (!valueOrNull(value.introduction)) fallbackReasons.push("introduction");
  if (!portrait) fallbackReasons.push("portrait");
  if (biography.length === 0) fallbackReasons.push("biography");
  if (education.length === 0) fallbackReasons.push("education");
  if (areasIBuild.length === 0) fallbackReasons.push("areas-i-build");
  if (capabilities.length === 0) fallbackReasons.push("capabilities");
  if (currentFocus.length === 0) fallbackReasons.push("current-focus");
  if (!valueOrNull(value.availabilityText)) fallbackReasons.push("availability");
  if (!valueOrNull(value.cvCallToActionLabel)) fallbackReasons.push("cv-label");

  return {
    content: {
      sectionLabel: value.sectionLabel!.trim(),
      mainHeading: value.mainHeading!.trim(),
      introduction: valueOrNull(value.introduction) || aboutFallback.introduction,
      portrait: portrait || aboutFallback.portrait,
      biography:
        biography.length > 0 ? biography : aboutFallback.biography,
      education:
        education.length > 0 ? education : aboutFallback.education,
      areasIBuild:
        areasIBuild.length > 0 ? areasIBuild : aboutFallback.areasIBuild,
      capabilities:
        capabilities.length > 0 ? capabilities : aboutFallback.capabilities,
      currentFocus:
        currentFocus.length > 0 ? currentFocus : aboutFallback.currentFocus,
      availabilityText:
        valueOrNull(value.availabilityText) || aboutFallback.availabilityText,
      cvCtaLabel:
        valueOrNull(value.cvCallToActionLabel) || aboutFallback.cvCtaLabel,
      seo: normalizePageSeo(value.seo),
    },
    fallbackReasons,
  };
}

function logAboutDiagnostic({
  queryRan,
  singletonFound,
  fallbackUsed,
  reason,
}: {
  queryRan: boolean;
  singletonFound: boolean;
  fallbackUsed: boolean;
  reason: string;
}): void {
  if (process.env.NODE_ENV !== "development") return;

  const message =
    `[about] queryRan=${queryRan} singletonFound=${singletonFound} ` +
    `fallback=${fallbackUsed} reason=${reason}`;

  if (fallbackUsed) {
    console.warn(message);
  } else {
    console.info(message);
  }
}

async function fetchAboutContent(): Promise<AboutContent> {
  if (!isSanityConfigured || !sanityClient) {
    logAboutDiagnostic({
      queryRan: false,
      singletonFound: false,
      fallbackUsed: true,
      reason: "sanity-not-configured",
    });
    return aboutFallback;
  }

  try {
    const result = await sanityClient.fetch<AboutQueryResult | null>(
      aboutQuery,
      {},
      {
        perspective: "published",
        next: {
          revalidate: ABOUT_REVALIDATE_SECONDS,
          tags: [ABOUT_CACHE_TAG],
        },
      },
    );

    if (!result) {
      logAboutDiagnostic({
        queryRan: true,
        singletonFound: false,
        fallbackUsed: true,
        reason: "published-singleton-not-found",
      });
      return aboutFallback;
    }

    if (!hasRequiredHeadings(result)) {
      logAboutDiagnostic({
        queryRan: true,
        singletonFound: true,
        fallbackUsed: true,
        reason: "required-heading-fields-missing",
      });
      return aboutFallback;
    }

    const normalized = normalizeAbout(result);
    logAboutDiagnostic({
      queryRan: true,
      singletonFound: true,
      fallbackUsed: normalized.fallbackReasons.length > 0,
      reason: normalized.fallbackReasons.join(",") || "none",
    });
    return normalized.content;
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownError";
    logAboutDiagnostic({
      queryRan: true,
      singletonFound: false,
      fallbackUsed: true,
      reason: `query-error:${reason}`,
    });
    return aboutFallback;
  }
}

export const getAboutContent = cache(fetchAboutContent);
