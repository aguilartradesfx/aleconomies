import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SobreHero from '@/components/sections/sobre/SobreHero'
import SobreBio from '@/components/sections/sobre/SobreBio'
import SobreEquipo from '@/components/sections/sobre/SobreEquipo'
import SobreValores from '@/components/sections/sobre/SobreValores'
import SobreCTA from '@/components/sections/sobre/SobreCTA'
import { JsonLd, aboutPageSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description:
    'Conozca a Alejandro Araya y al equipo detrás de Aleconomies. Asesoría financiera independiente en Costa Rica con más de 1.250 clientes asesorados.',
  alternates: {
    canonical: '/sobre-nosotros',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: 'https://aleconomies.com/sobre-nosotros',
    siteName: 'Alejandro Araya — Aleconomies',
    title: 'Sobre nosotros — Aleconomies',
    description:
      'Asesoría financiera independiente en Costa Rica. La historia detrás de Aleconomies y el equipo que lo respalda.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Sobre nosotros — Aleconomies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre nosotros — Aleconomies',
    description: 'La historia detrás de Aleconomies y el equipo que lo respalda.',
    images: ['/opengraph-image'],
  },
}

export default function SobreNosotrosPage() {
  return (
    <>
      <JsonLd data={aboutPageSchema} />
      <Nav />
      <main>
        <SobreHero />
        <SobreBio />
        <SobreEquipo />
        <SobreValores />
        <SobreCTA />
      </main>
      <Footer />
    </>
  )
}
