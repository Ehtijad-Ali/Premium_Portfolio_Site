import type { MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, BarChart3, Bot, BrainCircuit, Code2, Eye, Globe2, MessagesSquare, Sparkles, Workflow, type LucideIcon } from 'lucide-react'
import { links, profile, services } from '../data/profile'
import { Dot, Reveal } from './Reveal'

const icons: LucideIcon[] = [Sparkles, Bot, BrainCircuit, Eye, Code2, MessagesSquare, Workflow, BarChart3]
const ease = [0.22, 1, 0.36, 1] as const

/** cursor glow + gentle 3D tilt */
const track = (e: MouseEvent<HTMLElement>) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  el.style.setProperty('--mx', `${x}px`)
  el.style.setProperty('--my', `${y}px`)
  el.style.setProperty('--rx', `${((y / r.height) - 0.5) * -6}deg`)
  el.style.setProperty('--ry', `${((x / r.width) - 0.5) * 6}deg`)
}
const reset = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

export default function Services() {
  const ways = [
    { label: 'Remote', value: 'Clients worldwide' },
    links.fiverr && { label: 'Fiverr', value: 'Hire on Fiverr', href: links.fiverr },
    links.upwork && { label: 'Upwork', value: 'Hire on Upwork', href: links.upwork },
    { label: 'Direct', value: 'Contract or project', href: '#contact' },
  ].filter(Boolean) as { label: string; value: string; href?: string }[]

  const ticker = services.map((s) => s.title)

  return (
    <section id="services" className="section svc-section">
      <div className="container">
        <div className="sec-head">
          <div>
            <Reveal>
              <div className="eyebrow">What I do</div>
            </Reveal>
            <motion.h2 className="sec-title svc-title" initial="hide" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
              {['Services for', 'global clients'].map((line, li) => (
                <span className="svc-line" key={line}>
                  <motion.span
                    variants={{ hide: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, delay: li * 0.12, ease } } }}
                  >
                    {li === 1 ? (
                      <>
                        <span className="red">global</span> clients<Dot />
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>
          <Reveal delay={0.2}>
            <p className="svc-intro">{profile.positioning}</p>
          </Reveal>
        </div>
      </div>

      <div className="svc-ticker" aria-hidden>
        <div className="svc-ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i}>
              {t}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="svc-grid">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length]
            return (
              <motion.a
                key={s.title}
                href="#contact"
                className="svc-card"
                onMouseMove={track}
                onMouseLeave={reset}
                aria-label={`${s.title}: discuss a project`}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: (i % 4) * 0.08 + Math.floor(i / 4) * 0.12, ease }}
              >
                <div className="svc-top">
                  <span className="svc-ic">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <ArrowUpRight size={18} className="arr" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.tags && (
                  <ul className="svc-tags">
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </motion.a>
            )
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="svc-foot">
            <div className="svc-ways">
              <Globe2 size={16} className="red" />
              {ways.map((w) =>
                w.href ? (
                  <a key={w.label} href={w.href} target={w.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    <small>{w.label}</small>
                    {w.value}
                  </a>
                ) : (
                  <span key={w.label}>
                    <small>{w.label}</small>
                    {w.value}
                  </span>
                ),
              )}
            </div>
            <div className="hero-ctas" style={{ margin: 0 }}>
              <a href="#contact" className="btn btn-primary">
                Discuss a Project <ArrowUpRight size={14} />
              </a>
              <a href="#contact" className="btn btn-ghost">
                Hire Me <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
