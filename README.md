# Atharva Garud Portfolio

A statically generated portfolio built with Next.js App Router, TypeScript, Sanity Studio, Tailwind CSS, Motion and Lenis.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add the public Sanity project ID and confirm the dataset and API version.
3. Install dependencies with `pnpm install`.
4. Start the application with `pnpm dev`.

The public site is available at `http://localhost:3000`. The embedded Studio is available at `http://localhost:3000/studio` and uses Sanity's normal authentication.

## Environment variables

The integration uses public project identifiers only. No read or write token is required for published content.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public Sanity project identifier used by Studio and published-content queries. |
| `NEXT_PUBLIC_SANITY_DATASET` | Published dataset name; currently `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Stable Sanity API date; currently `2026-06-01`. |
| `SITE_URL` | Static fallback for canonical URLs, sitemap, robots and the production Studio address. |
| `SITE_EMAIL` | Static email fallback when Site Settings is unavailable. |
| `GITHUB_URL` | Static GitHub fallback when Site Settings is unavailable. |
| `LINKEDIN_URL` | Static LinkedIn fallback when Site Settings is unavailable. |

Do not add Sanity API tokens to `NEXT_PUBLIC_*` variables. `.env.local` and other environment files are excluded by `.gitignore`.

## Sanity configuration

The production Studio is available at `https://atharvagarud.com/studio`. If `SITE_URL` changes, use the equivalent `/studio` path on the new canonical origin.

Add these origins in Sanity Manage under API → CORS origins, with credentials enabled because Studio authentication requires them:

- `http://localhost:3000`
- `https://atharvagarud.com`

Add any actively used Vercel preview origin separately. Do not use an unrestricted wildcard origin.

Site Settings, Homepage and About Page are fixed-ID singletons. Open them from the Studio content list, edit the existing document and use Sanity's Publish action. Normal Studio controls do not allow creating, duplicating or deleting these singleton documents.

### Add a project

1. Open Projects and create a Project document.
2. Complete the title, generated slug, short description, year and category.
3. Add technologies, preview image and meaningful preview alt text where available.
4. Add a live or GitHub URL if the row should link externally.
5. Enable `Featured` when the project should be eligible for homepage fallback selection.
6. Enable the custom `Published` field, then use Sanity's Publish action.

Both publishing steps matter: draft documents and documents with the custom `Published` field disabled are excluded from the public site.

### Add a photograph

1. Open Photography and create a Photo document.
2. Complete the title, generated slug, image, meaningful alt text, year and category.
3. Add location, summary and viewer description where available.
4. Set display order, enable the custom `Published` field, then use Sanity's Publish action.

The gallery, filters and viewer use the published collection order. Viewer Previous and Next navigation stays within the active public filter.

## Caching and publishing

All public Sanity queries use the published perspective and a 3,600-second revalidation period. A deployed edit may therefore take up to approximately one hour to appear without webhook revalidation. Cache tags are already attached to each content flow so a future webhook can invalidate individual document groups.

Static fallbacks remain available for Site Settings, Homepage, About Page, Projects and Photography. Missing configuration, unpublished documents, empty collections and failed requests do not prevent public routes from rendering.

## CV and images

The About page uses the published Site Settings CV first. If no CMS file exists, it can use `/public/resume/atharva-garud-cv.pdf` when `ABOUT_CV_FALLBACK.available` in `src/data/about.ts` is set to `true`. When neither asset exists, the download button is omitted instead of linking to a missing file.

Sanity images are normalised to responsive URLs and stable dimensions before reaching page components. Local project, photography, portrait, Open Graph and Off Screen assets remain as safe fallbacks.

## Production validation

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

The intended public routes are `/`, `/projects`, `/photography`, `/about`, the isolated 404 page, `robots.txt` and `sitemap.xml`. `/studio` must also compile. Public routes should remain statically generated with ISR where Sanity content is used.
