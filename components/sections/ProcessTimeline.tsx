'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const steps = [
  {
    num: '1',
    title: 'Llamada de aclaración de servicio',
    time: '5–20 min · Gratis',
    desc: 'Solo una conversación honesta para entender sus necesidades y que usted entienda mi servicio. Es veloz y al punto.',
  },
  {
    num: '2',
    title: 'Asesoría de Inversión',
    time: '1-2 h',
    desc: 'Espacio directo con el asesor para evaluar sus objetivos, conocer los plazos a los que puede invertir y diseñar la estrategia personalizada. La duración varía entre 1 y 2 horas dependiendo de la cantidad de consultas que tenga. En este tiempo se explican a profundidad las diferentes opciones para invertir tanto a nivel nacional como internacional. Al finalizar, usted tendrá el plan adecuado a sus necesidades.',
  },
  {
    num: '3',
    title: 'Implementación y formalización',
    time: '3 días',
    desc: 'Completamos los formularios necesarios para sus inversiones: KYC, beneficiarios, contratos, seguros, órdenes de inversión y consentimientos informados. Usted deberá adjuntar: (1) origen de fondos vía orden patronal si es asalariado, o constancia de CPA si es profesional independiente; (2) trazabilidad mediante estados de cuenta que demuestren la existencia del dinero; y (3) comprobación de residencia mediante recibo de servicios para inversiones internacionales.',
  },
  {
    num: '4',
    title: 'Acompañamiento continuo',
    time: 'Sin fecha de expiración',
    desc: 'Revisamos juntos cada mes. El mercado cambia, su vida cambia, sus objetivos cambian. La estrategia se ajusta con usted — no se queda en un PDF olvidado.',
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
