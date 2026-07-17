import type { PortableTextBlock } from "@portabletext/react";
import type { PageSeoContent } from "@/types/page-seo";

export type AboutPortrait = {
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
};

export type AboutEducationEntry = {
  readonly qualification: string;
  readonly institution: string;
  readonly result: string;
  readonly year: string;
};

export type AboutCurrentFocusEntry = {
  readonly title: string;
  readonly description: string | null;
};

export type AboutContent = {
  readonly sectionLabel: string;
  readonly mainHeading: string;
  readonly introduction: string;
  readonly portrait: AboutPortrait;
  readonly biography: readonly PortableTextBlock[];
  readonly education: readonly AboutEducationEntry[];
  readonly areasIBuild: readonly string[];
  readonly capabilities: readonly string[];
  readonly currentFocus: readonly AboutCurrentFocusEntry[];
  readonly availabilityText: string;
  readonly cvCtaLabel: string;
  readonly seo: PageSeoContent;
};
