import type { Metadata } from "next";
import { SiteContainer } from "@/components/site-container";
import { photos } from "@/data/photography";
import { PhotographyExperience } from "./photography-experience";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "A quiet collection of landscape, street and travel photography by Atharva Garud.",
};

export default function PhotographyPage() {
  return (
    <SiteContainer>
      <PhotographyExperience photos={photos} />
    </SiteContainer>
  );
}
