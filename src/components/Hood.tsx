import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import prototypeImg from '../assets/prototype.png'
import productImg from '../assets/product.png'

/* ---------- "Thanos snap" dust effect ----------
   The product image is split into small particles rendered into a single pixel
   buffer each frame (fast + smooth). Hover → the image disintegrates into dust
   drifting away on a "wind" (left → right). Leave → the dust flows back. */

const CELL = 3 // particle size in CSS px
const DURATION = 2200 // ms for a full snap
const LIFE = 0.42 // portion of the timeline each particle spends flying

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeIn = (t: number) => t * t // soft acceleration, like dust caught by wind
const smooth = (t: number) => t * t * (3 - 2 * t)

type Snap = {
  w: number
  h: number
  cell: number
  src: Uint32Array
  out: ImageData
  out32: Uint32Array
  img: HTMLCanvasElement
  px: Int32Array
  py: Int32Array
  col: Uint32Array
  vx: Float32Array
  vy: Float32Array
  delay: Float32Array
  phase: Float32Array
}

export default function Hood() {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const S = useRef<Snap | null>(null)
  const progress = useRef(0) // 0 = intact product, 1 = fully dusted
  const target = useRef(0)
  const raf = useRef(0)
  const last = useRef(0)
  const [show, setShow] = useState(false)
  const [ready, setReady] = useState(false)

  const reduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion')

  function draw() {
    const cv = canvas.current
    const s = S.current
    if (!cv || !s) return
    const ctx = cv.getContext('2d')!
    const t = easeInOut(progress.current)
    if (t <= 0) {
      ctx.clearRect(0, 0, s.w, s.h)
      ctx.drawImage(s.img, 0, 0)
      return
    }
    const { w, h, cell, src, out32, px, py, col, vx, vy, delay, phase } = s
    out32.fill(0)
    const n = px.length
    for (let i = 0; i < n; i++) {
      const local = (t - delay[i]) / LIFE
      const x0 = px[i]
      const y0 = py[i]
      if (local <= 0) {
        // still attached: copy the original block (keeps full detail)
        for (let yy = y0, ye = Math.min(y0 + cell, h); yy < ye; yy++) {
          const row = yy * w
          for (let xx = x0, xe = Math.min(x0 + cell, w); xx < xe; xx++) out32[row + xx] = src[row + xx]
        }
        continue
      }
      if (local >= 1) continue
      const e = easeIn(local)
      const a = 1 - smooth(local)
      const size = Math.max(1, Math.round(cell * (1 - local * 0.55)))
      const x = Math.round(x0 + vx[i] * e + Math.sin(phase[i] + local * 5) * 10 * local)
      const y = Math.round(y0 + vy[i] * e + Math.cos(phase[i] + local * 4) * 6 * local)
      if (x >= w || y >= h || x + size <= 0 || y + size <= 0) continue
      const c = ((col[i] & 0x00ffffff) | ((Math.round(a * 255) & 255) << 24)) >>> 0
      for (let yy = Math.max(0, y), ye = Math.min(y + size, h); yy < ye; yy++) {
        const row = yy * w
        for (let xx = Math.max(0, x), xe = Math.min(x + size, w); xx < xe; xx++) out32[row + xx] = c
      }
    }
    ctx.putImageData(s.out, 0, 0)
  }

  // Build particles from the product image at the current box size
  useEffect(() => {
    const img = new Image()
    img.src = productImg

    const build = () => {
      const el = box.current
      const cv = canvas.current
      if (!el || !cv || !img.complete || !img.naturalWidth) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(el.clientWidth * dpr)
      const h = Math.round(el.clientHeight * dpr)
      if (!w || !h) return
      cv.width = w
      cv.height = h
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const octx = off.getContext('2d', { willReadFrequently: true })!
      octx.imageSmoothingQuality = 'high'
      octx.drawImage(img, 0, 0, w, h)
      const src = new Uint32Array(octx.getImageData(0, 0, w, h).data.buffer)
      const cell = Math.max(2, Math.round(CELL * dpr))
      const cols = Math.ceil(w / cell)
      const rows = Math.ceil(h / cell)
      const n = cols * rows
      const px = new Int32Array(n)
      const py = new Int32Array(n)
      const col = new Uint32Array(n)
      const vx = new Float32Array(n)
      const vy = new Float32Array(n)
      const delay = new Float32Array(n)
      const phase = new Float32Array(n)
      let i = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          const x = c * cell
          const y = r * cell
          px[i] = x
          py[i] = y
          col[i] = src[Math.min(y + (cell >> 1), h - 1) * w + Math.min(x + (cell >> 1), w - 1)]
          // wind: drift right and up, with some spread
          vx[i] = (120 + Math.random() * 260) * dpr
          vy[i] = -(40 + Math.random() * 160) * dpr
          // sweep left → right with an organic, noisy edge
          const wave = Math.sin((y / h) * Math.PI * 3) * 0.04
          delay[i] = Math.min(1 - LIFE, Math.max(0, (x / w) * (1 - LIFE - 0.12) + wave + Math.random() * 0.12))
          phase[i] = Math.random() * Math.PI * 2
        }
      }
      const out = new ImageData(w, h)
      S.current = { w, h, cell, src, out, out32: new Uint32Array(out.data.buffer), img: off, px, py, col, vx, vy, delay, phase }
      draw()
      setReady(true)
    }

    img.onload = build
    let to = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(to)
      to = window.setTimeout(build, 120)
    })
    if (box.current) ro.observe(box.current)
    return () => {
      ro.disconnect()
      clearTimeout(to)
      cancelAnimationFrame(raf.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function tick(now: number) {
    const dt = Math.min(48, now - last.current) // clamp so a dropped frame doesn't jump
    last.current = now
    const dir = Math.sign(target.current - progress.current)
    progress.current = Math.min(1, Math.max(0, progress.current + (dir * dt) / DURATION))
    draw()
    if (progress.current !== target.current) raf.current = requestAnimationFrame(tick)
  }

  function snap(on: boolean) {
    setShow(on)
    target.current = on ? 1 : 0
    cancelAnimationFrame(raf.current)
    if (reduced()) {
      progress.current = target.current
      draw()
      return
    }
    last.current = performance.now()
    raf.current = requestAnimationFrame(tick)
  }

  return (
    <section className="section hood" aria-label="From prototype to product">
      <div className="container hood-grid">
        <Reveal>
          <div className="eyebrow">AI under the hood</div>
          <h2 className="hood-title">
            From prototype.
            <br />
            <span className="red">To product.</span>
          </h2>
          <p className="hood-copy">
            One idea. Every layer of engineering.
            <br />
            Hover over the product to see the rough sketch behind it.
          </p>
          <p className="eyebrow" style={{ marginTop: 26 }}>
            AI ASSISTANT CONCEPT
            <br />
            LLM · RAG · FULL-STACK
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            ref={box}
            className={'compare snap' + (show ? ' show-proto' : '')}
            tabIndex={0}
            role="button"
            aria-pressed={show}
            aria-label="Show the prototype behind the product"
            onMouseEnter={() => snap(true)}
            onMouseLeave={() => snap(false)}
            onFocus={() => snap(true)}
            onBlur={() => snap(false)}
            onClick={(e) => {
              if ((e.nativeEvent as PointerEvent).pointerType !== 'mouse') snap(!show)
            }}
          >
            {/* Prototype sits underneath, always */}
            <div className="compare-pane">
              <img className="compare-img" src={prototypeImg} alt="Hand-drawn prototype wireframe" draggable={false} />
              <span className="pane-label proto-label" style={{ left: 14, background: '#39404a', color: '#fff' }}>
                PROTOTYPE
              </span>
            </div>
            {/* Product: static image until the particle canvas is ready */}
            {!ready && <img className="compare-img" src={productImg} alt="" draggable={false} style={{ zIndex: 2 }} />}
            <canvas ref={canvas} className="snap-canvas" role="img" aria-label="Finished AI product interface" />
            <span className="pane-label product-label" style={{ right: 14, background: 'var(--accent-deep)' }}>
              LIVE PRODUCT
            </span>
          </div>
          <div className="compare-foot eyebrow">
            <span>Hover to see the prototype</span>
            <span>Hover / Tap</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
