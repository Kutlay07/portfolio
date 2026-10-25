import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = path.join(root, 'dist')
const site = JSON.parse(await readFile(path.join(root, 'src/data/site.json'), 'utf8'))
const projects = JSON.parse(await readFile(path.join(root, 'src/data/projects.json'), 'utf8')).filter(p => !p.archived)
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const home = await readFile(path.join(dist, 'index.html'), 'utf8')
assert.ok(home.includes(`<title>${escape(site.title)}</title>`))
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
for (const project of projects) {
  const html = await readFile(path.join(dist, 'projects', project.id, 'index.html'), 'utf8')
  assert.ok(html.includes(`<title>${escape(project.title)} — ${escape(site.name)}</title>`))
  assert.ok(html.includes(`<h1>${escape(project.title)}</h1>`), 'Project text must be present without running JavaScript')
  assert.ok(html.includes(`<article class="markdown-body">`))
  assert.ok(html.includes(`content="${escape(project.description)}"`))
  assert.ok(sitemap.includes(`${site.url}/projects/${project.id}/`))
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    const target = path.join(dist, match[1].slice(1))
    const info = await stat(target)
    assert.ok(info.isFile() || info.isDirectory(), `Missing local asset: ${match[1]}`)
  }
}
for (const file of await readdir(path.join(dist, 'assets'))) {
  if (!/\.(?:js|css)$/.test(file)) continue
  const value = await readFile(path.join(dist, 'assets', file), 'utf8')
  for (const marker of ['Portfolio Studio', '/__studio/', 'portfolio-studio-v1', 'Download draft backup']) {
    assert.ok(!value.includes(marker), `Local Studio code leaked into production: ${marker}`)
  }
}
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8')
assert.ok(robots.includes('Disallow: /admin'))
assert.ok(robots.includes(`${site.url}/sitemap.xml`))
console.log(`PASS: ${projects.length} static case studies, metadata, local assets, sitemap, and Studio exclusion.`)
