import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import { cache } from "react";
import { homepageFallback } from "@/data/homepage";
import { sanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityImageBuilder } from "@/sanity/image";
import {
  getHomepageProjects,
  HOMEPAGE_PROJECT_LIMIT,
  normalizeProject,
} from "@/sanity/lib/get-projects";
import { normalizePageSeo } from "@/sanity/lib/normalize-page-seo";
import {
  homepageQuery,
  type HomepageQueryOffScreenItem,
  type HomepageQueryResult,
} from "@/sanity/queries/homepage";
import type {
  HomepageContent,
  HomepageOffScreenImage,
  HomepageOffScreenItem,
  HomepageStatistic,
} from "@/types/homepage";
import type { Project } from "@/types/project";

export const HOMEPAGE_REVALIDATE_SECONDS = 3600;
export const HOMEPAGE_CACHE_TAG = "sanity:homepage";
export const HOMEPAGE_STATISTIC_LIMIT = 3;
export const HOMEPAGE_OFF_SCREEN_LIMIT = 4;

type NormalizedHomepage = {
  readonly content: HomepageContent;
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

function createHomepageFallback(siteLocation?: string): HomepageContent {
  return {
    ...homepageFallback,
    locationLabel: valueOrNull(siteLocation) || homepageFallback.locationLabel,
  };
}

function normalizeStatistics(
  value: HomepageQueryResult["profileStatistics"],
): readonly HomepageStatistic[] {
  return (value || [])
    .flatMap((entry) => {
      const statisticValue = valueOrNull(entry?.value);
      const label = valueOrNull(entry?.label);

      return statisticValue && label ? [{ value: statisticValue, label }] : [];
    })
    .slice(0, HOMEPAGE_STATISTIC_LIMIT);
}

function naturalImageDimensions(
  item: HomepageQueryOffScreenItem,
): { width: number; height: number } | null {
  const dimensions = item.image?.asset?.metadata?.dimensions;
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

  const crop = item.image?.crop;
  const visibleWidth = sourceWidth * (1 - (crop?.left || 0) - (crop?.right || 0));
  const visibleHeight =
    sourceHeight * (1 - (crop?.top || 0) - (crop?.bottom || 0));

  if (visibleWidth <= 0 || visibleHeight <= 0) return null;

  const width = Math.min(900, Math.round(visibleWidth));
  return {
    width,
    height: Math.max(1, Math.round(width / (visibleWidth / visibleHeight))),
  };
}

function normalizeOffScreenImage(
  item: HomepageQueryOffScreenItem,
  index: number,
  title: string,
  primaryText: string,
): HomepageOffScreenImage | null {
  const image = item.image;
  const assetUrl = validHttpUrl(image?.asset?.url);
  const dimensions = naturalImageDimensions(item);

  if (!image?.asset?._id || !assetUrl || !dimensions) return null;

  let imageUrl = assetUrl;

  if (sanityImageBuilder) {
    try {
      imageUrl = sanityImageBuilder
        .image(image as SanityImageSource)
        .width(dimensions.width)
        .auto("format")
        .url();
    } catch {
      imageUrl = assetUrl;
    }
  }

  return {
    id: `image-${index}-${title}`,
    type: "image",
    title,
    smallLabel: valueOrNull(item.smallLabel),
    primaryText,
    secondaryText: valueOrNull(item.secondaryText),
    externalUrl: validHttpUrl(item.externalLink?.url),
    externalLabel: valueOrNull(item.externalLink?.label),
    imageUrl,
    imageAlt: valueOrNull(item.altText) || title,
    imageWidth: dimensions.width,
    imageHeight: dimensions.height,
  };
}

function normalizeOffScreenItem(
  item: HomepageQueryOffScreenItem | null,
  index: number,
): HomepageOffScreenItem | null {
  const title = valueOrNull(item?.title);
  const primaryText = valueOrNull(item?.primaryText);
  const type = valueOrNull(item?.type);

  if (!item || !title || !primaryText) return null;

  if (type === "image") {
    return normalizeOffScreenImage(item, index, title, primaryText);
  }

  if (type !== "music" && type !== "text") return null;

  return {
    id: `${type}-${index}-${title}`,
    type,
    title,
    smallLabel: valueOrNull(item.smallLabel),
    primaryText,
    secondaryText: valueOrNull(item.secondaryText),
    externalUrl: validHttpUrl(item.externalLink?.url),
    externalLabel: valueOrNull(item.externalLink?.label),
  };
}

function normalizeSelectedProjects(
  value: HomepageQueryResult["selectedProjects"],
): readonly Project[] {
  const seen = new Set<string>();

  return (value || [])
    .flatMap((entry) => {
      if (!entry || entry.published !== true) return [];
      const project = normalizeProject(entry);
      if (!project || seen.has(project.id)) return [];
      seen.add(project.id);
      return [project];
    })
    .slice(0, HOMEPAGE_PROJECT_LIMIT);
}

async function normalizeHomepage(
  value: HomepageQueryResult,
  fallback: HomepageContent,
): Promise<NormalizedHomepage> {
  const fallbackReasons: string[] = [];
  const explicitProjects = normalizeSelectedProjects(value.selectedProjects);
  const profileStatistics = normalizeStatistics(value.profileStatistics);
  const offScreenItems = (value.offScreenItems || [])
    .map(normalizeOffScreenItem)
    .filter((item): item is HomepageOffScreenItem => item !== null)
    .slice(0, HOMEPAGE_OFF_SCREEN_LIMIT);

  if (!valueOrNull(value.profileSummary)) fallbackReasons.push("profile-summary");
  if (profileStatistics.length === 0) fallbackReasons.push("profile-statistics");
  if (!valueOrNull(value.currentlyBuilding)) fallbackReasons.push("currently-building");
  if (!valueOrNull(value.currentlyLearning)) fallbackReasons.push("currently-learning");
  if (!valueOrNull(value.currentlyExploring)) fallbackReasons.push("currently-exploring");
  if (offScreenItems.length === 0) fallbackReasons.push("off-screen-items");

  return {
    content: {
      availabilityText: value.availabilityText!.trim(),
      heroFirstName: value.heroFirstName!.trim(),
      heroLastName: value.heroLastName!.trim(),
      primaryIntroduction: value.primaryIntroduction!.trim(),
      secondaryIntroduction: value.secondaryIntroduction!.trim(),
      locationLabel: valueOrNull(value.locationLabel) || fallback.locationLabel,
      selectedProjects:
        explicitProjects.length > 0
          ? explicitProjects
          : await getHomepageProjects(),
      profileSummary:
        valueOrNull(value.profileSummary) || fallback.profileSummary,
      profileStatistics:
        profileStatistics.length > 0
          ? profileStatistics
          : fallback.profileStatistics,
      currently: {
        building:
          valueOrNull(value.currentlyBuilding) || fallback.currently.building,
        learning:
          valueOrNull(value.currentlyLearning) || fallback.currently.learning,
        exploring:
          valueOrNull(value.currentlyExploring) || fallback.currently.exploring,
      },
      offScreenItems:
        offScreenItems.length > 0 ? offScreenItems : fallback.offScreenItems,
      seo: normalizePageSeo(value.seo),
    },
    fallbackReasons,
  };
}

function hasRequiredHero(value: HomepageQueryResult): boolean {
  return Boolean(
    valueOrNull(value.availabilityText) &&
      valueOrNull(value.heroFirstName) &&
      valueOrNull(value.heroLastName) &&
      valueOrNull(value.primaryIntroduction) &&
      valueOrNull(value.secondaryIntroduction),
  );
}

function logHomepageDiagnostic({
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
    `[homepage] queryRan=${queryRan} singletonFound=${singletonFound} ` +
    `fallback=${fallbackUsed} reason=${reason}`;

  if (fallbackUsed) {
    console.warn(message);
  } else {
    console.info(message);
  }
}

async function fetchHomepageContent(siteLocation?: string): Promise<HomepageContent> {
  const fallback = createHomepageFallback(siteLocation);

  if (!isSanityConfigured || !sanityClient) {
    logHomepageDiagnostic({
      queryRan: false,
      singletonFound: false,
      fallbackUsed: true,
      reason: "sanity-not-configured",
    });
    return fallback;
  }

  try {
    const result = await sanityClient.fetch<HomepageQueryResult | null>(
      homepageQuery,
      {},
      {
        perspective: "published",
        next: {
          revalidate: HOMEPAGE_REVALIDATE_SECONDS,
          tags: [HOMEPAGE_CACHE_TAG],
        },
      },
    );

    if (!result) {
      logHomepageDiagnostic({
        queryRan: true,
        singletonFound: false,
        fallbackUsed: true,
        reason: "published-singleton-not-found",
      });
      return fallback;
    }

    if (!hasRequiredHero(result)) {
      logHomepageDiagnostic({
        queryRan: true,
        singletonFound: true,
        fallbackUsed: true,
        reason: "required-hero-fields-missing",
      });
      return fallback;
    }

    const normalized = await normalizeHomepage(result, fallback);
    logHomepageDiagnostic({
      queryRan: true,
      singletonFound: true,
      fallbackUsed: normalized.fallbackReasons.length > 0,
      reason: normalized.fallbackReasons.join(",") || "none",
    });
    return normalized.content;
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownError";
    logHomepageDiagnostic({
      queryRan: true,
      singletonFound: false,
      fallbackUsed: true,
      reason: `query-error:${reason}`,
    });
    return fallback;
  }
}

export const getHomepageContent = cache(fetchHomepageContent);
