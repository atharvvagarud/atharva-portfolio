# Atharva Garud Portfolio

A statically generated portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Motion and Lenis.

## Local development

1. Copy `.env.example` to `.env.local` and add the public contact destinations.
2. Install dependencies with `pnpm install`.
3. Start the development server with `pnpm dev`.

The site is available at `http://localhost:3000` during local development.

## Production validation

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

All current application routes are designed to remain statically generated. `SITE_URL` controls canonical URLs, Open Graph metadata, `robots.txt` and the sitemap. Contact values are embedded at build time and should be configured before deployment.

## Required production assets

- Replace the centralised placeholder photography and project-preview assets when final media is available.
- Add `/public/resume/atharva-garud-cv.pdf`, then set `aboutData.cv.available` to `true`.
- Replace the placeholder Open Graph images in `/public/images/og` with final CMS-managed artwork when available.
