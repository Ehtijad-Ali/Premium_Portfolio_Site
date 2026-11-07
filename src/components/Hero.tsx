import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Asterisk, MapPin } from 'lucide-react'
import { heroStats, profile } from '../data/profile'
import portrait from '../assets/image1.png'

const ease = [0.22, 1, 0.36, 1] as const

/** second line of the role — all taken from the profile's services/skills */
const ROLES = ['Full-Stack Dev', 'ML Engineer', 'Agent Builder', 'Vision Engineer']

/** counts from 0 to the target once visible */
function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    if (document.documentElement.classList.contains('reduce-motion')) {
      el.textContent = String(to)
      return
    }
    const c = animate(0, to, { duration: 1.8, delay: 0.8, ease, onUpdate: (v) => (el.textContent = String(Math.round(v))) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>0</span>
}

export default function Hero() {
  const [photoOk, setPhotoOk] = useState(true)
  const [role, setRole] = useState(0)

  // pointer position, -0.5 … 0.5, smoothed
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const wordX = useTransform(sx, (v) => v * -60)
  const wordY = useTransform(sy, (v) => v * -24)
  const picX = useTransform(sx, (v) => v * 26)
  const picY = useTransform(sy, (v) => v * 14)
  const leftX = useTransform(sx, (v) => v * -10)
  const rightX = useTransform(sx, (v) => v * -14)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const id = setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2600)
    return () => clearInterval(id)
  }, [])

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    e.currentTarget.style.setProperty('--hx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--hy', `${e.clientY - r.top}px`)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section id="home" ref={heroRef} className="hero hero-live" aria-label="Introduction" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="hero-spot" aria-hidden />
      <div className="hero-dust" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => (
          <i key={i} style={{ left: `${(i * 53) % 100}%`, animationDelay: `${-(i * 1.7) % 14}s`, animationDuration: `${10 + (i % 5) * 2}s` }} />
        ))}
      </div>

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
        <motion.span style={{ display: 'block', x: wordX, y: wordY }}>
          <motion.span style={{ display: 'block' }} initial={{ opacity: 0, y: 60, letterSpacing: '0.04em' }} animate={{ opacity: 1, y: 0, letterSpacing: '-0.024em' }} transition={{ duration: 1.6, ease }}>
            PORTFOLIO
          </motion.span>
        </motion.span>
      </div>

      <motion.div className="hero-portrait" style={{ x: picX, y: picY }}>
        <motion.div className="hero-float" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.25, ease }}>
          {photoOk ? (
            <img src={portrait} alt={`Portrait of ${profile.name}`} onError={() => setPhotoOk(false)} fetchPriority="high" />
          ) : (
            <div className="monogram" role="img" aria-label="Portrait placeholder">
              <span>EAS</span>
              <small>ADD /public/profile.jpg</small>
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.div className="hero-left" style={{ x: leftX }}>
        <motion.span className="hello" initial={{ opacity: 0, y: 20, rotate: -10 }} animate={{ opacity: 1, y: 0, rotate: -4 }} transition={{ duration: 0.9, delay: 0.35, ease }}>
          Hello, I’m
        </motion.span>
        <h1 className="hero-name" aria-label={profile.shortName}>
          {profile.shortName.split('').map((ch, i) => (
            <span className="hn-mask" key={i} aria-hidden>
              <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 0.9, delay: 0.45 + i * 0.06, ease }}>
                {ch}
              </motion.span>
            </span>
          ))}
          <motion.span className="dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 1 }}>
            .
          </motion.span>
        </h1>
        <motion.p className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }}>
          AI Engineer &amp;
          <br />
          <span className="hr-rot">
            <AnimatePresence mode="wait">
              <motion.span key={ROLES[role]} initial={{ y: 14, opacity: 0, filter: 'blur(6px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -14, opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.5, ease }}>
                {ROLES[role]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease }}>
          <p className="hero-intro">
            <strong>{profile.headline}</strong>
            {profile.intro}
          </p>
          <div className="hero-ctas">
            <a href="#portfolio" className="btn btn-primary btn-shine">
              Explore My Work <ArrowDown size={14} className="bounce-y" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Let’s Collaborate <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="hero-loc">
            <MapPin size={12} /> {profile.locationShort}
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="hero-right" style={{ x: rightX }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7, ease }}>
        <div className="badge">
          <span className="ring ring-spin">
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
                <Count to={Number(s.value)} />
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

      <a href="#portfolio" className="hero-scroll" aria-label="Scroll to work">
        <span />
      </a>
    </section>
  )
}
