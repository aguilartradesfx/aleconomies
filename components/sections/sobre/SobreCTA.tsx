'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1] as const

export default function SobreCTA() {
  return (
    <section className="sobre-cta-section">
      <div className="container">
        <motion.div
          className="sobre-cta-card glass-featured"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className="sobre-cta-title">
            ¿Listo para <em className="em-muted">empezar?</em>
          </h2>
          <p className="sobre-cta-sub">
            Una conversación honesta de 5 a 20 minutos. Sin compromiso. Sin venta agresiva.
          </p>
          <div className="sobre-cta-actions">
            <Link href="/agendar" className="btn-primary">
              Agendar llamada →
            </Link>
            <Link href="/#proceso" className="sobre-cta-link">
              O leer más sobre el proceso →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
