import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Award, Minus, Plus } from 'lucide-react'
import { certifications, experience, heroStats } from '../data/profile'
import { Reveal } from './Reveal'

const initials = (s: string) =>
  s
    .split(/[\s·,&+-]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('') || s[0]

export default function Journey() {
  const [open, setOpen] = useState(0)
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 75%', 'end 60%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const stats = [{ value: String(experience.length), suffix: '', label: ['ROLES &', 'PROGRAMMES'] }, ...heroStats]

  return (
    <section id="experience" className="section">
      <div className="container">
        <Reveal>
          <div className="sec-head jr-head">
            <div>
              <div className="eyebrow">03 / The Journey</div>
              <h2 className="sec-title">
                Keep learning.
                <br />
                Keep <span className="red">shipping</span>
                <span className="dot">.</span>
              </h2>
            </div>
            <div className="jr-stats">
              {stats.map((s) => (
                <div key={s.label.join()}>
                  <b>
                    {s.value}
                    <i>{s.suffix}</i>
                  </b>
                  <small>{s.label.join(' ')}</small>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="journey-grid">
          <div className="tl" ref={lineRef}>
            <div className="tl-rail" aria-hidden>
              <motion.span style={{ scaleY: draw }} />
            </div>
            {experience.map((x, i) => {
              const isOpen = open === i
              const now = /NOW/.test(x.period)
              return (
                <Reveal key={x.role} delay={i * 0.06} y={18}>
                  <div className={`tl-item ${isOpen ? 'open' : ''}`}>
                    <span className={`tl-node ${now ? 'now' : ''}`} aria-hidden />
                    <button className="tl-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                      <span className="tl-meta">
                        <span className="p">{x.period}</span>
                        {now && <span className="tl-live">Current</span>}
                      </span>
                      <h3>
                        {x.role}
                        <small>{x.org}</small>
                      </h3>
                      <span className="tl-tog">{isOpen ? <Minus size={14} /> : <Plus size={14} />}</span>
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
                          <ul className="tl-body">
                            {x.points.map((p, k) => (
                              <motion.li key={p} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.05 }}>
                                {p}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
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
            <div className="cert-list">
              {certifications.map((c, i) => {
                const inner = (
                  <>
                    <span className="cert-badge" aria-hidden>
                      {initials(c.issuer)}
                    </span>
                    <span>
                      <b>{c.title}</b>
                      <small>
                        {c.issuer}
                        {c.date && ` · ${c.date}`}
                      </small>
                    </span>
                    {c.url ? <ArrowUpRight size={14} /> : <span className="i">{String(i + 1).padStart(2, '0')}</span>}
                  </>
                )
                return (
                  <Reveal key={c.title} delay={i * 0.05} y={12}>
                    {c.url ? (
                      <a className="cert" href={c.url} target="_blank" rel="noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <div className="cert">{inner}</div>
                    )}
                  </Reveal>
                )
              })}
            </div>
            <div className="mile-foot">
              <Award size={16} />
              {certifications.length} certifications &amp; counting
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
