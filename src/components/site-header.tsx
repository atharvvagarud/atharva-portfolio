import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DesktopNavigation } from "@/components/desktop-navigation";
import { MobileMenu } from "@/components/mobile-menu";
import { SiteContainer } from "@/components/site-container";
import { siteOwnerName } from "@/config/site";

const navigation = [
  { label: "Work", href: "/projects" },
  { label: "Photography", href: "/photography" },
  { label: "About", href: "/about" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <SiteContainer className="site-header__inner">
        <Link className="site-logo" href="/" aria-label={`${siteOwnerName}, home`}>
          AG
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <DesktopNavigation items={navigation} />
          <Link className="button-primary button-primary--outline" href="/#contact">
            Get in touch
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
        </nav>

        <MobileMenu items={navigation} />
      </SiteContainer>
    </header>
  );
}
