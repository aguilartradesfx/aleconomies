'use client'

import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const ease = [0.16, 1, 0.3, 1] as const

const credentials = [
  '[Credencial 1]',
  '[Credencial 2]',
  '[X] años de experiencia',
  '[X] clientes activos',
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
            <div className="about-photo">
              <span className="about-photo-label">Foto de Alejandro</span>
            </div>

            <div className="about-stats-badge">
              <div className="about-stat">
                <span className="about-stat-value">[X]+</span>
                Clientes activos
              </div>
              <div className="about-stat">
                <span className="about-stat-value">[X]</span>
                Años de experiencia
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
              Salí de mis propias deudas hace [X] años. De ahí en adelante me obsesioné con
              entender cómo funciona el dinero — no para hacerme millonario rápido, sino para
              no volver a sentir esa angustia de no saber qué hacer con un sobre que llega del banco.
            </p>

            <p className="about-body">
              Estudié, me certifiqué en [credencial principal], y empecé a aplicar lo que aprendía
              primero conmigo, luego con mi familia, después con amigos. Cuando vi que el patrón se
              repetía — gente con ingresos buenos, sin un plan claro — supe que esto iba en serio.
            </p>

            <p className="about-body">
              Hoy mi trabajo es darle a otros la claridad que a mí me hubiera ahorrado años de dar
              vueltas. Sin paquetes enlatados, sin productos que me dejen comisión, sin promesas que
              no pueda sostener.
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
