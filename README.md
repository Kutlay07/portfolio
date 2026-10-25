# Kutlay — Engineering Portfolio & Local Studio

A personal portfolio for AI/ML Engineering and Data Science, with technical case studies and a local content management interface. Built with React, TypeScript, Vite, and plain CSS, prepared for the existing GitHub → Cloudflare Pages publishing workflow.

The public website presents the work. Studio maintains the content without requiring edits to React components.

For the detailed Turkish operating guide, see [Portföy kullanım rehberi](KULLANIM_REHBERI.md).

## Features

- Responsive home page, project library, about section, GitHub links, and a selectable plain-text email address.
- Project detail routes with progress, technologies, source links, and Markdown reports.
- GitHub-flavored Markdown: headings, lists, tables, code, links, and images. Raw HTML execution is not enabled.
- Static project HTML, page-specific metadata, canonical URLs, social tags, sitemap, and robots file generated at build time.
- Custom favicon, keyboard focus styles, skip navigation, section scrolling, and reduced-motion support.
- Development-only Studio: create/edit, live preview, browser drafts, backup/restore, image uploads, and reversible archiving.
- Integration checks for local writing and checks of the production output.

## Run locally

Use **Node.js 24 or later** and npm. Verification scripts use Node's built-in TypeScript support.

```sh
npm ci
npm run dev
```

Open the portfolio at `http://127.0.0.1:5174/` and Studio at `http://127.0.0.1:5174/admin`.

The development server binds to the local computer. The port is fixed so browser drafts retain the same origin between sessions. If occupied, stop the older development server. Do not expose the development server through a public interface or tunnel.

## Architecture

| Location | Responsibility |
| --- | --- |
| `src/components/` | Public UI and shared Markdown renderer |
| `src/pages/` | Home, project detail, and development-only Studio |
| `src/data/site.json` | Identity, canonical deployment URL, GitHub profile, and email |
| `src/data/projects.json` | Project metadata |
| `src/content/projects/<id>.md` | Reports; file name matches the URL ID |
| `src/content/projectContent.ts` | Discover reports through Vite at build time |
| `src/studio/workspace.ts` | Draft defaults, types, and backup validation |
| `public/project-media/` | Figures and image uploads |
| `studio-plugin.ts` | Local development middleware for validated file writes |
| `scripts/generate-pages.mjs` | Static reports, route metadata, sitemap, and robots |
| `scripts/check-studio.mjs` | Test the local API using a temporary fixture |
| `scripts/check-build.mjs` | Check pages, assets, metadata, and Studio exclusion |

React Router handles in-app navigation. Route effects update metadata, move to section anchors, and reset the reading position when pages change. Production project pages also contain their reports as HTML before JavaScript loads. React replaces that initial content with `createRoot`; this is static pre-rendering, not request-time server rendering.

The home page remains a client-rendered React page. There is no hosted database or model inference service in this repository.

## Content workflow

1. Open Studio and select a saved project or **+ New**.
2. Set the title, URL ID, description, category, project progress, technologies, and optional source/demo links.
3. Write Markdown and check its live preview.
4. Add figures with **Add image**. Use PNG, JPEG, WebP, or GIF under 5 MB.
5. Choose **Save to site** to write metadata and Markdown into the local repository.
6. Review the portfolio and Git changes, then commit and push when ready to publish.

### Drafts and backups

Typing saves drafts in this browser's `localStorage`. Drafts are separate from saved site files and do not synchronize between browsers, computers, hostnames, or ports.

**Download draft backup** exports the workspace as JSON. **Restore draft backup** validates it before replacing browser drafts, with confirmation. Restoring does not modify site files. Backups do not embed images; preserve repository media separately.

**Save to site** does not commit, push, or deploy. **Discard browser draft** leaves saved site files intact. Existing project URL IDs are fixed to avoid accidental broken links.

Images are written to `public/project-media/` immediately on upload. Discarding a draft does not remove those files. Review unused media before committing.

### Archiving

**Archive project** saves its report and marks its metadata as archived. It remains available in Studio and can be restored. Archived entries are excluded from public routes, project lists, generated pages, and the sitemap after the next build.

Archiving is not access control: content can remain in JavaScript assets, Git history, old deployments, and caches. Never use a public content repository for private material.

Project progress (`planned`, `in-progress`, `completed`) describes the engineering work. It is separate from draft saving, archiving, and deployment.

## Access boundary

Studio is a **local editor**, not a hosted admin panel. Its route is guarded by Vite's development flag, and the editor is removed from production builds. The writing middleware runs only in the development server, not static production output or the production preview server.

The API requires POST requests with JSON, a matching localhost origin, and a loopback connection. It validates IDs, field sizes, categories, progress, optional links, and image signatures, and writes only to predefined content locations. No GitHub publishing tokens are stored in the browser.

This does not replace authentication or protect against someone already controlling the computer. Remote editing would need a separate authenticated backend. Robots directives guide crawlers; they do not enforce access control.

## Verification

```sh
npm run lint
npm run build
npm run test:studio
npm run test:build
```

- **Lint:** React and TypeScript lint checks.
- **Build:** TypeScript, Vite production output, static reports, and sitemap. Visible projects require nonempty Markdown reports.
- **Studio check:** Temporary fixture testing create/edit, archive/restore, backup validation, metadata preservation, Markdown persistence, media upload, duplicate URL protection, and cross-origin rejection. It opens a loopback server without changing real project content.
- **Build check:** Static report text, metadata, local assets, sitemap, and absence of the local editor in production assets.

Preview production output with `npm run preview`. Studio is intentionally absent there. Automated checks do not replace narrow/wide browser checks or a deployed-site check.

## Cloudflare Pages publishing

The existing hosting arrangement is retained:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | `24` or later |
| Canonical URL | `src/data/site.json` |

Review and commit local changes, then push to the connected GitHub branch. Cloudflare builds and deploys the repository. Check the deployment result before assuming the live website has updated; a local save does not confirm deployment.

When the domain changes, update `src/data/site.json` and the fallback head tags in `index.html`. Generated canonical links and sitemap use the site configuration. `public/_headers` supplies basic response headers on Cloudflare Pages.

For rollback, revert the content/code commit and push again, or use the hosting provider's deployment rollback. Browser backup restoration and deployment rollback are different operations.

## Content and evidence

Case studies link to actual public repositories. The GPT report uses the source project's architecture and training-loss figures; reported metrics are attributed to its README and are not presented as newly reproduced measurements. Kutlang and Applied ML Lab are marked in progress, with goals separated from completed work.

The Portfolio & Studio case study explains this repository. No fabricated scores, benchmark results, deployment claims, or completed-project labels should be used to fill missing evidence.

## Scope

Hosted login, automatic GitHub publishing, multi-user permissions, and a database are outside the current local editing workflow. The portfolio can grow as its underlying engineering projects develop.
