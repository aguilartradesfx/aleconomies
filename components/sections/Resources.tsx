'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileDown, BookMarked, PenLine, Headphones, ExternalLink, X, Search } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import audiolibros from '@/data/audiolibros.json'

const ease = [0.16, 1, 0.3, 1] as const

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

function AudiolibrosModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return audiolibros
    return audiolibros.filter(
      a =>
        a.titulo.toLowerCase().includes(q) ||
        a.autor.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(10,12,18,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 680,
          maxHeight: '85vh',
          background: 'rgba(20,25,35,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <Headphones size={16} style={{ color: 'var(--purple-light)' }} strokeWidth={1.5} />
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Audiolibros recomendados</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{audiolibros.length} audiolibros · Mi biblioteca personal en Audible</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: 8,
              border: '1px solid var(--border-soft)',
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-3)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por título o autor…"
              style={{
                width: '100%', padding: '9px 14px 9px 34px',
                borderRadius: 10, border: '1px solid var(--border-soft)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text)', fontSize: 13, outline: 'none',
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 24px 20px' }}>
          {filtered.map(a => (
            <div
              key={a.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: 6,
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--purple-light)',
              }}>
                {a.id}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: a.titulo === '[pendiente]' ? 'var(--text-4)' : 'var(--text)', fontStyle: a.titulo === '[pendiente]' ? 'italic' : 'normal' }}>
                  {a.titulo === '[pendiente]' ? `Audiolibro #${a.id}` : a.titulo}
                </div>
                {a.autor !== '[pendiente]' && (
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{a.autor}</div>
                )}
              </div>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => window.dataLayer?.push({ event: 'audiolibro_click', audiolibro_id: a.id })}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 8,
                  border: '1px solid var(--border-soft)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-3)', fontSize: 11,
                  textDecoration: 'none', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Audible <ExternalLink size={10} />
              </a>
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-4)', textAlign: 'center', padding: '32px 0' }}>
              No se encontraron resultados.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

const resources = [
  {
    Icon: FileDown,
    tag: 'Guía descargable',
    title: 'Los 5 errores que cometen los costarricenses al ahorrar',
    desc: 'Guía práctica en PDF con los errores más frecuentes y cómo evitarlos. Sin jerga financiera, sin relleno.',
    linkText: 'Descargar PDF',
    href: '#',
  },
  {
    Icon: BookMarked,
    tag: 'Lecturas recomendadas',
    title: 'Mi biblioteca financiera',
    desc: 'Los libros, artículos y recursos que más han influido en mi forma de entender y gestionar el dinero.',
    linkText: 'Ver la lista',
    href: '#',
  },
  {
    Icon: PenLine,
    tag: 'Blog',
    title: 'Notas semanales',
    desc: 'Reflexiones cortas sobre finanzas personales, mercados y decisiones que afectan a los costarricenses.',
    linkText: 'Leer el blog',
    href: '#',
  },
]

export default function Resources() {
  const [showAudiolibros, setShowAudiolibros] = useState(false)

  function openAudiolibros() {
    window.dataLayer?.push({ event: 'resource_open', resource: 'audiolibros' })
    setShowAudiolibros(true)
  }

  return (
    <section id="recursos" className="resources-section">
      <div className="container">
        <motion.div
          className="widget-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionEyebrow>Aprenda gratis</SectionEyebrow>
          <h2 className="section-title">
            Recursos para empezar <em className="em-muted">desde ya.</em>
          </h2>
          <p className="section-sub">
            No tiene que ser cliente mío para aprender a manejar mejor su plata. Acá comparto
            lo que voy estudiando y aplicando.
          </p>
        </motion.div>

        <div className="resources-grid">
          {resources.map(({ Icon, tag, title, desc, linkText, href }, i) => (
            <motion.div
              key={title}
              className="glass resource-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            >
              <div className="resource-tag">
                <span className="card-label-dot" />
                <Icon size={12} strokeWidth={1.5} style={{ opacity: 0.7 }} />
                {tag}
              </div>
              <h3 className="resource-title">{title}</h3>
              <p className="resource-desc">{desc}</p>
              <a href={href} className="resource-link">
                {linkText} →
              </a>
            </motion.div>
          ))}

          {/* Audiolibros card */}
          <motion.div
            className="glass resource-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: resources.length * 0.08, ease }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          >
            <div className="resource-tag">
              <span className="card-label-dot" />
              <Headphones size={12} strokeWidth={1.5} style={{ opacity: 0.7 }} />
              Audiolibros recomendados
            </div>
            <h3 className="resource-title">Mi biblioteca personal en Audible</h3>
            <p className="resource-desc">
              Los libros que me formaron y que recomiendo a mis clientes. {audiolibros.length} audiolibros seleccionados.
            </p>
            <button
              onClick={openAudiolibros}
              className="resource-link"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
            >
              Ver biblioteca completa →
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAudiolibros && <AudiolibrosModal onClose={() => setShowAudiolibros(false)} />}
      </AnimatePresence>
    </section>
  )
}
