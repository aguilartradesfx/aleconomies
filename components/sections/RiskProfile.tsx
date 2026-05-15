'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion'
import { RISK_PROFILES } from '@/lib/finance'
import SliderInput from '@/components/ui/SliderInput'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const RADIUS = 80
const CIRC = 2 * Math.PI * RADIUS

const ease = [0.16, 1, 0.3, 1] as const
const SPRING = { type: 'spring' as const, stiffness: 120, damping: 22 }

const SEGMENTS = [
  { key: 'stocks',     label: 'Acciones',        color: 'var(--purple)'       },
  { key: 'bonds',      label: 'Bonos',            color: 'var(--purple-light)' },
  { key: 'indexed',    label: 'Fondos Indexados', color: 'var(--purple-bright)'},
  { key: 'realEstate', label: 'Inmobiliario',     color: 'var(--ink-300)'      },
  { key: 'crypto',     label: 'Cripto',           color: 'var(--ink-400)'      },
  { key: 'cash',       label: 'Efectivo',         color: 'var(--ink-500)'      },
  { key: 'options',    label: 'Opciones',         color: 'var(--ink-600)'      },
] as const

type SegmentKey = typeof SEGMENTS[number]['key']

function getLevelColor(level: number): string {
  if (level <= 3) return 'var(--ink-300)'
  if (level <= 5) return 'var(--purple-light)'
  return 'var(--purple)'
}

export default function RiskProfile() {
  const [level, setLevel] = useState(5)
  const reduced = useReducedMotion()

  const profile = RISK_PROFILES[level]

  // One motion value per segment arc length
  const lenStocks     = useMotionValue(RISK_PROFILES[5].allocation.stocks     / 100 * CIRC)
  const lenBonds      = useMotionValue(RISK_PROFILES[5].allocation.bonds      / 100 * CIRC)
  const lenIndexed    = useMotionValue(RISK_PROFILES[5].allocation.indexed    / 100 * CIRC)
  const lenRealEstate = useMotionValue(RISK_PROFILES[5].allocation.realEstate / 100 * CIRC)
  const lenCrypto     = useMotionValue(RISK_PROFILES[5].allocation.crypto     / 100 * CIRC)
  const lenCash       = useMotionValue(RISK_PROFILES[5].allocation.cash       / 100 * CIRC)
  const lenOptions    = useMotionValue(RISK_PROFILES[5].allocation.options    / 100 * CIRC)

  // Dasharray strings
  const dashStocks     = useTransform(lenStocks,     v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const dashBonds      = useTransform(lenBonds,      v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const dashIndexed    = useTransform(lenIndexed,    v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const dashRealEstate = useTransform(lenRealEstate, v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const dashCrypto     = useTransform(lenCrypto,     v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const dashCash       = useTransform(lenCash,       v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const dashOptions    = useTransform(lenOptions,    v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)

  // Offsets — each segment starts after all previous ones
  const offStocks     = 0
  const offBonds      = useTransform(lenStocks, v => -v)
  const offIndexed    = useTransform([lenStocks, lenBonds],                                   ([s, b]: number[])             => -(s + b))
  const offRealEstate = useTransform([lenStocks, lenBonds, lenIndexed],                       ([s, b, i]: number[])          => -(s + b + i))
  const offCrypto     = useTransform([lenStocks, lenBonds, lenIndexed, lenRealEstate],        ([s, b, i, r]: number[])       => -(s + b + i + r))
  const offCash       = useTransform([lenStocks, lenBonds, lenIndexed, lenRealEstate, lenCrypto], ([s, b, i, r, c]: number[]) => -(s + b + i + r + c))
  const offOptions    = useTransform([lenStocks, lenBonds, lenIndexed, lenRealEstate, lenCrypto, lenCash], ([s, b, i, r, c, ca]: number[]) => -(s + b + i + r + c + ca))

  const glowIntensity = 4 + level * 1.5

  useEffect(() => {
    const a = RISK_PROFILES[level].allocation
    const targets: [ReturnType<typeof useMotionValue<number>>, number][] = [
      [lenStocks,     a.stocks     / 100 * CIRC],
      [lenBonds,      a.bonds      / 100 * CIRC],
      [lenIndexed,    a.indexed    / 100 * CIRC],
      [lenRealEstate, a.realEstate / 100 * CIRC],
      [lenCrypto,     a.crypto     / 100 * CIRC],
      [lenCash,       a.cash       / 100 * CIRC],
      [lenOptions,    a.options    / 100 * CIRC],
    ]
    for (const [mv, target] of targets) {
      if (reduced) { mv.set(target) } else { animate(mv, target, SPRING) }
    }
  }, [level, reduced, lenStocks, lenBonds, lenIndexed, lenRealEstate, lenCrypto, lenCash, lenOptions])

  const alloc = profile.allocation

  return (
    <section id="perfil" className="risk-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Su perfil de riesgo</SectionEyebrow>
          <h2 className="section-title">
            ¿Qué tipo de inversor <em className="em-gradient">es usted?</em>
          </h2>
          <p className="section-sub">
            Mueva el deslizador y vea cómo cambia la mezcla recomendada de su portafolio
            según su tolerancia al riesgo.
          </p>
        </motion.div>

        <motion.div
          className="risk-card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {/* ── Left: controls ── */}
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>
              De 1 (conservador) a 10 (agresivo). La asignación se ajusta en tiempo real.
            </p>

            <SliderInput
              label="Su tolerancia al riesgo"
              value={level}
              min={1}
              max={10}
              step={1}
              onChange={setLevel}
              display={String(level)}
            />

            <hr className="risk-divider" />

            <div style={{ fontSize: 11, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
              Perfil actual
            </div>

            <div className="risk-profile-name">
              Perfil{' '}
              <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: getLevelColor(level) }}>
                {profile.name}
              </em>
            </div>

            <p className="risk-profile-desc">{profile.desc}</p>

            <div className="risk-return-pill">
              <span className="risk-return-label">Rendimiento esperado anual</span>
              <span className="risk-return-value">{profile.return}</span>
            </div>
          </div>

          {/* ── Right: donut ── */}
          <div className="risk-donut-wrap">
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <svg
                width={200}
                height={200}
                viewBox="0 0 200 200"
                aria-hidden="true"
                style={{ transform: 'rotate(-90deg)' }}
              >
                {/* Background track */}
                <circle cx={100} cy={100} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={16} />

                {/* Acciones */}
                <motion.circle cx={100} cy={100} r={RADIUS} fill="none"
                  stroke="var(--purple)" strokeWidth={16}
                  strokeDasharray={dashStocks} strokeDashoffset={offStocks} strokeLinecap="butt"
                  style={{ filter: `drop-shadow(0 0 ${glowIntensity}px rgba(139,92,246,0.6))` }}
                />
                {/* Bonos */}
                <motion.circle cx={100} cy={100} r={RADIUS} fill="none"
                  stroke="var(--purple-light)" strokeWidth={16}
                  strokeDasharray={dashBonds} strokeDashoffset={offBonds} strokeLinecap="butt"
                />
                {/* Fondos Indexados */}
                <motion.circle cx={100} cy={100} r={RADIUS} fill="none"
                  stroke="var(--purple-bright)" strokeWidth={16}
                  strokeDasharray={dashIndexed} strokeDashoffset={offIndexed} strokeLinecap="butt"
                />
                {/* Inmobiliario */}
                <motion.circle cx={100} cy={100} r={RADIUS} fill="none"
                  stroke="var(--ink-300)" strokeWidth={16}
                  strokeDasharray={dashRealEstate} strokeDashoffset={offRealEstate} strokeLinecap="butt"
                />
                {/* Cripto */}
                <motion.circle cx={100} cy={100} r={RADIUS} fill="none"
                  stroke="var(--ink-400)" strokeWidth={16}
                  strokeDasharray={dashCrypto} strokeDashoffset={offCrypto} strokeLinecap="butt"
                />
                {/* Efectivo */}
                <motion.circle cx={100} cy={100} r={RADIUS} fill="none"
                  stroke="var(--ink-500)" strokeWidth={16}
                  strokeDasharray={dashCash} strokeDashoffset={offCash} strokeLinecap="butt"
                />
                {/* Opciones */}
                <motion.circle cx={100} cy={100} r={RADIUS} fill="none"
                  stroke="var(--ink-600)" strokeWidth={16}
                  strokeDasharray={dashOptions} strokeDashoffset={offOptions} strokeLinecap="butt"
                />
              </svg>

              {/* Center text */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  {profile.return}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: 2 }}>anual</div>
              </div>
            </div>

            {/* Legend — only non-zero segments */}
            <div className="risk-legend" aria-live="polite">
              {SEGMENTS.map(seg => {
                const pct = alloc[seg.key as SegmentKey]
                if (pct === 0) return null
                return (
                  <div key={seg.key} className="risk-legend-item">
                    <div className="risk-legend-swatch" style={{ background: seg.color }} />
                    <span>{seg.label}</span>
                    <span className="risk-legend-pct">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 16, fontStyle: 'italic' }}>
          Asignaciones referenciales. Su portafolio real se diseña en la asesoría personalizada, considerando sus objetivos, horizonte y situación particular.
        </p>
      </div>
    </section>
  )
}
