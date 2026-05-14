'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

export default function IntroStrip() {
  return (
    <section className="intro-strip">
      <div className="container">
        <motion.div
          className="intro-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className="intro-title">
            Toda buena decisión
            <br />
            <em className="em-gradient">empieza con claridad.</em>
          </h2>
          <p className="intro-sub">
            Más de <strong>[X]</strong> años acompañando a costarricenses a tomar mejores
            decisiones con su dinero. Sin productos preempaquetados, sin promesas vacías, sin atajos.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
