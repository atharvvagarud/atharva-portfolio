const optionalValue = (value: string | undefined) => value?.trim() || null;

export const sanityProjectId = optionalValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

export const sanityDataset = optionalValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2026-06-01";

export const isSanityConfigured = Boolean(sanityProjectId && sanityDataset);

// Sanity requires syntactically valid values while compiling the embedded Studio.
// The public data layer checks isSanityConfigured before attempting a request.
export const studioProjectId = sanityProjectId || "missing";
export const studioDataset = sanityDataset || "production";
