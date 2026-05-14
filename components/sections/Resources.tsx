'use client'

import { motion } from 'framer-motion'
import { FileDown, BookMarked, PenLine } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const resources = [
  {
    Icon: FileDown,
    tag: 'Guía descargable',
    title: 'Los 5 errores que cometen los costarricenses al ahorrar',
    desc: 'Guía práctica en PDF con los errores más frecuentes y cómo evitarlos. Sin jerga financiera, sin relleno.',
    linkText: 'Descargar PDF',
    href: '#',
  },
  {
    Icon: BookMarked,
    tag: 'Lecturas recomendadas',
    title: 'Mi biblioteca financiera',
    desc: 'Los libros, artículos y recursos que más han influido en mi forma de entender y gestionar el dinero.',
    linkText: 'Ver la lista',
    href: '#',
  },
  {
    Icon: PenLine,
    tag: 'Blog',
    title: 'Notas semanales',
    desc: 'Reflexiones cortas sobre finanzas personales, mercados y decisiones que afectan a los costarricenses.',
    linkText: 'Leer el blog',
    href: '#',
  },
]

export default function Resources() {
  return (
    <section id="recursos" className="resources-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Aprenda gratis</SectionEyebrow>
          <h2 className="section-title">
            Recursos para empezar <em className="em-muted">desde ya.</em>
          </h2>
          <p className="section-sub">
            No tiene que ser cliente mío para aprender a manejar mejor su plata. Acá comparto
            lo que voy estudiando y aplicando.
          </p>
        </motion.div>

        <div className="resources-grid">
          {resources.map(({ Icon, tag, title, desc, linkText, href }, i) => (
            <motion.div
              key={title}
              className="glass resource-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            >
              <div className="resource-tag">
                <span className="card-label-dot" />
                <Icon size={12} strokeWidth={1.5} style={{ opacity: 0.7 }} />
                {tag}
              </div>
              <h3 className="resource-title">{title}</h3>
              <p className="resource-desc">{desc}</p>
              <a href={href} className="resource-link">
                {linkText} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
