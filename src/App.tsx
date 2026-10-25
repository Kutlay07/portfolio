import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'

import './App.css'

function App() {
  return (
    <div className="page">
      <Navbar />

      <main>
        <Hero />
        <Projects />
        <About />
      </main>

      <Contact />
    </div>
  )
}

export default App
