import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LondonTime } from "@/components/london-time";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
import { ABOUT_CV_FALLBACK } from "@/data/about";
import { createPageMetadata } from "@/lib/seo";
import { getProjectDestination } from "@/lib/project-links";
import { getSiteContactLinks, type SiteLink } from "@/lib/site-links";
import { getHomepageContent } from "@/sanity/lib/get-homepage";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";
import type {
  HomepageContent,
  HomepageOffScreenItem,
} from "@/types/homepage";
import type { Project } from "@/types/project";
import type { SiteSettings } from "@/types/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const content = await getHomepageContent(settings.location);

  return createPageMetadata(
    {
      ...pageSeo.home,
      title: content.seo.title || settings.defaultSeoTitle,
      description:
        content.seo.description || settings.defaultSeoDescription,
      image:
        content.seo.openGraphImage?.url ||
        settings.defaultOpenGraphImage.url,
    },
    settings,
  );
}

function SectionLabel({
  id,
  number,
  children,
}: {
  id?: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="section-label" id={id}>
      <span>{number}</span>
      <span aria-hidden="true">/</span>
      <span>{children}</span>
    </h2>
  );
}

function SocialLink({
  label,
  href,
  external,
}: SiteLink) {
  return (
    <Link
      className="text-link home-social-link"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={external ? `${label}, opens in a new tab` : undefined}
    >
      {label}
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
    </Link>
  );
}

function Hero({
  content,
  socialLinks,
  cvDownload,
}: {
  content: HomepageContent;
  socialLinks: readonly SiteLink[];
  cvDownload: {
    readonly href: string;
    readonly filename: string;
    readonly external: boolean;
  } | null;
}) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <p className="availability">
        <span className="status-dot" aria-hidden="true" />
        {content.availabilityText}
      </p>

      <div className="home-hero__title-row">
        <h1 id="home-title" className="home-title">
          <span>{content.heroFirstName}</span>
          <span>{content.heroLastName}</span>
        </h1>

        <aside className="location-block" aria-label="Location and local time">
          <p>{content.locationLabel}</p>
          <p>
            <span>Local time</span>
            <LondonTime />
          </p>
        </aside>
      </div>

      <div className="home-introduction">
        <p>{content.primaryIntroduction}</p>
        <p>{content.secondaryIntroduction}</p>
      </div>

      <div className="home-actions">
        {cvDownload ? (
          <a
            className="button-primary home-cv-button"
            href={cvDownload.href}
            download={cvDownload.filename}
            target={cvDownload.external ? "_blank" : undefined}
            rel={cvDownload.external ? "noopener noreferrer" : undefined}
            aria-label={
              cvDownload.external
                ? "Download Atharva Garud CV PDF, opens in a new tab"
                : "Download Atharva Garud CV PDF"
            }
          >
            Download CV
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
          </a>
        ) : null}

        {socialLinks.length > 0 ? (
          <div className="home-socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} {...link} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SelectedWork({ projects }: { projects: readonly Project[] }) {
  return (
    <section className="home-section" aria-labelledby="selected-work-title">
      <SectionLabel id="selected-work-title" number="01">Selected work</SectionLabel>

      <div className="project-list">
        {projects.map((project, index) => {
          const destination = getProjectDestination(project);
          const indexLabel = String(index + 1).padStart(2, "0");

          return (
            <article className="project-row" key={project.id}>
              <p className="project-row__index">{indexLabel}</p>
              <div className="project-row__title-wrap">
                <h3 className="project-row__title">{project.title}</h3>
              </div>
              <div className="project-row__summary">
                <p>{project.shortDescription}</p>
                <ul aria-label={`${project.title} technologies`}>
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
              <p className="project-row__year">{project.year}</p>
              {destination ? (
                <Link
                  className="project-row__link"
                  href={destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title}, opens in a new tab`}
                >
                  <ArrowRight
                    aria-hidden="true"
                    size={22}
                    strokeWidth={1.4}
                  />
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProfileAndCurrently({ content }: { content: HomepageContent }) {
  const currently = [
    { label: "Building", value: content.currently.building },
    { label: "Learning", value: content.currently.learning },
    { label: "Exploring", value: content.currently.exploring },
  ] as const;

  return (
    <section className="profile-currently" aria-label="Profile and current interests">
      <div className="profile-block">
        <SectionLabel number="02">Profile</SectionLabel>
        <p className="profile-copy">{content.profileSummary}</p>
        <dl className="profile-highlights">
          {content.profileStatistics.map((highlight) => (
            <div key={highlight.label}>
              <dt>{highlight.value}</dt>
              <dd>{highlight.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="currently-block">
        <SectionLabel number="03">Currently</SectionLabel>
        <dl className="currently-list">
          {currently.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function OffScreenPanel({ item }: { item: HomepageOffScreenItem }) {
  const isText = item.type === "text";
  const panel = (
    <article className={`off-screen-item off-screen-panel off-screen-panel--${item.type}`}>
      {item.smallLabel ? (
        <p className="off-screen-panel__label">{item.smallLabel}</p>
      ) : null}
      <h3>{isText ? item.title : item.primaryText}</h3>
      {isText ? (
        <p className="off-screen-panel__text">{item.primaryText}</p>
      ) : null}
      {item.secondaryText ? (
        <p className="off-screen-panel__text">{item.secondaryText}</p>
      ) : null}
    </article>
  );

  return item.externalUrl ? (
    <Link
      className="off-screen-item"
      href={item.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.externalLabel || item.title}, opens in a new tab`}
    >
      {panel}
    </Link>
  ) : (
    panel
  );
}

function OffScreen({ items }: { items: readonly HomepageOffScreenItem[] }) {
  return (
    <section className="home-section off-screen" aria-labelledby="off-screen-title">
      <SectionLabel id="off-screen-title" number="04">Off screen</SectionLabel>
      <div className="off-screen-grid">
        {items.map((item) => {
          if (item.type !== "image") {
            return <OffScreenPanel item={item} key={item.id} />;
          }

          const image = (
            <figure>
              <Image
                src={item.imageUrl}
                alt={item.imageAlt}
                width={item.imageWidth}
                height={item.imageHeight}
                sizes="(max-width: 639px) calc((100vw - 3.75rem) / 2), (max-width: 1023px) calc((100vw - 7.5rem) / 4), 23vw"
              />
            </figure>
          );

          return item.externalUrl ? (
            <Link
              className="off-screen-item"
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.externalLabel || item.title}, opens in a new tab`}
              key={item.id}
            >
              {image}
            </Link>
          ) : (
            <div className="off-screen-item" key={item.id}>
              {image}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ContactFooter({ settings }: { settings: SiteSettings }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="contact-footer">
      <div className="contact-footer__lead">
        <p>{settings.footerMessage}</p>
        {settings.email ? (
          <Link href={`mailto:${settings.email}`}>
            Let&apos;s talk
            <ArrowRight aria-hidden="true" size={28} strokeWidth={1.4} />
          </Link>
        ) : null}
      </div>

      <div className="contact-footer__metadata" aria-label="Footer information">
        <p>{settings.location}</p>
        <p>{settings.availabilityLabel}</p>
        <p>© {currentYear} Atharva Garud</p>
      </div>
    </footer>
  );
}

export default async function Home() {
  const settings = await getSiteSettings();
  const content = await getHomepageContent(settings.location);
  const socialLinks = getSiteContactLinks(settings);
  const cvDownload = settings.cvFile
    ? {
        href: settings.cvFile.downloadUrl,
        filename: settings.cvFile.filename,
        external: true,
      }
    : ABOUT_CV_FALLBACK.available
      ? {
          href: ABOUT_CV_FALLBACK.url,
          filename: ABOUT_CV_FALLBACK.filename,
          external: false,
        }
      : null;

  return (
    <SiteContainer>
      <Hero
        content={content}
        socialLinks={socialLinks}
        cvDownload={cvDownload}
      />
      <hr className="divider" />
      <SelectedWork projects={content.selectedProjects} />
      <ProfileAndCurrently content={content} />
      <OffScreen items={content.offScreenItems} />
      <ContactFooter settings={settings} />
    </SiteContainer>
  );
}
