import { projects } from '../data/projects'

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
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                </div>

                <div className="project-meta">
                <span className="project-status">
                    {project.status.replace('-', ' ')}
                </span>

                <span>{project.technologies.join(' · ')}</span>
                </div>
            </article>
            ))}
        </div>
        </section>
    )
}

export default Projects
