import { aboutPage } from "@/sanity/schemaTypes/aboutPage";
import { homepage } from "@/sanity/schemaTypes/homepage";
import { photo } from "@/sanity/schemaTypes/photo";
import { project } from "@/sanity/schemaTypes/project";
import { siteSettings } from "@/sanity/schemaTypes/siteSettings";
import { currentFocusItem } from "@/sanity/schemaTypes/objects/currentFocusItem";
import { educationEntry } from "@/sanity/schemaTypes/objects/educationEntry";
import { externalLink } from "@/sanity/schemaTypes/objects/externalLink";
import { offScreenItem } from "@/sanity/schemaTypes/objects/offScreenItem";
import { seo } from "@/sanity/schemaTypes/objects/seo";
import { statistic } from "@/sanity/schemaTypes/objects/statistic";

export const schemaTypes = [
  siteSettings,
  homepage,
  aboutPage,
  project,
  photo,
  seo,
  externalLink,
  statistic,
  educationEntry,
  currentFocusItem,
  offScreenItem,
];
