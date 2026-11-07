import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Asterisk } from 'lucide-react'
import { education, process, profile, skillGroups } from '../data/profile'
import { Dot, Reveal } from './Reveal'
import SystemDiagram from './SystemDiagram'
import TechLogos from './TechLogos'
import { ParticlePortrait } from './ParticlePortrait'

const pad = (n: number) => String(n).padStart(2, '0')
const ease = [0.22, 1, 0.36, 1] as const
const rise = (delay: number) => ({ hide: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease } } })

/** key phrases in the About copy get an animated underline */
const KEYS = ['AI Engineer', 'Full-Stack Developer', 'Gilgit-Baltistan', 'AI agents', 'large language models', 'real-world problems', 'practical usability']
function highlight(text: string) {
  const re = new RegExp(`(${KEYS.join('|')})`, 'g')
  return text.split(re).map((part, i) => (KEYS.includes(part) ? (
      <motion.mark className="ab-mark" key={i} variants={{ hide: { backgroundSize: '0% 2px' }, show: { backgroundSize: '100% 2px', transition: { duration: 0.9, delay: 0.8 + i * 0.08, ease } } }}>
        {part}
      </motion.mark>
    ) : (
      part
    )))
}

/** quick facts — all from the profile */
const facts = [
  { k: 'AI Agents', v: 'LLMs · RAG · automation' },
  { k: 'Full-Stack', v: 'React · Python · APIs' },
  { k: 'Based in', v: 'Gilgit-Baltistan, PK' },
]

/** particle portrait that assembles as the About section scrolls into view */
function AboutPortrait() {
  const box = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'center center'] })
  const p = useTransform(scrollYProgress, [0.1, 0.95], [0, 1], { clamp: true })
  useMotionValueEvent(p, 'change', (v) => {
    progress.current = v
  })
  return (
    <div className="ab-portrait" ref={box}>
      <div className="cs-halo" aria-hidden />
      <ParticlePortrait progress={progress} />
      <span className="ab-hint">Scroll to assemble · hover to scatter</span>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about-top">
          <AboutPortrait />
          <motion.div className="about-text" initial="hide" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
            <motion.div className="eyebrow" variants={rise(0)}>
              02 / Behind the code
            </motion.div>
            <h2 className="about-title">
              {[
                <>More than models<Dot /></>,
                <>
                  Building <span className="red">intelligence</span>
                  <Dot />
                </>,
              ].map((line, i) => (
                <span className="ab-line" key={i}>
                  <motion.span variants={{ hide: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease } } }}>{line}</motion.span>
                </span>
              ))}
            </h2>
            <div className="about-copy">
              {profile.about.map((p, i) => (
                <motion.p key={p} variants={rise(0.35 + i * 0.12)}>
                  {highlight(p)}
                </motion.p>
              ))}
            </div>
            <motion.ul className="ab-facts" variants={rise(0.9)}>
              {facts.map((f) => (
                <li key={f.k}>
                  <b>{f.k}</b>
                  <small>{f.v}</small>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        <div className="about-grid">
          <div className="about-col">
            <h3 className="col-title">Expertise &amp; Skills</h3>
            <div className="eyebrow red">Education &amp; Learning</div>
            {education.map((e) => (
              <div className="edu" key={e.title}>
                <b>{e.title}</b>
                <span className="yr">{e.period}</span>
                <small>
                  {e.org}
                  {e.note && <> · {e.note}</>}
                </small>
              </div>
            ))}
            <div className="eyebrow red" style={{ margin: '22px 0 14px' }}>
              Technical Toolkit
            </div>
            {skillGroups.map((g) => (
              <div className="skill-group" key={g.title}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  {g.title}
                </div>
                <div className="chips">
                  {g.items.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <TechLogos />
          </div>

          <div className="about-col">
            <h3 className="col-title">From idea to deployment</h3>
            <div className="steps">
              {process.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08} y={16}>
                  <div className="step">
                    <span className="n">{pad(i + 1)}</span>
                    <span className="c" />
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <SystemDiagram />
            </Reveal>
          </div>

          <div className="about-col quote-col" style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}>
            <div className="quote-card">
              <span className="q">“</span>
              <p>
                From raw data
                <br />
                and bold ideas,
                <br />
                <span>to intelligent</span>
                <br />
                <span>digital products.</span>
              </p>
              <span className="sig">Ehtijad</span>
              <div className="cta">
                LET’S BUILD
                <br />
                SOMETHING INTELLIGENT.
                <div className="ast">
                  <Asterisk size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
