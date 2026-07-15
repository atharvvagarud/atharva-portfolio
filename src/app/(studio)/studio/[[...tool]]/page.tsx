import type { Metadata, Viewport } from "next";
import {
  metadata as studioMetadata,
  NextStudio,
  viewport as studioViewport,
} from "next-sanity/studio";
import sanityConfig from "@/sanity/config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Atharva Portfolio CMS",
  description: "Content management for the Atharva Garud portfolio.",
};

export const viewport: Viewport = {
  ...studioViewport,
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <NextStudio config={sanityConfig} />;
}
