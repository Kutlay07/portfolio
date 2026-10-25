import type { Plugin } from 'vite'
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import type { IncomingMessage } from 'node:http'

const categories = ['AI Engineering', 'Machine Learning', 'Data Science', 'Deep Learning', 'Software Engineering']
const statuses = ['completed', 'in-progress', 'planned']
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

async function body(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 7_000_000) throw new Error('Request too large. Images must be under 5 MB.')
    chunks.push(Buffer.from(chunk))
  }
  const value: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid request.')
  return value as Record<string, unknown>
}

export default function studioPlugin(): Plugin {
  let root: string
  let saving = false
  return {
    name: 'local-portfolio-studio',
    apply: 'serve',
    configResolved(config) { root = config.root },
    configureServer(server) {
      server.middlewares.use('/__studio', async (req, res) => {
        const send = (status: number, data: unknown) => {
          res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
          res.end(JSON.stringify(data))
        }
        // This file-writing API is available only to a same-origin loopback browser.
        const ip = req.socket.remoteAddress
        const host = req.headers.host ?? ''
        const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host)
        if (!localHost || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip ?? '') ||
            req.headers.origin !== `http://${host}` || req.headers['content-type'] !== 'application/json') {
          send(403, { error: 'Studio writes require a same-origin localhost browser.' })
          return
        }
        if (req.method !== 'POST') { send(405, { error: 'POST required.' }); return }
        if (!['/save', '/image'].includes(req.url ?? '')) { send(404, { error: 'Unknown endpoint.' }); return }
        if (saving) { send(409, { error: 'A save is in progress. Try again.' }); return }
        saving = true
        try {
          const value = await body(req)
          if (req.url === '/image') {
            if (typeof value.data !== 'string') throw new Error('Image data is required.')
            const match = /^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(value.data)
            if (!match) throw new Error('Use a PNG, JPEG, WebP, or GIF image.')
            const bytes = Buffer.from(match[2], 'base64')
            if (!bytes.length || bytes.length > 5_000_000) throw new Error('Images must be under 5 MB.')
            const signatures: Record<string, boolean> = {
              png: bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
              jpeg: bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
              gif: /^GIF8[79]a$/.test(bytes.subarray(0, 6).toString()),
              webp: bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP',
            }
            if (!signatures[match[1]]) throw new Error('The file does not match its image type.')
            const name = `${randomUUID()}.${match[1] === 'jpeg' ? 'jpg' : match[1]}`
            const dir = path.join(root, 'public/project-media')
            await mkdir(dir, { recursive: true })
            await writeFile(path.join(dir, name), bytes)
            send(200, { url: `/project-media/${name}` })
            return
          }
          const { id, title, category, description, technologies, status, github, demo, markdown } = value
          if (typeof id !== 'string' || id.length > 80 || !slugPattern.test(id)) throw new Error('Use a lowercase project URL with letters, numbers, and hyphens.')
          if (typeof title !== 'string' || !title.trim() || title.length > 160) throw new Error('A project title under 160 characters is required.')
          if (!categories.includes(String(category)) || !statuses.includes(String(status))) throw new Error('Invalid category or project status.')
          if (typeof description !== 'string' || !description.trim() || description.length > 2000) throw new Error('A description under 2,000 characters is required.')
          if (!Array.isArray(technologies) || technologies.length > 30 || !technologies.every(t => typeof t === 'string' && t.length <= 80)) throw new Error('Invalid technologies.')
          if (typeof markdown !== 'string' || !markdown.trim() || markdown.length > 500_000) throw new Error('A nonempty write-up under 500,000 characters is required.')
          for (const link of [github, demo]) {
            if (link && (typeof link !== 'string' || !/^https?:\/\//i.test(link) || String(link).length > 2000)) throw new Error('Links must start with https:// or http://.')
          }
          const metadataPath = path.join(root, 'src/data/projects.json')
          const entries = JSON.parse(await readFile(metadataPath, 'utf8')) as { id: string; [key: string]: unknown }[]
          const index = entries.findIndex(p => p.id === id)
          if (index >= 0 && value.originalId !== id) throw new Error('That project URL already exists. Open it from the project list to edit it.')
          if (value.originalId && value.originalId !== id) throw new Error('The URL of an existing project cannot be changed here.')
          if (value.archived !== undefined && typeof value.archived !== 'boolean') throw new Error('Archive state must be a boolean.')
          if (value.featured !== undefined && typeof value.featured !== 'boolean') throw new Error('Featured state must be a boolean.')
          if (value.year !== undefined && (typeof value.year !== 'number' || !Number.isInteger(value.year) || value.year < 1900 || value.year > 2200)) throw new Error('Invalid project year.')
          const project = { ...(index >= 0 ? entries[index] : {}), id, title: title.trim(), category, description: description.trim(), technologies: technologies.map(t => t.trim()).filter(Boolean), status, github: github || undefined, demo: demo || undefined, ...(value.archived !== undefined ? { archived: value.archived } : {}), ...(value.year !== undefined ? { year: value.year } : {}), ...(value.featured !== undefined ? { featured: value.featured } : {}) }
          if (index >= 0) entries[index] = project
          else entries.push(project)
          const contentDir = path.join(root, 'src/content/projects')
          await mkdir(contentDir, { recursive: true })
          const contentPath = path.join(contentDir, `${id}.md`)
          await writeFile(`${contentPath}.tmp`, markdown)
          await rename(`${contentPath}.tmp`, contentPath)
          await writeFile(`${metadataPath}.tmp`, JSON.stringify(entries, null, 2) + '\n')
          await rename(`${metadataPath}.tmp`, metadataPath)
          send(200, { ok: true, project })
        } catch (error) {
          send(400, { error: error instanceof Error ? error.message : 'Unable to save.' })
        } finally { saving = false }
      })
    },
  }
}
