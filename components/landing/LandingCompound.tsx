'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import CompoundMockB from './CompoundMockB'

const ease = [0.16, 1, 0.3, 1] as const

export default function LandingCompound() {
  return (
    <section className="widget-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Cómo crece su dinero</SectionEyebrow>
          <h2 className="section-title">
            El interés compuesto trabaja <em className="em-muted">por usted.</em>
          </h2>
          <p className="section-sub">
            No se trata de poner mucho de una vez. Se trata de empezar y dejar que
            cada mes se sume al anterior — así, en 10 años, su dinero crece solo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <CompoundMockB />
        </motion.div>
      </div>
    </section>
  )
}
