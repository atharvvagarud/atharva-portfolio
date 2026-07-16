"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { getProjectDestination } from "@/lib/project-links";
import {
  projectCategories,
  type Project,
  type ProjectFilter,
} from "@/types/project";

const filters: readonly ProjectFilter[] = ["All", ...projectCategories];
const MotionLink = motion.create(Link);

function ProjectRowContent({
  project,
  index,
  showArrow,
}: {
  project: Project;
  index: number;
  showArrow: boolean;
}) {
  return (
    <>
      <span className="projects-index-row__number">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="projects-index-row__image-wrap">
        <Image
          className="projects-index-row__image"
          src={project.previewImageUrl}
          alt={project.previewImageAlt}
          width={project.previewImageWidth}
          height={project.previewImageHeight}
          sizes="(max-width: 767px) calc(100vw - 5.75rem), (max-width: 1023px) 40vw, (max-width: 1599px) 28vw, 448px"
        />
      </span>

      <span className="projects-index-row__content">
        <span className="projects-index-row__title-line">
          <h2 className="projects-index-row__title">{project.title}</h2>
        </span>
        <span className="projects-index-row__description">
          {project.shortDescription}
        </span>
        <span className="projects-index-row__technologies">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </span>
        <span className="projects-index-row__category">
          Category / {project.category || "Uncategorised"}
        </span>
      </span>

      <span className="projects-index-row__year">{project.year}</span>
      {showArrow ? (
        <span className="projects-index-row__arrow" aria-hidden="true">
          <ArrowRight size={23} strokeWidth={1.4} />
        </span>
      ) : null}
    </>
  );
}

export function ProjectsFilter({ projects }: { projects: readonly Project[] }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
  const reduceMotion = useReducedMotion();

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

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
        {filteredProjects.map((project, filteredIndex) => {
          const destination = getProjectDestination(project);
          const projectIndex = projects.findIndex(
            (candidate) => candidate.id === project.id,
          );
          const animation = {
            initial: reduceMotion ? false : { opacity: 0, y: 14 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.18 },
            transition: {
              duration: reduceMotion ? 0 : 0.42,
              delay: reduceMotion ? 0 : filteredIndex * 0.05,
              ease: [0.16, 1, 0.3, 1] as const,
            },
          };

          return destination ? (
            <MotionLink
              {...animation}
              className="projects-index-row motion-reveal"
              data-clickable="true"
              href={destination}
              id={project.slug}
              key={project.id}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title}, opens in a new tab`}
            >
              <ProjectRowContent
                project={project}
                index={projectIndex}
                showArrow
              />
            </MotionLink>
          ) : (
            <motion.article
              {...animation}
              className="projects-index-row motion-reveal"
              data-clickable="false"
              id={project.slug}
              key={project.id}
            >
              <ProjectRowContent
                project={project}
                index={projectIndex}
                showArrow={false}
              />
            </motion.article>
          );
        })}
      </div>
    </>
  );
}
