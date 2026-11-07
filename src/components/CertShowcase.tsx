import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import portrait from '../assets/image1.png'
import {
  siDocker, siFastapi, siGithub, siLangchain, siN8n, siOpencv, siPython, siPytorch, siReact, siTensorflow, siTypescript, siYolo,
  type SimpleIcon,
} from 'simple-icons'
import { Dot } from './Reveal'


/** the stack that built me — real tools from the skills list, placed around the portrait */
type Piece = { icon: SimpleIcon; name?: string; role: string; x: number; y: number; d: number }
const PIECES: Piece[] = [
  { icon: siPython, role: 'Core language', x: 12, y: 16, d: 0 },
  { icon: siTensorflow, role: 'Deep learning', x: 25, y: 36, d: 0.04 },
  { icon: siPytorch, role: 'Deep learning', x: 8, y: 52, d: 0.08 },
  { icon: siOpencv, role: 'Computer vision', x: 22, y: 70, d: 0.12 },
  { icon: siYolo, name: 'YOLO', role: 'Object detection', x: 10, y: 84, d: 0.16 },
  { icon: siLangchain, role: 'LLM & agents', x: 32, y: 87, d: 0.2 },
  { icon: siReact, role: 'Frontend', x: 88, y: 16, d: 0.02 },
  { icon: siTypescript, role: 'Frontend', x: 75, y: 36, d: 0.06 },
  { icon: siFastapi, role: 'Backend APIs', x: 92, y: 52, d: 0.1 },
  { icon: siN8n, role: 'Automation', x: 78, y: 70, d: 0.14 },
  { icon: siDocker, role: 'Deployment', x: 90, y: 84, d: 0.18 },
  { icon: siGithub, role: 'Version control', x: 68, y: 87, d: 0.22 },
]
/** very dark brand colours fall back to the text colour */
const isDark = (hex: string) => {
  const n = parseInt(hex, 16)
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) < 60
}

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

function PieceChip({ p, appear }: { p: Piece; appear: MotionValue<number> }) {
  const o = useTransform(appear, [p.d, p.d + 0.55], [0, 1], { clamp: true })
  const sc = useTransform(o, [0, 1], [0.4, 1])
  const fromX = p.x < 50 ? -60 : 60
  const tx = useTransform(o, [0, 1], [fromX, 0])
  return (
    <motion.div
      className="cs-piece"
      tabIndex={0}
      style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: o, scale: sc, x: tx, ['--brand' as string]: `#${p.icon.hex}` }}
      data-dark={isDark(p.icon.hex) || undefined}
      data-side={p.x < 50 ? 'l' : 'r'}
    >
      <span className="cs-orb">
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d={p.icon.path} />
        </svg>
      </span>
      <span className="cs-tip">
        <b>{p.name ?? p.icon.title}</b>
        <small>{p.role}</small>
      </span>
    </motion.div>
  )
}

export default function CertShowcase() {
  const section = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end end'] })
  // assemble between 15% and 70% of the section's scroll range
  const p = useTransform(scrollYProgress, [0.15, 0.7], [0, 1], { clamp: true })
  useMotionValueEvent(p, 'change', (v) => {
    progress.current = v
  })
  const piecesIn = useTransform(scrollYProgress, [0.45, 0.85], [0, 1], { clamp: true })
  const headY = useTransform(scrollYProgress, [0, 0.6], [40, 0])

  return (
    <section ref={section} id="stack" className="cs-section" aria-labelledby="cs-title">
      <div className="cs-sticky">
        <div className="container cs-inner">
          <motion.div className="cs-head" style={{ y: headY }}>
            <div className="eyebrow">The stack</div>
            <h2 id="cs-title" className="sec-title">
              Pieces that <span className="red">built</span> me<Dot />
            </h2>
            <p className="cs-sub">Scroll to assemble · hover a piece</p>
          </motion.div>

          <div className="cs-stage">
            <div className="cs-halo" aria-hidden />
            <svg className="cs-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {PIECES.map((pc) => (
                <line key={pc.icon.slug} x1={pc.x} y1={pc.y} x2={50} y2={45} />
              ))}
            </svg>
            <ParticlePortrait progress={progress} />
            {PIECES.map((pc) => (
              <PieceChip key={pc.icon.slug} p={pc} appear={piecesIn} />
            ))}
          </div>

          {/* tablet / mobile: the stack as a logo row under the portrait */}
          <ul className="cs-list">
            {PIECES.map((pc) => (
              <li key={pc.icon.slug} className="cs-mini" style={{ ['--brand' as string]: `#${pc.icon.hex}` }} data-dark={isDark(pc.icon.hex) || undefined}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d={pc.icon.path} />
                </svg>
                <span>
                  <b>{pc.name ?? pc.icon.title}</b>
                  <small>{pc.role}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
