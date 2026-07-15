import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "@/sanity/client";

export const sanityImageBuilder = sanityClient
  ? createImageUrlBuilder(sanityClient)
  : null;
