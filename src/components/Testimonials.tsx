import { motion } from 'framer-motion'
import { ArrowUpRight, BadgeCheck, Quote, Star } from 'lucide-react'
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
  // featured review is chosen explicitly; the rest scroll below, longest first
  const FEATURED = 'petersaur'
  const featured = testimonials.find((t) => t.name === FEATURED) ?? testimonials[0]
  const rest = testimonials.filter((t) => t !== featured).sort((a, b) => b.quote.length - a.quote.length)

  return (
    <section id="testimonials" className="section tm-section">
      <div className="container">
        <div className="sec-head">
          <div>
            <Reveal>
              <div className="eyebrow">Kind words · Verified Fiverr reviews</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="sec-title tm-title">
                What clients <span className="red">say</span>
                <Dot />
              </h2>
            </Reveal>
          </div>
        </div>

        <motion.figure
          className="tm-featured"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease }}
        >
          <aside className="tf-side">
            <span className="tf-verified">
              <BadgeCheck size={14} /> Verified Fiverr review
            </span>
            <div className="tf-score">
              <b>{featured.rating.toFixed(1)}</b>
              <Stars value={featured.rating} />
            </div>
            <dl className="tf-meta">
              <div>
                <dt>Service</dt>
                <dd>{featured.gig}</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{featured.price}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{featured.duration}</dd>
              </div>
            </dl>
          </aside>
          <div className="tf-main">
            <Quote className="tf-q" size={44} strokeWidth={1.4} aria-hidden />
            <blockquote>{featured.quote}</blockquote>
            <figcaption>
              <span className="tm-av">{featured.name[0].toUpperCase()}</span>
              <span>
                <b>{featured.name}</b>
                <small>
                  {featured.countryCode} · {featured.country}
                </small>
              </span>
            </figcaption>
          </div>
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
