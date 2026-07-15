export type SiteConfig = {
  readonly name: string;
  readonly siteTitle: string;
  readonly description: string;
  readonly location: string;
  readonly siteUrl: string;
  readonly email: string | null;
  readonly githubUrl: string | null;
  readonly linkedinUrl: string | null;
};

const optionalValue = (value: string | undefined) => value?.trim() || null;
const configuredSiteUrl = optionalValue(process.env.SITE_URL);

export const siteConfig = {
  name: "Atharva Garud",
  siteTitle: "Atharva Garud | Software Engineer",
  description:
    "Portfolio of Atharva Garud, a First-Class Computer Science graduate and software engineer based in London.",
  location: "London, UK",
  siteUrl: (configuredSiteUrl || "https://atharvagarud.com").replace(/\/+$/, ""),
  email: optionalValue(process.env.SITE_EMAIL),
  githubUrl: optionalValue(process.env.GITHUB_URL),
  linkedinUrl: optionalValue(process.env.LINKEDIN_URL),
} as const satisfies SiteConfig;

export type PageSeo = {
  readonly title: string;
  readonly description: string;
  readonly path: `/${string}`;
  readonly image: `/${string}`;
  readonly imageAlt: string;
};

export type PageSeoInput = Pick<PageSeo, "path"> & Partial<Omit<PageSeo, "path">>;

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
