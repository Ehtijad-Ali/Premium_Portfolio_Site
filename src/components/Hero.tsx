import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Asterisk, MapPin } from 'lucide-react'
import { heroStats, profile } from '../data/profile'
import portrait from '../assets/image1.png'

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const [photoOk, setPhotoOk] = useState(true)
  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="container hero-top">
        <div className="eyebrow">
          <span className="red">AI ENGINEER &amp; FULL-STACK DEVELOPER</span>
          <br />
          AI AGENTS · ML · PYTHON · REACT
        </div>
        <div className="eyebrow avail">
          <i aria-hidden /> AVAILABLE FOR REMOTE PROJECTS
        </div>
      </div>

      <div className="hero-word" aria-hidden>
        <motion.span style={{ display: 'block' }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, ease }}>
          PORTFOLIO
        </motion.span>
      </div>

      <motion.div className="hero-portrait" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.25, ease }}>
        {photoOk ? (
          <img src={portrait} alt={`Portrait of ${profile.name}`} onError={() => setPhotoOk(false)} fetchPriority="high" />
        ) : (
          <div className="monogram" role="img" aria-label="Portrait placeholder">
            <span>EAS</span>
            <small>ADD /public/profile.jpg</small>
          </div>
        )}
      </motion.div>

      <motion.div className="hero-left" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease }}>
        <span className="hello">Hello, I’m</span>
        <h1 className="hero-name">
          {profile.shortName}
          <span className="dot">.</span>
        </h1>
        <p className="hero-role">
          AI Engineer &amp;
          <br />
          Full-Stack Dev
        </p>
        <p className="hero-intro">
          <strong>{profile.headline}</strong>
          {profile.intro}
        </p>
        <div className="hero-ctas">
          <a href="#portfolio" className="btn btn-primary">
            Explore My Work <ArrowDown size={14} />
          </a>
          <a href="#contact" className="btn btn-ghost">
            Let’s Collaborate <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="hero-loc">
          <MapPin size={12} /> {profile.locationShort}
        </div>
      </motion.div>

      <motion.div className="hero-right" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease }}>
        <div className="badge">
          <span className="ring">
            <Asterisk size={20} />
          </span>
          <span>
            Every model.
            <br />A purpose.
          </span>
        </div>
        <div className="stats">
          {heroStats.map((s) => (
            <div className="stat" key={s.value}>
              <b>
                {s.value}
                {s.suffix && <sup>{s.suffix}</sup>}
              </b>
              <span>
                {s.label[0]}
                <br />
                {s.label[1]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
