import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LondonTime } from "@/components/london-time";
import { HeroReveal, RevealArticle, SectionReveal } from "@/components/motion/reveal";
import { SiteContainer } from "@/components/site-container";
import { pageSeo } from "@/config/site";
import { homepageData } from "@/data/homepage";
import { createPageMetadata } from "@/lib/seo";
import { getSiteContactLinks, type SiteLink } from "@/lib/site-links";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";
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
  settings,
  socialLinks,
}: {
  settings: SiteSettings;
  socialLinks: readonly SiteLink[];
}) {
  const [firstName, ...remainingName] = homepageData.name.split(" ");

  return (
    <HeroReveal className="home-hero" aria-labelledby="home-title">
      <p className="availability">
        <span className="status-dot" aria-hidden="true" />
        {settings.availabilityLabel}
      </p>

      <div className="home-hero__title-row">
        <h1 id="home-title" className="home-title">
          <span>{firstName}</span>
          <span>{remainingName.join(" ")}</span>
        </h1>

        <aside className="location-block" aria-label="Location and local time">
          <p>{settings.location}</p>
          <p>
            <span>Local time</span>
            <LondonTime />
          </p>
        </aside>
      </div>

      <div className="home-introduction">
        {homepageData.introduction.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
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

function SelectedWork() {
  return (
    <section id="selected-work" className="home-section" aria-labelledby="selected-work-title">
      <SectionLabel id="selected-work-title" number="01">Selected work</SectionLabel>

      <div className="project-list">
        {homepageData.projects.map((project, index) => (
          <RevealArticle className="project-row" delay={index * 0.05} key={project.index}>
            <p className="project-row__index">{project.index}</p>
            <div className="project-row__title-wrap">
              <h3 className="project-row__title">{project.title}</h3>
            </div>
            <div className="project-row__summary">
              <p>{project.description}</p>
              <ul aria-label={`${project.title} technologies`}>
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
            <p className="project-row__year">{project.year}</p>
            <Link className="project-row__link" href={project.href} aria-label={`View ${project.title}`}>
              <ArrowRight aria-hidden="true" size={22} strokeWidth={1.4} />
            </Link>
          </RevealArticle>
        ))}
      </div>
    </section>
  );
}

function ProfileAndCurrently() {
  return (
    <SectionReveal className="profile-currently" aria-label="Profile and current interests">
      <div className="profile-block">
        <SectionLabel number="02">Profile</SectionLabel>
        <p className="profile-copy">{homepageData.profile}</p>
        <dl className="profile-highlights">
          {homepageData.highlights.map((highlight) => (
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
          {homepageData.currently.map((item) => (
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

function OffScreen() {
  return (
    <SectionReveal className="home-section off-screen" aria-labelledby="off-screen-title">
      <SectionLabel id="off-screen-title" number="04">Off screen</SectionLabel>
      <div className="off-screen-grid">
        {homepageData.offScreenImages.map((image) => (
          <figure key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 639px) calc((100vw - 3.75rem) / 2), (max-width: 1023px) calc((100vw - 7.5rem) / 4), 23vw"
            />
          </figure>
        ))}
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
  const socialLinks = getSiteContactLinks(settings);

  return (
    <SiteContainer>
      <Hero settings={settings} socialLinks={socialLinks} />
      <hr className="divider" />
      <SelectedWork />
      <ProfileAndCurrently />
      <OffScreen />
      <ContactFooter settings={settings} socialLinks={socialLinks} />
    </SiteContainer>
  );
}
