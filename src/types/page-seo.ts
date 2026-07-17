export type PageSeoImage = {
  readonly url: string;
  readonly width: number;
  readonly height: number;
};

export type PageSeoContent = {
  readonly title: string | null;
  readonly description: string | null;
  readonly openGraphImage: PageSeoImage | null;
};

export const emptyPageSeo = {
  title: null,
  description: null,
  openGraphImage: null,
} as const satisfies PageSeoContent;
