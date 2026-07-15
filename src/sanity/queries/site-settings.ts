import { defineQuery } from "next-sanity";

export type SiteSettingsQueryFileAsset = {
  _id?: string | null;
  url?: string | null;
  originalFilename?: string | null;
  mimeType?: string | null;
  size?: number | null;
};

export type SiteSettingsQueryImage = {
  asset?: {
    _id?: string | null;
    url?: string | null;
    mimeType?: string | null;
    metadata?: {
      dimensions?: {
        width?: number | null;
        height?: number | null;
        aspectRatio?: number | null;
      } | null;
    } | null;
  } | null;
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } | null;
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  } | null;
};

export type SiteSettingsQueryResult = {
  siteTitle?: string | null;
  defaultSeoTitle?: string | null;
  defaultSeoDescription?: string | null;
  productionSiteUrl?: string | null;
  email?: string | null;
  location?: string | null;
  availabilityLabel?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  footerMessage?: string | null;
  cvFile?: { asset?: SiteSettingsQueryFileAsset | null } | null;
  defaultOpenGraphImage?: SiteSettingsQueryImage | null;
};

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    siteTitle,
    defaultSeoTitle,
    defaultSeoDescription,
    productionSiteUrl,
    email,
    location,
    availabilityLabel,
    githubUrl,
    linkedinUrl,
    instagramUrl,
    footerMessage,
    cvFile {
      asset-> {
        _id,
        url,
        originalFilename,
        mimeType,
        size
      }
    },
    defaultOpenGraphImage {
      asset-> {
        _id,
        url,
        mimeType,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      crop,
      hotspot
    }
  }
`);
