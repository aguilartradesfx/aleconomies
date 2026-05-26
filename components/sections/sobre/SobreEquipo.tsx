'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Linkedin, UserRound } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import { equipo } from '@/data/equipo'

const ease = [0.16, 1, 0.3, 1] as const

export default function SobreEquipo() {
  return (
    <section className="sobre-equipo">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          style={{ maxWidth: 720, marginBottom: 56 }}
        >
          <SectionEyebrow>El equipo</SectionEyebrow>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            No trabajo <em className="em-gradient">solo.</em>
          </h2>
          <p className="sobre-equipo-sub">
            Detrás de cada asesoría hay un equipo comprometido con su bienestar financiero.
          </p>
        </motion.div>

        <div className="equipo-grid">
          {equipo.map((miembro, i) => (
            <motion.article
              key={miembro.id}
              className="equipo-card glass"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
            >
              <div className="equipo-photo">
                {miembro.fotoUrl ? (
                  <Image
                    src={miembro.fotoUrl}
                    alt={miembro.nombre}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  <div className="equipo-photo-placeholder" aria-hidden="true">
                    <UserRound size={48} strokeWidth={1.2} />
                    <span className="equipo-photo-placeholder-label">
                      Foto pendiente
                    </span>
                  </div>
                )}
              </div>

              <div className="equipo-body">
                <h3 className="equipo-nombre">{miembro.nombre}</h3>
                <p className="equipo-rol">
                  {miembro.rol}
                  {miembro.rolLink && (
                    <>
                      {' — '}
                      <a
                        href={miembro.rolLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="equipo-rol-link"
                      >
                        {miembro.rolLink.label}
                      </a>
                    </>
                  )}
                </p>
                {miembro.bio && <p className="equipo-bio">{miembro.bio}</p>}

                {miembro.linkedin && (
                  <a
                    href={miembro.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="equipo-linkedin"
                    aria-label={`LinkedIn de ${miembro.nombre}`}
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
