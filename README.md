# Atharva Garud Portfolio

A statically generated portfolio built with Next.js App Router, TypeScript, Sanity Studio, Tailwind CSS, Motion and Lenis.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add the public Sanity project ID and confirm the dataset and API version.
3. Install dependencies with `pnpm install`.
4. Start the application with `pnpm dev`.

The public site is available at `http://localhost:3000`. The embedded Studio is available at `http://localhost:3000/studio` and uses Sanity's normal authentication.

## Environment variables

Published content uses public project identifiers only. Draft Mode additionally uses a server-only read token; no write token is required.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public Sanity project identifier used by Studio and published-content queries. |
| `NEXT_PUBLIC_SANITY_DATASET` | Published dataset name; currently `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Stable Sanity API date; currently `2026-06-01`. |
| `SANITY_REVALIDATE_SECRET` | Server-only random secret that authenticates Sanity revalidation webhooks. |
| `SANITY_API_READ_TOKEN` | Server-only Sanity token with Viewer access for reading draft documents. |
| `SANITY_PREVIEW_SECRET` | Server-only random secret that protects the Draft Mode enable endpoint. |
| `SITE_URL` | Static fallback for canonical URLs, sitemap, robots and the production Studio address. |
| `SITE_EMAIL` | Static email fallback when Site Settings is unavailable. |
| `GITHUB_URL` | Static GitHub fallback when Site Settings is unavailable. |
| `LINKEDIN_URL` | Static LinkedIn fallback when Site Settings is unavailable. |

Do not add Sanity API tokens, `SANITY_PREVIEW_SECRET` or `SANITY_REVALIDATE_SECRET` to `NEXT_PUBLIC_*` variables. `.env.local` and other environment files are excluded by `.gitignore`.

## Sanity configuration

The production Studio is available at `https://atharva-portfolio-gold.vercel.app/studio`. If `SITE_URL` changes, use the equivalent `/studio` path on the new canonical origin.

Add these origins in Sanity Manage under API → CORS origins, with credentials enabled because Studio authentication requires them:

- `http://localhost:3000`
- `https://atharva-portfolio-gold.vercel.app`

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

All public Sanity queries use the published perspective and a 3,600-second revalidation period. The `/api/revalidate` webhook expires only the affected cache tags and page paths when Sanity content changes. The one-hour ISR period remains the fallback if a webhook is delayed or unavailable.

Static fallbacks remain available for Site Settings, Homepage, About Page, Projects and Photography. Missing configuration, unpublished documents, empty collections and failed requests do not prevent public routes from rendering.

### Configure on-demand revalidation

1. Generate a long random value locally and set it as `SANITY_REVALIDATE_SECRET` in `.env.local`. Never commit the value.
2. Add the same variable to the Production environment in Vercel, then redeploy so the route can read it.
3. In Sanity Manage, open API → Webhooks and create a GROQ-powered webhook.
4. Set the production URL to `https://atharva-portfolio-gold.vercel.app/api/revalidate` and the HTTP method to `POST`.
5. Select the `production` dataset and enable create, update and delete triggers. Leave draft and version document triggers disabled.
6. Use this filter so unrelated document types do not trigger the endpoint:

   ```groq
   _type in ["siteSettings", "homepage", "aboutPage", "project", "photo"]
   ```

7. Use this minimal payload projection:

   ```groq
   {
     "_type": _type,
     "_id": _id
   }
   ```

8. Add the custom HTTP header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`, substituting the configured value. Do not put the secret in the webhook URL or its GROQ payload. This endpoint uses the custom header directly, so the separate Sanity signature-secret field is not required. The endpoint also accepts `x-sanity-revalidation-secret`, but only one authentication header is needed.
9. Save and enable the webhook. Sanity's attempts log should show a `200` response after a supported document is published, unpublished or deleted.

For local testing, point a temporary webhook at a secure tunnel that forwards to `http://localhost:3000/api/revalidate`; Sanity cannot reach localhost directly. Use a separate development secret and remove the temporary webhook or tunnel after testing.

To test production, publish a small content change in Studio, confirm the webhook attempt returned `200`, then load the affected public route in a fresh browser request. The response identifies the document type, invalidated tags and invalidated paths without returning the secret or document body.

## Draft Mode preview

Draft Mode lets an authenticated editor view unpublished Site Settings, Homepage, About Page, Project and Photography changes on the real portfolio routes. It does not enable Visual Editing, click-to-edit overlays or the Presentation Tool.

### Create preview credentials

1. In Sanity Manage, open the project and go to API → Tokens.
2. Create a token with the built-in Viewer role, name it for portfolio preview use, and copy it when shown. Viewer access is read-only; do not create an Editor or write token for this feature.
3. Store that value as `SANITY_API_READ_TOKEN`.
4. Generate an independent preview secret, for example with `openssl rand -hex 32`, and store it as `SANITY_PREVIEW_SECRET`.
5. Keep both values server-only and never commit them.

For local development, add both values to `.env.local` and restart `pnpm dev`. In Vercel, add both variables to the environments where preview should work, then redeploy. Do not expose either variable through a `NEXT_PUBLIC_*` name.

Enable preview by opening a URL in this format:

```text
https://atharva-portfolio-gold.vercel.app/api/draft-mode/enable?secret=YOUR_PREVIEW_SECRET&redirect=/
```

The only supported redirect values are `/`, `/about`, `/projects` and `/photography`. Replace the redirect value to open another supported page. Do not share, bookmark, screenshot or place preview URLs containing the secret in Studio content, analytics or public documentation.

Once enabled, a fixed indicator identifies unpublished preview content. Use its `Exit preview` button to submit a non-prefetched POST request to `/api/draft-mode/disable`; this clears the Draft Mode cookie and returns to the published homepage.

Preview requests use Sanity's `drafts` perspective, the read token, the live API and `no-store` request caching. Public requests continue using the `published` perspective, CDN delivery, cache tags, webhook revalidation and the 3,600-second ISR fallback. The public project and photo queries still require their custom `Published` field; preview queries deliberately include false or missing values.

To verify isolation, open preview in one browser profile and leave a private window outside preview. Draft changes should appear only in the first profile. After using `Exit preview`, both profiles should show the currently published content.

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
