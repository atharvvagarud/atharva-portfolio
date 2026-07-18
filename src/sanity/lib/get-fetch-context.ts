import "server-only";

import type { FilteredResponseQueryOptions, SanityClient } from "next-sanity";
import { draftMode } from "next/headers";
import { SANITY_REVALIDATE_SECONDS } from "@/sanity/cache";
import { sanityClient, sanityPreviewClient } from "@/sanity/client";

export type SanityFetchContext = {
  readonly client: SanityClient | null;
  readonly isDraftMode: boolean;
  readonly unavailableReason: "sanity-not-configured" | "preview-not-configured" | null;
};

export async function getSanityFetchContext(): Promise<SanityFetchContext> {
  const { isEnabled } = await draftMode();

  if (!sanityClient) {
    return {
      client: null,
      isDraftMode: isEnabled,
      unavailableReason: "sanity-not-configured",
    };
  }

  if (isEnabled && !sanityPreviewClient) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sanity-preview] fallback=true reason=preview-not-configured",
      );
    }

    return {
      client: null,
      isDraftMode: true,
      unavailableReason: "preview-not-configured",
    };
  }

  return {
    client: isEnabled ? sanityPreviewClient : sanityClient,
    isDraftMode: isEnabled,
    unavailableReason: null,
  };
}

export function getSanityFetchOptions(
  context: SanityFetchContext,
  cacheTag: string,
): FilteredResponseQueryOptions {
  if (context.isDraftMode) {
    return {
      perspective: "drafts",
      cache: "no-store",
    };
  }

  return {
    perspective: "published",
    next: {
      revalidate: SANITY_REVALIDATE_SECONDS,
      tags: [cacheTag],
    },
  };
}
