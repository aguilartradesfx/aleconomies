'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const steps = [
  { n: '1', title: 'Agenda', time: 'Hoy', desc: 'Un formulario corto, 2 minutos.' },
  { n: '2', title: 'Diagnóstico', time: 'La llamada', desc: 'Claridad sobre sus metas y opciones.' },
  { n: '3', title: 'Su plan', time: 'Después', desc: 'Estrategia hecha a su medida.' },
  { n: '4', title: 'Acompaño', time: 'Siempre', desc: 'Ajustamos juntos en el camino.' },
]

export default function LandingProcess() {
  return (
    <section className="process-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Qué pasa cuando agenda</SectionEyebrow>
          <h2 className="section-title">
            De la duda al plan, en <em className="em-muted">4 pasos.</em>
          </h2>
        </motion.div>

        <div className="lp-steps" style={{ display: 'grid', gap: 20 }}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              style={{ textAlign: 'center', position: 'relative' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
            >
              {/* Conector */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 32,
                    left: 'calc(50% + 36px)',
                    right: 'calc(-50% + 36px)',
                    height: 1,
                    background: 'linear-gradient(90deg, var(--purple), transparent)',
                  }}
                  className="lp-step-connector"
                />
              )}

              {/* Número */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: '0 auto 18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 30,
                  color: 'var(--purple-light)',
                  background: 'var(--purple-faint)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  boxShadow: '0 0 24px rgba(139,92,246,0.18)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {s.n}
              </div>

              <span className="process-time-pill" style={{ marginBottom: 10, display: 'inline-flex' }}>
                {s.time}
              </span>
              <h3 className="process-step-title" style={{ fontSize: 17, marginTop: 8 }}>{s.title}</h3>
              <p className="process-desc" style={{ fontSize: 13.5 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
