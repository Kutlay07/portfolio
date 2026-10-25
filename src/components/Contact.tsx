import site from '../data/site.json'
function Contact() {
    return (
        <footer id="contact" className="contact-section">
        <div className="contact-content">
            <span className="section-number">
            03 / CONTACT
            </span>

            <h2>
            Let's build
            <br />
            something meaningful.
            </h2>

            <p>
            Interested in machine learning, data science,
            and building useful AI applications.
            </p>

            <div className="contact-links">
            <span className="contact-email">{site.email}</span>
            <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
        </div>

        <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <span>Built with React · Hosted on Cloudflare Pages</span>
        </div>
        </footer>
    )
}

export default Contact
