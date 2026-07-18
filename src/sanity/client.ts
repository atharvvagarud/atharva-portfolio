import "server-only";

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

const sanityApiReadToken = process.env.SANITY_API_READ_TOKEN?.trim() || null;

export const sanityPreviewClient =
  sanityClient && sanityApiReadToken
    ? sanityClient.withConfig({
        token: sanityApiReadToken,
        useCdn: false,
        perspective: "drafts",
      })
    : null;
