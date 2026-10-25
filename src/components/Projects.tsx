import { projects, progressLabels } from '../data/projects'
import { Link } from 'react-router'

function Projects() {
    return (
        <section id="projects" className="projects-section">
        <div className="section-heading">
            <span className="section-number">01 / WORK</span>
            <h2>Selected projects</h2>
        </div>

        <div className="project-list">
            {projects.map((project) => (
            <article className="project" key={project.id}>
                <div className="project-category">
                {project.category}
                </div>

                <div className="project-content">
                <h3>
                    <Link to={`/projects/${project.id}`}>
                        {project.title} ↗
                    </Link>
                </h3>
                <p>{project.description}</p>
                </div>

                <div className="project-meta">
                <span className="project-status">
                    {progressLabels[project.status]}
                </span>

                <span>{project.technologies.join(' · ')}</span>
                {project.github && <a className="project-repository" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source on GitHub`}>Source code ↗</a>}
                </div>
            </article>
            ))}
        </div>
        {projects.length === 0 && <p>New project write-ups are on their way.</p>}
        </section>
    )
}

export default Projects
