import { defineQuery } from "next-sanity";

export type PhotosQueryImage = {
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
    top?: number | null;
    bottom?: number | null;
    left?: number | null;
    right?: number | null;
  } | null;
  hotspot?: {
    x?: number | null;
    y?: number | null;
    height?: number | null;
    width?: number | null;
  } | null;
};

export type PhotosQueryResult = {
  _id?: string | null;
  title?: string | null;
  slug?: string | null;
  image?: PhotosQueryImage | null;
  altText?: string | null;
  location?: string | null;
  year?: number | null;
  category?: string | null;
  summary?: string | null;
  description?: string | null;
  featured?: boolean | null;
  displayOrder?: number | null;
  published?: boolean | null;
};

export const photosQuery = defineQuery(`
  *[_type == "photo" && coalesce(published, false) == true]
    | order(displayOrder asc, year desc, title asc) {
      _id,
      title,
      "slug": slug.current,
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
      altText,
      location,
      year,
      category,
      summary,
      description,
      featured,
      displayOrder,
      published
    }
`);
