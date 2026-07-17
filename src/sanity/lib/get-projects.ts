import "server-only";

import { cache } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import {
  fallbackProjects,
  homepageProjectFallback,
  projectPreviewPaths,
} from "@/data/projects";
import { sanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityImageBuilder } from "@/sanity/image";
import {
  projectsQuery,
  type ProjectsQueryResult,
} from "@/sanity/queries/projects";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/types/project";

export const PROJECTS_REVALIDATE_SECONDS = 3600;
export const PROJECTS_CACHE_TAG = "sanity:projects";
export const HOMEPAGE_PROJECT_LIMIT = 2;

type ProjectDataResult = {
  readonly projects: readonly Project[];
  readonly source: "sanity" | "fallback";
};

type ProjectDiagnostic = {
  readonly queryRan: boolean;
  readonly returnedCount: number | "unknown";
  readonly acceptedCount: number;
  readonly fallbackUsed: boolean;
  readonly reason:
    | "none"
    | "sanity-not-configured"
    | "no-matching-documents"
    | "normalization-rejected-all"
    | "normalization-rejected-some"
    | `query-error:${string}`;
};

function logProjectDiagnostic(diagnostic: ProjectDiagnostic): void {
  if (process.env.NODE_ENV !== "development") return;

  const message = [
    `[projects] queryRan=${diagnostic.queryRan}`,
    `returned=${diagnostic.returnedCount}`,
    `accepted=${diagnostic.acceptedCount}`,
    `fallback=${diagnostic.fallbackUsed}`,
    `reason=${diagnostic.reason}`,
  ].join(" ");

  if (diagnostic.fallbackUsed) {
    console.warn(message);
    return;
  }

  console.info(message);
}

function validHttpUrl(value: string | null | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function isProjectCategory(value: string): value is ProjectCategory {
  return projectCategories.some((category) => category === value);
}

function fallbackPreview(slug: string) {
  const matchingProject = fallbackProjects.find(
    (project) => project.slug === slug,
  );

  return matchingProject
    ? {
        url: matchingProject.previewImageUrl,
        alt: matchingProject.previewImageAlt,
        width: matchingProject.previewImageWidth,
        height: matchingProject.previewImageHeight,
      }
    : {
        url: projectPreviewPaths.generic,
        alt: "Portfolio project preview placeholder",
        width: 1200,
        height: 630,
      };
}

export function normalizeProject(value: ProjectsQueryResult): Project | null {
  const id = value._id?.trim();
  const slug = value.slug?.trim();
  const title = value.title?.trim();
  const shortDescription = value.shortDescription?.trim();
  const year = value.year;

  if (
    !id ||
    !slug ||
    !title ||
    !shortDescription ||
    typeof year !== "number" ||
    !Number.isFinite(year)
  ) {
    return null;
  }

  const fallback = fallbackPreview(slug);
  const hasImage = Boolean(value.previewImage?.asset?._id);
  let previewImageUrl: string = fallback.url;
  let previewImageAlt: string = fallback.alt;
  let previewImageWidth: number = fallback.width;
  let previewImageHeight: number = fallback.height;

  if (hasImage && value.previewImage && sanityImageBuilder) {
    try {
      previewImageUrl = sanityImageBuilder
        .image(value.previewImage as SanityImageSource)
        .width(1200)
        .height(675)
        .fit("crop")
        .auto("format")
        .url();
      previewImageAlt =
        value.previewImageAltText?.trim() || `${title} project preview`;
      previewImageWidth = 1200;
      previewImageHeight = 675;
    } catch {
      // Retain the stable local preview selected above.
    }
  }

  const category = value.category?.trim();
  const technologies = Array.from(
    new Set(
      (value.technologies || [])
        .map((technology) => technology?.trim())
        .filter((technology): technology is string => Boolean(technology)),
    ),
  );

  return {
    id,
    slug,
    title,
    shortDescription,
    fullDescription: value.fullDescription?.trim() || null,
    year: Math.trunc(year),
    category: category && isProjectCategory(category) ? category : null,
    technologies,
    previewImageUrl,
    previewImageAlt,
    previewImageWidth,
    previewImageHeight,
    liveUrl: validHttpUrl(value.liveUrl),
    githubUrl: validHttpUrl(value.githubUrl),
    featured: value.featured === true,
    displayOrder:
      typeof value.displayOrder === "number" &&
      Number.isFinite(value.displayOrder)
        ? Math.trunc(value.displayOrder)
        : 100,
  };
}

async function fetchProjectData(): Promise<ProjectDataResult> {
  if (!isSanityConfigured || !sanityClient) {
    logProjectDiagnostic({
      queryRan: false,
      returnedCount: 0,
      acceptedCount: 0,
      fallbackUsed: true,
      reason: "sanity-not-configured",
    });
    return { projects: fallbackProjects, source: "fallback" };
  }

  try {
    const result = await sanityClient.fetch<readonly ProjectsQueryResult[]>(
      projectsQuery,
      {},
      {
        perspective: "published",
        next: {
          revalidate: PROJECTS_REVALIDATE_SECONDS,
          tags: [PROJECTS_CACHE_TAG],
        },
      },
    );
    const projects = result
      .map(normalizeProject)
      .filter((project): project is Project => project !== null);

    if (result.length === 0) {
      logProjectDiagnostic({
        queryRan: true,
        returnedCount: 0,
        acceptedCount: 0,
        fallbackUsed: true,
        reason: "no-matching-documents",
      });
      return { projects: fallbackProjects, source: "fallback" };
    }

    if (projects.length === 0) {
      logProjectDiagnostic({
        queryRan: true,
        returnedCount: result.length,
        acceptedCount: 0,
        fallbackUsed: true,
        reason: "normalization-rejected-all",
      });
      return { projects: fallbackProjects, source: "fallback" };
    }

    logProjectDiagnostic({
      queryRan: true,
      returnedCount: result.length,
      acceptedCount: projects.length,
      fallbackUsed: false,
      reason:
        projects.length < result.length
          ? "normalization-rejected-some"
          : "none",
    });

    return { projects, source: "sanity" };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownError";
    logProjectDiagnostic({
      queryRan: true,
      returnedCount: "unknown",
      acceptedCount: 0,
      fallbackUsed: true,
      reason: `query-error:${reason}`,
    });
    return { projects: fallbackProjects, source: "fallback" };
  }
}

const getProjectData = cache(fetchProjectData);

export async function getProjects(): Promise<readonly Project[]> {
  return (await getProjectData()).projects;
}

export async function getHomepageProjects(): Promise<readonly Project[]> {
  const result = await getProjectData();

  if (result.source === "fallback") {
    return homepageProjectFallback;
  }

  const featured = result.projects.filter((project) => project.featured);
  const remaining = result.projects.filter((project) => !project.featured);

  return [...featured, ...remaining].slice(0, HOMEPAGE_PROJECT_LIMIT);
}
