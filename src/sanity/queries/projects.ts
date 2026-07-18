import { defineQuery } from "next-sanity";

export type ProjectsQueryImage = {
  asset?: {
    _id?: string | null;
    url?: string | null;
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

export type ProjectsQueryResult = {
  _id?: string | null;
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  year?: number | null;
  category?: string | null;
  technologies?: Array<string | null> | null;
  previewImage?: ProjectsQueryImage | null;
  previewImageAltText?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean | null;
  published?: boolean | null;
  displayOrder?: number | null;
};

export const projectsQuery = defineQuery(`
  *[
    _type == "project" &&
    ($includeUnpublished == true || coalesce(published, false) == true)
  ]
    | order(displayOrder asc, year desc, title asc) {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      fullDescription,
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
    }
`);
