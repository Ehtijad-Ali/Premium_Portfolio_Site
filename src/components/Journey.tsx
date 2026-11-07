import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { experience } from '../data/profile'
import { Reveal } from './Reveal'

export default function Journey() {
  const [open, setOpen] = useState(0)
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 75%', 'end 60%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

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
          </div>
        </Reveal>

        <div className="journey-grid journey-solo">
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
        </div>
      </div>
    </section>
  )
}
