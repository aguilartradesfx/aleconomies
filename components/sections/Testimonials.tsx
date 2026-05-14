'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const testimonials = [
  {
    initials: 'MR',
    name: 'María R.',
    context: 'Empresaria · San José',
    quote:
      '[Testimonio de María R. pendiente — debe enfocarse en la claridad y estructura que Alejandro aportó, no en rendimientos específicos. Texto sujeto a consentimiento explícito de la cliente.]',
  },
  {
    initials: 'JC',
    name: 'Juan C.',
    context: 'Ingeniero · Heredia',
    quote:
      '[Testimonio de Juan C. pendiente — debe enfocarse en la experiencia del proceso, la transparencia y la paz mental obtenida. Texto sujeto a consentimiento explícito del cliente.]',
  },
  {
    initials: 'LM',
    name: 'Laura M.',
    context: 'Médica · Alajuela',
    quote:
      '[Testimonio de Laura M. pendiente — debe enfocarse en cómo el plan se adaptó a su situación específica y lo que cambió en su relación con el dinero. Texto sujeto a consentimiento.]',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="testimonials-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Lo que dicen mis clientes</SectionEyebrow>
          <h2 className="section-title">
            No tiene que <em className="em-muted">creerme a mí.</em>
          </h2>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map(({ initials, name, context, quote }, i) => (
            <motion.div
              key={name}
              className="glass testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
            >
              <div className="testimonial-quote-mark" aria-hidden="true">&ldquo;</div>
              <p className="testimonial-text">{quote}</p>
              <hr className="testimonial-sep" />
              <div className="testimonial-footer">
                <div className="testimonial-avatar" aria-hidden="true">
                  {initials}
                  <span className="testimonial-avatar-dot" />
                </div>
                <div>
                  <div className="testimonial-name">{name}</div>
                  <div className="testimonial-context">{context}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
