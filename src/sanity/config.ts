"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
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
  },
});

export default sanityConfig;
