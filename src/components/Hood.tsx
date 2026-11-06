import { useCallback, useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { Reveal } from './Reveal'

/** "Design under the hood" — drag compare: prototype notebook → shipped AI product */
export default function Hood() {
  const [pos, setPos] = useState(55)
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef(false)

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

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
            Drag to see a rough sketch become a working, intelligent interface.
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
            className="compare"
            onPointerDown={(e) => {
              drag.current = true
              ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
              move(e.clientX)
            }}
            onPointerMove={(e) => drag.current && move(e.clientX)}
            onPointerUp={() => (drag.current = false)}
          >
            {/* Final layer (right) */}
            <div className="compare-pane final">
              <span className="pane-label" style={{ right: 14, background: 'var(--accent-deep)' }}>
                LIVE PRODUCT
              </span>
              <div className="mock">
                <div className="col" style={{ justifyContent: 'center' }}>
                  <span className="eyebrow red">[ Agents · Vision · Data ]</span>
                  <h4>
                    Ask your data.
                    <br />
                    Get answers.
                  </h4>
                  <div className="card2">Model accuracy · latency · usage</div>
                  <div className="bars" aria-hidden>
                    {[40, 62, 48, 80, 66, 92, 74].map((h, i) => (
                      <i key={i} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="col" style={{ justifyContent: 'center' }}>
                  <div className="chat-me">Summarise last quarter's sales.</div>
                  <div className="chat-ai">Revenue grew in 3 of 4 regions. Here is the breakdown with sources…</div>
                  <div className="chat-me">Forecast next month.</div>
                  <div className="chat-ai">Running the prediction model…</div>
                </div>
              </div>
            </div>
            {/* Wireframe layer (left, clipped) */}
            <div className="compare-pane wire" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <span className="pane-label" style={{ left: 14, background: '#39404a', color: '#fff' }}>
                PROTOTYPE
              </span>
              <div className="mock">
                <div className="col" style={{ justifyContent: 'center' }}>
                  <div style={{ fontSize: 22 }}>hero headline here →</div>
                  <div className="ln" style={{ width: '80%' }} />
                  <div className="ln" style={{ width: '60%' }} />
                  <div className="box" style={{ height: 70 }}>chart?</div>
                  <div style={{ fontSize: 18 }}>model metrics + data source</div>
                </div>
                <div className="col" style={{ justifyContent: 'center' }}>
                  <div className="box" style={{ height: 50 }}>user question</div>
                  <div className="box" style={{ height: 70 }}>LLM answer + RAG</div>
                  <div className="box" style={{ height: 40 }}>input</div>
                </div>
              </div>
            </div>
            <div className="compare-handle" style={{ left: `${pos}%` }}>
              <button
                aria-label="Drag to compare prototype and product"
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pos)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5))
                  if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5))
                }}
              >
                <ChevronsLeftRight size={18} />
              </button>
            </div>
          </div>
          <div className="compare-foot eyebrow">
            <span>Drag to see the process</span>
            <span>Drag / ← →</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
