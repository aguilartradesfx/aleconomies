'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

type Props = {
  title: React.ReactNode
  sub?: string
}

// Banda de CTA reutilizable para repetir el cierre a lo largo de la landing.
export default function LandingCTABand({ title, sub }: Props) {
  return (
    <section style={{ padding: '32px 0' }}>
      <div className="container">
        <motion.div
          className="glass-featured"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            padding: '36px 40px',
            borderRadius: 24,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <div style={{ maxWidth: 560 }}>
            <h3
              style={{
                fontSize: 'clamp(22px, 3vw, 28px)',
                fontWeight: 500,
                letterSpacing: '-0.8px',
                color: 'var(--text)',
                lineHeight: 1.15,
                marginBottom: sub ? 8 : 0,
              }}
            >
              {title}
            </h3>
            {sub && (
              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.55 }}>
                {sub}
              </p>
            )}
          </div>
          <a href="/agendar" className="btn-primary">
            Agendar diagnóstico →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
