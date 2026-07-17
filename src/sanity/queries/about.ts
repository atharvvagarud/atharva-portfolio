import { defineQuery } from "next-sanity";
import type { ProjectsQueryImage } from "@/sanity/queries/projects";

export type AboutQuerySpan = {
  _key?: string | null;
  _type?: string | null;
  text?: string | null;
  marks?: Array<string | null> | null;
};

export type AboutQueryBlock = {
  _key?: string | null;
  _type?: string | null;
  style?: string | null;
  children?: Array<AboutQuerySpan | null> | null;
  markDefs?: Array<unknown> | null;
};

export type AboutQueryEducationEntry = {
  qualification?: string | null;
  institution?: string | null;
  result?: string | null;
  year?: number | null;
};

export type AboutQueryCurrentFocusEntry = {
  title?: string | null;
  description?: string | null;
};

export type AboutQueryResult = {
  sectionLabel?: string | null;
  mainHeading?: string | null;
  introduction?: string | null;
  portraitImage?: ProjectsQueryImage | null;
  portraitAltText?: string | null;
  biography?: Array<AboutQueryBlock | null> | null;
  educationEntries?: Array<AboutQueryEducationEntry | null> | null;
  areasIBuild?: Array<string | null> | null;
  capabilities?: Array<string | null> | null;
  currentFocusEntries?: Array<AboutQueryCurrentFocusEntry | null> | null;
  availabilityText?: string | null;
  cvCallToActionLabel?: string | null;
};

export const aboutQuery = defineQuery(`
  *[_id == "aboutPage" && _type == "aboutPage"][0] {
    sectionLabel,
    mainHeading,
    introduction,
    portraitImage {
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
    portraitAltText,
    biography,
    educationEntries[] {
      qualification,
      institution,
      result,
      year
    },
    areasIBuild,
    capabilities,
    currentFocusEntries[] {
      title,
      description
    },
    availabilityText,
    cvCallToActionLabel
  }
`);
