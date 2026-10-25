import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const root = fileURLToPath(new URL('../', import.meta.url))
const site = JSON.parse(await readFile(path.join(root, 'src/data/site.json'), 'utf8'))
const allProjects = JSON.parse(await readFile(path.join(root, 'src/data/projects.json'), 'utf8'))
const projects = allProjects.filter(project => !project.archived)
const output = path.join(root, 'dist')
const html = await readFile(path.join(output, 'index.html'), 'utf8')
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function metadata(source, title, description, url) {
  return source
    .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g, (_, a, b) => a + escape(description) + b)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*("\s*\/?>)/g, (_, a, b) => a + escape(title) + b)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, (_, a, b) => a + escape(url) + b)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, (_, a, b) => a + escape(url) + b)
}

const urls = [`${site.url}/`]
await writeFile(path.join(output, 'index.html'), metadata(html, site.title, site.description, urls[0]))
const ids = new Set()
for (const project of allProjects) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id) || ids.has(project.id)) throw new Error(`Invalid or duplicate project ID: ${project.id}`)
  ids.add(project.id)
}
for (const project of projects) {
  const url = `${site.url}/projects/${project.id}/`
  const markdown = await readFile(path.join(root, 'src/content/projects', `${project.id}.md`), 'utf8')
  if (!markdown.trim()) throw new Error(`Project ${project.id} needs a write-up before it can be built.`)
  const report = renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], children: markdown }))
  // Static project text is readable before JavaScript loads; React replaces it on mount.
  const body = `<main class="page project-detail"><a href="/">← All projects</a><p class="eyebrow">${escape(project.category)}</p><h1>${escape(project.title)}</h1><p>${escape(project.description)}</p><article class="markdown-body">${report}</article></main>`
  const page = metadata(html, `${project.title} — ${site.name}`, project.description, url)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace(/<noscript>.*?<\/noscript>/s, '')
  const directory = path.join(output, 'projects', project.id)
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'index.html'), page)
  urls.push(url)
}
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`)
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /__studio\nSitemap: ${site.url}/sitemap.xml\n`)
console.log(`Generated ${projects.length} static project pages, route metadata, and sitemap.`)
