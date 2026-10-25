# Portfolio Studio

Run `npm run dev` and open `/admin` on the local URL printed by Vite.

- Create a project or choose an existing one from the sidebar.
- Edit the title, URL, category, description, technologies, links, and Markdown write-up.
- Changes are saved as browser drafts. Drafts do not update site files. Download a draft backup before clearing browser storage or switching browsers or local server URLs.
- Use **Add image** to copy a PNG, JPEG, WebP, or GIF under 5 MB into `public/project-media/` and insert a Markdown image link. Uploading an image writes the file immediately, even if the draft is later discarded.
- **Save to site** writes metadata to `src/data/projects.json` and the report to `src/content/projects/<id>.md`. It updates the local portfolio. Existing project URLs are fixed to prevent broken links.
- Review, commit, and push the changed files to publish through the existing GitHub → Cloudflare Pages integration. Studio does not commit or push automatically.
- **Discard browser draft** removes only the browser copy; saved site files remain.
- **Restore draft backup** validates an exported workspace before replacing browser drafts. Images are not embedded in backups.
- **Archive project** hides a saved project while retaining its files. Restore it from Studio at any time. Push changes to update the live site. Archiving does not make previously published content private.

The editor route and code are excluded from production builds. The file-writing API is a Vite development plugin; it runs only in the development server and accepts same-origin requests from a loopback browser. It is not a production authentication system. Remote administration and GitHub publishing require a separate authenticated backend.

## Verification

With Node.js 24 or later:

```sh
npm run lint
npm run build
node scripts/check-studio.mjs
npm run test:build
```

The integration check uses a temporary fixture and does not change portfolio content.
