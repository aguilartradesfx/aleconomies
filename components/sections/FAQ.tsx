'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const faqs = [
  {
    q: '¿Cómo cobra usted?',
    a: '[Explicar modelo de cobro: fee fijo / porcentaje sobre patrimonio / mixto. Confirmar con Alejandro antes del deploy.]',
  },
  {
    q: '¿Cuánto dinero necesito para empezar?',
    a: 'El mínimo recomendado es destinar al menos ₡25.000 mensuales a su estrategia. Si está por debajo, primero trabajamos la base de ahorro antes de pensar en inversión.',
  },
  {
    q: '¿Puedo salirme si no me convence?',
    a: '[Confirmar con Alejandro: ¿hay tiempo mínimo de compromiso? Incluir aquí la respuesta honesta.]',
  },
  {
    q: '¿Está usted regulado o registrado ante alguna entidad?',
    a: '[CRÍTICO: confirmar con Alejandro su situación regulatoria ante SUGEVAL u organismo equivalente antes del deploy.]',
  },
  {
    q: '¿En qué tipo de instrumentos invierte?',
    a: '[Confirmar lista de instrumentos con Alejandro: fondos de inversión, ETFs internacionales, bonos, certificados, bienes raíces, etc.]',
  },
  {
    q: '¿Atiende clientes fuera de Costa Rica?',
    a: '[Confirmar con Alejandro: ticos en el exterior, extranjeros en CR, modalidad remoto/presencial.]',
  },
  {
    q: '¿Por qué no enseña trading o inversión rápida?',
    a: 'Porque no creo en eso. La construcción de patrimonio real toma tiempo, disciplina y una estrategia que se mantenga aún cuando el mercado se mueva. Si busca atajos, hay otros lugares — pero no son sostenibles.',
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
