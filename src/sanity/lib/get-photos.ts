import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import { cache } from "react";
import {
  fallbackPhotoImage,
  fallbackPhotos,
} from "@/data/photography";
import {
  SANITY_CACHE_TAGS,
  SANITY_REVALIDATE_SECONDS,
} from "@/sanity/cache";
import { sanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityImageBuilder } from "@/sanity/image";
import {
  photosQuery,
  type PhotosQueryImage,
  type PhotosQueryResult,
} from "@/sanity/queries/photos";
import {
  photoCategories,
  type Photo,
  type PhotoCategory,
} from "@/types/photo";

export const PHOTOS_REVALIDATE_SECONDS = SANITY_REVALIDATE_SECONDS;
export const PHOTOS_CACHE_TAG = SANITY_CACHE_TAGS.photos;

type PhotoDiagnostic = {
  readonly queryRan: boolean;
  readonly returnedCount: number | "unknown";
  readonly acceptedCount: number;
  readonly fallbackUsed: boolean;
  readonly reason:
    | "none"
    | "sanity-not-configured"
    | "no-matching-documents"
    | "normalization-rejected-all"
    | "normalization-rejected-some"
    | `query-error:${string}`;
};

function logPhotoDiagnostic(diagnostic: PhotoDiagnostic): void {
  if (process.env.NODE_ENV !== "development") return;

  const message = [
    `[photos] queryRan=${diagnostic.queryRan}`,
    `returned=${diagnostic.returnedCount}`,
    `accepted=${diagnostic.acceptedCount}`,
    `fallback=${diagnostic.fallbackUsed}`,
    `reason=${diagnostic.reason}`,
  ].join(" ");

  if (diagnostic.fallbackUsed) {
    console.warn(message);
    return;
  }

  console.info(message);
}

function isPhotoCategory(value: string): value is PhotoCategory {
  return photoCategories.some((category) => category === value);
}

function positiveNumber(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

function cropFraction(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : 0;
}

function responsiveImageDimensions(
  value: PhotosQueryImage,
): { width: number; height: number } | null {
  const dimensions = value.asset?.metadata?.dimensions;
  const sourceWidth = positiveNumber(dimensions?.width);
  const sourceHeight = positiveNumber(dimensions?.height);
  if (!sourceWidth || !sourceHeight) return null;

  const horizontalCrop =
    cropFraction(value.crop?.left) + cropFraction(value.crop?.right);
  const verticalCrop =
    cropFraction(value.crop?.top) + cropFraction(value.crop?.bottom);
  const croppedWidth = sourceWidth * Math.max(0.01, 1 - horizontalCrop);
  const croppedHeight = sourceHeight * Math.max(0.01, 1 - verticalCrop);
  const width = Math.max(1, Math.min(1600, Math.round(croppedWidth)));
  const height = Math.max(1, Math.round(width * (croppedHeight / croppedWidth)));

  return { width, height };
}

function fallbackImage(slug: string, title: string) {
  const match = fallbackPhotos.find((photo) => photo.slug === slug);

  return match
    ? {
        imageUrl: match.imageUrl,
        imageWidth: match.imageWidth,
        imageHeight: match.imageHeight,
        alt: match.alt,
      }
    : {
        ...fallbackPhotoImage,
        alt: `${title} photograph`,
      };
}

function normalizePhoto(value: PhotosQueryResult): Photo | null {
  const id = value._id?.trim();
  const slug = value.slug?.trim();
  const title = value.title?.trim();
  const year = value.year;

  if (
    !id ||
    !slug ||
    !title ||
    typeof year !== "number" ||
    !Number.isFinite(year)
  ) {
    return null;
  }

  const fallback = fallbackImage(slug, title);
  let imageUrl = fallback.imageUrl;
  let imageWidth = fallback.imageWidth;
  let imageHeight = fallback.imageHeight;
  let alt = value.altText?.trim() || fallback.alt;
  const dimensions = value.image
    ? responsiveImageDimensions(value.image)
    : null;

  if (value.image && dimensions && sanityImageBuilder) {
    try {
      imageUrl = sanityImageBuilder
        .image(value.image as SanityImageSource)
        .width(dimensions.width)
        .auto("format")
        .url();
      imageWidth = dimensions.width;
      imageHeight = dimensions.height;
    } catch {
      alt = fallback.alt;
    }
  }

  const category = value.category?.trim();

  return {
    id,
    slug,
    title,
    imageUrl,
    imageWidth,
    imageHeight,
    alt,
    location: value.location?.trim() || null,
    year: Math.trunc(year),
    category: category && isPhotoCategory(category) ? category : null,
    summary: value.summary?.trim() || null,
    description: value.description?.trim() || null,
    featured: value.featured === true,
    displayOrder:
      typeof value.displayOrder === "number" &&
      Number.isFinite(value.displayOrder)
        ? Math.max(0, Math.trunc(value.displayOrder))
        : 100,
  };
}

async function fetchPhotos(): Promise<readonly Photo[]> {
  if (!isSanityConfigured || !sanityClient) {
    logPhotoDiagnostic({
      queryRan: false,
      returnedCount: 0,
      acceptedCount: 0,
      fallbackUsed: true,
      reason: "sanity-not-configured",
    });
    return fallbackPhotos;
  }

  try {
    const result = await sanityClient.fetch<readonly PhotosQueryResult[]>(
      photosQuery,
      {},
      {
        perspective: "published",
        next: {
          revalidate: PHOTOS_REVALIDATE_SECONDS,
          tags: [PHOTOS_CACHE_TAG],
        },
      },
    );
    const photos = result
      .map(normalizePhoto)
      .filter((photo): photo is Photo => photo !== null);

    if (result.length === 0) {
      logPhotoDiagnostic({
        queryRan: true,
        returnedCount: 0,
        acceptedCount: 0,
        fallbackUsed: true,
        reason: "no-matching-documents",
      });
      return fallbackPhotos;
    }

    if (photos.length === 0) {
      logPhotoDiagnostic({
        queryRan: true,
        returnedCount: result.length,
        acceptedCount: 0,
        fallbackUsed: true,
        reason: "normalization-rejected-all",
      });
      return fallbackPhotos;
    }

    logPhotoDiagnostic({
      queryRan: true,
      returnedCount: result.length,
      acceptedCount: photos.length,
      fallbackUsed: false,
      reason:
        photos.length < result.length
          ? "normalization-rejected-some"
          : "none",
    });

    return photos;
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownError";
    logPhotoDiagnostic({
      queryRan: true,
      returnedCount: "unknown",
      acceptedCount: 0,
      fallbackUsed: true,
      reason: `query-error:${reason}`,
    });
    return fallbackPhotos;
  }
}

export const getPhotos = cache(fetchPhotos);
