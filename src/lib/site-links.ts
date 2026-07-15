import type { SiteSettings } from "@/types/site-settings";

export type SiteLink = {
  readonly label: "Email" | "GitHub" | "LinkedIn" | "Instagram";
  readonly href: string;
  readonly external?: boolean;
};

export function getSiteContactLinks(settings: SiteSettings): readonly SiteLink[] {
  return [
    ...(settings.githubUrl
      ? [{ label: "GitHub", href: settings.githubUrl, external: true } as const]
      : []),
    ...(settings.linkedinUrl
      ? [
          {
            label: "LinkedIn",
            href: settings.linkedinUrl,
            external: true,
          } as const,
        ]
      : []),
    ...(settings.email
      ? [{ label: "Email", href: `mailto:${settings.email}` } as const]
      : []),
  ];
}
