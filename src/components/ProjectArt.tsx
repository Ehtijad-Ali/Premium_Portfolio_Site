/* Live, animated project covers (pure SVG + CSS animations).
   Illustrations of what each project does — not screenshots. */
import type { CSSProperties, ReactNode } from 'react'

const R = '#EF4151'
const S = '#FFA4AC'
const T = '#F2EFEB'
const M = '#A09C9A'

const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg className="pa" viewBox="0 0 800 480" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="paG" cx="70%" cy="30%" r="75%">
          <stop offset="0" stopColor={R} stopOpacity=".32" />
          <stop offset="1" stopColor={R} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="paBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#161213" />
          <stop offset="1" stopColor="#0b0a0a" />
        </linearGradient>
        <pattern id="paP" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#fff" strokeOpacity=".05" />
        </pattern>
        <linearGradient id="paArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={R} stopOpacity=".45" />
          <stop offset="1" stopColor={R} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="480" fill="url(#paBg)" />
      <rect width="800" height="480" fill="url(#paP)" />
      <rect width="800" height="480" fill="url(#paG)" className="pa-glow" />
      {children}
    </svg>
  )
}

/* status pill, top-right (top-left is reserved for the category tag) */
function Live({ text, x = 760 }: { text: string; x?: number }) {
  return (
    <g fontFamily="Manrope, Arial" fontSize="15" fontWeight="700">
      <circle cx={x - text.length * 10.2 - 14} cy="44" r="6" fill={R} className="pa-blink" />
      <text x={x} y="49" fill={T} textAnchor="end" letterSpacing="1.5">
        {text}
      </text>
    </g>
  )
}

/* 01 — face-swap detection */
function FaceSwap() {
  const pts = [[360, 210], [440, 210], [400, 262], [372, 312], [428, 312], [338, 262], [462, 262], [400, 150]]
  return (
    <Frame label="Animated face verification scan">
      <Live text="LIVE · 00:12:48" />
      <g fill="none" stroke={T} strokeWidth="2.5" opacity=".9">
        <ellipse cx="400" cy="245" rx="95" ry="122" />
        <path d="M355 215q15-12 30 0M415 215q15-12 30 0M400 230v40l-12 8M370 310q30 18 60 0" />
      </g>
      {/* landmark mesh */}
      <g stroke={S} strokeOpacity=".35" className="pa-mesh">
        <path d="M360 210L400 262L440 210M338 262L400 262L462 262M372 312L400 262L428 312M360 210L400 150L440 210" fill="none" />
      </g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={S} className="pa-pop" style={d(i * 0.18)} />
      ))}
      <g stroke={R} strokeWidth="3" fill="none" className="pa-breathe">
        <path d="M270 100h40M270 100v40M530 100h-40M530 100v40M270 395h40M270 395v-40M530 395h-40M530 395v-40" />
      </g>
      <g className="pa-scan">
        <rect x="270" y="0" width="260" height="3" fill={R} />
        <rect x="270" y="-40" width="260" height="40" fill="url(#paArea)" transform="scale(1,-1) translate(0,-3)" opacity=".5" />
      </g>
      {/* confidence meter */}
      <g fontFamily="Manrope, Arial">
        <text x="580" y="292" fill={M} fontSize="13" fontWeight="700" letterSpacing="2">MATCH CONFIDENCE</text>
        <rect x="580" y="304" width="160" height="8" rx="4" fill="#ffffff1a" />
        <rect x="580" y="304" width="160" height="8" rx="4" fill={R} className="pa-fill" />
        <rect x="580" y="330" width="160" height="44" rx="8" fill={R} className="pa-badge" />
        <text x="660" y="358" fill="#fff" fontSize="16" fontWeight="800" textAnchor="middle" className="pa-badge">IDENTITY ✓</text>
      </g>
    </Frame>
  )
}

/* 02 — AI interview */
function Interview() {
  return (
    <Frame label="Animated AI interview conversation">
      <Live text="AI INTERVIEWER · REC" />
      <g fontFamily="Manrope, Arial" fontSize="18">
        <g className="pa-msg" style={d(0)}>
          <circle cx="62" cy="135" r="20" fill="none" stroke={S} strokeWidth="2.5" />
          <path d="M53 135h18M62 126v18" stroke={S} strokeWidth="2.5" />
          <rect x="96" y="102" width="320" height="66" rx="16" fill="#1f1b1c" stroke="#ffffff22" />
          <text x="120" y="142" fill={T}>Tell me about a project you led.</text>
        </g>
        <g className="pa-msg" style={d(1.2)}>
          <rect x="400" y="196" width="320" height="66" rx="16" fill={R} />
          <text x="424" y="236" fill="#fff">I built a vision pipeline…</text>
        </g>
        <g className="pa-msg" style={d(2.4)}>
          <rect x="96" y="290" width="92" height="40" rx="14" fill="#1f1b1c" stroke="#ffffff22" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={124 + i * 18} cy="310" r="5" fill={M} className="pa-dot" style={d(i * 0.2)} />
          ))}
        </g>
      </g>
      <g fill={S}>
        {Array.from({ length: 44 }, (_, i) => {
          const h = 14 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.31)) * 64
          return <rect key={i} x={110 + i * 13.6} y={410 - h / 2} width="7" height={h} rx="3" className="pa-wave" style={d((i % 11) * 0.09)} />
        })}
      </g>
    </Frame>
  )
}

/* 03 — image generation */
function ImageGen() {
  return (
    <Frame label="Animated batch image generation">
      <Live text="GENERATING ×20" />
      {Array.from({ length: 20 }, (_, i) => {
        const c = i % 5
        const r = Math.floor(i / 5)
        const x = 170 + c * 96
        const y = 84 + r * 84
        const h = (i * 37) % 360
        return (
          <g key={i} className="pa-tile" style={d(i * 0.12)}>
            <rect x={x} y={y} width="84" height="72" rx="6" fill={`hsl(${h},55%,${30 + (i % 4) * 8}%)`} />
            <circle cx={x + 60} cy={y + 22} r="9" fill="#fff" opacity=".5" />
            <path d={`M${x} ${y + 72}l28-30 20 18 14-12 22 24z`} fill="#000" opacity=".35" />
          </g>
        )
      })}
      <g fontFamily="Manrope, Arial">
        <rect x="170" y="430" width="468" height="6" rx="3" fill="#ffffff1a" />
        <rect x="170" y="430" width="468" height="6" rx="3" fill={R} className="pa-fill pa-slow" />
      </g>
      <g className="pa-bob">
        <rect x="680" y="300" width="80" height="100" rx="8" fill="#1f1b1c" stroke={S} strokeWidth="2" />
        <path d="M720 300v60" stroke={S} strokeWidth="2" strokeDasharray="6 6" />
        <text x="720" y="388" fill={T} fontFamily="Manrope, Arial" fontSize="15" fontWeight="700" textAnchor="middle">.ZIP</text>
      </g>
    </Frame>
  )
}

/* 04 — profile optimizer */
function Profile() {
  const C = 2 * Math.PI * 56
  return (
    <Frame label="Animated profile score dashboard">
      <Live text="OPTIMIZING" />
      <rect x="110" y="80" width="580" height="350" rx="12" fill="#1a1717" stroke="#ffffff22" />
      <rect x="110" y="80" width="580" height="36" rx="12" fill="#231f20" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={136 + i * 20} cy="98" r="6" fill={i ? '#ffffff33' : R} />
      ))}
      <circle cx="200" cy="186" r="42" fill="#2a2526" />
      <circle cx="200" cy="174" r="15" fill={M} />
      <path d="M173 210q27-25 54 0" fill={M} />
      <rect x="270" y="160" width="220" height="16" rx="4" fill={T} />
      <rect x="270" y="188" width="160" height="10" rx="4" fill={M} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="160" y={262 + i * 36} width={330 - i * 40} height="12" rx="4" fill="#ffffff1a" />
          <rect x="160" y={262 + i * 36} width={(330 - i * 40) * (0.92 - i * 0.14)} height="12" rx="4" fill={R} className="pa-grow" style={d(i * 0.25)} />
        </g>
      ))}
      <g transform="translate(600 250)">
        <circle r="56" fill="none" stroke="#ffffff22" strokeWidth="10" />
        <circle r="56" fill="none" stroke={R} strokeWidth="10" strokeLinecap="round" transform="rotate(-90)" strokeDasharray={`${C * 0.87} ${C}`} className="pa-ring" style={{ ['--c' as string]: C }} />
        <text y="10" fill={T} fontSize="30" fontWeight="800" textAnchor="middle" fontFamily="Manrope, Arial">87</text>
      </g>
      <text x="600" y="342" fill={S} fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Manrope, Arial" letterSpacing="1">PROFILE SCORE</text>
    </Frame>
  )
}

/* 05 — CNN classifier */
function Cnn() {
  const layers: [number, number, number][] = [[80, 150, 200], [190, 170, 160], [290, 190, 120], [380, 210, 80], [460, 225, 50]]
  const curve = 'M520 420 C560 380 580 330 620 310 S690 280 760 270'
  return (
    <Frame label="Animated convolutional neural network training">
      <Live text="TRAINING · EPOCH 24" />
      {layers.map(([x, y, s], i) => (
        <g key={i} className="pa-layer" style={d(i * 0.3)}>
          {[0, 1, 2].map((k) => (
            <rect key={k} x={x + k * 12} y={y - k * 10} width={s * 0.55} height={s} fill={k === 2 ? '#2a2526' : '#1f1b1c'} stroke={i === 4 ? R : S} strokeOpacity={0.45 + k * 0.25} strokeWidth="1.5" />
          ))}
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M530 250L600 ${130 + i * 32}`} stroke={S} strokeOpacity=".35" className="pa-flow" />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx="610" cy={130 + i * 32} r="10" fill={i === 2 ? R : '#2a2526'} stroke={S} strokeOpacity=".6" className={i === 2 ? 'pa-pulse' : undefined} />
      ))}
      <text x="645" y="222" fill={T} fontSize="38" fontWeight="800" fontFamily="Manrope, Arial">92%</text>
      <text x="647" y="244" fill={M} fontSize="12" fontWeight="700" fontFamily="Manrope, Arial" letterSpacing="2">ACCURACY</text>
      {/* training curve */}
      <path d="M520 430H760M520 430V300" stroke="#ffffff22" />
      <path d={`${curve} L760 430 L520 430Z`} fill="url(#paArea)" className="pa-area" />
      <path d={curve} fill="none" stroke={R} strokeWidth="3" className="pa-draw" />
    </Frame>
  )
}

/* 06 — translation + FAQ chatbot */
function GenAi() {
  return (
    <Frame label="Animated translation and FAQ chatbot">
      <Live text="TRANSLATE · FAQ BOT" />
      <g fontFamily="Manrope, Arial">
        <g className="pa-msg" style={d(0)}>
          <rect x="60" y="96" width="270" height="110" rx="16" fill="#1f1b1c" stroke="#ffffff22" />
          <text x="84" y="134" fill={M} fontSize="13" fontWeight="700" letterSpacing="1">ENGLISH</text>
          <text x="84" y="172" fill={T} fontSize="23">Hello, how are you?</text>
        </g>
        <g className="pa-flow-x">
          <path d="M350 151h70" stroke={R} strokeWidth="3" strokeDasharray="8 8" className="pa-flow" />
          <path d="M410 141l12 10-12 10" fill="none" stroke={R} strokeWidth="3" />
        </g>
        <g className="pa-msg" style={d(0.9)}>
          <rect x="440" y="96" width="290" height="110" rx="16" fill={R} />
          <text x="464" y="134" fill="#ffe3e6" fontSize="13" fontWeight="700" letterSpacing="1">ESPAÑOL</text>
          <text x="464" y="172" fill="#fff" fontSize="23">Hola, ¿cómo estás?</text>
        </g>
        <g className="pa-msg" style={d(1.8)}>
          <rect x="60" y="250" width="330" height="54" rx="14" fill="#1f1b1c" stroke="#ffffff22" />
          <text x="82" y="284" fill={T} fontSize="17">What are your support hours?</text>
        </g>
        <g className="pa-msg" style={d(2.7)}>
          <rect x="310" y="326" width="420" height="54" rx="14" fill="#2a2526" stroke={S} strokeOpacity=".5" />
          <text x="332" y="360" fill={T} fontSize="17">We're available 9am–6pm, Mon–Fri.</text>
        </g>
      </g>
    </Frame>
  )
}

export const projectArt: Record<string, () => ReactNode> = {
  'face-swap-detection': FaceSwap,
  'ai-interview': Interview,
  'image-generation': ImageGen,
  'profile-optimizer': Profile,
  'image-classification': Cnn,
  'genai-tools': GenAi,
}
