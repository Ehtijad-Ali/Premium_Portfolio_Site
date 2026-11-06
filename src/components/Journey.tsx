import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import { certifications, experience } from '../data/profile'
import { Reveal } from './Reveal'

export default function Journey() {
  const [open, setOpen] = useState(0)
  return (
    <section id="experience" className="section">
      <div className="container">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">03 / The Journey</div>
              <h2 className="sec-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 'clamp(26px,2.6vw,36px)', letterSpacing: '-0.04em' }}>
                Keep learning. Keep shipping<span className="dot">.</span>
              </h2>
            </div>
            <span className="eyebrow" style={{ color: 'var(--text)' }}>
              Experience &amp; Certifications
            </span>
          </div>
        </Reveal>

        <div className="journey-grid">
          <div className="acc">
            {experience.map((x, i) => {
              const isOpen = open === i
              return (
                <div className={`acc-item ${isOpen ? 'open' : ''}`} key={x.role}>
                  <button className="acc-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span className="p">{x.period}</span>
                    <h3>
                      {x.role}
                      <small>{x.org}</small>
                    </h3>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="acc-body">
                          <ul>
                            {x.points.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <aside className="mile" aria-label="Certifications">
            <div className="eyebrow">A few milestones</div>
            <h3 className="mile-title">
              Learned.
              <br />
              <span className="red">Certified.</span>
            </h3>
            {certifications.map((c, i) => {
              const inner = (
                <>
                  <span className="i">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <b>{c.title}</b>
                    <small>
                      {c.issuer}
                      {c.date && ` · ${c.date}`}
                    </small>
                  </span>
                  {c.url ? <ArrowUpRight size={14} /> : <span />}
                </>
              )
              return c.url ? (
                <a className="cert" key={c.title} href={c.url} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div className="cert" key={c.title}>
                  {inner}
                </div>
              )
            })}
          </aside>
        </div>
      </div>
    </section>
  )
}
