"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SiteContainer } from "@/components/site-container";

type NavigationItem = {
  readonly label: string;
  readonly href: string;
};

type MobileMenuProps = {
  items: readonly NavigationItem[];
};

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="mobile-menu" data-open={isOpen}>
      <button
        ref={triggerRef}
        className="mobile-menu__trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      <div id="mobile-navigation" className="mobile-menu__panel" hidden={!isOpen}>
        <SiteContainer>
          <nav aria-label="Mobile navigation">
            <ul className="mobile-menu__links">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    className="mobile-menu__link"
                    href={item.href}
                    aria-current={
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                        ? "page"
                        : undefined
                    }
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="mobile-menu__link" href="/#contact" onClick={closeMenu}>
                  Get in touch
                </Link>
              </li>
            </ul>
          </nav>
        </SiteContainer>
      </div>
    </div>
  );
}
