export type SiteFileAsset = {
  readonly url: string;
  readonly downloadUrl: string;
  readonly filename: string;
  readonly mimeType: string | null;
  readonly size: number | null;
};

export type SiteImageAsset = {
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly mimeType: string | null;
  readonly assetId: string | null;
};

export type SiteSettings = {
  readonly siteTitle: string;
  readonly defaultSeoTitle: string;
  readonly defaultSeoDescription: string;
  readonly productionSiteUrl: string;
  readonly email: string | null;
  readonly location: string;
  readonly availabilityLabel: string;
  readonly githubUrl: string | null;
  readonly linkedinUrl: string | null;
  readonly instagramUrl: string | null;
  readonly footerMessage: string;
  readonly cvFile: SiteFileAsset | null;
  readonly defaultOpenGraphImage: SiteImageAsset;
};
