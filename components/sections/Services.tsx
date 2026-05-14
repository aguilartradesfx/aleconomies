'use client'

import { motion } from 'framer-motion'
import { PieChart, TrendingUp, Target, Banknote, CalendarCheck, BookOpen } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const services = [
  {
    Icon: PieChart,
    title: 'Planificación financiera personal',
    desc: 'Vista panorámica de su situación: ingresos, gastos, ahorro, deudas y patrimonio. Punto de partida de cualquier estrategia.',
  },
  {
    Icon: TrendingUp,
    title: 'Estrategia de inversión',
    desc: 'Diseño y ejecución de una cartera diversificada, ajustada a su perfil de riesgo y horizonte de tiempo.',
  },
  {
    Icon: Target,
    title: 'Ahorro por objetivos',
    desc: 'Estructura clara para corto, mediano y largo plazo. Cada meta con su propio vehículo y horizonte.',
  },
  {
    Icon: Banknote,
    title: 'Manejo de excedentes',
    desc: 'Bonificaciones, ventas de bienes, herencias. Plan concreto para que esa plata empiece a producir desde el día uno.',
  },
  {
    Icon: CalendarCheck,
    title: 'Planificación de retiro',
    desc: 'Calculamos cuánto necesita acumular y construimos el camino para llegar ahí sin sorpresas a los 60.',
  },
  {
    Icon: BookOpen,
    title: 'Educación financiera',
    desc: 'Cada decisión viene con explicación. La idea es que con el tiempo usted entienda lo que tiene en sus manos.',
  },
]

export default function Services() {
  return (
    <section id="servicios" className="services-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Áreas de asesoría</SectionEyebrow>
          <h2 className="section-title">
            Diseñe su <em className="em-muted">futuro financiero.</em>
          </h2>
          <p className="section-sub">
            Cada objetivo tiene su propio horizonte, su propio vehículo y su propio plan.
            Así trabajamos.
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="glass service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            >
              <div className="service-icon-wrap">
                <Icon size={20} strokeWidth={1.5} />
                <span className="service-icon-dot" aria-hidden="true" />
              </div>
              <h3 className="service-title">{title}</h3>
              <p className="service-desc">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
