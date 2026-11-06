import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Briefcase, Code2, Mail, MapPin, Phone, Play, Plus, ShoppingBag, UserRound } from 'lucide-react'
import { contactEndpoint, links, profile } from '../data/profile'
import { Dot, Reveal } from './Reveal'

const rows = [
  { label: 'EMAIL', value: links.email, href: links.email && `mailto:${links.email}`, icon: Mail },
  { label: 'PHONE / WHATSAPP', value: links.phone, href: links.phone && `https://wa.me/${links.phone.replace(/\D/g, '')}`, icon: Phone },
  { label: 'LINKEDIN', value: links.linkedin && 'ehtijad-ali', href: links.linkedin, icon: UserRound },
  { label: 'GITHUB', value: links.github && 'ehtijad-ali', href: links.github, icon: Code2 },
  { label: 'FIVERR', value: links.fiverr && 'saaimhl', href: links.fiverr, icon: ShoppingBag },
  { label: 'UPWORK', value: links.upwork && 'Ehtijad Ali', href: links.upwork, icon: Briefcase },
  { label: 'BASED IN', value: profile.location, href: '', icon: MapPin },
]

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

export default function Contact() {
  const [open, setOpen] = useState(false)
  const [f, setF] = useState(empty)
  const [err, setErr] = useState<Partial<Fields>>({})
  const [status, setStatus] = useState<'' | 'sending' | 'ok' | 'fail' | 'unconfigured'>('')

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
    <section id="contact" className="section">
      <div className="container">
        <div className="contact-grid">
          <Reveal>
            <div className="eyebrow">04 / Your next project</div>
            <h2 className="contact-title">
              Have an idea?
              <br />
              Let’s build<Dot />
            </h2>
            <p className="contact-copy">
              Let’s build something intelligent. I’m open to interesting projects, collaborations, and opportunities involving AI, machine
              learning, automation, and full-stack development.
            </p>
            <button className="circle-link" onClick={() => { setOpen(true); setTimeout(() => document.getElementById('f-name')?.focus(), 350) }}>
              <i>
                <ArrowUpRight size={14} />
              </i>
              CONTACT ME
            </button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="clist">
              {rows.map((r) => {
                const Icon = r.icon
                const body = (
                  <>
                    <span className="ic">
                      <Icon size={12} />
                    </span>
                    <span>
                      <small>{r.label}</small>
                      {r.value ? <span>{r.value}</span> : <span className="todo">Add link in profile.ts</span>}
                    </span>
                    <ArrowUpRight size={14} />
                  </>
                )
                return r.href ? (
                  <a key={r.label} className="citem" href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  <div key={r.label} className="citem">
                    {body}
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="reel-col">
            <div className="reel" aria-hidden>
              <div className="top">
                <span>EHTIJAD ALI SHAH</span>
                <span>AI REEL</span>
              </div>
              <div className="reel-inner">
                <h4>
                  Build
                  <br />
                  <span className="red">smarter.</span>
                </h4>
              </div>
              <span className="play">
                <Play size={16} fill="#fff" />
              </span>
            </div>
            <div className="reel-cap">AI ENGINEERING — FULL-STACK</div>
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
