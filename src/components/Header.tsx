import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { profile } from '../data/profile'

const items = [
  { id: 'portfolio', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export function Logo() {
  return (
    <a href="#home" className="logo" aria-label={`${profile.name} — home`}>
      {profile.shortName}
      <sup>®</sup>
    </a>
  )
}

export default function Header({ motionOn, toggleMotion }: { motionOn: boolean; toggleMotion: () => void }) {
  const { scrollYProgress } = useScroll()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme === 'light' ? '#f4f1ec' : '#090909')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;['home', ...items.map((i) => i.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="header">
        <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
        <div className="container header-inner">
          <Logo />
          <nav className="nav" aria-label="Primary">
            {items.map((i) => (
              <a key={i.id} href={`#${i.id}`} className={active === i.id ? 'active' : ''}>
                {i.label}
              </a>
            ))}
          </nav>
          <div className="header-right">
            <button className="motion-toggle" onClick={toggleMotion} aria-pressed={motionOn}>
              <span className="box" aria-hidden /> Motion {motionOn ? 'on' : 'off'}
            </button>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              title={theme === 'light' ? 'Dark theme' : 'Light theme'}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <a href="#contact" className="talk">
              <span>Let’s talk</span> <ArrowUpRight size={14} />
            </a>
            <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <motion.nav className="mobile-menu" aria-label="Mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {items.map((i) => (
            <a key={i.id} href={`#${i.id}`} onClick={() => setOpen(false)}>
              {i.label}
              <span className="dot">.</span>
            </a>
          ))}
        </motion.nav>
      )}
    </>
  )
}
