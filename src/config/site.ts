export type SiteConfig = {
  readonly name: string;
  readonly siteTitle: string;
  readonly description: string;
  readonly location: string;
  readonly siteUrl: string;
  readonly email: string;
  readonly githubUrl: string;
  readonly linkedinUrl: string;
};

const configuredSiteUrl =
  process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Atharva Garud",
  siteTitle: "Atharva Garud | Software Engineer",
  description:
    "Portfolio of Atharva Garud, a First-Class Computer Science graduate and software engineer based in London.",
  location: "London, UK",
  siteUrl: (configuredSiteUrl || "https://atharvagarud.com").replace(/\/+$/, ""),
  email: "atharva@example.com",
  githubUrl: "https://github.com/",
  linkedinUrl: "https://www.linkedin.com/",
} as const satisfies SiteConfig;

export type PageSeo = {
  readonly title: string;
  readonly description: string;
  readonly path: `/${string}`;
  readonly image: `/${string}`;
  readonly imageAlt: string;
};

export const pageSeo = {
  home: {
    title: siteConfig.siteTitle,
    description: siteConfig.description,
    path: "/",
    image: "/images/og/homepage.png",
    imageAlt: "Atharva Garud software engineering portfolio",
  },
  projects: {
    title: "Projects",
    description:
      "Selected software engineering projects by Atharva Garud across full-stack systems, data and applied AI.",
    path: "/projects",
    image: "/images/og/projects.png",
    imageAlt: "Selected software projects by Atharva Garud",
  },
  photography: {
    title: "Photography",
    description:
      "A quiet collection of landscape, street and travel photography by Atharva Garud.",
    path: "/photography",
    image: "/images/og/photography.png",
    imageAlt: "Photography collection by Atharva Garud",
  },
  about: {
    title: "About",
    description:
      "About Atharva Garud, a First-Class Computer Science graduate and software engineer based in London.",
    path: "/about",
    image: "/images/og/about.png",
    imageAlt: "About Atharva Garud",
  },
} as const satisfies Record<string, PageSeo>;
