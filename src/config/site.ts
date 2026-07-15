import {
  siteOwnerName,
  siteSettingsFallback,
} from "@/config/site-fallback";

export type PageSeo = {
  readonly title: string;
  readonly description: string;
  readonly path: `/${string}`;
  readonly image: string;
  readonly imageAlt: string;
};

export type PageSeoInput = Pick<PageSeo, "path"> & Partial<Omit<PageSeo, "path">>;

export const pageSeo = {
  home: {
    title: siteSettingsFallback.defaultSeoTitle,
    description: siteSettingsFallback.defaultSeoDescription,
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

export { siteOwnerName };
