import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { projects } from '../data/projects'
import site from '../data/site.json'

export default function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const project = projects.find(item => pathname.replace(/\/$/, '') === `/projects/${item.id}`)
    const isHome = pathname === '/'
    const title = isHome ? site.title : project ? `${project.title} — ${site.name}` : import.meta.env.DEV && pathname === '/admin' ? `Portfolio Studio — ${site.name}` : `Page not found — ${site.name}`
    const description = project?.description ?? site.description
    document.title = title
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
      ['meta[property="og:url"]', `${site.url}${project ? `/projects/${project.id}/` : '/'}`],
    ]) document.querySelector(selector)?.setAttribute('content', content)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${site.url}${project ? `/projects/${project.id}/` : '/'}`)
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots) }
    robots.content = isHome || project ? 'index, follow' : 'noindex, nofollow'
    const frame = requestAnimationFrame(() => {
      const main = document.querySelector('main')
      if (main) { main.id = 'main-content'; main.tabIndex = -1 }
      let fragment = hash.slice(1)
      try { fragment = decodeURIComponent(fragment) } catch { /* Malformed external hashes are treated as literal IDs. */ }
      const target = hash ? document.getElementById(fragment) : null
      if (target) target.scrollIntoView()
      else { window.scrollTo(0, 0); main?.focus({ preventScroll: true }) }
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
