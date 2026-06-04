import type { Metadata } from 'next'
import LandingNav from '@/components/landing/LandingNav'
import LandingHero from '@/components/landing/LandingHero'
import LandingProof from '@/components/landing/LandingProof'
import LandingPain from '@/components/landing/LandingPain'
import LandingMethod from '@/components/landing/LandingMethod'
import LandingProcess from '@/components/landing/LandingProcess'
import LandingCTABand from '@/components/landing/LandingCTABand'
import LandingFooter from '@/components/landing/LandingFooter'
import BankVsInvest from '@/components/sections/BankVsInvestLazy'
import QualifyCards from '@/components/sections/QualifyCards'
import About from '@/components/sections/About'
import FAQ from '@/components/sections/FAQ'
import CTA from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Asesoría financiera 1 a 1 — Agende su diagnóstico sin costo',
  description:
    'Asesoría financiera personalizada en Costa Rica. Un plan construido con usted, en mercados regulados y con su dinero a su nombre. Agende su diagnóstico inicial sin costo.',
  alternates: {
    canonical: '/asesoria',
  },
  // Landing de campaña para tráfico pagado: noindex para no competir con la home.
  robots: {
    index: false,
    follow: true,
  },
}

export default function AsesoriaPage() {
  return (
    <>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingProof />
        <LandingPain />
        <BankVsInvest />
        <LandingMethod />
        <LandingCTABand
          title="Su dinero ya está esperando un plan."
          sub="Agende un diagnóstico sin costo y salga con claridad sobre sus próximos pasos — sin compromiso."
        />
        <LandingProcess />
        <QualifyCards />
        <About />
        <FAQ />
        <CTA />
      </main>
      <LandingFooter />
    </>
  )
}
