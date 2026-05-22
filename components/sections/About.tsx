'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const credentials = [
  'Especialidad en Finanzas — TEC',
  'Profesor — TEC',
  'Ejecutivo senior',
  '6 años de experiencia',
  '+1.250 clientes asesorados',
]

export default function About() {
  return (
    <section id="sobre" className="about-section">
      <div className="container">
        <div className="about-grid">
          {/* Photo */}
          <motion.div
            className="about-photo-wrap"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="about-photo" style={{ position: 'relative' }}>
              <Image
                src="https://res.cloudinary.com/dm4vljcnv/image/upload/q_auto/f_auto/v1778741064/_A735535_uk3ait.jpg"
                alt="Alejandro Aguilar"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            <div className="about-stats-badge">
              <div className="about-stat">
                <span className="about-stat-value">157</span>
                Clientes activos
              </div>
              <div className="about-stat">
                <span className="about-stat-value">+1.250</span>
                Clientes asesorados
              </div>
              <div className="about-stat">
                <span className="about-stat-value">6</span>
                Años de experiencia
              </div>
              <div className="about-stat">
                <span className="about-stat-value">$2M</span>
                Activos bajo gestión
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            <SectionEyebrow>Sobre mí</SectionEyebrow>
            <h2 className="section-title" style={{ marginBottom: 32 }}>
              Yo no nací <em className="em-muted">sabiendo de finanzas.</em>
            </h2>

            <p className="about-body about-body-first">
              Nací en una familia donde la educación financiera no estuvo presente. A pesar de
              estudiar en una buena universidad y cursar una carrera en finanzas, no sabía
              administrarme personalmente. Esto me llevó a vivir más allá de mis capacidades y,
              en cuestión de unos cuantos años, caer en punto de quiebra con una deuda superior
              a los $50.000 a los 21 años.
            </p>

            <p className="about-body">
              Después de 3 años de trabajar mucho en mi persona y priorizar el desarrollo personal
              para levantarme de ese abismo, logré salir de la situación. Sin dejar de lado la
              ayuda de Dios.
            </p>

            <p className="about-body">
              Hoy enseño con el ejemplo cómo usted puede recuperarse de una situación similar y
              cómo, por medio de las distintas opciones de inversión, puede llegar a multiplicar
              su dinero con el debido tiempo y paciencia.
            </p>

            <p className="about-body">
              No soy un asesor que solo le quiere colocar un producto por colocarlo. Creo
              fielmente en el poder del acompañamiento personalizado. A partir del conocimiento
              de sus objetivos y plazos, construyo un plan estratégico que impulsa a las personas
              hacia rendimientos competitivos, superiores a los que el sistema bancario nacional
              ofrece.
            </p>

            <div className="credentials-row">
              {credentials.map(c => (
                <span key={c} className="credential-pill">{c}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
