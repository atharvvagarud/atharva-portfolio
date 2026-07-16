import type { Project } from "@/types/project";

export const projectPreviewPaths = {
  pulse: "/images/projects/pulse-preview.png",
  f1Prediction: "/images/projects/f1-prediction-preview.png",
  generic: "/images/og/projects.png",
} as const;

export const fallbackProjects = [
  {
    id: "pulse",
    slug: "pulse",
    title: "Pulse",
    shortDescription:
      "Privacy-first personal health analytics for Fitbit and Google Health data.",
    fullDescription: null,
    year: 2026,
    category: "Full-stack",
    technologies: ["Next.js", "TypeScript", "Local-first", "Charts"],
    previewImageUrl: projectPreviewPaths.pulse,
    previewImageAlt:
      "Pulse health analytics interface showing personal health data",
    previewImageWidth: 1200,
    previewImageHeight: 675,
    liveUrl: null,
    githubUrl: null,
    featured: true,
    displayOrder: 10,
  },
  {
    id: "f1-in-race-winner-prediction",
    slug: "f1-in-race-winner-prediction",
    title: "F1 In-Race Winner Prediction",
    shortDescription:
      "Machine-learning predictions from live race context and historical data.",
    fullDescription: null,
    year: 2026,
    category: "AI / ML",
    technologies: ["Python", "FastAPI", "XGBoost", "FastF1", "Next.js"],
    previewImageUrl: projectPreviewPaths.f1Prediction,
    previewImageAlt:
      "F1 in-race winner prediction interface with race data and probabilities",
    previewImageWidth: 1200,
    previewImageHeight: 675,
    liveUrl: null,
    githubUrl: null,
    featured: true,
    displayOrder: 20,
  },
] as const satisfies readonly Project[];

// Preserves the exact homepage-specific copy until the Homepage document migrates.
export const homepageProjectFallback = [
  {
    ...fallbackProjects[0],
    technologies: ["Next.js", "TypeScript", "Health data"],
  },
  fallbackProjects[1],
] as const satisfies readonly Project[];
