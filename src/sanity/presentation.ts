import {
  defineDocuments,
  defineLocations,
} from "sanity/presentation";

export const LOCAL_PREVIEW_ORIGIN = "http://localhost:3000";
export const PRODUCTION_PREVIEW_ORIGIN =
  "https://atharva-portfolio-gold.vercel.app";

export const presentationPreviewOrigin =
  process.env.NODE_ENV === "development"
    ? LOCAL_PREVIEW_ORIGIN
    : PRODUCTION_PREVIEW_ORIGIN;

export const presentationMainDocuments = defineDocuments([
  { route: "/", type: "homepage" },
  { route: "/about", type: "aboutPage" },
]);

export const presentationLocations = {
  siteSettings: defineLocations({
    locations: [{ title: "Homepage", href: "/" }],
  }),
  homepage: defineLocations({
    locations: [{ title: "Homepage", href: "/" }],
  }),
  aboutPage: defineLocations({
    locations: [{ title: "About", href: "/about" }],
  }),
  project: defineLocations({
    select: { title: "title" },
    resolve: (document) => ({
      locations: [
        {
          title: document?.title || "Projects",
          href: "/projects",
        },
      ],
    }),
  }),
  photo: defineLocations({
    select: { title: "title" },
    resolve: (document) => ({
      locations: [
        {
          title: document?.title || "Photography",
          href: "/photography",
        },
      ],
    }),
  }),
};
