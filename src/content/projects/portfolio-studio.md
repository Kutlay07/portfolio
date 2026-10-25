## The problem

An engineering portfolio needs more than project cards. Each project should explain the problem, technical decisions, evidence, and limitations. Updating those reports should not require editing React components every time.

This project combines a public portfolio with a local content studio for maintaining those write-ups.

## Public portfolio

The interface uses React, TypeScript, Vite, and plain CSS. It has a project library, individual case-study routes, an about section, and contact information. A shared Markdown renderer supports headings, tables, code blocks, links, and figures.

Each production build also generates static project HTML, page-specific metadata, and a sitemap. Readers and crawlers can access the project text before JavaScript loads; React handles navigation after the app starts.

## Content Studio

The development-only Studio supports project creation and editing, browser drafts, Markdown preview, image uploads, draft backup and restore, and reversible project archiving.

| Content | Stored in |
| --- | --- |
| Project titles, descriptions, technologies, and links | A JSON file in the repository |
| Technical reports | One Markdown file per project |
| Uploaded figures | The public media directory |
| Unsaved drafts | Browser storage, with export and restore |

## Publishing workflow

```text
Edit in Studio
  → preview the report
  → save to local project files
  → review and commit the changes
  → push to GitHub
  → Cloudflare Pages builds and deploys the site
```

Saving to site updates the local files. It does not automatically commit, push, or deploy. Keeping content in Git makes the published version reviewable and provides history without a content database.

## Access boundary

The Studio route and editor code are excluded from the production bundle. Its file-writing API exists only in the Vite development server and checks the request origin, host, and loopback connection. The development server is configured to bind to the local computer.

This is a local editing workflow. It does not provide remote account login, multi-user collaboration, or a production administration API. Archived projects are removed from public navigation and generated pages; archiving is not a secrecy mechanism or a way to erase previously published content.

## Verification

The repository includes lint and TypeScript/build checks, an isolated integration check for the local file-writing API, and production-output checks. The integration check covers project creation and editing, media upload, duplicate URL protection, validation, and rejection of requests from a different origin.

## Trade-offs

This design keeps hosting static and avoids a database or stored GitHub credentials. In return, editing requires the local development environment and publishing requires a Git push. Browser drafts also need backup if browser data is cleared.

## Explore the implementation

The [portfolio repository](https://github.com/Kutlay07/portfolio) contains the source. Its README explains the architecture, local setup, content lifecycle, checks, and Cloudflare publishing steps.
