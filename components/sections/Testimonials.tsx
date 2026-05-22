'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

// TODO: confirmar consentimiento por escrito de Gema Quesada, Yocer y Mónica Vargas
// antes de pasar el sitio a producción. Ley 8968 (CR).
const testimonials = [
  {
    initials: 'GQ',
    name: 'Gema Quesada',
    context: '',
    quote:
      'El servicio que brindan es de buena calidad. Siempre están atentos, dan seguimiento constante y se toman el tiempo de aclarar dudas. Valoro que informan con anticipación sobre cambios o actualizaciones que deba conocer.',
  },
  {
    initials: 'Y',
    name: 'Yocer',
    context: '',
    quote:
      'Mi experiencia ha sido positiva, especialmente por la rapidez en la atención, la claridad durante el proceso de inversión y el seguimiento que he recibido por parte de la asesoría. Valoro mucho el trato personalizado y la disposición para resolver dudas. Agradezco la transparencia y el profesionalismo que han demostrado.',
  },
  {
    initials: 'MV',
    name: 'Mónica Vargas',
    context: '',
    quote:
      'Siempre he recibido un trato amable y profesional por parte de ustedes, con buen seguimiento y claridad en la información.',
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
                  {context && <div className="testimonial-context">{context}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
