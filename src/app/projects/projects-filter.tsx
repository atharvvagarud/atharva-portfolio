"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  projectCategories,
  type Project,
  type ProjectFilter,
} from "@/data/projects";

const filters: readonly ProjectFilter[] = ["All", ...projectCategories];
const MotionLink = motion.create(Link);

export function ProjectsFilter({ projects }: { projects: readonly Project[] }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
  const reduceMotion = useReducedMotion();

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.categories.includes(activeFilter));

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
        {filteredProjects.map((project, index) => (
          <MotionLink
            className="projects-index-row"
            href={project.href}
            id={project.id}
            key={project.id}
            aria-label={`View ${project.title} project summary`}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              delay: reduceMotion ? 0 : index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="projects-index-row__number">{project.index}</span>

            <span className="projects-index-row__image-wrap">
              <Image
                className="projects-index-row__image"
                src={project.preview.src}
                alt={project.preview.alt}
                width={project.preview.width}
                height={project.preview.height}
                sizes="(max-width: 767px) calc(100vw - 5.75rem), (max-width: 1023px) 40vw, (max-width: 1599px) 28vw, 448px"
              />
            </span>

            <span className="projects-index-row__content">
              <span className="projects-index-row__title-line">
                <h2 className="projects-index-row__title">{project.title}</h2>
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
          </MotionLink>
        ))}
      </div>
    </>
  );
}
