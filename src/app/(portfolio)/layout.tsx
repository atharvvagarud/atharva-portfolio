import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PreviewIndicator } from "@/components/preview-indicator";
import { SiteHeader } from "@/components/site-header";
import { pageSeo, siteOwnerName } from "@/config/site";
import { siteSettingsFallback } from "@/config/site-fallback";
import { getSiteSettings } from "@/sanity/lib/get-site-settings";

function validMetadataBase(value: string): URL {
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return url;
  } catch {
    // Fall through to the known-valid static production URL.
  }

  return new URL(siteSettingsFallback.productionSiteUrl);
}

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: isDraftMode } = await draftMode();
  const settings = await getSiteSettings();
  const image = settings.defaultOpenGraphImage;

  return {
    metadataBase: validMetadataBase(settings.productionSiteUrl),
    title: {
      default: settings.defaultSeoTitle,
      template: `%s | ${siteOwnerName}`,
    },
    description: settings.defaultSeoDescription,
    applicationName: settings.siteTitle,
    authors: [{ name: siteOwnerName, url: settings.productionSiteUrl }],
    creator: siteOwnerName,
    publisher: siteOwnerName,
    category: "technology",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: "/",
      siteName: settings.siteTitle,
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: pageSeo.home.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      images: [image.url],
    },
    robots: isDraftMode
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "16x16 32x32",
          type: "image/x-icon",
        },
      ],
      shortcut: "/favicon.ico",
    },
    formatDetection: { address: false, email: false, telephone: false },
  };
}

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();
  const settings = await getSiteSettings();
  const personSameAs = [
    settings.githubUrl,
    settings.linkedinUrl,
    settings.instagramUrl,
  ].filter((url): url is string => Boolean(url));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${settings.productionSiteUrl}/#person`,
        name: siteOwnerName,
        url: settings.productionSiteUrl,
        ...(settings.email ? { email: `mailto:${settings.email}` } : {}),
        ...(personSameAs.length > 0 ? { sameAs: personSameAs } : {}),
        homeLocation: { "@type": "Place", name: settings.location },
      },
      {
        "@type": "WebSite",
        "@id": `${settings.productionSiteUrl}/#website`,
        url: settings.productionSiteUrl,
        name: settings.siteTitle,
        description: settings.defaultSeoDescription,
        inLanguage: "en-GB",
        author: { "@id": `${settings.productionSiteUrl}/#person` },
      },
    ],
  };

  return (
    <SmoothScrollProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      {isDraftMode ? <PreviewIndicator /> : null}
    </SmoothScrollProvider>
  );
}
