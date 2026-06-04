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
    title: 'El mismo producto para todos',
    line: 'El ejecutivo cumple una meta de colocación, no le arma un plan.',
  },
  {
    icon: TrendingDown,
    title: 'Pierde contra la inflación',
    line: 'La cuenta de ahorro "segura" se encoge un poco cada año.',
    chart: true,
  },
  {
    icon: UserX,
    title: 'Cero seguimiento',
    line: 'Firma, le entregan el producto y nadie vuelve a ajustar nada.',
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
            El problema no es usted. Es el <em className="em-muted">molde.</em>
          </h2>
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
      </div>
    </section>
  )
}
