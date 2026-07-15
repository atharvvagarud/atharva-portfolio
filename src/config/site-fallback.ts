import type { SiteSettings } from "@/types/site-settings";

const DEFAULT_SITE_URL = "https://atharvagarud.com";

function optionalHttpUrl(value: string | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString().replace(/\/+$/, "")
      : null;
  } catch {
    return null;
  }
}

function optionalEmail(value: string | undefined): string | null {
  const candidate = value?.trim();
  return candidate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)
    ? candidate
    : null;
}

export const siteOwnerName = "Atharva Garud";

// Remove this object once every deployment can rely on published Site Settings.
export const siteSettingsFallback = {
  siteTitle: "Atharva Garud | Software Engineer",
  defaultSeoTitle: "Atharva Garud | Software Engineer",
  defaultSeoDescription:
    "Portfolio of Atharva Garud, a First-Class Computer Science graduate and software engineer based in London.",
  productionSiteUrl: optionalHttpUrl(process.env.SITE_URL) || DEFAULT_SITE_URL,
  email: optionalEmail(process.env.SITE_EMAIL),
  location: "London, UK",
  availabilityLabel: "Available for new graduate roles",
  githubUrl: optionalHttpUrl(process.env.GITHUB_URL),
  linkedinUrl: optionalHttpUrl(process.env.LINKEDIN_URL),
  instagramUrl: null,
  footerMessage: "Have an opportunity or interesting project?",
  cvFile: null,
  defaultOpenGraphImage: {
    url: "/images/og/homepage.png",
    width: 1200,
    height: 630,
    aspectRatio: 1200 / 630,
    mimeType: "image/png",
    assetId: null,
  },
} as const satisfies SiteSettings;
