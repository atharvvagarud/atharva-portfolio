import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteHeader } from "@/components/site-header";
import { pageSeo, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.siteTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.siteTitle,
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: siteConfig.siteTitle,
    title: siteConfig.siteTitle,
    description: siteConfig.description,
    images: [
      {
        url: pageSeo.home.image,
        width: 1200,
        height: 630,
        alt: pageSeo.home.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteTitle,
    description: siteConfig.description,
    images: [pageSeo.home.image],
  },
  robots: {
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
    icon: [{ url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
};

const personSameAs = [siteConfig.githubUrl, siteConfig.linkedinUrl].filter(
  (url): url is string => Boolean(url),
);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.siteUrl}/#person`,
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      ...(siteConfig.email ? { email: `mailto:${siteConfig.email}` } : {}),
      ...(personSameAs.length > 0 ? { sameAs: personSameAs } : {}),
      homeLocation: {
        "@type": "Place",
        name: siteConfig.location,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.siteUrl}/#website`,
      url: siteConfig.siteUrl,
      name: siteConfig.siteTitle,
      description: siteConfig.description,
      inLanguage: "en-GB",
      author: {
        "@id": `${siteConfig.siteUrl}/#person`,
      },
    },
  ],
};

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    </SmoothScrollProvider>
  );
}
