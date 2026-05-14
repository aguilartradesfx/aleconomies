'use client'

import { motion, useReducedMotion } from 'framer-motion'

// ─── Sparkline para Card 1 ────────────────────────────────────────────────────
// Path con curva ascendente animado con stroke-dashoffset (drawLine keyframe).
// strokeDasharray > longitud real del path → el browser renderiza la línea
// completa como un único dash, y la animación la "dibuja" de izquierda a derecha.

function Sparkline() {
  return (
    <svg
      viewBox="0 0 240 50"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ marginTop: 14, width: '100%', height: 50 }}
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Área de relleno bajo la línea */}
      <path
        d="M0,40 C60,36 80,30 120,22 S200,6 240,3 L240,50 L0,50 Z"
        fill="url(#spark-fill)"
      />
      {/* Línea animada con glow morado */}
      <path
        d="M0,40 C60,36 80,30 120,22 S200,6 240,3"
        stroke="#A78BFA"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.6))',
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
          animation: 'drawLine 2s ease-out 0.5s both',
        }}
      />
    </svg>
  )
}

// ─── Mini bar chart para Card 2 ───────────────────────────────────────────────
// 12 barras representando 12 meses. La última (mes 12) es morada con glow.
// Animación escalonada con CSS: barGrow keyframe, fill-mode both para que
// se aplique el estado inicial (scaleY: 0) incluso durante el delay.

const BAR_HEIGHTS = [25, 35, 30, 45, 50, 42, 60, 65, 70, 80, 88, 100]

function MiniBars() {
  return (
    <div
      aria-hidden="true"
      style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 4, height: 50 }}
    >
      {BAR_HEIGHTS.map((h, i) => {
        const isLast = i === BAR_HEIGHTS.length - 1
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: isLast
                ? 'linear-gradient(180deg, #A78BFA, #8B5CF6)'
                : 'linear-gradient(180deg, #BDBDC5, #6B6B78)',
              borderRadius: '3px 3px 0 0',
              boxShadow: isLast ? '0 0 8px rgba(139,92,246,0.4)' : undefined,
              transformOrigin: 'bottom',
              animation: `barGrow 0.8s ease-out ${(0.1 + i * 0.055).toFixed(2)}s both`,
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Mini donut para Card 3 ───────────────────────────────────────────────────
// SVG con dos segmentos de círculo usando stroke-dasharray.
// Circunferencia de r=28: 2π × 28 ≈ 175.93px.
// 66% renta variable (morado), 34% renta fija (gris).

const CIRC = 2 * Math.PI * 28

function MiniDonut() {
  const stocksDash = 0.66 * CIRC // ≈ 116.1px
  const bondsDash  = 0.34 * CIRC // ≈  59.8px

  return (
    <div
      aria-hidden="true"
      style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 14 }}
    >
      <svg
        width={64}
        height={64}
        style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
      >
        {/* Pista de fondo */}
        <circle
          cx={32} cy={32} r={28}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={8}
        />
        {/* Segmento renta variable — morado */}
        <circle
          cx={32} cy={32} r={28}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth={8}
          strokeDasharray={`${stocksDash} ${CIRC}`}
          strokeDashoffset={0}
          style={{ filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.5))' }}
        />
        {/* Segmento renta fija — gris, inicia justo después del morado */}
        <circle
          cx={32} cy={32} r={28}
          fill="none"
          stroke="#4A4A55"
          strokeWidth={8}
          strokeDasharray={`${bondsDash} ${CIRC}`}
          strokeDashoffset={-stocksDash}
        />
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
        <span style={{ color: 'var(--text)', fontSize: 18, fontWeight: 500 }}>66%</span>
        <br />Renta variable
        <br /><span style={{ color: 'var(--text-3)' }}>34% Renta fija</span>
      </div>
    </div>
  )
}

// ─── Floating card wrapper ────────────────────────────────────────────────────
// Framer Motion anima y (arriba/abajo) en loop.
// rotate es fijo, se pasa vía style para que no entre en el animador.
// Con prefers-reduced-motion, no se anima.

type FloatCardProps = {
  children: React.ReactNode
  pos: React.CSSProperties
  y: [number, number, number]
  rotate: number
  duration: number
}

function FloatCard({ children, pos, y, rotate, duration }: FloatCardProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="float-card"
      style={{ position: 'absolute', rotate, ...pos }}
      animate={reduced ? {} : { y }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section id="inicio" className="hero-section">
      <div className="container">
        <div className="hero-grid">

          {/* ── Lado izquierdo ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="badge glass-pill">
                <span className="badge-dot" aria-hidden="true" />
                Asesoría financiera independiente · Costa Rica
              </div>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              Su plata,
              <br />
              su plan, <em className="em-gradient">su ritmo.</em>
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              Asesoría financiera 1 a 1 donde la estrategia se construye con
              usted — no se copia de un manual. Definimos objetivos, ajustamos
              el riesgo a su perfil real, y lo acompaño cada paso del camino.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
            >
              <a href="#cta" className="btn-primary">
                Agendar diagnóstico →
              </a>
              <a href="#calculadora" className="btn-glass">
                Probar la calculadora
              </a>
            </motion.div>
          </div>

          {/* ── Lado derecho — 3 floating glass cards ── */}
          <motion.div
            className="hero-cards"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            {/* Card 1 — Rendimiento anual */}
            <FloatCard
              pos={{ top: 0, left: 0, width: 280 }}
              y={[0, -12, 0]}
              rotate={-2}
              duration={6}
            >
              <div className="card-label">
                <span className="card-label-dot" />
                Rendimiento anual
              </div>
              <div className="card-value">
                +9.4
                <em
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontStyle: 'italic',
                    color: 'var(--purple-light)',
                  }}
                >
                  %
                </em>
              </div>
              <div className="card-desc">
                Portafolio diversificado promedio últimos 10 años
              </div>
              <Sparkline />
            </FloatCard>

            {/* Card 2 — Crecimiento mensual */}
            <FloatCard
              pos={{ top: 90, right: 0, width: 240 }}
              y={[0, 14, 0]}
              rotate={3}
              duration={7}
            >
              <div className="card-label">
                <span className="card-label-dot" />
                Crecimiento mensual
              </div>
              <div className="card-value">
                ₡
                <em
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontStyle: 'italic',
                    color: 'var(--purple-light)',
                  }}
                >
                  1.2M
                </em>
              </div>
              <div className="card-desc">Acumulado en 12 meses</div>
              <MiniBars />
            </FloatCard>

            {/* Card 3 — Asignación recomendada */}
            <FloatCard
              pos={{ bottom: 0, left: 40, width: 300 }}
              y={[0, -8, 0]}
              rotate={-1}
              duration={8}
            >
              <div className="card-label">
                <span className="card-label-dot" />
                Asignación recomendada
              </div>
              <div className="card-value" style={{ fontSize: 24 }}>
                Balanceada
              </div>
              <MiniDonut />
            </FloatCard>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
