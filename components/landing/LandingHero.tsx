'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

// Sparkline ascendente decorativa (misma estética que el Hero del home).
function Sparkline() {
  return (
    <svg viewBox="0 0 240 56" preserveAspectRatio="none" aria-hidden="true" style={{ width: '100%', height: 56 }}>
      <defs>
        <linearGradient id="lp-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d="M0,46 C60,42 80,34 120,24 S200,8 240,4 L240,56 L0,56 Z" fill="url(#lp-spark)" />
      <path
        d="M0,46 C60,42 80,34 120,24 S200,8 240,4"
        stroke="#A78BFA" strokeWidth={2.5} fill="none" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 5px rgba(139,92,246,0.6))', strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'drawLine 2s ease-out 0.5s both' }}
      />
    </svg>
  )
}

const incluye = ['Dónde está parado hoy', 'Sus metas, ordenadas', 'Su perfil de riesgo real', 'Sus primeros pasos']

export default function LandingHero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* ── Columna de copy ── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              <div className="badge glass-pill">
                <span className="badge-dot" aria-hidden="true" />
                Asesoría financiera 1 a 1 · Costa Rica
              </div>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              Su plata merece
              <br />
              un plan, no <em className="em-gradient">otro producto.</em>
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              Una estrategia hecha con usted — no la plantilla que el banco le vende a todos.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
            >
              <a href="/agendar" className="btn-primary">
                Agendar diagnóstico →
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              style={{ marginTop: 18, fontSize: 13, color: 'var(--text-3)', letterSpacing: 0.2 }}
            >
              Sin costo · Sin compromiso · Acompañamiento vitalicio
            </motion.p>
          </div>

          {/* ── Columna visual — tarjeta de diagnóstico ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          >
            <div className="glass-featured" style={{ padding: 28, borderRadius: 24 }}>
              <div className="card-label" style={{ marginBottom: 0 }}>
                <span className="card-label-dot" />
                Su diagnóstico, en 1 llamada
              </div>

              <Sparkline />

              <ul className="qualify-list" style={{ marginTop: 8 }}>
                {incluye.map((item, i) => (
                  <li key={i} className="qualify-item" style={{ fontSize: 15 }}>
                    <span className="qualify-icon qualify-icon-check" aria-hidden="true">
                      <Check size={11} strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <hr className="risk-divider" />

              <a href="/agendar" className="btn-glass" style={{ width: '100%', justifyContent: 'center' }}>
                Quiero mi diagnóstico →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
