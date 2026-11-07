import { motion } from 'framer-motion'
import { ArrowUpRight, Quote, Star } from 'lucide-react'
import { links, testimonials, type Testimonial } from '../data/profile'
import { Dot, Reveal } from './Reveal'

const ease = [0.22, 1, 0.36, 1] as const

function Stars({ value }: { value: number }) {
  return (
    <span className="tm-stars" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="tm-star">
          <Star size={13} />
          <span style={{ width: `${Math.max(0, Math.min(1, value - i)) * 100}%` }}>
            <Star size={13} fill="currentColor" />
          </span>
        </span>
      ))}
    </span>
  )
}

function Card({ t, hidden }: { t: Testimonial; hidden?: boolean }) {
  return (
    <figure className="tm-card" aria-hidden={hidden || undefined}>
      <div className="tm-card-top">
        <Stars value={t.rating} />
        <span className="tm-gig">{t.gig}</span>
      </div>
      <blockquote>“{t.quote}”</blockquote>
      <figcaption>
        <span className="tm-av">{t.name[0].toUpperCase()}</span>
        <span>
          <b>{t.name}</b>
          <small>
            {t.countryCode} · {t.country}
          </small>
        </span>
        <span className="tm-meta">
          {t.price}
          <small>{t.duration}</small>
        </span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  if (testimonials.length === 0) return null
  const [featured, ...rest] = testimonials
  const avg = testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length
  const countries = new Set(testimonials.map((t) => t.countryCode)).size

  return (
    <section id="testimonials" className="section tm-section">
      <div className="container">
        <div className="sec-head">
          <div>
            <Reveal>
              <div className="eyebrow">Kind words · Verified Fiverr reviews</div>
            </Reveal>
            <motion.h2 className="sec-title tm-title" initial="hide" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              {['What clients', 'say'].map((line, i) => (
                <span className="ct-line" key={line}>
                  <motion.span variants={{ hide: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, delay: i * 0.12, ease } } }}>
                    {i === 1 ? (
                      <>
                        <span className="red">say</span>
                        <Dot />
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>
          <Reveal delay={0.15}>
            <div className="tm-score">
              <b>{avg.toFixed(1)}</b>
              <div>
                <Stars value={avg} />
                <small>
                  {testimonials.length} reviews shown · {countries} countries
                </small>
              </div>
            </div>
          </Reveal>
        </div>

        <motion.figure
          className="tm-featured"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease }}
        >
          <Quote className="tm-big-q" size={120} strokeWidth={1} aria-hidden />
          <div className="tm-card-top">
            <Stars value={featured.rating} />
            <span className="tm-gig">{featured.gig}</span>
          </div>
          <blockquote>“{featured.quote}”</blockquote>
          <figcaption>
            <span className="tm-av">{featured.name[0].toUpperCase()}</span>
            <span>
              <b>{featured.name}</b>
              <small>
                {featured.countryCode} · {featured.country}
              </small>
            </span>
            <span className="tm-meta">
              {featured.price}
              <small>{featured.duration}</small>
            </span>
          </figcaption>
        </motion.figure>
      </div>

      <div className="tm-marquee">
        <div className="tm-track">
          {[...rest, ...rest].map((t, i) => (
            <Card key={i} t={t} hidden={i >= rest.length} />
          ))}
        </div>
      </div>

      <div className="container">
        {links.fiverr && (
          <Reveal>
            <a className="link-arrow tm-more" href={links.fiverr} target="_blank" rel="noreferrer">
              Read all reviews on Fiverr <ArrowUpRight size={16} />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
