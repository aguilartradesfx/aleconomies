'use client'

import { motion } from 'framer-motion'
import { Target, Compass, ShieldCheck, HeartHandshake } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const pillars = [
  { icon: Target, title: 'Empieza por usted', line: 'Primero sus metas y plazos. La estrategia sale de ahí, no de un catálogo.' },
  { icon: Compass, title: 'A su perfil real', line: 'El riesgo que de verdad puede sostener — no el que lo hace perder el sueño.' },
  { icon: ShieldCheck, title: 'Su dinero, a su nombre', line: 'Mercados regulados. Usted mantiene el control total, siempre.' },
  { icon: HeartHandshake, title: 'Acompañamiento vitalicio', line: 'No es una venta y adiós. Ajustamos el plan conforme su vida cambia.' },
]

export default function LandingMethod() {
  return (
    <section className="services-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Cómo trabajo</SectionEyebrow>
          <h2 className="section-title">
            Asesoría de verdad <em className="em-muted">personalizada.</em>
          </h2>
        </motion.div>

        <div className="services-grid lp-method-grid">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={i}
                className="glass service-card"
                style={{ textAlign: 'center' }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.07, ease }}
              >
                <div
                  className="service-icon-wrap"
                  style={{ width: 56, height: 56, borderRadius: 16, marginInline: 'auto', marginBottom: 18 }}
                >
                  <Icon size={26} strokeWidth={1.5} />
                  <span className="service-icon-dot" aria-hidden="true" />
                </div>
                <h3 className="service-title" style={{ fontSize: 16 }}>{p.title}</h3>
                <p className="service-desc">{p.line}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
