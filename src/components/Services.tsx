import { ArrowUpRight } from 'lucide-react'
import { profile, services } from '../data/profile'
import { Dot, Reveal } from './Reveal'

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">What I do</div>
              <h2 className="sec-title">
                Services for global clients<Dot />
              </h2>
            </div>
            <p className="muted" style={{ maxWidth: 380, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              {profile.positioning}
            </p>
          </div>
        </Reveal>
        <div className="svc-grid">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 0.07} y={20} className="svc">
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <ArrowUpRight size={16} className="arr" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="hero-ctas" style={{ marginTop: 32 }}>
          <a href="#contact" className="btn btn-primary">
            Discuss a Project <ArrowUpRight size={14} />
          </a>
          <a href="#contact" className="btn btn-ghost">
            Hire Me <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
