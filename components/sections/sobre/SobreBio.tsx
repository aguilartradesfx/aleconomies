'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import { bioAlejandro } from '@/data/bio-alejandro'

const ease = [0.16, 1, 0.3, 1] as const

export default function SobreBio() {
  return (
    <section className="sobre-bio">
      <div className="container">
        <div className="about-grid">
          {/* Foto + stats */}
          <motion.div
            className="about-photo-wrap"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="about-photo" style={{ position: 'relative' }}>
              <Image
                src={bioAlejandro.fotoUrl}
                alt={bioAlejandro.fotoAlt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            <div className="about-stats-badge">
              {bioAlejandro.stats.map(stat => (
                <div key={stat.etiqueta} className="about-stat">
                  <span className="about-stat-value">{stat.valor}</span>
                  {stat.etiqueta}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Texto + credentials */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            <SectionEyebrow>Fundador y asesor principal</SectionEyebrow>
            <h2 className="section-title" style={{ marginBottom: 32 }}>
              Alejandro <em className="em-muted">Araya.</em>
            </h2>

            {bioAlejandro.parrafos.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? 'about-body about-body-first' : 'about-body'}
              >
                {p}
              </p>
            ))}

            <div className="credentials-row">
              {bioAlejandro.credenciales.map(c => (
                <span key={c} className="credential-pill">{c}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
