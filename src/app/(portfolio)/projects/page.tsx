import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InitialRevealHeader } from "@/components/motion/reveal";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
import { projects } from "@/data/projects";
import { createPageMetadata } from "@/lib/seo";
import { ProjectsFilter } from "./projects-filter";

export const metadata: Metadata = createPageMetadata(pageSeo.projects);

export default function ProjectsPage() {
  return (
    <SiteContainer>
      <InitialRevealHeader className="projects-page-header">
        <div className="projects-page-header__copy">
          <p className="availability">
            <span className="status-dot" aria-hidden="true" />
            Selected work
          </p>
          <h1>Projects</h1>
          <p>
            A focused selection of software projects exploring useful products,
            full-stack systems, data and applied AI.
          </p>
        </div>
      </InitialRevealHeader>

      <section className="projects-index" aria-label="Project index">
        <ProjectsFilter projects={projects} />
      </section>

      <footer className="projects-page-footer">
        <div>
          <p className="availability">
            <span className="status-dot" aria-hidden="true" />
            Open to new opportunities
          </p>
          <Link href="/#contact">
            Let&apos;s build something useful
            <ArrowRight aria-hidden="true" size={26} strokeWidth={1.4} />
          </Link>
        </div>
      </footer>
    </SiteContainer>
  );
}
