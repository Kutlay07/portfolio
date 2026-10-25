import projectData from './projects.json'



export type Project = {
  id: string
  title: string
  category: 'AI Engineering' | 'Machine Learning' | 'Data Science' | 'Deep Learning' | 'Software Engineering'
  description: string
  technologies: string[]
  status: 'completed' | 'in-progress' | 'planned'

  // Optional metadata
  github?: string
  demo?: string
  featured?: boolean
  year?: number
  archived?: boolean
}


export const allProjects: Project[] = projectData as Project[]
export const projects = allProjects.filter(project => !project.archived)

export const progressLabels: Record<Project['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  planned: 'Planned',
}
