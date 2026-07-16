import type { Metadata } from "next";
import { SiteContainer } from "@/components/site-container";
import { pageSeo, siteOwnerName } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";
import { getPhotos } from "@/sanity/lib/get-photos";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";
import { PhotographyExperience } from "./photography-experience";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return createPageMetadata(pageSeo.photography, settings);
}

export default async function PhotographyPage() {
  const [settings, photos] = await Promise.all([
    getSiteSettings(),
    getPhotos(),
  ]);

  return (
    <SiteContainer>
      <PhotographyExperience
        photos={photos}
        ownerName={siteOwnerName}
        sharedSettings={{
          location: settings.location,
          availabilityLabel: settings.availabilityLabel,
        }}
      />
    </SiteContainer>
  );
}
