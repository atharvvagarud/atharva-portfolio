export const projectCategories = [
  "Full-stack",
  "AI / ML",
  "Data",
  "Tools",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectFilter = "All" | ProjectCategory;

export type ProjectPreview = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  index: string;
  title: string;
  description: string;
  technologies: readonly string[];
  categories: readonly ProjectCategory[];
  year: string;
  href: string;
  preview: ProjectPreview;
};

export const projectPreviewPaths = {
  pulse: "/images/projects/pulse-preview.png",
  f1Prediction: "/images/projects/f1-prediction-preview.png",
} as const;

export const projects = [
  {
    id: "pulse",
    index: "01",
    title: "Pulse",
    description:
      "Privacy-first personal health analytics for Fitbit and Google Health data.",
    technologies: ["Next.js", "TypeScript", "Local-first", "Charts"],
    categories: ["Full-stack", "Data"],
    year: "2026",
    href: "/projects#pulse",
    preview: {
      src: projectPreviewPaths.pulse,
      alt: "Pulse health analytics interface showing personal health data",
      width: 1200,
      height: 675,
    },
  },
  {
    id: "f1-in-race-winner-prediction",
    index: "02",
    title: "F1 In-Race Winner Prediction",
    description:
      "Machine-learning predictions from live race context and historical data.",
    technologies: ["Python", "FastAPI", "XGBoost", "FastF1", "Next.js"],
    categories: ["AI / ML", "Data"],
    year: "2026",
    href: "/projects#f1-in-race-winner-prediction",
    preview: {
      src: projectPreviewPaths.f1Prediction,
      alt: "F1 in-race winner prediction interface with race data and probabilities",
      width: 1200,
      height: 675,
    },
  },
] as const satisfies readonly Project[];
