'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

export default function SobreHero() {
  return (
    <section className="sobre-hero">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          style={{ maxWidth: 880 }}
        >
          <SectionEyebrow>Sobre nosotros</SectionEyebrow>
          <h1 className="sobre-hero-title">
            La historia detrás de <em className="em-gradient">Aleconomies.</em>
          </h1>
          <p className="sobre-hero-sub">
            Asesoría financiera independiente, construida sobre la experiencia, la honestidad
            y el acompañamiento personalizado.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
