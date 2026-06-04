'use client'

import { motion } from 'framer-motion'
import { bioAlejandro } from '@/data/bio-alejandro'

const ease = [0.16, 1, 0.3, 1] as const

// Stats reales provistas por el cliente (data/bio-alejandro.ts).
const stats = bioAlejandro.stats

export default function LandingProof() {
  return (
    <section style={{ padding: '24px 0 8px' }}>
      <div className="container">
        <motion.div
          className="glass lp-proof-grid"
          style={{
            display: 'grid',
            gap: 16,
            padding: '28px 32px',
            borderRadius: 22,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                borderRight:
                  i < stats.length - 1 ? '1px solid var(--border-soft)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  fontWeight: 500,
                  letterSpacing: '-1px',
                  color: 'var(--text)',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {s.valor}
              </div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 0.3,
                  color: 'var(--text-3)',
                }}
              >
                {s.etiqueta}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
