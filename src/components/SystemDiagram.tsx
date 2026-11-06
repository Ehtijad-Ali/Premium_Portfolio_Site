/* Vertical system-design diagram for "From idea to deployment".
   Pure SVG, coloured with the site's CSS tokens, so it adapts to dark & light themes. */

type BoxProps = { x: number; y: number; w: number; h?: number; label: string; sub?: string; hot?: boolean }

function Box({ x, y, w, h = 44, label, sub, hot }: BoxProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className={hot ? 'sd-box sd-hot' : 'sd-box'} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} className="sd-label" textAnchor="middle">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 11} className="sd-sub" textAnchor="middle">
          {sub}
        </text>
      )}
    </g>
  )
}

function Stage({ y, n, title }: { y: number; n: string; title: string }) {
  return (
    <g>
      <text x={20} y={y} className="sd-num">
        {n}
      </text>
      <text x={44} y={y} className="sd-stage">
        {title}
      </text>
    </g>
  )
}

/** vertical flow arrow */
function Down({ y1, y2, x = 200 }: { y1: number; y2: number; x?: number }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 6} className="sd-flow" />
      <path d={`M${x - 4} ${y2 - 8} L${x} ${y2} L${x + 4} ${y2 - 8}`} className="sd-head" />
    </g>
  )
}

/** horizontal two-way link */
function Link({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <line x1={x1} y1={y} x2={x2} y2={y} className="sd-flow sd-h" />
}

export default function SystemDiagram() {
  return (
    <figure className="sd" aria-label="System design: discover, data and design, model, build, launch, with a feedback loop">
      <svg viewBox="0 0 400 690" role="img" xmlns="http://www.w3.org/2000/svg">
        <title>From idea to deployment — system design</title>
        <defs>
          <linearGradient id="sdCore" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent-dark)" stopOpacity="0.06" />
          </linearGradient>
          <pattern id="sdGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" className="sd-grid" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="400" height="690" fill="url(#sdGrid)" />

        {/* 01 DISCOVER */}
        <Stage y={30} n="01" title="DISCOVER" />
        <Box x={20} y={44} w={108} label="Users" sub="needs · pain" />
        <Box x={146} y={44} w={108} label="Goals" sub="KPIs · scope" />
        <Box x={272} y={44} w={108} label="Data sources" sub="APIs · files · DB" />
        <Down y1={90} y2={150} />

        {/* 02 DATA & DESIGN */}
        <Stage y={136} n="02" title="DATA & DESIGN" />
        <Box x={20} y={150} w={108} label="Ingest" sub="ETL pipeline" />
        <Link x1={128} x2={146} y={172} />
        <Box x={146} y={150} w={108} label="Clean · EDA" sub="features" />
        <Link x1={254} x2={272} y={172} />
        <Box x={272} y={150} w={108} label="Product flow" sub="UX · wireframe" />
        <Down y1={196} y2={256} />

        {/* 03 MODEL */}
        <Stage y={242} n="03" title="MODEL" />
        <rect x={20} y={256} width={360} height={104} rx={8} fill="url(#sdCore)" className="sd-core" />
        <text x={36} y={276} className="sd-core-title">
          AI CORE
        </text>
        <Box x={36} y={286} w={100} h={40} label="ML models" sub="train · tune" />
        <Box x={150} y={286} w={100} h={40} label="LLM · RAG" sub="prompt · embed" hot />
        <Box x={264} y={286} w={100} h={40} label="Vision" sub="detect · track" />
        <text x={200} y={348} className="sd-sub" textAnchor="middle">
          AGENTS ORCHESTRATE TOOLS · EVALUATE · VERSION
        </text>
        <Down y1={360} y2={420} />

        {/* 04 BUILD */}
        <Stage y={406} n="04" title="BUILD" />
        <Box x={20} y={420} w={108} label="React UI" sub="TypeScript" />
        <Link x1={128} x2={146} y={442} />
        <Box x={146} y={420} w={108} label="FastAPI" sub="REST · auth" hot />
        <Link x1={254} x2={272} y={442} />
        <Box x={272} y={420} w={108} label="Model service" sub="inference" />
        <line x1={200} y1={464} x2={200} y2={488} className="sd-flow sd-h" />
        <Box x={146} y={488} w={108} h={40} label="PostgreSQL" sub="data · logs" />
        <Down y1={528} y2={584} />

        {/* 05 LAUNCH */}
        <Stage y={570} n="05" title="LAUNCH" />
        <Box x={20} y={584} w={108} label="Docker" sub="containers" />
        <Link x1={128} x2={146} y={606} />
        <Box x={146} y={584} w={108} label="Cloud deploy" sub="AWS · Azure" />
        <Link x1={254} x2={272} y={606} />
        <Box x={272} y={584} w={108} label="Monitoring" sub="metrics · drift" />

        {/* Feedback loop: Launch → Discover */}
        <path d="M326 628 L326 660 L392 660 L392 20 L326 20 L326 40" className="sd-loop" />
        <path d="M322 34 L326 42 L330 34" className="sd-head" />
        <text x={0} y={0} className="sd-loop-label" transform="translate(388 360) rotate(-90)" textAnchor="middle">
          FEEDBACK LOOP
        </text>
        <text x={20} y={680} className="sd-sub">
          REAL-WORLD FEEDBACK → ITERATE
        </text>
      </svg>
    </figure>
  )
}
