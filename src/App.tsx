import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'

import Navbar from './components/Navbar'
import Contact from './components/Contact'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'

import './App.css'
import RouteEffects from './components/RouteEffects'

const StudioPage = import.meta.env.DEV
  ? lazy(() => import('./pages/StudioPage'))
  : null

function App() {
  return (
    <div className="page">
      <RouteEffects />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        {StudioPage && (
          <Route path="/admin" element={<Suspense fallback={<p>Opening studio…</p>}><StudioPage /></Suspense>} />
        )}
        <Route path="*" element={<main className="project-detail"><h1>Page not found.</h1><a href="/">Back to portfolio</a></main>} />
      </Routes>

      <Contact />
    </div>
  )
}

export default App
