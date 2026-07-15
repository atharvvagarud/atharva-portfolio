export type AboutLink = {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
  placeholder?: boolean;
};

export type AboutEducation = {
  qualification: string;
  institution: string;
  classification: string;
  year: string;
};

export type AboutImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder: boolean;
};

export type AboutData = {
  introduction: string;
  introductionDetail: string;
  image: AboutImage;
  biography: readonly string[];
  education: AboutEducation;
  buildAreas: readonly string[];
  capabilities: readonly string[];
  currentFocus: readonly string[];
  location: string;
  availability: string;
  links: readonly AboutLink[];
  cv: AboutLink;
};

export const aboutData = {
  introduction: "Useful software, thoughtfully built.",
  introductionDetail:
    "I am Atharva Garud, a First-Class Computer Science graduate and software engineer based in London. I care about strong engineering, clear interfaces and thoughtful product decisions.",
  image: {
    src: "/images/about-personal-placeholder.png",
    alt: "An open sketchbook containing interface and product diagrams",
    width: 1000,
    height: 750,
    placeholder: true,
  },
  biography: [
    "I enjoy working across the full product journey, from understanding a problem and shaping an interface to designing APIs, modelling data and deploying the finished system.",
    "My interests span frontend engineering, backend services, databases, machine learning, performance and the details that make software feel considered.",
  ],
  education: {
    qualification: "BSc (Hons) Computer Science",
    institution: "Middlesex University London",
    classification: "First-Class degree",
    year: "2026",
  },
  buildAreas: [
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
    "Building Pulse",
    "Improving full-stack and AI engineering skills",
    "Learning Swift and native iOS development",
    "Exploring AI agents and local models",
    "Looking for graduate software-engineering opportunities",
  ],
  location: "London, UK",
  availability: "Open to graduate software-engineering opportunities",
  links: [
    {
      label: "Email",
      href: "mailto:atharva@example.com",
      placeholder: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/",
      external: true,
      placeholder: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/",
      external: true,
      placeholder: true,
    },
  ],
  cv: {
    label: "Download CV",
    href: "/resume/atharva-garud-cv.pdf",
    download: true,
  },
} as const satisfies AboutData;
