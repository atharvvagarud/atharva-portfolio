export const photoCategories = [
  "Landscape",
  "Street",
  "Travel",
  "Black & White",
  "Architecture",
  "Details",
  "Candid",
  "Night",
] as const;

export type PhotoCategory = (typeof photoCategories)[number];

export type Photo = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly imageUrl: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly alt: string;
  readonly location: string | null;
  readonly year: number;
  readonly category: PhotoCategory | null;
  readonly summary: string | null;
  readonly description: string | null;
  readonly featured: boolean;
  readonly displayOrder: number;
};
