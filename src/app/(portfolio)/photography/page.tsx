import type { Metadata } from "next";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
import { photos } from "@/data/photography";
import { createPageMetadata } from "@/lib/seo";
import { PhotographyExperience } from "./photography-experience";

export const metadata: Metadata = createPageMetadata(pageSeo.photography);

export default function PhotographyPage() {
  return (
    <SiteContainer>
      <PhotographyExperience photos={photos} />
    </SiteContainer>
  );
}
