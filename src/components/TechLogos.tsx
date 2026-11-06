import {
  siDocker,
  siFastapi,
  siGit,
  siGithub,
  siJavascript,
  siKeras,
  siLangchain,
  siLinux,
  siMediapipe,
  siN8n,
  siOpencv,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siScikitlearn,
  siSqlite,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siYolo,
  type SimpleIcon,
} from 'simple-icons'

/** Real brand logos (simple-icons) for tools in the skills list. */
const icons: [SimpleIcon, string?][] = [
  [siPython],
  [siTensorflow],
  [siPytorch],
  [siKeras],
  [siScikitlearn, 'Scikit-learn'],
  [siOpencv],
  [siYolo, 'YOLO'],
  [siMediapipe],
  [siLangchain],
  [siFastapi],
  [siReact],
  [siTypescript],
  [siJavascript],
  [siTailwindcss, 'Tailwind'],
  [siPostgresql],
  [siSqlite],
  [siDocker],
  [siGit],
  [siGithub],
  [siLinux],
  [siN8n],
]

/** very dark brand colours would vanish on the dark theme — fall back to text colour */
const isDark = (hex: string) => {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60
}

export default function TechLogos() {
  return (
    <div className="logos">
      <div className="eyebrow red" style={{ marginBottom: 14 }}>
        Tools I build with
      </div>
      <ul className="logo-grid">
        {icons.map(([ic, name]) => (
          <li key={ic.slug} className="logo-tile" style={{ ['--brand' as string]: `#${ic.hex}` }} data-dark={isDark(ic.hex) || undefined}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d={ic.path} />
            </svg>
            <span>{name ?? ic.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
