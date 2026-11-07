import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Header, { Logo } from './components/Header'
import Hero from './components/Hero'
import CertShowcase from './components/CertShowcase'
import Work from './components/Work'
import Hood from './components/Hood'
import About from './components/About'
import Services from './components/Services'
import Journey from './components/Journey'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import { links, profile } from './data/profile'

function NotFound() {
  return (
    <main className="nf">
      <div>
        <h1>404</h1>
        <p className="muted">This page doesn’t exist.</p>
        <a href="/" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back home →
        </a>
      </div>
    </main>
  )
}

export default function App() {
  const [motionOn, setMotionOn] = useState(() => {
    try {
      return localStorage.getItem('motion') !== 'off'
    } catch {
      return true
    }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', !motionOn)
    try {
      localStorage.setItem('motion', motionOn ? 'on' : 'off')
    } catch {
      /* ignore */
    }
  }, [motionOn])

  const base = new URL(import.meta.env.BASE_URL, window.location.href).pathname.replace(/\/+$/, '')
  const path = window.location.pathname.replace(/\/+$/, '').slice(base.length)
  if (path !== '' && path !== '/index.html') return <NotFound />

  const socials = [
    ['GitHub', links.github],
    ['LinkedIn', links.linkedin],
    ['Fiverr', links.fiverr],
    ['Upwork', links.upwork],
  ].filter(([, u]) => u)

  return (
    <MotionConfig reducedMotion={motionOn ? 'user' : 'always'}>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Header motionOn={motionOn} toggleMotion={() => setMotionOn((m) => !m)} />
      <main id="main">
        <Hero />
        <Work />
        <Hood />
        <About />
        <Services />
        <Journey />
        <CertShowcase />
        <Testimonials />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <Logo />
          <p>
            © {new Date().getFullYear()} {profile.name} · Every model has a purpose.
          </p>
          <div className="socials">
            {socials.map(([n, u]) => (
              <a key={n} href={u} target="_blank" rel="noreferrer">
                {n}
              </a>
            ))}
            <a href="#home">Top ↑</a>
          </div>
        </div>
      </footer>
    </MotionConfig>
  )
}
