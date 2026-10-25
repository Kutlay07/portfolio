
import { Link, useParams } from 'react-router'
import { projects, progressLabels } from '../data/projects'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { getProjectContent } from '../content/projectContent'

function ProjectPage() {
  const { id } = useParams()

  const project = projects.find(
    (project) => project.id === id
  )

  if (!project) {
    return (
      <main className="project-detail">
        <h1>Project not found.</h1>
        <Link to="/">← Back to portfolio</Link>
      </main>
    )
  }

  // Load the Markdown content for this project
  const markdown = getProjectContent(project.id)

  return (
    <main className="project-detail">
      <Link to="/#projects" className="back-link">
        ← All projects
      </Link>

      <p className="eyebrow">{project.category}</p>

      <h1>{project.title}</h1>

      <p className="detail-description">
        {project.description}
      </p>

      <p className="detail-technologies">
        {project.technologies.join(' · ')}
      </p>

      <p className="detail-status">{progressLabels[project.status]}{project.year ? ` · ${project.year}` : ''}</p>

      <div className="detail-links">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository ↗
          </a>
        )}

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Demo ↗
          </a>
        )}
      </div>

      <section className="detail-body">
        {markdown ? (
          <MarkdownRenderer content={markdown} />
        ) : (
          <p>Technical case study coming soon.</p>
        )}
      </section>
    </main>
  )
}

export default ProjectPage
