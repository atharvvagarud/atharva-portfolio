function requireValue(value: string | undefined, name: string): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return normalizedValue;
}

export const projectId = requireValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = requireValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2026-06-01";
