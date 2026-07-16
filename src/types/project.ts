export const projectCategories = [
  "Full-stack",
  "AI / ML",
  "Data",
  "Tools",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectFilter = "All" | ProjectCategory;

export type Project = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly fullDescription: string | null;
  readonly year: number;
  readonly category: ProjectCategory | null;
  readonly technologies: readonly string[];
  readonly previewImageUrl: string;
  readonly previewImageAlt: string;
  readonly previewImageWidth: number;
  readonly previewImageHeight: number;
  readonly liveUrl: string | null;
  readonly githubUrl: string | null;
  readonly featured: boolean;
  readonly displayOrder: number;
};
