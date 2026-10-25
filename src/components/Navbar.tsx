import { Link } from 'react-router'

function Navbar() {
    return (
        <header className="navbar">
        <Link to="/" className="navbar-logo">
            Kutlay.
        </Link>

        <nav aria-label="Main navigation">
            <Link to="/#projects">Projects</Link>
            <Link to="/#about">About</Link>
            <Link to="/#contact">Contact</Link>
            {import.meta.env.DEV && <Link to="/admin">Studio ↗</Link>}
        </nav>
        </header>
    )
}

export default Navbar
