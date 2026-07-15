import { siteConfig } from "@/config/site";

export type HomepageProject = {
  index: string;
  title: string;
  description: string;
  technologies: readonly string[];
  year: string;
  href: string;
};

export type HomepageLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type OffScreenImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HomepageData = {
  availability: string;
  name: string;
  location: string;
  introduction: readonly [string, string];
  socialLinks: readonly HomepageLink[];
  projects: readonly HomepageProject[];
  profile: string;
  highlights: readonly { value: string; label: string }[];
  currently: readonly { label: string; value: string }[];
  offScreenImages: readonly OffScreenImage[];
};

const socialLinks: HomepageLink[] = [
  ...(siteConfig.githubUrl
    ? [{ label: "GitHub", href: siteConfig.githubUrl, external: true }]
    : []),
  ...(siteConfig.linkedinUrl
    ? [{ label: "LinkedIn", href: siteConfig.linkedinUrl, external: true }]
    : []),
  ...(siteConfig.email
    ? [{ label: "Email", href: `mailto:${siteConfig.email}` }]
    : []),
];

export const homepageData = {
  availability: "Available for new graduate roles",
  name: siteConfig.name,
  location: siteConfig.location,
  introduction: [
    "I build thoughtful software across full-stack systems, data and applied AI.",
    "First-Class Computer Science graduate creating products that are technically strong, visually considered and genuinely useful.",
  ],
  socialLinks,
  projects: [
    {
      index: "01",
      title: "Pulse",
      description:
        "Privacy-first personal health analytics for Fitbit and Google Health data.",
      technologies: ["Next.js", "TypeScript", "Health data"],
      year: "2026",
      href: "/projects",
    },
    {
      index: "02",
      title: "F1 In-Race Winner Prediction",
      description:
        "Machine-learning predictions from live race context and historical data.",
      technologies: ["Python", "FastAPI", "XGBoost", "FastF1"],
      year: "2026",
      href: "/projects",
    },
  ],
  profile:
    "I am a First-Class Computer Science graduate and software engineer based in London. I enjoy building complete products, from architecture and APIs to interaction design, performance and deployment.",
  highlights: [
    { value: "01", label: "First-Class degree" },
    { value: "02", label: "Selected projects" },
    { value: "01", label: "London base" },
  ],
  currently: [
    { label: "Building", value: "Pulse health analytics" },
    { label: "Learning", value: "Swift and native iOS development" },
    { label: "Exploring", value: "AI agents, local models and developer tooling" },
  ],
  offScreenImages: [
    {
      src: "/images/off-screen-highlands.png",
      alt: "A quiet mountain road winding through a cloudy Highland valley",
      width: 1000,
      height: 750,
    },
    {
      src: "/images/off-screen-training.png",
      alt: "Black and white photograph of a person training in a quiet gym",
      width: 1000,
      height: 750,
    },
    {
      src: "/images/off-screen-sketchbook.png",
      alt: "An open sketchbook containing interface and product diagrams",
      width: 1000,
      height: 750,
    },
    {
      src: "/images/off-screen-london.png",
      alt: "A subdued London skyline beneath a deep blue evening sky",
      width: 1000,
      height: 750,
    },
  ],
} as const satisfies HomepageData;
