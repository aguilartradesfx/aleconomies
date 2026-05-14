'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const steps = [
  {
    num: '1',
    title: 'Diagnóstico inicial',
    time: '30-45 min · Gratis',
    desc: 'Conversamos para entender su situación actual, sus objetivos y su perfil de riesgo. Si veo que puedo aportarle valor, se lo digo. Si no, también — y le recomiendo a dónde ir.',
  },
  {
    num: '2',
    title: 'Diseño de su estrategia',
    time: '1-2 semanas',
    desc: 'Construyo un plan personalizado: dónde colocar su plata, en qué proporción, con qué horizonte y por qué. Se lo presento en una segunda reunión donde lo revisamos juntos y ajustamos lo que haga falta.',
  },
  {
    num: '3',
    title: 'Implementación',
    time: 'Paso a paso',
    desc: 'Ejecutamos la estrategia. Le explico cada movimiento — el objetivo es que usted entienda lo que está haciendo con su plata, no que dependa ciegamente de mí.',
  },
  {
    num: '4',
    title: 'Acompañamiento continuo',
    time: 'Sin fecha de expiración',
    desc: 'Revisamos juntos cada trimestre. El mercado cambia, su vida cambia, sus objetivos cambian. La estrategia se ajusta con usted — no se queda en un PDF olvidado.',
  },
]

export default function ProcessTimeline() {
  return (
    <section id="proceso" className="process-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>El camino</SectionEyebrow>
          <h2 className="section-title">
            Cómo <em className="em-muted">trabajamos juntos.</em>
          </h2>
          <p className="section-sub">
            Cuatro pasos claros. Cero sorpresas. Usted siempre sabe en qué etapa está y qué sigue.
          </p>
        </motion.div>

        <div className="process-list">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="glass process-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
            >
              {/* Number */}
              <div className="process-number-wrap">
                <span className="process-number">{step.num}</span>
                <span className="process-number-dot" aria-hidden="true" />
              </div>

              {/* Title + time */}
              <div>
                <div className="process-step-title">{step.title}</div>
                <span className="process-time-pill">{step.time}</span>
              </div>

              {/* Description */}
              <p className="process-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
