'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

export default function CTA() {
  return (
    <section id="cta" className="cta-section">
      <div className="container">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className="cta-title">
            ¿Hablamos
            <em
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'var(--purple-light)',
              }}
            >
              ?
            </em>
          </h2>
          <p className="cta-sub">
            5 a 20 minutos. Sin costo. Sin compromiso. Solo una conversación honesta sobre
            dónde está parado y a dónde quiere llegar.
          </p>
          <a href="/agendar" className="btn-primary">
            Agendar diagnóstico →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
