import { Asterisk } from 'lucide-react'
import { education, process, profile, skillGroups } from '../data/profile'
import { Dot, Reveal } from './Reveal'
import SystemDiagram from './SystemDiagram'
import TechLogos from './TechLogos'

const pad = (n: number) => String(n).padStart(2, '0')

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about-top">
          <Reveal>
            <div className="eyebrow">02 / Behind the code</div>
            <h2 className="about-title">
              More than models<Dot />
              <br />
              Building <span className="red">intelligence</span>
              <Dot />
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="about-copy">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
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
