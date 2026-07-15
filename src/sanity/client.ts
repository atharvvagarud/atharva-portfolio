import { createClient } from "next-sanity";
import {
  apiVersion,
  isSanityConfigured,
  sanityDataset,
  sanityProjectId,
} from "@/sanity/env";

export const sanityClient =
  isSanityConfigured && sanityProjectId && sanityDataset
    ? createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion,
        useCdn: true,
        perspective: "published",
      })
    : null;
