'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, BookOpen, Headphones, ExternalLink, X, Search } from 'lucide-react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import ResourceCard from '@/components/ui/ResourceCard'
import audiolibrosData from '@/data/audiolibros.json'
import type { Audiolibro } from '@/types/audiolibro'

const audiolibros = audiolibrosData as Audiolibro[]

const ease = [0.16, 1, 0.3, 1] as const

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

function AudiolibrosModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return audiolibros
    return audiolibros.filter(
      a =>
        a.titulo.toLowerCase().includes(q) ||
        a.autor.toLowerCase().includes(q) ||
        a.descripcion.toLowerCase().includes(q),
    )
  }, [query])

  // ESC closes + focus trap + lock body scroll
  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    searchRef.current?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previousActive?.focus?.()
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audiolibros-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease }}
        onClick={e => e.stopPropagation()}
        className="audiolibros-modal"
        style={{
          width: '100%', maxWidth: 720,
          maxHeight: '85vh',
          background: 'rgba(20,25,35,0.65)',
          backdropFilter: 'blur(50px) saturate(180%)',
          WebkitBackdropFilter: 'blur(50px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            padding: '20px 24px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
            background: 'rgba(20,25,35,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Headphones size={16} style={{ color: 'rgba(167,139,250,0.7)' }} strokeWidth={1.5} />
                <span id="audiolibros-title" style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>
                  Audiolibros recomendados
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4 }}>
                {audiolibros.length} audiolibros · Mi biblioteca personal en Audible
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Cerrar biblioteca"
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
          <div style={{ position: 'relative', marginTop: 14 }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por título o autor…"
              aria-label="Buscar audiolibros"
              style={{
                width: '100%', padding: '9px 14px 9px 34px',
                borderRadius: 10, border: '1px solid var(--border-soft)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text)', fontSize: 13, outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>
        </div>

        {/* List — flat index style */}
        <div
          role="list"
          style={{ overflowY: 'auto', flex: 1, padding: '0 8px' }}
        >
          {filtered.map((a, i) => {
            const isHover = hoveredId === a.id
            return (
              <motion.a
                key={a.id}
                role="listitem"
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escuchar ${a.titulo} en Audible (se abre en nueva pestaña)`}
                onClick={() =>
                  window.dataLayer?.push({
                    event: 'audiolibro_click',
                    audiolibro_id: a.id,
                    audiolibro_titulo: a.titulo,
                  })
                }
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.018, ease }}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="audiolibro-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr auto',
                  alignItems: 'baseline',
                  columnGap: 14,
                  padding: '11px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: isHover ? 'rgba(255,255,255,0.025)' : 'transparent',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                {/* Number — monospace, tabular */}
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: isHover ? 'var(--purple-light)' : 'var(--text-4)',
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'color 0.15s ease',
                    letterSpacing: '0.04em',
                  }}
                >
                  {String(a.id).padStart(2, '0')}
                </span>

                {/* Title · author + optional description on hover */}
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: 8,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: 14, fontWeight: 500, color: 'var(--text)',
                      lineHeight: 1.35,
                    }}>
                      {a.titulo}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-4)' }} aria-hidden="true">·</span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {a.autor}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isHover && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.18, ease }}
                        className="audiolibro-desc-desktop"
                        style={{
                          fontSize: 12, color: 'var(--text-4)', lineHeight: 1.5,
                          overflow: 'hidden',
                        }}
                      >
                        {a.descripcion}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Mobile: descripción truncada siempre visible (CSS la muestra) */}
                  <p className="audiolibro-desc-mobile">
                    {a.descripcion}
                  </p>
                </div>

                {/* Audible CTA — ghost */}
                <span
                  className="audiolibro-cta"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    color: isHover ? 'var(--purple-light)' : 'var(--text-4)',
                    fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.01em',
                    transition: 'color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Audible <ExternalLink size={11} strokeWidth={1.75} />
                </span>
              </motion.a>
            )
          })}

          {filtered.length === 0 && (
            <div
              style={{
                margin: '32px 8px 8px',
                padding: '32px 20px',
                borderRadius: 14,
                border: '1px dashed var(--border-soft)',
                background: 'rgba(255,255,255,0.015)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
                Sin resultados para “{query}”.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <style jsx global>{`
        .audiolibro-row:focus-visible {
          outline: 1px solid rgba(139,92,246,0.5);
          outline-offset: -1px;
          background: rgba(139,92,246,0.04);
        }
        .audiolibro-desc-mobile {
          display: none;
          font-size: 11px;
          color: var(--text-4);
          line-height: 1.45;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        @media (hover: none) {
          .audiolibro-desc-desktop { display: none !important; }
          .audiolibro-desc-mobile  { display: -webkit-box !important; }
        }
        @media (max-width: 640px) {
          .audiolibros-modal {
            max-width: 100% !important;
            max-height: 100vh !important;
            height: 100vh !important;
            border-radius: 0 !important;
          }
          .audiolibro-row {
            grid-template-columns: 28px 1fr !important;
            row-gap: 2px;
          }
          .audiolibro-row .audiolibro-cta {
            grid-column: 2 / 3;
            margin-top: 4px;
          }
        }
      `}</style>
    </motion.div>
  )
}

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
          <ResourceCard
            index={0}
            icon={FileText}
            eyebrow="Guía PDF"
            title="Los 5 errores que cometen los costarricenses al ahorrar"
            description="Guía práctica en PDF con los errores más frecuentes y cómo evitarlos. Sin jerga financiera, sin relleno."
            ctaLabel="Abrir"
            href="#"
          />
          <ResourceCard
            index={1}
            icon={BookOpen}
            eyebrow="Lecturas"
            title="Mi biblioteca financiera"
            description="Los libros, artículos y recursos que más han influido en mi forma de entender y gestionar el dinero."
            ctaLabel="Abrir"
            href="#"
          />
          <ResourceCard
            index={2}
            icon={Headphones}
            eyebrow="Biblioteca"
            title="Audiolibros recomendados"
            description={`Mi biblioteca personal en Audible — ${audiolibros.length} libros que me formaron y que recomiendo a mis clientes.`}
            ctaLabel="Abrir"
            onClick={openAudiolibros}
            ariaLabel="Abrir biblioteca de audiolibros"
          />
        </div>
      </div>

      <AnimatePresence>
        {showAudiolibros && <AudiolibrosModal onClose={() => setShowAudiolibros(false)} />}
      </AnimatePresence>
    </section>
  )
}
