import { testimonials } from '../data/profile'
import { Dot, Reveal } from './Reveal'

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Kind words</div>
              <h2 className="sec-title">
                Client voices<Dot />
              </h2>
            </div>
          </div>
        </Reveal>
        {testimonials.length === 0 ? (
          <div className="testi-empty">
            <span className="q">“</span>
            <p>Client testimonials will be published here soon — only genuine feedback, shared with permission.</p>
            <a href="#contact" className="link-arrow">
              Work with me →
            </a>
          </div>
        ) : (
          <div className="grid-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="quote-card" style={{ margin: 0 }}>
                <span className="q">“</span>
                <blockquote style={{ margin: '20px 0', fontSize: 16, lineHeight: 1.6 }}>{t.quote}</blockquote>
                <figcaption className="eyebrow" style={{ color: '#fff' }}>
                  {t.name} · {t.source}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
