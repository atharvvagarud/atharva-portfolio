export const singletonDocuments = [
  { schemaType: "siteSettings", documentId: "siteSettings" },
  { schemaType: "homepage", documentId: "homepage" },
  { schemaType: "aboutPage", documentId: "aboutPage" },
] as const;

export const singletonTypes = new Set<string>(
  singletonDocuments.map(({ schemaType }) => schemaType),
);
