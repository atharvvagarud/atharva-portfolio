# Atharva Portfolio — Project Instructions

## Objective

Build a polished, minimal portfolio website for Atharva Garud, a First-Class Computer Science graduate and software engineer based in London.

The website must follow the supplied reference images in the `/references` directory. These images are the visual source of truth.

Do not redesign the website unless explicitly instructed.

## Technology

- Next.js App Router
- TypeScript with strict typing
- Tailwind CSS
- Motion for restrained interaction animation
- Lucide React for icons
- Next.js Image
- Static local content
- Vercel-compatible deployment

Do not introduce:

- A database
- Authentication
- A CMS
- shadcn/ui unless specifically requested
- Heavy animation libraries
- WebGL
- A custom cursor
- Scroll hijacking
- Unnecessary dependencies

## Visual system

The site uses:

- Warm cream background
- Near-black primary text
- Muted grey secondary text
- Thin light-grey borders
- Small green accent indicators
- Geist Sans for normal text
- Geist Mono for labels, metadata and buttons
- Large editorial typography
- Generous whitespace
- Square or subtly rounded corners
- Minimal shadows
- Uppercase monospaced metadata
- Numbered section labels

Use the same visual language on every route.

Do not add:

- Gradients
- Glassmorphism
- Large border radii
- Colourful technology logos
- Skill progress bars
- Generic dashboard cards
- Excessive shadows
- Decorative blobs
- AI-style floating elements

## Design tokens

Use CSS variables in `globals.css`.

Suggested starting values:

- Background: `#f3f0e9`
- Foreground: `#161614`
- Muted foreground: `#686861`
- Border: `#d5d1c8`
- Accent green: `#78c850`
- Maximum content width: `1600px`

These may be adjusted slightly to better match the reference images.

## Responsive behaviour

The site must work at:

- 1440px desktop
- 1024px laptop
- 768px tablet
- 390px mobile

Do not simply shrink the desktop page.

Desktop layouts should collapse into a deliberate mobile hierarchy.

## Accessibility

- Use semantic HTML
- Include visible keyboard focus states
- Ensure all interactive elements are keyboard accessible
- Use proper heading hierarchy
- Provide image alt text
- Respect `prefers-reduced-motion`
- Maintain sufficient colour contrast
- Trap focus inside the photography modal
- Close the modal using Escape
- Restore focus when the modal closes

## Engineering standards

- Use reusable components
- Keep page-specific components close to their feature
- Keep static content separate from presentation
- Avoid `any`
- Avoid oversized components
- Avoid unnecessary client components
- Only use `"use client"` where interaction requires it
- Run lint and type checking after meaningful changes
- Do not modify unrelated files
- Explain important architectural choices in concise comments only where needed

## Routes

Initial routes:

- `/`
- `/projects`
- `/photography`
- `/about`
- `not-found.tsx`

The photography viewer is initially implemented as an accessible modal overlay on `/photography`.

## Content rules

Use realistic placeholder copy when final content has not yet been supplied.

Clearly centralise placeholders so they can be replaced later.

Do not invent professional experience, employers, project results or personal achievements.

## Workflow

Before implementing a task:

1. Inspect existing files.
2. Inspect the relevant reference image.
3. State the files that need to change.
4. Implement only the requested scope.
5. Run lint and type checking.
6. Report what changed and any remaining limitations.

Prefer several small, reviewable changes over one large rewrite.

## Future CMS compatibility

All editable content must remain separate from presentation components.

Pages and components should consume typed content through props or data-access functions.

Do not hardcode editable copy, project records, photo metadata, social links, availability text or asset paths deep inside presentation components.

Maintain a clear data-access layer so the current static TypeScript content can later be replaced with Payload CMS without redesigning page components.

Stable visual structure may remain in components, but user-editable content must be centralised.