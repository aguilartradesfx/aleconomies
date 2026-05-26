'use client'

import { motion } from 'framer-motion'
import { Shield, Handshake, GraduationCap, TrendingUp } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const valores = [
  {
    icon: Shield,
    titulo: 'Honestidad antes que venta.',
    desc: 'Si su situación no es la indicada para invertir, se lo decimos. Preferimos perder un cliente hoy a comprometer su tranquilidad mañana.',
  },
  {
    icon: Handshake,
    titulo: 'Acompañamiento personalizado.',
    desc: 'No vendemos productos por catálogo. Cada plan se diseña a partir de sus objetivos, plazos y capacidad real.',
  },
  {
    icon: GraduationCap,
    titulo: 'Educación financiera permanente.',
    desc: 'Nuestro trabajo no termina cuando usted firma. Lo formamos para que entienda cada decisión.',
  },
  {
    icon: TrendingUp,
    titulo: 'Resultados sostenibles, no atajos.',
    desc: 'Construimos riqueza con paciencia y disciplina, no con promesas de enriquecimiento rápido.',
  },
]

export default function SobreValores() {
  return (
    <section className="sobre-valores">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          style={{ maxWidth: 720, marginBottom: 48 }}
        >
          <SectionEyebrow>Cómo trabajamos</SectionEyebrow>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Cuatro <em className="em-muted">principios</em> que no negociamos.
          </h2>
        </motion.div>

        <div className="valores-grid">
          {valores.map(({ icon: Icon, titulo, desc }, i) => (
            <motion.div
              key={titulo}
              className="valor-card glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
            >
              <div className="valor-icon">
                <Icon size={22} strokeWidth={1.6} />
              </div>
              <h3 className="valor-titulo">{titulo}</h3>
              <p className="valor-desc">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
