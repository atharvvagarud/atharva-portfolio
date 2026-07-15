"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  projectCategories,
  type Project,
  type ProjectFilter,
} from "@/data/projects";

const filters: readonly ProjectFilter[] = ["All", ...projectCategories];

export function ProjectsFilter({ projects }: { projects: readonly Project[] }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");

  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((project) => project.categories.includes(activeFilter)),
    [activeFilter, projects],
  );

  return (
    <>
      <div className="project-filters" role="group" aria-label="Filter projects by category">
        {filters.map((filter) => (
          <button
            className="project-filter"
            data-active={activeFilter === filter}
            type="button"
            aria-pressed={activeFilter === filter}
            key={filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}.
      </p>

      <div className="projects-index-list">
        {filteredProjects.map((project) => (
          <Link
            className="projects-index-row"
            href={project.href}
            id={project.id}
            key={project.id}
            aria-label={`View ${project.title} project summary`}
          >
            <span className="projects-index-row__number">{project.index}</span>

            <span className="projects-index-row__image-wrap">
              <Image
                className="projects-index-row__image"
                src={project.preview.src}
                alt={project.preview.alt}
                width={project.preview.width}
                height={project.preview.height}
                loading="eager"
                unoptimized
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 28vw"
              />
            </span>

            <span className="projects-index-row__content">
              <span className="projects-index-row__title-line">
                <span className="projects-index-row__title">{project.title}</span>
                {project.placeholder ? (
                  <span className="projects-index-row__placeholder">Placeholder</span>
                ) : null}
              </span>
              <span className="projects-index-row__description">{project.description}</span>
              <span className="projects-index-row__technologies">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </span>
              <span className="projects-index-row__category">
                Category / {project.categories.join(" / ")}
              </span>
            </span>

            <span className="projects-index-row__year">{project.year}</span>
            <span className="projects-index-row__arrow" aria-hidden="true">
              <ArrowRight size={23} strokeWidth={1.4} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
