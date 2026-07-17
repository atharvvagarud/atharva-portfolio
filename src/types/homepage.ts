import type { Project } from "@/types/project";

export type HomepageStatistic = {
  readonly value: string;
  readonly label: string;
};

export type HomepageCurrently = {
  readonly building: string;
  readonly learning: string;
  readonly exploring: string;
};

type HomepageOffScreenBase = {
  readonly id: string;
  readonly title: string;
  readonly smallLabel: string | null;
  readonly primaryText: string;
  readonly secondaryText: string | null;
  readonly externalUrl: string | null;
  readonly externalLabel: string | null;
};

export type HomepageOffScreenImage = HomepageOffScreenBase & {
  readonly type: "image";
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
};

export type HomepageOffScreenMusic = HomepageOffScreenBase & {
  readonly type: "music";
};

export type HomepageOffScreenText = HomepageOffScreenBase & {
  readonly type: "text";
};

export type HomepageOffScreenItem =
  | HomepageOffScreenImage
  | HomepageOffScreenMusic
  | HomepageOffScreenText;

export type HomepageContent = {
  readonly availabilityText: string;
  readonly heroFirstName: string;
  readonly heroLastName: string;
  readonly primaryIntroduction: string;
  readonly secondaryIntroduction: string;
  readonly locationLabel: string;
  readonly selectedProjects: readonly Project[];
  readonly profileSummary: string;
  readonly profileStatistics: readonly HomepageStatistic[];
  readonly currently: HomepageCurrently;
  readonly offScreenItems: readonly HomepageOffScreenItem[];
};
