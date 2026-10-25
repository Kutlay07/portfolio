import type { Project } from '../data/projects.ts'

export type Draft = Project & { markdown: string; originalId?: string }
export type Workspace = { active: string; drafts: Record<string, Draft> }
export const categories: Project['category'][] = ['AI Engineering', 'Machine Learning', 'Data Science', 'Deep Learning', 'Software Engineering']
export const template = '## Overview\n\nDescribe the problem and why it matters.\n\n## Approach\n\nExplain your data, methods, and decisions.\n\n## Evaluation\n\nAdd verified results, tables, and figures here.\n\n## Lessons Learned\n\nDiscuss limitations and next steps.\n'

export function blankDraft(): Draft {
  return { id: '', title: '', description: '', technologies: [], category: 'AI Engineering', status: 'in-progress', markdown: template }
}

export function parseWorkspace(text: string): Workspace {
  if (text.length > 6_000_000) throw new Error('Backup is too large. Use a file under 6 MB.')
  const value = JSON.parse(text) as Workspace
  if (!value || typeof value.active !== 'string' || !value.drafts || typeof value.drafts !== 'object' || Array.isArray(value.drafts)) throw new Error('Invalid Studio backup.')
  const entries = Object.entries(value.drafts)
  if (!entries.length || entries.length > 100 || !Object.hasOwn(value.drafts, value.active)) throw new Error('Backup needs an active draft and at most 100 drafts.')
  for (const [key, draft] of entries) {
    if (!/^(project|draft):[a-zA-Z0-9-]+$/.test(key) || !draft || typeof draft !== 'object' ||
      typeof draft.id !== 'string' || draft.id.length > 80 || (draft.id !== '' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.id)) ||
      typeof draft.title !== 'string' || draft.title.length > 160 || typeof draft.description !== 'string' || draft.description.length > 2000 ||
      typeof draft.markdown !== 'string' || draft.markdown.length > 500_000 ||
      !Array.isArray(draft.technologies) || draft.technologies.length > 30 || !draft.technologies.every(t => typeof t === 'string' && t.length <= 80) ||
      !categories.includes(draft.category) || !['planned', 'in-progress', 'completed'].includes(draft.status) ||
      (draft.originalId !== undefined && (typeof draft.originalId !== 'string' || draft.originalId !== draft.id)) ||
      (draft.archived !== undefined && typeof draft.archived !== 'boolean') ||
      (draft.year !== undefined && (!Number.isInteger(draft.year) || draft.year < 1900 || draft.year > 2200)) ||
      (draft.featured !== undefined && typeof draft.featured !== 'boolean') ||
      [draft.github, draft.demo].some(link => link !== undefined && (typeof link !== 'string' || link.length > 2000 || (link !== '' && !/^https?:\/\//i.test(link))))) {
      throw new Error('Backup contains an invalid project. Existing drafts were kept.')
    }
  }
  return value
}
