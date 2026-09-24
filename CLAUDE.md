# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server at http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint across the project

There is no test framework configured. Node.js 20.9+ is required.

Note: the `dev` and `build` scripts pass `--webpack` (working-tree change) to opt out of Turbopack, even though `next.config.ts` still contains a `turbopack` block. Keep both in mind if a build behaves unexpectedly.

## Architecture

Single-page portfolio site on the Next.js 16 App Router (React 19, Tailwind CSS 4, strict TypeScript). There is one route: [src/app/page.tsx](src/app/page.tsx). Path alias `@/*` maps to `src/*`.

### Content is data, not markup

All portfolio copy (profile, experience, projects, education, certifications, skills) lives in [src/data/resume.ts](src/data/resume.ts) as typed exports. Components import from it and render — routine content edits should touch only this file and never component JSX. The downloadable resume is [public/Siddhesh_Raje_Resume.pdf](public/Siddhesh_Raje_Resume.pdf); replace it in place keeping the filename.

`page.tsx` calls `await connection()` to force dynamic rendering (needed because the CSP nonce is per-request — see below).

### Component boundary: `src/components` vs `src/projects`

- [src/components/](src/components/) — shared portfolio sections composed by `page.tsx` (Hero, FeaturedProject, ExperienceTimeline, Location, etc.).
- [src/projects/](src/projects/) — self-contained implementations of the featured demos (e.g. `blockchain-transaction-app/TransactionApp.tsx`), kept isolated so their components/hooks/assets don't mix with shared code. `FeaturedProject` renders these inline via a `variant` prop (`"market"` | `"transaction"`) driven by `projects[0]` / `projects[1]` order in `resume.ts`.

Some `src/projects/.../application/**` and `.../smart_contract/**` paths are ESLint-ignored (see `eslint.config.mjs`).

### Security model (understand before adding external resources)

[src/proxy.ts](src/proxy.ts) is the Next.js proxy (the renamed middleware in Next 16). On every non-static request it:
- redirects HTTP→HTTPS with a 308 in production,
- generates a per-request nonce, sets a strict `Content-Security-Policy` (`default-src 'self'`, `script-src` nonce + `strict-dynamic`, `connect-src 'self'`, `frame-ancestors 'none'`, etc.), and passes the nonce down via the `x-nonce` request header.

[src/app/layout.tsx](src/app/layout.tsx) reads `x-nonce` from `headers()` and attaches it to the inline theme-init script. [next.config.ts](next.config.ts) adds static hardening headers (HSTS, X-Frame-Options DENY, Permissions-Policy, COOP/CORP, etc.) and disables `poweredByHeader`.

Consequence: any new external script, image host, font, API/`fetch` target, or embed will be blocked by CSP. Update **both** `src/proxy.ts` (CSP directives) and, if needed, `next.config.ts`. Inline scripts need the nonce; inline styles are currently allowed (`style-src 'unsafe-inline'`).

### Theming

Light/dark via a `data-theme` attribute on `<html>`. A blocking inline script in `layout.tsx` sets it pre-paint from `localStorage.theme` or `prefers-color-scheme` (avoids flash); `ThemeToggle` updates it at runtime. All color tokens are CSS custom properties defined per-theme in [src/app/globals.css](src/app/globals.css) and exposed to Tailwind through an `@theme inline` block. Fonts (Space Grotesk, IBM Plex Sans/Mono) are self-hosted via `@fontsource` imports in `layout.tsx`.
