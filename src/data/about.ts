import type { PortableTextBlock } from "@portabletext/react";
import { siteSettingsFallback } from "@/config/site-fallback";
import type { AboutContent } from "@/types/about";

export const ABOUT_CV_FALLBACK = {
  url: "/resume/atharva-garud-cv.pdf",
  filename: "atharva-garud-cv.pdf",
} as const;

function paragraph(key: string, text: string): PortableTextBlock {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `${key}-span`,
        _type: "span",
        text,
        marks: [],
      },
    ],
  };
}

// Remove this fallback after every deployment can rely on a published About Page.
export const aboutFallback = {
  sectionLabel: "01 / ABOUT",
  mainHeading: "Useful software, thoughtfully built.",
  introduction:
    "I am Atharva Garud, a First-Class Computer Science graduate and software engineer based in London. I care about strong engineering, clear interfaces and thoughtful product decisions.",
  portrait: {
    url: "/images/about-sketchbook.png",
    alt: "An open sketchbook containing interface and product diagrams",
    width: 1000,
    height: 750,
  },
  biography: [
    paragraph(
      "about-biography-1",
      "I enjoy working across the full product journey, from understanding a problem and shaping an interface to designing APIs, modelling data and deploying the finished system.",
    ),
    paragraph(
      "about-biography-2",
      "My interests span frontend engineering, backend services, databases, machine learning, performance and the details that make software feel considered.",
    ),
  ],
  education: [
    {
      qualification: "BSc (Hons) Computer Science",
      institution: "Middlesex University London",
      result: "First-Class degree",
      year: "2026",
    },
  ],
  areasIBuild: [
    "Full-stack web applications",
    "AI and machine-learning systems",
    "Data-rich interfaces",
    "Developer tools",
    "Product-focused prototypes",
  ],
  capabilities: [
    "TypeScript",
    "React",
    "Next.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Machine learning",
    "Data visualisation",
    "REST APIs",
    "Git",
    "Vercel",
  ],
  currentFocus: [
    { title: "Building Pulse", description: null },
    {
      title: "Improving full-stack and AI engineering skills",
      description: null,
    },
    {
      title: "Learning Swift and native iOS development",
      description: null,
    },
    { title: "Exploring AI agents and local models", description: null },
    {
      title: "Looking for graduate software-engineering opportunities",
      description: null,
    },
  ],
  availabilityText: siteSettingsFallback.availabilityLabel,
  cvCtaLabel: "Download CV",
} as const satisfies AboutContent;
