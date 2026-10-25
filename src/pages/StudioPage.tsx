import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router'
import { allProjects as projects } from '../data/projects'
import type { Project } from '../data/projects'
import { getProjectContent } from '../content/projectContent'
import MarkdownRenderer from '../components/MarkdownRenderer'
import './StudioPage.css'
import { blankDraft, categories, parseWorkspace, template } from '../studio/workspace'
import type { Draft, Workspace } from '../studio/workspace'
const storageKey = 'portfolio-studio-v1'

function fromProject(project: Project): Draft {
  return { ...project, originalId: project.id, markdown: getProjectContent(project.id) ?? template }
}

function initialWorkspace(): Workspace {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved) return parseWorkspace(saved)
  } catch { /* A missing or unreadable browser backup should not prevent opening Studio. */ }
  const first = projects[0]
  return first ? { active: `project:${first.id}`, drafts: { [`project:${first.id}`]: fromProject(first) } }
    : { active: 'draft:new', drafts: { 'draft:new': blankDraft() } }
}

async function request(endpoint: string, value: unknown) {
  const response = await fetch(`/__studio/${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? 'Request failed.')
  return result
}

export default function StudioPage() {
  const [workspace, setWorkspace] = useState(initialWorkspace)
  const [notice, setNotice] = useState('Draft changes are saved in this browser as you type.')
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<'split' | 'write' | 'preview'>('split')
  const upload = useRef<HTMLInputElement>(null)
  const backupUpload = useRef<HTMLInputElement>(null)
  const editor = useRef<HTMLTextAreaElement>(null)
  const draft = workspace.drafts[workspace.active]

  function commit(next: Workspace) {
    setWorkspace(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      setNotice('Draft saved in this browser. Save to site when it is ready.')
    } catch { setNotice('Browser storage is unavailable or full. Download a backup before leaving.') }
  }

  function update(changes: Partial<Draft>) {
    commit({ ...workspace, drafts: { ...workspace.drafts, [workspace.active]: { ...draft, ...changes } } })
  }

  function openProject(project: Project) {
    const key = `project:${project.id}`
    commit({ active: key, drafts: { ...workspace.drafts, [key]: workspace.drafts[key] ?? fromProject(project) } })
  }

  function newProject() {
    const key = `draft:${crypto.randomUUID()}`
    commit({ active: key, drafts: { ...workspace.drafts, [key]: blankDraft() } })
  }

  function discardDraft() {
    if (!window.confirm('Discard this browser draft? Saved site files will be kept.')) return
    const drafts = { ...workspace.drafts }
    delete drafts[workspace.active]
    const key = Object.keys(drafts)[0] ?? (projects[0] ? `project:${projects[0].id}` : 'draft:new')
    if (!drafts[key]) drafts[key] = projects[0] ? fromProject(projects[0]) : blankDraft()
    commit({ active: key, drafts })
    setNotice('Browser draft discarded. Saved site files were kept.')
  }

  function downloadBackup() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'portfolio-studio-backup.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function restoreBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 6_000_000) { setNotice('Choose a backup smaller than 6 MB.'); return }
    setBusy(true)
    try {
      const restored = parseWorkspace(await file.text())
      if (!window.confirm('Replace the browser drafts with this backup? Site files will be kept.')) return
      commit(restored)
      setNotice('Backup restored in this browser. Site files were not changed.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to restore backup.') }
    finally { setBusy(false) }
  }

  async function persist(value: Draft) {
    setBusy(true)
    try {
      const result = await request('save', value)
      const saved = result.project as Project
      const key = `project:${saved.id}`
      const drafts = { ...workspace.drafts }
      delete drafts[workspace.active]
      drafts[key] = { ...saved, markdown: value.markdown, originalId: saved.id }
      commit({ active: key, drafts })
      setNotice(saved.archived ? 'Project archived locally. Its files are kept; restore it here at any time. Push changes to update the live site.' : 'Saved to project files. Your local portfolio is updated. Commit and push to deploy to Cloudflare.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to save.') }
    finally { setBusy(false) }
  }

  function saveToSite(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void persist(draft)
  }

  async function addImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 5_000_000) { setNotice('Choose an image smaller than 5 MB.'); return }
    setBusy(true)
    const position = editor.current?.selectionStart ?? draft.markdown.length
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Unable to read image.'))
        reader.readAsDataURL(file)
      })
      const { url } = await request('image', { data })
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[[\]\\\r\n]/g, ' ')
      const image = `\n\n![${alt}](${url})\n\n`
      update({ markdown: draft.markdown.slice(0, position) + image + draft.markdown.slice(position) })
      setNotice('Image added to public/project-media. Save to site to include it in the project write-up.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Image upload failed.') }
    finally { setBusy(false) }
  }

  return (
    <main className="studio" id="main-content" tabIndex={-1}>
      <header className="studio-heading">
        <div><p className="eyebrow">YOUR WORK, DOCUMENTED.</p><h1>Portfolio Studio<span>.</span></h1></div>
        <span className="studio-local"><span /> Local workspace</span>
      </header>
      <p className="studio-intro">Turn your experiments into case studies. Write, preview, and save projects without editing code.</p>
      <div className="studio-layout">
        <aside className="studio-sidebar" aria-label="Project library">
          <div className="studio-sidebar-heading"><h2>Projects</h2><button type="button" onClick={newProject} disabled={busy}>+ New</button></div>
          <p className="studio-label">ON YOUR SITE · {projects.length}</p>
          {projects.map(project => <button type="button" disabled={busy} className={`studio-project ${draft.originalId === project.id ? 'is-active' : ''}`} key={project.id} onClick={() => openProject(project)}>
            <span>{project.title}</span><small>{project.archived ? 'Archived · files kept' : project.category}</small>
          </button>)}
          <p className="studio-label">BROWSER DRAFTS · {Object.keys(workspace.drafts).length}</p>
          {Object.entries(workspace.drafts).map(([key, item]) => <button type="button" disabled={busy} className={`studio-project ${workspace.active === key ? 'is-active' : ''}`} key={key} onClick={() => commit({ ...workspace, active: key })}>
            <span>{item.title || 'Untitled project'}</span><small>{item.originalId ? 'Editing saved project' : 'New project'}</small>
          </button>)}
          <div className="studio-sidebar-note">Drafts stay in this browser. Saving to site writes Markdown and project metadata to your repository.</div>
          <button type="button" className="studio-backup" onClick={downloadBackup}>Download draft backup ↓</button>
          <button type="button" className="studio-backup" disabled={busy} onClick={() => backupUpload.current?.click()}>Restore draft backup ↑</button>
          <input ref={backupUpload} type="file" hidden accept="application/json,.json" onChange={restoreBackup} />
        </aside>

        <form onSubmit={saveToSite} className="studio-form">
          <div className="studio-toolbar"><div><span className="studio-label">PROJECT EDITOR</span><h2>{draft.title || 'A new beginning'}</h2></div>
            <button className="studio-primary" type="submit" disabled={busy}>{busy ? 'Working…' : 'Save to site ↗'}</button>
          </div>
          <p className="studio-notice" role="status">{notice}</p>
          <fieldset disabled={busy} className="studio-fields">
            <label>Project title<input required maxLength={160} value={draft.title} placeholder="e.g. Spaceship Titanic" onChange={e => update({ title: e.target.value })} /></label>
            <label>Project URL<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} readOnly={!!draft.originalId} value={draft.id} placeholder="spaceship-titanic" onChange={e => update({ id: e.target.value })} /><small>/projects/{draft.id || 'your-project'}{draft.originalId ? ' · URL is fixed for existing projects' : ''}</small></label>
            <label className="studio-wide">Short description<textarea required maxLength={2000} rows={2} value={draft.description} placeholder="What did you build, and what problem does it solve?" onChange={e => update({ description: e.target.value })} /></label>
            <label>Category<select value={draft.category} onChange={e => update({ category: e.target.value as Project['category'] })}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
            <label>Project progress<select value={draft.status} onChange={e => update({ status: e.target.value as Project['status'] })}><option value="planned">Planned</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select><small>Project progress is separate from saving a draft.</small></label>
            <label className="studio-wide">Technologies<input value={draft.technologies.join(',')} placeholder="Python, PyTorch, Pandas" onChange={e => update({ technologies: e.target.value.split(',') })} /><small>Separate technologies with commas.</small></label>
            <label>GitHub repository<input type="url" value={draft.github ?? ''} placeholder="https://github.com/…" onChange={e => update({ github: e.target.value })} /></label>
            <label>Live demo<input type="url" value={draft.demo ?? ''} placeholder="https://…" onChange={e => update({ demo: e.target.value })} /></label>
          </fieldset>

          <div className="studio-write-heading"><h3>Technical write-up</h3><div className="studio-tabs" aria-label="Editor view">{(['write', 'split', 'preview'] as const).map(mode => <button key={mode} type="button" aria-pressed={tab === mode} onClick={() => setTab(mode)}>{mode === 'split' ? 'Side by side' : mode === 'write' ? 'Write' : 'Preview'}</button>)}</div></div>
          <div className="studio-markdown-tools"><span>Markdown · headings, tables, code & images</span><button disabled={busy} type="button" onClick={() => upload.current?.click()}>+ Add image</button><input ref={upload} hidden type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={addImage} /></div>
          <div className={`studio-editor studio-editor-${tab}`}>
            {tab !== 'preview' && <label className="studio-source"><span className="studio-label">MARKDOWN</span><textarea ref={editor} aria-label="Markdown write-up" spellCheck={false} disabled={busy} value={draft.markdown} onChange={e => update({ markdown: e.target.value })} /></label>}
            {tab !== 'write' && <section className="studio-preview" aria-label="Live preview"><span className="studio-label">LIVE PREVIEW</span><p className="eyebrow">{draft.category}</p><h2>{draft.title || 'Your project title'}</h2><p>{draft.description || 'Your project description will appear here.'}</p><MarkdownRenderer content={draft.markdown} /></section>}
          </div>
          <footer className="studio-form-footer"><button type="button" className="studio-discard" disabled={busy} onClick={discardDraft}>Discard browser draft</button>{draft.originalId && <><button className="studio-discard" type="button" disabled={busy} onClick={() => void persist({ ...draft, archived: !draft.archived })}>{draft.archived ? 'Restore to portfolio' : 'Archive project'}</button>{!draft.archived && <Link to={`/projects/${draft.originalId}`} target="_blank">View saved project ↗</Link>}</>}</footer>
          <p className="studio-footnote">Save to site updates local files. Your live Cloudflare site updates after those changes are committed and pushed to GitHub.</p>
        </form>
      </div>
    </main>
  )
}
