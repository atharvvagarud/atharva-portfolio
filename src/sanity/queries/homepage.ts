import { defineQuery } from "next-sanity";
import type {
  ProjectsQueryImage,
  ProjectsQueryResult,
} from "@/sanity/queries/projects";
import type { SanitySeoQueryResult } from "@/sanity/queries/seo";

export type HomepageQueryStatistic = {
  value?: string | null;
  label?: string | null;
};

export type HomepageQueryExternalLink = {
  label?: string | null;
  url?: string | null;
};

export type HomepageQueryOffScreenItem = {
  title?: string | null;
  type?: string | null;
  image?: ProjectsQueryImage | null;
  smallLabel?: string | null;
  primaryText?: string | null;
  secondaryText?: string | null;
  externalLink?: HomepageQueryExternalLink | null;
  altText?: string | null;
};

export type HomepageQueryResult = {
  availabilityText?: string | null;
  heroFirstName?: string | null;
  heroLastName?: string | null;
  primaryIntroduction?: string | null;
  secondaryIntroduction?: string | null;
  locationLabel?: string | null;
  selectedProjects?: Array<ProjectsQueryResult | null> | null;
  profileSummary?: string | null;
  profileStatistics?: Array<HomepageQueryStatistic | null> | null;
  currentlyBuilding?: string | null;
  currentlyLearning?: string | null;
  currentlyExploring?: string | null;
  offScreenItems?: Array<HomepageQueryOffScreenItem | null> | null;
  seo?: SanitySeoQueryResult | null;
};

export const homepageQuery = defineQuery(`
  *[_id == "homepage" && _type == "homepage"][0] {
    availabilityText,
    heroFirstName,
    heroLastName,
    primaryIntroduction,
    secondaryIntroduction,
    locationLabel,
    "selectedProjects": selectedProjects[]->[
      _type == "project" &&
      ($includeUnpublished == true || coalesce(published, false) == true)
    ] {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      year,
      category,
      technologies,
      previewImage {
        asset-> {
          _id,
          url,
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
      },
      previewImageAltText,
      liveUrl,
      githubUrl,
      featured,
      published,
      displayOrder
    },
    profileSummary,
    profileStatistics[] {
      value,
      label
    },
    currentlyBuilding,
    currentlyLearning,
    currentlyExploring,
    offScreenItems[] {
      title,
      type,
      image {
        asset-> {
          _id,
          url,
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
      },
      smallLabel,
      primaryText,
      secondaryText,
      externalLink {
        label,
        url
      },
      altText
    },
    seo {
      title,
      description,
      openGraphImage {
        asset-> {
          _id,
          url
        },
        crop,
        hotspot
      }
    }
  }
`);
