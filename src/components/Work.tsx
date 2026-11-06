import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ExternalLink, Search, X } from 'lucide-react'
import { categories, projects, tools, type Project } from '../data/profile'
import { Dot, Reveal } from './Reveal'

const pad = (n: number) => String(n).padStart(2, '0')

export default function Work() {
  const [cat, setCat] = useState<string>('All')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Project | null>(null)
  const used = categories.filter((c) => projects.some((p) => p.category === c))
  const list = useMemo(
    () =>
      projects.filter(
        (p) => (cat === 'All' || p.category === cat) && (p.title + p.category + p.tech.join(' ')).toLowerCase().includes(q.toLowerCase()),
      ),
    [cat, q],
  )

  return (
    <section id="portfolio" className="section" style={{ borderTop: 0 }}>
      <div className="container">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">01 / Selected Work</div>
              <h2 className="sec-title">
                Work that speaks<Dot />
              </h2>
            </div>
            <a href="#contact" className="link-arrow">
              Discuss a project <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>

        <div className="filters">
          <div className="tabs" role="tablist" aria-label="Project categories">
            {['All', ...used].map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} className={`tab ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={13} />
            <span className="sr-only">Search projects</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or category" />
          </label>
        </div>

        <motion.div layout className="grid-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.button
                layout
                key={p.id}
                className="card"
                onClick={() => setOpen(p)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                aria-label={`Open details for ${p.title}`}
              >
                <div className="card-media">
                  <span className="card-tag">{p.category}</span>
                  {p.image ? (
                    <img src={p.image} alt="" loading="lazy" />
                  ) : (
                    <div className="ph-art">
                      <span>{p.title}</span>
                      {p.placeholder && <em>PLACEHOLDER · EDIT src/data/profile.ts</em>}
                    </div>
                  )}
                </div>
                <div className="card-meta">
                  <span className="card-num">{pad(i + 1)}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>
                      {p.category} / {p.year}
                    </p>
                  </div>
                  <ArrowUpRight size={16} />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="empty">No projects match that search.</p>}

        <div className="tools">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <div className="eyebrow">
              Built with
              <br />
              <span style={{ color: 'var(--text)' }}>The tools I trust.</span>
            </div>
            <span className="eyebrow">See all ({tools.length})</span>
          </div>
          <div className="marquee" aria-label="Tools I use">
            <div className="marquee-track">
              {[...tools, ...tools].map((t, i) => (
                <span key={i} aria-hidden={i >= tools.length}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}

function ProjectModal({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [onClose])

  return (
    <motion.div className="modal-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <button ref={ref} className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="card-media" style={{ border: 0 }}>
          {p.image ? <img src={p.image} alt={`${p.title} screenshot`} /> : <div className="ph-art"><span>{p.title}</span></div>}
        </div>
        <div className="modal-body">
          <div className="eyebrow red">
            {p.category} / {p.year}
          </div>
          <h2 id="pm-title">{p.title}</h2>
          <p>{p.overview}</p>
          <div className="modal-row">
            <div>
              <div className="eyebrow">My role</div>
              <p style={{ margin: '8px 0 0' }}>{p.role}</p>
            </div>
            <div>
              <div className="eyebrow">Technologies</div>
              <div className="chips" style={{ marginTop: 10 }}>
                {p.tech.map((t) => (
                  <span className="chip" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-links">
            {p.github && (
              <a className="btn btn-ghost" href={p.github} target="_blank" rel="noreferrer">
                GitHub <ExternalLink size={14} />
              </a>
            )}
            {p.demo && (
              <a className="btn btn-primary" href={p.demo} target="_blank" rel="noreferrer">
                Live demo <ArrowUpRight size={14} />
              </a>
            )}
            {!p.github && !p.demo && <span className="note">Repository and demo links will appear here once added.</span>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
