'use client'

import { motion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const yesItems: React.ReactNode[] = [
  <>Busca <strong>asesoría personalizada</strong>, no recetas enlatadas ni productos preempaquetados.</>,
  <>Quiere que su plata rinda más de lo que le da el <strong>banco o la cooperativa</strong>.</>,
  <>Necesita una <strong>estrategia construida alrededor de sus objetivos</strong> — corto, mediano y largo plazo.</>,
  <>Tiene <strong>dinero guardado</strong> y no sabe cómo ponerlo a producir.</>,
  <>Recibió una <strong>bonificación, venta de un bien o entrada extra</strong> y quiere que trabaje en vez de quedarse quieto.</>,
  <>Lleva años buscando a alguien que <strong>no le venda humo</strong> y que de verdad le aporte valor y aprendizaje.</>,
]

const noItems: React.ReactNode[] = [
  <><strong>Busca un préstamo</strong> — no presto dinero.</>,
  <><strong>Busca un curso</strong> — esto es asesoría 1 a 1, no formación grupal.</>,
  <><strong>Quiere aprender trading</strong> — no opero ni enseño trading.</>,
  <><strong>Todavía no logra ahorrar consistentemente</strong> — sin esa base no hay plan financiero que funcione.</>,
  <><strong>No puede destinar al menos ₡25.000 mensuales</strong> a su estrategia.</>,
  <><strong>Busca ayuda para salir de deudas o apoyo psicológico</strong> — comparto recursos de desarrollo personal, pero no soy coach de deudas ni psicólogo.</>,
]

export default function QualifyCards() {
  return (
    <section id="para-quien" className="qualify-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Antes de seguir</SectionEyebrow>
          <h2 className="section-title">
            ¿Esto es para <em className="em-muted">usted?</em>
          </h2>
          <p className="section-sub">
            Trabajar con un asesor financiero es una decisión grande. Prefiero que se asegure
            de que estamos alineados antes de agendar una sola llamada.
          </p>
        </motion.div>

        <div className="qualify-grid">
          {/* Sí continúe */}
          <motion.div
            className="glass-featured"
            style={{ padding: 36, borderRadius: 22 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="qualify-tag" style={{ color: 'var(--purple-light)' }}>
              <span className="card-label-dot" />
              Sí continúe
            </div>
            <h3 className="qualify-card-title">
              Es para <em className="em-muted">usted</em> si:
            </h3>
            <ul className="qualify-list">
              {yesItems.map((item, i) => (
                <li key={i} className="qualify-item">
                  <span className="qualify-icon qualify-icon-check" aria-hidden="true">
                    <Check size={11} strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Mejor no */}
          <motion.div
            className="glass"
            style={{ padding: 36, borderRadius: 22 }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
          >
            <div className="qualify-tag" style={{ color: 'var(--text-3)' }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--ink-600)',
                  flexShrink: 0,
                }}
              />
              Mejor no
            </div>
            <h3 className="qualify-card-title" style={{ color: 'var(--text-2)' }}>
              No es para usted si:
            </h3>
            <ul className="qualify-list">
              {noItems.map((item, i) => (
                <li key={i} className="qualify-item" style={{ color: 'var(--text-3)' }}>
                  <span className="qualify-icon qualify-icon-dash" aria-hidden="true">
                    <Minus size={10} strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
