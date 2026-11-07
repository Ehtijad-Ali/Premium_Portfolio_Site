import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Award, X } from 'lucide-react'
import portrait from '../assets/image1.png'
import { certifications, type Certification } from '../data/profile'
import { Dot } from './Reveal'

const ease = [0.22, 1, 0.36, 1] as const
const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('') || s[0]

/** positions around the portrait (percent of stage), balanced left / right */
const SLOTS = [
  { x: 14, y: 22 },
  { x: 86, y: 20 },
  { x: 9, y: 50 },
  { x: 91, y: 48 },
  { x: 15, y: 78 },
  { x: 85, y: 77 },
  { x: 50, y: 95 },
  { x: 30, y: 8 },
  { x: 70, y: 7 },
]

const motionAllowed = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('reduce-motion')

/* ------------------------------------------------------------------ */
/* Particle portrait: canvas, struct-of-arrays, one rAF loop.          */
/* `progress` (0 = scattered, 1 = assembled) is read from a ref, so    */
/* scrolling never triggers a React render.                            */
/* ------------------------------------------------------------------ */
function ParticlePortrait({ progress }: { progress: React.MutableRefObject<number> }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current!
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const img = new Image()
    img.src = portrait

    let raf = 0
    let alive = true
    let W = 0
    let H = 0
    let dpr = 1
    let n = 0
    let hx: Float32Array, hy: Float32Array, sx: Float32Array, sy: Float32Array
    let ox: Float32Array, oy: Float32Array, ph: Float32Array
    let col: string[] = []
    let size = 3
    let imgBox = { x: 0, y: 0, w: 0, h: 0 }
    const mouse = { x: -9999, y: -9999, on: false }
    let light = document.documentElement.dataset.theme === 'light'

    const build = () => {
      const r = el.getBoundingClientRect()
      if (!r.width || !img.naturalWidth) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width
      H = r.height
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // fit portrait inside the box (contain, bottom aligned like the hero)
      const s = Math.min(W / img.naturalWidth, H / img.naturalHeight)
      imgBox = { w: img.naturalWidth * s, h: img.naturalHeight * s, x: 0, y: 0 }
      imgBox.x = (W - imgBox.w) / 2
      imgBox.y = H - imgBox.h

      // responsive density: fewer particles on small / low-power devices
      const cores = navigator.hardwareConcurrency || 4
      size = W < 420 || cores <= 4 ? 5 : W < 700 ? 4 : 3.5
      const sw = Math.max(1, Math.round(imgBox.w / size))
      const sh = Math.max(1, Math.round(imgBox.h / size))
      const off = document.createElement('canvas')
      off.width = sw
      off.height = sh
      const o = off.getContext('2d', { willReadFrequently: true })!
      o.drawImage(img, 0, 0, sw, sh)
      const data = o.getImageData(0, 0, sw, sh).data

      const pts: number[] = []
      const cs: string[] = []
      for (let y = 0; y < sh; y++)
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4
          if (data[i + 3] < 90) continue
          pts.push(x, y)
          cs.push(`rgb(${data[i]},${data[i + 1]},${data[i + 2]})`)
        }
      n = pts.length / 2
      hx = new Float32Array(n)
      hy = new Float32Array(n)
      sx = new Float32Array(n)
      sy = new Float32Array(n)
      ox = new Float32Array(n)
      oy = new Float32Array(n)
      ph = new Float32Array(n)
      col = cs
      const cx = W / 2
      const cy = H / 2
      for (let k = 0; k < n; k++) {
        const px = imgBox.x + (pts[k * 2] + 0.5) * (imgBox.w / sw)
        const py = imgBox.y + (pts[k * 2 + 1] + 0.5) * (imgBox.h / sh)
        hx[k] = px
        hy[k] = py
        // scatter outward from centre, with randomness — still hints at the silhouette
        const a = Math.atan2(py - cy, px - cx) + (Math.random() - 0.5) * 1.4
        const d = 60 + Math.random() * Math.max(W, H) * 0.55
        sx[k] = px + Math.cos(a) * d
        sy[k] = py + Math.sin(a) * d - Math.random() * 80
        ph[k] = Math.random() * Math.PI * 2
      }
    }

    const draw = (time: number) => {
      if (!alive) return
      raf = requestAnimationFrame(draw)
      if (!n) return
      const reduced = !motionAllowed()
      const p = reduced ? 1 : progress.current
      ctx.clearRect(0, 0, W, H)

      // fully assembled & no cursor nearby → draw the crisp original image
      const crisp = Math.max(0, (p - 0.94) / 0.06)
      const t = time / 1000
      const tint = light ? '20,16,16' : '242,239,235'
      const R = 70
      const hoverActive = mouse.on && !reduced

      for (let k = 0; k < n; k++) {
        // per-particle stagger so the image builds bottom-up, not all at once
        const delay = (1 - hy[k] / H) * 0.25
        let q = Math.min(1, Math.max(0, (p - delay) / (1 - 0.25)))
        q = q * q * (3 - 2 * q)
        const drift = reduced ? 0 : (1 - q) * 6
        let x = sx[k] + (hx[k] - sx[k]) * q + Math.sin(t * 0.8 + ph[k]) * drift
        let y = sy[k] + (hy[k] - sy[k]) * q + Math.cos(t * 0.7 + ph[k]) * drift

        // gentle cursor repulsion with spring back
        let tx = 0
        let ty = 0
        if (hoverActive) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / R) * 10
            tx = (dx / d) * f
            ty = (dy / d) * f
          }
        }
        ox[k] += (tx - ox[k]) * 0.12
        oy[k] += (ty - oy[k]) * 0.12
        x += ox[k]
        y += oy[k]

        if (crisp >= 1 && Math.abs(ox[k]) + Math.abs(oy[k]) < 0.3) continue
        ctx.globalAlpha = (0.25 + 0.75 * q) * (1 - crisp * 0.85)
        ctx.fillStyle = q > 0.6 ? col[k] : `rgb(${tint})`
        const s = size * (0.55 + 0.45 * q)
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
      }
      if (crisp > 0) {
        ctx.globalAlpha = crisp
        ctx.drawImage(img, imgBox.x, imgBox.y, imgBox.w, imgBox.h)
        // re-draw displaced particles on top so cursor interaction stays visible
        if (hoverActive) {
          for (let k = 0; k < n; k++) {
            if (Math.abs(ox[k]) + Math.abs(oy[k]) < 0.3) continue
            ctx.globalAlpha = 1
            ctx.fillStyle = col[k]
            ctx.fillRect(hx[k] + ox[k] - size / 2, hy[k] + oy[k] - size / 2, size, size)
          }
        }
      }
      ctx.globalAlpha = 1
    }

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.on = mouse.x > -40 && mouse.y > -40 && mouse.x < W + 40 && mouse.y < H + 40
    }
    const onLeave = () => {
      mouse.on = false
    }

    let tm = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(tm)
      tm = window.setTimeout(build, 120)
    })
    const mo = new MutationObserver(() => {
      light = document.documentElement.dataset.theme === 'light'
    })

    img.onload = () => {
      build()
      raf = requestAnimationFrame(draw)
    }
    ro.observe(el)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      clearTimeout(tm)
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [progress])

  return (
    <div ref={wrap} className="cs-portrait">
      <canvas ref={canvas} role="img" aria-label="Portrait of Ehtijad Ali Shah assembling from particles" />
    </div>
  )
}

/* ------------------------------------------------------------------ */

function CertChip({ c, i, onOpen, appear }: { c: Certification; i: number; onOpen: () => void; appear: MotionValue<number> }) {
  const slot = SLOTS[i % SLOTS.length]
  return (
    <motion.button
      className="cs-cert"
      style={{ left: `${slot.x}%`, top: `${slot.y}%`, opacity: appear, scale: useTransform(appear, [0, 1], [0.85, 1]) }}
      onClick={onOpen}
      aria-label={`${c.title}, ${c.issuer}. Open details`}
    >
      <span className="cs-badge">{initials(c.issuer)}</span>
      <span className="cs-text">
        <b>{c.title}</b>
        <small>
          {c.issuer}
          {c.date && ` · ${c.date}`}
        </small>
      </span>
    </motion.button>
  )
}

export default function CertShowcase() {
  const section = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [active, setActive] = useState<Certification | null>(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end end'] })
  // assemble between 15% and 70% of the section's scroll range
  const p = useTransform(scrollYProgress, [0.15, 0.7], [0, 1], { clamp: true })
  useMotionValueEvent(p, 'change', (v) => {
    progress.current = v
  })
  const certsIn = useTransform(scrollYProgress, [0.55, 0.8], [0, 1], { clamp: true })
  const headY = useTransform(scrollYProgress, [0, 0.6], [40, 0])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <section ref={section} id="certificates" className="cs-section" aria-labelledby="cs-title">
      <div className="cs-sticky">
        <div className="container cs-inner">
          <motion.div className="cs-head" style={{ y: headY }}>
            <div className="eyebrow">Credentials</div>
            <h2 id="cs-title" className="sec-title">
              Pieces that <span className="red">built</span> me<Dot />
            </h2>
            <p className="cs-sub">Scroll to assemble · hover a credential for details</p>
          </motion.div>

          <div className="cs-stage">
            <div className="cs-halo" aria-hidden />
            <ParticlePortrait progress={progress} />
            {certifications.map((c, i) => (
              <CertChip key={c.title} c={c} i={i} appear={certsIn} onOpen={() => setActive(c)} />
            ))}
          </div>

          {/* mobile / tablet: certificates as a list under the portrait */}
          <ul className="cs-list">
            {certifications.map((c) => (
              <li key={c.title}>
                <button className="cs-cert cs-cert-static" onClick={() => setActive(c)}>
                  <span className="cs-badge">{initials(c.issuer)}</span>
                  <span className="cs-text">
                    <b>{c.title}</b>
                    <small>
                      {c.issuer}
                      {c.date && ` · ${c.date}`}
                    </small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div className="modal-bg" onClick={() => setActive(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="cs-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cs-m-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 30, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <button className="modal-close" onClick={() => setActive(null)} aria-label="Close" autoFocus>
                <X size={18} />
              </button>
              {active.image ? (
                <img className="cs-m-img" src={active.image} alt={`${active.title} certificate`} />
              ) : (
                <div className="cs-m-art">
                  <Award size={44} strokeWidth={1.2} />
                  <span>Certificate of completion</span>
                </div>
              )}
              <div className="cs-m-body">
                <div className="eyebrow red">{active.issuer}</div>
                <h3 id="cs-m-title">{active.title}</h3>
                <p className="muted">{active.date ? `Completed ${active.date}` : 'Completion date not listed.'}</p>
                {active.url && (
                  <a className="btn btn-primary" href={active.url} target="_blank" rel="noreferrer">
                    Verify credential
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
