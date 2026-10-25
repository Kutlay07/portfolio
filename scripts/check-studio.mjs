import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createServer } from 'vite'
import studioPlugin from '../studio-plugin.ts'
import { blankDraft, parseWorkspace } from '../src/studio/workspace.ts'

const backup = { active: 'draft:new', drafts: { 'draft:new': blankDraft() } }
assert.deepEqual(parseWorkspace(JSON.stringify(backup)), backup)
assert.throws(() => parseWorkspace('{"active":"missing","drafts":{}}'))
assert.throws(() => parseWorkspace(JSON.stringify({ active: 'draft:new', drafts: { 'draft:new': { ...blankDraft(), markdown: null } } })))
assert.throws(() => parseWorkspace(JSON.stringify({ active: 'draft:new', drafts: { 'draft:new': { ...blankDraft(), github: 'javascript:alert(1)' } } })))

const root = await mkdtemp(path.join(tmpdir(), 'portfolio-studio-check-'))
let server
try {
  await mkdir(path.join(root, 'src/data'), { recursive: true })
  await writeFile(path.join(root, 'src/data/projects.json'), '[]')
  server = await createServer({ configFile: false, root, plugins: [studioPlugin()], server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' })
  await server.listen()
  const address = server.httpServer.address()
  const origin = `http://127.0.0.1:${address.port}`
  const post = (endpoint, value, extra = {}) => fetch(`${origin}/__studio/${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, ...extra }, body: JSON.stringify(value),
  })
  const project = { id: 'test-project', title: 'Test project', category: 'Data Science', description: 'A fixture used only by the integration check.', technologies: [' Python ', ''], status: 'in-progress', year: 2026, featured: true, markdown: '## Results\n\n| Metric | Result |\n| --- | --- |\n| Test | Passed |\n' }
  assert.equal((await post('save', project, { Origin: 'https://untrusted.example' })).status, 403)
  assert.equal((await post('save', { ...project, id: '../escape' })).status, 400)
  assert.equal((await post('save', { ...project, github: 'javascript:alert(1)' })).status, 400)
  assert.equal((await post('save', project)).status, 200)
  let entries = JSON.parse(await readFile(path.join(root, 'src/data/projects.json'), 'utf8'))
  assert.equal(entries.length, 1)
  assert.deepEqual(entries[0].technologies, ['Python'])
  assert.equal(await readFile(path.join(root, 'src/content/projects/test-project.md'), 'utf8'), project.markdown)
  assert.equal((await post('save', project)).status, 400, 'New drafts must not overwrite an existing URL')
  assert.equal((await post('save', { ...project, originalId: project.id, title: 'Updated project' })).status, 200)
  entries = JSON.parse(await readFile(path.join(root, 'src/data/projects.json'), 'utf8'))
  assert.equal(entries.length, 1)
  assert.equal(entries[0].title, 'Updated project')
  assert.equal(entries[0].year, 2026)
  assert.equal(entries[0].featured, true)
  const archiveResponse = await post('save', { ...project, originalId: project.id, archived: true })
  assert.equal(archiveResponse.status, 200)
  assert.equal((await archiveResponse.json()).project.archived, true)
  assert.equal(await readFile(path.join(root, 'src/content/projects/test-project.md'), 'utf8'), project.markdown)
  const restoreResponse = await post('save', { ...project, originalId: project.id, archived: false })
  assert.equal(restoreResponse.status, 200)
  assert.equal((await restoreResponse.json()).project.archived, false)
  assert.equal((await post('save', { ...project, originalId: project.id, archived: 'true' })).status, 400)
  assert.equal((await post('image', { data: 'data:image/png;base64,aGVsbG8=' })).status, 400)
  const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2ioAAAAASUVORK5CYII='
  const imageResponse = await post('image', { data: `data:image/png;base64,${png}` })
  assert.equal(imageResponse.status, 200)
  const image = await imageResponse.json()
  assert.match(image.url, /^\/project-media\/[a-f0-9-]+\.png$/)
  assert.deepEqual(await readFile(path.join(root, 'public', image.url.slice(1))), Buffer.from(png, 'base64'))
  console.log('PASS: draft backup validation, project creation/editing, archive/restore, metadata preservation, Markdown persistence, image upload, duplicate protection, input validation, and cross-origin rejection.')
} finally {
  await server?.close()
  if (path.dirname(root) === path.resolve(tmpdir()) && path.basename(root).startsWith('portfolio-studio-check-')) {
    await rm(root, { recursive: true, force: true })
  }
}
