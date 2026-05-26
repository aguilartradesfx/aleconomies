import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import LeadMagnetForm from '@/components/sections/LeadMagnetForm'
import {
  leadMagnets,
  getLeadMagnetBySlug,
  STAGE_LABEL,
  BADGE_LABEL,
} from '@/lib/lead-magnets'

interface Params {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return leadMagnets.map(m => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const piece = getLeadMagnetBySlug(slug)
  if (!piece) return {}
  const url = `https://aleconomies.com/recursos/${piece.slug}`
  return {
    title: piece.title,
    description: piece.description,
    alternates: { canonical: `/recursos/${piece.slug}` },
    openGraph: {
      type: 'article',
      locale: 'es_CR',
      url,
      siteName: 'Alejandro Araya — Aleconomies',
      title: piece.title,
      description: piece.description,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  }
}

export default async function LeadMagnetPage({ params }: Params) {
  const { slug } = await params
  const piece = getLeadMagnetBySlug(slug)
  if (!piece) notFound()

  return (
    <>
      <Nav />
      <main>
        <section className="recurso-detail">
          <div className="container">
            <Link href="/recursos" className="recurso-detail-back">
              <ArrowLeft size={14} strokeWidth={1.75} />
              Volver a recursos
            </Link>

            <div className="recurso-detail-grid">
              <div>
                <div className="recurso-detail-meta">
                  <span className="recurso-card-stage">{STAGE_LABEL[piece.stage]}</span>
                  <span className="recurso-card-pages">
                    {piece.pages} {piece.pages === 1 ? 'página' : 'páginas'} · PDF
                  </span>
                  {piece.badges?.map(b => (
                    <span key={b} className={`recurso-badge recurso-badge-${b}`}>
                      {BADGE_LABEL[b]}
                    </span>
                  ))}
                </div>

                <h1 className="recurso-detail-title">{piece.title}</h1>
                <p className="recurso-detail-desc">{piece.description}</p>

                <div className="lm-cover" aria-hidden="true">
                  <div className="lm-cover-top">
                    <span className="lm-cover-stage">{STAGE_LABEL[piece.stage]}</span>
                    <span className="lm-cover-brand">ALECONOMIES</span>
                  </div>
                  <div className="lm-cover-middle">
                    <h2 className="lm-cover-title">{piece.title}</h2>
                  </div>
                  <div className="lm-cover-bottom">
                    <div className="lm-cover-divider" />
                    <div className="lm-cover-meta">
                      <span>{piece.pages} páginas · PDF</span>
                      <span className="lm-cover-number">
                        Guía Nº {(piece.htmlPath.match(/pieza-(\d+)/)?.[1] ?? '00').padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <LeadMagnetForm slug={piece.slug} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
