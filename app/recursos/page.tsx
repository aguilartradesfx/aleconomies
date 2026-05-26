import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, FileText } from 'lucide-react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import {
  leadMagnets,
  STAGE_LABEL,
  BADGE_LABEL,
  type LeadMagnetStage,
} from '@/lib/lead-magnets'

export const metadata: Metadata = {
  title: 'Recursos gratuitos',
  description:
    'Guías educativas gratuitas sobre finanzas en Costa Rica. PDFs descargables sobre ahorro, inversión, riesgo, monedas y más.',
  alternates: { canonical: '/recursos' },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: 'https://aleconomies.com/recursos',
    siteName: 'Alejandro Araya — Aleconomies',
    title: 'Recursos gratuitos — Aleconomies',
    description:
      'Guías educativas gratuitas sobre finanzas en Costa Rica. Sin jerga, sin productos preempaquetados.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const STAGE_ORDER: LeadMagnetStage[] = ['despertar', 'educar', 'convertir']

// Anchor para que los cards de la home naveguen a un bloque del índice.
// 'arrancar' aterriza en despertar (primer grupo), 'decidir' aterriza en convertir.
const STAGE_ANCHOR: Partial<Record<LeadMagnetStage, string>> = {
  despertar: 'arrancar',
  convertir: 'decidir',
}

export default function RecursosPage() {
  // Agrupamos por etapa pero mantenemos el orden de declaración dentro
  // de cada grupo (el array de `leadMagnets` ya está en el orden ideal).
  const byStage = STAGE_ORDER.map(stage => ({
    stage,
    items: leadMagnets.filter(m => m.stage === stage),
  }))

  return (
    <>
      <Nav />
      <main>
        <section className="recursos-hero">
          <div className="container">
            <SectionEyebrow>Recursos gratuitos</SectionEyebrow>
            <h1 className="recursos-hero-title">
              Guías educativas sobre <em className="em-muted">finanzas en CR.</em>
            </h1>
            <p className="recursos-hero-sub">
              Once piezas cortas, en lenguaje tico, sin jerga ni productos
              preempaquetados. Descargá la que te interese, leela en 10 minutos,
              aplicá lo que tenga sentido para vos.
            </p>
          </div>
        </section>

        <section className="recursos-list">
          <div className="container">
            {byStage.map(group => (
              <div
                key={group.stage}
                id={STAGE_ANCHOR[group.stage] ?? undefined}
                className="recursos-group"
              >
                <h2 className="recursos-group-title">
                  <span className="recursos-group-dot" aria-hidden="true" />
                  {STAGE_LABEL[group.stage]}
                </h2>

                <div className="recursos-grid">
                  {group.items.map(piece => (
                    <Link
                      key={piece.slug}
                      href={`/recursos/${piece.slug}`}
                      className="glass recurso-card"
                      aria-label={`Acceder a ${piece.title}`}
                    >
                      <div className="recurso-card-top">
                        <div className="recurso-card-icon" aria-hidden="true">
                          <FileText size={22} strokeWidth={1.5} />
                        </div>
                        <div className="recurso-card-stage">
                          {STAGE_LABEL[piece.stage]}
                        </div>
                      </div>

                      <h3 className="recurso-card-title">{piece.title}</h3>
                      <p className="recurso-card-desc">{piece.description}</p>

                      <div className="recurso-card-meta">
                        <span className="recurso-card-pages">
                          {piece.pages} {piece.pages === 1 ? 'página' : 'páginas'} · PDF
                        </span>
                        {piece.badges?.map(b => (
                          <span key={b} className={`recurso-badge recurso-badge-${b}`}>
                            {BADGE_LABEL[b]}
                          </span>
                        ))}
                      </div>

                      <div className="recurso-card-footer">
                        <span className="recurso-card-cta">
                          Acceder
                          <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
