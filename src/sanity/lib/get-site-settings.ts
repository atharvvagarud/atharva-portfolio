import "server-only";

import { cache } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import { siteSettingsFallback } from "@/config/site-fallback";
import {
  SANITY_CACHE_TAGS,
  SANITY_REVALIDATE_SECONDS,
} from "@/sanity/cache";
import { sanityImageBuilder } from "@/sanity/image";
import {
  getSanityFetchContext,
  getSanityFetchOptions,
} from "@/sanity/lib/get-fetch-context";
import {
  siteSettingsQuery,
  type SiteSettingsQueryImage,
  type SiteSettingsQueryResult,
} from "@/sanity/queries/site-settings";
import type {
  SiteFileAsset,
  SiteImageAsset,
  SiteSettings,
} from "@/types/site-settings";

export const SITE_SETTINGS_REVALIDATE_SECONDS = SANITY_REVALIDATE_SECONDS;
export const SITE_SETTINGS_CACHE_TAG = SANITY_CACHE_TAGS.siteSettings;

function logSiteSettingsFallback(reason: string): void {
  if (process.env.NODE_ENV !== "development") return;
  console.warn(`[site-settings] fallback=true reason=${reason}`);
}

function nonEmptyString(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function normalizeFooterMessage(value: string | null | undefined): string {
  const message = value?.trim();

  if (!message || /\bnotes\b/i.test(message)) {
    return siteSettingsFallback.footerMessage;
  }

  return message;
}

function validHttpUrl(
  value: string | null | undefined,
  fallback: string | null,
): string | null {
  const candidate = value?.trim();

  if (!candidate) return fallback;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;
    return url.toString().replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

function validEmail(
  value: string | null | undefined,
  fallback: string | null,
): string | null {
  const candidate = value?.trim();
  if (!candidate) return fallback;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)
    ? candidate
    : fallback;
}

function normalizeCvFile(
  value: SiteSettingsQueryResult["cvFile"],
): SiteFileAsset | null {
  const asset = value?.asset;
  const url = validHttpUrl(asset?.url, null);
  if (!url) return siteSettingsFallback.cvFile;

  const filename = asset?.originalFilename?.trim() || "atharva-garud-cv.pdf";
  const downloadUrl = new URL(url);
  downloadUrl.searchParams.set("dl", filename);

  return {
    url,
    downloadUrl: downloadUrl.toString(),
    filename,
    mimeType: asset?.mimeType?.trim() || null,
    size:
      typeof asset?.size === "number" && asset.size >= 0 ? asset.size : null,
  };
}

function normalizeOpenGraphImage(
  value: SiteSettingsQueryImage | null | undefined,
): SiteImageAsset {
  const dimensions = value?.asset?.metadata?.dimensions;
  const assetUrl = validHttpUrl(value?.asset?.url, null);
  const hasDimensions =
    typeof dimensions?.width === "number" &&
    dimensions.width > 0 &&
    typeof dimensions.height === "number" &&
    dimensions.height > 0;

  if (!value || !assetUrl || !hasDimensions) {
    return siteSettingsFallback.defaultOpenGraphImage;
  }

  let url = assetUrl;

  try {
    url =
      sanityImageBuilder
        ?.image(value as SanityImageSource)
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url() || assetUrl;
  } catch {
    url = assetUrl;
  }

  return {
    url,
    width: 1200,
    height: 630,
    aspectRatio: 1200 / 630,
    mimeType: value.asset?.mimeType?.trim() || null,
    assetId: value.asset?._id?.trim() || null,
  };
}

function normalizeSiteSettings(value: SiteSettingsQueryResult): SiteSettings {
  return {
    siteTitle: nonEmptyString(value.siteTitle, siteSettingsFallback.siteTitle),
    defaultSeoTitle: nonEmptyString(
      value.defaultSeoTitle,
      siteSettingsFallback.defaultSeoTitle,
    ),
    defaultSeoDescription: nonEmptyString(
      value.defaultSeoDescription,
      siteSettingsFallback.defaultSeoDescription,
    ),
    productionSiteUrl:
      validHttpUrl(
        value.productionSiteUrl,
        siteSettingsFallback.productionSiteUrl,
      ) || siteSettingsFallback.productionSiteUrl,
    email: validEmail(value.email, siteSettingsFallback.email),
    location: nonEmptyString(value.location, siteSettingsFallback.location),
    availabilityLabel: nonEmptyString(
      value.availabilityLabel,
      siteSettingsFallback.availabilityLabel,
    ),
    githubUrl: validHttpUrl(value.githubUrl, siteSettingsFallback.githubUrl),
    linkedinUrl: validHttpUrl(
      value.linkedinUrl,
      siteSettingsFallback.linkedinUrl,
    ),
    instagramUrl: validHttpUrl(
      value.instagramUrl,
      siteSettingsFallback.instagramUrl,
    ),
    footerMessage: normalizeFooterMessage(value.footerMessage),
    cvFile: normalizeCvFile(value.cvFile),
    defaultOpenGraphImage: normalizeOpenGraphImage(
      value.defaultOpenGraphImage,
    ),
  };
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  const context = await getSanityFetchContext();

  if (!context.client) {
    logSiteSettingsFallback(context.unavailableReason || "sanity-not-configured");
    return siteSettingsFallback;
  }

  try {
    const result = await context.client.fetch<SiteSettingsQueryResult | null>(
      siteSettingsQuery,
      {},
      getSanityFetchOptions(context, SITE_SETTINGS_CACHE_TAG),
    );

    if (!result) {
      logSiteSettingsFallback(
        context.isDraftMode
          ? "preview-singleton-not-found"
          : "published-singleton-not-found",
      );
      return siteSettingsFallback;
    }

    return normalizeSiteSettings(result);
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownError";
    logSiteSettingsFallback(`query-error:${reason}`);
    return siteSettingsFallback;
  }
}

export const getSiteSettings = cache(fetchSiteSettings);
