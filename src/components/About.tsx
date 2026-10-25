
function About() {
    return (
        <section id="about" className="about-section">
        <div className="section-heading">
            <span className="section-number">02 / ABOUT</span>
            <h2>A little about me</h2>
        </div>

        <div className="about-layout">
            <div className="about-intro">
            <p>
                I'm a Management Information Systems student
                focused on AI/ML Engineering and Data Science.
            </p>

            <p>
                I enjoy understanding how intelligent systems
                work from first principles, building models,
                and turning experiments into reliable software.
            </p>
            </div>

            <dl className="about-facts">
            <dt>Based in</dt>
            <dd>Türkiye</dd>

            <dt>Education</dt>
            <dd>Management Information Systems</dd>

            <dt>Focus</dt>
            <dd>AI/ML Engineering & Data Science</dd>

            <dt>Tools</dt>
            <dd>Python, PyTorch, SQL, FastAPI</dd>
            </dl>
        </div>
        </section>
    )
}

export default About
