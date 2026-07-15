import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { SiteContainer } from "@/components/site-container";

const navigation = [
  { label: "Work", href: "/projects" },
  { label: "Photography", href: "/photography" },
  { label: "About", href: "/about" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <SiteContainer className="site-header__inner">
        <Link className="site-logo" href="/" aria-label="Atharva Garud, home">
          AG
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <ul className="site-nav__links">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className="site-nav__link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
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
