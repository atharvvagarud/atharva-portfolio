"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  readonly label: string;
  readonly href: string;
};

export function DesktopNavigation({
  items,
}: {
  items: readonly NavigationItem[];
}) {
  const pathname = usePathname();

  return (
    <ul className="site-nav__links">
      {items.map((item) => {
        const isCurrent =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              className="site-nav__link"
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
