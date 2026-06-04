'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Building2 } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

// Barras ascendentes decorativas (de "antes" pequeño a "hoy" grande).
const BARS = [22, 30, 28, 40, 52, 60, 74, 88, 100]

export default function LandingFact() {
  return (
    <section className="problem-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Un dato que golpea</SectionEyebrow>
          <h2 className="section-title">
            Estar quieto también <em className="em-muted">cuesta.</em>
          </h2>
        </motion.div>

        <motion.div
          className="glass-featured"
          style={{ padding: 0, borderRadius: 28, overflow: 'hidden' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="lp-fact-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>
            {/* Lado dato — números grandes */}
            <div style={{ padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="card-label" style={{ marginBottom: 24 }}>
                <span className="card-label-dot" />
                Propiedad en Santa Teresa · 20 años
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>Hace 20 años</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 28,
                      color: 'var(--text-3)',
                      textDecoration: 'line-through',
                      textDecorationColor: 'var(--text-4)',
                    }}
                  >
                    $50.000
                  </div>
                </div>

                <ArrowUpRight size={28} color="var(--purple-light)" style={{ marginBottom: 6 }} aria-hidden="true" />

                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>Hoy</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(40px, 6vw, 56px)',
                      fontWeight: 500,
                      letterSpacing: '-2px',
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, var(--purple-light), var(--purple-bright))',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    $200.000+
                  </div>
                </div>
              </div>

              <div className="risk-return-pill" style={{ alignSelf: 'flex-start', marginTop: 24 }}>
                <ArrowUpRight size={14} color="var(--purple-light)" aria-hidden="true" />
                <span className="risk-return-value">+300% en 20 años</span>
              </div>

              <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, marginTop: 24, maxWidth: 420 }}>
                Mientras tanto, la misma plata guardada en el banco siguió{' '}
                <strong style={{ color: 'var(--text-2)' }}>donde mismo</strong>. No es que invertir sea arriesgado:
                <strong style={{ color: 'var(--text-2)' }}> quedarse quieto también tiene un costo.</strong>
              </p>
            </div>

            {/* Lado visual — barras crecientes */}
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderLeft: '1px solid var(--border-soft)',
                padding: 40,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                minHeight: 280,
              }}
              aria-hidden="true"
            >
              {BARS.map((h, i) => {
                const isLast = i === BARS.length - 1
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease }}
                    style={{
                      flex: 1,
                      borderRadius: '4px 4px 0 0',
                      background: isLast
                        ? 'linear-gradient(180deg, #A78BFA, #8B5CF6)'
                        : 'linear-gradient(180deg, #4A4A55, #2D2D38)',
                      boxShadow: isLast ? '0 0 16px rgba(139,92,246,0.5)' : undefined,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Dato secundario — modelo del banco */}
        <motion.div
          className="glass"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '22px 28px',
            borderRadius: 18,
            marginTop: 20,
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="service-icon-wrap" style={{ marginBottom: 0, flexShrink: 0 }}>
            <Building2 size={20} strokeWidth={1.6} />
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.55, margin: 0 }}>
            <strong style={{ color: 'var(--text)' }}>Dato curioso:</strong> su plata en el banco no descansa.
            El banco la toma y la presta a otros para ganar con ella. La pregunta es simple — ¿por qué no la
            pone a trabajar <em style={{ fontStyle: 'italic', color: 'var(--purple-light)' }}>para usted?</em>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
