import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LondonTime } from "@/components/london-time";
import { HeroReveal, RevealArticle, SectionReveal } from "@/components/motion/reveal";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
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

  return createPageMetadata(
    {
      ...pageSeo.home,
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      image: settings.defaultOpenGraphImage.url,
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
}: {
  content: HomepageContent;
  socialLinks: readonly SiteLink[];
}) {
  return (
    <HeroReveal className="home-hero" aria-labelledby="home-title">
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
        <Link className="button-primary home-work-button" href="#selected-work">
          View selected work
          <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
        </Link>

        {socialLinks.length > 0 ? (
          <div className="home-socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} {...link} />
            ))}
          </div>
        ) : null}
      </div>
    </HeroReveal>
  );
}

function SelectedWork({ projects }: { projects: readonly Project[] }) {
  return (
    <section id="selected-work" className="home-section" aria-labelledby="selected-work-title">
      <SectionLabel id="selected-work-title" number="01">Selected work</SectionLabel>

      <div className="project-list">
        {projects.map((project, index) => {
          const destination = getProjectDestination(project);
          const indexLabel = String(index + 1).padStart(2, "0");

          return (
            <RevealArticle
              className="project-row"
              delay={index * 0.05}
              key={project.id}
            >
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
            </RevealArticle>
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
    <SectionReveal className="profile-currently" aria-label="Profile and current interests">
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
    </SectionReveal>
  );
}

function OffScreenPanel({ item }: { item: HomepageOffScreenItem }) {
  const isText = item.type === "text";
  const panel = (
    <article className={`off-screen-panel off-screen-panel--${item.type}`}>
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
    <SectionReveal className="home-section off-screen" aria-labelledby="off-screen-title">
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
    </SectionReveal>
  );
}

function ContactFooter({
  settings,
  socialLinks,
}: {
  settings: SiteSettings;
  socialLinks: readonly SiteLink[];
}) {
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

      <p className="contact-footer__location">{settings.location}</p>

      {socialLinks.length > 0 ? (
        <nav className="contact-footer__links" aria-label="Contact links">
          {socialLinks.map((link) => (
            <SocialLink key={link.label} {...link} />
          ))}
        </nav>
      ) : null}
    </footer>
  );
}

export default async function Home() {
  const settings = await getSiteSettings();
  const content = await getHomepageContent(settings.location);
  const socialLinks = getSiteContactLinks(settings);

  return (
    <SiteContainer>
      <Hero content={content} socialLinks={socialLinks} />
      <hr className="divider" />
      <SelectedWork projects={content.selectedProjects} />
      <ProfileAndCurrently content={content} />
      <OffScreen items={content.offScreenItems} />
      <ContactFooter settings={settings} socialLinks={socialLinks} />
    </SiteContainer>
  );
}
