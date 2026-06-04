'use client'

import { motion } from 'framer-motion'
import { Copy, TrendingDown, UserX } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

// Sparkline DESCENDENTE — refuerza visualmente la pérdida frente a la inflación.
function DownSpark() {
  return (
    <svg viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden="true" style={{ width: '100%', height: 40, marginTop: 6 }}>
      <path
        d="M0,6 C40,10 70,18 110,28 S170,42 200,44"
        stroke="#8E8E9C" strokeWidth={2} fill="none" strokeLinecap="round"
        style={{ opacity: 0.7 }}
      />
    </svg>
  )
}

const pains = [
  {
    icon: Copy,
    title: 'Le venden lo mismo que a todos',
    line: 'Fue al banco con ganas de invertir y salió con el producto de moda — el mismo que le ofrecen a cualquiera. Nadie le preguntó qué quiere lograr.',
  },
  {
    icon: TrendingDown,
    title: 'Su plata guardada vale menos cada año',
    line: 'El dinero "seguro" en la cuenta o en un plazo casi no rinde. Y como todo sube de precio, con esa misma plata cada año compra menos.',
    chart: true,
  },
  {
    icon: UserX,
    title: 'Lo dejan solo después de firmar',
    line: 'Le entregaron el producto y ahí terminó la relación. Nadie le explica, nadie le da seguimiento, nadie ajusta nada cuando su vida cambia.',
  },
]

export default function LandingPain() {
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
          <SectionEyebrow>Por qué su dinero no avanza</SectionEyebrow>
          <h2 className="section-title">
            Quizás ya le pasó <em className="em-muted">esto.</em>
          </h2>
          <p className="section-sub">
            La mayoría no invierte mal por falta de ganas. Es que el sistema está
            hecho para venderle productos — no para hacer crecer su dinero.
          </p>
        </motion.div>

        <div className="problem-grid lp-pain-grid">
          {pains.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={i}
                className="glass problem-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
              >
                <div
                  className="service-icon-wrap"
                  style={{ width: 52, height: 52, borderRadius: 14, marginBottom: 20 }}
                >
                  <Icon size={24} strokeWidth={1.6} />
                  <span className="service-icon-dot" aria-hidden="true" />
                </div>
                <h3 className="qualify-card-title" style={{ fontSize: 19, marginBottom: 10 }}>
                  {p.title}
                </h3>
                <p className="problem-desc">{p.line}</p>
                {p.chart && <DownSpark />}
              </motion.div>
            )
          })}
        </div>

        <motion.p
          className="problem-close"
          style={{ marginTop: 48 }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          El resultado: pasan los años y su dinero sigue{' '}
          <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--purple-light)' }}>
            donde mismo.
          </em>
        </motion.p>
      </div>
    </section>
  )
}
