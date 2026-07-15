import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
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

        <details className="mobile-menu">
          <summary>
            <span className="mobile-menu__open-label">Menu</span>
            <span className="mobile-menu__close-label">Close</span>
          </summary>
          <div className="mobile-menu__panel">
            <SiteContainer>
              <nav aria-label="Mobile navigation">
                <ul className="mobile-menu__links">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <Link className="mobile-menu__link" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link className="mobile-menu__link" href="/#contact">
                      Get in touch
                    </Link>
                  </li>
                </ul>
              </nav>
            </SiteContainer>
          </div>
        </details>
      </SiteContainer>
    </header>
  );
}
