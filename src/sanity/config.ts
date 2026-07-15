"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { singletonTypes } from "@/sanity/singletons";
import { structure } from "@/sanity/structure";

const sanityConfig = defineConfig({
  name: "default",
  title: "Atharva Portfolio CMS",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
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
