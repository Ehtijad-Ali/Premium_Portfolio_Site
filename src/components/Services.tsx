import type { MouseEvent } from 'react'
import { ArrowUpRight, BarChart3, Bot, BrainCircuit, Code2, Eye, Globe2, MessagesSquare, Sparkles, Workflow, type LucideIcon } from 'lucide-react'
import { links, profile, services } from '../data/profile'
import { Dot, Reveal } from './Reveal'

const icons: LucideIcon[] = [Sparkles, Bot, BrainCircuit, Eye, Code2, MessagesSquare, Workflow, BarChart3]

/** cursor-following glow inside each card */
const track = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Services() {
  const ways = [
    { label: 'Remote', value: 'Clients worldwide' },
    links.fiverr && { label: 'Fiverr', value: 'Hire on Fiverr', href: links.fiverr },
    links.upwork && { label: 'Upwork', value: 'Hire on Upwork', href: links.upwork },
    { label: 'Direct', value: 'Contract or project', href: '#contact' },
  ].filter(Boolean) as { label: string; value: string; href?: string }[]

  return (
    <section id="services" className="section">
      <div className="container">
        <Reveal>
          <div className="sec-head svc-head">
            <div>
              <div className="eyebrow">What I do</div>
              <h2 className="sec-title">
                Services for <span className="red">global</span> clients<Dot />
              </h2>
            </div>
            <div className="svc-intro">
              <p>{profile.positioning}</p>
              <span className="svc-count">
                <b>{String(services.length).padStart(2, '0')}</b> core services
              </span>
            </div>
          </div>
        </Reveal>

        <div className="svc-grid">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length]
            return (
              <Reveal key={s.title} delay={(i % 4) * 0.07} y={20} className="svc">
                <a href="#contact" className="svc-in" onMouseMove={track} aria-label={`${s.title}: discuss a project`}>
                  <span className="svc-bg-n" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                  <div className="svc-top">
                    <span className="svc-ic"><Icon size={18} strokeWidth={1.6} /></span>
                    <ArrowUpRight size={16} className="arr" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.tags && (
                    <ul className="svc-tags">
                      {s.tags.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                </a>
              </Reveal>
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
                    <small>{w.label}</small>{w.value}
                  </a>
                ) : (
                  <span key={w.label}><small>{w.label}</small>{w.value}</span>
                ),
              )}
            </div>
            <div className="hero-ctas" style={{ margin: 0 }}>
              <a href="#contact" className="btn btn-primary">Discuss a Project <ArrowUpRight size={14} /></a>
              <a href="#contact" className="btn btn-ghost">Hire Me <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
