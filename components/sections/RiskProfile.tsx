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

function getLevelColor(level: number): string {
  if (level <= 3) return 'var(--ink-300)'
  if (level <= 5) return 'var(--purple-light)'
  if (level <= 7) return 'var(--purple)'
  return 'var(--purple)'
}

export default function RiskProfile() {
  const [level, setLevel] = useState(5)
  const reduced = useReducedMotion()

  const profile = RISK_PROFILES[level]

  const stocksLen = useMotionValue(RISK_PROFILES[5].stocks / 100 * CIRC)
  const bondsLen  = useMotionValue(RISK_PROFILES[5].bonds / 100 * CIRC)
  const cashLen   = useMotionValue(RISK_PROFILES[5].cash / 100 * CIRC)

  const stocksDash = useTransform(stocksLen, v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const bondsDash  = useTransform(bondsLen,  v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)
  const cashDash   = useTransform(cashLen,   v => `${v.toFixed(2)} ${CIRC.toFixed(2)}`)

  const bondsOffset = useTransform(stocksLen, v => -v)
  const cashOffset  = useMotionValue(
    -(RISK_PROFILES[5].stocks + RISK_PROFILES[5].bonds) / 100 * CIRC,
  )

  useEffect(() => {
    const sync = () => cashOffset.set(-(stocksLen.get() + bondsLen.get()))
    const unsub1 = stocksLen.on('change', sync)
    const unsub2 = bondsLen.on('change', sync)
    return () => { unsub1(); unsub2() }
  }, [stocksLen, bondsLen, cashOffset])

  const glowIntensity = 4 + level * 1.5

  useEffect(() => {
    const p = RISK_PROFILES[level]
    if (reduced) {
      stocksLen.set(p.stocks / 100 * CIRC)
      bondsLen.set(p.bonds / 100 * CIRC)
      cashLen.set(p.cash / 100 * CIRC)
      return
    }
    animate(stocksLen, p.stocks / 100 * CIRC, SPRING)
    animate(bondsLen,  p.bonds / 100 * CIRC,  SPRING)
    animate(cashLen,   p.cash / 100 * CIRC,   SPRING)
  }, [level, reduced, stocksLen, bondsLen, cashLen])

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
            <p
              style={{
                fontSize: 14,
                color: 'var(--text-3)',
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
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

            <div
              style={{
                fontSize: 11,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
                marginBottom: 10,
              }}
            >
              Perfil actual
            </div>

            <div className="risk-profile-name">
              Perfil{' '}
              <em
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: getLevelColor(level),
                }}
              >
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
            {/* SVG donut */}
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <svg
                width={200}
                height={200}
                viewBox="0 0 200 200"
                aria-hidden="true"
                style={{ transform: 'rotate(-90deg)' }}
              >
                {/* Background track */}
                <circle
                  cx={100} cy={100} r={RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={16}
                />
                {/* Stocks — morado */}
                <motion.circle
                  cx={100} cy={100} r={RADIUS}
                  fill="none"
                  stroke="var(--purple)"
                  strokeWidth={16}
                  strokeDasharray={stocksDash}
                  strokeDashoffset={0}
                  strokeLinecap="butt"
                  style={{
                    filter: `drop-shadow(0 0 ${glowIntensity}px rgba(139,92,246,0.6))`,
                  }}
                />
                {/* Bonds — morado claro */}
                <motion.circle
                  cx={100} cy={100} r={RADIUS}
                  fill="none"
                  stroke="var(--purple-light)"
                  strokeWidth={16}
                  strokeDasharray={bondsDash}
                  strokeDashoffset={bondsOffset}
                  strokeLinecap="butt"
                />
                {/* Cash — gris */}
                <motion.circle
                  cx={100} cy={100} r={RADIUS}
                  fill="none"
                  stroke="var(--ink-600)"
                  strokeWidth={16}
                  strokeDasharray={cashDash}
                  strokeDashoffset={cashOffset}
                  strokeLinecap="butt"
                />
              </svg>

              {/* Center text */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '17px',
                    fontWeight: 500,
                    color: 'var(--text)',
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                  }}
                >
                  {profile.return}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: 2 }}>
                  anual
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="risk-legend">
              <div className="risk-legend-item">
                <div className="risk-legend-swatch" style={{ background: 'var(--purple)' }} />
                <span>Acciones</span>
                <span className="risk-legend-pct">{profile.stocks}%</span>
              </div>
              <div className="risk-legend-item">
                <div
                  className="risk-legend-swatch"
                  style={{ background: 'var(--purple-light)' }}
                />
                <span>Bonos</span>
                <span className="risk-legend-pct">{profile.bonds}%</span>
              </div>
              <div className="risk-legend-item">
                <div
                  className="risk-legend-swatch"
                  style={{ background: 'var(--ink-600)' }}
                />
                <span>Efectivo</span>
                <span className="risk-legend-pct">{profile.cash}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
