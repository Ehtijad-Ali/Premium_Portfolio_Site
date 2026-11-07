import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Briefcase, Check, Clock, Code2, Copy, Mail, MapPin, Phone, Plus, ShoppingBag, UserRound } from 'lucide-react'
import { contactEndpoint, links, profile } from '../data/profile'
import { Dot, Reveal } from './Reveal'
import cardVideo from '../assets/video.mp4'

const ease = [0.22, 1, 0.36, 1] as const

const rows = [
  { label: 'EMAIL', value: links.email, href: links.email && `mailto:${links.email}`, icon: Mail },
  { label: 'PHONE / WHATSAPP', value: links.phone, href: links.phone && `https://wa.me/${links.phone.replace(/\D/g, '')}`, icon: Phone },
  { label: 'LINKEDIN', value: links.linkedin && 'ehtijad-ali', href: links.linkedin, icon: UserRound },
  { label: 'GITHUB', value: links.github && 'ehtijad-ali', href: links.github, icon: Code2 },
  { label: 'FIVERR', value: links.fiverr && 'saaimhl', href: links.fiverr, icon: ShoppingBag },
  { label: 'UPWORK', value: links.upwork && 'Ehtijad Ali', href: links.upwork, icon: Briefcase },
  { label: 'BASED IN', value: profile.location, href: '', icon: MapPin },
]

const words = ['smarter.', 'faster.', 'together.']

type Fields = { name: string; email: string; subject: string; message: string }
const empty: Fields = { name: '', email: '', subject: '', message: '' }

function validate(f: Fields) {
  const e: Partial<Fields> = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Please enter a valid email.'
  if (f.subject.trim().length < 3) e.subject = 'Please add a subject.'
  if (f.message.trim().length < 10) e.message = 'Message should be at least 10 characters.'
  return e
}

/** live local time in Pakistan */
function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Karachi' }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Contact() {
  const [open, setOpen] = useState(false)
  const [f, setF] = useState(empty)
  const [err, setErr] = useState<Partial<Fields>>({})
  const [status, setStatus] = useState<'' | 'sending' | 'ok' | 'fail' | 'unconfigured'>('')
  const [copied, setCopied] = useState(false)
  const [w, setW] = useState(0)
  const time = useLocalTime()

  useEffect(() => {
    const id = setInterval(() => setW((n) => (n + 1) % words.length), 2400)
    return () => clearInterval(id)
  }, [])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${links.email}`
    }
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate(f)
    setErr(e)
    if (Object.keys(e).length) return
    if (!contactEndpoint) return setStatus('unconfigured')
    setStatus('sending')
    try {
      const r = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(f),
      })
      if (!r.ok) throw new Error()
      setStatus('ok')
      setF(empty)
    } catch {
      setStatus('fail')
    }
  }

  const field = (k: keyof Fields, label: string, full = false, area = false) => (
    <div className={`field ${full ? 'full' : ''}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      {area ? (
        <textarea id={`f-${k}`} rows={5} value={f[k]} aria-invalid={!!err[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      ) : (
        <input id={`f-${k}`} type={k === 'email' ? 'email' : 'text'} value={f[k]} aria-invalid={!!err[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      )}
      <span className="err" role="alert">
        {err[k]}
      </span>
    </div>
  )

  return (
    <section id="contact" className="section ct-section">
      <div className="ct-glow" aria-hidden />
      <div className="container">
        <div className="contact-grid">
          <div>
            <Reveal>
              <div className="eyebrow">04 / Your next project</div>
            </Reveal>
            <motion.h2 className="contact-title" initial="hide" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
              {['Have an idea?', 'Let’s build'].map((line, i) => (
                <span className="ct-line" key={line}>
                  <motion.span
                    variants={{ hide: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, delay: i * 0.14, ease } } }}
                  >
                    {i === 1 ? (
                      <>
                        Let’s <span className="red">build</span>
                        <Dot />
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
            <Reveal delay={0.2}>
              <p className="contact-copy">
                Let’s build something intelligent. I’m open to interesting projects, collaborations, and opportunities involving AI, machine
                learning, automation, and full-stack development.
              </p>
              <div className="ct-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setOpen(true)
                    setTimeout(() => document.getElementById('f-name')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350)
                    setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), 900)
                  }}
                >
                  Start a project <ArrowUpRight size={14} />
                </button>
                <button className={`ct-copy ${copied ? 'on' : ''}`} onClick={copyEmail} aria-live="polite">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Email copied' : 'Copy email'}
                </button>
              </div>
            </Reveal>
          </div>

          <ul className="clist">
            {rows.map((r, i) => {
              const Icon = r.icon
              const body = (
                <>
                  <span className="ic">
                    <Icon size={14} />
                  </span>
                  <span>
                    <small>{r.label}</small>
                    {r.value ? <span>{r.value}</span> : <span className="todo">Add link in profile.ts</span>}
                  </span>
                  {r.href ? <ArrowUpRight size={15} /> : <span />}
                </>
              )
              return (
                <motion.li
                  key={r.label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease }}
                >
                  {r.href ? (
                    <a className="citem" href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                      {body}
                    </a>
                  ) : (
                    <div className="citem">{body}</div>
                  )}
                </motion.li>
              )
            })}
          </ul>

          <Reveal delay={0.2} className="reel-col">
            <div className="ct-card">
              <video className="ct-video" src={cardVideo} autoPlay muted loop playsInline preload="metadata" aria-hidden />
              <div className="ct-shade" aria-hidden />
              <div className="ct-card-top">
                <span className="ct-status">
                  <i /> Open to projects
                </span>
                <span>{profile.locationShort}</span>
              </div>
              <div className="ct-card-mid">
                <span className="ct-small">Let’s build</span>
                <span className="ct-rot">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={words[w]}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.55, ease }}
                    >
                      {words[w]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
              <div className="ct-card-bot">
                <span>
                  <Clock size={13} /> Local time · PKT
                </span>
                <b>{time}</b>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="form-wrap">
          <button className="form-toggle" aria-expanded={open} aria-controls="contact-form" onClick={() => setOpen(!open)}>
            Tell me about your project <Plus size={18} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.form
                id="contact-form"
                className="form"
                noValidate
                onSubmit={submit}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                {field('name', 'Name')}
                {field('email', 'Email')}
                {field('subject', 'Subject', true)}
                {field('message', 'Message', true, true)}
                <div className="field full">
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send Message'} <ArrowUpRight size={14} />
                  </button>
                </div>
                {status && status !== 'sending' && (
                  <p className="form-status" role="status">
                    {status === 'ok' && 'Thanks — your message has been sent.'}
                    {status === 'fail' && 'Something went wrong while sending. Please try again or use email.'}
                    {status === 'unconfigured' &&
                      'This form is not connected to a delivery service yet, so your message was NOT sent. Set contactEndpoint in src/data/profile.ts to enable it.'}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
