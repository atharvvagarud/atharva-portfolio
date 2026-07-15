import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { InitialRevealHeader, SectionReveal } from "@/components/motion/reveal";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
import { aboutData, type AboutLink } from "@/data/about";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(pageSeo.about);

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <p className="section-label">
      <span>{number}</span>
      <span aria-hidden="true">/</span>
      <span>{children}</span>
    </p>
  );
}

function AboutLinkItem({ link }: { link: AboutLink }) {
  return (
    <Link
      className="about-link"
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
      aria-label={link.external ? `${link.label}, opens in a new tab` : link.label}
    >
      {link.label}
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
    </Link>
  );
}

export default function AboutPage() {
  return (
    <SiteContainer>
      <article className="about-page">
        <InitialRevealHeader className="about-hero">
          <div className="about-hero__copy">
            <SectionLabel number="01">About</SectionLabel>
            <h1>{aboutData.introduction}</h1>
            <p>{aboutData.introductionDetail}</p>
          </div>

          <figure className="about-hero__image">
            <Image
              src={aboutData.image.src}
              alt={aboutData.image.alt}
              width={aboutData.image.width}
              height={aboutData.image.height}
              sizes="(max-width: 767px) 100vw, 41vw"
              priority
              unoptimized
            />
          </figure>
        </InitialRevealHeader>

        <SectionReveal className="about-background" aria-labelledby="about-background-title">
          <div className="about-background__biography">
            <SectionLabel number="02">Background</SectionLabel>
            <h2 id="about-background-title">Thoughtful products, built end to end.</h2>
            <div className="about-background__copy">
              {aboutData.biography.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="about-education" aria-labelledby="education-title">
            <h3 id="education-title">Education</h3>
            <dl>
              <div>
                <dt>Degree</dt>
                <dd>{aboutData.education.qualification}</dd>
              </div>
              <div>
                <dt>University</dt>
                <dd>{aboutData.education.institution}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{aboutData.education.classification}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{aboutData.education.year}</dd>
              </div>
            </dl>
          </aside>
        </SectionReveal>

        <SectionReveal className="about-build" aria-labelledby="about-build-title">
          <div className="about-section-heading">
            <SectionLabel number="03">What I build</SectionLabel>
            <h2 id="about-build-title">From product idea to working software.</h2>
          </div>

          <ol className="about-build__list">
            {aboutData.buildAreas.map((area, index) => (
              <li key={area}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{area}</h3>
              </li>
            ))}
          </ol>
        </SectionReveal>

        <SectionReveal className="about-capabilities" aria-labelledby="capabilities-title">
          <div className="about-section-heading">
            <SectionLabel number="04">Capabilities</SectionLabel>
            <h2 id="capabilities-title">Selected tools and areas of practice.</h2>
          </div>

          <ul className="about-capabilities__list">
            {aboutData.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </SectionReveal>

        <SectionReveal className="about-now" aria-labelledby="about-now-title">
          <div className="about-now__focus">
            <SectionLabel number="05">Current focus</SectionLabel>
            <h2 id="about-now-title">Learning through building.</h2>
            <ul>
              {aboutData.currentFocus.map((focus) => (
                <li key={focus}>{focus}</li>
              ))}
            </ul>
          </div>

          <aside className="about-availability" aria-labelledby="availability-title">
            <SectionLabel number="06">Availability</SectionLabel>
            <h2 id="availability-title">Based in London and ready for what comes next.</h2>
            <p className="about-availability__status">
              <span className="status-dot" aria-hidden="true" />
              {aboutData.availability}
            </p>
            <p className="about-availability__location">{aboutData.location}</p>

            <nav className="about-availability__links" aria-label="Contact and profile links">
              {aboutData.links.map((link) => (
                <AboutLinkItem key={link.label} link={link} />
              ))}
            </nav>

            <a
              className="button-primary about-cv-button"
              href={aboutData.cv.href}
              download
            >
              {aboutData.cv.label}
              <Download aria-hidden="true" size={17} strokeWidth={1.5} />
            </a>
          </aside>
        </SectionReveal>
      </article>

      <footer className="about-contact" id="contact">
        <div>
          <p>Interested in working together?</p>
          <a href={aboutData.links[0].href}>
            Get in touch
            <ArrowRight aria-hidden="true" size={28} strokeWidth={1.4} />
          </a>
        </div>
        <p>{aboutData.location}</p>
      </footer>
    </SiteContainer>
  );
}
