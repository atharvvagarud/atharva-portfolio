"use client";

import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { studioDataset, studioProjectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { singletonTypes } from "@/sanity/singletons";
import { structure } from "@/sanity/structure";
import {
  LOCAL_PREVIEW_ORIGIN,
  presentationLocations,
  presentationMainDocuments,
  presentationPreviewOrigin,
  PRODUCTION_PREVIEW_ORIGIN,
} from "@/sanity/presentation";

const sanityConfig = defineConfig({
  name: "default",
  title: "Atharva Portfolio CMS",
  basePath: "/studio",
  projectId: studioProjectId,
  dataset: studioDataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      name: "preview",
      title: "Preview",
      previewUrl: {
        initial: presentationPreviewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
          shareAccess: false,
        },
      },
      allowOrigins: [LOCAL_PREVIEW_ORIGIN, PRODUCTION_PREVIEW_ORIGIN],
      resolve: {
        mainDocuments: presentationMainDocuments,
        locations: presentationLocations,
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    newDocumentOptions: (previous) =>
      previous.filter(({ templateId }) => !singletonTypes.has(templateId)),
    actions: (previous, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? previous.filter(
            ({ action }) => action !== "delete" && action !== "duplicate",
          )
        : previous,
  },
});

export default sanityConfig;
