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
  cvCallToActionLabel: string;
};

export const aboutData = {
  introduction: "Useful software, thoughtfully built.",
  introductionDetail:
    "I am Atharva Garud, a First-Class Computer Science graduate and software engineer based in London. I care about strong engineering, clear interfaces and thoughtful product decisions.",
  image: {
    src: "/images/about-sketchbook.png",
    alt: "An open sketchbook containing interface and product diagrams",
    width: 1000,
    height: 750,
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
  cvCallToActionLabel: "Download CV",
} as const satisfies AboutData;
