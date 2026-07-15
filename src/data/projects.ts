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
  placeholder?: boolean;
};

export const projectPreviewPaths = {
  pulse: "/images/projects/pulse-preview.png",
  f1Prediction: "/images/projects/f1-prediction-preview.png",
  placeholder: "/images/projects/project-placeholder-preview.png",
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
      alt: "Placeholder preview of the Pulse health analytics interface",
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
      alt: "Placeholder preview of the F1 in-race prediction interface",
      width: 1200,
      height: 675,
    },
  },
  {
    id: "project-placeholder",
    index: "03",
    title: "Project Placeholder",
    description:
      "Reserved project entry ready to replace when the next case study is selected.",
    technologies: ["Technology TBD"],
    categories: ["Tools"],
    year: "TBD",
    href: "/projects#project-placeholder",
    preview: {
      src: projectPreviewPaths.placeholder,
      alt: "Clearly marked placeholder preview for a future software project",
      width: 1200,
      height: 675,
    },
    placeholder: true,
  },
] as const satisfies readonly Project[];
