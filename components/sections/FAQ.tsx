'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const faqs = [
  {
    q: '¿La asesoría es grupal o individual?',
    a: 'La asesoría es uno a uno y personalizada a tu situación financiera. No es un curso masivo.',
  },
  {
    q: '¿Cuánto cuesta la asesoría?',
    a: 'La asesoría tiene un costo de $97 USD, con acceso vitalicio a futuras consultas sin costos extra.',
  },
  {
    q: '¿Qué temas se ven en la asesoría?',
    a: 'Evaluamos tu situación financiera, te enseño a invertir según tu perfil, exploramos opciones nacionales e internacionales, y estructuramos un plan realista.',
  },
  {
    q: '¿Cuánto dura la asesoría?',
    a: 'Entre 1 y 2 horas, dependiendo de la profundidad que necesites.',
  },
  {
    q: '¿Necesito mucho dinero para empezar a invertir?',
    a: 'No. Existen opciones para iniciar con montos accesibles según tu presupuesto.',
  },
  {
    q: '¿En qué tipo de inversiones me asesoras?',
    a: 'En renta fija, renta variable (acciones y ETFs), bienes raíces, fondos de inversión, y más, siempre en mercados regulados.',
  },
  {
    q: '¿Mi dinero está seguro?',
    a: 'Toda inversión implica riesgos, pero trabajamos únicamente con plataformas y entidades reguladas y supervisadas internacionalmente.',
  },
  {
    q: '¿Dónde se deposita el dinero?',
    a: 'Directamente en plataformas de inversión reguladas y a tu nombre. No gestiono tu dinero; tú tienes el control total.',
  },
  {
    q: '¿Es necesario comprar un curso antes?',
    a: 'No. La asesoría incluye todo lo que necesitas para comenzar de forma clara y práctica.',
  },
  {
    q: '¿Puedo solicitar apoyo después de la asesoría?',
    a: 'Sí. Tienes acompañamiento vitalicio para futuras dudas o necesidades relacionadas a tu estrategia de inversión.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <motion.div
          style={{ maxWidth: 860, margin: '0 auto', marginBottom: 56 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Preguntas frecuentes</SectionEyebrow>
          <h2 className="section-title">
            Las dudas <em className="em-muted">reales.</em>
          </h2>
          <p className="section-sub">
            Lo que la gente me pregunta antes de agendar la primera llamada. Respuestas directas,
            sin rodeos.
          </p>
        </motion.div>

        <div className="faq-inner">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`faq-question-text ${isOpen ? 'faq-question-text-open' : ''}`}
                  >
                    {item.q}
                  </span>
                  <motion.span
                    className={`faq-toggle ${isOpen ? 'faq-toggle-open' : ''}`}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    aria-hidden="true"
                  >
                    <Plus size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="faq-answer">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
