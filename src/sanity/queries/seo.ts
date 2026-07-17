export type SanitySeoQueryImage = {
  asset?: {
    _id?: string | null;
    url?: string | null;
  } | null;
  crop?: {
    top?: number | null;
    bottom?: number | null;
    left?: number | null;
    right?: number | null;
  } | null;
  hotspot?: {
    x?: number | null;
    y?: number | null;
    height?: number | null;
    width?: number | null;
  } | null;
};

export type SanitySeoQueryResult = {
  title?: string | null;
  description?: string | null;
  openGraphImage?: SanitySeoQueryImage | null;
};
