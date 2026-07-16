import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InitialRevealHeader } from "@/components/motion/reveal";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";
import { getProjects } from "@/sanity/lib/get-projects";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";
import { ProjectsFilter } from "./projects-filter";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return createPageMetadata(pageSeo.projects, settings);
}

export default async function ProjectsPage() {
  const settings = await getSiteSettings();
  const projects = await getProjects();

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
            {settings.availabilityLabel}
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
