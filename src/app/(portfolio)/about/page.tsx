import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { InitialRevealHeader, SectionReveal } from "@/components/motion/reveal";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
import { ABOUT_CV_FALLBACK } from "@/data/about";
import { createPageMetadata } from "@/lib/seo";
import { getSiteContactLinks, type SiteLink } from "@/lib/site-links";
import { getAboutContent } from "@/sanity/lib/get-about";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
  ]);

  return createPageMetadata(
    {
      ...pageSeo.about,
      title: content.seo.title || pageSeo.about.title,
      description: content.seo.description || pageSeo.about.description,
      image: content.seo.openGraphImage?.url || pageSeo.about.image,
    },
    settings,
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <p className="section-label">
      <span>{number}</span>
      <span aria-hidden="true">/</span>
      <span>{children}</span>
    </p>
  );
}

function AboutSectionLabel({ value }: { value: string }) {
  const [number, ...labelParts] = value.split("/").map((part) => part.trim());
  const label = labelParts.join(" / ");

  return label ? (
    <SectionLabel number={number}>{label}</SectionLabel>
  ) : (
    <p className="section-label">
      <span>{value}</span>
    </p>
  );
}

function AboutLinkItem({ link }: { link: SiteLink }) {
  return (
    <Link
      className="about-link"
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      aria-label={link.external ? `${link.label}, opens in a new tab` : link.label}
    >
      {link.label}
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
    </Link>
  );
}

export default async function AboutPage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
  ]);
  const contactLinks = getSiteContactLinks(settings);
  const cvDownload = settings.cvFile
    ? {
        href: settings.cvFile.downloadUrl,
        filename: settings.cvFile.filename,
      }
    : ABOUT_CV_FALLBACK.available
      ? {
          href: ABOUT_CV_FALLBACK.url,
          filename: ABOUT_CV_FALLBACK.filename,
        }
      : null;

  return (
    <SiteContainer>
      <article className="about-page">
        <InitialRevealHeader className="about-hero">
          <div className="about-hero__copy">
            <AboutSectionLabel value={content.sectionLabel} />
            <h1>{content.mainHeading}</h1>
            <p>{content.introduction}</p>
          </div>

          <figure className="about-hero__image">
            <Image
              src={content.portrait.url}
              alt={content.portrait.alt}
              width={content.portrait.width}
              height={content.portrait.height}
              sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1599px) 41vw, 656px"
              priority
            />
          </figure>
        </InitialRevealHeader>

        <SectionReveal className="about-background" aria-labelledby="about-background-title">
          <div className="about-background__biography">
            <SectionLabel number="02">Background</SectionLabel>
            <h2 id="about-background-title">Thoughtful products, built end to end.</h2>
            <div className="about-background__copy">
              <PortableText value={[...content.biography]} onMissingComponent={false} />
            </div>
          </div>

          <aside className="about-education" aria-labelledby="education-title">
            <h3 id="education-title">Education</h3>
            {content.education.map((entry, index) => (
              <dl key={`${entry.qualification}-${entry.institution}-${index}`}>
                <div>
                  <dt>Degree</dt>
                  <dd>{entry.qualification}</dd>
                </div>
                <div>
                  <dt>University</dt>
                  <dd>{entry.institution}</dd>
                </div>
                {entry.result ? (
                  <div>
                    <dt>Result</dt>
                    <dd>{entry.result}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Year</dt>
                  <dd>{entry.year}</dd>
                </div>
              </dl>
            ))}
          </aside>
        </SectionReveal>

        <SectionReveal className="about-build" aria-labelledby="about-build-title">
          <div className="about-section-heading">
            <SectionLabel number="03">What I build</SectionLabel>
            <h2 id="about-build-title">From product idea to working software.</h2>
          </div>

          <ol className="about-build__list">
            {content.areasIBuild.map((area, index) => (
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
            {content.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </SectionReveal>

        <SectionReveal className="about-now" aria-labelledby="about-now-title">
          <div className="about-now__focus">
            <SectionLabel number="05">Current focus</SectionLabel>
            <h2 id="about-now-title">Learning through building.</h2>
            <ul>
              {content.currentFocus.map((focus, index) => (
                <li key={`${focus.title}-${index}`}>
                  {focus.title}
                  {focus.description ? ` — ${focus.description}` : null}
                </li>
              ))}
            </ul>
          </div>

          <aside className="about-availability" aria-labelledby="availability-title">
            <SectionLabel number="06">Availability</SectionLabel>
            <h2 id="availability-title">Based in London and ready for what comes next.</h2>
            <p className="about-availability__status">
              <span className="status-dot" aria-hidden="true" />
              {content.availabilityText}
            </p>
            <p className="about-availability__location">{settings.location}</p>

            {contactLinks.length > 0 ? (
              <nav className="about-availability__links" aria-label="Contact and profile links">
                {contactLinks.map((link) => (
                  <AboutLinkItem key={link.label} link={link} />
                ))}
              </nav>
            ) : null}

            {cvDownload ? (
              <a
                className="button-primary about-cv-button"
                href={cvDownload.href}
                download={cvDownload.filename}
              >
                {content.cvCtaLabel}
                <Download aria-hidden="true" size={17} strokeWidth={1.5} />
              </a>
            ) : null}
          </aside>
        </SectionReveal>
      </article>

      <footer className="about-contact" id="contact">
        <div>
          <p>Interested in working together?</p>
          {settings.email ? (
            <a href={`mailto:${settings.email}`}>
              Get in touch
              <ArrowRight aria-hidden="true" size={28} strokeWidth={1.4} />
            </a>
          ) : null}
        </div>
        <p>{settings.location}</p>
      </footer>
    </SiteContainer>
  );
}
